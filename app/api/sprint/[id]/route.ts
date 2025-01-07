import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sprint = await prisma.sprint.findUnique({
      where: { id: params.id },
      include: {
        sprint_user_stories: {
          include: {
            user_story: true
          }
        }
      }
    });

    if (!sprint) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
    }

    return NextResponse.json(sprint);
  } catch (error) {
    console.error('Failed to fetch sprint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sprint' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // First delete related SprintUserStory records
    await prisma.sprintUserStory.deleteMany({
      where: { sprint_id: params.id }
    });

    // Then delete the sprint
    const deletedSprint = await prisma.sprint.delete({
      where: { id: params.id }
    });

    return NextResponse.json(deletedSprint);
  } catch (error) {
    console.error('Failed to delete sprint:', error);
    return NextResponse.json(
      { error: 'Failed to delete sprint' },
      { status: 500 }
    );
  }
}
