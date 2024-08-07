"use client";

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
  const [thumbnailUrl, setThumbnailUrl] = useState("https://placehold.jp/800x400.png");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  // 全カテゴリデータのフェッチ
  useEffect(() => {
    const fetcher = async (): Promise<void> => {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/categories");
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
  }, []);

  // 作成ボタンの処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/posts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          thumbnailUrl,
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
          thumbnailUrl={thumbnailUrl}
          setThumbnailUrl={setThumbnailUrl}
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  );
}
