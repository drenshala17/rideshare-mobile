import "server-only";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { getSql } from "./db";

export const STATUS_KERKESE = {
  nePritje: "Në pritje",
  ePranuar: "E pranuar",
} as const;

export type StatusKerkese = (typeof STATUS_KERKESE)[keyof typeof STATUS_KERKESE];

export type Kerkese = {
  id: number;
  udhetimId: string;
  udhetarId: string;
  udhetarEmri: string;
  nisja: string;
  destinacioni: string;
  vende: number;
  status: StatusKerkese;
  createdAt: string;
  updatedAt: string;
};

type ProfilAktual = {
  id: string;
  emri: string;
  roli: "udhetar" | "shofer";
};

async function profiliAktual(): Promise<ProfilAktual | null> {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id || !/^\d+$/.test(id)) return null;

  const sql = getSql();
  await sql`
    INSERT INTO profilet (github_id, emri)
    VALUES (${id}, ${session.user.name ?? "Student"})
    ON CONFLICT (github_id) DO NOTHING
  `;

  const rows = await sql`
    SELECT github_id AS id, emri, roli
    FROM profilet
    WHERE github_id = ${id}
  `;
  return rows[0] as ProfilAktual | undefined ?? null;
}

function mapKerkese(row: Record<string, unknown>): Kerkese {
  return {
    id: Number(row.id),
    udhetimId: String(row.udhetim_id),
    udhetarId: String(row.udhetar_id),
    udhetarEmri: String(row.udhetar_emri),
    nisja: String(row.nisja),
    destinacioni: String(row.destinacioni),
    vende: Number(row.vende),
    status: row.status as StatusKerkese,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function lexoKerkesat(): Promise<{
  profil: ProfilAktual;
  kerkesa: Kerkese[];
} | null> {
  const profil = await profiliAktual();
  if (!profil) return null;

  const sql = getSql();
  const rows = profil.roli === "shofer"
    ? await sql`
        SELECT k.id, k.udhetim_id, k.udhetar_id, p.emri AS udhetar_emri,
               u.nisja, u.destinacioni, u.vende, k.status,
               k.created_at, k.updated_at
        FROM kerkesat k
        JOIN profilet p ON p.github_id = k.udhetar_id
        JOIN udhetimet u ON u.id = k.udhetim_id
        WHERE u.shofer_id = ${profil.id}
        ORDER BY k.created_at DESC
      `
    : await sql`
        SELECT k.id, k.udhetim_id, k.udhetar_id, p.emri AS udhetar_emri,
               u.nisja, u.destinacioni, u.vende, k.status,
               k.created_at, k.updated_at
        FROM kerkesat k
        JOIN profilet p ON p.github_id = k.udhetar_id
        JOIN udhetimet u ON u.id = k.udhetim_id
        WHERE k.udhetar_id = ${profil.id}
        ORDER BY k.created_at DESC
      `;

  return { profil, kerkesa: rows.map((row) => mapKerkese(row)) };
}

export async function gjejKerkesen(id: number): Promise<{
  profil: ProfilAktual;
  kerkesa: Kerkese | null;
} | null> {
  const profil = await profiliAktual();
  if (!profil) return null;

  const sql = getSql();
  const rows = await sql`
    SELECT k.id, k.udhetim_id, k.udhetar_id, p.emri AS udhetar_emri,
           u.nisja, u.destinacioni, u.vende, k.status,
           k.created_at, k.updated_at
    FROM kerkesat k
    JOIN profilet p ON p.github_id = k.udhetar_id
    JOIN udhetimet u ON u.id = k.udhetim_id
    WHERE k.id = ${id}
      AND (
        k.udhetar_id = ${profil.id}
        OR (${profil.roli === "shofer"} AND u.shofer_id = ${profil.id})
      )
  `;

  return { profil, kerkesa: rows[0] ? mapKerkese(rows[0]) : null };
}

export async function krijoKerkese(udhetimId: string) {
  const profil = await profiliAktual();
  if (!profil) return { status: 401 as const };
  if (profil.roli !== "udhetar") return { status: 403 as const };

  const sql = getSql();
  const rows = await sql`
    INSERT INTO kerkesat (udhetim_id, udhetar_id)
    SELECT u.id, ${profil.id}
    FROM udhetimet u
    WHERE u.id = ${udhetimId}
      AND u.vende > 0
    ON CONFLICT (udhetim_id, udhetar_id) DO NOTHING
    RETURNING id
  `;

  if (rows.length === 1) return { status: 201 as const, id: Number(rows[0].id) };

  const tripRows = await sql`
    SELECT id, vende FROM udhetimet WHERE id = ${udhetimId}
  `;
  if (tripRows.length === 0) return { status: 404 as const };
  if (Number(tripRows[0].vende) === 0) return { status: 409 as const };

  const existingRows = await sql`
    SELECT id FROM kerkesat
    WHERE udhetim_id = ${udhetimId} AND udhetar_id = ${profil.id}
  `;
  return existingRows.length === 1
    ? { status: 200 as const, id: Number(existingRows[0].id) }
    : { status: 409 as const };
}

export async function pranoKerkese(id: number) {
  const profil = await profiliAktual();
  if (!profil) return { status: 401 as const };
  if (profil.roli !== "shofer") return { status: 403 as const };

  const sql = getSql();
  const results = await sql.transaction([
    sql`
      WITH target AS (
        SELECT k.id, k.udhetim_id
        FROM kerkesat k
        JOIN udhetimet u ON u.id = k.udhetim_id
        WHERE k.id = ${id}
          AND k.status = ${STATUS_KERKESE.nePritje}
          AND u.shofer_id = ${profil.id}
          AND u.vende > 0
        FOR UPDATE OF k, u
      ),
      changed_trip AS (
        UPDATE udhetimet u
        SET vende = u.vende - 1
        FROM target
        WHERE u.id = target.udhetim_id
        RETURNING u.id
      )
      UPDATE kerkesat k
      SET status = ${STATUS_KERKESE.ePranuar}, updated_at = NOW()
      FROM target
      JOIN changed_trip ct ON ct.id = target.udhetim_id
      WHERE k.id = target.id
      RETURNING k.id
    `,
  ]);

  const acceptedRows = results[0];
  if (acceptedRows.length === 1) return { status: 200 as const };

  const current = await gjejKerkesen(id);
  if (!current || !current.kerkesa) return { status: 404 as const };
  if (current.kerkesa.status === STATUS_KERKESE.ePranuar) {
    return { status: 200 as const };
  }
  return { status: 409 as const };
}
