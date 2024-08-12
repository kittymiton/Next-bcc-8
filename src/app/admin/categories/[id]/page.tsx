"use client";

import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CategoryForm } from "../_components/CategoryForm";

export default function Page() {
  const { id } = useParams(); //動的にid取得
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter(); //ページ遷移
  const [name, setName] = useState("");
  const { token } = useSupabaseSession();

  // 更新ボタンの処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // 認証済みを証明するためのトークンを送信
          Authorization: token!, // ！は非nullアサーションオペレーターでtokenの値をそのまま使う。ログイン済みのユーザーが関数を実行している前提。
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error("status error");
      }
    } catch (error) {
      console.error(error);
    }

    alert("カテゴリを更新しました");
  };

  // 削除ボタンの処理
  const handleDeletePost = async (): Promise<void> => {
    if (!confirm("カテゴリを削除してよいですか")) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Autherization: token!,
        },
      });

      if (!res.ok) {
        throw new Error("status error");
      }
      alert("カテゴリを削除しました");
      router.push("/admin/categories");
    } catch (error) {
      console.error(error);
      alert("カテゴリの削除に失敗しました");
    }
  };

  // カテゴリデータのフェッチ
  useEffect(() => {
    if (!token) return;

    const fetcher = async (): Promise<void> => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/categories/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // サーバーにtokenを送信
          },
        });
        if (!res.ok) {
          throw new Error("カテゴリデータが見つかりません");
        }
        const { category } = await res.json();
        //console.log(category);
        setName(category.name);

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
  }, [id, token]);

  if (loading) {
    return <div>読込中・・・</div>;
  }
  //throwされたエラーメッセージが表示
  if (error) {
    return <div>カテゴリ取得エラー: {error.message}</div>;
  }

  return (
    <main>
      <div className="admin-contents">
        <div className="admin-contents__header">
          <h1>カテゴリ編集</h1>
        </div>
        <CategoryForm mode="edit" name={name} setName={setName} onSubmit={handleSubmit} onDelete={handleDeletePost} />
      </div>
    </main>
  );
}
