"use client";

import { SideNavi } from "@/_components/SideNavi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { id } = useParams(); //動的にid取得
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter(); //ページ遷移
  const [name, setName] = useState("");

  // 更新ボタンの処理
  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの動作をキャンセルします。
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
    const fetcher = async (): Promise<void> => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/categories/${id}`);
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
  }, [id]);

  if (loading) {
    return <div>読込中・・・</div>;
  }
  //throwされたエラーメッセージが表示
  if (error) {
    return <div>カテゴリ取得エラー: {error.message}</div>;
  }

  return (
    <main>
      <div className="admin-layout">
        <SideNavi />
        <div className="admin-contents">
          <div className="admin-contents__header">
            <h1>カテゴリ編集</h1>
          </div>
          <form onSubmit={handleSubmit}>
            {/* onSubmit属性でフォームが送信される際に実行されるJSを指定 */}
            <label htmlFor="category">カテゴリ名</label>
            {/* htmlFor属性の値とid属性の値でラベルと入力要素が関連付け */}
            <div className="write-area">
              <input type="text" id="category" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {/* フォームの送信をトリガー */}
            <div className="button-mode">
              <button type="submit">更新</button>
              <button type="button" onClick={() => handleDeletePost()}>
                削除
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
