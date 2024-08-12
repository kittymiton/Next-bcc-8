"use client";

import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import type { Category } from "@/_types/Category";
import { PostForm } from "@/admin/posts/_components/PostForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter(); //ページ遷移

  // 新規記事作成用
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

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

  // 作成ボタンの処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/posts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authrization: token!,
        },
        body: JSON.stringify({
          title,
          content,
          thumbnailImageKey,
          categories: selectedCategories,
        }),
      });

      if (!res.ok) {
        throw new Error("status error");
      }

      const { id } = await res.json();
      // 作成した記事の詳細ページに遷移
      router.push(`/admin/posts/${id}`);
      alert("作成しました");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <div className="admin-contents">
        <div className="admin-contents__header">
          <h1>記事作成</h1>
        </div>
        {/* PostFormに渡す */}
        <PostForm
          mode="new"
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          thumbnailImageKey={thumbnailImageKey}
          setThumbnailImageKey={setThumbnailImageKey}
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  );
}
