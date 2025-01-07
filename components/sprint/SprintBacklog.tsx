"use client";
import { useToast } from "@/hooks/use-toast"
import ChooseBacklog from "./ChooseBacklog";
import { UserStory, Sprint } from "@/types/Model";
import { useState, useEffect } from "react";



interface SprintBacklogProps {
  sprint: Sprint;
  setBacklogList: (list: UserStory[]) => void;
  backlogList: UserStory[];
  getProductBacklogList: (productId: string) => Promise<UserStory[]>;
}

function SprintBacklog({
  sprint,
  setBacklogList,
  backlogList,
  getProductBacklogList
}: SprintBacklogProps) {
  const { toast } = useToast();
  const [sprintBacklogList, setSprintBacklogList] = useState<UserStory[]>([]);

  const getSprintBacklogList = async (sprintId: string): Promise<UserStory[]> => {
    try {
      const response = await fetch(`/api/sprint/userstory?sprint_id=${sprintId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sprint backlog');
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }
      const sortedData = [...data].sort((a, b) => b.importance - a.importance);
      setSprintBacklogList(sortedData);
      return sortedData;
    } catch (error) {
      console.error('Error fetching sprint backlog:', error);
      toast({
        title: "获取 Sprint Backlog 失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive"
      });
      setSprintBacklogList([]);
      return [];
    }
  };

  useEffect(() => {
    if (sprint?.id) {
      getSprintBacklogList(sprint.id).catch(error => {
        console.error('Error in useEffect when fetching sprint backlog:', error);
        toast({
          title: "获取 Sprint Backlog 失败",
          description: error instanceof Error ? error.message : "未知错误",
          variant: "destructive"
        });
      });
    }
  }, [sprint?.id]);

  const addBacklogToSprint = async (sprintId: string, backlogId: string) => {
    try {
      const response = await fetch('/api/sprint/userstory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sprint_id: sprintId,
          user_story_id: backlogId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add backlog to sprint');
      }

      // Refresh both sprint backlog and product backlog lists
      const [sprintBacklog, productBacklog] = await Promise.all([
        getSprintBacklogList(sprintId),
        getProductBacklogList(sprint.product_id)
      ]);

      setSprintBacklogList(sprintBacklog);
      setBacklogList(productBacklog);

      toast({ title: "添加成功", variant: "default" });
    } catch (error) {
      console.error('Error adding backlog to sprint:', error);
      toast({
        title: "添加失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive"
      });
    }
  };

  const deleteBacklogFromSprint = async (sprintId: string, backlogId: string) => {
    try {
      const deleteResponse = await fetch(`/api/sprint/userstory`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sprint_id: sprintId,
          user_story_id: backlogId
        }),
      });

      if (!deleteResponse.ok) {
        throw new Error('Failed to remove backlog from sprint');
      }

      setSprintBacklogList(prev => prev.filter(row => row.id !== backlogId));

      const fetchResponse = await fetch(`/api/userstory/product?product_id=${sprint.product_id}`);
      const res: UserStory[] = await fetchResponse.json();
      res.sort((a, b) => b.importance - a.importance);
      setBacklogList(res);
      toast({ title: "移除成功", variant: "default" });
    } catch (error) {
      console.error('Error removing backlog:', error);
      toast({ 
        title: "移除失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sprint Backlog</h3>
        <ChooseBacklog
          sprint={sprint}
          backlogList={backlogList}
          addBacklogToSprint={addBacklogToSprint}
        />
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">编号</th>
              <th className="px-6 py-3">用户故事</th>
              <th className="px-6 py-3 hidden xl:table-cell">人天</th>
              <th className="px-6 py-3 hidden xl:table-cell">如何演示</th>
              <th className="px-6 py-3">状态</th>
              <th className="px-6 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sprintBacklogList.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                  {row.estimate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                  {row.howtodemo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={
                    `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      row.status === "Done" ? "bg-green-100 text-green-800" :
                      row.status === "In Progress" ? "bg-yellow-100 text-yellow-800" :
                      row.status === "To Do" ? "bg-blue-100 text-blue-800" : ""
                    }`
                  }>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => deleteBacklogFromSprint(sprint.id, row.id)}
                  >
                    移除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SprintBacklog;