"use client"

import { Card,CardHeader,CardDescription, CardContent, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { GaugeIcon, ActivityIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import "@/app/globals.css";

import "@nivo/core";
import SprintCard from "@/components/dashboard/SprintCard";
import  LineChart  from "@/components/dashboard/LineChart";
import  PieChart  from "@/components/dashboard/PieChart";
import BarChart from '@/components/dashboard/BarChart'

import { VelocityItem, WorkLoadItem } from "@/types/Model";


import { useState, useEffect,memo } from "react";

// import { getSprintBacklogsAndTasks } from "@/api/task.api";
import { Product, Sprint, UserStory, Task,BurndownItem } from "@/types/Model";

export default function Dashboard() {

  const [product, setProduct] = useState<Product>();
  const [sprint, setSprint] = useState<Sprint>({} as Sprint);
  const [currentSprint, setCurrentSprint] = useState<Sprint>();
  const [sprintList, setSprintList] = useState<Sprint[]>([]);
  const [backlogList, setBacklogList] = useState<UserStory[]>([]);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [burndownChartData, setBurndownChartData] = useState([{ x: 0, y: 0 }]);
  const [idealBurndownData, setIdealBurndownData] = useState([{ x: 0, y: 0 }]);

  const [velocityData, setVelocityData] = useState([{ name: "1", count: 0 }]);
  const [workloadData, setWorkloadData] = useState([{ id: "1", value: 0 }]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {

    let currentProduct = localStorage.getItem("currentProduct");
    if (currentProduct) {
      setProduct(JSON.parse(currentProduct));
    }
  }, []);

  useEffect(() => {
    if (product && product.id) {
      fetch(`/api/dashboard/velocity?product_id=${product.id}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const velocityData = data.data.map((item:VelocityItem) => ({
            name: item.sprint_name,
            count: item.completed_story_points
          }));
          setVelocityData(velocityData);
        }
      })
      .catch(error => {
        console.error('Error fetching velocity data:', error);
      });

      // 获取 sprints
      fetch(`/api/sprint?product_id=${product.id}`)
        .then(response => response.json())
        .then((sprintList: Sprint[]) => {
          setSprintList(sprintList);
          if (sprintList.length > 0) {
            setSprint(sprintList[0]);
            setCurrentSprint(sprintList[0]);
          }
        })
        .catch(error => {
          console.error('Error fetching sprints:', error);
        });
    }
  }, [product]);

  
  useEffect(() => {
    if (currentSprint?.id) {
      const fetchSprintData = async () => {
        try {
          fetch(`/api/dashboard/workload?sprint_id=${currentSprint.id}`)
            .then(workloadResponse => {
              if (!workloadResponse.ok) {
                throw new Error('Failed to fetch workload data');
              }
              return workloadResponse.json();
            })
            .then(workloadData => {
              setWorkloadData(workloadData.map((item: WorkLoadItem) => ({
                id: item.assigner,
                value: item.workload_hours,
              })));
            })
            .catch(error => {
              console.error('Error fetching workload data:', error);
              setWorkloadData([]); // Return empty array on error
            });

            
          fetch(`/api/dashboard/burndown?sprint_id=${currentSprint.id}`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to fetch burndown data');
              }
              return response.json();
            })
            .then(burndown => {
              const realBurndownData = burndown.map((item: BurndownItem) => ({
                x: item.date,
                y: item.remainingHours,
              }));
              setBurndownChartData(realBurndownData);

              // 计算理想燃尽图
              const idealBurndownData = calculateIdealBurndown(burndown);
              setIdealBurndownData(idealBurndownData);
            })
            .catch(error => {
              console.error('Error fetching burndown data:', error);
            });

          fetch(`/api/sprint/userstory-task?sprint_id=${currentSprint.id}`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to fetch backlog and task data');
              }
              return response.json();
            })
            .then(backlogs => {
              setBacklogList(backlogs);
              setTaskList(backlogs.flatMap((backlog: { tasks: Task; }) => backlog.tasks));
            })
            .catch(error => {
              console.error('Error fetching backlog and task data:', error);
            });
        } catch (error) {
        }
      };

      fetchSprintData();
    }
  }, [currentSprint]);

  const calculateIdealBurndown = (burndown:any) => {
    let idealBurndownData = [];
    let remaining = burndown[0].remainingHours;
    let totalDays = burndown.length;
    let dailyBurn = remaining / totalDays;
    for (let i = 0; i < totalDays; i++) {
      idealBurndownData.push({
        x: burndown[i].date,
        y: remaining,
      });
      remaining -= dailyBurn;
    }
    return idealBurndownData;
  };


  const handleSprintChange = (selectedSprint:Sprint) => {
    setCurrentSprint(selectedSprint);
  };

  const toggleFullscreen = () => {
    if (typeof document !== 'undefined') {
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
    }
  };

  return (
    <>
      <div className="flex flex-col w-full h-full px-8 bg-white dark:bg-gray-900">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pt-6 pb-4 space-y-4 lg:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            <span className="text-blue-600 dark:text-blue-400 break-all">{product?.name}</span> 产品报表
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 transition-colors duration-150 rounded-full px-4 py-2 text-sm font-medium w-full sm:w-auto"
                >
                  切换 Sprint
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                {sprintList.map((sprint) => (
                  <DropdownMenuItem
                    key={sprint.id}
                    onClick={() => handleSprintChange(sprint)}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    {sprint.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300 transition-colors duration-150 rounded-full px-4 py-2 text-sm font-medium w-full sm:w-auto"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? "退出全屏" : "全屏显示"}
            </Button>
          </div>
        </div>

        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-6 w-full py-4">
          <SprintCard
            sprint={sprint}
            backlogList={backlogList}
            taskList={taskList}
          />

          <Card className="col-span-1 md:col-span-2 lg:col-span-6">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">燃尽图</CardTitle>
              <CardDescription className="text-sm md:text-base">
                查看 Sprint 和产品燃尽图
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                idealBurndownData={idealBurndownData}
                burndownChartData={burndownChartData}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 md:pt-10">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-base md:text-lg font-bold">迭代速度</div>
                    <div className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                      <GaugeIcon className="w-4 h-4 md:w-5 md:h-5 inline-block mr-1" />
                      {Math.round(
                        velocityData
                          .map((item) => item.count)
                          .filter((item) => item !== 0)
                          .reduce((a, b) => a + b, 0) /
                          velocityData.filter((item) => item.count !== 0).length
                      )} h
                    </div>
                  </div>
                  <BarChart
                    
                    velocityData={velocityData}
                  />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-base md:text-lg font-bold">工作负载</div>
                    <div className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                      <ActivityIcon className="w-4 h-4 md:w-5 md:h-5 inline-block mr-1" />
                      {Math.round(
                        workloadData
                          .map((item) => item.value)
                          .filter((item) => item !== 0)
                          .reduce((a, b) => a + b, 0) /
                          workloadData.filter((item) => item.value !== 0).length
                      )} h
                    </div>
                  </div>
                  <PieChart
                    workloadData={workloadData}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
