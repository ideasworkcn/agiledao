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
  getSprintBacklogsAndTasks,
  addTaskToSprint,
  getTaskListBySprintId,
  updateTask,
  deleteTask,
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

  useEffect(() => {
    // 检查是否登录，未登录则跳转
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) {
      Router.push("/login");
      return;
    }
    let product = JSON.parse(localStorage.getItem("currentWorkspace"));
    if (!product) {
      return;
    }
    setProduct(product);
    let productId = product.id;
    // 获取 sprints
    getSprints(productId).then((res) => {
      setSprintList(res);
      if (res.length > 0) {
        setSprint(res[0]);
        // 获取 sprint backlog
        getSprintBacklogsAndTasks(res[0].id).then((res) => {
          setBacklogList(res);
        });
      }
    });
  }, []);

  useEffect(() => {
    // 获取 selectedTask 的工时信息
    if (selectedTask) {
      getTaskHours(selectedTask.id).then((res) => {
        setSelectedTaskHours(res.taskHoursList);
      });
    }
  }, [selectedTask]);

  // 保存工时信息
  const handleTaskHoursSave = () => {
    console.log(selectedTaskHours);
    updateTaskHours(selectedTaskHours).then((res) => {
      console.log(res);
      setSelectedTaskHours(res);
      setShowModal(false);
      // 重新获取 backlog
    });
  };

  const finishBacklog = (backlog) => {
    backlog.status = "已完成";
    window.confirm("确定完成 Backlog 吗？")
      ? modifyBacklog(backlog).then((res) => {
          getSprintBacklogsAndTasks(sprint.id).then((res) => {
            setBacklogList(res);
          });
        })
      : null;
  };

  const handleSprintChange = (sprint) => {
    setSprint(sprint);
    getSprintBacklogsAndTasks(sprint.id).then((res) => {
      setBacklogList(res);
    });
  };

  return (
    <>
      <Header />
      <div className="flex flex-col h-screen bg-gray-200">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl  py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900 flex items-center">
                <KanbanIcon className="mr-2 h-5 w-5 text-gray-500 text-xl" />
                <span className="text-blue-600 font-semibold">{product.name}</span>
                <span className="mx-2 text-gray-400">·</span>
                <span className="text-gray-800">{sprint.name}</span>
                <span className="ml-2 text-gray-600">任务看板</span>
              </h1>
              <div className="flex items-center justify-between space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                    >
                      切换 Sprint 任务看板
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {sprintList.map((sprint) => (
                      <DropdownMenuItem
                        key={sprint.id}
                        onClick={() => handleSprintChange(sprint)}
                      >
                        {sprint.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="text-sm text-gray-600 hidden xl:flex">
                目标：{sprint.goal}
              </div>
              <div className="text-sm text-gray-600 hidden xl:flex">
                截止日期：{sprint.endDate}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto py-6 px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="space-y-4">
            {backlogList.map((backlog) => (
              <AccordionItem
                key={backlog.id}
                value={backlog.id}
                className="bg-white rounded-lg shadow"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between w-full text-left">
                    <div className="flex items-center space-x-4 flex-grow">
                      <div className="w-32 font-medium text-gray-700">
                        {backlog.number}
                      </div>
                      <div className="flex-1 text-lg font-semibold text-gray-900 truncate">
                        {backlog.name}
                        <span className="ml-2 text-sm font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {backlog.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {/* <div className="text-sm text-gray-600">
                        完成进度: {calculateProgress(backlog.taskList)}%
                      </div> */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          finishBacklog(backlog);
                        }}
                        className="bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                      >
                        完成 Backlog
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 bg-gray-50 rounded-b-lg">
                  <TaskBoard
                    sprint={sprint}
                    backlog={backlog}
                    setShowModal={setShowModal}
                    setSelectedTask={setSelectedTask}
                    className="w-full"
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </main>
        <EditableTable
          className="w-full"
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
    </>
  );
}
function calculateProgress(taskList) {
  if (!taskList || taskList.length === 0) return 0;
  const completedTasks = taskList.filter(task => task.status === "done").length;
  const progress = Math.round((completedTasks / taskList.length) * 100);
  
  return progress;
}

function EditableTable({
  selectedTaskHours,
  setSelectedTaskHours,
  sprint,
  selectedTask,
  showModal,
  setShowModal,
  handleTaskHoursSave,
}) {
  const handleAddRow = () => {
    const TaskHours = {
      id: "",
      note: "",
      productId: sprint.productId,
      sprintId: sprint.id,
      taskId: selectedTask.id,
      memberId: selectedTask.memberId,
      assigner: selectedTask.assigner,
      createTime: "",
      hours: 0,
    };
    setSelectedTaskHours([...selectedTaskHours, TaskHours]);
  };

  const handleChange = (index, field, value) => {
    const newRows = [...selectedTaskHours];
    newRows[index][field] = value;
    setSelectedTaskHours(newRows);
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="w-[1000px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {selectedTask ? "任务工时" : "任务工时"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {selectedTask ? "编辑工时信息并保存更改" : "编辑工时信息并保存更改"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            {selectedTaskHours.map((row, index) => (
              <div
                key={index}
                className="flex flex-row items-center justify-between mb-4 bg-white p-1 rounded-md shadow-sm"
              >
                <input
                  className="w-3/5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="工作说明"
                  value={row.note}
                  onChange={(e) => handleChange(index, "note", e.target.value)}
                />
                <div className="flex items-center w-1/5 ">
                  <input
                    className="flex-1 w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    placeholder="用时"
                    value={row.hours}
                    onChange={(e) =>
                      handleChange(index, "hours", e.target.value)
                    }
                  />
                  <span className="ml-2 text-gray-600">h</span>
                </div>
                <Label className="w-1/5 ml-2 text-gray-600">
                  {row.createTime}
                </Label>
              </div>
            ))}
            <Button
              onClick={handleAddRow}
              variant="outline"
              className="mt-4 w-full flex items-center justify-center"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              添加新行
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              取消
            </Button>
          </DialogClose>
          <Button
            onClick={handleTaskHoursSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
