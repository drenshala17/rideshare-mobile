import Link from "next/link";
import Vendtakimi from "@/components/Vendtakimi";

export default function Java08Test() {
  return (
    <main className="detail-page">
      <div className="detail-shell">
        <Link href="/" className="back-link">
          <span aria-hidden="true">←</span> Kthehu te udhëtimet
        </Link>
        <span className="status-badge pending">Testim lokal</span>
        <h1>Testimi i vendtakimit</h1>
        <p className="request-copy">
          Kjo faqe përdor të dhëna lokale dhe nuk kërkon hyrje apo lidhje me
          Neon. Përdor butonat për të provuar vendtakimin manual dhe
          vendndodhjen.
        </p>
        <Vendtakimi label="Vendtakimi i testimit" />
      </div>
    </main>
  );
}
