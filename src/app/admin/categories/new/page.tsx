"use client";

import { SideNavi } from "@/_components/SideNavi";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      <div className="admin-layout">
        <SideNavi />
        <div className="admin-contents">
          <div className="admin-contents__header">
            <h1>カテゴリ作成</h1>
          </div>
          <form onSubmit={handleSubmit}>
            {/* onSubmit属性でフォームが送信される際に実行されるJSを指定 */}
            <label htmlFor="category">カテゴリ</label>
            {/* htmlFor属性の値とid属性の値でラベルと入力要素が関連付け */}
            <div className="write-area">
              <input type="text" id="category" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {/* フォームの送信をトリガー */}
            <button type="submit">作成</button>
          </form>
        </div>
      </div>
    </main>
  );
}
