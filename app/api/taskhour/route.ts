import { NextApiRequest, NextApiResponse } from "next";
import { TaskHour, PrismaClient } from "@prisma/client";
import moment from "moment";
import prisma from '@/lib/db';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { task_id, member_id } = req.query;
      
      const taskHours = await prisma.taskHour.findMany({
        where: {
          task_id: task_id as string,
          member_id: member_id as string,
        },
        include: {
          task: true,
        },
        orderBy: {
          create_time: "desc",
        },
      });

      return res.status(200).json(taskHours);
    }

    if (req.method === "POST") {
      const taskHourData = req.body as TaskHour;
      
      if (!taskHourData.hours) {
        return res.status(400).json({ message: "Hours is required" });
      }

      const taskHour = await prisma.taskHour.create({
        data: {
          ...taskHourData,
          create_time: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      });

      // Update total hours in the related task
      await prisma.task.update({
        where: { id: taskHourData.task_id },
        data: {
          hours: {
            increment: taskHourData.hours || 0
          }
        }
      });

      return res.status(201).json(taskHour);
    }

    if (req.method === "PUT") {
      const taskHourData = req.body as TaskHour;
      
      if (!taskHourData.hours) {
        return res.status(400).json({ message: "Hours is required" });
      }

      // Get the old hours value before update
      const oldTaskHour = await prisma.taskHour.findUnique({
        where: { id: taskHourData.id }
      });

      if (!oldTaskHour?.hours) {
        return res.status(400).json({ message: "Invalid existing task hour record" });
      }

      const updatedTaskHour = await prisma.taskHour.update({
        where: {
          id: taskHourData.id,
        },
        data: taskHourData,
      });

      // Update total hours in the related task
      const hoursDifference = (taskHourData.hours || 0) - (oldTaskHour.hours || 0);
      await prisma.task.update({
        where: { id: taskHourData.task_id },
        data: {
          hours: {
            increment: hoursDifference
          }
        }
      });

      return res.status(200).json(updatedTaskHour);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in task hour API:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
