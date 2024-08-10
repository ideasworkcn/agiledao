"use client";
import React, { useState, useEffect } from "react";
import Board from "@/components/userstory/Board";
import "@/app/globals.css";
import { getUserStoryMap } from "@/api/userstory.api";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

const StoryBoard = () => {
  const [columns, setColumns] = useState([]);
  const [product, setProduct] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let product = JSON.parse(localStorage.getItem("currentWorkspace"));
    setProduct(product);
    let productId = product.id;
    getUserStoryMap(productId).then((data) => {
      console.log(data);
      setColumns(data);
    });
  }, []);
  // 给我一个scrum管理软件的用户故事地图，按照如下格式返回json:
  // const initialData = [
  //   {
  //     id: "Epic-1",
  //     name: "产品待办列表管理",
  //     features: [
  //       {
  //         id: "feature-1",
  //         content: "管理产品待办事项",
  //         backlogs: [
  //           {
  //             id: "story-1",
  //             content: "产品负责人创建产品待办事项",
  //           },
  //           {
  //             id: "story-2",
  //             content: "产品负责人编辑和删除产品待办事项",
  //           },
  //           {
  //             id: "story-3",
  //             content: "产品负责人排序产品待办事项",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //  ]

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col p-4 md:p-6 bg-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 border-b-2 border-blue-300 dark:border-blue-700 pb-2 pl-2 w-full sm:w-auto text-center sm:text-left">
            {product.name}<span className="text-gray-800 dark:text-gray-200 block sm:inline"> 用户故事地图</span>
          </h1>
          <Button
            onClick={toggleFullscreen}
            className="bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2"
          >
            {isFullscreen ? "退出全屏" : "全屏显示"}
          </Button>
        </div>
        <div className="flex-grow overflow-x-auto flex">
          <Board columns={columns} setColumns={setColumns} product={product} />
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default StoryBoard;
