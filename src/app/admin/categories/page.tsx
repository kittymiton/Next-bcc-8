"use client";

import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import type { Category } from "@/_types/Category";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { token } = useSupabaseSession();

  // 全カテゴリデータのフェッチ
  useEffect(() => {
    if (!token) return;

    const fetcher = async (): Promise<void> => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/categories", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const { categories } = await res.json();
        setCategories(categories);

        //例外がthrowされたらcatch実行
      } catch (error) {
        // Errorインスタンスかチェックしエラーメッセージ保存
        if (error instanceof Error) {
          setError(error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetcher();
  }, [token]);

  return (
    <main>
      <div className="admin-contents">
        <div className="admin-contents__header">
          <h1>カテゴリ一覧</h1>
          <button>
            <Link href="/admin/categories/new">新規作成</Link>
          </button>
        </div>
        <ul className="admin-contents__list">
          {categories.map((category) => (
            <li key={category.id}>
              <Link href={`/admin/categories/${category.id}`}>
                <p>{category.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
