
import { create } from 'zustand';

type Filter = {
  id: string;
  value: string;
  comparisonType: number;
};

type FilterStore = {
  filters: Filter[];
  page: number;
  setFilters: (filters: Filter[]) => void;
  setPage: (page: number) => void;
};

export const useFilterStore = create<FilterStore>((set) => ({
  filters: [],
  page: 1,
  setFilters: (filters) => set({ filters }),
  setPage: (page) => set({ page }),
}));


