"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CategoryForm } from "../_components/CategoryForm";

export default function Page() {
  const router = useRouter(); //ページ遷移
  const [name, setName] = useState("");

  // 作成ボタンの処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/categories/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }), // バックエンドが受け取る名前
      });

      if (!res.ok) {
        throw new Error("status error");
      }

      const { id } = await res.json();
      // 作成したカテゴリーの詳細ページに遷移
      router.push(`/admin/categories/${id}`);
      alert("作成しました");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <div className="admin-contents">
        <div className="admin-contents__header">
          <h1>カテゴリ作成</h1>
        </div>
        <CategoryForm mode="new" name={name} setName={setName} onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
