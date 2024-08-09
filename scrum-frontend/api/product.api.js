import request from "@/utils/request";

// 创建产品
export function createProduct(data) {
  return request({
    url: "/product/addProduct",
    method: "post",
    data,
  });
}

// 修改产品
export function updateProduct(data) {
  return request({
    url: "/product/modifyProduct",
    method: "put",
    data,
  });
}

// 删除产品
export function deleteProduct(id) {
  return request({
    url: `/product/deleteProduct/${id}`,
    method: "delete",
  });
}

// 查询产品列表
export function getProductList() {
  return request({
    url: "/product/productList",
    method: "get",
  });
}
