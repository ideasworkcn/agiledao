import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userStory = await prisma.userStory.findUnique({
      where: { id: params.id },
    });
    if (!userStory) {
      return NextResponse.json({ error: 'User story not found' }, { status: 404 });
    }
    return NextResponse.json(userStory);
  } catch (error) {
    console.error('Failed to fetch user story:', error);
    return NextResponse.json({ error: 'Failed to fetch user story' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.userStory.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'User story deleted successfully' });
  } catch (error) {
    console.error('Failed to delete user story:', error);
    return NextResponse.json({ error: 'Failed to delete user story' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updatedUserStory = await prisma.userStory.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(updatedUserStory);
  } catch (error) {
    console.error('Failed to update user story:', error);
    return NextResponse.json({ error: 'Failed to update user story' }, { status: 500 });
  }
}