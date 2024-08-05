"use client";

import { SideNavi } from "@/_components/SideNavi";
import type { Category } from "@/_types/Category";
import type { Post } from "@/_types/Post";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { createTheme } from "@mui/material/styles";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { id } = useParams(); //動的にid取得
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [ratio, setRatio] = useState(3 / 4);
  const router = useRouter(); //ページ遷移

  // 記事更新用
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]); //selectedCategoriesは選択されたカテゴリのリストを保持　選択状態を管理

  //const theme = useTheme();
  //console.log(theme.palette.action.selected);
  // TODO そもそも.Mui-selected クラスが適用されてない
  const theme = createTheme({
    palette: {
      action: {
        selected: "rgba(25, 118, 210, 0.08)", // デフォルトの薄い水色に設定
      },
    },
  });
  console.log(theme.palette.action.selected);

  // 更新ボタンの処理
  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの動作をキャンセルします。
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
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
    } catch (error) {
      console.error(error);
    }

    alert("更新しました");
  };

  // 削除ボタンの処理
  const handleDeletePost = async (): Promise<void> => {
    if (!confirm("記事を削除してよいですか")) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("status error");
      }
      alert("記事を削除しました");
      router.push("/admin/posts");
    } catch (error) {
      console.error(error);
      alert("記事の削除に失敗しました");
    }
  };

  // 詳細記事取得　idが変わるたびに実行
  useEffect(() => {
    const fetcher = async (): Promise<void> => {
      try {
        setLoading(true);

        // 投稿データのフェッチ
        const res = await fetch(`/api/admin/posts/${id}`);
        if (!res.ok) {
          throw new Error("データが見つかりません");
        }
        const { post }: { post: Post } = await res.json(); //{Post型}
        console.log(post);
        setPost(post);
        setTitle(post.title);
        setContent(post.content);
        setThumbnailUrl(post.thumbnailUrl);
        // 投稿データのカテゴリ
        setSelectedCategories(post.postCategories.map((postCategory) => postCategory.category));

        // 全カテゴリデータのフェッチ
        const categoriesRes = await fetch("/api/admin/categories");
        const { categories } = await categoriesRes.json();
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
  }, [id]);

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

  // スタイルオブジェクトを生成
  const getStyles = (id: number, selectedIds: number[], theme: any) => {
    return {
      fontWeight: selectedIds.indexOf(id) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightBold,
      backgroundColor: selectedIds.indexOf(id) !== -1 ? theme.palette.action.selected : "transparent",
    };
  };

  if (loading) {
    return <div>読込中・・・</div>;
  }
  //throwされたエラーメッセージが表示
  if (error) {
    return <div>記事取得エラー: {error.message}</div>;
  }

  if (!post) {
    return <div>記事が存在しません</div>;
  }

  return (
    <main>
      <div className="admin-layout">
        <SideNavi />
        <div className="admin-contents">
          <div className="admin-contents__header">
            <h1>記事編集</h1>
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
              {/* MUIのSelectコンポーネント */}
              <Select
                className="w100"
                multiple //multiple属性は選択された値を配列として渡す
                value={selectedCategories}
                // 各選択アクションのたびに選択された項目が配列として管理
                onChange={(e) => handleChange(e.target.value as unknown as number[])} // 最初にunknownに変換し任意の型に変換するための中間ステップを作りnumber[]型に再度変換 コンパイルエラーを防ぐため型アサーションを使用
                // OutlinedInputはアウトラインがある入力フィールドを提供。
                input={<OutlinedInput />} // 入力フィールドがフォーカスされたときにアウトラインが強調されるデザイン
                renderValue={(selected: Category[]) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value: Category) => (
                      // MUIのChipコンポーネントはタグやカテゴリの表示、選択された項目の表示などに使われ、見た目は小さなバッジやラベルのようなものをユーザーに視覚的な情報を提供します。
                      <Chip key={value.id} label={value.name} /> // labelプロパティはChipコンポーネントに表示するテキストを指定（カテゴリ名の表示）
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
            <button type="submit">更新</button>
            <button type="button" onClick={() => handleDeletePost()}>
              削除
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
