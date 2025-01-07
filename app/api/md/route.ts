import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { marked } from 'marked'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const file = url.searchParams.get('file')

  if (!file) {
    return NextResponse.json(
      { error: 'File parameter is required' },
      { status: 400 }
    )
  }

  try {
    const filePath = path.join(process.cwd(), 'md', `${file}.md`)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const parsedContent = await marked.parse(fileContent)
    return NextResponse.json({ content: parsedContent })
  } catch (error) {
    console.error('Error reading markdown file:', error)
    return NextResponse.json(
      { content: '<h1 class="text-3xl font-bold mb-4">Page not found</h1>' },
      { status: 404 }
    )
  }
}