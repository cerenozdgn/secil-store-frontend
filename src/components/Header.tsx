
"use client";

import { useTheme } from "next-themes";
import { Bell, Globe, Mail, UserCircle2, Sun, Moon } from "lucide-react";

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md border-b border-gray-200 dark:border-gray-700'>
      <nav className='max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center'>
       
        <div />

        {/* Sağ butonlar */}
        <div className='flex items-center space-x-5'>
          {/* Tema butonu */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title='Tema Değiştir'
            className='text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-300 transition'
          >
            {theme === "dark" ? (
              <Sun className='w-5 h-5' />
            ) : (
              <Moon className='w-5 h-5' />
            )}
          </button>

          {/* Diğer sabit butonlar */}
          <button
            title='Dil'
            className='text-gray-700 dark:text-gray-300 hover:text-blue-600 transition'
          >
            <Globe className='w-5 h-5' />
          </button>
          <button
            title='Bildirimler'
            className='text-gray-700 dark:text-gray-300 hover:text-blue-600 transition'
          >
            <Bell className='w-5 h-5' />
          </button>
          <button
            title='Mesajlar'
            className='text-gray-700 dark:text-gray-300 hover:text-blue-600 transition'
          >
            <Mail className='w-5 h-5' />
          </button>
          <button
            title='Profil'
            className='text-gray-700 dark:text-gray-300 hover:text-blue-600 transition'
          >
            <UserCircle2 className='w-6 h-6' />
          </button>
        </div>
      </nav>
    </header>
  );
}
