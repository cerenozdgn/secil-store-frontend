"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAuthPage = pathname === "/" || pathname === "/login";

  if (!isClient) return null;

  return (
    <ThemeProvider attribute='class' defaultTheme='light'  enableSystem={true} disableTransitionOnChange>
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
  );
}
