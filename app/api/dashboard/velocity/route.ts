import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Task,VelocityItem } from '@/types/Model';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get('product_id');

    if (!product_id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get all sprints and tasks for the product
    const sprints = await prisma.sprint.findMany({
      where: { product_id }
    });

    const tasks = await prisma.task.findMany({
      where: { 
        product_id,
      }
    });

    // Calculate completed story points for each sprint
    const velocityData: VelocityItem[] = sprints.map(sprint => {
        const sprintTasks = tasks.filter(task => task.sprint_id === sprint.id);
        const completedStoryPoints = sprintTasks.reduce((sum, task) => {
          const px = task.px ?? 0;
          return sum + px;
        }, 0);
  
        return {
          completed_story_points: completedStoryPoints,
          sprint_name: sprint.name || 'Unnamed Sprint'  // Provide fallback for null
        };
      });

    // Return results
    return NextResponse.json({
      success: true,
      data: velocityData
    });
  } catch (error) {
    console.error('Error fetching velocity data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch velocity data' },
      { status: 500 }
    );
  }
}
