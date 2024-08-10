"use client"; // 这是一个客户端组件

import "@/app/globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Menu, Search, User, Package } from "lucide-react";

const Header = () => {
  const pathname = usePathname();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [navItems, setNavItems] = useState([
    { href: "/", label: "Home", role: "*" },
    { href: "/dashboard", label: "Dashboard", role: "*" },
    { href: "/task", label: "Task", role: "*" },
    { href: "/login", label: "Login", role: "*" },
  ]);
  const [role, setRole] = useState('Team Member');

  useEffect(() => {
    setEmail(localStorage.getItem("email"));
    setName(localStorage.getItem('username'));
    
    const role = localStorage.getItem("role");
    setRole(role);
    
    let scrumMasterNav = [
      { href: "/", label: "Home", role: "*" },
      { href: "/dashboard", label: "Dashboard", role: "*" },
      { href: "/product", label: "Product", role: "Scrum Master" },
      { href: "/userstory", label: "UserStory", role: "Product Owner" },
      { href: "/backlog", label: "Backlog", role: "Product Owner" },
      { href: "/sprint", label: "Sprint", role: "Scrum Master" },
      { href: "/task", label: "Task", role: "*" },
      { href: "/user", label: "User", role: "Scrum Master" },
      // { href: "/login", label: "Login", role: "*" },
    ];

    const productOwnerMasterNav = [
      { href: "/", label: "Home", role: "*" },
      { href: "/dashboard", label: "Dashboard", role: "*" },
      { href: "/userstory", label: "UserStory", role: "Product Owner" },
      { href: "/backlog", label: "Backlog", role: "Product Owner" },
      { href: "/task", label: "Task", role: "*" },
      // { href: "/login", label: "Login", role: "*" },
    ];

    const scrumTeamNav = [
      { href: "/", label: "Home", role: "*" },
      { href: "/dashboard", label: "Dashboard", role: "*" },
      { href: "/task", label: "Task", role: "*" },
      // { href: "/login", label: "Login", role: "*" },
    ];
    
    if (role) {
      if (role === "Scrum Master") {
        setNavItems(scrumMasterNav);
      } else if (role === "Product Owner") {
        setNavItems(productOwnerMasterNav);
      } else if (role === "Team Member") {
        setNavItems(scrumTeamNav);
      }
    }
  }, [role]);

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 shadow-sm">
      <nav className="hidden md:flex flex-col md:flex-row items-center gap-2 lg:gap-4 text-lg font-medium md:text-sm">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base ml-2 md:ml-4"
          prefetch={false}
        >
          <img src="/favicon.ico" alt="AgileDao Logo" className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-1 md:p-1.5 shadow-md hover:shadow-lg transition-shadow duration-300" style={{ backgroundImage: 'conic-gradient(from 0deg, #8b5cf6, #ec4899, #ef4444)' }} />

          <span className="hidden lg:inline w-32 text-gray-800 truncate">
             AgileDao
          </span>
        </Link>
       
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200 ease-in-out
              ${pathname === item.href 
                ? "bg-blue-500 text-white" 
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            prefetch={false}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] sm:w-[300px]">
          <nav className="grid gap-4 text-base font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
              prefetch={false}
            >
              <img src="/favicon.ico" alt="AgileDao Logo" className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-1.5 shadow-md" style={{ backgroundImage: 'conic-gradient(from 0deg, #8b5cf6, #ec4899, #ef4444)' }} />
              <span className="text-gray-800">敏捷之道 AgileDao</span>
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-blue-500 ${
                  pathname === item.href
                    ? "text-blue-500 font-semibold"
                    : "text-gray-700"
                }`}
                prefetch={false}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-2 md:gap-4 md:ml-auto">
        <span className="hidden md:inline-block text-xs font-medium ml-auto text-gray-700 truncate max-w-[100px]">{name}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100"
            >
              <User className="h-4 w-4 md:h-5 md:w-5 text-gray-700" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer text-sm" onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
