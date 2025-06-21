
import { create } from 'zustand';
import { Product } from '@/types';

interface CollectionEditorState {
  products: Product[];
  constants: Product[];
  setProducts: (p: Product[]) => void;
  setConstants: (p: Product[]) => void;
}

export const useCollectionEditorStore = create<CollectionEditorState>((set) => ({
  products: [],
  constants: [],
  setProducts: (products) => set({ products }),
  setConstants: (constants) => set({ constants }),
}));
