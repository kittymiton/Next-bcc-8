import { Header } from "@/_components/Header";
import type { Metadata } from "next";
import "./globals.css";
import "./styles/style.scss";

export const metadata: Metadata = {
  title: "blog",
  description: "ようこそ",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
