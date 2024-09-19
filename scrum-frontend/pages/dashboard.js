"use client";
import Link from "next/link";
import Router from "next/router";
import { Button } from "@/components/ui/button";
import "@/app/globals.css";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import "@nivo/core";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { useState, useEffect,memo } from "react";
import {
  getSprints,
  getSprintBurndownChart,
  getSprintVelocityData,
  getSprintWorkloadData,
} from "@/api/sprint.api";
import { getSprintBacklogsAndTasks } from "@/api/task.api";
import { getProductList } from "@/api/product.api";
import Header from "@/components/header";
import Footer from "@/components/footer";
export default function Dashboard() {
  const [product, setProduct] = useState({});

  const [sprint, setSprint] = useState({});
  const [currentSprint, setCurrentSprint] = useState({ id: "" });
  const [sprintList, setSprintList] = useState([]);
  const [backlogList, setBacklogList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [burndownChartData, setBurndownChartData] = useState([{ x: 0, y: 0 }]);
  const [idealBurndownData, setIdealBurndownData] = useState([{ x: 0, y: 0 }]);

  const [velocityData, setVelocityData] = useState([{ name: "1", count: 0 }]);
  const [workloadData, setWorkloadData] = useState([{ id: "1", value: 0 }]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // 检查是否登录，未登录则跳转
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) {
      Router.push("/login");
      return;
    }

    let currentWorkspace = localStorage.getItem("currentWorkspace");
    if (currentWorkspace) {
      setProduct(JSON.parse(currentWorkspace));
    } else {
      getProductList()
        .then((data) => {
          setProduct(data[0]);
          localStorage.setItem("currentWorkspace", JSON.stringify(data[0]));
        })
        .catch((error) => {
          console.error("获取产品列表失败", error);
          //  跳转到登录页面
          Router.push("/login");
        });
    }
  }, []);

  useEffect(() => {
    if (product && product.id) {
      getSprintVelocityData(product.id).then((velocityData) => {
        // 转化数据为barchart需要的格式
        velocityData = velocityData.map((item) => ({
          name: item.sprintName,
          count: item.completedStoryPoints,
        }));

        setVelocityData(velocityData);
      });
      // 获取 sprints
      getSprints(product.id).then((sprintList) => {
        setSprintList(sprintList);
        if (sprintList.length > 0) {
          setSprint(sprintList[0]);
          setCurrentSprint(sprintList[0]);
        }
      });
    }
  }, [product]);

  
  useEffect(() => {
    if (currentSprint.id) {
      const fetchSprintData = async () => {
        try {
          const workloadData = await getSprintWorkloadData(currentSprint.id);
          setWorkloadData(workloadData.map(item => ({
            id: item.assigner,
            value: item.workloadHours,
          })));

          const burndown = await getSprintBurndownChart(currentSprint.id);
          const realBurndownData = burndown.map(item => ({
            x: item.date,
            y: item.remainingHours,
          }));
          setBurndownChartData(realBurndownData);

          // 计算理想燃尽图
          const idealBurndownData = calculateIdealBurndown(burndown);
          setIdealBurndownData(idealBurndownData);

          const backlogs = await getSprintBacklogsAndTasks(currentSprint.id);
          setBacklogList(backlogs);
          setTaskList(backlogs.flatMap(backlog => backlog.taskList));
        } catch (error) {
        }
      };

      fetchSprintData();
    }
  }, [currentSprint]);

  const calculateIdealBurndown = (burndown) => {
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


  const handleSprintChange = (selectedSprint) => {
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
      <Header />
      <div className="flex flex-col w-full h-full px-8 bg-white dark:bg-gray-900">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pt-6 pb-4 space-y-4 lg:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            <span className="text-blue-600 dark:text-blue-400 break-all">{product.name}</span> 产品报表
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
                className="w-full h-48 md:h-64 lg:h-80"
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
                    className="w-full h-40 md:h-48"
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
                    className="w-full h-40 md:h-48"
                    workloadData={workloadData}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      <Footer />
    </>
  );
}

