"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "@/app/globals.css";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPasswordByUserId,
} from "@/api/user.api";
import { toast, useToast } from "@/components/ui/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

export default function UserManagement() {
  const [userList, setUserList] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    getUsers().then((res) => {
      setUserList(res);
    });
  }, []);

  const deleteUserById = (user) => {
    console.log("Delete user:", user);
    if (user.role === "Scrum Master") {
      alert("Scrum Master 不能删除");
      return;
    } else {
      deleteUser(user.id).then(() => {
        getUsers().then((res) => {
          setUserList(res);
        });
      });
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });

  const openDialog = (user) => {
    setCurrentUser(user);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setCurrentUser({ id: "", name: "", email: "", role: "" });
  };

  const handleSaveUser = (userData) => {
    console.log("Save user:", userData);
    if (userData.id !== "") {
      updateUser(userData).then(() => {
        toast({ description: "User saved", title: "Success" });
        getUsers().then((res) => setUserList(res));
      });
    } else {
      createUser(userData).then(() => {
        toast({
          description: "password is bilibli:ideaswork",
          title: "Success",
        });
        getUsers().then((res) => setUserList(res));
      });
    }
  };

  const resetPassword = (user) => {
    console.log("Reset password:", user);
    if (window.confirm("确定要重置密码吗？")) {
      resetPasswordByUserId(user.id).then(() => {
        toast({ description: "reset success", title: "success" });
      });
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen w-full flex-col bg-gray-200">
        <div className="container mx-auto px-4 py-8">
          <main className="space-y-6">
            <Tabs defaultValue="users" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="bg-gray-100 rounded-lg">
                  <TabsTrigger value="users" className="px-4 py-2 text-sm font-medium">Users</TabsTrigger>
                  <TabsTrigger value="roles" className="px-4 py-2 text-sm font-medium">Roles</TabsTrigger>
                </TabsList>
                <Button
                  onClick={() => openDialog()}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                >
                  Add User
                </Button>
              </div>
              <TabsContent value="users">
                <UsersCard
                  userList={userList}
                  deleteUserById={deleteUserById}
                  openDialog={openDialog}
                  resetPassword={resetPassword}
                />
              </TabsContent>
              <TabsContent value="roles">
                <RolesCard />
              </TabsContent>
            </Tabs>
          </main>
        </div>
        <UserDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          onSave={handleSaveUser}
          user={currentUser}
        />
      </div>
      <Footer />
      <Toaster />
    </>
  );
}

function UsersCard({ userList, deleteUserById, openDialog, resetPassword }) {
  return (
    <Card className="bg-white shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Users</CardTitle>
        <CardDescription className="text-gray-500">
          Manage your team members and their roles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium text-gray-600">Name</TableHead>
              <TableHead className="font-medium text-gray-600">Email</TableHead>
              <TableHead className="font-medium text-gray-600">Role</TableHead>
              <TableHead className="font-medium text-gray-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList.map((user, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 font-medium">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    className="mr-2 bg-blue-500 hover:bg-blue-600 text-white font-medium"
                    onClick={() => openDialog(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="mr-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
                    onClick={() => resetPassword(user)}
                  >
                    Reset Password
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-red-500 hover:bg-red-600 text-white font-medium"
                    onClick={() => {
                      if (window.confirm("确定要删除这个 User 吗？")) {
                        deleteUserById(user);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function UserDialog({ isOpen, onClose, onSave, user }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    } else {
      setName("");
      setEmail("");
      setRole("");
    }
  }, [user]);

  const handleSubmit = () => {
    const userData = {
      id: user ? user.id || "" : "",
      name,
      email,
      password: "",
      code: "",
      role,
    };
    onSave(userData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{user ? "Edit User" : "Add User"}</DialogTitle>
          <DialogDescription className="text-gray-500">
            {user
              ? "Edit the user's details below."
              : "Fill in the details below to add a new user."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                <SelectItem value="Scrum Master">Scrum Master</SelectItem>
                <SelectItem value="Product Owner">Product Owner</SelectItem>
                <SelectItem value="Team Member">Team Member</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white font-medium">
            {user ? "Save Changes" : "Add User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RolesCard() {
  return (
    <Card className="bg-white shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Roles</CardTitle>
        <CardDescription className="text-gray-500">
          Manage the roles and permissions for your team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium text-gray-600">Role</TableHead>
              <TableHead className="font-medium text-gray-600">Description</TableHead>
              <TableHead className="font-medium text-gray-600">Permissions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Scrum Master</TableCell>
              <TableCell>
                负责领导和指导团队进行 Scrum 实践，清除障碍，确保团队遵循 Scrum
                方法。
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="mr-1 bg-gray-100 text-gray-800">管理冲刺</Badge>
                <Badge variant="outline" className="mr-1 bg-gray-100 text-gray-800">清除障碍</Badge>
                <Badge variant="outline" className="bg-gray-100 text-gray-800">主持会议</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium w-40">Product Owner</TableCell>
              <TableCell>
                负责定义产品愿景，管理产品待办事项，确保团队理解并执行产品目标。
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="mr-1 bg-gray-100 text-gray-800">管理产品待办事项</Badge>
                <Badge variant="outline" className="mr-1 bg-gray-100 text-gray-800">优先处理功能</Badge>
                <Badge variant="outline" className="bg-gray-100 text-gray-800">代表利益相关者</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Team Member</TableCell>
              <TableCell>
                负责将产品待办事项转化为工作中的软件增量，包括软件开发人员、测试人员和设计师。
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="mr-1 bg-gray-100 text-gray-800">估算任务</Badge>
                <Badge variant="outline" className="mr-1 bg-gray-100 text-gray-800">实现功能</Badge>
                <Badge variant="outline" className="bg-gray-100 text-gray-800">执行测试</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
