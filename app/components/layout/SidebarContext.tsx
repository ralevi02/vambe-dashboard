"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface SidebarContextValue {
  /** Desktop: icon-only collapsed state */
  collapsed: boolean;
  /** Mobile: drawer open */
  mobileOpen: boolean;
  toggleCollapsed: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  mobileOpen: false,
  toggleCollapsed: () => {},
  toggleMobile: () => {},
  closeMobile: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), []);
  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <SidebarContext.Provider
      value={{ collapsed, mobileOpen, toggleCollapsed, toggleMobile, closeMobile }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
