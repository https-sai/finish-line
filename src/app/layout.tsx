// app/layout.tsx
"use client";
import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/NavBar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showNavbar = pathname !== "/" && pathname !== "/login";

  return (
    <html lang="en">
      <body>
        {showNavbar && <Navbar />}
        <main>{children}</main>
      </body>
    </html>
  );
}
