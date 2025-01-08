"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { Map, ListTodo, TrendingUpIcon, CheckSquare, Users, BarChart2 , Briefcase,Gauge } from "lucide-react"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/Model";

interface MenuItem {
  href: string;
  title: string;
  content: string;
  icon: React.ElementType;
  color: string;
  roles: string[];
}


export default function Workspace() {
  const [products, setProducts] = React.useState([]);
  const router = useRouter();
  const [currentProduct, setCurrentProduct] = useState<Product>();
  const [userRole, setUserRole] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) throw new Error('Failed to fetch user data');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user data', error);
      router.push('/login');
      return null;
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await fetch('/api/product');
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch products', error);
      return [];
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const [productsData, userData] = await Promise.all([
        fetchProductData(),
        fetchUserData()
      ]);

      if (!userData) return;

      setProducts(productsData);
      setUserRole(userData.role);
      
      if (productsData.length > 0) {
        const storedProduct = localStorage.getItem('currentProduct');
        const selectedProduct = storedProduct ? JSON.parse(storedProduct) : productsData[0];
        setCurrentProduct(selectedProduct);
        if (!storedProduct) {
          localStorage.setItem('currentProduct', JSON.stringify(selectedProduct));
        }
      }

      const filteredItems = getMenuItems(userData.role);
      setMenuItems(filteredItems);
      setLoading(false);
    };

    initializeData();
  }, [router]);

  const handleProductChange = (product: any) => {
    setCurrentProduct(product);
    localStorage.setItem('currentProduct', JSON.stringify(product));
  }

  const handleManageProducts = () => {
    router.push('/product');
  }

  const getMenuItems = (role: string) => {
    const allMenuItems = [
      {
        href: "/userstory",
        title: "用户故事",
        content: "管理用户故事地图",
        icon: Map,
        color: "text-blue-500",
        roles: ['Product Owner', 'Scrum Master']
      },
      {
        href: "/backlog",
        title: "产品待办",
        content: "查看和管理产品待办",
        icon: ListTodo,
        color: "text-green-500",
        roles: ['Product Owner', 'Scrum Master']
      },
      { 
        href: "/sprint", 
        title: "Sprint 冲刺", 
        content: "创建和管理冲刺",
        icon: TrendingUpIcon,
        color: "text-yellow-500",
        roles: ['Scrum Master']
      },
      { 
        href: "/task", 
        title: "任务", 
        content: "分配和跟踪任务",
        icon: CheckSquare,
        color: "text-purple-500",
        roles: ['Team Member', 'Scrum Master', 'Product Owner']
      },
      { 
        href: "/product", 
        title: "产品管理", 
        content: "管理和配置产品",
        icon: Briefcase,
        color: "text-teal-500",
        roles: ['Scrum Master']
      },
      { 
        href: "/team", 
        title: "团队管理", 
        content: "管理用户和权限",
        icon: Users,
        color: "text-red-500",
        roles: ['Scrum Master']
      },
      {
        href: "/dashboard",
        title: "产品报表",
        content: "查看冲刺和产品燃尽图",
        icon: Gauge,
        color: "text-indigo-500",
        roles: ['Team Member', 'Scrum Master', 'Product Owner']
      },
      {
        href: "/worklog/user",
        title: "工作统计",
        content: "查看工作统计",
        icon: BarChart2,
        color: "text-orange-500",
        roles: ['Team Member', 'Scrum Master', 'Product Owner']
      },
      {
        href: "/worklog/scrum-master",
        title: "工作统计",
        content: "查看工作统计",
        icon: BarChart2,
        color: "text-orange-500",
        roles: [ 'Scrum Master',]
      },
 
    ];

    const filteredItems = allMenuItems.filter(item => {
      return item.roles.includes(role);
    });

    return filteredItems;
  }

  return (
    <div className="flex flex-col bg-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          敏捷之道 AgileDao
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 text-xl">
          极简敏捷开发 Scrum 管理工具
        </p>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <h2 className="text-xl sm:text-2xl text-gray-800 dark:text-gray-200 mb-4 sm:mb-0">
              当前产品:{" "}
              <span className="text-2xl sm:text-3xl font-semibold text-blue-600 dark:text-blue-400 block sm:inline mt-1 sm:mt-0">
                {currentProduct?.name ?? "未选择产品"}
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-white text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full transition-colors duration-200 flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg"
                  >
                    <span>切换产品</span>
                    <ChevronDownIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {products.map((product: any) => (
                    <DropdownMenuItem
                      key={product.id}
                      onClick={() => handleProductChange(product)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 px-3 sm:px-4 py-1 sm:py-2 text-base sm:text-lg"
                    >
                      {product.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {userRole === 'Scrum Master' && (
                <Button
                  variant="outline"
                  onClick={handleManageProducts}
                  className="w-full sm:w-auto hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg"
                >
                  管理产品
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="dark:bg-gray-900 rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <CardTitle className="ml-4">
                      <Skeleton className="h-8 w-32" />
                    </CardTitle>
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4 mt-2" />
                </CardContent>
              </Card>
            ))
          ) : (
            menuItems?.map((item) => (
              <Link href={item.href} key={item.href} className="block">
                <Card className="dark:bg-gray-900 rounded-3xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
            ))
          )}
        </div>
      </div>
    </div>
  )
}
