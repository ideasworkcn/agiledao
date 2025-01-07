import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sprint_id = searchParams.get('sprint_id');

    if (!sprint_id) {
      return NextResponse.json(
        { error: 'sprint_id is required' },
        { status: 400 }
      );
    }

    const userStories = await prisma.sprintUserStory.findMany({
      where: {
        sprint_id
      },
      include: {
        user_story: true
      }
    });

    // Extract and return UserStory data
    const result = userStories.map(us => us.user_story);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching sprint user stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sprint user stories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sprint_id, user_story_id } = await request.json();

    if (!sprint_id || !user_story_id) {
      return NextResponse.json(
        { error: 'sprint_id and user_story_id are required' },
        { status: 400 }
      );
    }

    // Check if the relationship already exists
    const existingRelation = await prisma.sprintUserStory.findFirst({
      where: {
        sprint_id,
        user_story_id,
      },
    });

    if (existingRelation) {
      return NextResponse.json(
        { error: 'User story already in sprint' },
        { status: 400 }
      );
    }

    // Update user story status to "In Progress"
    await prisma.userStory.update({
      where: { id: user_story_id },
      data: { status: 'In Progress' }
    });

    // Create new relationship
    const sprintUserStory = await prisma.sprintUserStory.create({
      data: {
        sprint_id,
        user_story_id,
      },
    });

    return NextResponse.json(sprintUserStory, { status: 201 });
  } catch (error) {
    console.error('Error adding user story to sprint:', error);
    return NextResponse.json(
      { error: 'Failed to add user story to sprint' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { sprint_id, user_story_id } = await request.json();

    if (!sprint_id || !user_story_id) {
      return NextResponse.json(
        { error: 'sprint_id and user_story_id are required' },
        { status: 400 }
      );
    }

    // Delete the relationship
    await prisma.sprintUserStory.deleteMany({
      where: {
        sprint_id,
        user_story_id,
      },
    });

    // Check if user story is still associated with any sprint
    const remainingRelations = await prisma.sprintUserStory.findMany({
      where: {
        user_story_id,
      },
    });

    // If no remaining relations, update user story status to "To Do"
    if (remainingRelations.length === 0) {
      await prisma.userStory.update({
        where: { id: user_story_id },
        data: { status: 'To Do' }
      });
    }

    return NextResponse.json({ message: 'User story removed from sprint' });
  } catch (error) {
    console.error('Error removing user story from sprint:', error);
    return NextResponse.json(
      { error: 'Failed to remove user story from sprint' },
      { status: 500 }
    );
  }
}
