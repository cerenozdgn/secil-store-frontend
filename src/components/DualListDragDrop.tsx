"use client";

import { useState } from "react";
import { Product } from "@/types";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableProduct from "./SortableProduct";
import { Trash2, LayoutGrid, Grid3X3, Grid2X2 } from "lucide-react";
import { useGridStore } from "@/lib/useGridStore";
import RemoveProductModal from "./RemoveProductModal";
import { useRemoveModalStore } from "@/lib/useRemoveModalStore";
import SuccessModal from "./SuccessModal";
import { useSuccessModalStore } from "@/lib/useSuccessModalStore";
import { useThemeStore } from "@/lib/themeStore";

interface Props {
  allProducts: Product[];
  selectedProducts: Product[];
  onUpdateSelected: (items: Product[]) => void;
}

function DroppableArea({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: isOver ? "var(--table-header-bg)" : "var(--table-bg)",
        borderColor: isOver ? "blue" : "var(--table-border)",
      }}
      className='min-h-[300px] border-2 border-dashed p-4 rounded transition-colors'
    >
      {children}
    </div>
  );
}

export default function DualListDragDrop({
  allProducts,
  selectedProducts,
  onUpdateSelected,
}: Props) {
  const { theme } = useThemeStore();

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor)
  );

  const [dragged, setDragged] = useState<Product | null>(null);
  const { gridCols, setGridCols } = useGridStore();
  const [collectionPage, setCollectionPage] = useState(1);
  const [constantsPage, setConstantsPage] = useState(1);
  const itemsPerPage = 6;

  const collectionTotalPages = Math.ceil(allProducts.length / itemsPerPage);
  const constantsTotalPages = Math.ceil(selectedProducts.length / itemsPerPage);

  const paginatedCollection = allProducts.slice(
    (collectionPage - 1) * itemsPerPage,
    collectionPage * itemsPerPage
  );
  const paginatedConstants = selectedProducts.slice(
    (constantsPage - 1) * itemsPerPage,
    constantsPage * itemsPerPage
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDragged(null);
    if (!over) return;

    const activeId =
      typeof active.id === "string" ? active.id.replace("collection-", "") : "";
    const draggedItem = allProducts.find((p) => p.productCode === activeId);
    const alreadyExists = selectedProducts.some(
      (p) => p.productCode === draggedItem?.productCode
    );
    if (draggedItem && over.id === "constants" && !alreadyExists) {
      onUpdateSelected([...selectedProducts, draggedItem]);
    }
  };

  const removeFromConstants = (code: string) => {
    onUpdateSelected(selectedProducts.filter((p) => p.productCode !== code));
    setTimeout(() => {
      useSuccessModalStore
        .getState()
        .openModal("Sabitler içerisinden çıkarıldı.");
    }, 100);
  };

  const gridClassMap: { [key: number]: string } = {
    2: "grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={(event) => {
      
        const id =
          typeof event.active.id === "string"
            ? event.active.id.replace("collection-", "")
            : "";
        const item = allProducts.find((p) => p.productCode === id);
        if (item) setDragged(item);
      }}
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-start'>
        {/* Koleksiyon Ürünleri */}
        <div
          className='p-4 rounded shadow flex flex-col h-[650px] overflow-hidden'
          style={{
            backgroundColor: "var(--table-bg)",
            color: "var(--foreground)",
          }}
        >
          <h2 className='text-lg font-semibold mb-2'>Koleksiyon Ürünleri</h2>
          <div className='flex-1 min-h-0 overflow-y-auto'>
            <SortableContext
              items={paginatedCollection.map(
                (p) => `collection-${p.productCode}`
              )}
              strategy={verticalListSortingStrategy}
            >
              <div className='grid grid-cols-2 sm:grid-cols-2 gap-4'>
                {paginatedCollection.map((product) => {
                  const isSelected = selectedProducts.some(
                    (p) => p.productCode === product.productCode
                  );
                  return (
                    <div
                      key={`collection-${product.productCode}${product.colorCode}`}
                      className='relative group min-h-[220px]'
                    >
                      <SortableProduct product={product} />
                      {isSelected && (
                        <div className='absolute inset-0 bg-white/70 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center text-sm font-semibold text-gray-800 dark:text-white'>
                          Eklendi
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </SortableContext>
          </div>
          <div className='flex justify-center items-center gap-2 mt-4'>
            <button
              onClick={() => setCollectionPage((p) => Math.max(p - 1, 1))}
              disabled={collectionPage === 1}
              className='px-2 py-1 text-sm border rounded disabled:opacity-50'
            >
              Önceki
            </button>
            <span>
              {collectionPage} / {collectionTotalPages}
            </span>
            <button
              onClick={() =>
                setCollectionPage((p) => Math.min(p + 1, collectionTotalPages))
              }
              disabled={collectionPage === collectionTotalPages}
              className='px-2 py-1 text-sm border rounded disabled:opacity-50'
            >
              Sonraki
            </button>
          </div>
        </div>

        {/* Sabitler */}
        <div
          className='p-4 rounded shadow flex flex-col h-[650px] overflow-hidden'
          style={{
            backgroundColor: "var(--table-bg)",
            color: "var(--foreground)",
          }}
        >
          <div className='flex justify-between items-center mb-2'>
            <h2 className='text-lg font-semibold'>Sabitler</h2>
            <div className='flex space-x-2'>
              {[2, 3, 4].map((cols) => (
                <button
                  key={cols}
                  onClick={() => setGridCols(cols)}
                  className={`p-1 rounded ${
                    gridCols === cols
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {cols === 2 ? (
                    <Grid2X2 size={20} />
                  ) : cols === 3 ? (
                    <LayoutGrid size={20} />
                  ) : (
                    <Grid3X3 size={20} />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className='flex-1 min-h-0 overflow-y-auto'>
            <DroppableArea id='constants'>
              <div className={`grid ${gridClassMap[gridCols]} gap-4 mt-2`}>
                {paginatedConstants.map((product) => (
                  <div
                    key={`constant-${product.productCode}${product.colorCode}`}
                    className='relative p-2 border rounded shadow group flex flex-col items-center'
                    style={{
                      backgroundColor: "var(--table-bg)",
                      color: "var(--foreground)",
                    }}
                  >
                    <div className='absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <button
                        onClick={() =>
                          useRemoveModalStore.getState().openModal(product)
                        }
                        className='bg-red-600 hover:bg-red-700 text-white p-3 rounded-full'
                        title='Kaldır'
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                    <img
                      src={product.imageUrl}
                      alt={product.productCode}
                      className='w-full max-h-52 object-contain rounded'
                    />
                    <p className='text-sm mt-2 text-center break-all'>
                      {product.productCode}
                    </p>
                  </div>
                ))}
              </div>
            </DroppableArea>
          </div>
          <div className='flex justify-center items-center gap-2 mt-4'>
            <button
              onClick={() => setConstantsPage((p) => Math.max(p - 1, 1))}
              disabled={constantsPage === 1}
              className='px-2 py-1 text-sm border rounded disabled:opacity-50'
            >
              Önceki
            </button>
            <span>
              {constantsPage} / {constantsTotalPages}
            </span>
            <button
              onClick={() =>
                setConstantsPage((p) => Math.min(p + 1, constantsTotalPages))
              }
              disabled={constantsPage === constantsTotalPages}
              className='px-2 py-1 text-sm border rounded disabled:opacity-50'
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>

      <DragOverlay>
        {dragged && (
          <div
            className='p-2 border rounded shadow max-w-[200px] mx-auto'
            style={{
              backgroundColor: "var(--table-bg)",
              color: "var(--foreground)",
            }}
          >
            <img
              src={dragged.imageUrl}
              alt={dragged.productCode}
              className='w-full max-h-52 object-contain rounded'
            />
            <p className='text-sm text-center mt-2'>{dragged.productCode}</p>
          </div>
        )}
      </DragOverlay>

      <RemoveProductModal onConfirm={removeFromConstants} />
      <SuccessModal />
    </DndContext>
  );
}
