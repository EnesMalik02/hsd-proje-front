import Link from "next/link";
import { Hexagon } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full flex flex-col bg-[#f8f9fa] text-gray-900 font-sans">
            {/* Navbar */}
            <header className="w-full px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-red-600 p-1 rounded-lg">
                        <Hexagon className="w-6 h-6 text-white fill-current" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">HSD Proje API</span>
                </div>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <Link href="#" className="hover:text-gray-900 transition-colors">Documentation</Link>
                    <Link href="#" className="hover:text-gray-900 transition-colors">Support</Link>
                    <Link href="#" className="hover:text-gray-900 transition-colors">Status</Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                {children}
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-xs text-gray-400">
                © 2024 HSD Proje API. All rights reserved.
            </footer>
        </div>
    );
}
