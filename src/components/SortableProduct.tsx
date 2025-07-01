/**“Ürünleri sıralamak için @dnd-kit kütüphanesinden useSortable kullanıldı. 
 * Her ürün kartı, sürüklemeye duyarlı hale getirildi. 
 * Ayrıca, tema değişimine göre arka plan ve yazı renkleri Zustand üzerinden dinamik olarak değiştiriliyor.” */
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Product } from "@/types";
import { useThemeStore } from "@/lib/themeStore";

export default function SortableProduct({ product }: { product: Product }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `collection-${product.productCode}`,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none", 
  };

  const { theme } = useThemeStore();

  const backgroundClass =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900";

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`p-2 border rounded shadow cursor-move transition-colors ${backgroundClass}`}
    >
      <img
        src={product.imageUrl}
        alt={product.productCode}
        className='w-full h-60 object-contain rounded'
      />
      <p className='text-sm text-center mt-2 break-words'>
        {product.productCode}
      </p>
    </div>
  );
}
