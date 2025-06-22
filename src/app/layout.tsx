// app/layout.tsx
"use client";

import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/" || pathname === "/login";

  return (
    <html lang='tr'>
      <body className='min-h-screen flex bg-white text-black dark:bg-gray-900 dark:text-white'>
        {/* next-themes sağlıyor: SSR ile uyumlu, class="dark" ekler */}
        <ThemeProvider attribute='class' defaultTheme='light'>
          {/* next-auth oturum */}
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
        </ThemeProvider>
      </body>
    </html>
  );
}
