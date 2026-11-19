"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Kerkese } from "@/lib/kerkesat";

type KerkesaResponse = {
  profil: { roli: "udhetar" | "shofer" };
  kerkesa: Kerkese[];
};

type TripRequestProps = {
  udhetimId: string;
  initialVende: number;
};

function mesazhGabimi(response: Response, fallback: string) {
  return response
    .json()
    .then((body: { error?: string }) => body.error ?? fallback)
    .catch(() => fallback);
}

export function KerkesaUdhetar({ udhetimId, initialVende }: TripRequestProps) {
  const [data, setData] = useState<KerkesaResponse | null>(null);
  const [vende, setVende] = useState(initialVende);
  const [poDergohet, setPoDergohet] = useState(false);
  const [gabim, setGabim] = useState("");
  const [poRilidhemi, setPoRilidhemi] = useState(false);
  const [online, setOnline] = useState(false);
  const inFlight = useRef(false);

  const lexoGjendjen = useCallback(async () => {
    if (inFlight.current || !navigator.onLine) return false;
    inFlight.current = true;
    try {
      const response = await fetch("/api/kerkesa", { cache: "no-store" });
      if (!response.ok) throw new Error(await mesazhGabimi(response, "Leximi dështoi."));
      const next = (await response.json()) as KerkesaResponse;
      const current = next.kerkesa.find((item) => item.udhetimId === udhetimId);
      setData(next);
      if (current) setVende(current.vende);
      setGabim("");
      setPoRilidhemi(false);
      return true;
    } catch (error) {
      setGabim(error instanceof Error ? error.message : "Leximi dështoi.");
      return false;
    } finally {
      inFlight.current = false;
    }
  }, [udhetimId]);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      if (active) void lexoGjendjen();
    };
    const onOffline = () => {
      setOnline(false);
      setPoRilidhemi(true);
    };
    const onOnline = () => {
      setOnline(true);
      setPoRilidhemi(true);
      refresh();
    };

    const onlineCheck = window.setTimeout(() => {
      setOnline(navigator.onLine);
      if (!navigator.onLine) setPoRilidhemi(true);
    }, 0);
    refresh();
    const timer = window.setInterval(refresh, 5000);
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      active = false;
      window.clearTimeout(onlineCheck);
      window.clearInterval(timer);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, [lexoGjendjen]);

  const kerkesa = data?.kerkesa.find((item) => item.udhetimId === udhetimId);

  async function dergoKerkesen() {
    if (!online || poDergohet) return;
    setPoDergohet(true);
    setGabim("");
    try {
      const response = await fetch("/api/kerkesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ udhetimId }),
      });
      if (!response.ok) throw new Error(await mesazhGabimi(response, "Kërkesa nuk u ruajt."));
      await lexoGjendjen();
    } catch (error) {
      setGabim(error instanceof Error ? error.message : "Kërkesa nuk u ruajt.");
    } finally {
      setPoDergohet(false);
    }
  }

  return (
    <section className="request-live" aria-live="polite">
      {poRilidhemi && <p className="connection-notice" role="status">Po rilidhemi</p>}
      {kerkesa ? (
        <>
          <span className={`status-badge ${kerkesa.status === "E pranuar" ? "available" : "pending"}`}>
            {kerkesa.status}
          </span>
          <p className="request-copy">
            Vende të lira: <strong>{vende}</strong>
          </p>
        </>
      ) : (
        <>
          <p className="request-copy">Vende të lira: <strong>{vende}</strong></p>
          <button
            type="button"
            className="primary-button"
            onClick={() => void dergoKerkesen()}
            disabled={poDergohet || poRilidhemi || !online || vende === 0}
          >
            {poDergohet ? "Po dërgohet..." : "Dërgo kërkesën"}
          </button>
        </>
      )}
      {gabim && <p className="request-error" role="alert">{gabim}</p>}
    </section>
  );
}

export function KerkesatShofer() {
  const [data, setData] = useState<KerkesaResponse | null>(null);
  const [poRilidhemi, setPoRilidhemi] = useState(false);
  const [gabim, setGabim] = useState("");
  const [dukePranuar, setDukePranuar] = useState<number | null>(null);
  const [online, setOnline] = useState(false);
  const inFlight = useRef(false);

  const lexoGjendjen = useCallback(async () => {
    if (inFlight.current || !navigator.onLine) return false;
    inFlight.current = true;
    try {
      const response = await fetch("/api/kerkesa", { cache: "no-store" });
      if (!response.ok) throw new Error(await mesazhGabimi(response, "Leximi dështoi."));
      setData((await response.json()) as KerkesaResponse);
      setGabim("");
      setPoRilidhemi(false);
      return true;
    } catch (error) {
      setGabim(error instanceof Error ? error.message : "Leximi dështoi.");
      return false;
    } finally {
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      if (active) void lexoGjendjen();
    };
    const onOffline = () => {
      setOnline(false);
      setPoRilidhemi(true);
    };
    const onOnline = () => {
      setOnline(true);
      setPoRilidhemi(true);
      refresh();
    };

    const onlineCheck = window.setTimeout(() => {
      setOnline(navigator.onLine);
      if (!navigator.onLine) setPoRilidhemi(true);
    }, 0);
    refresh();
    const timer = window.setInterval(refresh, 5000);
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      active = false;
      window.clearTimeout(onlineCheck);
      window.clearInterval(timer);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, [lexoGjendjen]);

  async function prano(id: number) {
    if (!online || dukePranuar !== null) return;
    setDukePranuar(id);
    setGabim("");
    try {
      const response = await fetch(`/api/kerkesa/${id}`, { method: "PATCH" });
      if (!response.ok) throw new Error(await mesazhGabimi(response, "Pranimi dështoi."));
      await lexoGjendjen();
    } catch (error) {
      setGabim(error instanceof Error ? error.message : "Pranimi dështoi.");
    } finally {
      setDukePranuar(null);
    }
  }

  return (
    <section className="driver-requests" aria-live="polite">
      {poRilidhemi && <p className="connection-notice" role="status">Po rilidhemi</p>}
      {data?.kerkesa.length ? (
        data.kerkesa.map((kerkesa) => (
          <article className="driver-request" key={kerkesa.id}>
            <div>
              <strong>{kerkesa.udhetarEmri}</strong>
              <p>{kerkesa.nisja} → {kerkesa.destinacioni}</p>
              <p>Statusi: <strong>{kerkesa.status}</strong> · Vende: {kerkesa.vende}</p>
            </div>
            {kerkesa.status === "Në pritje" && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => void prano(kerkesa.id)}
                disabled={dukePranuar !== null || poRilidhemi || !online || kerkesa.vende === 0}
              >
                {dukePranuar === kerkesa.id ? "Po pranohet..." : "Prano"}
              </button>
            )}
          </article>
        ))
      ) : (
        <p className="request-copy">Nuk ka kërkesa për udhëtimet e tua.</p>
      )}
      {gabim && <p className="request-error" role="alert">{gabim}</p>}
    </section>
  );
}
