import { create } from "zustand";

interface Collection {
  id: number;
  info: {
    name: string;
    description: string;
  };
  salesChannel: string;
}

interface CollectionState {
  selectedCollectionId: number | null;
  collections: Collection[];
  page: number;
  totalPages: number;
  setSelectedCollectionId: (id: number) => void;
  setCollections: (data: Collection[]) => void;
  setPage: (page: number) => void;
  setTotalPages: (total: number) => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  selectedCollectionId: null,
  collections: [],
  page: 1,
  totalPages: 1,
  setSelectedCollectionId: (id) => set({ selectedCollectionId: id }),
  setCollections: (data) => set({ collections: data }),
  setPage: (page) => set({ page }),
  setTotalPages: (total) => set({ totalPages: total }),
}));
