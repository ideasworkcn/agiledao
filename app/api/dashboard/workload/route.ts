import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

interface WorkLoadItem {
    [key: string]: {
      assigner: string;
      workload_hours: number;
    };
  }

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sprint_id = searchParams.get('sprint_id');

    if (!sprint_id) {
      return NextResponse.json(
        { error: 'Sprint ID is required' },
        { status: 400 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: { sprint_id: sprint_id },
      include: {
        assigner: true
      }
    });

    if (!tasks || tasks.length === 0) {
      return NextResponse.json(
        { error: 'No tasks found for this sprint' },
        { status: 404 }
      );
    }

    const WorkLoadItem = tasks.reduce((acc: WorkLoadItem, task) => {
      const assignerId = task.assigner_id || 'unassigned';
      if (!acc[assignerId]) {
        acc[assignerId] = {
          assigner: task.assigner?.name || 'Unassigned',
          workload_hours: 0
        };
      }
      acc[assignerId].workload_hours += task.px || 0;
      return acc;
    }, {});

    const workloadList = Object.values(WorkLoadItem);

    if (workloadList.length === 0) {
      return NextResponse.json(
        { error: 'No workload data could be calculated' },
        { status: 404 }
      );
    }

    return NextResponse.json(workloadList);
  } catch (error) {
    console.error('Error fetching workload data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workload data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}