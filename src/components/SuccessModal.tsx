import { useSuccessModalStore } from "@/lib/useSuccessModalStore";

export default function SuccessModal() {
  const { isOpen, message, closeModal } = useSuccessModalStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center w-[400px]">
        <h2 className="text-xl font-bold mb-4">Başarılı</h2>
        <div className="text-green-600 text-4xl mb-2">✔</div>
        <p className="mb-6">{message}</p>
        <button
          onClick={closeModal}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Tamam
        </button>
      </div>
    </div>
  );
}
