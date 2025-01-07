import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import moment from 'moment';

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';




export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get('product_id');
    const user_story_id = searchParams.get('user_story_id');
    const sprint_id = searchParams.get('sprint_id');
    const member_id = searchParams.get('member_id');
    const status = searchParams.get('status');

    const tasks = await prisma.task.findMany({
      where: {
        product_id: product_id as string,
        user_story_id: user_story_id as string,
        sprint_id: sprint_id as string,
        member_id: member_id as string,
        status: status as string,
      },
      include: {
        user_story: true,
        task_hours: true,
      },
      orderBy: {
        px: "asc",
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error in task API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const taskData = await request.json();
    
    // Validate required foreign key relationships
    if (!taskData.product_id || !taskData.user_story_id || !taskData.sprint_id || !taskData.member_id) {
      return NextResponse.json(
        { message: "Missing required foreign key references" },
        { status: 400 }
      );
    }

    // Check if referenced entities exist
    const [product, userStory, sprint, member] = await Promise.all([
      prisma.product.findUnique({ where: { id: taskData.product_id } }),
      prisma.userStory.findUnique({ where: { id: taskData.user_story_id } }),
      prisma.sprint.findUnique({ where: { id: taskData.sprint_id } }),
      prisma.user.findUnique({ 
        where: { id: taskData.member_id },
        select: {
          id: true,
          name: true,
          email: true,
        }
      }),
    ]);

    if (!product) {
      console.error(`Invalid product reference: ${taskData.product_id}`);
      return NextResponse.json(
        { message: "Invalid product reference" },
        { status: 400 }
      );
    }
    if (!userStory) {
      console.error(`Invalid user story reference: ${taskData.user_story_id}`);
      return NextResponse.json(
        { message: "Invalid user story reference" },
        { status: 400 }
      );
    }
    if (!sprint) {
      console.error(`Invalid sprint reference: ${taskData.sprint_id}`);
      return NextResponse.json(
        { message: "Invalid sprint reference" },
        { status: 400 }
      );
    }
    if (!member) {
      console.error(`Invalid member reference: ${taskData.member_id}`);
      return NextResponse.json(
        { message: "Invalid member reference" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        ...taskData,
        create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        assigner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error: unknown) {
    console.error("Error in task API:", error);
    if (error instanceof Error && 'code' in error && error.code === 'P2003') {
      console.error(`Foreign key constraint failed: ${error.message}`);
      return NextResponse.json(
        { message: "Invalid foreign key reference", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const taskData = await request.json();
    const token = cookies().get('token')?.value;
    const session = token ? await verifyToken(token) : null;
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the current task to check permissions
    const currentTask = await prisma.task.findUnique({
      where: { id: taskData.id },
      select: {
        member_id: true,
        assigner_id: true
      }
    });

    if (!currentTask) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    // Check if user is Scrum Master
    const user = await prisma.user.findUnique({
      where: { id: (await session)?.user_id },
      select: { role: true }
    });

    const isScrumMaster = user?.role === 'Scrum Master';

    // If not Scrum Master, check if user is assigned to the task
    if (!isScrumMaster && currentTask.member_id !== (await session)?.user_id) {
      return NextResponse.json(
        { message: "You can only modify tasks assigned to you" },
        { status: 403 }
      );
    }

    // Remove relational fields that can't be directly updated
    const { member, assigner, user_story, task_hours, ...updateData } = taskData;

    const updatedTask = await prisma.task.update({
      where: {
        id: taskData.id,
      },
      data: {
        ...updateData,
        start_time: taskData.start_time ? moment(taskData.start_time).format('YYYY-MM-DD HH:mm:ss') : null,
        end_time: taskData.end_time ? moment(taskData.end_time).format('YYYY-MM-DD HH:mm:ss') : null,
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
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error in task API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
