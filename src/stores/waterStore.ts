import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WaterEntry {
  id: string;
  amount_ml: number;
  logged_at: string;
}

interface WaterState {
  entries: WaterEntry[];
  totalToday: number;
  loading: boolean;
  addWater: (amount_ml: number) => void;
  removeWater: (id: string) => void;
  setEntries: (entries: WaterEntry[]) => void;
  resetToday: () => void;
  setLoading: (loading: boolean) => void;
}

export const useWaterStore = create<WaterState>()(
  persist(
    (set, get) => ({
      entries: [],
      totalToday: 0,
      loading: false,

      addWater: (amount_ml) => {
        const entry: WaterEntry = {
          id: crypto.randomUUID(),
          amount_ml,
          logged_at: new Date().toISOString(),
        };
        const entries = [...get().entries, entry];
        const today = new Date().toDateString();
        const totalToday = entries
          .filter(e => new Date(e.logged_at).toDateString() === today)
          .reduce((sum, e) => sum + e.amount_ml, 0);
        set({ entries, totalToday });
      },

      removeWater: (id) => {
        const entries = get().entries.filter(e => e.id !== id);
        const today = new Date().toDateString();
        const totalToday = entries
          .filter(e => new Date(e.logged_at).toDateString() === today)
          .reduce((sum, e) => sum + e.amount_ml, 0);
        set({ entries, totalToday });
      },

      setEntries: (entries) => {
        const today = new Date().toDateString();
        const totalToday = entries
          .filter(e => new Date(e.logged_at).toDateString() === today)
          .reduce((sum, e) => sum + e.amount_ml, 0);
        set({ entries, totalToday });
      },

      resetToday: () => {
        const entries = get().entries.filter(
          e => new Date(e.logged_at).toDateString() !== new Date().toDateString()
        );
        set({ entries, totalToday: 0 });
      },

      setLoading: (loading) => set({ loading }),
    }),
    { name: 'nutrisnap-water' }
  )
);
