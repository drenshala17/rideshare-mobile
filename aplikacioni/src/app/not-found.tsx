import Link from "next/link";

export default function NotFound() {
  return (
    <main className="detail-page">
      <div className="detail-shell error-shell">
        <span className="status-badge unavailable">404 · Nuk u gjet</span>
        <h1>Udhëtimi nuk u gjet</h1>
        <p className="request-copy">Kjo faqe nuk ekziston ose nuk është e disponueshme.</p>
        <Link className="primary-button" href="/">
          Kthehu te lista <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
