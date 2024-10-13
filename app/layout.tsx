import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FiveM Artifacts DB",
  description:
    "Find and download the latest recommended artifacts, and avoid artifacts with known issues",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#111] text-white">{children}</body>
    </html>
  );
}
