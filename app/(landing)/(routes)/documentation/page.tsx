import { Sidebar } from './component/SideBar'
import { Content } from './component/Content'

export default function DocumentationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const file = searchParams.file || 'introduction' // 默认显示introduction

  return (
    <div className="flex h-full">
      <Sidebar />
      <Content file={file as string} />
    </div>
  )
}