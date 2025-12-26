"use client";

import Link from "next/link";
import { Hexagon, Search } from "lucide-react";

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
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                    <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
                    <Link href="#" className="hover:text-red-600 transition-colors">Listings</Link>
                    <Link href="#" className="hover:text-red-600 transition-colors">Services</Link>
                    <Link href="#" className="hover:text-red-600 transition-colors">Contact</Link>
                </nav>
            </div>
        </header>
    );
}
