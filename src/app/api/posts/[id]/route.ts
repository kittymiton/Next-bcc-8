import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GETリクエストで呼ばれる関数
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } } // 第二引数でリクエストパラメータを受け取る
) => {
  const { id } = params;
  try {
    //idを元にPostをDBから取得　findUniqueで一つのレコードを取得できる
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
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
    });

    // レスポンスを返す
    return NextResponse.json({ status: "OK", post: post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
