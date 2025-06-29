"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCollectionStore } from "@/lib/useStore";
import { BsFillPencilFill } from "react-icons/bs";
import { useThemeStore } from "@/lib/themeStore";

export default function CollectionsPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/");
    },
  });

  const {
    collections,
    page,
    totalPages,
    setCollections,
    setPage,
    setTotalPages,
    setSelectedCollectionId,
  } = useCollectionStore();

  const { theme } = useThemeStore(); // Tema durumunu oku

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchCollections = async () => {
      try {
        const res = await fetch(
          `https://maestro-api-dev.secil.biz/Collection/GetAll?page=${page}&pageSize=10`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setCollections(data.data || []);
          setTotalPages(data.meta?.totalPages || 1);
        }
      } catch (err) {
        console.error("Sunucu hatası:", err);
      }
    };

    fetchCollections();
  }, [status, session, page, setCollections, setTotalPages]);

  if (status === "loading") return null;

  return (
    <div className='p-4 md:p-8 text-[var(--foreground)]'>
      <h1 className='text-2xl font-bold mb-2'>Koleksiyon</h1>
      <p className='text-[var(--foreground)] opacity-70 mb-6'>
        Koleksiyon Listesi
      </p>

      {/* Mobile Card View */}
      <div className='grid gap-4 sm:hidden'>
        {collections.map((col) => (
          <div
            key={col.id}
            className='bg-[var(--table-bg)] p-4 rounded-lg shadow border border-[var(--table-border)]'
          >
            <div className='flex justify-between items-start mb-2'>
              <div>
                <h3 className='text-lg font-semibold'>{col.info.name}</h3>
                <p className='text-sm opacity-70'>
                  {col.salesChannel || "Satış Kanalı - X"}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCollectionId(col.id);
                  router.push("/edit");
                }}
                className='p-2 text-blue-600 hover:bg-[var(--hover-bg)] rounded'
              >
                <BsFillPencilFill size={20} />
              </button>
            </div>
            <div
              className='text-sm'
              dangerouslySetInnerHTML={{ __html: col.info.description }}
            />
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className='hidden sm:block overflow-x-auto rounded-lg shadow'>
        <table className='min-w-full text-sm text-left text-[var(--foreground)]'>
          <thead className='bg-[var(--table-header-bg)]'>
            <tr>
              <th className='px-6 py-3 font-bold'>BAŞLIK</th>
              <th className='px-6 py-3 font-bold'>ÜRÜN KOŞULLARI</th>
              <th className='px-6 py-3 font-bold'>SATIŞ KANALI</th>
              <th className='px-6 py-3 font-bold text-right'>DÜZENLE</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((col) => (
              <tr
                key={col.id}
                className='border-b border-[var(--table-border)] bg-[var(--table-bg)]'
              >
                <td className='px-6 py-4 font-medium'>{col.info.name}</td>
                <td
                  className='px-6 py-4'
                  dangerouslySetInnerHTML={{ __html: col.info.description }}
                />
                <td className='px-6 py-4'>
                  {col.salesChannel || "Satış Kanalı - X"}
                </td>
                <td className='px-6 py-4 text-right'>
                  <button
                    onClick={() => {
                      setSelectedCollectionId(col.id);
                      router.push("/edit");
                    }}
                    className='bg-gray-900 text-white px-3 py-1 rounded hover:bg-blue-800 text-xs flex items-center gap-1'
                  >
                    <BsFillPencilFill className='w-4 h-4' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='flex justify-center sm:justify-end mt-6 space-x-1 text-sm'>
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className='px-3 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100 disabled:opacity-50'
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className={`px-3 py-1 rounded ${
              n === page
                ? "bg-gray-900 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className='px-3 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100 disabled:opacity-50'
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
