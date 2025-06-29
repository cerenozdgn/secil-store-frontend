"use client";

import { useSuccessModalStore } from "@/lib/useSuccessModalStore";
import { useThemeStore } from "@/lib/themeStore"; 

export default function SuccessModal() {
  const { isOpen, message, closeModal } = useSuccessModalStore();
  const { theme } = useThemeStore(); 

  if (!isOpen) return null;


  const bgClass = theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const borderClass = theme === "dark" ? "border border-gray-700" : "border border-gray-300";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className={`rounded-lg shadow-lg p-6 text-center w-[400px] transition-colors ${bgClass} ${borderClass}`}
      >
        <h2 className="text-xl font-bold mb-4">Başarılı</h2>
        <div className="text-emerald-500 text-4xl mb-2">✔</div>
        <p className="mb-6">{message}</p>
        <button
          onClick={closeModal}
          className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Tamam
        </button>
      </div>
    </div>
  );
}
