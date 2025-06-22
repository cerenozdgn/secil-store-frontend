"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCollectionStore } from "@/lib/useStore";
import { BsFillPencilFill } from "react-icons/bs";

export default function CollectionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    collections,
    page,
    totalPages,
    setCollections,
    setPage,
    setTotalPages,
    setSelectedCollectionId,
  } = useCollectionStore();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch(
          `https://maestro-api-dev.secil.biz/Collection/GetAll?page=${page}&pageSize=10`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
              Accept: "application/json",
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

    if (session?.accessToken) {
      fetchCollections();
    }
  }, [session, page]);

  if (status === "loading") return <div className='p-4'>Yükleniyor...</div>;
  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-2'>Koleksiyon</h1>
      <p className='text-gray-600 mb-6'>Koleksiyon Listesi</p>

      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Başlık
              </th>
              <th scope='col' className='px-6 py-3'>
                Ürün Koşulları
              </th>
              <th scope='col' className='px-6 py-3'>
                Satış Kanalı
              </th>
              <th scope='col' className='px-6 py-3 text-center'>
                <span className='sr-only'>Düzenle</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {collections.map((col) => (
              <tr
                key={col.id}
                className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
              >
                <th
                  scope='row'
                  className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                >
                  {col.info.name}
                </th>
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
                    className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                    title='Sabitleri Düzenle'
                  >
                    <BsFillPencilFill className='inline-block w-5 h-5' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='flex justify-end mt-6'>
        <nav className='flex items-center space-x-1 text-sm'>
          <button
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1}
            className='px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50'
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`px-3 py-1 rounded ${
                n === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className='px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50'
          >
            &gt;
          </button>
        </nav>
      </div>
    </div>
  );
}
