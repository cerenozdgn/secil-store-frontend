"use client";

import { useTheme } from "next-themes";
import {
  Bell,
  Globe,
  Mail,
  UserCircle2,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className='bg-[var(--background)] text-[var(--foreground)] border-b border-[var(--table-border)] shadow-md relative z-50 backdrop-blur-sm'>
      <nav className='max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center'>
        <div />

        <div className='flex items-center space-x-5 relative'>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title='Tema Değiştir'
            className='hover:text-yellow-500 transition'
            style={{ color: "var(--foreground)" }}
          >
            {theme === "dark" ? (
              <Sun className='w-5 h-5' />
            ) : (
              <Moon className='w-5 h-5' />
            )}
          </button>

          <button
            title='Dil'
            className='hover:text-blue-500 transition'
            style={{ color: "var(--foreground)" }}
          >
            <Globe className='w-5 h-5' />
          </button>
          <button
            title='Bildirimler'
            className='hover:text-blue-500 transition'
            style={{ color: "var(--foreground)" }}
          >
            <Bell className='w-5 h-5' />
          </button>
          <button
            title='Mesajlar'
            className='hover:text-blue-500 transition'
            style={{ color: "var(--foreground)" }}
          >
            <Mail className='w-5 h-5' />
          </button>

          <div className='relative'>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              title='Profil'
              className='hover:text-blue-500 transition'
              style={{ color: "var(--foreground)" }}
            >
              <UserCircle2 className='w-6 h-6' />
            </button>

            {menuOpen && (
              <div className='absolute right-0 mt-2 w-40 bg-[var(--background)] rounded-lg shadow-lg py-2 z-50'>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className='flex items-center w-full px-4 py-2 text-sm hover:bg-[var(--table-header-bg)] transition'
                  style={{ color: "var(--foreground)" }}
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
