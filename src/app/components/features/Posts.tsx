"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../constants/constants";
import type { PostType } from "../types/PostType";

export default function Posts() {
  // 初期値[空配列]設定でpostsがundefindでmapメソッドのエラー回避
  const [posts, setPosts] = useState<PostType[]>([]);

  // Loadingの格納・表示
  // 初期ロード時は無効
  const [loading, setLoading] = useState<boolean>(false);

  // featchエラーの格納・表示
  // JSで空配列[]はtruthy。nullはfalsy。
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetcher = async (): Promise<void> => {
      try {
        // ローディングインジケーター表示
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/posts`);
        if (!res.ok) {
          // consoleに表示
          throw new Error("データが見つかりません");
        }
        const { posts } = (await res.json()) as { posts: PostType[] };
        setPosts(posts);
      } catch (error) {
        // errorは最初にunknown型として扱われる
        if (error instanceof Error) {
          setError(error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetcher();
  }, []);

  // ローディング中
  if (loading) {
    return <div>読込中・・・</div>;
  }

  // fetchエラー
  if (error) {
    return <div> 記事取得エラー: {error.message}</div>;
  }

  // 取得したデータが空である場合
  if (!loading && !posts) {
    return <div>記事が存在しません</div>;
  }

  return (
    <main>
      <ul>
        {/* 取得したpostsデータが配列なのでmapでloop */}
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`posts/${post.id}`}>
              <div className="post">
                <div className="post-info">
                  <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                  <ul>
                    {post.categories.map((category) => (
                      <li key={category}>{category}</li>
                    ))}
                  </ul>
                </div>
                <h1>{post.title}</h1>
                <p dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
