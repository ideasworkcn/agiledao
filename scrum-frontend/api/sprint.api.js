import request from "@/utils/request";

// 获取当前产品的所有迭代
export function getSprints(productId) {
  return request({
    url: `/sprint/sprintList/${productId}`,
    method: "get",
  });
}

// 创建迭代
export function createSprintByProductId(productId) {
  return request({
    url: "/sprint/addSprint/" + productId,
    method: "post",
  });
}

// 修改迭代
export function updateSprint(data) {
  return request({
    url: "/sprint/updateSprint",
    method: "put",
    data,
  });
}

// 删除迭代
export function deleteSprint(id) {
  return request({
    url: `/sprint/deleteSprint/${id}`,
    method: "delete",
  });
}

// 获取迭代详情
export function getSprintDetail(id) {
  return request({
    url: `/sprint/getSprint/${id}`,
    method: "get",
  });
}

// 获取 product 所有的 backlog
export function getProductBacklogList(productId) {
  return request({
    url: `/backlog/backlogListByProduct/${productId}`,
    method: "get",
  });
}

// 获取当前 sprint 的 BacklogList
export function getSprintBacklogList(sprintId) {
  return request({
    url: `/sprint/getBacklogList/${sprintId}`,
    method: "get",
  });
}

// 移除 sprint中的backlog
export function removeBacklogFromSprint(sprintId, backlogId) {
  return request({
    url: "/sprint/removeSprintBacklog/" + sprintId + "/" + backlogId,
    method: "delete",
  });
}

// 添加 backlog到sprint
export function addBacklogToSprint(sprintId, backlogId) {
  return request({
    url: "/sprint/addSprintBacklog/" + sprintId + "/" + backlogId,
    method: "post",
  });
}

// 获取当前 sprint 的 burndown chart
export function getSprintBurndownChart(sprintId) {
  return request({
    url: `/sprint/burnDownChart/${sprintId}`,
    method: "get",
  });
}

// 获取当前 sprint 的 getSprintVelocityData
export function getSprintVelocityData(productId) {
  return request({
    url: `/sprint/velocityChart/${productId}`,
    method: "get",
  });
}

// 获取当前 sprint 的 getSprintWorkloadData
export function getSprintWorkloadData(sprintId) {
  return request({
    url: `/sprint/workloadChart/${sprintId}`,
    method: "get",
  });
}
