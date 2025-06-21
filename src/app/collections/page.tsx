'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCollectionStore } from '@/lib/useStore';
import { FaCartPlus } from 'react-icons/fa';
import { BsFillPencilFill } from 'react-icons/bs';

interface Collection {
  id: number;
  info: {
    name: string;
    description: string;
  };
  salesChannel: string;
}

export default function CollectionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState('');
  const setSelectedCollectionId = useCollectionStore((state) => state.setSelectedCollectionId);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchCollections = async () => {
      try {
        const res = await fetch('https://maestro-api-dev.secil.biz/Collection/GetAll', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setCollections(data.data || []);
        } else {
          setError('Koleksiyonlar alınamadı.');
        }
      } catch {
        setError('Sunucu hatası.');
      }
    };

    fetchCollections();
  }, [session]);

  if (status === 'loading') return <div className="p-4">Yükleniyor...</div>;
  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Koleksiyon</h1>
      <p className="text-gray-600 mb-6">Koleksiyon Listesi</p>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto rounded border shadow">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">Başlık</th>
              <th className="px-6 py-3">Ürün Koşulları</th>
              <th className="px-6 py-3">Satış Kanalı</th>
              <th className="px-6 py-3 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((col) => (
              <tr
                key={col.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4">{col.info.name}</td>
                <td className="px-6 py-4 text-gray-600">{col.info.description}</td>
                <td className="px-6 py-4 text-gray-600">{col.salesChannel || 'Satış Kanalı - X'}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => {
                      setSelectedCollectionId(col.id);
                      router.push('/edit');
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="Sabitleri Düzenle"
                  >
                    <BsFillPencilFill className="inline-block w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <nav className="flex items-center space-x-1 text-sm">
          <button className="px-3 py-1 rounded bg-gray-200 text-gray-700">&lt;</button>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`px-3 py-1 rounded ${
                n === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {n}
            </button>
          ))}
          <button className="px-3 py-1 rounded bg-gray-200 text-gray-700">&gt;</button>
        </nav>
      </div>
    </div>
  );
}
