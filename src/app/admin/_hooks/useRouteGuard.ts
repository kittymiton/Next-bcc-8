// 未ログイン状態で管理者ページにアクセスできないように制限

import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRouteGuard = () => {
  const router = useRouter(); // routerオブジェクトを取得し、現在のルーターの状態（URLなど）を管理
  const { session } = useSupabaseSession();

  // ログイン状態の確認 このhookをインポートしたコンポーネントの初回レンダリング時に発火
  useEffect(() => {
    if (session === undefined) return; // セッションの状態が完全に確定してから適切な処理（ログインチェックやリダイレクト）が行われるようにしています。undefinedの場合はセッションの状態がまだ読み込まれていないか、非同期で処理中。セッション情報が完全に取得されるまで、無駄な処理やエラーの発生、画面のちらつきや不整合を防ぎます。

    const feather = async () => {
      // ルーターがsessionの状態を確認
      if (session === null) {
        // 未ログイン時はログインページにリダイレクト
        router.replace("/login");
      }
    };
    feather();
  }, [router, session]); // 依存配列にルーターとセッション状態を含める
  // たとえばユーザーが/adminページに遷移、まずセッションの状態 (session と isLoading) 確認、レンダリング、useEffect実行。セッションの状態確認が先に行われ、その結果に応じてリダイレクトが実行
};
