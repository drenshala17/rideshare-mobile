import Link from "next/link";
import ListaUdhetimesh from "@/components/ListaUdhetimesh";
import { lexoUdhetimet, type Udhetim } from "@/lib/udhetimet";
import styles from "./page.module.css";

// Lexo bazën përsëri në çdo kërkesë për këtë faqe.
export const dynamic = "force-dynamic";

export default async function Home() {
  let udhetimet: Udhetim[];
  try {
    udhetimet = await lexoUdhetimet();
  } catch {
    return (
      <main className={styles.page}>
        <section className={styles.emptyState} role="alert">
          <span className="status-badge unavailable">Lidhja dështoi</span>
          <h1>Nuk u lidhëm me databazën</h1>
          <p>Kontrollo konfigurimin dhe provo përsëri.</p>
          <Link className="primary-button" href="/">
            Provo përsëri <span aria-hidden="true">↻</span>
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>RideShare</p>
        <h1>Udhëtime të mundshme për sot</h1>
        <Link className="primary-button" href="/panel">Hyr / Paneli im</Link>
      </section>

      {udhetimet.length === 0 ? (
        <section className={styles.emptyState}>
          <span className="status-badge pending">Pa udhëtime</span>
          <h2>Nuk ka udhëtime për momentin.</h2>
          <p>Kontrollo përsëri më vonë.</p>
        </section>
      ) : (
        <ListaUdhetimesh udhetimet={udhetimet} />
      )}
    </main>
  );
}
