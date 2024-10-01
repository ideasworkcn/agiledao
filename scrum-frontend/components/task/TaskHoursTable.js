// scrum-frontend/components/task/TaskHoursTable.js
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";

export default function TaskHoursTable({ selectedTaskHours, setSelectedTaskHours, sprint, selectedTask, showModal, setShowModal, handleTaskHoursSave }) {
  const handleAddRow = () => {
    const newTaskHour = {
      id: "",
      note: "",
      productId: sprint.productId,
      sprintId: sprint.id,
      taskId: selectedTask.id,
      memberId: selectedTask.memberId,
      assigner: selectedTask.assigner,
      createTime: "",
      hours: 0,
    };
    setSelectedTaskHours([...selectedTaskHours, newTaskHour]);
  };

  const handleChange = (index, field, value) => {
    const updatedHours = selectedTaskHours.map((hour, i) =>
      i === index ? { ...hour, [field]: value } : hour
    );
    setSelectedTaskHours(updatedHours);
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="w-[1000px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {selectedTask ? "任务工时" : "任务工时"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            编辑工时信息并保存更改
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            {selectedTaskHours.map((row, index) => (
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
                      handleChange(index, "hours", e.target.value)
                    }
                  />
                  <span className="ml-2 text-gray-600">h</span>
                </div>
                <Label className="w-1/7 ml-2 text-gray-600">
                  {row.createTime}
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
  );
}