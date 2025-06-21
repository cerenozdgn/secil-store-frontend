"use client";

import "./globals.css";
import { ReactNode, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/SideBar";
import Header from "@/components/Header";
import { useThemeStore } from "@/lib/themeStore";

export default function RootLayout({ children }: { children: ReactNode }) {
  const { theme } = useThemeStore();

 
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  return (
    <html lang='tr'>
      <body className='min-h-screen flex bg-white text-black dark:bg-gray-900 dark:text-white'>
        <SessionProvider>
          <Sidebar />
          <div className='flex-1 flex flex-col'>
            <Header />
            <main className='flex-1 p-4'>{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
