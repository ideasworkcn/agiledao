import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {TaskHourTableItem } from '@/types/Model';
import moment from 'moment';
export const dynamic = 'force-dynamic'; // 强制动态渲染

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');

    const productsWithHierarchy = await prisma.product.findMany({
      include: {
        userstories: {
          include: {
            tasks: {
              include: {
                task_hours: {
                  where: {
                    ...(user_id && { member_id: user_id }),
                    ...(start_date && end_date && {
                      create_time: {
                        gte: moment(start_date).format('YYYY-MM-DD 00:00:01'),
                        lte: moment(end_date).format('YYYY-MM-DD 23:59:59')
                      }
                    })
                  }
                }
              }
            }
          }
        }
      }
    });

    const tableData: TaskHourTableItem[] = productsWithHierarchy.flatMap((product) => 
      product.userstories?.flatMap((userStory) => 
        userStory.tasks?.flatMap((task) => 
          task.task_hours?.map((hour) => ({
            product: product.name,
            user_story: userStory.name,
            task: task.name,
            hours: hour.hours,
            note: hour.note,
            create_time: hour.create_time,
            user_id: hour.member_id
          } as TaskHourTableItem)) ?? []
        ) ?? []
      ) ?? []
    );

    return NextResponse.json(tableData);
  } catch (error) {
    console.error('Failed to fetch product hierarchy:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch product hierarchy',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
