"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useThemeStore } from "@/lib/themeStore";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    setIsClient(true);

    // localStorage'dan tema al ve uygulama başında ayarla
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else {
      // fallback tema
      setTheme("light");
    }
  }, [setTheme]);

  const isAuthPage = pathname === "/" || pathname === "/login";

  if (!isClient) return null;

  return (
    <html lang='tr' className={theme}>
      <body className='min-h-screen flex bg-white text-black dark:bg-gray-900 dark:text-white'>
        <SessionProvider>
          {isAuthPage ? (
            <main className='w-full'>{children}</main>
          ) : (
            <div className='flex w-full'>
              <Sidebar />
              <div className='flex-1 flex flex-col'>
                <Header />
                <main className='flex-1 p-4'>{children}</main>
              </div>
            </div>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
