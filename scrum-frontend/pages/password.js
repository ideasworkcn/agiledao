"use client";
import Link from "next/link";
import "@/app/globals.css";
import { modifyPassword } from "@/api/user.api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

export default function Password() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const oldPassword = event.target.oldPassword.value;
    const newPassword = event.target.password.value;
    // Handle login logic here, e.g., make an API call
    console.log("Email:", email, "Password:", newPassword);

    modifyPassword({ email, oldPassword, newPassword })
      .then((res) => {
        console.log("Login response:", res);
        // Redirect to the dashboard
        router.push("/login");
        toast({ title: "修改成功", status: "success" });

        // 路由跳转
      })
      .catch((error) => {
        console.error("Login error:", error);
        // Handle login error
        toast({
          title: "修改失败",
          status: "error",
          description: error.message,
        });
      });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl">
          <CardHeader className="space-y-1 p-6">
            <CardTitle className="text-2xl font-semibold text-gray-900">修改密码</CardTitle>
            <CardDescription className="text-sm text-gray-500">请输入您的邮箱和密码信息</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">邮箱地址</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oldPassword" className="text-sm font-medium text-gray-700">当前密码</Label>
                <Input 
                  id="oldPassword" 
                  type="password" 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">新密码</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                修改密码
              </Button>
              <div className="mt-4 text-sm text-gray-600">
                <p>忘记原密码请联系管理员修改</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
      <Toaster />
    </>
  );
}
