"use client";

import Link from "next/link";

export const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">Blog</Link>
          </li>
          <li>
            <Link href="/contact">お問い合わせ</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
