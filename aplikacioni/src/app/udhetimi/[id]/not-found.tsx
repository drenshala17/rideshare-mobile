import Link from "next/link";

export default function UdhetimiNukUGjet() {
  return (
    <main className="detail-page">
      <div className="detail-shell">
        <span className="status-badge unavailable">404 · Nuk u gjet</span>
        <h1>Udhëtimi nuk u gjet</h1>
        <p className="request-copy">
          Kjo adresë nuk përputhet me një udhëtim në listë.
        </p>
        <Link className="primary-button" href="/">
          Kthehu te lista <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
