"use client";

import Link from "next/link";
import { Hexagon, Search, Home, List, MessageSquare, User } from "lucide-react";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-red-600 p-1.5 rounded-lg">
                        <Hexagon className="w-5 h-5 text-white fill-current" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">HSD Proje</span>
                </Link>
                <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search properties..."
                        className="bg-transparent border-none outline-none text-sm ml-2 w-full placeholder-gray-400"
                    />
                </div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-gray-700">
                <Link href="/" className="flex items-center gap-2 hover:text-red-600 transition-colors">
                    <Home className="w-4 h-4" />
                    Ana Sayfa
                </Link>
                <Link href="#" className="flex items-center gap-2 hover:text-red-600 transition-colors">
                    <List className="w-4 h-4" />
                    Listelemelerim
                </Link>
                <Link href="/messages" className="flex items-center gap-2 hover:text-red-600 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    Mesajlarım
                </Link>
                <Link href="/profile" className="flex items-center gap-2 hover:text-red-600 transition-colors">
                    <User className="w-4 h-4" />
                    Profilim
                </Link>
            </nav>
        </header>
    );
}