function SprintCard({ sprint, backlogList, taskList }) {
  const daysLeft = Math.round((new Date(sprint.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const completionPercentage = Math.round((taskList.filter((task) => task.status === "done").length / taskList.length) * 10000) / 100;

  return (
    <Card className="col-span-full lg:col-span-4 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{sprint.name}</CardTitle>
          <div className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">
            <time dateTime={sprint.startDate}>{new Date(sprint.startDate).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}</time>
            {' '}-{' '}
            <time dateTime={sprint.endDate}>{new Date(sprint.endDate).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}</time>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:gap-6 p-4 sm:p-6">
        <div className="bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">Sprint 目标</h3>
          <div className="text-base sm:text-lg text-gray-700 dark:text-gray-300 italic">&ldquo;{sprint.goal}&rdquo;</div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 sm:p-4 rounded-lg shadow-inner text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-300">
              {daysLeft <= 0 ? "已结束" : `${daysLeft} 天`}
            </div>
            <div className="text-sm sm:text-base font-medium text-blue-500 dark:text-blue-400 mt-1">剩余时间</div>
          </div>
          <div className="bg-green-100 dark:bg-green-900 p-3 sm:p-4 rounded-lg shadow-inner text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-300">
              {completionPercentage}%
            </div>
            <div className="text-sm sm:text-base font-medium text-green-500 dark:text-green-400 mt-1">完成度</div>
          </div>
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 sm:p-6 rounded-lg shadow-inner">
            <div className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">每日站会</div>
            <div className="text-base sm:text-lg text-gray-600 dark:text-gray-300">{sprint.dailyStandup}</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 sm:p-6 rounded-lg shadow-inner">
            <div className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">Sprint 演示</div>
            <div className="text-base sm:text-lg text-gray-600 dark:text-gray-300">{sprint.sprintReview}</div>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 sm:p-6 rounded-lg shadow-inner">
          <div className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">Sprint 待办事项（预估）</div>
          <ul className="list-disc pl-4 sm:pl-6 text-gray-600 dark:text-gray-300 space-y-1 sm:space-y-2">
            {backlogList.map((backlog) => (
              <li key={backlog.id} className="text-base sm:text-lg">
                {backlog.name} <span className="font-medium">({backlog.initialEstimate})</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  );
}
const BarChart = memo(({ velocityData }) => {
  return (
    <div className="h-[300px]">
      <ResponsiveBar
        data={velocityData}
        keys={["count"]}
        indexBy="name"
        margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.6]]
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Sprint',
          legendPosition: 'middle',
          legendOffset: 60
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '所用时间（h）',
          legendPosition: 'middle',
          legendOffset: -50
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]]
        }}
        role="application"
        ariaLabel="Sprint velocity chart"
        barAriaLabel={e => `${e.id}: ${e.formattedValue} in Sprint: ${e.indexValue}`}
        tooltip={({ id, value, indexValue, data }) => (
          <div style={{ padding: 12, background: '#fff', border: '1px solid #ccc' }}>
            <strong>{indexValue}</strong><br />
            所用时间: {value} h<br />
          </div>
        )}
      />
    </div>
  );
});
BarChart.displayName  = "BarChart"

function GaugeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}
const LineChart = memo(({ burndownChartData, idealBurndownData }) => {
  return (
    <div className="w-full" style={{ height: "300px" }}>
      <ResponsiveLine
        data={[
          {
            id: "理想燃尽线",
            data: idealBurndownData.filter(d => d.x !== null && d.y !== null),
          },
          {
            id: "实际燃尽线",
            data: burndownChartData.filter(d => d.x !== null && d.y !== null),
          },
        ]}
        margin={{ top: 50, right: 40, bottom: 40, left: 40 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
          tickRotation: -45,
          tickValues: 5,
          format: (value) => {
            if (typeof value === 'string' && value.includes('T')) {
              return value.split('T')[0]; // 只显示日期部分
            }
            return value; // 如果不是预期的格式，直接返回原值
          },
          legend: "时间",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
          legend: "任务量",
          legendOffset: -32,
          legendPosition: "middle",
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={6}
        useMesh={true}
        enableGridX={false}
        enableGridY={true}
        gridYValues={5}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
        legends={[
          {
            anchor: "top",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: -30,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
});

LineChart.displayName = 'LineChart';

const PieChart = memo(({ workloadData }) => {
  console.log(workloadData);
  return (
    <div className="w-full h-[300px]">
      {workloadData.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">暂无数据</p>
        </div>
      ) : (
        <ResponsivePie
          data={workloadData}
          sortByValue
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          cornerRadius={0}
          padAngle={0.5}
          borderWidth={1}
          borderColor={"#ffffff"}
          enableArcLinkLabels={false}
          arcLabel={(d) => `${d.id}`}
          arcLabelsTextColor={"#ffffff"}
          arcLabelsRadiusOffset={0.65}
          colors={{ scheme: 'nivo' }}
          theme={{
            labels: {
              text: {
                fontSize: "18px",
              },
            },
            tooltip: {
              chip: {
                borderRadius: "9999px",
              },
              container: {
                fontSize: "12px",
                textTransform: "capitalize",
                borderRadius: "6px",
              },
            },
          }}
          role="application"
        />
      )}
    </div>
  );
});

PieChart.displayName = 'PieChart';

