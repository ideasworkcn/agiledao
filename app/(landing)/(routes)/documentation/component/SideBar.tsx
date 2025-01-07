'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useSearchParams } from 'next/navigation'




const docs = [
  {
    title: "简介",
    items: [
      { title: "软件目的和主要功能", href: "/documentation/introduction" },
    ],
  },
  {
    title: "安装指南",
    items: [
      { title: "下载和安装", href: "/documentation/installation" },
    ],
  },
  {
    title: "快速入门",
    items: [
      { title: "创建和设置新项目", href: "/documentation/new-project-setup" },
      { title: "邀请团队成员", href: "/documentation/invite-team-members" },
    ],
  },
  {
    title: "核心功能",
    items: [
      { title: "Backlog管理", href: "/documentation/backlog-management" },
      { title: "Sprint规划", href: "/documentation/sprint-planning" },
      { title: "任务分配", href: "/documentation/task-assignment" },
      { title: "看板视图", href: "/documentation/kanban-view" },
    ],
  },
  {
    title: "高级功能",
    items: [
      { title: "报告和分析", href: "/documentation/reporting-analysis" },
      { title: "集成", href: "/documentation/integration" },
      { title: "自定义", href: "/documentation/customization" },
    ],
  },
  {
    title: "常见问题解答",
    items: [
      { title: "常见问题", href: "/documentation/faq" },
    ],
  },
  {
    title: "支持和反馈",
    items: [
      { title: "联系技术支持", href: "/documentation/support" },
      { title: "提供反馈或建议", href: "/documentation/feedback" },
    ],
  },
  {
    title: "更新日志",
    items: [
      { title: "更新和版本历史", href: "/documentation/changelog" },
    ],
  },
]
export function Sidebar({ className }: { className?: string }) {
  const [search, setSearch] = useState('')
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 修改链接生成方式
  const createHref = (file: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('file', file)
    return `${pathname}?${params.toString()}`
  }

  const filteredDocs = docs.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.title.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(section => section.items.length > 0)

  return (
    <div className={cn("w-64 bg-gray-100 border-r", className)}>
      <ScrollArea className="h-[calc(100vh-3.5rem)] py-6">
        <div className="px-4 space-y-6">
          <Input
            type="search"
            placeholder="Search document..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          {filteredDocs.map((section) => (
            <div key={section.title}>
              <h2 className="mb-2 text-lg font-semibold tracking-tight">{section.title}</h2>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const file = item.href.split('/').pop() || ''
                  return (
                    <Link
                      key={item.href}
                      href={createHref(file)}
                      className={cn(
                        "block px-2 py-1 text-sm hover:bg-gray-200 rounded",
                        searchParams.get('file') === file && "bg-gray-200 font-medium"
                      )}
                    >
                      {item.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

