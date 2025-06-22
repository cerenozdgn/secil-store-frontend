
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
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [minStock, setMinStock] = useState<string>("");
  const [maxStock, setMaxStock] = useState<string>("");
  const [allSizes, setAllSizes] = useState<boolean>(false);
  const [productCode, setProductCode] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");

  const { setFilters, setPage } = useFilterStore();
  const { data: session } = useSession();
  const collectionId = useCollectionStore(
    (state) => state.selectedCollectionId
  );

  // API'den filtre verilerini çekiyoruz
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

  // Filtre başlığı seçimi
  const handleHeaderSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHeader(e.target.value);
  };
  // Filtre değeri seçimi
  const handleValueSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!selectedHeader || !val) return;
    setSelectedFilters((prev) => {
      const arr = prev[selectedHeader] || [];
      if (arr.includes(val)) return prev;
      return { ...prev, [selectedHeader]: [...arr, val] };
    });
  };
  // Filtre etiketlerinden silme
  const handleRemove = (hdr: string, val: string) => {
    setSelectedFilters((prev) => {
      const updated = prev[hdr].filter((v) => v !== val);
      const copy = { ...prev };
      if (updated.length) copy[hdr] = updated;
      else delete copy[hdr];
      return copy;
    });
  };

  // Uygula
  const handleApply = () => {
    // Genel filtreler
    const general = Object.entries(selectedFilters).flatMap(([hdr, vals]) =>
      vals.map((v) => ({
        id: filtersData.find((f) => f.title === hdr)?.id || "",
        value: v,
        comparisonType:
          filtersData.find((f) => f.title === hdr)?.comparisonType ?? 0,
      }))
    );
    // Depo filtresi
    const warehouseF = selectedWarehouse
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
    // Stok filtresi (min & max)
    const stockF: any[] = [];
    if (minStock)
      stockF.push({ id: "stock", value: minStock, comparisonType: 3 });
    if (maxStock)
      stockF.push({ id: "stock", value: maxStock, comparisonType: 2 });
    // Ürün kodu
    const codeF = productCode
      ? [{ id: "productCode", value: productCode, comparisonType: 0 }]
      : [];
    setFilters([...general, ...warehouseF, ...stockF, ...codeF]);
    setPage(1);
    onClose();
  };
  // Temizle
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
  const stockComparisons =
    filtersData.find((f) => f.id === "stock")?.values || [];

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='w-full max-w-4xl bg-white p-6 rounded-lg space-y-6'>
          <Dialog.Title className='text-xl font-semibold'>
            Filtreler
          </Dialog.Title>

          {/* Üst Grid */}
          <div className='grid grid-cols-4 gap-4'>
            {/* Filtreler */}
            <div className='space-y-2'>
              <label className='font-medium'>Filtreler</label>
              <select
                className='w-full border rounded px-2 py-1'
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
                className='w-full border rounded px-2 py-1'
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

            {/* Stok */}
            <div className='space-y-2'>
              <label className='font-medium'>Stok</label>
              <select
                className='w-full border rounded px-2 py-1'
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
                className='w-full border rounded px-2 py-1'
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
              />
              <input
                type='number'
                placeholder='Maksimum Stok'
                className='w-full border rounded px-2 py-1'
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
                <span>Tüm Bedenlerinde Stok Olanlar</span>
              </label>
            </div>

            {/* Ürün Kodu */}
            <div className='space-y-2'>
              <label className='font-medium'>Ürün Kodu</label>
              <input
                type='text'
                placeholder='Ürün kodu'
                className='w-full border rounded px-2 py-1'
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />
              {/* boşluk */}
              <div className='h-12' />
            </div>

            {/* Sıralamalar */}
            <div className='space-y-2'>
              <label className='font-medium'>Sıralamalar</label>
              <select
                className='w-full border rounded px-2 py-1'
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

          {/* Uygulanan Kriterler */}
          <div>
            <label className='font-medium'>Uygulanan Kriterler</label>
            <div className='mt-2 h-24 border rounded p-2 overflow-auto bg-gray-50'>
              {Object.entries(selectedFilters).length === 0 &&
              !selectedWarehouse &&
              !minStock &&
              !maxStock &&
              !productCode ? (
                <p className='text-gray-500'>Henüz kriter seçilmedi.</p>
              ) : (
                <ul className='list-disc list-inside space-y-1 text-sm'>
                  {Object.entries(selectedFilters).flatMap(([hdr, vals]) =>
                    vals.map((v) => (
                      <li key={hdr + v}>
                        {hdr}:{" "}
                        {
                          filtersData
                            .find((f) => f.title === hdr)
                            ?.values.find((o) => o.value === v)?.valueName
                        }
                      </li>
                    ))
                  )}
                  {selectedWarehouse && (
                    <li>
                      Depo:{" "}
                      {
                        warehouseValues.find(
                          (w) => w.value === selectedWarehouse
                        )?.valueName
                      }
                    </li>
                  )}
                  {minStock && <li>Min Stok: {minStock}</li>}
                  {maxStock && <li>Max Stok: {maxStock}</li>}
                  {allSizes && <li>Tüm bedenlerinde stok olanlar</li>}
                  {productCode && <li>Ürün Kodu: {productCode}</li>}
                
                </ul>
              )}
            </div>
          </div>

          {/* Butonlar */}
          <div className='flex justify-end gap-4'>
            <button
              onClick={handleClear}
              className='bg-black text-white px-6 py-2 rounded hover:opacity-90'
            >
              Seçimi Temizle
            </button>
            <button
              onClick={handleApply}
              className='border border-black text-black px-6 py-2 rounded hover:bg-black hover:text-white transition'
            >
              Ara
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
