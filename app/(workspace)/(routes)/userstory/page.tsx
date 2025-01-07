"use client";
import React, { useState, useEffect } from "react";
// import Board from "@/components/userstory/Board";
import "@/app/globals.css";
// import { getUserStoryMap } from "@/api/userstory.api";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Product } from '@/types/Model';
import Board from "@/components/userstory/Board";


const StoryBoard = () => {
  const [columns, setColumns] = useState<any[]>([]);
  const [product, setProduct] = useState<Product>();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const storedProduct = localStorage.getItem('currentProduct');
    if (storedProduct) {
      const product = JSON.parse(storedProduct);
      setProduct(product);
      console.log(product)
      const productId = product.id;
    }
    // getUserStoryMap(productId).then((data) => {
    //   console.log(data);
    //   setColumns(data);
    // });
  }, []);
  

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
    <div className="flex flex-col min-h-screen ">
      <main className="flex-grow flex flex-col p-4 md:p-6 bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 border-b-2 border-blue-300 dark:border-blue-700 pb-2 pl-2 w-full sm:w-auto text-center sm:text-left">
            {product?.name}<span className="text-gray-800 dark:text-gray-200 block sm:inline"> 用户故事地图</span>
          </h1>
          <Button
            onClick={toggleFullscreen}
            className="bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2"
          >
            {isFullscreen ? "退出全屏" : "全屏显示"}
          </Button>
        </div>
        <div className="flex-grow overflow-x-auto flex">
          {product && <Board product={product} />}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default StoryBoard;
