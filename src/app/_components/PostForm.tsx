"use client";

import { Button } from "@/contact/_components/Button";
import { Label } from "@/contact/_components/Label";
import { TextInput } from "@/contact/_components/TextInput";

type Props = {
  mode: "new" | "edit";
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumnailUrl: string;
  setThumnailUrl: (thumnailUrl: string) => void;
  categories: string;
  setCategories: (categories: string) => void;
  onSubmit: any;
  onDelete: any;
};

export const PostForm: React.FC<Props> = ({ mode, title, setTitle, content, setContent, thumnailUrl, setThumnailUrl, categories, setCategories, onSubmit, onDelete }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="title" tag="タイトル" />
        <div className="write-area">
          <TextInput id="title" type="text" value={title} onChange={(value): void => setTitle(value)} />
        </div>

        <Label htmlFor="content" tag="本文" />
        <div className="write-area">
          <TextInput id="content" type="text" value={title} onChange={(value): void => setContent(value)} />
        </div>

        <Label htmlFor="thumnailUrl" tag="画像" />
        <div className="write-area">
          <TextInput id="thumnailUrl" type="text" value={title} onChange={(value): void => setThumnailUrl(value)} />
        </div>
        <Label htmlFor="categories" tag="カテゴリ" />
        <div className="write-area">
          <TextInput id="categories" type="text" value={title} onChange={(value): void => setCategories(value)} />
        </div>
        <Label />
        <Button type="submit" tag="更新" />
        <Button type="button" tag="削除" onClick={clearHandler} />
      </form>
    </div>
  );
};
