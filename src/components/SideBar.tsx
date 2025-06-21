
import Link from "next/link";
import { LayoutDashboard, ShoppingCart } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className='w-64 bg-white dark:bg-gray-900 border-r p-4 min-h-screen'>
      <div className='text-2xl font-bold mb-6'>LOGO</div>
      <nav className='space-y-2'>
        <Link
          href='/dashboard'
          className='flex items-center gap-2 hover:text-blue-500'
        >
          <LayoutDashboard className='w-5 h-5' /> Dashboard
        </Link>
        <Link
          href='/collections'
          className='flex items-center gap-2 hover:text-blue-500'
        >
          <ShoppingCart className='w-5 h-5' /> Koleksiyonlar
        </Link>
      </nav>
    </aside>
  );
}
