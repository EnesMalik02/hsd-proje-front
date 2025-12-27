"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, User, LogOut, Package, MessageCircle } from "lucide-react";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { name: "Anasayfa", href: "/", icon: Home },
        { name: "Satış Oluştur", href: "/listings/create", icon: PlusCircle },
        { name: "Mesajlarım", href: "/messages", icon: MessageCircle },
        { name: "Profil", href: "/profile", icon: User },
    ];

    const handleLogout = () => {
        authApi.logout();
        router.push("/auth/login");
        router.refresh();
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white/80 backdrop-blur-xl transition-transform dark:border-gray-800 dark:bg-black/80">
            <div className="flex h-full flex-col px-3 py-4">
                <div className="mb-10 flex items-center pl-2.5">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                        <Package className="h-5 w-5 text-white" />
                    </div>
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        Loopa
                    </span>
                </div>

                <ul className="space-y-2 font-medium">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`group flex items-center rounded-lg p-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 ${isActive
                                        ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                                        : ""
                                        }`}
                                >
                                    <Icon
                                        className={`h-5 w-5 transition duration-75 ${isActive
                                            ? "text-purple-600 dark:text-purple-400"
                                            : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                            }`}
                                    />
                                    <span className="ml-3">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center rounded-lg p-2 text-gray-900 transition-all hover:bg-red-50 hover:text-red-600 dark:text-white dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        <span className="ml-3 whitespace-nowrap">Çıkış Yap</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
