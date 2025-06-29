"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Home, Box, ShoppingCart } from "lucide-react";

const MENU_ITEMS = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Ürünler", icon: Box, href: "/products" },
  { label: "Koleksiyon", icon: ShoppingCart, href: "/collections" },
];

export default function Sidebar() {
  const { theme } = useTheme();

  const logoSrc =
    theme === "dark" ? "/secil-logo-lightt.png" : "/secil-store-seeklogo.png";

  return (
    <aside
      className='
        w-64 p-6 flex flex-col items-center
        bg-[var(--background)]
        text-[var(--foreground)]
        backdrop-blur-sm
        shadow-md
        border-r border-[var(--table-border)]
        transition-colors duration-200
        min-h-screen
      '
    >
      {/* Logo alanı sabit boyutlu ve içerik kutuya oturacak şekilde ayarlandı */}
      <div className='mb-16 w-[150px] h-[60px] relative'>
        <Image
          src={logoSrc}
          alt='Logo'
          fill
          className='object-contain'
          sizes='150px'
          priority
        />
      </div>

      <nav className='w-full space-y-1'>
        {MENU_ITEMS.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className='
              flex items-center w-full gap-3 px-6 py-3
              text-[var(--foreground)]
              hover:bg-[var(--table-header-bg)]
              rounded
              transition-colors duration-150
            '
          >
            <Icon className='w-5 h-5' />
            <span className='font-medium'>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
