import { KartaUdhetimi } from "@/components/KartaUdhetimi";
import { udhetimet } from "@/lib/udhetimet";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>RideShare</p>
        <h1>Udhëtime të mundshme për sot</h1>
      </section>

      <section className={styles.list}>
        {udhetimet.map((udhetim) => (
          <KartaUdhetimi key={udhetim.id} udhetim={udhetim} />
        ))}
      </section>
    </main>
  );
}
