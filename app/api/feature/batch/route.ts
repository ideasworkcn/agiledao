import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const features = await request.json();
    
    // 验证输入
    if (!Array.isArray(features)) {
      return NextResponse.json(
        { error: 'Invalid input: expected array of features' },
        { status: 400 }
      );
    }

    // 使用事务处理批量更新
    const result = await prisma.$transaction(
      features.map(feature => 
        prisma.feature.update({
          where: { id: feature.id },
          data: {
            px: feature.px,
            epic_id: feature.epic_id
          }
        })
      )
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to batch update features:', error);
    return NextResponse.json(
      { error: 'Failed to batch update features' },
      { status: 500 }
    );
  }
}