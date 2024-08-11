"use client";

import type { Post } from "@/_types/Post";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "./../../../utils/supabase";

export default function Page() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null);

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

  // DBに保存しているthumbnailImageKeyを元に、Supabaseから画像のURLを取得
  useEffect(() => {
    if (!post?.thumbnailImageKey) return;

    // Supabaseの公開画像URLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage.from("post_thumbnail").getPublicUrl(post.thumbnailImageKey);
      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [post?.thumbnailImageKey]);

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
        {thumbnailImageUrl && <Image src={thumbnailImageUrl} alt="サムネイル" width={400} height={300} />}
      </div>
    </main>
  );
}
