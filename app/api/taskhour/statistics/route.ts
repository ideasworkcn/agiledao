import { NextResponse } from 'next/server';
import { getCurrentWeekRange, getLastWeekRange, getCurrentMonthRange } from '@/lib/utils';
import prisma from '@/lib/db';
import moment from 'moment';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const member_id = searchParams.get('user_id');

  if (!member_id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // 获取日期范围
    const [currentWeekStart, currentWeekEnd] = getCurrentWeekRange();
    const [lastWeekStart, lastWeekEnd] = getLastWeekRange();
    const [currentMonthStart, currentMonthEnd] = getCurrentMonthRange();

    const [currentWeekHours, lastWeekHours, currentMonthHours] = await Promise.all([
        prisma.taskHour.findMany({
          where: {
            member_id,
            create_time: {
              gte: moment(currentWeekStart).format('YYYY-MM-DD HH:mm:ss'),
              lte: moment(currentWeekEnd).format('YYYY-MM-DD HH:mm:ss'),
            },
          },
          include: {
            task: true
          }
        }),
        prisma.taskHour.findMany({
          where: {
            member_id,
            create_time: {
              gte: moment(lastWeekStart).format('YYYY-MM-DD HH:mm:ss'),
              lte: moment(lastWeekEnd).format('YYYY-MM-DD HH:mm:ss'),
            },
          },
          include: {
            task: true
          }
        }),
        prisma.taskHour.findMany({
          where: {
            member_id,
            create_time: {
              gte: moment(currentMonthStart).format('YYYY-MM-DD HH:mm:ss'),
              lte: moment(currentMonthEnd).format('YYYY-MM-DD HH:mm:ss'),
            },
          },
          include: {
            task: true
          }
        }),
      ]);

      return NextResponse.json({
        currentWeek: currentWeekHours,
        lastWeek: lastWeekHours,
        currentMonth: currentMonthHours
      });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}