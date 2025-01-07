import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const userStories = await request.json();
    
    // 验证输入
    if (!Array.isArray(userStories)) {
      return NextResponse.json(
        { error: 'Invalid input: expected array of user stories' },
        { status: 400 }
      );
    }

    // 使用事务处理批量更新
    const result = await prisma.$transaction(
      userStories.map(userStory => 
        prisma.userStory.update({
          where: { id: userStory.id },
          data: {
            px: userStory.px,
            feature_id: userStory.feature_id // 同时更新feature_id
          }
        })
      )
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Failed to batch update user stories:', error);
    return NextResponse.json(
      { error: 'Failed to batch update user stories' },
      { status: 500 }
    );
  }
}
