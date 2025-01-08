"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import {
    Map
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navMenu = [
  { href: "/", label: "Home" },
  { href: "/workspace", label: "Workspace" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/documentation", label: "Documentation" },
];

const Navbar = () => {
    const pathname = usePathname();
    const [user, setUser] = useState<{ name?: string; role?: string } | null>(null);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            localStorage.removeItem('user');
            localStorage.removeItem('user_id');
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure';
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure';
            setUser(null);
            router.push('/login');
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const userData = await response.json();
                    setUser({
                        name: userData.name,
                        role: userData.role
                    });
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <header className="sticky top-0 w-full flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 shadow-sm">
            <nav className="hidden md:flex flex-col md:flex-row items-center gap-2 lg:gap-4 text-lg font-medium md:text-sm">
                <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold md:text-base ml-2 md:ml-4"
                    prefetch={false}
                >
                    <Map className="h-6 w-6 md:h-8 md:w-8 text-black-500" />
                    <span className="hidden lg:inline w-32 text-gray-800 truncate">
                        敏捷之道
                    </span>
                </Link>
                {navMenu.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`px-2 py-1 rounded-md text-md font-medium transition-colors duration-200 ease-in-out
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
            <div className="ml-auto flex items-center gap-4">
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-sm font-medium">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium">{user.name || 'User'}</p>
                                    <p className="text-xs text-gray-500">{user.role}</p>
                                </div>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>个人中心</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push('/profile')}>
                                个人资料
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>
                                退出登录
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <>
                        <Button variant="outline" onClick={() => router.push('/login')}>
                            登录
                        </Button>
                        <Button onClick={() => router.push('/register')}>
                            注册
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
}

export default Navbar;