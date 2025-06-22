import { create } from "zustand";

type Filter = {
  id: string;
  value: string;
  comparisonType: number;
};

type FilterStore = {
  filters: Filter[];
  page: number;
  setFilters: (filters: Filter[]) => void;
  addFilter: (filter: Filter) => void;
  removeFilter: (id: string, value?: string) => void;
  clearFilters: () => void;
  pageSize: number;
  setPage: (page: number) => void;
};

export const useFilterStore = create<FilterStore>((set) => ({
  filters: [],
  page: 1,
  pageSize: 36,

  setFilters: (filters) => set({ filters }),

  addFilter: (newFilter) =>
    set((state) => {
      const exists = state.filters.some(
        (f) => f.id === newFilter.id && f.value === newFilter.value
      );
      if (exists) return state;
      return { filters: [...state.filters, newFilter] };
    }),

  removeFilter: (id, value) =>
    set((state) => ({
      filters: state.filters.filter((f) =>
        value !== undefined ? !(f.id === id && f.value === value) : f.id !== id
      ),
      page: 1,
    })),

  clearFilters: () => set({ filters: [] }),

  setPage: (page) => set({ page }),
}));
