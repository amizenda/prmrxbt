import { create } from "zustand";

/* ─── UI State Store ─── */
/* Add slices as the app grows */

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Active project (dashboard)
  activeProjectId: string | null;
  setActiveProject: (id: string | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Active filter
  activeFilter: string;
  setActiveFilter: (f: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  activeProjectId: null,
  setActiveProject: (id) => set({ activeProjectId: id }),

  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),

  activeFilter: "All",
  setActiveFilter: (f) => set({ activeFilter: f }),
}));
