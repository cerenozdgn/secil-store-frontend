"use client";

import { useState } from "react";
import { Product } from "@/types";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableProduct from "./SortableProduct";
import { useDroppable } from "@dnd-kit/core";
import { Trash2, Square, LayoutGrid, Grid3X3, Grid2X2 } from "lucide-react";
import { useGridStore } from "@/lib/useGridStore";
import RemoveProductModal from "./RemoveProductModal";
import { useRemoveModalStore } from "@/lib/useRemoveModalStore";
import SuccessModal from "./SuccessModal";
import { useSuccessModalStore } from "@/lib/useSuccessModalStore";

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
      className={`min-h-[300px] border-2 border-dashed p-4 rounded transition-colors ${
        isOver
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
          : "border-gray-300 bg-gray-50 dark:bg-gray-800"
      }`}
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
  const sensors = useSensors(useSensor(PointerSensor));
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
      useSuccessModalStore.getState().openModal("Sabitler içerisinden çıkarıldı.");
    }, 100);
  };
  const gridClassMap: { [key: number]: string } = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={(event) => {
        const activeId =
          typeof event.active.id === "string"
            ? event.active.id.replace("collection-", "")
            : "";
        const draggedItem = allProducts.find((p) => p.productCode === activeId);
        if (draggedItem) setDragged(draggedItem);
      }}
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-start'>
        {/* Koleksiyon Ürünleri */}
        <div className='bg-white dark:bg-gray-900 p-4 rounded shadow flex flex-col h-[650px]'>
          <div className='flex-1 overflow-y-auto'>
            <h2 className='text-lg font-semibold mb-2'>Koleksiyon Ürünleri</h2>
            <SortableContext
              items={paginatedCollection.map(
                (p) => `collection-${p.productCode}`
              )}
              strategy={verticalListSortingStrategy}
            >
              <div className='grid grid-cols-2 gap-4'>
                {paginatedCollection.map((product) => {
                  const isSelected = selectedProducts.some(
                    (p) => p.productCode === product.productCode
                  );
                  return (
                    <div
                      key={`collection-${
                        product.productCode + product.colorCode
                      }`}
                      className='relative group'
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
        <div className='bg-white dark:bg-gray-900 p-4 rounded shadow flex flex-col h-[650px]'>
          <div className='flex justify-between items-center mb-2'>
            <h2 className='text-lg font-semibold'>Sabitler</h2>
            <div className='flex justify-end mb-2 space-x-2'>
              <button
                onClick={() => setGridCols(2)}
                className={`p-1 rounded ${
                  gridCols === 2
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <Grid2X2 size={20} />
              </button>
              <button
                onClick={() => setGridCols(3)}
                className={`p-1 rounded ${
                  gridCols === 3
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1 rounded ${
                  gridCols === 4
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <Grid3X3 size={20} />
              </button>
            </div>
          </div>

          <div className='flex-1 overflow-y-auto'>
            <DroppableArea id='constants'>
              <div className={`grid ${gridClassMap[gridCols]} gap-4 mt-2`}>
                {paginatedConstants.map((product) => (
                  <div
                    key={`constant-${product.productCode + product.colorCode}`}
                    className='relative p-2 border rounded shadow bg-white dark:bg-gray-700 group'
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
                      className='w-full h-32 object-cover rounded'
                    />
                    <p className='text-sm mt-2 text-center text-gray-800 dark:text-gray-200'>
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

      {/* Overlay */}
      <DragOverlay>
        {dragged && (
          <div className='p-2 border rounded shadow bg-white dark:bg-gray-700'>
            <img
              src={dragged.imageUrl}
              alt={dragged.productCode}
              className='w-full h-32 object-cover rounded'
            />
            <p className='text-sm mt-2'>{dragged.productCode}</p>
          </div>
        )}
      </DragOverlay>
      <RemoveProductModal onConfirm={removeFromConstants} />
      <SuccessModal />
    </DndContext>
  );
}
