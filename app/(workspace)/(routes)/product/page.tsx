"use client";
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import AuthGuard from '@/components/AuthGuard';

import { useState, useEffect } from "react";

export default function Product() {
  const { toast } = useToast()
  const [projects, setProjects] = useState([] as any);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProject, setNewProject] = useState({
    id: null,
    name: "",
    description: "",
    start_date: "",
    due_date: "",
    manager: "",
    status: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("进行中");

  // Fetch all projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/product');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setShowModal(true);
    setSelectedProject(null);
    setNewProject({
      id: null,
      name: "",
      description: "",
      start_date: "",
      due_date: "",
      manager: "",
      status: "",
    });
  };

  const handleCreateProject = () => {
    fetch('/api/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProject),
    })
    .then(response => response.json())
    .then(data => {
      setProjects([...projects, data]);
      setShowModal(false);
      toast({
        title: "产品创建成功",
        description: "产品已成功创建",
      })
    })
    .catch(error => console.error("Error creating project:", error));
  };

  const openEditModal = (project: any) => {
    setShowModal(true);
    setSelectedProject(project);
    setNewProject(project);
  };

  const handleEditProject = () => {
    fetch('/api/product', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProject),
    })
    .then(response => response.json())
    .then(data => {
      setProjects(projects.map((project: any) => project.id === data.id ? data : project));
      setShowModal(false);
      toast({
        title: "产品更新成功",
        description: "产品已成功更新",
      })
    })
    .catch(error => console.error("Error editing project:", error));
  };

  const handleDeleteProject = (projectId: string) => {
    fetch(`/api/product/${projectId}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      setProjects(projects.filter((project: any) => project.id !== projectId));
      toast({
        title: "产品删除成功",
        description: "产品已成功删除",
      })
    })
    .catch(error => console.error("Error deleting project:", error));
  };

  const filteredProjects = projects.filter((project: any) => {
    return (
      (filterStatus === "所有" || project.status === filterStatus) &&
      (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.manager.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const statusOptions = ["所有", "进行中", "已完成", "未开始"];

  return (
    <AuthGuard>
    <div className="flex flex-col w-full h-full ">

      <div className="px-8 py-8 flex-grow flex flex-col items-center overflow-auto">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">产品管理</h1>
            <div className="flex items-center space-x-4 ">
              <Input
                placeholder="搜索产品名或产品经理"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
              />
              <Select onValueChange={(value) => setFilterStatus(value)} defaultValue="进行中">
                <SelectTrigger className="bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">创建产品</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 9 }).map((_, index) => (
                <div  key={index} className="flex flex-col space-y-3">
                  <Skeleton className="h-[125px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project: any) => (
                <Card
                  key={project.id}
                  className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden border border-gray-200"
                >
                  <CardHeader className="bg-blue-500 text-white p-4 rounded-t-lg">
                    <CardTitle className="text-2xl font-bold mb-2 flex justify-between items-center">
                      {project.name}
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium text-center ${
                          project.status === "进行中"
                            ? "bg-yellow-200 text-yellow-900"
                            : project.status === "已完成"
                            ? "bg-green-200 text-green-900"
                            : "bg-red-200 text-red-900"
                        }`}
                      >
                        {project.status}
                      </div>
                    </CardTitle>
                    <CardDescription className="text-gray-100 text-sm h-16 overflow-hidden">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">项目经理:</span> <span className="ml-2">{project.manager}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">开始日期:</span> <span className="ml-2">{project.start_date}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">截止日期:</span> <span className="ml-2">{project.due_date}</span>
                      </div>
                     
                    </div>
                  </CardContent>
                  <CardFooter className=" px-6 py-4 flex justify-between gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 border-red-300"
                        >
                          删除
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>确认删除</DialogTitle>
                          <DialogDescription>
                            您确定要删除这个产品吗？此操作无法撤销。
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600 hover:bg-red-50 border-red-300"
                          >
                            确认
                          </Button>
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-600 hover:bg-gray-50 border-gray-300"
                            >
                              取消
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(project)}
                      className="text-blue-600 hover:bg-blue-50 border-blue-300"
                    >
                      修改
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="w-full text-left py-8 text-gray-500">
                暂无产品数据，请添加新产品。
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={showModal} onOpenChange={setShowModal} >
          <DialogTrigger asChild>
            <div></div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedProject ? "修改产品" : "创建产品"}
              </DialogTitle>
              <DialogDescription>
                {selectedProject
                  ? "编辑产品信息并保存更改"
                  : "填写信息创建新产品"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">产品名</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">描述</Label>
                <Input
                  id="description"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="start_date">开始日期</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={newProject.start_date}
                  onChange={(e) =>
                    setNewProject({ ...newProject, start_date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="due_date">截止日期</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newProject.due_date}
                  onChange={(e) =>
                    setNewProject({ ...newProject, due_date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="manager">项目经理</Label>
                <Input
                  id="manager"
                  value={newProject.manager}
                  onChange={(e) =>
                    setNewProject({ ...newProject, manager: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>状态</Label>
                <RadioGroup
                  defaultValue="进行中"
                  className="flex justify-start gap-4 py-2"
                  value={newProject.status}
                  onValueChange={(value) =>
                    setNewProject({ ...newProject, status: value })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="进行中" id="进行中" />
                    <Label htmlFor="进行中">进行中</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="已完成" id="已完成" />
                    <Label htmlFor="已完成">已完成</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="未开始" id="未开始" />
                    <Label htmlFor="未开始">未开始</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setShowModal(false)}>取消</Button>
              </DialogClose>
              <Button
                onClick={
                  selectedProject ? handleEditProject : handleCreateProject
                }
              >
                {selectedProject ? "保存" : "创建"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
    </AuthGuard>
  )
}
