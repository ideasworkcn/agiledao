// http.js
import { toast } from "@/components/ui/use-toast";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// 创建 axios 实例
const service = axios.create({
  // baseURL: "http://localhost/service/v1", // 设置基础请求地址
  baseURL:baseURL,
  // baseURL: "http://scrum.ideaswork.cn/service/v1",
  timeout: 30 * 1000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理，例如添加 token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    let errorMessage = "发生未知错误，请稍后再试。"; // 默认错误消息
    if (error.response && error.response.data) {
      // 如果服务器返回了错误信息
      errorMessage =
        error.response.data.message ||
        `请求失败，状态码：${error.response.status}`;
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      errorMessage = "请求无响应，请检查网络连接。";
    } else {
      // 发送请求时出错
      errorMessage = error.message;
    }
    toast({ title: errorMessage, variant: "destructive" });
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // console.log("Response:", response);
    // 处理响应数据
    const res = response.data;
    const status = response.status;
    if (status !== 200) {
      // 处理自定义错误逻辑，例如显示错误提示
      // console.error("Error:", res.message);
      toast({ title: res, variant: "destructive" });
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    let errorMessage = "发生未知错误，请稍后再试。"; // 默认错误消息
    if (error.response && error.response.data) {
      // 如果服务器返回了错误信息
      errorMessage =
        error.response.data || `请求失败，状态码：${error.response.status}`;
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      errorMessage = "请先登录";
    } else {
      // 发送请求时出错
      errorMessage = error.message;
    }
    toast({ title: errorMessage, variant: "destructive" });
    return Promise.reject(error);
  }
);

export default service;
