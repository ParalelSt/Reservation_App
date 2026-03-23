import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isMobileNavOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
}

/** Store for UI state (sidebar, mobile nav) */
export const useUIStore = create<UIState>()((set) => ({
  isSidebarOpen: true,
  isMobileNavOpen: false,

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  toggleMobileNav: () => {
    set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen }));
  },

  closeMobileNav: () => {
    set({ isMobileNavOpen: false });
  },
}));
