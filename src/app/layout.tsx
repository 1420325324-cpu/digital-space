import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "李过年 · 数字空间",
  description: "在数据与直觉之间，找到第三条路",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body>{children}</body>
    </html>
  );
}
