"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Clientes",
    href: "/clients",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" />
      </svg>
    ),
  },
  {
    label: "Categorías",
    href: "/categories",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    label: "Vendedores",
    href: "/sellers",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: "Insights",
    href: "/insights",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    label: "Configuración",
    href: "/settings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

// ── Collapse toggle button ────────────────────────────────────────────────────
function CollapseBtn({ collapsed, onClick }: { collapsed: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-lg text-ink-5 hover:text-ink hover:bg-hover transition-colors"
      aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
    >
      <svg
        className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

// ── Shared nav list ───────────────────────────────────────────────────────────
function NavList({
  pathname,
  collapsed,
  onLinkClick,
}: {
  pathname: string;
  collapsed: boolean;
  onLinkClick?: () => void;
}) {
  return (
    <nav className="flex-1 px-2 py-5 space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-accent/10 text-accent"
                : "text-ink-3 hover:bg-hover hover:text-ink"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <span className={`shrink-0 ${isActive ? "text-accent" : "text-ink-5"}`}>
              {item.icon}
            </span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggleCollapsed, mobileOpen, closeMobile } = useSidebar();

  return (
    <>
      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* ── Mobile drawer (full width sidebar, slides in) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-56 bg-card border-r border-line-subtle flex flex-col shrink-0 transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile header row */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-line-subtle shrink-0">
          <span className="text-sm font-bold text-ink-3">Menú</span>
          <button
            onClick={closeMobile}
            className="p-1.5 rounded-lg text-ink-5 hover:text-ink hover:bg-hover transition-colors"
            aria-label="Cerrar menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <NavList pathname={pathname} collapsed={false} onLinkClick={closeMobile} />
        <div className="px-4 py-4 border-t border-line">
          <p className="text-xs text-ink-4">v1.0.0 · Prueba Técnica</p>
        </div>
      </aside>

      {/* ── Desktop sidebar (collapsible) ── */}
      <aside
        className={`hidden md:flex flex-col bg-card border-r border-line-subtle shrink-0 transition-all duration-300 ${
          collapsed ? "w-14" : "w-56"
        }`}
      >
        {/* Collapse toggle */}
        <div className={`h-12 flex items-center border-b border-line-subtle shrink-0 ${
          collapsed ? "justify-center px-0" : "justify-end px-3"
        }`}>
          <CollapseBtn collapsed={collapsed} onClick={toggleCollapsed} />
        </div>
        <NavList pathname={pathname} collapsed={collapsed} />
        {!collapsed && (
          <div className="px-4 py-4 border-t border-line">
            <p className="text-xs text-ink-4">v1.0.0 · Prueba Técnica</p>
          </div>
        )}
      </aside>
    </>
  );
}
