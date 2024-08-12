"use client";

import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

// ログイン状態をチェック
export const useSupabaseSession = () => {
  // undefined:ログイン状態ロード中 null:未ログイン Session:ログインしている
  const [session, setSettion] = useState<Session | null | undefined>(undefined); // undefinedから型推論ができないため明示的に型指定。Session型やnullがセットされることを想定。
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      const {
        // 取得したセッションからdataオブジェクト内のsessionオブジェクト（プロパティ）を抽出
        data: { session }, // session内にaccess_token、refresh_token、userなどのプロパティが含まれている。
        // 認証情報を取得するための関数。現在のセッション情報を返却。ログインしているかどうか。
      } = await supabase.auth.getSession();

      //console.log(session);
      setSettion(session);
      // ログイン中の場合はユーザー情報を取得 未ログインであれば、nullが返却
      setToken(session?.access_token || null);
      // ログイン状態の確認中かどうかの状態。
      setIsLoading(false); // falseで処理完了状態をセット trueはデータの取得や処理がまだ完了していない状態（ローディング中）。
    };
    fetcher();
  }, []);

  return { session, isLoading, token }; // 複数の値を分割代入でオブジェクトとしてコンポーネントに渡す
};
