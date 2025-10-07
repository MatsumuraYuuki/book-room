// next/src/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';

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
  title: "青空本棚",
  description: "記事共有アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 全体をAuthProviderで囲み、ここにstateの状態を記憶しておくことでページ移動してもstateの再取得が可能になる */}
          <div className="min-h-screen bg-white">
            <Header />
            <Navigation />
            
            <main className="md:pl-64 flex flex-col min-h-screen pt-16">
              <div className="flex-1 p-4 md:p-8">
                {children}
              </div>

              {/* モバイル用の下部余白 */}
              <div className="h-20 md:h-0"></div>
            </main>
          </div>
      </body>
    </html>
  );
}
      