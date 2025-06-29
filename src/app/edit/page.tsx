"use client";

import { useEffect, useState } from "react";
import { useCollectionStore } from "@/lib/useStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { Dialog } from "@headlessui/react";
import DualListDragDrop from "@/components/DualListDragDrop";
import FilterModal from "@/components/FilterModal";
import { useFilterStore } from "@/lib/useFilterStore";

export default function EditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const collectionId = useCollectionStore(
    (state) => state.selectedCollectionId
  );

  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [constants, setConstants] = useState<Product[]>([]);
  const [initialConstants, setInitialConstants] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { filters, page } = useFilterStore();

  useEffect(() => {
    if (!session?.accessToken || !collectionId) return;

    const fetchCollectionProducts = async () => {
      try {
        const response = await fetch(
          `https://maestro-api-dev.secil.biz/Collection/${collectionId}/GetProductsForConstants`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              additionalFilters: filters,
              page,
              pageSize: 36,
            }),
          }
        );

        const json = await response.json();

        if (response.ok && json.status === 200) {
          const products = Array.isArray(json.data)
            ? json.data
            : json.data?.data || [];
          setCollectionProducts(products);
          setInitialConstants([]);
        } else {
          setError("Koleksiyon ürünleri getirilemedi.");
        }
      } catch (err) {
        console.error("Fetch hatası:", err);
        setError("Sunucu hatası oluştu.");
      }
    };

    fetchCollectionProducts();
  }, [session, collectionId, filters, page]);

  const handleSave = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setConstants(initialConstants);
    router.push("/collections");
  };

  if (status === "loading") return <div className='p-4'>Yükleniyor...</div>;
  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  if (!collectionId) {
    return (
      <div className='p-4 text-red-800'>Herhangi bir koleksiyon seçilmedi.</div>
    );
  }

  return (
    <div className='p-8'>
      {/* Başlık + Filtre Butonu */}
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Koleksiyon Sabitleri Düzenle</h1>
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className='flex items-center gap-2 border border-gray-400 text-gray-700 px-3 py-1 rounded hover:bg-gray-100'
        >
          <span>Filtreler</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z'
            />
          </svg>
        </button>
      </div>

      {error && <p className='text-red-600 mb-4'>{error}</p>}

      {collectionProducts.length === 0 && (
        <p className='text-yellow-600 mb-4'>Henüz ürün bulunamadı.</p>
      )}

      <DualListDragDrop
        allProducts={collectionProducts}
        selectedProducts={constants}
        onUpdateSelected={setConstants}
      />

      <div className='flex gap-4 mt-6'>
        <button
          onClick={handleSave}
          className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700'
        >
          Kaydet
        </button>
        <button
          onClick={handleCancel}
          className='bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-500'
        >
          Vazgeç
        </button>
      </div>

      {/* Request Gösterimi */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className='relative z-50'
      >
        <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
        <div className='fixed inset-0 flex items-center justify-center p-4'>
          <Dialog.Panel
            className='mx-auto max-w-xl w-full rounded p-6'
            style={{
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
          >
            <Dialog.Title className='text-xl font-semibold mb-4'>
              Gönderilecek Request
            </Dialog.Title>
            <pre
              className='p-4 text-sm max-h-96 overflow-auto rounded mb-4'
              style={{
                backgroundColor: "var(--table-bg)",
                color: "var(--foreground)",
                border: "1px solid var(--table-border)",
              }}
            >
              {JSON.stringify(
                constants.map((p) => ({
                  productCode: p.productCode,
                  colorCode: p.colorCode,
                })),
                null,
                2
              )}
            </pre>
            <div className='mt-4 flex justify-end gap-2'>
              <button
                onClick={() => setIsModalOpen(false)}
                className='px-4 py-2 rounded font-medium'
                style={{
                  backgroundColor: "#2563eb", // tailwind blue-600
                  color: "white",
                }}
              >
                Kapat
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Filtreleme Modalı */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
}
