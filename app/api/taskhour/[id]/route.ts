import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const taskHour = await prisma.taskHour.findUnique({
      where: { id },
      include: {
        task: true,
      },
    })

    if (!taskHour) {
      return NextResponse.json({ message: 'Task hour not found' }, { status: 404 })
    }

    return NextResponse.json(taskHour)
  } catch (error) {
    console.error('Error in task hour API:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get the task hour record before deleting
    const taskHour = await prisma.taskHour.findUnique({
      where: { id }
    })

    if (!taskHour) {
      return NextResponse.json({ message: 'Task hour not found' }, { status: 404 })
    }

    // Delete the task hour
    const deletedTaskHour = await prisma.taskHour.delete({
      where: { id }
    })

    // Update total hours in the related task
    await prisma.task.update({
      where: { id: taskHour.task_id },
      data: {
        hours: {
          decrement: taskHour.hours || 0
        }
      }
    })

    return NextResponse.json(deletedTaskHour)
  } catch (error) {
    console.error('Error in task hour API:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
