"use client";

import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import type { Post } from "@/_types/Post";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { token } = useSupabaseSession();

  useEffect(() => {
    if (!token) return;

    const featcher = async (): Promise<void> => {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/posts", {
          // fetchの第二引数のオプションでheadersを指定
          headers: {
            "Content-Type": "application/json",
            // Authorizationというキー名で、tokenを持たせる
            Authorization: token, // サーバーにtokenを送信
          },
        });

        if (!res.ok) {
          throw new Error("データがみつかりません");
        }
        const { posts } = await res.json();
        setPosts([...posts]); // postsのコピーを作成し、それをセットする
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        }
      } finally {
        setLoading(false);
      }
    };
    featcher();
  }, [token]);

  if (loading) {
    return <div>読込中・・・</div>;
  }
  if (error) {
    return <div>記事取得エラー:{error.message}</div>;
  }
  if (!posts) {
    return <div>記事が存在しません</div>;
  }

  return (
    <main>
      <div className="admin-contents">
        <div className="admin-contents__header">
          <h1>記事一覧</h1>
          <button>
            <Link href="/admin/posts/new">新規作成</Link>
          </button>
        </div>
        <ul className="admin-contents__list">
          {/* 取得したpostsデータが配列なのでmapでloop */}
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/admin/posts/${post.id}`}>
                <div className="post">
                  <div>
                    <h1>{post.title}</h1>
                    <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
