import { NextResponse } from 'next/server';
import {  BurndownItem } from '@/types/Model';
import  db  from '@/lib/db';
import moment from 'moment';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sprintId = searchParams.get('sprint_id');

  if (!sprintId) {
    return NextResponse.json({ error: 'Sprint ID is required' }, { status: 400 });
  }

  try {
    // 1. 获取 Sprint 数据
    const sprint = await db.sprint.findUnique({
      where: { id: sprintId },
      select: { start_date: true, end_date: true }
    });

    if (!sprint) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
    }
    const { start_date, end_date } = sprint;

    // 2. 获取当前 Sprint 的所有任务
    const tasks = await db.task.findMany({
      where: { 
        sprint_id: sprintId,
        create_time: {
          gte: start_date as string,
          lte: end_date as string
        }
      },
      select: { create_time: true, estimated_hours: true }
    });

    // 3. 获取当前 Sprint 的所有任务工时记录
    const taskHours = await db.taskHour.findMany({
      where: { 
        sprint_id: sprintId,
        create_time: {
          gte: start_date as string,
          lte: end_date as string
        }
      },
      select: { create_time: true, hours: true }
    });

    // 4. 计算每日剩余工作量
    const burndownData: BurndownItem[] = [];
    const dailyData: { [date: string]: { estimated: number, completed: number } } = {};

    // 初始化日期范围
    let currentDate = moment(start_date);
    const endDate = moment(end_date);
    
    while (currentDate.isSameOrBefore(endDate)) {
      const dateStr = currentDate.format('YYYY-MM-DD');
      dailyData[dateStr] = { estimated: 0, completed: 0 };
      currentDate = currentDate.add(1, 'day');
    }

    // 计算总预估工作量（仅限当前 Sprint 范围内的任务）
    tasks.forEach(task => {
      if (task.create_time) {
        const taskDate = moment(task.create_time);
        // 只计算在 Sprint 日期范围内的任务
        if (taskDate.isBetween(start_date, end_date, null, '[]')) {
          const date = taskDate.format('YYYY-MM-DD');
          if (dailyData[date]) {
            dailyData[date].estimated += task.estimated_hours || 0;
          }
        }
      }
    });

    // 计算每日完成工作量（仅限当前 Sprint 范围内的工时记录）
    taskHours.forEach(taskHour => {
      if (taskHour.create_time) {
        const hourDate = moment(taskHour.create_time);
        // 只计算在 Sprint 日期范围内的工时记录
        if (hourDate.isBetween(start_date, end_date, null, '[]')) {
          const date = hourDate.format('YYYY-MM-DD');
          if (dailyData[date]) {
            dailyData[date].completed += taskHour.hours || 0;
          }
        }
      }
    });

    // 5. 生成燃尽图数据
    let totalRemaining = Object.values(dailyData).reduce((sum, day) => sum + day.estimated, 0);
    const sortedDates = Object.keys(dailyData).sort();

    sortedDates.forEach(date => {
      const dayData = dailyData[date];
      totalRemaining -= dayData.completed;
      burndownData.push({
        date,
        remainingHours: Math.max(0, totalRemaining)
      });
    });

    return NextResponse.json(burndownData);
  } catch (error) {
    console.error('Error calculating burndown data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to calculate burndown data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
