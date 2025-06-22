import { create } from "zustand";
import { Product } from "@/types";

interface RemoveModalState {
  productToRemove: Product | null;
  isOpen: boolean;
  openModal: (product: Product) => void;
  closeModal: () => void;
}

export const useRemoveModalStore = create<RemoveModalState>((set) => ({
  productToRemove: null,
  isOpen: false,
  openModal: (product) => set({ productToRemove: product, isOpen: true }),
  closeModal: () => set({ productToRemove: null, isOpen: false }),
}));
