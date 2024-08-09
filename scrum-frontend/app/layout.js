import { Inter } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from 'next';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "敏捷之道 AgileDao",
  description: "极简敏捷开发 scrum 管理工具",
  keywords: ["敏捷开发", "Scrum", "项目管理", "AgileDao"],
  authors: [{ name: "AgileDao Team" }],
  creator: "AgileDao",
  publisher: "AgileDao",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div className="w-full">{children}</div>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
