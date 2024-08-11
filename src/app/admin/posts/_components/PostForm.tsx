"use client";

import { Category } from "@/_types/Category";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../../../utils/supabase";
import { CategoriesSelect } from "./CategoriesSelect"; // 同じ階層のインポートはエイリアスを使用できない

// 定義
type PostForm = {
  mode: "new" | "edit";
  title: string;
  setTitle: (title: string) => void; // 新たにセットしたタイトルをそのまま渡す
  content: string;
  setContent: (content: string) => void;
  thumbnailImageKey: string;
  setThumbnailImageKey: (thumbnailImageKey: string) => void;
  categories: Category[];
  selectedCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
};

// 引数として受け取り、PostFormにバインド
export const PostForm: React.FC<PostForm> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailImageKey,
  setThumbnailImageKey,
  categories,
  selectedCategories,
  setSelectedCategories,
  onSubmit,
  onDelete,
}) => {
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null);

  // 画像選択時に実行される関数
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    // 画像が未選択、0枚の場合は処理終了
    if (!e?.target.files || e.target.files.length == 0) {
      return;
    }

    // 画像ファイルを取得
    const file = e.target.files[0];

    // 保存場所を一意（ユニーク）に設定
    const filePath = `private/${uuidv4()}`;

    // Supabaseのストレージに画像ファイルをアップロード
    const { data, error } = await supabase.storage.from("post_thumbnail").upload(filePath, file, {
      cacheControl: "3600", // 3600秒（1時間）
      upsert: false, // 同名ファイルは、上書きしない
    });

    // アップロードエラー
    if (error) {
      alert(error.message);
      return;
    }
    setThumbnailImageKey(data.path);
  };

  // thumbnailImageKey（Supabaseストレージ内で画像が保存されている場所）から画像URLを取得
  useEffect(() => {
    if (!thumbnailImageKey) return;

    // Supabaseの公開画像URLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage.from("post_thumbnail").getPublicUrl(thumbnailImageKey);
      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey]);

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
      <label htmlFor="thumbnailImageKey">サムネイルURL</label>
      <div className="write-area">
        <input type="file" id="thumbnailImagesKey" onChange={handleImageChange} accept="image/*" />
      </div>
      {thumbnailImageUrl && <Image src={thumbnailImageUrl} alt="サムネイル" width={400} height={300} />}
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
