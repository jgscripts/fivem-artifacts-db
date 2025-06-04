import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FiveM 构建版本数据库",
  description:
    "查找并下载最新推荐的构建版本，避免使用有已知问题的版本",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="bg-zinc-950 text-zinc-200">{children}</body>
    </html>
  );
}
