import { NextResponse } from 'next/server';
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get('product_id');
    
    if (!product_id) {
      return NextResponse.json({ error: 'product_id is required' }, { status: 400 });
    }

    const epics = await prisma.epic.findMany({
      where: { product_id },
      orderBy: { px: 'asc' },
      include: {
        features: {
          orderBy: { px: 'asc' },
          include: {
            userstories: {
              orderBy: { px: 'asc' },
            },
          },
        },
      },
    });
    return NextResponse.json(epics);
  } catch (error) {
    console.error('Failed to fetch epics:', error);
    return NextResponse.json({ error: 'Failed to fetch epics' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { product_id, name, px } = await request.json();
    
    if (!product_id || !name || px === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newEpic = await prisma.epic.create({
      data: { product_id, name, px },
    });
    return NextResponse.json(newEpic, { status: 201 });
  } catch (error) {
    console.error('Failed to create epic:', error);
    return NextResponse.json({ error: 'Failed to create epic' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, product_id, name, px } = await request.json();
    
    if (!id || !product_id || !name || px === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedEpic = await prisma.epic.update({
      where: { id },
      data: { product_id, name, px },
    });
    return NextResponse.json(updatedEpic);
  } catch (error) {
    console.error('Failed to update epic:', error);
    return NextResponse.json({ error: 'Failed to update epic' }, { status: 500 });
  }
}