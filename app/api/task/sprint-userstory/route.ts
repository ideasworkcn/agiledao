import { NextResponse } from "next/server";
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sprint_id = searchParams.get('sprint_id');
    const user_story_id = searchParams.get('user_story_id');

    if (!sprint_id || !user_story_id) {
      return NextResponse.json(
        { message: "Both sprint_id and user_story_id are required" },
        { status: 400 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: {
        sprint_id,
        user_story_id
      },
      orderBy: {
        px: "desc"
      }
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error in sprint-userstory task API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
