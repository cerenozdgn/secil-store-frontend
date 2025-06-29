"use client";

import { useRemoveModalStore } from "@/lib/useRemoveModalStore";
import { Dialog } from "@headlessui/react";
import { useSuccessModalStore } from "@/lib/useSuccessModalStore";

interface Props {
  onConfirm: (productCode: string) => void;
}

export default function RemoveProductModal({ onConfirm }: Props) {
  const { isOpen, closeModal, productToRemove } = useRemoveModalStore();

  if (!isOpen || !productToRemove) return null;

  const handleConfirm = () => {
    onConfirm(productToRemove.productCode);
    closeModal();
    useSuccessModalStore
      .getState()
      .openModal("Sabitler içerisinden çıkarıldı.");
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} className='relative z-50'>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center'>
        <Dialog.Panel className='bg-[var(--table-bg)] text-[var(--foreground)] p-6 rounded max-w-md w-full shadow-xl text-center transition-colors'>
          <Dialog.Title className='text-lg font-semibold text-red-600'>
            Uyarı!
          </Dialog.Title>
          <div className='my-4'>
            <p>
              <strong>{productToRemove.productCode}</strong> sabitlerden
              çıkarılacaktır. Emin misiniz?
            </p>
          </div>
          <div className='mt-6 flex justify-center gap-4'>
            <button
              onClick={closeModal}
              className='bg-[var(--table-header-bg)] text-[var(--foreground)] px-4 py-2 rounded hover:opacity-90'
            >
              Vazgeç
            </button>
            <button
              onClick={handleConfirm}
              className='bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded'
            >
              Onayla
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
