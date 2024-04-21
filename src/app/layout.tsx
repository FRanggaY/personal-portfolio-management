import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Portfolio Management",
  description: "Management of personal portfolio",
};

export default function LocaleLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: Readonly<{ locale: string }>;
}>) {
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}