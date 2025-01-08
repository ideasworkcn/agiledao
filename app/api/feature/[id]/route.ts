import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const feature = await prisma.feature.findUnique({
      where: { id: params.id },
    });
    
    if (feature) {
      return NextResponse.json(feature);
    } else {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to fetch feature:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feature', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // First delete all user stories associated with this feature
    await prisma.userStory.deleteMany({
      where: { feature_id: params.id },
    });
    
    // Then delete the feature itself
    await prisma.feature.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ message: 'Feature and associated user stories deleted successfully' });
  } catch (error) {
    console.error('Failed to delete feature:', error);
    return NextResponse.json(
      { error: 'Failed to delete feature and associated user stories' }, 
      { status: 500 }
    );
  }
}