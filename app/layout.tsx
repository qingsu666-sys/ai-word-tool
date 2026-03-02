import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI听力助手",
  description: "AI驱动的英语词汇变形工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
