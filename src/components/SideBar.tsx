
"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, Box, ShoppingCart } from "lucide-react";

const MENU_ITEMS = [
  { label: "Dashboard", icon: Home },
  { label: "Ürünler", icon: Box },
  { label: "Koleksiyon", icon: ShoppingCart },
];

export default function Sidebar() {
  return (
    <aside className='w-64 bg-white dark:bg-gray-800 shadow-md min-h-screen flex flex-col items-center py-6'>
      {/* Logo */}
      <div className='mb-16'>
        <Image
          src='https://flowbite.com/docs/images/logo.svg'
          alt='Logo'
          width={50}
          height={50}
          className='dark:invert'
        />
      </div>

      {/* Menü */}
      <nav className='w-full'>
        {MENU_ITEMS.map(({ label, icon: Icon }) => (
          <Link
            key={label}
            href='/collections'
            className='flex items-center gap-3 px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors'
          >
            <Icon className='w-5 h-5' />
            <span className='font-medium'>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
