import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RMContab - Rosa Mística",
  description: "Sistema de Contabilidade da Igreja Rosa Mística",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-50 min-h-screen flex`}>
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-8 transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
