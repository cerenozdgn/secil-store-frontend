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
    onConfirm(productToRemove.productCode); // ürün state'ten çıkarılır
    closeModal(); // silme uyarı modali kapanır
    useSuccessModalStore.getState().openModal("Sabitler içerisinden çıkarıldı.");
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} className='relative z-50'>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center'>
        <Dialog.Panel className='bg-white dark:bg-gray-900 p-6 rounded max-w-md w-full shadow-xl text-center'>
          <Dialog.Title className='text-lg font-semibold text-red-600'>
            Uyarı!
          </Dialog.Title>
          <div className='my-4 text-gray-800 dark:text-white'>
            <p>
              <strong>{productToRemove.productCode}</strong> sabitlerden
              çıkarılacaktır. Emin misiniz?
            </p>
          </div>
          <div className='mt-6 flex justify-center gap-4'>
            <button
              onClick={closeModal}
              className='bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300'
            >
              Vazgeç
            </button>
            <button
              onClick={handleConfirm}
              className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
            >
              Onayla
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
