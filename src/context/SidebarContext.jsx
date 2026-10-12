import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false); // mobile drawer
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop collapse

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggle: () => setIsOpen((p) => !p),
        isCollapsed,
        toggleCollapsed: () => setIsCollapsed((p) => !p),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
};
