import { NextResponse } from "next/server";
import { TaskHour } from "@/types/Model";
import moment from "moment";
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const task_id = searchParams.get('task_id');
    const member_id = searchParams.get('member_id');
    
    if (!task_id || !member_id) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
    }

    const taskHours = await prisma.taskHour.findMany({
      where: {
        task_id,
        member_id,
      },
      include: {
        task: true,
      },
      orderBy: {
        create_time: "desc",
      },
    });

    return NextResponse.json(taskHours);
  } catch (error) {
    console.error("Error in GET task hour API:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const taskHourData = await req.json() as TaskHour;
    
    if (!taskHourData.hours) {
      return NextResponse.json({ message: "Hours is required" }, { status: 400 });
    }

    const { task, ...dataWithoutTask } = taskHourData;

    const taskHour = await prisma.taskHour.create({
      data: {
        ...dataWithoutTask,
        create_time: moment().format("YYYY-MM-DD HH:mm:ss"),
      },
    });

    await prisma.task.update({
      where: { id: taskHourData.task_id },
      data: {
        hours: {
          increment: taskHourData.hours || 0
        }
      }
    });

    return NextResponse.json(taskHour, { status: 201 });
  } catch (error) {
    console.error("Error in POST task hour API:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: Request) {
  try {
    const taskHourData = await req.json() as TaskHour;
    
    if (!taskHourData.hours) {
      return NextResponse.json({ message: "Hours is required" }, { status: 400 });
    }

    const oldTaskHour = await prisma.taskHour.findUnique({
      where: { id: taskHourData.id }
    });

    if (!oldTaskHour?.hours) {
      return NextResponse.json({ message: "Invalid existing task hour record" }, { status: 400 });
    }

    const { task, ...dataWithoutTask } = taskHourData;

    const updatedTaskHour = await prisma.taskHour.update({
      where: {
        id: taskHourData.id,
      },
      data: dataWithoutTask,
    });

    const hoursDifference = (taskHourData.hours || 0) - (oldTaskHour.hours || 0);
    await prisma.task.update({
      where: { id: taskHourData.task_id },
      data: {
        hours: {
          increment: hoursDifference
        }
      }
    });

    return NextResponse.json(updatedTaskHour);
  } catch (error) {
    console.error("Error in PUT task hour API:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
