"use client";

type CategoryForm = {
  mode: "new" | "edit";
  name: string;
  setName: (content: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
};

export const CategoryForm: React.FC<CategoryForm> = ({ mode, name, setName, onSubmit, onDelete }) => {
  return (
    <form onSubmit={onSubmit}>
      {/* onSubmit属性でフォームが送信される際に実行されるJSを指定 */}
      <label htmlFor="category">カテゴリ</label>
      {/* htmlFor属性の値とid属性の値でラベルと入力要素が関連付け */}
      <div className="write-area">
        <input type="text" id="category" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      {/* フォームの送信をトリガー */}
      <div className="button-mode">
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
