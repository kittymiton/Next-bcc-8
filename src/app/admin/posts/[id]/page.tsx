"use client";

import { SideNavi } from "@/_components/SideNavi";
import type { Category } from "@/_types/Category";
import type { Post } from "@/_types/Post";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { id } = useParams(); //動的にid取得
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [ratio, setRatio] = useState(3 / 4);
  const router = useRouter(); //ページ遷移

  // 記事更新用
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // 更新ボタンの処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const resf = await fetch(`/api/admin/post${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, thumnailUrl, categories }),
      });

      if (!resf.ok) {
        throw new Error("status error");
      }
    } catch (error) {
      console.error(error);
    }

    alert("記事を更新しました");
  };

  // 削除ボタンの処理
  const handleDeletePost = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    if (!confirm("記事を削除してよいですか")) return;

    try {
      const resd = await fetch(`/api/admin/post${id}`, {
        method: "DELETE",
      });

      if (!resd.ok) {
        throw new Error("status error");
      }
    } catch (error) {
      console.error(error);
    }
    alert("記事を削除しました");
    router.push("/admin/posts");
  };

  // 詳細記事取得
  useEffect(() => {
    const fetcher = async (): Promise<void> => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/posts/${id}`);

        if (!res.ok) {
          throw new Error("データが見つかりません");
        }

        const { post }: { post: Post } = await res.json(); //返されるオブジェクトが{id: number;title:string;content: string;createdAt: number;postCategories: { category: Category }[];thumbnailUrl: string;}という形であることをTSに伝える
        console.log(post);
        setPost(post);

        setTitle(post.title);
        setContent(post.content);
        setThumbnailUrl(post.thumbnailUrl);
        setCategories(post.postCategories.map((postCategory) => postCategory.category));

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

  // カテゴリのリストをフェッチする非同期関数
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const { categories } = await res.json();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

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
      <div className="admin-layout">
        <SideNavi />
        <div className="admin-contents">
          <div className="admin-contents__header">
            <h1>記事編集</h1>
          </div>
          <form>
            <label htmlFor="title">
              タイトル
              {/* htmlFor属性の値とid属性の値でラベルと入力要素が関連付け */}
              <div className="write-area">
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
            </label>
            <label htmlFor="content">
              内容
              <div className="write-area">
                <input type="text" id="content" value={content} onChange={(e) => setContent(e.target.value)} />
              </div>
            </label>
            <label htmlFor="thumbnailUrl">
              サムネイルURL
              <div className="write-area">
                <input type="text" id="thumbnailUrl" value={thumbnailUrl} onChange={(e) => setContent(e.target.value)} />
              </div>
            </label>

            <label htmlFor="category">
              {/* 記事に設定されたカテゴリを最初から表示するには？ */}
              カテゴリ
              <div className="write-area">
                <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">選択してください</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <p dangerouslySetInnerHTML={{ __html: post.content }} />
          </form>
        </div>
      </div>
    </main>
  );
}
