import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

const SidebarContext = createContext(null);

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
}

function SidebarProvider({ defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const [openMobile, setOpenMobile] = useState(false);

  const toggleSidebar = useCallback(() => {
    setOpen(o => !o);
  }, []);

  const value = useMemo(() => ({ open, setOpen, openMobile, setOpenMobile, toggleSidebar }), [open, openMobile, toggleSidebar]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
export { SidebarProvider, useSidebar };
