import Link from "next/link";
import type { Udhetim } from "@/lib/udhetimet";

export function KartaUdhetimi({ udhetim }: { udhetim: Udhetim }) {
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
      <Link className="action" href={`/udhetimi/${udhetim.id}`}>
        Shiko detajet <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
