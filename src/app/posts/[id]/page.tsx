"use client";

import { API_BASE_URL } from "@/_constants/constants";
import type { MicroCmsPost } from "@/_types/MicroCmsPost";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { id } = useParams();
  const [post, setPost] = useState<MicroCmsPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [ratio, setRatio] = useState(3 / 4);

  useEffect(() => {
    const fetcher = async (): Promise<void> => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
          headers: {
            // fetch関数の第二引数にheadersを設定、APIキー設定
            "X-MICROCMS-API-KEY": process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string,
          },
        });
        if (!res.ok) {
          throw new Error("データが見つかりません");
        }
        const data = await res.json();
        //console.log(data);
        setPost(data); // dataをそのままセット
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
    return <div>一覧記事取得エラー: {error.message}</div>;
  }

  if (!post) {
    return <div>記事が存在しません</div>;
  }

  return (
    <main>
      <div className="post-detail">
        <Image
          src={post.thumbnail.url}
          alt={post.title}
          layout="responsive"
          objectFit="cover"
          width={280}
          height={Math.round(280 * ratio)}
          onLoadingComplete={({ naturalWidth, naturalHeight }) => {
            setRatio(naturalHeight / naturalWidth);
          }}
        />
        <div className="post-info">
          <p>{new Date(post.createdAt).toLocaleDateString()}</p>
          <ul>
            {post.categories?.map((category) => (
              <li key={category.id}>{category.name}</li>
            ))}
          </ul>
        </div>
        <h1>{post.title}</h1>
        <p dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </main>
  );
}
