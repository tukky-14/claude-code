import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cook Pocket - あなただけのレシピコレクション",
  description: "お気に入りのレシピURLを一元管理。カテゴリやタグで簡単に検索・整理できるレシピブックマークアプリです。",
  keywords: ["レシピ", "ブックマーク", "料理", "管理", "Cook Pocket"],
  authors: [{ name: "Cook Pocket" }],
  icons: {
    icon: '/cook-pocket.png',
    shortcut: '/cook-pocket.png',
    apple: '/cook-pocket.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
