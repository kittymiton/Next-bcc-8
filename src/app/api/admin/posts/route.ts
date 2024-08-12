import { supabase } from "@/utils/supabase";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GETリクエストで呼ばれる関数
export const GET = async (request: NextRequest) => {
  // 認証情報を取得
  const token = request.headers.get("Authorization") ?? ""; // 左側の値がnullまたはundefinedである場合、右側の値を返す

  // supabaseにtoken送信
  const { error } = await supabase.auth.getUser(token);

  // 送信されたtokenがSupabaseで検証され、無効（期限切、一致しない）であればエラー
  if (error) return NextResponse.json({ status: error.message }, { status: 400 });

  try {
    // Post一覧をDBから取得　findManyで複数のレコードを取得できる
    const posts = await prisma.post.findMany({
      include: {
        // カテゴリも含めて取得
        postCategories: {
          include: {
            category: {
              // カテゴリのidとnameだけ取得
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      // 作成日時降順
      orderBy: {
        createdAt: "desc",
      },
    });

    // レスポンスを返す
    return NextResponse.json({ status: "OK", posts: posts }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// 記事作成のリクエストボディの型
type CreatePostRequestBody = {
  title: string;
  content: string;
  categories: { id: number }[];
  thumbnailImageKey: string;
};

// POSTで呼ばれる関数
export const POST = async (request: Request, context: any) => {
  try {
    // リクエストのbodyを取得
    const body = await request.json();
    const { title, content, categories, thumbnailImageKey }: CreatePostRequestBody = body;

    // 投稿をDBに生成
    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    });

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: data.id,
        },
      });
    }

    // レスポンスを返す
    return NextResponse.json({
      status: "OK",
      message: "作成しました",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
