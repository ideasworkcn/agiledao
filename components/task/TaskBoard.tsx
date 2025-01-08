

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { TrashIcon ,PlusIcon, ListTodo, Activity, Check} from "lucide-react";
import moment from "moment";
import { Toaster } from "@/components/ui/toaster";
import {  useToast } from "@/hooks/use-toast";
import { useMemo } from "react";
import { Task, User, Sprint, UserStory } from "@/types/Model";

interface TaskBoardProps {
    backlog: UserStory;
    sprint?: Sprint;
    userList: User[] | null; // Changed to explicitly allow null
    backlogList: UserStory[];
    setShowModal: (show: boolean) => void;
    setSelectedTask: (task: Task) => void;
    setBacklogList: (backlogs: UserStory[]) => void;
    currentBacklog?: UserStory;
    setCurrentBacklog: (backlog: UserStory) => void;
}

export default function TaskBoard({
  backlog,
  sprint,
  userList = [], // Default to empty array
  backlogList,
  setShowModal,
  setSelectedTask,
  setBacklogList,
  currentBacklog,
  setCurrentBacklog,
}: TaskBoardProps) {
  const { toast } = useToast();
  
  useEffect(() => {
    setCurrentBacklog(backlog);
  }, [backlog, setCurrentBacklog]);

  const [editingTask, setEditingTask] = useState<Task>();
 


  const filterTasksByStatus = (status: string) => {
    if (currentBacklog && Array.isArray(currentBacklog.tasks)) {
      return currentBacklog.tasks.filter((task: Task) => task.status === status);
    }
    return [];
  };

  const filteredTasks = useMemo(() => {
    const filterTasksByStatus = (status: string) => {
      if (currentBacklog?.tasks && Array.isArray(currentBacklog.tasks)) {
        return currentBacklog.tasks.filter((task: Task) => task.status === status);
      }
      return [];
    };

    return {
      "To Do": filterTasksByStatus("To Do"),
      "In Progress": filterTasksByStatus("In Progress"),
      "Done": filterTasksByStatus("Done"),
    };
  }, [currentBacklog?.tasks]);
  
  // 拖拽结束时的回调函数
  const onDragEnd = (result: { source: any; destination: any; draggableId: string }) => {
    const { source, destination, draggableId } = result;

    // 如果没有有效的目标位置，直接返回
    if (!destination) {
      return;
    }

    // 如果拖拽前后位置和状态都相同，直接返回
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceDroppableId = source.droppableId; // 源 droppable 的 ID
    const destinationDroppableId = destination.droppableId; // 目标 droppable 的 ID

    const draggedItemId = draggableId;

    // 复制现有任务列表
    const updatedTaskList = currentBacklog?.tasks ? Array.from(currentBacklog.tasks) : [];

    // 找到被拖拽的任务
    const draggedTaskIndex = updatedTaskList.findIndex(
      (task) => task.id === draggedItemId
    );
    const draggedTask = updatedTaskList[draggedTaskIndex];

    // 移除源位置的任务
    updatedTaskList.splice(draggedTaskIndex, 1);

    // 更新任务状态
    const updatedTask: Task = {
      ...draggedTask as Task,
      status: destinationDroppableId,
    };

    // 如果原先的状态和目标状态不同，修改任务的 startTime 和 endTime 时间格式为 yyyy-MM-dd HH:mm:ss
    if (sourceDroppableId !== destinationDroppableId) {
      if (destinationDroppableId === "In Progress") {
        updatedTask.start_time = updatedTask.start_time || moment().format("YYYY-MM-DD HH:mm:ss");
      }
      if (destinationDroppableId === "Done") {
        if (!updatedTask.start_time) {
          updatedTask.start_time = moment().format("YYYY-MM-DD HH:mm:ss");
        }
        updatedTask.end_time = moment().format("YYYY-MM-DD HH:mm:ss");
      }
    }
    
    // 插入到目标位置
    updatedTaskList.splice(destination.index, 0, updatedTask);

    // 更新每个任务的 px 属性
    const updatePxValues = (tasks: Task[], status: string) => {
      const updatedTasks = tasks
        .filter((task: Task) => task.status === status)
        .map((task: Task, index: number) => ({ ...task, px: index + 1 }));
      console.log(`Updated px values for ${status}:`, updatedTasks);
      return updatedTasks;
    };

    // 获取所有状态的任务，并更新 px 属性
    const updatedTodoTasks = updatePxValues(updatedTaskList as Task[], "To Do");
    const updatedInProgressTasks = updatePxValues(
      updatedTaskList as Task[],
      "In Progress"
    );

    const updatedDoneTasks = updatePxValues(updatedTaskList as Task[], "Done");

    // 合并更新后的任务列表
    const finalUpdatedTaskList = [
      ...updatedTodoTasks,
      ...updatedInProgressTasks,
      ...updatedDoneTasks,
    ];

    // 更新任务列表
    const updatedBacklog = {
      ...currentBacklog,
      tasks: finalUpdatedTaskList,
    };
    
    fetch('/api/task/batch', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBacklog.tasks),
    })
    .then(() => {
      const updateBacklogList = (prevBacklogList: UserStory[]) => {
        return prevBacklogList.map((b: UserStory) => {
          if (b.id === backlog.id) {
            return {
              ...b,
              tasks: updatedBacklog.tasks
            };
          }
          return b;
        });
      };
      
      setBacklogList(updateBacklogList(backlogList));
    });

    // Logging to trace the changes
    console.log("Dragged Item ID:", draggedItemId);
    console.log("Source Droppable ID:", sourceDroppableId);
    console.log("Destination Droppable ID:", destinationDroppableId);
    console.log("Final Updated Task List:", finalUpdatedTaskList);

    // 显示 toast 提示
    toast({
      title: "任务更新成功",
      variant: "default",
    });

  };

  // 添加新任务
  const addTodoTask = (taskList: Task[]) => {
    const newTask = {
      name: "New Task",
      description: "Description of the new task",
      product_id: sprint?.product_id,
      sprint_id: sprint?.id,
      user_story_id: backlog.id,
      member_id: localStorage.getItem("user_id") , 
      assigner_id: localStorage.getItem("user_id"),  
      px: taskList.length + 1,
      hours: 0,
      status: "To Do",
      create_time: moment().format("YYYY-MM-DD HH:mm:ss"),  // Use moment to format current time
      start_time: null,  // Changed to null for consistency
      end_time: null,  // Changed to null for consistency
      estimated_hours: 8
    };

    fetch('/api/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then(response => response.json())
      .then((createdTask: Task) => {
        toast({ title: "保存成功" });
        const updateBacklogList = (prevBacklogList: UserStory[]) => {
          return prevBacklogList.map(b => {
            if (b.id === backlog.id) {
              return {
                ...b,
                tasks: b.tasks ? [...b.tasks, createdTask] : [createdTask]
              };
            }
            return b;
          });
        };
        setBacklogList(updateBacklogList(backlogList));
      })
      .catch(error => {
        console.error('Error:', error);
        toast({ title: "保存失败", variant: "destructive" });
      });
  };

  // 编辑任务
  const handleEditStart = (event: React.MouseEvent, task: Task) => {
    event.stopPropagation();
    setEditingTask(task);
  };

  // 编辑任务时的输入框变化
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const { name, value } = e.target;
    if (editingTask) {
      setEditingTask(prev => ({
        ...prev as Task,
        [name]: value
      }));
    }
  };

  // 更改任务负责人
  const handleAssignerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const selectedUserId = e.target.value;
    
    if (!userList) {
      console.error('User list is not available');
      return;
    }

    const user = userList.find((user: User) => user.id === selectedUserId);
    
    if (!user) {
      console.error('User not found');
      return;
    }

    if (!editingTask) {
      console.error('No task is being edited');
      return;
    }

    const updatedTask: Task = {
      ...editingTask,
      member_id: user.id,
      assigner_id: user.id,
    };

    fetch(`/api/task`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })
      .then(response => response.json())
      .then((updatedTask: Task) => {
        if (!sprint?.id || !backlog?.id) {
          console.error('Sprint or backlog ID is missing');
          return;
        }

        // Update the task in the backlog list
        const updateBacklogList = (prev: UserStory[]): UserStory[] => {
          return prev.map(backlog => {
            if (backlog.id === currentBacklog?.id) {
              const updatedTasks = backlog.tasks?.map((task: Task) => 
                task.id === updatedTask.id ? updatedTask : task
              ) || [];
              return {
                ...backlog,
                tasks: updatedTasks
              };
            }
            return backlog;
          });
        };

        setBacklogList(updateBacklogList(backlogList));
        toast({ title: "任务负责人更新成功", variant: "default" });

    
    }).catch((error: Error) => {
      console.error('Error updating task:', error);
    });
  };

  // 保存编辑后的任务
  const handleEditSave = () => {
    if (!editingTask?.id) {
      return;
    }

    if (!sprint?.id || !backlog?.id) {
      console.error('Sprint or backlog ID is missing');
      return;
    }

    // 找到原始任务进行比较
    const originalTask = currentBacklog?.tasks?.find(task => task.id === editingTask.id);
    if (!originalTask) {
      return;
    }

    // 转换数据类型
    const updatedTask = {
      ...editingTask,
      estimated_hours: editingTask.estimated_hours && typeof editingTask.estimated_hours === 'string' 
        ? parseInt(editingTask.estimated_hours) 
        : editingTask.estimated_hours,
      hours: editingTask.hours && typeof editingTask.hours === 'string' 
        ? parseInt(editingTask.hours) 
        : editingTask.hours,
      px: editingTask.px && typeof editingTask.px === 'string' 
        ? parseInt(editingTask.px) 
        : editingTask.px,
    };

    // 检查是否有实际变化
    const hasChanges = Object.keys(updatedTask).some(key => {
      return JSON.stringify(updatedTask[key as keyof Task]) !== JSON.stringify(originalTask[key as keyof Task]);
    });

    if (!hasChanges) {
      setEditingTask(undefined);
      return;
    }

    fetch(`/api/task`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            setEditingTask(undefined);
            throw new Error(err.message || 'Failed to update task');
          });
        }
        return response.json();
      })
      .then((updatedTask: Task) => {
        setEditingTask(undefined);
        const updateBacklogTasks = (prevBacklogList: UserStory[]): UserStory[] => {
          return prevBacklogList.map(backlog => {
            return {
              ...backlog,
              tasks: backlog.tasks?.map((task: Task) => 
                task.id === updatedTask.id ? updatedTask : task
              ) || []
            };
          });
        };
        setBacklogList(updateBacklogTasks(backlogList));
        toast({ title: "保存成功", variant: "default" });
      })
      .catch(error => {
        console.error('Error saving task:', error);
        toast({ 
          title: "保存失败", 
          description: error.message || '请检查网络连接或联系管理员',
          variant: "destructive" 
        });
      });
  };

  // 更新任务工时
  const handleUpdateTaskHours = (event: React.MouseEvent, task: Task) => {
    event.stopPropagation();
    console.log(task);
    setShowModal(true);
    setSelectedTask(task);
  };

  const handleDeleteTask = (task: Task) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      fetch(`/api/task/${task.id}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete task');
        }
        console.log("Task deleted successfully!");
        const updateBacklogTasks = (prevBacklogList: UserStory[]): UserStory[] => {
          return prevBacklogList.map(backlog => {
            return {
              ...backlog,
              tasks: backlog.tasks?.filter((t: Task) => t.id !== task.id) || []
            };
          });
        };
        setBacklogList(updateBacklogTasks(backlogList));
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 w-full" onClick={handleEditSave}>
        {["To Do", "In Progress", "Done"].map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided, snapshot) => (
              <div
                className={`w-1/3 ${
                  status === "To Do"
                    ? "bg-blue-100"
                    : status === "In Progress"
                    ? "bg-orange-100"
                    : "bg-green-100"
                } px-4 py-2 rounded-md transition-all duration-200 ${
                  snapshot.isDraggingOver ? "ring-2 ring-blue-500" : ""
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
              <h2 className="mb-4 text-lg font-bold text-gray-800 flex items-center">
                {status === "To Do" && <ListTodo className="mr-2 h-5 w-5" />}
                {status === "In Progress" && <Activity className="mr-2 h-5 w-5" />}
                {status === "Done" && <Check className="mr-2 h-5 w-5" />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </h2>
                {(filteredTasks[status as keyof typeof filteredTasks] || []).map((task: Task, index: number) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-white p-4 rounded-lg shadow-sm mb-4 hover:shadow-md transition-all duration-200 ${
                          snapshot.isDragging ? "ring-2 ring-blue-500 scale-105" : ""
                        }`}
                      >
                        <div>
                          {editingTask?.id === task.id ? (
                            <>
                              <input
                                type="text"
                                name="name"
                                value={editingTask.name}
                                onChange={(event)=>handleEditChange(event)}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter') {
                                    handleEditSave();
                                  }
                                }}
                                onClick={(event) => event.stopPropagation()}
                                className="mb-2 w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 text-base font-medium transition-colors duration-200"
                              />
                              <input
                                name="description"
                                value={editingTask.description}
                                onChange={(event)=>handleEditChange(event)}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter') {
                                    handleEditSave();
                                  }
                                }}
                                onClick={(event) => event.stopPropagation()}
                                className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 text-sm text-gray-600 dark:text-gray-400 resize-none min-h-[60px] transition-colors duration-200"
                              />
                            </>
                          ) : (
                            <>
                              <h3 className="text-base font-semibold mb-2 cursor-pointer flex items-center justify-between">
                                <span
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleEditStart(event, task);
                                  }}
                                  className="hover:text-blue-600 transition-colors duration-200"
                                >
                                  {task.name}
                                </span>
                                <button
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleDeleteTask(task);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200 rounded-full hover:bg-red-100"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </h3>
                              <p
                                className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleEditStart(event, task);
                                }}
                              >
                                {task.description}
                              </p>
                            </>
                          )}
                          <div className="text-xs flex flex-row items-center justify-between font-medium pt-2 text-gray-500 dark:text-gray-400">
                            {editingTask?.id === task.id ? (
                              <>
                                <div>
                                  负责人：
                                  <select
                                    value={editingTask?.member_id || ""}
                                    onChange={handleAssignerChange}
                                    onClick={(event) => event.stopPropagation()}
                                    className="border rounded px-2 py-1 text-sm"
                                  >
                                    <option value="">选择负责人</option>
                                    {Array.isArray(userList) && userList.map((user) => (
                                      <option key={user.id} value={user.id}>
                                        {user.name || "未知用户"}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="items-center hidden xl:flex">
                                  <div className="ml-2">
                                    预估：
                                    <input
                                      type="number"
                                      name="estimated_hours"
                                      value={editingTask.estimated_hours}
                                      onChange={handleEditChange}
                                      onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                          handleEditSave();
                                        }
                                      }}
                                      onClick={(event) => event.stopPropagation()}
                                      className="mb-1 w-10 border-b"
                                    />{" "}
                                    h
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  onClick={(event) => handleEditStart(event, task)}
                                  className="flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded py-1 transition-colors duration-200 cursor-pointer"
                                >
                                  <span className="font-medium text-gray-600 dark:text-gray-300">负责人:</span>
                                  <span className="text-gray-800 dark:text-gray-200">{task.assigner?.name}</span>
                                </div>
                                <div
                                  onClick={(event) => handleEditStart(event, task)}
                                  className="hidden xl:flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded py-1 px-2 transition-colors duration-200 cursor-pointer"
                                >
                                  <span className="font-medium text-gray-600 dark:text-gray-300">预估:</span>
                                  <span className="text-gray-800 dark:text-gray-200">{task.estimated_hours} h</span>
                                </div>
                                <div className="hidden xl:flex">工时：{task.hours} h</div>
                                <div className="flex items-center">
                                  <button
                                    className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    onClick={(event) => handleUpdateTaskHours(event, task)}
                                  >
                                    工时
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
                {status === "To Do" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addTodoTask(filterTasksByStatus(status))}
                      className="w-full mt-2 bg-blue-50 text-blue-700 hover:bg-blue-300 hover:text-blue-800 transition-colors duration-200 font-medium flex items-center justify-center"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      <span>添加任务</span>
                    </Button>
                )}
              </div>
            )}
          </Droppable>
        ))}
      </div>
      <Toaster/>
    </DragDropContext>
  );
}
