// Sidebar.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, Box, ShoppingCart } from "lucide-react";

const MENU_ITEMS = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Ürünler", icon: Box, href: "/products" },
  { label: "Koleksiyon", icon: ShoppingCart, href: "/collections" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md min-h-screen flex flex-col items-center py-6">
      {/* Logo */}
      <div className="mb-16">
        <Image
          src="/secil-store-seeklogo.png"
          alt="Logo"
          width={150}
          height={150}
          className="dark:invert"
        />
      </div>

      {/* Menü */}
      <nav className="w-full">
        {MENU_ITEMS.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center w-full gap-3 px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
