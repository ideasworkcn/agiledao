'use client'
import { useEffect, useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { marked } from 'marked'
import 'github-markdown-css';
import { useSearchParams } from 'next/navigation'

export function Content({ file }: { file: string }) {
  const [content, setContent] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/md?file=${file}`)
        if (!response.ok) {
          throw new Error('Failed to fetch content')
        }
        const data = await response.json()
        const htmlContent = await marked.parse(data.content)
        setContent(htmlContent)
      } catch (error) {
        console.error('Error fetching markdown content:', error)
        setContent('<h1 class="text-3xl font-bold mb-4">Page not found</h1>')
      }
    }

    fetchContent()
  }, [file, searchParams])

  return (
    <ScrollArea className="flex-1 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto px-4">
        <div 
          className="markdown-body prose prose-lg prose-apple" 
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      </div>
    </ScrollArea>
  )
}