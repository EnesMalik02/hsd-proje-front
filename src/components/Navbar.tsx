"use client";

import Link from "next/link";
import { useState } from "react";
import { Hexagon, Search, Home, List, MessageSquare, User, Menu, X, Plus } from "lucide-react";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-red-600 p-1.5 rounded-lg">
                            <Hexagon className="w-5 h-5 text-white fill-current" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">Loopa</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-gray-700">
                    <Link href="/" className="flex items-center gap-2 hover:text-red-600 transition-colors">
                        <Home className="w-4 h-4" />
                        Ana Sayfa
                    </Link>
                    <Link href="/messages" className="flex items-center gap-2 hover:text-red-600 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        Mesajlarım
                    </Link>
                    <Link href="/profile" className="flex items-center gap-2 hover:text-red-600 transition-colors">
                        <User className="w-4 h-4" />
                        Profilim
                    </Link>
                    <Link href="/listings/create" className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors shadow-md shadow-red-500/20">
                        <Plus className="w-4 h-4" />
                        İlan Oluştur
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 animate-in slide-in-from-top-2">
                    <nav className="flex flex-col gap-4">
                        <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 text-sm font-bold text-gray-700 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Home className="w-5 h-5" />
                            Ana Sayfa
                        </Link>
                        <Link
                            href="/messages"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 text-sm font-bold text-gray-700 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <MessageSquare className="w-5 h-5" />
                            Mesajlarım
                        </Link>
                        <Link
                            href="/profile"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 text-sm font-bold text-gray-700 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <User className="w-5 h-5" />
                            Profilim
                        </Link>
                        <Link
                            href="/listings/create"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 text-sm font-bold text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            İlan Oluştur
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
