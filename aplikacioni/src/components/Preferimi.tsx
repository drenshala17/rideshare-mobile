"use client";

import { useState } from "react";
import styles from "@/app/page.module.css";

type Props = {
  udhetimId: string;
  isFavorite: boolean;
  onOptimisticSave: () => void;
  onSaveConfirmed: () => void;
  onSaveFailed: () => void;
};

export default function Preferimi({
  udhetimId,
  isFavorite,
  onOptimisticSave,
  onSaveConfirmed,
  onSaveFailed,
}: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function ruaj() {
    if (pending || isFavorite) return;
    setPending(true);
    setError(null);
    setSuccess(false);
    onOptimisticSave();

    try {
      const response = await fetch("/api/preferimet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ udhetimId }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error === "Duhet të hysh me GitHub."
          ? data.error
          : "Nuk u ruajt. Provo përsëri.");
      }
      await response.json();
      onSaveConfirmed();
      setSuccess(true);
    } catch (reason) {
      onSaveFailed();
      setError(reason instanceof Error ? reason.message : "Nuk u ruajt. Provo përsëri.");
    } finally {
      setPending(false);
    }
  }

  const saved = isFavorite || success;
  return (
    <div className={styles.favoriteArea}>
      <button
        type="button"
        className={styles.favoriteButton}
        onClick={ruaj}
        disabled={pending || saved}
        aria-label={saved ? "Udhëtimi është i ruajtur" : "Ruaj udhëtimin"}
      >
        <span className={styles.favoriteStar} aria-hidden="true">{pending || saved ? "★" : "☆"}</span>
        {pending ? "Po ruhet..." : saved ? "I ruajtur" : "Ruaj udhëtimin"}
      </button>
      {success && <p className={styles.favoriteMessage} role="status">U ruajt te të preferuarat</p>}
      {error && (
        <div className={styles.favoriteError} role="alert">
          <p>{error}</p>
          <button type="button" className={styles.retryButton} onClick={ruaj} disabled={pending}>
            Provo përsëri
          </button>
        </div>
      )}
    </div>
  );
}
