"use client";

import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useCollectionStore } from "@/lib/useStore";
import { useFilterStore } from "@/lib/useFilterStore";

type FilterData = {
  id: string;
  title: string;
  values: { value: string; valueName: string | null }[];
  comparisonType: number;
};

export default function FilterModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [filtersData, setFiltersData] = useState<FilterData[]>([]);
  const [selectedHeader, setSelectedHeader] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const { setFilters, setPage } = useFilterStore();
  const { data: session } = useSession();
  const collectionId = useCollectionStore(
    (state) => state.selectedCollectionId
  );

  useEffect(() => {
    if (!isOpen || !session?.accessToken || !collectionId) return;

    fetch(
      `https://maestro-api-dev.secil.biz/Collection/${collectionId}/GetFiltersForConstants`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => setFiltersData(res.data || []))
      .catch((err) => console.error("Filtre çekme hatası:", err));
  }, [isOpen, session, collectionId]);

  const handleHeaderSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHeader(e.target.value);
  };

  const handleValueSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!selectedHeader || !value) return;

    setSelectedFilters((prev) => {
      const existing = prev[selectedHeader] || [];
      if (existing.includes(value)) return prev;
      return {
        ...prev,
        [selectedHeader]: [...existing, value],
      };
    });
  };

  const handleRemove = (header: string, value: string) => {
    setSelectedFilters((prev) => {
      const updated = prev[header].filter((v) => v !== value);
      const newFilters = { ...prev };
      if (updated.length === 0) {
        delete newFilters[header];
      } else {
        newFilters[header] = updated;
      }
      return newFilters;
    });
  };

  const handleApply = () => {
    const formatted = Object.entries(selectedFilters).flatMap(([key, values]) =>
      values.map((val) => ({
        id: filtersData.find((f) => f.title === key)?.id || "",
        value: val,
        comparisonType:
          filtersData.find((f) => f.title === key)?.comparisonType ?? 0,
      }))
    );

    setFilters(formatted);
    setPage(1);
    onClose();
  };

  const handleClear = () => {
    setSelectedFilters({});
    setFilters([]);
    setPage(1);
  };

  const currentOptions =
    filtersData.find((f) => f.title === selectedHeader)?.values || [];

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='w-full max-w-3xl bg-white p-6 rounded-lg space-y-6'>
          <Dialog.Title className='text-lg font-semibold'>
            Filtreleme Paneli
          </Dialog.Title>

          {/* Başlık Seçimi */}
          <div className='flex gap-4'>
            <select
              className='w-1/2 border border-gray-300 rounded px-2 py-1'
              value={selectedHeader}
              onChange={handleHeaderSelect}
            >
              <option value=''>Filtre Başlığı Seç</option>
              {filtersData.map((f) => (
                <option key={f.id} value={f.title}>
                  {f.title}
                </option>
              ))}
            </select>

            {/* Değer Seçimi */}
            <select
              className='w-1/2 border border-gray-300 rounded px-2 py-1'
              value=''
              onChange={handleValueSelect}
              disabled={!selectedHeader}
            >
              <option value=''>Değer Seç</option>
              {currentOptions.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.valueName || v.value}
                </option>
              ))}
            </select>
          </div>

          {/* Seçilenler Listesi */}
          {Object.keys(selectedFilters).length > 0 && (
            <div className='border rounded p-3'>
              <h3 className='text-sm font-medium mb-2'>Seçilen Filtreler</h3>
              <div className='flex flex-wrap gap-2'>
                {Object.entries(selectedFilters).map(([key, values]) =>
                  values.map((val) => (
                    <span
                      key={`${key}-${val}`}
                      className='bg-gray-100 text-sm px-2 py-1 rounded-full flex items-center gap-1'
                    >
                      {key}: {val}
                      <button
                        onClick={() => handleRemove(key, val)}
                        className='ml-1 text-red-500 hover:text-red-700'
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Butonlar */}
          <div className='flex justify-end gap-3'>
            <button
              onClick={handleClear}
              className='border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100'
            >
              Temizle
            </button>
            <button
              onClick={handleApply}
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
              Uygula
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
