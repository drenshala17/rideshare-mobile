"use client";

import { useState } from "react";

type GjendjaVendndodhjes = "idle" | "loading" | "success" | "error";

type VendtakimiProps = {
  label?: string;
};

export default function Vendtakimi({ label = "Vendtakimi" }: VendtakimiProps) {
  const [teksti, setTeksti] = useState("");
  const [vendtakimiKonfirmuar, setVendtakimiKonfirmuar] = useState("");
  const [gjendjaVendndodhjes, setGjendjaVendndodhjes] =
    useState<GjendjaVendndodhjes>("idle");
  const [mesazhiVendndodhjes, setMesazhiVendndodhjes] = useState("");
  const [saktesia, setSaktesia] = useState<number | null>(null);

  function konfirmoVendtakimin() {
    const tekstIPastruar = teksti.trim();

    if (!tekstIPastruar) {
      return;
    }

    setVendtakimiKonfirmuar(tekstIPastruar);
  }

  function perdorVendndodhjen() {
    if (!navigator.geolocation) {
      setGjendjaVendndodhjes("error");
      setMesazhiVendndodhjes(
        "Vendndodhja nuk mbështetet në këtë pajisje. Shkruaj vendtakimin vetë.",
      );
      setSaktesia(null);
      return;
    }

    setGjendjaVendndodhjes("loading");
    setMesazhiVendndodhjes("Po kërkojmë vendndodhjen...");
    setSaktesia(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGjendjaVendndodhjes("success");
        setMesazhiVendndodhjes("Pozicioni u mor");
        setSaktesia(position.coords.accuracy);
      },
      (error) => {
        setGjendjaVendndodhjes("error");
        setSaktesia(null);

        if (error.code === 1) {
          setMesazhiVendndodhjes(
            "Leja u refuzua. Shkruaj vendtakimin vetë.",
          );
        } else if (error.code === 2) {
          setMesazhiVendndodhjes(
            "Pozicioni nuk është i disponueshëm. Shkruaj vendtakimin vetë.",
          );
        } else if (error.code === 3) {
          setMesazhiVendndodhjes(
            "Koha e kërkimit përfundoi. Provo përsëri ose shkruaj vendtakimin vetë.",
          );
        } else {
          setMesazhiVendndodhjes(
            "Vendndodhja nuk mund të merret. Shkruaj vendtakimin vetë.",
          );
        }
      },
      { timeout: 10000 },
    );
  }

  return (
    <section className="meeting-point" aria-labelledby="meeting-point-title">
      <h2 id="meeting-point-title">{label}</h2>
      <label htmlFor="meeting-point-input">Shkruaj vendtakimin</label>
      <div className="meeting-point-row">
        <input
          id="meeting-point-input"
          data-testid="meeting-point-input"
          type="text"
          value={teksti}
          onChange={(event) => setTeksti(event.target.value)}
          placeholder="Shkruaj vendtakimin"
        />
        <button
          type="button"
          className="primary-button"
          data-testid="confirm-meeting-point"
          onClick={konfirmoVendtakimin}
        >
          Konfirmo në telefon
        </button>
      </div>

      <button
        type="button"
        className="secondary-button"
        data-testid="use-current-location"
        onClick={perdorVendndodhjen}
        disabled={gjendjaVendndodhjes === "loading"}
      >
        Përdor vendndodhjen time
      </button>

      <p className="meeting-point-status" aria-live="polite">
        {mesazhiVendndodhjes}
        {gjendjaVendndodhjes === "success" && saktesia !== null
          ? ` (Saktësia: ${saktesia} m)`
          : ""}
      </p>

      {vendtakimiKonfirmuar ? (
        <p data-testid="confirmed-meeting-point" className="confirmed-meeting-point">
          Vendtakimi i konfirmuar: {vendtakimiKonfirmuar}
        </p>
      ) : null}
    </section>
  );
}
