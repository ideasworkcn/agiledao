import { NextResponse } from "next/server";
import prisma from '@/lib/db';
export const dynamic = 'force-dynamic'; // 强制动态渲染

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sprint_id = searchParams.get('sprint_id');

    if (!sprint_id) {
      return NextResponse.json(
        { error: 'sprint_id is required' },
        { status: 400 }
      );
    }

    // Get all user stories in the sprint with their tasks
    const sprintUserStories = await prisma.sprintUserStory.findMany({
      where: {
        sprint_id: sprint_id // Keep as string to match Prisma type
      },
      include: {
        user_story: {
          include: {
            tasks: {
              where: {
                sprint_id: sprint_id // Keep as string to match Prisma type
              },
              orderBy: {
                px: 'desc'
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
            }
          }
        }
      }
    });

    // Transform data to match expected format
    const result = sprintUserStories.map(sus => ({
      ...sus.user_story,
      tasks: sus.user_story?.tasks || [] // Add optional chaining and fallback
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching sprint user stories and tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sprint user stories and tasks' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
