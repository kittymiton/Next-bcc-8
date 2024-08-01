import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GETリクエストで呼ばれる関数
export const GET = async (request: NextRequest) => {
  try {
    // カテゴリの一覧をDBから取得
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // レスポンスを返す
    return NextResponse.json({ status: "OK", categories }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// カテゴリーの作成時に送られてくるリクエストのbodyの型
interface CreateCategoryRequestBody {
  name: string;
}
// POSTリクエストで呼ばれる関数
export const POST = async (request: Request, context: any) => {
  try {
    // リクエストbodyを取得
    const body = await request.json();

    const { name }: CreateCategoryRequestBody = body;

    const data = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json({ status: "OK", message: "作成しました", id: data.id });
  } catch (error) {
    if (error instanceof Error) return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
