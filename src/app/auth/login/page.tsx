"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi, ApiError } from "@/lib/api";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await authApi.login(formData);
            router.push("/");
        } catch (err: any) {
            if (err instanceof ApiError) {
                const detail = err.data?.detail;
                if (Array.isArray(detail)) {
                    setError(detail.map(d => d.msg).join(", "));
                } else if (typeof detail === "string") {
                    setError(detail);
                } else {
                    setError("Giriş yapılamadı. Bilgilerinizi kontrol edin.");
                }
            } else {
                setError("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[400px] flex flex-col items-center">
            {/* Toggle Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-8 w-64">
                <div className="flex-1 py-1.5 text-center text-sm font-medium text-gray-900 bg-white rounded-lg shadow-sm">
                    Login
                </div>
                <Link href="/auth/register" className="flex-1 py-1.5 text-center text-sm font-medium text-gray-500 rounded-lg transition-colors hover:text-gray-900">
                    Register
                </Link>
            </div>

            <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-sm text-gray-500 mt-2">Join us to access HSD Proje API features</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 ml-1" htmlFor="email">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                required
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-medium text-gray-900"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 ml-1" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-medium text-gray-900"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#ef4444] hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm mt-4 text-sm"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>

            <div className="mt-8 text-sm text-gray-500">
                Don't have an account?{" "}
                <Link href="/auth/register" className="font-semibold text-gray-900 hover:text-red-600 transition-colors">
                    Register
                </Link>
            </div>
        </div>
    );
}
