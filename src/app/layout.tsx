import type { Metadata } from "next";
import { Header } from "./components/features/Header";
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
