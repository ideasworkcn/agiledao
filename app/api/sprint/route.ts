import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get('product_id');
    
    const whereClause = product_id ? { product_id } : {};
    
    const sprints = await prisma.sprint.findMany({
      where: whereClause,
      orderBy: { name: 'desc' },
    });
    
    return NextResponse.json(sprints);
  } catch (error) {
    console.error('Failed to fetch sprints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sprints' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      product_id,
      name,
      goal,
      start_date,
      end_date,
      demo_date,
      estimate_velocity,
      actual_velocity,
      daily_standup,
      sprint_review,
      status
    } = await request.json();

    const newSprint = await prisma.sprint.create({
      data: {
        product_id,
        name,
        goal,
        start_date,
        end_date,
        demo_date,
        estimate_velocity,
        actual_velocity,
        daily_standup,
        sprint_review,
        status
      }
    });

    return NextResponse.json(newSprint, { status: 201 });
  } catch (error) {
    console.error('Failed to create sprint:', error);
    return NextResponse.json(
      { error: 'Failed to create sprint' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { 
      id,
      product_id,
      name,
      goal,
      start_date,
      end_date,
      demo_date,
      estimate_velocity,
      actual_velocity,
      daily_standup,
      sprint_review,
      status
    } = await request.json();

    const updatedSprint = await prisma.sprint.update({
      where: { id },
      data: {
        product_id,
        name,
        goal,
        start_date,
        end_date,
        demo_date,
        estimate_velocity,
        actual_velocity,
        daily_standup,
        sprint_review,
        status
      }
    });

    return NextResponse.json(updatedSprint);
  } catch (error) {
    console.error('Failed to update sprint:', error);
    return NextResponse.json(
      { error: 'Failed to update sprint' },
      { status: 500 }
    );
  }
}
