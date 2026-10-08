import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejUdhetimin } from "@/lib/udhetimet";

export const dynamic = "force-dynamic";

export default async function UdhëtimDetajet({
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

  if (!udhetim) {
    notFound();
  }

  const kaVende = udhetim.vende > 0;

  return (
    <main className="detail-page">
      <div className="detail-shell">
        <Link href="/" className="back-link">
          <span aria-hidden="true">←</span> Kthehu te udhëtimet
        </Link>

        <span className={kaVende ? "status-badge available" : "status-badge unavailable"}>
          {kaVende ? "Vende të lira" : "I plotë"}
        </span>
        <h1>
          {udhetim.nisja} – {udhetim.destinacioni}
        </h1>

        <div className="detail-info">
          <p><strong>Ora</strong><span>{udhetim.ora}</span></p>
          <p><strong>Vendtakimi</strong><span>{udhetim.vendtakimi}</span></p>
          <p><strong>Vende të lira</strong><span>{udhetim.vende}</span></p>
        </div>

        {kaVende ? (
          <Link href={`/udhetimi/${udhetim.id}/kerkesa`} className="primary-button">
            Kërko vend <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <button type="button" className="primary-button disabled" disabled>
            Nuk ka vende të lira
          </button>
        )}
      </div>
    </main>
  );
}
