
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster"
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import "@/app/globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "敏捷之道 - 极简敏捷开发管理工具",
  description: "敏捷之道 - 一个极简的敏捷开发管理工具，提供任务管理、工作日志、团队协作等功能，帮助团队高效实施敏捷开发。支持看板视图、任务跟踪、工时统计等功能，适用于Scrum和看板等多种敏捷方法。",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
    <html lang="en" >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}
        suppressHydrationWarning
      >
           <div className="flex flex-col h-screen w-full">
            <header className="flex-none flex items-center justify-between">
                <Navbar />
            </header>
            <main className="flex-grow w-full ">
                {children}
            </main>
            <footer className="flex-none w-full">
                <Footer />
            </footer>
        </div>
        <Toaster />
      </body>

    </html>
  );
}
