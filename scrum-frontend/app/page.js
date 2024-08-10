"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getProductList } from "@/api/product.api";
import { ChevronDownIcon } from "lucide-react";
import { 
  BookOpen, 
  ListTodo, 
  TrendingUpIcon, 
  CheckSquare, 
  Users, 
  BarChart2 
} from 'lucide-react';

const HomePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentWorkspace, setCurrentWorkspace] = useState("");
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    getProductList()
      .then((data) => {
        console.log(data);
        if (data.length > 0) {
          if (!localStorage.getItem("currentWorkspace")) {
            localStorage.setItem("currentWorkspace", JSON.stringify(data[0]));
            localStorage.setItem("productId", data[0].id);
          } else {
            setCurrentWorkspace(
              JSON.parse(localStorage.getItem("currentWorkspace"))
            );
          }
        }
        setWorkspaces(data);
      })
      .catch((error) => {
        console.error("获取产品列表失败", error);
        router.push("/login");
      });
  }, []);

  const handleWorkspaceChange = (workspace) => {
    setCurrentWorkspace(workspace);
    localStorage.setItem("currentWorkspace", JSON.stringify(workspace));
    router.push("/");
  };

  const handleManageWorkspaces = () => {
    router.push("/product");
  };

  const menuItems = [
    {
      href: "/userstory",
      title: "用户故事",
      content: "管理用户故事地图",
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      href: "/backlog",
      title: "产品待办",
      content: "查看和管理产品待办",
      icon: ListTodo,
      color: "text-green-500",
    },
    { 
      href: "/sprint", 
      title: "冲刺", 
      content: "创建和管理冲刺",
      icon: TrendingUpIcon,
      color: "text-yellow-500",
    },
    { 
      href: "/task", 
      title: "任务", 
      content: "分配和跟踪任务",
      icon: CheckSquare,
      color: "text-purple-500",
    },
    { 
      href: "/user", 
      title: "用户管理", 
      content: "管理用户和权限",
      icon: Users,
      color: "text-red-500",
    },
    {
      href: "/dashboard",
      title: "产品报表",
      content: "查看冲刺和产品燃尽图",
      icon: BarChart2,
      color: "text-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-black">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          敏捷之道 AgileDao
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 text-xl">
          极简敏捷开发 Scrum 管理工具
        </p>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <h2 className="text-xl sm:text-2xl text-gray-800 dark:text-gray-200 mb-4 sm:mb-0">
              当前产品:{" "}
              <span className="text-2xl sm:text-3xl font-semibold text-blue-600 dark:text-blue-400 block sm:inline mt-1 sm:mt-0">
                {currentWorkspace.name}
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-white text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm transition-colors duration-200 flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg"
                  >
                    <span>切换产品</span>
                    <ChevronDownIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {workspaces.map((workspace) => (
                    <DropdownMenuItem
                      key={workspace.id}
                      onClick={() => handleWorkspaceChange(workspace)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 px-3 sm:px-4 py-1 sm:py-2 text-base sm:text-lg"
                    >
                      {workspace.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                onClick={handleManageWorkspaces}
                className="w-full sm:w-auto hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg"
              >
                管理产品
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <Link href={item.href} key={item.href} className="block">
              <Card className="bg-gray-50 dark:bg-gray-900 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {item.icon && <item.icon className={`w-10 h-10 ${item.color}`} />}
                    <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200 ml-4">
                      {item.title}
                    </CardTitle>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {item.content}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
