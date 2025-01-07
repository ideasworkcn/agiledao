import { NextResponse } from "next/server";
import prisma from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: {
        user_story: true,
        task_hours: true,
      },
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
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
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 首先删除关联的工时记录
    await prisma.taskHour.deleteMany({
      where: { task_id: params.id },
    });

    // 然后删除任务
    const deletedTask = await prisma.task.delete({
      where: { id: params.id },
    });

    return NextResponse.json(deletedTask);
  } catch (error) {
    console.error("删除任务时出错:", error);
    return NextResponse.json(
      { message: "服务器内部错误" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
