// user.js
import request from "@/utils/request";

// 登录
export function login(data) {
  return request({
    url: "/user/login",
    method: "post",
    data,
  });
}

// 获取所有用户
export function getUsers() {
  return request({
    url: "/user/listUser",
    method: "get",
  });
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/user/deleteUser/${id}`,
    method: "delete",
  });
}

// 更新用户
export function updateUser(data) {
  return request({
    url: "/user/updateUser",
    method: "put",
    data,
  });
}

// 创建用户
export function createUser(data) {
  return request({
    url: "/user/createUser",
    method: "post",
    data,
  });
}

// 修改密码
export function modifyPassword(data) {
  return request({
    url: "/user/modifyPassword",
    method: "put",
    data,
  });
}

// resetPassword
export function resetPasswordByUserId(id) {
  return request({
    url: `/user/resetPassword/${id}`,
    method: "put",
  });
}
