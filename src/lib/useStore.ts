import { create } from 'zustand';

interface CollectionState {
  selectedCollectionId: number | null;
  setSelectedCollectionId: (id: number) => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  selectedCollectionId: null,
  setSelectedCollectionId: (id) => set({ selectedCollectionId: id }),
}));
