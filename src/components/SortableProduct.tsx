"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Product } from "@/types";

export default function SortableProduct({ product }: { product: Product }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: product.productCode,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className='p-2 border rounded shadow bg-white dark:bg-gray-700 text-black dark:text-white cursor-move'
    >
      <img
        src={product.imageUrl}
        alt={product.productCode}
        className='w-full h-60 object-contain rounded'
      />
      <p className='text-sm text-center mt-2'>{product.productCode}</p>
    </div>
  );
}
