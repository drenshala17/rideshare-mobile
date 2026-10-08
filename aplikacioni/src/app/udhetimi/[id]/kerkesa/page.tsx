import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejUdhetimin } from "@/lib/udhetimet";

export const dynamic = "force-dynamic";

export default async function Kerkesa({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let udhetim;

  try {
    udhetim = await gjejUdhetimin(id);
  } catch {
    return (
      <main className="detail-page">
        <div className="detail-shell" role="alert">
          <span className="status-badge unavailable">Lidhja dështoi</span>
          <h1>Nuk u lidhëm me databazën</h1>
          <p className="request-copy">Provo përsëri ose kthehu te lista.</p>
          <Link className="primary-button" href="/">
            Kthehu te lista <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>
    );
  }

  if (!udhetim) notFound();

  return (
    <main className="request-page">
      <div className="detail-shell">
        <Link href={`/udhetimi/${udhetim.id}`} className="back-link">
          <span aria-hidden="true">←</span> Kthehu te detajet
        </Link>
        <span className="status-badge pending">Kërkesë demonstruese</span>
        <h1>Simulim: Në pritje</h1>
        <p className="request-copy">
          Kërkesa për <strong>{udhetim.nisja} → {udhetim.destinacioni}</strong> është duke u trajtuar.
        </p>
        <div className="notice">
          <span className="notice-icon" aria-hidden="true">✓</span>
          <p>Ky është vetëm një simulim. Asnjë kërkesë nuk ruhet apo dërgohet te shoferi.</p>
        </div>
      </div>
    </main>
  );
}
