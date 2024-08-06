"use client";

import { SideNavi } from "@/_components/SideNavi";
import type { Category } from "@/_types/Category";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { createTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter(); //ページ遷移

  // 新規記事作成用
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("https://placehold.jp/800x400.png");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  // 全カテゴリデータのフェッチ
  useEffect(() => {
    const fetcher = async (): Promise<void> => {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/categories");
        const { categories } = await res.json();
        setCategories(categories);

        //例外がthrowされたらcatch実行
      } catch (error) {
        // Errorインスタンスかチェックしエラーメッセージ保存
        if (error instanceof Error) {
          setError(error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetcher();
  }, []);

  // カテゴリ選択解除する関数
  const handleChange = (value: number[]) => {
    value.forEach((valueId: number) => {
      const isSelect = selectedCategories.some((category) => category.id === valueId);
      if (isSelect) {
        setSelectedCategories(selectedCategories.filter((category) => category.id !== valueId));
        return;
      }
      const category = categories.find((category) => category.id === valueId);
      if (!category) return;
      setSelectedCategories([...selectedCategories, category]);
    });
  };

  // 作成ボタンの処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/posts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          thumbnailUrl,
          categories: selectedCategories,
        }),
      });

      if (!res.ok) {
        throw new Error("status error");
      }

      const { id } = await res.json();
      // 作成した記事の詳細ページに遷移
      router.push(`/admin/posts/${id}`);
      alert("作成しました");
    } catch (error) {
      console.error(error);
    }
  };

  // スタイルオブジェクトを生成
  const getStyles = (id: number, selectedIds: number[], theme: any) => {
    return {
      fontWeight: selectedIds.indexOf(id) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightBold,
      backgroundColor: selectedIds.indexOf(id) !== -1 ? theme.palette.action.selected : "transparent",
    };
  };

  // TODO そもそも.Mui-selectedクラスが適用されてない
  const theme = createTheme({
    palette: {
      action: {
        selected: "rgba(25, 118, 210, 0.08)", // デフォルトの薄い水色
      },
    },
  });

  return (
    <main>
      <div className="admin-layout">
        <SideNavi />
        <div className="admin-contents">
          <div className="admin-contents__header">
            <h1>記事作成</h1>
          </div>
          <form onSubmit={handleSubmit}>
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
              <input
                type="text"
                id="thumbnailUrl"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
              />
            </div>

            <label htmlFor="category">カテゴリ</label>
            <FormControl sx={{ width: 500 }}>
              <Select
                className="w100"
                multiple // multipleは選択された値を配列として渡す
                value={selectedCategories}
                // 各選択アクションのたびに選択された項目が配列として管理
                onChange={(e) => handleChange(e.target.value as unknown as number[])} // 最初にunknown 任意の型に変換するため中間ステップを作りnumber[]型に再度変換
                input={<OutlinedInput />} // フォーカス時にアウトラインが強調されるデザイン
                renderValue={(selected: Category[]) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((category: Category) => (
                      <Chip key={category.id} label={category.name} /> // Chipはタグやカテゴリ、選択された項目の表示などに使われ小さなバッジやラベルのようなものを提供
                    ))}
                  </Box>
                )}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category.id}
                    value={category.id}
                    sx={getStyles(
                      category.id,
                      selectedCategories.map((category) => category.id),
                      theme
                    )}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* フォームの送信をトリガー */}
            <button type="submit">作成</button>
          </form>
        </div>
      </div>
    </main>
  );
}
