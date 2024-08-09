"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import "@/app/globals.css";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Component() {
  return (
    <>
      <Header />
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 lg:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-[60px] items-center border-b px-6">
              <Link
                href="#"
                className="flex items-center gap-2 font-semibold"
                prefetch={false}
              >
                <BookIcon className="h-6 w-6" />
                <span className="">文档管理</span>
              </Link>
              <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only">添加文档</span>
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-4 text-sm font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  prefetch={false}
                >
                  <FileIcon className="h-4 w-4" />
                  产品设计文档
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  prefetch={false}
                >
                  <FileIcon className="h-4 w-4" />
                  开发规范文档
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary  transition-all hover:text-primary"
                  prefetch={false}
                >
                  <FileIcon className="h-4 w-4" />
                  用户手册
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  prefetch={false}
                >
                  <FileIcon className="h-4 w-4" />
                  测试报告
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  prefetch={false}
                >
                  <FileIcon className="h-4 w-4" />
                  部署文档
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border w-8 h-8"
                >
                  <ListOrderedIcon className="h-4 w-4" />
                  <span className="sr-only">排序</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>排序方式</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <ArrowUpIcon className="h-4 w-4 mr-2" />
                  按名称升序
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowDownIcon className="h-4 w-4 mr-2" />
                  按名称降序
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  按创建时间
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FilePenIcon className="h-4 w-4 mr-2" />
                  按修改时间
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="搜索文档..."
                    className="w-full bg-background shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3"
                  />
                </div>
              </form>
            </div>
            <Button size="sm" className="shrink-0">
              <PlusIcon className="h-4 w-4 mr-2" />
              新建文档
            </Button>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            {/*  */}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

function ArrowDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}

function ArrowUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function BookIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function FilePenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function ListOrderedIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="10" x2="21" y1="6" y2="6" />
      <line x1="10" x2="21" y1="12" y2="12" />
      <line x1="10" x2="21" y1="18" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
