"use client";

import { useEffect } from "react";

interface Props {
  onClose: () => void;
  /** Bold title shown in the header */
  title: string;
  /** Smaller subtitle below the title */
  subtitle?: string;
  /** First letter shown in the avatar circle — defaults to title[0] */
  avatarLetter?: string;
  /** Tailwind max-width class, e.g. "max-w-xl" */
  maxWidth?: string;
  children: React.ReactNode;
}

/**
 * Generic modal overlay.
 * Provides: backdrop, Escape-to-close, avatar header, close button, scrollable body.
 * Specific content goes in children.
 */
export default function Modal({
  onClose,
  title,
  subtitle,
  avatarLetter,
  maxWidth = "max-w-2xl",
  children,
}: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const letter = (avatarLetter ?? title).charAt(0).toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] bg-card border border-line rounded-2xl flex flex-col overflow-hidden shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-line shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-black text-accent">{letter}</span>
            </div>
            <div>
              <h2 className="text-base font-black text-ink leading-tight">{title}</h2>
              {subtitle && <p className="text-xs text-ink-5 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-5 hover:text-ink hover:bg-elevated transition-colors ml-4 shrink-0"
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
