"use client";

import Link from "next/link";
import type { Udhetim } from "@/lib/udhetimet";
import Preferimi from "./Preferimi";

export function KartaUdhetimi({
  udhetim,
  isFavorite,
  onOptimisticSave,
  onSaveConfirmed,
  onSaveFailed,
}: {
  udhetim: Udhetim;
  isFavorite: boolean;
  onOptimisticSave: () => void;
  onSaveConfirmed: () => void;
  onSaveFailed: () => void;
}) {
  return (
    <article className="trip-card">
      <span className="trip-label">Udhëtim i planifikuar</span>
      <h2>
        {udhetim.nisja} – {udhetim.destinacioni}
      </h2>
      <p>
        <span>Ora {udhetim.ora}</span>
        <span className="trip-separator">·</span>
        <span>{udhetim.vende} vende të lira</span>
      </p>
      <Preferimi
        udhetimId={udhetim.id}
        isFavorite={isFavorite}
        onOptimisticSave={onOptimisticSave}
        onSaveConfirmed={onSaveConfirmed}
        onSaveFailed={onSaveFailed}
      />
      <Link className="action" href={`/udhetimi/${udhetim.id}`}>
        Shiko detajet <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
