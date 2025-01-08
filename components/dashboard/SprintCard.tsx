import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import moment from "moment";


import { Sprint, UserStory as Backlog, Task } from "@/types/Model";

interface SprintCardProps {
  sprint: Sprint;
  backlogList: Backlog[];
  taskList: Task[];
}

export default function SprintCard({ sprint, backlogList, taskList }: SprintCardProps) {
    const daysLeft = Math.round((new Date(sprint.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const completionPercentage = taskList && taskList.length > 0 
      ? Math.round((taskList.filter((task: Task) => task?.status === "Done").length / taskList.length) * 10000) / 100
      : 0;
    return (
      <Card className="col-span-full lg:col-span-4 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-white gdark:bg-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-xl sm:text-2xl font-bold  text-gray-800 dark:text-gray-100">{sprint.name}</CardTitle>
            <div className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">
              <time dateTime={sprint.start_date}>{moment(sprint.start_date).format('YYYY-MM-DD')}</time>
              {' '}-{' '}
              <time dateTime={sprint.end_date}>{moment(sprint.end_date).format('YYYY-MM-DD')}</time>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:gap-6 p-4 sm:p-6">
          <div className="bg-blue-100 dark:bg-blue-900 p-4 sm:p-6 rounded-lg shadow-md">
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
            <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg shadow-inner">
              <div className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">每日站会</div>
              <div className="text-base sm:text-lg text-gray-600 dark:text-gray-300">{sprint.daily_standup}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg shadow-inner">
              <div className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">Sprint 演示</div>
              <div className="text-base sm:text-lg text-gray-600 dark:text-gray-300">{sprint.sprint_review}</div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg shadow-inner">
            <div className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">Sprint 待办事项（预估）</div>
            <ul className="list-disc pl-4 sm:pl-6 text-gray-600 dark:text-gray-300 space-y-1 sm:space-y-2">
              {backlogList.map((backlog: Backlog) => (
                <li key={backlog.id} className="text-base sm:text-lg">
                  {backlog.name} <span className="font-medium">({backlog.estimate})</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }