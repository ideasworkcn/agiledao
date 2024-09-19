"use client";
import Link from "next/link";
import "@/app/globals.css";
import { login } from "@/api/user.api";
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

export default function Page() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    login({ email, password })
      .then((res) => {
        const { token, id, username, email, role } = res;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", id);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("role", role);
        router.push("/dashboard");
        toast({ title: "登录成功", status: "success" });
      })
      .catch((error) => {
        console.error("Login error:", error);
        toast({
          title: "登录失败",
          status: "error",
          description: error.message,
        });
      });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="max-w-md w-full px-6 py-8 border border-gray-100 bg-white rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">敏捷之道 AgileDao</h1>
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center text-gray-700">
                登录
              </CardTitle>
              <CardDescription className="text-center text-gray-500">
                请输入您的邮箱和密码以登录您的账户
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">密码</Label>
                    <Link
                      href="/password"
                      className="text-sm text-blue-600 hover:text-blue-800 transition duration-200"
                    >
                      忘记密码?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200">
                  登录
                </Button>
              </form>
              <div className="mt-6 text-center text-sm text-gray-600">
                需要账号?{" "}
                <span className="text-blue-600 hover:text-blue-800 cursor-pointer transition duration-200">联系管理员创建账号</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
      <Toaster />
    </>
  );
}
