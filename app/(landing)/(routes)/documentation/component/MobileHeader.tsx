'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from './SideBar'
import { useSearchParams } from 'next/navigation'

export function MobileHeader() {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()

  return (
    <div className="lg:hidden flex items-center justify-between p-4 border-b">
      <h1 className="text-xl font-bold">
        Documentation - {searchParams.get('file') || 'Introduction'}
      </h1>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  )
}
