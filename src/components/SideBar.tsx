"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, Box, ShoppingCart } from "lucide-react";
import { useThemeStore } from "@/lib/themeStore";
import { useSidebarStore } from "@/lib/useSidebarStore";
import { X } from "lucide-react";


const MENU_ITEMS = [
  { label: "Dashboard", icon: Home, href: "/collections" },
  { label: "Ürünler", icon: Box, href: "/collections" },
  { label: "Koleksiyon", icon: ShoppingCart, href: "/collections" },
];

export default function Sidebar() {
  const { theme } = useThemeStore();
  const { isOpen, close } = useSidebarStore();

  const logoSrc =
    theme === "dark" ? "/secil-logo-lightt.png" : "/secil-store-seeklogo.png";

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[var(--background)] text-[var(--foreground)]
          p-6 z-50 shadow-md border-r border-[var(--table-border)]
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:block
        `}
      >
        {/* Mobilde kapat butonu */}
        <div className="lg:hidden flex justify-end mb-6">
          <button onClick={close} aria-label="Menü Kapat">
            <X size={28} />
          </button>
        </div>

        {/* Logo */}
        <div className="mb-10 w-[150px] h-[60px] relative mx-auto lg:mx-0">
          <Image
            src={logoSrc}
            alt="Logo"
            fill
            className="object-contain"
            sizes="150px"
            priority
          />
        </div>

        {/* Menü */}
        <nav className="flex flex-col space-y-2">
          {MENU_ITEMS.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded hover:bg-[var(--table-header-bg)] transition-colors"
              onClick={close} // mobilde tıklayınca menü kapanır
            >
              <Icon className="w-5 h-5" />
              <span className="text-base font-medium">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={close}
        />
      )}
    </>
  );
}
