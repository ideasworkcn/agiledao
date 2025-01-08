import { useState ,useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import { TaskHour ,Sprint,Task,UserStory} from "@/types/Model";
import { Toaster } from "../ui/toaster";
import {  useToast } from "@/hooks/use-toast";

interface TaskHoursTableProps {
  backlogList:UserStory[];
  setBacklogList: (backlogs: UserStory[]) => void;
  sprint?: Sprint;
  selectedTask?: Task;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export default function TaskHoursTable({
  backlogList,
  setBacklogList,
  sprint,
  selectedTask,
  showModal,
  setShowModal
}: TaskHoursTableProps) {
    const {toast} = useToast()
    const [selectedTaskHours, setSelectedTaskHours] = useState<TaskHour[]>([]);

  useEffect(() => {
    const fetchTaskHours = async () => {
      if (selectedTask) {
        try {
          const response = await fetch(`/api/task/taskhours?task_id=${selectedTask.id}`);
          const hours = await response.json();
          // Ensure we're setting an array even if the response is null/undefined
          setSelectedTaskHours(hours);
        } catch (error) {
          console.error("Error fetching task hours:", error);
          toast({ title: "Failed to load task hours", variant: "destructive" });
          setSelectedTaskHours([]); // Set to empty array on error
        }
      }
    };

    fetchTaskHours();
  }, [showModal]);

  const handleTaskHoursSave = async () => {
    if (!selectedTask || !sprint?.id) return;

    try {
      const response = await fetch(`/api/taskhour/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedTaskHours)
      });
      const updatedHours = await response.json();
      
      // Ensure updatedHours is an array
      const safeUpdatedHours = Array.isArray(updatedHours) ? updatedHours : [];
      setSelectedTaskHours(safeUpdatedHours);
      setShowModal(false);
      toast({ title: "Task hours updated successfully", variant: "default" });
      
      const calculateTotalHours = (taskId: string) => {
        // Calculate total hours locally from selectedTaskHours
        return selectedTaskHours
          .filter(hour => hour.task_id === taskId)
          .reduce((sum, hour) => sum + (hour.hours || 0), 0);
      };

      const updateBacklog = async (backlog: UserStory) => {
        const updatedTasks = backlog.tasks?.map((task: Task) => {
          if (task.id === selectedTask?.id) {
            const totalHours = calculateTotalHours(task.id);
            return {
              ...task,
              hours: totalHours
            };
          }
          return task;
        });

        return {
          ...backlog,
          tasks: updatedTasks
        };
      };

      const updateBacklogList = async (prevBacklogList: UserStory[]) => {
        const updatedBacklogs = await Promise.all(prevBacklogList.map(async (backlog: UserStory) => {
          if (backlog.id === selectedTask.user_story_id) {
            return await updateBacklog(backlog);
          }
          return backlog;
        }));
        return updatedBacklogs;
      };

      const updatedList = await updateBacklogList(backlogList);
      setBacklogList(updatedList);
    } catch (error) {
      console.error("Error updating task hours:", error);
      toast({ title: "Failed to update task hours", variant: "destructive" });
    }
  };

  const handleAddRow = () => {
    if (!sprint || !selectedTask) return;
    
    const newTaskHour: TaskHour = {
      id: crypto.randomUUID(), // Generate unique ID using UUID
      note: "",
      product_id: sprint.product_id,
      sprint_id: sprint.id,
      task_id: selectedTask.id,
      member_id: selectedTask.member_id,
      create_time: "",
      hours: 0,
    };
    setSelectedTaskHours(prev => [...(Array.isArray(prev) ? prev : []), newTaskHour]);
  };

  const handleChange = (index: number, field: keyof TaskHour, value: string | number) => {
    if (!selectedTaskHours) return;
    const updatedHours = selectedTaskHours.map((hour: TaskHour, i: number) =>
      i === index ? { ...hour, [field]: value } : hour
    );
    setSelectedTaskHours(updatedHours);
  };

  return (
    <>
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="w-[1000px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            任务工时
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            编辑工时信息并保存更改
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            {Array.isArray(selectedTaskHours) && selectedTaskHours.map((row: TaskHour, index: number) => (
              <div
                key={index}
                className="flex flex-row items-center justify-between mb-4 bg-white p-1 rounded-md shadow-sm"
              >
                <input
                  className="w-5/7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="工作说明"
                  value={row.note}
                  onChange={(e) => handleChange(index, "note", e.target.value)}
                />
                <div className="flex items-center w-1/7 ">
                  <input
                    className="flex-1 w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    placeholder="用时"
                    value={row.hours}
                    onChange={(e) =>
                      handleChange(index, "hours", Number(e.target.value))
                    }
                  />
                  <span className="ml-2 text-gray-600">h</span>
                </div>
                <Label className="w-1/7 ml-2 text-gray-600">
                  {row.create_time}
                </Label>
              </div>
            ))}
            <Button
              onClick={handleAddRow}
              variant="outline"
              className="mt-4 w-full flex items-center justify-center"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              添加新行
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              取消
            </Button>
          </DialogClose>
          <Button
            onClick={handleTaskHoursSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    <Toaster/>
    </>
  );
}