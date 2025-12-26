"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi, ApiError } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await authApi.login(formData);
            router.push("/"); // Redirect to dashboard/home after login
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                // Try to read validation error message if available
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
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Hoş Geldiniz
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Hesabınıza giriş yapın
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                        E-posta veya Kullanıcı Adı
                    </label>
                    <input
                        className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                        id="email"
                        type="text"
                        placeholder="E-posta veya kullanıcı adı"
                        required
                        value={formData.identifier}
                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                        Şifre
                    </label>
                    <input
                        className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                        id="password"
                        type="password"
                        placeholder="******"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <button
                    className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-10 py-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </button>
            </form>

            <div className="text-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Hesabınız yok mu? </span>
                <Link href="/auth/register" className="font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400">
                    Kayıt Ol
                </Link>
            </div>
        </div>
    );
}
