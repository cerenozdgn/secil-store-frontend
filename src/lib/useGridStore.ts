
import { create } from 'zustand';

type GridStore = {
  gridCols: number;
  setGridCols: (cols: number) => void;
};

export const useGridStore = create<GridStore>((set) => ({
  gridCols: 2,
  setGridCols: (cols) => set({ gridCols: cols }),
}));
