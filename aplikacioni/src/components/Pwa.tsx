"use client";

import { useEffect } from "react";

export default function Pwa() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    let cancelled = false;

    async function registerServiceWorker() {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        await navigator.serviceWorker.ready;
        if (!cancelled) {
          await fetch("/api/udhetimet", { cache: "no-store" });
        }
        return registration;
      } catch (error) {
        console.error("Regjistrimi i PWA dështoi.", error);
      }
    }

    void registerServiceWorker();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <aside>
      <a href="/offline.html">Hap leximin offline</a>
      <p>Kopja publike mund të jetë e vjetër dhe nuk konfirmon rezervime.</p>
    </aside>
  );
}
