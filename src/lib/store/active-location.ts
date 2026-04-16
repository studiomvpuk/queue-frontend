import { create } from 'zustand';

interface ActiveLocationState {
  activeLocationId: string | null;
  setActiveLocation: (locationId: string) => void;
  clearActiveLocation: () => void;
}

export const useActiveLocationStore = create<ActiveLocationState>((set) => ({
  activeLocationId: null,
  setActiveLocation: (locationId) => set({ activeLocationId: locationId }),
  clearActiveLocation: () => set({ activeLocationId: null }),
}));
