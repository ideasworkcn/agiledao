"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/worklog/DateRangePicker"
import moment from 'moment'
import { User} from '@/types/Model'

interface SearchInterfaceProps {
  isAdmin: boolean
  users?: User[]
  onSearch: (params: any) => void
  onExport: () => void
}

export function SearchInterface({ isAdmin, users, onSearch, onExport }: SearchInterfaceProps) {
  const [userId, setUserId] = useState('all')
  const [period, setPeriod] = useState('today')
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null })

  const handlePeriodChange = (value: string) => {
    setPeriod(value)
    const now = moment()
    let startDate: Date | null = null
    let endDate: Date | null = null

    switch (value) {
      case 'today':
        startDate = moment().startOf('day').toDate()
        endDate = moment().endOf('day').toDate()
        break
      case 'yesterday':
        startDate = moment().subtract(1, 'day').startOf('day').toDate()
        endDate = moment().subtract(1, 'day').endOf('day').toDate()
        break
      case 'thisWeek':
        startDate = moment().startOf('week').toDate()
        endDate = moment().endOf('week').toDate()
        break
      case 'lastWeek':
        startDate = moment().subtract(1, 'week').startOf('week').toDate()
        endDate = moment().subtract(1, 'week').endOf('week').toDate()
        break
      case 'thisMonth':
        startDate = moment().startOf('month').toDate()
        endDate = moment().endOf('month').toDate()
        break
      case 'lastMonth':
        startDate = moment().subtract(1, 'month').startOf('month').toDate()
        endDate = moment().subtract(1, 'month').endOf('month').toDate()
        break
    }

    setDateRange({ from: startDate, to: endDate })
  }

  const handleSearch = () => {
    const params = new URLSearchParams({
      user_id: userId === 'all' ? '' : userId,
      period,
      start_date: dateRange.from?.toISOString() || '',
      end_date: dateRange.to?.toISOString() || ''
    });
    onSearch(params);
  }

  return (
    <div className="flex flex-wrap gap-4 items-end">
      {isAdmin && users && (
        <Select value={userId} onValueChange={setUserId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="选择用户" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有用户</SelectItem>
            {users.map(user => (
              <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Select value={period} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="选择时间周期" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">今天</SelectItem>
          <SelectItem value="yesterday">昨天</SelectItem>
          <SelectItem value="thisWeek">本周</SelectItem>
          <SelectItem value="lastWeek">上周</SelectItem>
          <SelectItem value="thisMonth">本月</SelectItem>
          <SelectItem value="lastMonth">上月</SelectItem>
        </SelectContent>
      </Select>
      <DateRangePicker setDateRange={setDateRange} />
      <Button onClick={handleSearch}>搜索</Button>
      <Button onClick={onExport} variant="outline">导出</Button>
    </div>
  )
}
