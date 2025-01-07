
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster"
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import "./globals.css";

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
  title: "Agiledao",
  description: "Agiledao - A minimalist agile development management tool",
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
