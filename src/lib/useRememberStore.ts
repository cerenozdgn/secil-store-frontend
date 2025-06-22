import { create } from "zustand";

type RememberState = {
  remember: boolean;
  setRemember: (value: boolean) => void;
};

export const useRememberStore = create<RememberState>((set) => ({
  remember:
    typeof window !== "undefined" && localStorage.getItem("rememberedEmail")
      ? true
      : false,
  setRemember: (value) => set({ remember: value }),
}));
