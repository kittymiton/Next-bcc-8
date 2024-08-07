"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // 受け取ったパスと現在のルートパスが一致するか検証
  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      <aside>
        <ul>
          <li className={isActive("/admin/posts") ? "active" : ""}>
            <Link href="/admin/posts">記事一覧</Link>
          </li>
          <li className={isActive("/admin/categories") ? "active" : ""}>
            <Link href="/admin/categories">カテゴリ一覧</Link>
          </li>
        </ul>
      </aside>
      {children}
    </div>
  );
}
