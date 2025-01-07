"use client"

import { useState, useEffect } from 'react'
import { TaskHourTableItem, User } from '@/types/Model'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import moment from 'moment'


interface StatisticsViewProps {
  workItems: TaskHourTableItem[]
  isAdmin: boolean
}

export default function StatisticsView({ workItems, isAdmin }: StatisticsViewProps) {

  const totalHours = workItems.reduce((sum, item) => sum + item.hours, 0)
  const uniqueDates = new Set(workItems.map(item => moment(item.create_time).format('YYYY-MM-DD')))
  const averageDailyHours = totalHours / uniqueDates.size || 0

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">总工时</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}小时</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">平均每日工时</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageDailyHours.toFixed(1)}小时</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>工时记录</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>产品</TableHead>
                <TableHead>用户故事</TableHead>
                <TableHead>任务</TableHead>
                <TableHead>工时</TableHead>
                <TableHead>备注</TableHead>
                <TableHead>日期</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workItems.map((item) => (
                <TableRow key={item.create_time}>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>{item.user_story}</TableCell>
                  <TableCell>{item.task}</TableCell>
                  <TableCell>{item.hours}</TableCell>
                  <TableCell>{item.note}</TableCell>
                  <TableCell>{item.create_time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
