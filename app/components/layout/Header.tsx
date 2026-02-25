"use client";

import { useSidebar } from "./SidebarContext";

export default function Header() {
  const { toggleMobile } = useSidebar();

  return (
    <header className="h-16 bg-card border-b border-line-subtle flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={toggleMobile}
          className="md:hidden p-1.5 rounded-lg text-ink-4 hover:text-ink hover:bg-hover transition-colors"
          aria-label="Abrir menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/vambe-logo.png"
          alt="Vambe"
          className="logo-theme-adapt h-7 w-auto"
        />
        <span className="text-ink-5 hidden sm:inline">/</span>
        <span className="text-sm text-ink-3 font-medium hidden sm:inline">
          Sales Dashboard
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <span className="text-xs text-ink-4 hidden sm:inline">
          {new Date().toLocaleDateString("es-CL")}
        </span>
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-on-accent text-xs font-black">
          V
        </div>
      </div>
    </header>
  );
}
