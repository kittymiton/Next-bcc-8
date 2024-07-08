"use client";

import { useParams } from "next/navigation";
import Post from "../../components/features/Post";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  //idを数値に変換
  const numId = Number(id);
  return <Post id={numId} />;
}
