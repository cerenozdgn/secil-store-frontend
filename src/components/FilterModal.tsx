"use client";

import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useCollectionStore } from "@/lib/useStore";
import { useFilterStore } from "@/lib/useFilterStore";
import { useThemeStore } from "@/lib/themeStore";

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
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [minStock, setMinStock] = useState<string>("");
  const [maxStock, setMaxStock] = useState<string>("");
  const [allSizes, setAllSizes] = useState<boolean>(false);
  const [productCode, setProductCode] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");

  const { theme } = useThemeStore();
  const { setFilters, setPage, removeFilter } = useFilterStore();
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
    const val = e.target.value;
    if (!selectedHeader || !val) return;
    setSelectedFilters((prev) => {
      const current = prev[selectedHeader] || [];
      if (current.includes(val)) return prev;
      return { ...prev, [selectedHeader]: [...current, val] };
    });
  };

  const handleRemove = (hdr: string, val: string) => {
    setSelectedFilters((prev) => {
      const updated = prev[hdr].filter((v) => v !== val);
      const newFilters = { ...prev };
      if (updated.length) newFilters[hdr] = updated;
      else delete newFilters[hdr];
      return newFilters;
    });
    const id = filtersData.find((f) => f.title === hdr)?.id;
    if (id) removeFilter(id, val);
  };

  const handleApply = () => {
    const generalFilters = Object.entries(selectedFilters).flatMap(
      ([hdr, values]) =>
        values.map((v) => ({
          id: filtersData.find((f) => f.title === hdr)?.id || "",
          value: v,
          comparisonType:
            filtersData.find((f) => f.title === hdr)?.comparisonType ?? 0,
        }))
    );
    const warehouseFilter = selectedWarehouse
      ? [
          {
            id: "warehouse",
            value: selectedWarehouse,
            comparisonType:
              filtersData.find((f) => f.id === "warehouse")?.comparisonType ??
              0,
          },
        ]
      : [];
    const stockFilters = [];
    if (minStock)
      stockFilters.push({ id: "stock", value: minStock, comparisonType: 3 });
    if (maxStock)
      stockFilters.push({ id: "stock", value: maxStock, comparisonType: 2 });
    const codeFilter = productCode
      ? [{ id: "productCode", value: productCode, comparisonType: 0 }]
      : [];

    setFilters([
      ...generalFilters,
      ...warehouseFilter,
      ...stockFilters,
      ...codeFilter,
    ]);
    setPage(1);
    onClose();
  };

  const handleClear = () => {
    setSelectedFilters({});
    setSelectedWarehouse("");
    setMinStock("");
    setMaxStock("");
    setAllSizes(false);
    setProductCode("");
    setSortOption("");
    setFilters([]);
    setPage(1);
  };

  const generalHeaders = filtersData.filter(
    (f) => f.id !== "warehouse" && f.id !== "stock"
  );
  const currentValues =
    filtersData.find((f) => f.title === selectedHeader)?.values || [];
  const warehouseValues =
    filtersData.find((f) => f.id === "warehouse")?.values || [];

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel
          className={`w-full max-w-4xl rounded-lg p-6 space-y-6 transition-colors ${
            theme === "dark"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-900"
          }`}
        >
          <Dialog.Title className='text-xl font-semibold'>
            Filtreler
          </Dialog.Title>

          {/* Grid - Responsive */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* Genel filtre */}
            <div className="overflow-x-auto max-w-full">
              <label className='font-medium'>Filtreler</label>
              <select
                className="w-full max-w-full px-2 py-1 rounded border bg-[var(--table-bg)] text-[var(--foreground)] border-[var(--table-border)]"
                value={selectedHeader}
                onChange={handleHeaderSelect}
              >
                <option value=''>Başlık seçiniz</option>
                {generalHeaders.map((f) => (
                  <option key={f.id} value={f.title}>
                    {f.title}
                  </option>
                ))}
              </select>
              <select
                className="w-full max-w-full px-2 py-1 rounded border bg-[var(--table-bg)] text-[var(--foreground)] border-[var(--table-border)]"
                value=''
                onChange={handleValueSelect}
                disabled={!selectedHeader}
              >
                <option value=''>Değer seçiniz</option>
                {currentValues.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.valueName || v.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Depo ve stok */}
            <div className="overflow-x-auto max-w-full">

              <label className='font-medium'>Stok</label>
              <select
                className="w-full max-w-full px-2 py-1 rounded border bg-[var(--table-bg)] text-[var(--foreground)] border-[var(--table-border)]"
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
              >
                <option value=''>Depo seçiniz</option>
                {warehouseValues.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.valueName}
                  </option>
                ))}
              </select>
              <input
                type='number'
                placeholder='Minimum Stok'
                className='w-full px-2 py-1 rounded border bg-[var(--table-bg)] text-[var(--foreground)] border-[var(--table-border)]'
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
              />
              <input
                type='number'
                placeholder='Maksimum Stok'
                className='w-full px-2 py-1 rounded border bg-[var(--table-bg)] text-[var(--foreground)] border-[var(--table-border)]'
                value={maxStock}
                onChange={(e) => setMaxStock(e.target.value)}
              />
              <label className='inline-flex items-center space-x-2'>
                <input
                  type='checkbox'
                  className='form-checkbox'
                  checked={allSizes}
                  onChange={(e) => setAllSizes(e.target.checked)}
                />
                <span>Tüm bedenlerinde stok</span>
              </label>
            </div>

            {/* Ürün kodu */}
            <div className='space-y-2'>
              <label className='font-medium'>Ürün Kodu</label>
              <input
                type='text'
                placeholder='Ürün kodu'
                className='w-full px-2 py-1 rounded border bg-[var(--table-bg)] text-[var(--foreground)] border-[var(--table-border)]'
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />
              <div className='h-12' />
            </div>

            {/* Sıralama */}
            <div className="overflow-x-auto max-w-full">

              <label className='font-medium'>Sıralamalar</label>
              <select
                className="w-full max-w-full px-2 py-1 rounded border bg-[var(--table-bg)] text-[var(--foreground)] border-[var(--table-border)]"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value=''>Seçiniz</option>
                <option value='asc'>Artan</option>
                <option value='desc'>Azalan</option>
              </select>
              <div className='h-12' />
            </div>
          </div>

          {/* Aktif Filtreler */}
          <div>
            <label className='font-medium'>Uygulanan Kriterler</label>
            <div
              className={`mt-2 min-h-[2rem] border rounded p-2 ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {Object.entries(selectedFilters).length === 0 &&
              !selectedWarehouse &&
              !minStock &&
              !maxStock &&
              !allSizes &&
              !productCode ? (
                <p className='text-sm text-gray-500'>Henüz kriter seçilmedi.</p>
              ) : (
                <div className='flex flex-wrap gap-2'>
                  {Object.entries(selectedFilters).flatMap(([hdr, vals]) =>
                    vals.map((v) => {
                      const label =
                        filtersData
                          .find((f) => f.title === hdr)
                          ?.values.find((o) => o.value === v)?.valueName || v;
                      return (
                        <span
                          key={hdr + v}
                          className='group inline-flex items-center text-sm rounded-full px-3 py-1 bg-[var(--table-bg)] text-[var(--foreground)] border border-[var(--table-border)]'
                        >
                          <span>
                            {hdr}: {label}
                          </span>
                          <button
                            type='button'
                            onClick={() => handleRemove(hdr, v)}
                            className='ml-2 hover:text-red-500'
                          >
                            ×
                          </button>
                        </span>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Butonlar */}
          <div className='flex flex-wrap justify-end gap-4'>
            <button
              onClick={handleClear}
              className={`px-6 py-2 rounded hover:opacity-90 ${
                theme === "dark" ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              Seçimi Temizle
            </button>
            <button
              onClick={handleApply}
              className={`px-6 py-2 rounded border transition ${
                theme === "dark"
                  ? "border-white text-white hover:bg-white hover:text-black"
                  : "border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              Ara
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
