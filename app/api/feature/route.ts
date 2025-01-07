import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const features = await prisma.feature.findMany();
    return NextResponse.json(features);
  } catch (error) {
    console.error('Failed to fetch features:', error);
    return NextResponse.json(
      { error: 'Failed to fetch features' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, px, epic_id } = await request.json();
    const newFeature = await prisma.feature.create({
      data: {
        name,
        px,
        epic_id,
      },
    });
    return NextResponse.json(newFeature, { status: 201 });
  } catch (error) {
    console.error('Failed to create feature:', error);
    return NextResponse.json(
      { error: 'Failed to create feature' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, px } = await request.json();
    const updatedFeature = await prisma.feature.update({
      where: { id: id as string },
      data: { name, px },
    });
    return NextResponse.json(updatedFeature);
  } catch (error) {
    console.error('Failed to update feature:', error);
    return NextResponse.json(
      { error: 'Failed to update feature' },
      { status: 500 }
    );
  }
}