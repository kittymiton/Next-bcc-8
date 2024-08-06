"use client";

import type { Post } from "@/_types/Post";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetcher = async (): Promise<void> => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          throw new Error("データが見つかりません");
        }
        const { post } = await res.json();
        setPost(post);
      } catch (error) {
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

  if (error) {
    return <div>記事取得エラー: {error.message}</div>;
  }

  if (!post) {
    return <div>記事が存在しません</div>;
  }

  return (
    <main>
      <div className="post-detail">
        <div className="post-info">
          <p>{new Date(post.createdAt).toLocaleDateString()}</p>
          <ul>
            {post.postCategories.map((postCategory) => (
              <li key={postCategory.category.id}>{postCategory.category.name}</li>
            ))}
          </ul>
        </div>
        <h1>{post.title}</h1>
        <p dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </main>
  );
}
