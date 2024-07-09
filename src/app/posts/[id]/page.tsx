"use client";

import Post from "@/_components/Post";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  //idを数値に変換
  const numId = Number(id);
  return <Post id={numId} />;
}
