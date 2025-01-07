"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast"
import { UserStory,Sprint } from "@/types/Model";





interface ChooseBacklogProps {
  sprint: Sprint;
  backlogList: UserStory[];
  addBacklogToSprint: (sprintId: string, backlogId: string) => Promise<void>;
}

function ChooseBacklog({
  sprint,
  backlogList,
  addBacklogToSprint,
}: ChooseBacklogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredBacklogList = backlogList.filter(
    (row: UserStory) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.number.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
          选择 Backlog
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">选择产品 Backlog</DialogTitle>
          <DialogDescription>添加 backlog 到 sprint</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            type="text"
            placeholder="搜索 Backlog"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full"
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">编号</TableHead>
                <TableHead className="w-1/3">用户故事</TableHead>
                <TableHead className="w-24 text-center">优先级</TableHead>
                <TableHead className="w-24 text-center">人天</TableHead>
                <TableHead className="w-24 text-center">状态</TableHead>
                <TableHead className="w-24 text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBacklogList.map((row: UserStory) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-sm">{row.number}</TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-center">{row.importance}</TableCell>
                  <TableCell className="text-center">{row.estimate}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={
                      row.status === "Done" ? "bg-green-500" :
                      row.status === "In Progress" ? "bg-yellow-500" :
                      row.status === "To Do" ? "bg-blue-500" : ""
                    }>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (sprint && row) {
                          addBacklogToSprint(sprint.id, row.id);
                        }
                      }}
                    >
                      添加
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ChooseBacklog;
