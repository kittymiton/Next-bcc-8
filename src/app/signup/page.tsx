"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabase";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const hundleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      // email,passwordを送信して登録
      email,
      password,
      options: {
        emailRedirectTo: `htt@://localhost:3000/login`, // 認証用に送付するメールに、登録完了ページ用のURLを指定できる
      },
    });
    if (error) {
      alert("登録に失敗しました");
      console.error(error);
    } else {
      setEmail("");
      setPassword("");
      alert("確認メールを送信しました");
    }
  };

  return (
    <div className="admin-contents">
      <form onSubmit={hundleSubmit}>
        {/* onSubmit属性でフォームが送信される際に実行されるJSを指定 */}
        <label htmlFor="email">メールアドレス</label>
        {/* htmlFor属性の値とid属性の値でラベルと入力要素が関連付け */}
        <div className="write-area">
          <input
            type="email"
            id="email"
            value={email}
            placeholder="name@campany.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <label htmlFor="content">パスワード</label>
        <div className="write-area">
          <input
            type="password"
            id="password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-mode">
          <button type="submit">登録</button>
        </div>
      </form>
    </div>
  );
}
