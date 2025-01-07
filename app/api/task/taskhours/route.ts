import { NextResponse } from "next/server";
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const task_id = searchParams.get('task_id');
    
    if (!task_id) {
      return NextResponse.json(
        { message: "Task ID is required" },
        { status: 400 }
      );
    }

    const taskHours = await prisma.taskHour.findMany({
      where: {
        task_id: task_id
      },
      orderBy: {
        create_time: "desc"
      }
    });

    return NextResponse.json(taskHours);
  } catch (error) {
    console.error("Error in task hours API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
