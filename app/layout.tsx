import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

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
      <body className={`${jakarta.className} bg-zinc-950 text-zinc-200 antialiased`}>
        {children}
      </body>
    </html>
  );
}
