"use client";

import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const hundleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // メールアドレスとパスワードを用いたログイン用のメソッド
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("ログインに失敗しました");
    } else {
      // errorがnull
      router.replace("/admin/posts");
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
          <button type="submit">ログイン</button>
        </div>
      </form>
    </div>
  );
}
