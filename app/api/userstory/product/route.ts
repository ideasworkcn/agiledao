import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
export const dynamic = 'force-dynamic'; // 强制动态渲染

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get('product_id');

    if (!product_id) {
      return NextResponse.json(
        { error: 'product_id is required' },
        { status: 400 }
      );
    }

    const userStories = await prisma.userStory.findMany({
      where: {
        product_id: product_id,
      },
      orderBy: {
        px: 'asc',
      },
      include: {
        feature: true,
      },
    });

    return NextResponse.json(userStories);
  } catch (error) {
    console.error('Error fetching user stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stories' },
      { status: 500 }
    );
  }
}
