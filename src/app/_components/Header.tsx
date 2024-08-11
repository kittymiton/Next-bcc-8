"use client";

import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import Link from "next/link";
import { supabase } from "../../utils/supabase";

export const Header: React.FC = () => {
  // ログアウトボタンの処理
  const handleLogout = async () => {
    await supabase.auth.signOut(); // Supabaseの認証サービスにログアウトのリクエスト送信、ユーザーの認証情報をクリア
    // ログアウト処理が完了後、トップページにリダイレクト
    window.location.href = "/";
  };

  const { session, isLoading } = useSupabaseSession();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">Blog</Link>
          </li>

          {!isLoading && ( //ログイン状態の読み込み中は何も表示しない（画面のちらつき防止)
            <>
              {/* ログイン中 */}
              {session ? (
                <>
                  <li>
                    <Link href="/admin/posts">管理画面</Link>
                  </li>
                  <button onClick={handleLogout}>ログアウト</button>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/contact">お問い合わせ</Link>
                  </li>
                  <li>
                    <Link href="/login">ログイン</Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};
