"use client";

import { useEffect, useState } from "react";
import type { Udhetim } from "@/lib/udhetimet";
import { KartaUdhetimi } from "./KartaUdhetimi";
import styles from "@/app/page.module.css";

export default function ListaUdhetimesh({ udhetimet }: { udhetimet: Udhetim[] }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    let active = true;
    void fetch("/api/preferimet", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as { favoriteTripIds: string[]; count: number };
      })
      .then((data) => {
        if (active && data) {
          setFavoriteIds(data.favoriteTripIds);
          setFavoriteCount(data.count);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <p className={styles.favoriteTotal} aria-live="polite">
        Të preferuara të miat: <strong>{favoriteCount}</strong>
      </p>
      <section className={styles.list}>
        {udhetimet.map((udhetim) => (
          <KartaUdhetimi
            key={udhetim.id}
            udhetim={udhetim}
            isFavorite={favoriteIds.includes(udhetim.id)}
            onOptimisticSave={() => setFavoriteCount((count) => count + 1)}
            onSaveConfirmed={() => setFavoriteIds((ids) => [...ids, udhetim.id])}
            onSaveFailed={() => setFavoriteCount((count) => Math.max(0, count - 1))}
          />
        ))}
      </section>
    </>
  );
}
