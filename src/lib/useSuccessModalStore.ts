import { create } from "zustand";

interface SuccessModalState {
  isOpen: boolean;
  message: string;
  openModal: (message: string) => void;
  closeModal: () => void;
}

export const useSuccessModalStore = create<SuccessModalState>((set) => ({
  isOpen: false,
  message: "",

  openModal: (message) => set({ isOpen: true, message }),

  closeModal: () => set({ isOpen: false, message: "" }),
}));
