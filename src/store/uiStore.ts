import { create } from 'zustand';
import { shiftMonth } from '@/utils/date';

interface UiState {
  selectedYear: number;
  selectedMonth: number; // 1-12
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToCurrentMonth: () => void;
}

const now = new Date();

export const useUiStore = create<UiState>((set) => ({
  selectedYear: now.getFullYear(),
  selectedMonth: now.getMonth() + 1,
  goToPrevMonth: () =>
    set((s) => {
      const p = shiftMonth(s.selectedYear, s.selectedMonth, -1);
      return { selectedYear: p.year, selectedMonth: p.month };
    }),
  goToNextMonth: () =>
    set((s) => {
      const p = shiftMonth(s.selectedYear, s.selectedMonth, 1);
      return { selectedYear: p.year, selectedMonth: p.month };
    }),
  goToCurrentMonth: () => {
    const d = new Date();
    set({ selectedYear: d.getFullYear(), selectedMonth: d.getMonth() + 1 });
  },
}));
