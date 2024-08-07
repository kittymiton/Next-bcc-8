"use client";

import { Category } from "@/_types/Category";
import { CategoriesSelect } from "./CategoriesSelect"; // 同じ階層のインポートはエイリアスを使用できない

// 定義
type PostForm = {
  mode: "new" | "edit";
  title: string;
  setTitle: (title: string) => void; // 新たにセットしたタイトルをそのまま渡す
  content: string;
  setContent: (content: string) => void;
  thumbnailUrl: string;
  setThumbnailUrl: (thumbnailUrl: string) => void;
  categories: Category[];
  selectedCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
};

// 引数として受け取り、フォームにバインド
export const PostForm: React.FC<PostForm> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailUrl,
  setThumbnailUrl,
  categories,
  selectedCategories,
  setSelectedCategories,
  onSubmit,
  onDelete,
}) => {
  return (
    <form onSubmit={onSubmit}>
      {/* onSubmit属性でフォームが送信される際に実行されるJSを指定 */}
      <label htmlFor="title">タイトル</label>
      {/* htmlFor属性の値とid属性の値でラベルと入力要素が関連付け */}
      <div className="write-area">
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <label htmlFor="content">内容</label>
      <div className="write-area">
        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <label htmlFor="thumbnailUrl">サムネイルURL</label>
      <div className="write-area">
        <input type="text" id="thumbnailUrl" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />
      </div>
      <label htmlFor="category">カテゴリ</label>
      {/* CategoriesSelectに渡す */}
      <CategoriesSelect
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      {/* フォームの送信をトリガー */}
      <div className="button-mode">
        {/* modeでボタンのラベル出し分け*/}
        <button type="submit">{mode === "new" ? "作成" : "更新"}</button>
        {mode === "edit" && (
          <button type="button" onClick={onDelete}>
            削除
          </button>
        )}
      </div>
    </form>
  );
};
