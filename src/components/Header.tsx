
import { useThemeStore } from "@/lib/themeStore";
import { Bell, Globe, Mail, UserCircle2 } from "lucide-react";

export default function Header() {
  const { toggleTheme, theme } = useThemeStore();

  return (
    <header className='bg-white dark:bg-gray-800 border-b px-6 py-4 flex justify-between items-center'>
      <h1 className='text-xl font-semibold'>Koleksiyon Sabit Düzenleme</h1>
      <div className='flex items-center gap-4'>
        <button onClick={toggleTheme} title='Tema Değiştir'>
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
        <div className='relative group'>
          <Globe className='w-5 h-5 cursor-pointer' />
          <span className='tooltip'>Dil Değiştir</span>
        </div>

        <div className='relative group'>
          <Bell className='w-5 h-5 cursor-pointer' />
          <span className='tooltip'>Bildirimler</span>
        </div>

        <div className='relative group'>
          <Mail className='w-5 h-5 cursor-pointer' />
          <span className='tooltip'>Mesajlar</span>
        </div>

        <div className='relative group'>
          <UserCircle2 className='w-6 h-6 cursor-pointer' />
          <span className='tooltip'>Profil</span>
        </div>
      </div>
    </header>
  );
}
