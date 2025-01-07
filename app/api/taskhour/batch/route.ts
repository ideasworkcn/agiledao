import { NextResponse } from "next/server";
import prisma from '@/lib/db';
import moment from "moment";
import { TaskHour } from "@/types/Model";

export async function POST(request: Request) {
  try {
    const taskHoursData: TaskHour[] = await request.json();
    
    if (!taskHoursData || !Array.isArray(taskHoursData)) {
      return NextResponse.json(
        { message: "Invalid task hours data" },
        { status: 400 }
      );
    }

    // Process all task hour updates/creates
    const taskUpdates: { task_id: string; hoursDifference: number }[] = [];
    
    for (const taskHourData of taskHoursData) {
      if (!taskHourData.hours) {
        return NextResponse.json(
          { message: "Hours is required for all records" },
          { status: 400 }
        );
      }

      const { id, task_id, hours } = taskHourData;
      const createData = {
        ...taskHourData,
        create_time: moment().format("YYYY-MM-DD HH:mm:ss"),
        task: { connect: { id: task_id } },
        task_id: undefined
      };

      // Check if record exists
      const existingRecord = id ? await prisma.taskHour.findUnique({ where: { id } }) : null;

      if (existingRecord) {
        // Update existing record
        const hoursDifference = (hours || 0) - (existingRecord.hours || 0);
        await prisma.taskHour.update({ 
          where: { id },
          data: {
            note: taskHourData.note,
            hours: taskHourData.hours,
            member_id: taskHourData.member_id,
            create_time: taskHourData.create_time
          }
        });
        taskUpdates.push({ task_id, hoursDifference });
      } else {
        // Create new record
        await prisma.taskHour.create({ data: createData });
        taskUpdates.push({ task_id, hoursDifference: hours || 0 });
      }
    }

    // Update all tasks with their total hours
    const taskIds = Array.from(new Set(taskUpdates.map(t => t.task_id)));
    
    for (const taskId of taskIds) {
      const taskHours = await prisma.taskHour.findMany({ where: { task_id: taskId } });
      const totalHours = taskHours.reduce((sum, hour) => sum + (hour.hours || 0), 0);
      await prisma.task.update({
        where: { id: taskId },
        data: { hours: totalHours }
      });
    }

    return NextResponse.json({ message: "Task hours processed successfully" });
  } catch (error) {
    console.error("Error in batch task hour API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
