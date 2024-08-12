"use client";

import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import type { Category } from "@/_types/Category";
import type { Post } from "@/_types/Post";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PostForm } from "../_components/PostForm";

export default function Page() {
  const { id } = useParams(); //動的にid取得
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter(); //ページ遷移

  // 記事更新用
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnaiImageKey] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const { token } = useSupabaseSession();

  // 詳細記事取得 idが変わるたびに実行
  useEffect(() => {
    if (!token) return;

    const fetcher = async (): Promise<void> => {
      try {
        setLoading(true);

        // 投稿データのフェッチ
        const res = await fetch(`/api/admin/posts/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        if (!res.ok) {
          throw new Error("データが見つかりません");
        }
        const { post }: { post: Post } = await res.json(); //{Post型}
        //console.log(post);
        setPost(post);
        setTitle(post.title);
        setContent(post.content);
        setThumbnaiImageKey(post.thumbnailImageKey);
        setSelectedCategories(post.postCategories.map((postCategory) => postCategory.category));

        // 全カテゴリデータのフェッチ
        const categoriesRes = await fetch("/api/admin/categories", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const { categories } = await categoriesRes.json();
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
  }, [id, token]);

  // 更新ボタンの処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
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
      alert("更新しました");
    } catch (error) {
      console.error(error);
    }
  };

  // 削除ボタンの処理
  const handleDeletePost = async (): Promise<void> => {
    if (!confirm("記事を削除してよいですか")) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application.json",
          Authorization: token!,
        },
      });

      if (!res.ok) {
        throw new Error("status error");
      }
      alert("記事を削除しました");
      router.push("/admin/posts");
    } catch (error) {
      console.error(error);
      alert("記事の削除に失敗しました");
    }
  };

  if (loading) {
    return <div>読込中・・・</div>;
  }
  //throwされたエラーメッセージが表示
  if (error) {
    return <div>記事取得エラー: {error.message}</div>;
  }

  if (!post) {
    return <div>記事が存在しません</div>;
  }

  return (
    <main>
      <div className="admin-contents">
        <div className="admin-contents__header">
          <h1>記事編集</h1>
        </div>
        {/* PostFormに渡す */}
        <PostForm
          mode="edit"
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          thumbnailImageKey={thumbnailImageKey}
          setThumbnailImageKey={setThumbnaiImageKey}
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          onSubmit={handleSubmit}
          onDelete={handleDeletePost}
        />
      </div>
    </main>
  );
}
