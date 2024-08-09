import request from "@/utils/request";

// 修改 Backlog
export function updateBacklog(data) {
  console.log(data);
  return request({
    url: "/backlog/modifyBacklog",
    method: "put",
    data,
  });
}

// 根据产品查询 Backlog列表
export function getBacklogListByProductId(productId) {
  return request({
    url: "/backlog/backlogListByProduct/" + productId,
    method: "get",
  });
}

// 查询产品 feature 列表
export function getFeatureListByProductId(productId) {
  return request({
    url: "/backlog/featureListByProduct?productId=" + productId,
    method: "get",
  });
}
