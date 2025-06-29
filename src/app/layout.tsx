import "./globals.css";
import { ReactNode } from "react";
import ClientLayout from "./ClientLayout";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='tr'>
      <body className='min-h-screen flex'>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
