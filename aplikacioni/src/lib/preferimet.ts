import "server-only";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { getSql } from "./db";

export async function perdoruesiAktual() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id || !/^\d+$/.test(id)) return null;
  return { id, emri: session.user.name ?? "Student" };
}

export async function lexoPreferimet() {
  const user = await perdoruesiAktual();
  if (!user) return null;

  const sql = getSql();
  const rows = await sql`
    SELECT udhetim_id
    FROM preferimet
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
  `;

  return {
    favoriteTripIds: rows.map((row) => String(row.udhetim_id)),
    count: rows.length,
  };
}

export async function ruajPreferim(udhetimId: string) {
  const user = await perdoruesiAktual();
  if (!user) return { status: 401 as const };

  const sql = getSql();
  const tripRows = await sql`SELECT id FROM udhetimet WHERE id = ${udhetimId}`;
  if (tripRows.length === 0) return { status: 404 as const };

  await sql`
    INSERT INTO profilet (github_id, emri)
    VALUES (${user.id}, ${user.emri})
    ON CONFLICT (github_id) DO NOTHING
  `;

  const inserted = await sql`
    INSERT INTO preferimet (user_id, udhetim_id)
    VALUES (${user.id}, ${udhetimId})
    ON CONFLICT (user_id, udhetim_id) DO NOTHING
    RETURNING id
  `;
  const countRows = await sql`
    SELECT COUNT(*)::int AS count
    FROM preferimet
    WHERE user_id = ${user.id}
  `;

  return {
    status: 200 as const,
    saved: true,
    created: inserted.length === 1,
    count: Number(countRows[0]?.count ?? 0),
  };
}
