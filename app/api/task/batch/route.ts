import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const tasks = await request.json();
    
    // Validate input
    if (!Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'Invalid input: expected array of tasks' },
        { status: 400 }
      );
    }

    // Use transaction for batch update
    const result = await prisma.$transaction(
      tasks.map(task => 
        prisma.task.update({
          where: { id: task.id },
          data: {
            px: task.px,
            status: task.status,
            start_time: task.start_time,
            end_time: task.end_time
          },
          include: {
            member: {
              select: {
                id: true,
                name: true
              }
            },
            assigner: {
              select: {
                id: true,
                name: true
              }
            }
          }
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: 'Tasks updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Failed to batch update tasks:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to batch update tasks',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
