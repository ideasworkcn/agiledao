import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const userStories = await prisma.userStory.findMany();
    return NextResponse.json(userStories);
  } catch (error) {
    console.error('Failed to fetch user stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, importance, estimate, howtodemo, px, fzr, feature_id, product_id } = await request.json();
    
    // Get max number for the product
    const lastUserStory = await prisma.userStory.findFirst({
      where: { 
        product_id
      },
      orderBy: { number: 'desc' },
    });
    
    let newNumber = 1;
    if (lastUserStory && lastUserStory.number !== null) {
      newNumber = lastUserStory.number + 1;
    }

    const newUserStory = await prisma.userStory.create({
      data: {
        number: newNumber,
        name,
        importance,
        estimate,
        howtodemo,
        px,
        fzr,
        status: 'To Do',
        feature_id,
        product_id
      },
    });
    return NextResponse.json(newUserStory, { status: 201 });
  } catch (error) {
    console.error('Failed to create user story:', error);
    return NextResponse.json(
      { error: 'Failed to create user story' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, importance, estimate, howtodemo, px, fzr, status, feature_id, product_id } = await request.json();
    const updatedUserStory = await prisma.userStory.update({
      where: { id },
      data: {
        name,
        importance,
        estimate,
        howtodemo,
        px,
        fzr,
        status,
        feature_id,
        product_id
      },
    });
    return NextResponse.json(updatedUserStory);
  } catch (error) {
    console.error('Failed to update user story:', error);
    return NextResponse.json(
      { error: 'Failed to update user story' },
      { status: 500 }
    );
  }
}