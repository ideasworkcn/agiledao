"use client";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";

import TaskBoard from "@/components/task/TaskBoard";
import TaskHoursTable from "@/components/task/TaskHoursTable";

import { Button } from "@/components/ui/button";
import {  useToast } from "@/hooks/use-toast";
import type { Product, Task,UserStory } from '@/types/Model'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sprint,User } from "@/types/Model";

export default function Task() {
  const [sprint, setSprint] = useState<Sprint>();
  const [sprintList, setSprintList] = useState<Sprint[]>([]);
  const [backlogList, setBacklogList] = useState<UserStory[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task>();
 
  const [product, setProduct] = useState<Product>();
  const [currentBacklog,setCurrentBacklog] = useState<UserStory>()
  const { toast } = useToast()

  const [userList, setUserList] = useState<User[]>([]);
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/user');
      const data = await response.json();
      setUserList(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const storedProduct = JSON.parse(localStorage.getItem("currentProduct") || "{}");
    if (!storedProduct) return;

    setProduct(storedProduct);
    const productId = storedProduct.id;

    const fetchInitialData = async () => {
      try {
        const response = await fetch(`/api/sprint?product_id=${productId}`);
        const sprints = await response.json();
        console.log(sprints)
        setSprintList(sprints);
        if (sprints.length > 0) {
          setSprint(sprints[0]);
          const response = await fetch(`/api/sprint/userstory-task?sprint_id=${sprints[0].id}`);
          const backlogsAndTasks = await response.json();
          setBacklogList(backlogsAndTasks);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast({ title: "Failed to load data", variant: "destructive" });
      }
    };

    fetchInitialData();
  }, []);


  const finishBacklog = async (backlog: UserStory) => {
    if (!sprint?.id) return;
    
    if (window.confirm("确定完成 Backlog 吗？")) {
      try {
        await fetch(`/api/userstory`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...backlog, status: "Done" })
        });
        
        const response = await fetch(`/api/sprint/userstory-task?sprint_id=${sprint.id}`);
        const updatedBacklogs = await response.json();
        setBacklogList(updatedBacklogs);
        toast({ title: "Backlog marked as completed", variant: "default" });
      } catch (error) {
        console.error("Error finishing backlog:", error);
        toast({ title: "Failed to complete backlog", variant: "destructive" });
      }
    }
  };

  const handleSprintChange = async (newSprint: Sprint) => {
    setSprint(newSprint);
    try {
      const response = await fetch(`/api/sprint/userstory-task?sprint_id=${newSprint.id}`);
      const backlogsAndTasks = await response.json();
      setBacklogList(backlogsAndTasks);
    } catch (error) {
      console.error("Error changing sprint:", error);
      toast({ title: "Failed to load sprint data", variant: "destructive" });
    }
  };

  const calculateCompletionPercentage = (taskList: { status: string }[] | undefined) => {
    if (!taskList || !Array.isArray(taskList)) return 0;
    const totalTasks = taskList.length;
    if (totalTasks === 0) return 0;
    const completedTasks = taskList.filter((task: { status: string }) => task.status === "Done").length;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  return (
    <>
    <div className="flex flex-col min-h-screen ">
      <div className="flex-grow flex flex-col py-4 bg-white">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 flex flex-wrap items-center">
                {/* <CheckSquare className="mr-2 h-5 w-5 text-gray-500" /> */}
                <span className="text-blue-600 font-semibold break-all">{product?.name || '未命名产品'}</span>
                <span className="mx-2 text-gray-400 hidden sm:inline">·</span>
                <span className="text-gray-800 break-all">{sprint?.name || '未选择Sprint'}</span>
                <span className="ml-2 text-gray-600">任务看板</span>
              </h1>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 w-full sm:w-auto"
                    >
                      切换 Sprint 任务看板
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-full sm:w-auto">
                    {sprintList.map((sprintItem: Sprint) => (
                      <DropdownMenuItem
                        key={sprintItem.id}
                        onClick={() => handleSprintChange(sprintItem)}
                      >
                        {sprintItem.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <span className="break-words">目标：{sprint?.goal || '未设置目标'}</span>
                  <span>截止日期：{sprint?.end_date ? new Date(sprint.end_date).toLocaleDateString() : '未设置'}</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 py-4 sm:py-6 px-2 sm:px-4 lg:px-8">
          <Accordion type="single" collapsible className="space-y-2 sm:space-y-4">
            {backlogList.length > 0 ? (
              backlogList.map((backlog) => (
                <AccordionItem
                  key={backlog.id}
                  value={backlog.id}
                  className="bg-white rounded-lg shadow"
                >
                  <AccordionTrigger className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50">
                    <div className="flex flex-col lg:flex-row w-full text-left items-start justify-between">
                      <div className="flex flex-col sm:flex-row lg:flex-row space-y-2 sm:space-y-0 lg:space-y-0 sm:space-x-4 lg:space-x-6 flex-grow">
                        <div className="flex items-center justify-start w-full sm:w-auto">
                          <div className="font-medium text-gray-700 text-sm sm:text-base">
                            {backlog.number}
                          </div>
                          <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ml-2 ${
                            backlog.status === 'In Progress' 
                              ? 'bg-orange-100 text-orange-700'
                              : backlog.status === 'Done'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {backlog.status}
                          </span>
                        </div>
                        <div className="text-sm sm:text-base font-semibold text-gray-900 break-words flex-grow text-left">
                          {backlog.name}
                        </div>
                        <div className="flex items-center gap-2 justify-start">
                          <div className={`mr-8 text-xs sm:text-sm font-medium text-white px-3 py-1 rounded-full ${getProgressColor( calculateCompletionPercentage(backlog.tasks))} shadow-md`}>
                            {calculateCompletionPercentage(backlog.tasks)}%
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 lg:mt-0 w-full sm:w-auto">
                      <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            finishBacklog(backlog);
                          }}
                          className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 text-xs w-full sm:w-auto inline-block text-center py-2 px-4 rounded"
                        >
                          完成 Backlog
                        </a>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-b-lg">
                    <TaskBoard
                      sprint={sprint}
                      backlog={backlog}
                      userList={userList}
                      backlogList={backlogList}
                      setShowModal={setShowModal}
                      setSelectedTask={setSelectedTask}
                      currentBacklog={currentBacklog}
                      setCurrentBacklog={setCurrentBacklog}
                      setBacklogList={setBacklogList}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
              <p className="text-lg font-semibold">暂无 Backlog 数据</p>
              <p className="text-sm">请添加新的 Backlog 或检查筛选条件</p>
            </div>
            )}
          </Accordion>
        </main>
        <TaskHoursTable
          backlogList={backlogList}
          setBacklogList={setBacklogList}
          sprint={sprint}
          selectedTask={selectedTask}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </div>
      <Toaster />
    </div>
    </>
  );
}

function getProgressColor(progress: number): string {
  if (progress === 100) return "bg-green-500";
  if (progress >= 75) return "bg-blue-500";
  if (progress >= 50) return "bg-yellow-500";
  return "bg-red-500";
}
