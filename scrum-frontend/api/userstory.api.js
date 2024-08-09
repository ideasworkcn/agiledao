import request from "@/utils/request";

// 添加一个Epic
export function addEpic(data) {
  return request({
    url: "/userstory/epics",
    method: "post",
    data,
  });
}

// 修改一个Epic
export function modifyEpic(data) {
  return request({
    url: "/userstory/epics",
    method: "put",
    data,
  });
}

// 删除一个Epic
export function deleteEpic(id) {
  return request({
    url: `/userstory/epics/${id}`,
    method: "delete",
  });
}

// 添加一个Feature
export function addFeature(data) {
  return request({
    url: "/userstory/features",
    method: "post",
    data,
  });
}

// 修改一个Feature
export function modifyFeature(data) {
  return request({
    url: "/userstory/features",
    method: "put",
    data,
  });
}

// 删除一个Feature
export function deleteFeature(id) {
  return request({
    url: `/userstory/features/${id}`,
    method: "delete",
  });
}

// 添加一个Backlog
export function addBacklog(data) {
  return request({
    url: "/userstory/backlogs",
    method: "post",
    data,
  });
}

// 修改一个Backlog
export function modifyBacklog(data) {
  return request({
    url: "/userstory/backlogs",
    method: "put",
    data,
  });
}

// 删除一个Backlog
export function deleteBacklog(id) {
  return request({
    url: `/userstory/backlogs/${id}`,
    method: "delete",
  });
}

// 查询某一产品的用户故事地图
export function getUserStoryMap(productId) {
  return request({
    url: `/userstory/userStoryMapByProductId/${productId}`,
    method: "get",
  });
}

// 批量修改 epic 排序
export function updateEpicPx(epicList) {
  return request({
    url: "/userstory/epics/px",
    method: "put",
    data: epicList,
  });
}

// 批量修改 feature 排序
export function updatedFeaturePx(featureList) {
  return request({
    url: "/userstory/features/px",
    method: "put",
    data: featureList,
  });
}

// 批量修改 backlogs 排序
export function updatedBacklogPx(backlogList) {
  return request({
    url: "/userstory/backlogs/px",
    method: "put",
    data: backlogList,
  });
}
