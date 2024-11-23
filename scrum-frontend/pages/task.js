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
import { PlusIcon } from "lucide-react";

import {
  getBacklogTaskListBySprintIdAndBacklogId,
  getSprintBacklogsAndTasks,
  getTaskHours,
  updateTaskHours,
} from "@/api/task.api";
import { modifyBacklog } from "@/api/userstory.api";

import { getSprints } from "@/api/sprint.api";
import TaskBoard from "@/components/task/TaskBoard";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import TaskHoursTable from "@/components/task/TaskHoursTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Router from "next/router";

export default function Task() {
  const [sprint, setSprint] = useState({});
  const [sprintList, setSprintList] = useState([]);
  const [backlogList, setBacklogList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskHours, setSelectedTaskHours] = useState([]);
  const [product, setProduct] = useState({});
  const [currentBacklog,setCurrentBacklog] = useState({})


  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) {
      Router.push("/login");
      return;
    }

    const storedProduct = JSON.parse(localStorage.getItem("currentWorkspace"));
    if (!storedProduct) return;

    setProduct(storedProduct);
    const productId = storedProduct.id;

    const fetchInitialData = async () => {
      try {
        const sprints = await getSprints(productId);
        setSprintList(sprints);
        if (sprints.length > 0) {
          setSprint(sprints[0]);
          const backlogsAndTasks = await getSprintBacklogsAndTasks(sprints[0].id);
          setBacklogList(backlogsAndTasks);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast({ title: "Failed to load data", status: "error" });
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchTaskHours = async () => {
      if (selectedTask) {
        try {
          const hours = await getTaskHours(selectedTask.id);
          setSelectedTaskHours(hours.taskHoursList);
        } catch (error) {
          console.error("Error fetching task hours:", error);
          toast({ title: "Failed to load task hours", status: "error" });
        }
      }
    };

    fetchTaskHours();
  }, [selectedTask]);

  const handleTaskHoursSave = () => {
    updateTaskHours(selectedTaskHours)
      .then((updatedHours) => {
        setSelectedTaskHours(updatedHours);
       
        setShowModal(false);
        toast({ title: "Task hours updated successfully", status: "success" });

        getBacklogTaskListBySprintIdAndBacklogId(sprint.id, selectedTask.productBacklogId).then(
          (res) => {
            setCurrentBacklog(res);
            setBacklogList((prevBacklogList) =>
              prevBacklogList.map((b) =>
                b.id === selectedTask.productBacklogId ? { ...b, ...res } : b
              )
            );
          }
        );

      })
      .catch((error) => {
        console.error("Error updating task hours:", error);
        toast({ title: "Failed to update task hours", status: "error" });
      });
  };

  const finishBacklog = async (backlog) => {
    if (window.confirm("确定完成 Backlog 吗？")) {
      try {
        await modifyBacklog({ ...backlog, status: "已完成" });
        const updatedBacklogs = await getSprintBacklogsAndTasks(sprint.id);
        setBacklogList(updatedBacklogs);
        toast({ title: "Backlog marked as completed", status: "success" });
      } catch (error) {
        console.error("Error finishing backlog:", error);
        toast({ title: "Failed to complete backlog", status: "error" });
      }
    }
  };

  const handleSprintChange = async (newSprint) => {
    setSprint(newSprint);
    try {
      const backlogsAndTasks = await getSprintBacklogsAndTasks(newSprint.id);
      setBacklogList(backlogsAndTasks);
    } catch (error) {
      console.error("Error changing sprint:", error);
      toast({ title: "Failed to load sprint data", status: "error" });
    }
  };

  const calculateCompletionPercentage = (taskList) => {
    const totalTasks = taskList.length;
    if (totalTasks === 0) return 0; // Prevent NaN by returning 0 if there are no tasks
    const completedTasks = taskList.filter(task => task.status === "done").length;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  return (
    <>
    <div className="flex flex-col min-h-screen ">
      <Header />
      <div className="flex-grow flex flex-col py-8 bg-white">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 flex flex-wrap items-center">
                <KanbanIcon className="mr-2 h-5 w-5 text-gray-500" />
                <span className="text-blue-600 font-semibold break-all">{product.name}</span>
                <span className="mx-2 text-gray-400 hidden sm:inline">·</span>
                <span className="text-gray-800 break-all">{sprint.name}</span>
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
                    {sprintList.map((sprintItem) => (
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
                  <span className="break-words">目标：{sprint.goal}</span>
                  <span>截止日期：{sprint.endDate}</span>
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
                          <span className="text-xs sm:text-sm font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 ml-2">
                            {backlog.status}
                          </span>
                        </div>
                        <div className="text-sm sm:text-base font-semibold text-gray-900 break-words flex-grow text-left">
                          {backlog.name}
                        </div>
                        <div className="flex items-center gap-2 justify-start">
                          {/* <div className="text-xs sm:text-sm text-gray-600">完成情况：</div> */}
                          <div className={`mr-8 text-xs sm:text-sm font-medium text-white px-3 py-1 rounded-full ${getProgressColor( calculateCompletionPercentage(backlog.taskList))} shadow-md`}>
                            {/* {calculateProgress(backlog.taskList)}% */}
                            {/* {completionPercentage}%、 */}
                            {calculateCompletionPercentage(backlog.taskList)}%
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
                      setShowModal={setShowModal}
                      setSelectedTask={setSelectedTask}
                      currentBacklog={currentBacklog}
                      setCurrentBacklog={setCurrentBacklog}
                      setBacklogList={setBacklogList}
                      className="w-full"
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
          selectedTaskHours={selectedTaskHours}
          setSelectedTaskHours={setSelectedTaskHours}
          sprint={sprint}
          selectedTask={selectedTask}
          showModal={showModal}
          setShowModal={setShowModal}
          handleTaskHoursSave={handleTaskHoursSave}
        />
      </div>
      <Footer />
      <Toaster />
    </div>
    </>
  );
}



function getProgressColor(progress) {
  if (progress === 100) return "bg-green-500";
  if (progress >= 75) return "bg-blue-500";
  if (progress >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

// function calculateProgress(taskList) {
//   if (!taskList || taskList.length === 0) return 0;
//   const completedTasks = taskList.filter(task => task.status === "done").length;
//   return Math.round((completedTasks / taskList.length) * 100);
// }


function KanbanIcon(props) {
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
      <path d="M6 5v11" />
      <path d="M12 5v6" />
      <path d="M18 5v14" />
    </svg>
  );
}
