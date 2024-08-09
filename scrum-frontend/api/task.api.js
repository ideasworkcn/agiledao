import request from "@/utils/request";

// 获取某个产品的 sprint 的所有backlog和任务列表
export function getSprintBacklogsAndTasks(sprintId) {
  return request({
    url: `/task/getSprintBacklogsAndTasks/${sprintId}`,
    method: "get",
  });
}

// 获取某个 backlog 的任务列表
export function getBacklogTaskListBySprintIdAndBacklogId(sprintId, backlogId) {
  return request({
    url: `/task/backlogListBySprint/${sprintId}/${backlogId}`,
    method: "get",
  });
}

// 为某个 sprint的 backlog 添加任务
export function addTaskToSprint(data) {
  return request({
    url: "/task/addTaskToSprint",
    method: "post",
    data,
  });
}

// 获取某个 sprint 的任务列表
export function getTaskListBySprintId(sprintId) {
  return request({
    url: `/task/taskListBySprint/${sprintId}`,
    method: "get",
  });
}

// 修改任务
export function updateTask(data) {
  return request({
    url: "/task/modifyTask",
    method: "put",
    data,
  });
}

// 删除任务
export function deleteTask(id) {
  return request({
    url: `/task/deleteTask/${id}`,
    method: "delete",
  });
}

// 修改任务列表的排序
export function updateTaskListPx(data) {
  return request({
    url: "/task/updateTaskListPx",
    method: "put",
    data,
  });
}

// 获取任务的工时信息
export function getTaskHours(taskId) {
  return request({
    url: `/task/getTaskDetail/${taskId}`,
    method: "get",
  });
}

// 修改任务的工时信息
export function updateTaskHours(data) {
  return request({
    url: "/task/updateTaskHours",
    method: "put",
    data,
  });
}
