import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "../ui/button";
import { useState, useEffect, use } from "react";
import { TrashIcon ,PlusIcon} from "lucide-react";
import {
  getBacklogTaskListBySprintIdAndBacklogId,
  addTaskToSprint,
  updateTask,
  updateTaskListPx,
  deleteTask,
} from "@/api/task.api";
import { getUsers } from "@/api/user.api";
import moment from "moment";
import { toast } from "@/components/ui/use-toast";
import { useMemo } from "react";

export default function TaskBoard({
  backlog,
  sprint,
  setShowModal,
  setSelectedTask,
  setBacklogList,
  currentBacklog,
  setCurrentBacklog
}) {
  useEffect(() => {
    setCurrentBacklog(backlog);
  }, [backlog, setCurrentBacklog]);

  const [editingTask, setEditingTask] = useState({ id: "" });
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    getUsers().then((res) => {
      setUserList(res);
    });
  }, []);

  const filterTasksByStatus = (status) => {
    if (currentBacklog && Array.isArray(currentBacklog.taskList)) {
      return currentBacklog.taskList.filter((task) => task.status === status);
    }
    return [];
  };

  const filteredTasks = useMemo(() => {
    const filterTasksByStatus = (status) => {
      if (currentBacklog && Array.isArray(currentBacklog.taskList)) {
        return currentBacklog.taskList.filter((task) => task.status === status);
      }
      return [];
    };

    return {
      todo: filterTasksByStatus("todo"),
      inprogress: filterTasksByStatus("inprogress"),
      done: filterTasksByStatus("done"),
    };
  }, [currentBacklog.taskList]);
  // 拖拽结束时的回调函数
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // 如果没有有效的目标位置，直接返回
    if (!destination) {
      return;
    }

    const sourceDroppableId = source.droppableId; // 源 droppable 的 ID
    const destinationDroppableId = destination.droppableId; // 目标 droppable 的 ID

    const draggedItemId = draggableId;

    // 复制现有任务列表
    const updatedTaskList = Array.from(currentBacklog.taskList);

    // 找到被拖拽的任务
    const draggedTaskIndex = updatedTaskList.findIndex(
      (task) => task.id === draggedItemId
    );
    const draggedTask = updatedTaskList[draggedTaskIndex];

    // 移除源位置的任务
    updatedTaskList.splice(draggedTaskIndex, 1);

    // 更新任务状态
    draggedTask.status = destinationDroppableId;
    // 如果原先的状态和目标状态不同，修改任务的 startTime 和 endTime 时间格式为 yyyy-MM-dd HH:mm:ss
    if (sourceDroppableId !== destinationDroppableId) {
      if (destinationDroppableId === "inprogress") {
        draggedTask.startTime = moment().format("YYYY-MM-DD HH:mm:ss");
      }
      if (destinationDroppableId === "done") {
        draggedTask.endTime = moment().format("YYYY-MM-DD HH:mm:ss");
      }
    }
    // 插入到目标位置
    updatedTaskList.splice(destination.index, 0, draggedTask);

    // 更新每个任务的 px 属性
    const updatePxValues = (tasks, status) => {
      const updatedTasks = tasks
        .filter((task) => task.status === status)
        .map((task, index) => ({ ...task, px: index + 1 }));
      console.log(`Updated px values for ${status}:`, updatedTasks);
      return updatedTasks;
    };

    // 获取所有状态的任务，并更新 px 属性
    const updatedTodoTasks = updatePxValues(updatedTaskList, "todo");
    const updatedInProgressTasks = updatePxValues(
      updatedTaskList,
      "inprogress"
    );
    const updatedDoneTasks = updatePxValues(updatedTaskList, "done");

    // 合并更新后的任务列表
    const finalUpdatedTaskList = [
      ...updatedTodoTasks,
      ...updatedInProgressTasks,
      ...updatedDoneTasks,
    ];

    // 更新任务列表
    const updatedBacklog = {
      ...currentBacklog,
      taskList: finalUpdatedTaskList,
    };
    updateTaskListPx(updatedBacklog.taskList).then(() => {
      getBacklogTaskListBySprintIdAndBacklogId(sprint.id, backlog.id).then(
        (res) => {
          setCurrentBacklog(updatedBacklog);
          setBacklogList((prevBacklogList) =>
            prevBacklogList.map((b) =>
              b.id === backlog.id ? updatedBacklog : b
            )
          );
        }
      );
    });

    // Logging to trace the changes
    console.log("Dragged Item ID:", draggedItemId);
    console.log("Source Droppable ID:", sourceDroppableId);
    console.log("Destination Droppable ID:", destinationDroppableId);
    console.log("Final Updated Task List:", finalUpdatedTaskList);


    // 显示 toast 提示
    toast({
      title: "任务更新成功",
      status: "success",
    });

  };

  // 添加新任务
  const addTodoTask = (taskList) => {
    const newTask = {
      id: "",
      name: "New Task",
      description: "Description of the new task",
      productBacklogId: backlog.id,
      sprintId: sprint.id,
      productId: sprint.productId,
      memberId: localStorage.getItem("userId"),
      assigner: localStorage.getItem("username"),
      px: taskList.length + 1,
      hours: 8,
      status: "todo",
      createTime: "",
      startTime: "",
      endTime: "",
    };


    addTaskToSprint(newTask).then((task) => {
      getBacklogTaskListBySprintIdAndBacklogId(
        sprint.id,
        task.productBacklogId
      ).then((res) => {
        console.log(res);
        toast({ title: "保存成功", status: "success" });
        setCurrentBacklog(res);
        setBacklogList((prevBacklogList) =>
          prevBacklogList.map((b) =>
            b.id === backlog.id ? res : b
          )
        );
      });
    });
  };

  // 编辑任务
  const handleEditStart = (event, task) => {
    event.stopPropagation();
    setEditingTask(task);
  };

  // 编辑任务时的输入框变化
  const handleEditChange = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setEditingTask({ ...editingTask, [name]: value });
  };

  // 更改任务负责人
  const handleAssignerChange = (e) => {
    e.stopPropagation();
    // console.log(e.target.value);
    const user = userList.find((user) => user.id === e.target.value);
    console.log(user);
    const updatedTask = {
      ...editingTask,
      memberId: user.id,
      assigner: user.name,
    };

    updateTask(updatedTask).then(() => {
      getBacklogTaskListBySprintIdAndBacklogId(sprint.id, backlog.id).then(
        (res) => {
          setEditingTask({ id: "" });
          setCurrentBacklog(res);
        }
      );
    });
  };

  // 保存编辑后的任务
  const handleEditSave = () => {
    if (editingTask.id) {
      updateTask(editingTask).then(() => {
        getBacklogTaskListBySprintIdAndBacklogId(sprint.id, backlog.id).then(
          (res) => {
            setEditingTask({ id: "" });
            setCurrentBacklog(res);
            toast({ title: "保存成功", status: "success" });
          }
        );
      });
    }
  };

  // 更新任务工时
  const handleUpdateTaskHours = (event, task) => {
    event.stopPropagation();
    console.log(task);
    setShowModal(true);
    setSelectedTask(task);
  };

  const handleDeleteTask = (task) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      // Call your API to delete the task
      console.log("Deleting task:", task);
      deleteTask(task.id).then(() => {
        console.log("Task deleted successfully!");
        setCurrentBacklog({
          ...currentBacklog,
          taskList: currentBacklog.taskList.filter((t) => t.id !== task.id),
        });
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} className="w-full">
      <div className="flex space-x-4 w-full" onClick={handleEditSave}>
        {["todo", "inprogress", "done"].map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                className={`w-1/3 ${
                  status === "todo"
                    ? "bg-blue-100"
                    : status === "inprogress"
                    ? "bg-orange-100"
                    : "bg-green-100"
                } px-4 py-2 rounded-md`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
              <h2 className="mb-4 text-lg font-bold text-gray-800 flex items-center">
                {status === "todo" && <ListTodoIcon className="mr-2 h-5 w-5" />}
                {status === "inprogress" && <ActivityIcon className="mr-2 h-5 w-5" />}
                {status === "done" && <CheckIcon className="mr-2 h-5 w-5" />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </h2>
                {filteredTasks[status].map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-4 rounded-lg shadow-sm mb-4 hover:shadow-md transition-shadow duration-200"
                
                      >
                        <div>
                          {editingTask.id === task.id ? (
                            <>
                              <input
                                type="text"
                                name="name"
                                value={editingTask.name}
                                onChange={handleEditChange}
                                onClick={(event) => event.stopPropagation()}
                                className="mb-2 w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 text-base font-medium transition-colors duration-200"
                              />
                              <textarea
                                name="description"
                                value={editingTask.description}
                                onChange={handleEditChange}
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
                            {editingTask.id === task.id ? (
                              <>
                                <div>
                                  负责人：
                                  <select
                                    value={editingTask.memberId || ""}
                                    onChange={handleAssignerChange}
                                    onClick={(event) => event.stopPropagation()}
                                  >
                                    {userList.map((user) => (
                                      <option key={user.id} value={user.id}>
                                        {user.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className=" items-center  hidden xl:flex">
                                  <div className="ml-2">
                                    预估：
                                    <input
                                      type="number"
                                      name="estimatedHours"
                                      value={editingTask.estimatedHours}
                                      onChange={handleEditChange}
                                      onClick={(event) =>
                                        event.stopPropagation()
                                      }
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
                                  className="flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded  py-1 transition-colors duration-200 cursor-pointer"
                                >
                                  <span className="font-medium text-gray-600 dark:text-gray-300">负责人:</span>
                                  <span className="text-gray-800 dark:text-gray-200">{task.assigner}</span>
                                </div>
                                <div
                                  
                                  onClick={(event) => handleEditStart(event, task)}
                                  className=" hidden xl:flex  items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded py-1 px-2 transition-colors duration-200 cursor-pointer"
                                >
                                  <span className="font-medium text-gray-600 dark:text-gray-300">预估:</span>
                                  <span className="text-gray-800 dark:text-gray-200">{task.estimatedHours} h</span>
                                </div>
                                <div className="hidden xl:flex">工时：{task.hours} h</div>
                                <div className="flex items-center ">
                                  <button
                                    className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    onClick={(event) =>
                                      handleUpdateTaskHours(event, task)
                                    }
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
                {status === "todo" && (
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
      
    </DragDropContext>
    
  );
}

function ActivityIcon(props) {
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
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  );
}

function CheckIcon(props) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ListTodoIcon(props) {
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
      <rect x="3" y="5" width="6" height="6" rx="1" />
      <path d="m3 17 2 2 4-4" />
      <path d="M13 6h8" />
      <path d="M13 12h8" />
      <path d="M13 18h8" />
    </svg>
  );
}
