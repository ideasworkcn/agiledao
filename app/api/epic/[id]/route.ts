import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    const epic = await prisma.epic.findUnique({
      where: { id },
    })
    
    if (!epic) {
      return NextResponse.json(
        { error: 'Epic not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(epic)
  } catch (error) {
    console.error('Failed to fetch epic:', error)
    return NextResponse.json(
      { error: 'Failed to fetch epic' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    // First delete all user stories associated with features in this epic
    await prisma.userStory.deleteMany({
      where: {
        feature: {
          epic_id: id
        }
      }
    })

    // Then delete all features associated with this epic
    await prisma.feature.deleteMany({
      where: { epic_id: id }
    })

    // Finally delete the epic itself
    await prisma.epic.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Epic and associated features and user stories deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to delete epic:', error)
    return NextResponse.json(
      { error: 'Failed to delete epic and associated features and user stories' },
      { status: 500 }
    )
  }
}