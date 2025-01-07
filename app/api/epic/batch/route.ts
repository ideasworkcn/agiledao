import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const epics = await request.json();
    
    // Validate input
    if (!Array.isArray(epics)) {
      return NextResponse.json(
        { error: 'Invalid input: expected array of epics' },
        { status: 400 }
      );
    }

    // Use transaction for batch update
    const result = await prisma.$transaction(
      epics.map(epic => 
        prisma.epic.update({
          where: { id: epic.id },
          data: {
            px: epic.px,
          }
        })
      )
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to batch update epics:', error);
    return NextResponse.json(
      { error: 'Failed to batch update epics' },
      { status: 500 }
    );
  }
}