"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import "@/app/globals.css";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast"
import SprintInfo from "@/components/sprint/SprintInfo";
import SprintBacklog from "@/components/sprint/SprintBacklog";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import History from "@/components/sprint/History";
// import ChooseBacklog from "@/components/sprint/ChooseBacklog";
import { Product,UserStory,Sprint } from "@/types/Model";


export default function SprintManagement() {
  const [product, setProduct] = useState<Product>();
  const { toast } = useToast()
  
  useEffect(() => {
    const productString = localStorage.getItem("currentProduct");
    if (productString) {
      const product = JSON.parse(productString);
      setProduct(product);
    }
  }, []);

  const productId = (product as Product)?.id;
  const [sprint, setSprint] = useState<Sprint>();
  const [sprintList, setSprintList] = useState<Sprint[]>([]);
 
  const [backlogList, setBacklogList] = useState<UserStory[]>([]);

  const getProductBacklogList = async (productId: string): Promise<UserStory[]> => {
    try {
      const response = await fetch(`/api/userstory/product?product_id=${productId}`);
      if (!response.ok) throw new Error('Failed to fetch product backlog');
      const data: UserStory[] = await response.json();
      // Sort results by importance in descending order
      const sortedData = data.sort((a, b) => b.importance - a.importance);
      setBacklogList(sortedData);
      return sortedData;
    } catch (error) {
      console.error('Error fetching product backlog:', error);
      toast({
        title: "加载产品待办列表失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      try {
        // Fetch sprints
        const sprintsResponse = await fetch(`/api/sprint?product_id=${productId}`);
        if (!sprintsResponse.ok) throw new Error('Failed to fetch sprints');
        const sprints = await sprintsResponse.json();
        setSprintList(sprints);
        
        if (sprints.length > 0) {
          await getSprintById(sprints[0].id);
        }

        // Fetch product backlog
        await getProductBacklogList(productId);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "加载数据失败",
          description: error instanceof Error ? error.message : "未知错误",
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, [productId]);

  const createSprint = async (productId: string) => {
    const newSprint = {
      id: "",
      name: `Sprint ${(sprintList?.length || 0) + 1}`,
      goal: "",
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      demo_date: "",
      daily_standup: "",
      sprint_review: "",
      status: "规划中",
      product_id: productId,
    };
    try {
      const response = await fetch('/api/sprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSprint),
      });

      if (!response.ok) {
        throw new Error('Failed to create sprint');
      }

      const createdSprint = await response.json();
      toast({ title: "创建成功", variant: "default" });

      // Refresh sprint list
      const sprintsResponse = await fetch(`/api/sprint?product_id=${productId}`);
      const sprints = await sprintsResponse.json();
      setSprintList(sprints);
      
      // Set the newly created sprint as active
      if (sprints.length > 0) {
        getSprintById(createdSprint.id);
      }
    } catch (error) {
      console.error('Error creating sprint:', error);
      toast({ title: "创建失败", variant: "destructive" });
    }
  };

  const getSprintById = async (id: string) => {
    try {
      const response = await fetch(`/api/sprint/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sprint details');
      }
      const sprintData = await response.json();
      setSprint(sprintData);
      
      
      toast({ title: "成功加载 Sprint 详情", variant: "default" });
    } catch (error) {
      console.error('Error fetching sprint details:', error);
      toast({ 
        title: "加载 Sprint 详情失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive" 
      });
    }
  };

  const deleteSprintById = async (id: string) => {
    try {
      const response = await fetch(`/api/sprint/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete sprint');
      }

      toast({ title: "删除成功" });
      
      // Refresh sprint list
      const sprintsResponse = await fetch(`/api/sprint?productId=${productId}`);
      const sprints = await sprintsResponse.json();
      setSprintList(sprints);
      
      // Set the first sprint as active if any exist
      if (sprints.length > 0) {
        getSprintById(sprints[0].id);
      }
    } catch (error) {
      console.error('Error deleting sprint:', error);
      toast({ title: "删除失败" });
    }
  };

  const saveSprintContent = async () => {
    try {
      const response = await fetch(`/api/sprint`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sprint),
      });

      if (!response.ok) {
        throw new Error('Failed to update sprint');
      }

      toast({ title: "保存成功" });
      
      // Refresh sprint list
      const sprintsResponse = await fetch(`/api/sprint?product_id=${productId}`);
      const sprints = await sprintsResponse.json();
      setSprintList(sprints);
    } catch (error) {
      console.error('Error updating sprint:', error);
      toast({ title: "保存失败" });
    }
  };


  return (
    <>
      <div className="bg-white">
      <div className="container mx-auto px-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800  flex flex-wrap items-center px-2 py-8 sm:py-8">
        
        <div className="border-b-2 border-blue-300">
        <span className="text-blue-600 break-all">{product?.name || "当前产品"}</span>
        <span className="mx-2 hidden sm:inline">·</span>
        <span className="w-full sm:w-auto mt-2 sm:mt-0">迭代计划</span>
        </div>
      </h1>
      <div className="flex min-h-screen w-full flex-col bg-muted/40 border border-gray-100 ">
        <div className="flex flex-1 flex-col md:flex-row w-full bg-white rounded-lg mb-4">
          <History
            sprintList={sprintList}
            getSprintById={getSprintById}
            productId={productId}
            createSprint={createSprint}
            
          />
          <main className="flex-1 p-4 md:p-6">
          <div className="grid gap-4 md:gap-6">
            {(!sprint?.id || sprintList.length === 0) ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <div className="text-2xl font-semibold mb-2">没有 Sprint</div>
                    <p className="text-lg">请选择或创建一个 Sprint</p>
                  </div>
            ) : (
              <> 
                <SprintInfo
                  sprint={sprint}
                  deleteSprintById={deleteSprintById}
                  saveSprint={saveSprintContent}
                  setSprint={setSprint}
                />
                <SprintBacklog
                  sprint={sprint}
                  backlogList={backlogList}
                  setBacklogList={setBacklogList}
                  getProductBacklogList={getProductBacklogList}
                />
              </>
            )}
          </div>
          </main>
        </div>
      </div>
      </div>
      </div>
    </>
  );
}



