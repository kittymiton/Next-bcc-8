import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GETリクエストで呼ばれる関数
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } } // 第二引数でリクエストパラメータを受け取る(paramsオブジェクトを通じidという名前のパラメータを受け取る)
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

// PUTリクエストで呼ばれる関数
export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  // paramsの中にidが入っているので、それを取り出す
  const { id } = params;

  // リクエストのbodyを取得
  const { title, content, categories, thumbnailUrl } = await request.json();

  try {
    // idを指定して、Postを更新
    const post = await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        content,
        thumbnailUrl,
      },
    });

    // 一旦、記事とカテゴリーの中間テーブルのレコードを全て削除
    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    });

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: category.id,
        },
      });
    }

    return NextResponse.json({ status: "OK", post: post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// DELETEリクエストで呼ばれる関数
export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  // リクエストのbodyを取得
  const { title, content, categories, thumbnailUrl } = await request.json();

  try {
    // idを指定して、Postを削除
    const post = await prisma.post.delete({
      where: {
        id: parseInt(id), // IDを数値に変換
      },
    });

    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
