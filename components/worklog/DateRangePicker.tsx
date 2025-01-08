"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import {  format } from "date-fns"
import { DateRange } from "react-day-picker"
import { X } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  setDateRange: (range: { from: Date | null; to: Date | null }) => void
}

export function DateRangePicker({ setDateRange }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>()

  React.useEffect(() => {
    if (date?.from && date?.to) {
      setDateRange({ from: date.from, to: date.to })
    }
  }, [date, setDateRange])

  const handleClear = () => {
    setDate(undefined)
    setDateRange({ from: null, to: null })
  }

  return (
    <div className={cn("grid gap-2 relative")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>选择日期范围</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {date && (
        <Button variant="outline" size="icon" onClick={handleClear} className="absolute right-0 top-0">
          <X className="h-4 w-4" />
          <span className="sr-only">清除日期</span>
        </Button>
      )}
    </div>
  )
}

