import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;

    if (req.method === "GET") {
      const taskHour = await prisma.taskHour.findUnique({
        where: { id: id as string },
        include: {
          task: true,
        },
      });

      if (!taskHour) {
        return res.status(404).json({ message: "Task hour not found" });
      }

      return res.status(200).json(taskHour);
    }

    if (req.method === "DELETE") {
      // Get the task hour record before deleting
      const taskHour = await prisma.taskHour.findUnique({
        where: { id: id as string }
      });

      if (!taskHour) {
        return res.status(404).json({ message: "Task hour not found" });
      }

      // Delete the task hour
      const deletedTaskHour = await prisma.taskHour.delete({
        where: { id: id as string }
      });

      // Update total hours in the related task
      await prisma.task.update({
        where: { id: taskHour.task_id },
        data: {
          hours: {
            decrement: taskHour.hours || 0
          }
        }
      });

      return res.status(200).json(deletedTaskHour);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in task hour API:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
