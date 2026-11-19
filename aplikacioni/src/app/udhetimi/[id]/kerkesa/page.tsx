import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejUdhetimin } from "@/lib/udhetimet";
import { KerkesaUdhetar } from "@/components/KerkesaLive";

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

  if (udhetim.vende === 0) {
    return (
      <main className="detail-page">
        <div className="detail-shell">
          <Link href={`/udhetimi/${udhetim.id}`} className="back-link">
            <span aria-hidden="true">←</span> Kthehu te detajet
          </Link>
          <span className="status-badge unavailable">I plotë</span>
          <h1>Nuk ka vende të lira</h1>
          <p className="request-copy">
            Ky udhëtim nuk pranon kërkesa të reja për momentin.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="request-page">
      <div className="detail-shell">
        <Link href={`/udhetimi/${udhetim.id}`} className="back-link">
          <span aria-hidden="true">←</span> Kthehu te detajet
        </Link>
        <span className="status-badge pending">Kërkesë udhëtimi</span>
        <h1>{udhetim.nisja} → {udhetim.destinacioni}</h1>
        <p className="request-copy">
          Dërgo kërkesën te shoferi dhe prit përgjigjen pa rifreskuar faqen.
        </p>
        <KerkesaUdhetar udhetimId={udhetim.id} initialVende={udhetim.vende} />
      </div>
    </main>
  );
}
