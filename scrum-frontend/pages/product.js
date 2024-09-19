"use client";

import { useState, useEffect } from "react";
import "@/app/globals.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductList,
} from "@/api/product.api";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

export default function Component() {
  const [projects, setProjects] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProject, setNewProject] = useState({
    id: null,
    name: "",
    description: "",
    startDate: "",
    dueDate: "",
    manager: "",
    status: "",
  });

  // Fetch all projects on component mount
  useEffect(() => {
    getProductList()
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  const handleCreateProject = () => {
    createProduct(newProject).then((data) => {
      toast({ title: "创建成功", status: "success" });
      setProjects([...projects, data]);
      setShowModal(false);
      setNewProject({
        id: null,
        name: "",
        description: "",
        startDate: "",
        dueDate: "",
        manager: "",
        status: "",
      });
    });
  };

  const handleEditProject = () => {
    updateProduct(newProject)
      .then((data) => {
        const updatedProjects = projects.map((project) =>
          project.id === selectedProject.id ? data : project
        );
        setProjects(updatedProjects);
        setShowModal(false);
        setSelectedProject(null);
        toast({ title: "保存成功", status: "success" });
      })
      .catch((error) => console.error("Error editing project:", error));
  };

  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProduct(id)
        .then(() => {
          const updatedProjects = projects.filter(
            (project) => project.id !== id
          );
          setProjects(updatedProjects);
        })
        .catch((error) => console.error("Error deleting project:", error));
    }
  };

  const openEditModal = (project) => {
    setSelectedProject(project);
    setNewProject(project);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setSelectedProject(null);
    setNewProject({
      id: null,
      name: "",
      description: "",
      startDate: "",
      dueDate: "",
      manager: "",
      status: "",
    });
    setShowModal(true);
  };

  return (
    <>
      <Header />
      <div className="bg-white">
      <div className="h-screen container py-8 ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">产品管理</h1>
          <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">创建产品</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden border border-gray-200"
            >
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                <CardTitle className="text-2xl font-bold mb-2">{project.name}</CardTitle>
                <CardDescription className="text-gray-100 text-sm">{project.description}</CardDescription>
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
                    <span className="font-medium">开始日期:</span> <span className="ml-2">{project.startDate}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">截止日期:</span> <span className="ml-2">{project.dueDate}</span>
                  </div>
                  <div
                    className={`mt-4 px-4 py-2 rounded-full text-sm font-semibold text-center ${
                      project.status === "进行中"
                        ? "bg-yellow-100 text-yellow-800"
                        : project.status === "已完成"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {project.status}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 px-6 py-4 flex justify-end gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(project)}
                  className="text-blue-600 hover:bg-blue-50 border-blue-300"
                >
                  修改
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-red-600 hover:bg-red-50 border-red-300"
                >
                  删除
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Dialog open={showModal} onOpenChange={setShowModal} >
          <DialogTrigger asChild>
            <div></div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedProject ? "修改项目" : "创建项目"}
              </DialogTitle>
              <DialogDescription>
                {selectedProject
                  ? "编辑项目信息并保存更改"
                  : "填写信息创建新项目"}
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
                <Label htmlFor="startDate">开始日期</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) =>
                    setNewProject({ ...newProject, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="dueDate">截止日期</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newProject.dueDate}
                  onChange={(e) =>
                    setNewProject({ ...newProject, dueDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="manager">负责人</Label>
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
                    <RadioGroupItem value="暂停中" id="暂停中" />
                    <Label htmlFor="暂停中">暂停中</Label>
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
      </div>
      <Footer />
      <Toaster />
    </>
  );
  
}
