"use client";

import {
  Bell,
  Globe,
  Mail,
  UserCircle2,
  Sun,
  Moon,
  LogOut,
  Menu,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useThemeStore } from "@/lib/themeStore";
import { useSidebarStore } from "@/lib/useSidebarStore";

export default function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const { toggle: toggleSidebar } = useSidebarStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className='bg-[var(--background)] text-[var(--foreground)] border-b border-[var(--table-border)] shadow-md relative z-50 backdrop-blur-sm'>
      <nav className='max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
        
         
          <button
            onClick={toggleSidebar}
            className='block lg:hidden p-1 hover:text-blue-500 transition'
            aria-label='Menüyü Aç/Kapat'
          >
            <Menu className='w-6 h-6' />
          </button>
        </div>

        {/* Sağdaki ikon grubu */}
        <div className='flex items-center space-x-5'>
          <button
            onClick={toggleTheme}
            title='Tema Değiştir'
            className='hover:text-yellow-500 transition'
          >
            {theme === "dark" ? (
              <Sun className='w-5 h-5' />
            ) : (
              <Moon className='w-5 h-5' />
            )}
          </button>

          <button title='Dil' className='hover:text-blue-500 transition'>
            <Globe className='w-5 h-5' />
          </button>

          <button
            title='Bildirimler'
            className='hover:text-blue-500 transition'
          >
            <Bell className='w-5 h-5' />
          </button>

          <button title='Mesajlar' className='hover:text-blue-500 transition'>
            <Mail className='w-5 h-5' />
          </button>

          <div className='relative' ref={menuRef}>
            <button
              onClick={() => setMenuOpen((p) => !p)}
              title='Profil'
              className='hover:text-blue-500 transition'
            >
              <UserCircle2 className='w-6 h-6' />
            </button>
            {menuOpen && (
              <div className='absolute right-0 mt-2 w-40 bg-[var(--background)] rounded-lg shadow-lg py-2 border border-[var(--table-border)] z-50'>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className='flex items-center w-full px-4 py-2 text-sm hover:bg-[var(--table-header-bg)] transition-colors'
                >
                  <LogOut className='w-4 h-4 mr-2' />
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
