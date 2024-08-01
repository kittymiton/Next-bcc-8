import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GETリクエストで呼ばれる関数
export const GET = async (Request: NextRequest) => {
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
