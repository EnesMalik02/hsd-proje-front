"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { ListingResponse } from "@/lib/types";
import { ListingCard } from "@/components/ListingCard";
import { Loader2 } from "lucide-react";

export default function Home() {
    const router = useRouter();
    const [listings, setListings] = useState<ListingResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const data = await authApi.getSuggestedListings();
                setListings(data);
            } catch (err) {
                console.error("Failed to fetch listings:", err);
                setError("İlanlar yüklenirken bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    return (
        <div>
            <div className="p-4 mt-8">
                {/* Header Content */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Anasayfa
                        </h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            Hoş geldiniz, platformdaki ilanları buradan takip edebilirsiniz.
                        </p>
                    </div>
                </div>

                {/* Dashboard Stats Placeholders */}
                <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex h-32 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border border-purple-100 dark:border-gray-700">
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">12</p>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Aktif İlanlar</p>
                    </div>
                    <div className="flex h-32 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-800 dark:to-gray-800 border border-pink-100 dark:border-gray-700">
                        <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">5</p>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Okunmamış Mesajlar</p>
                    </div>
                    <div className="flex h-32 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-800 border border-orange-100 dark:border-gray-700">
                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">3</p>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Yeni Bildirimler</p>
                    </div>
                </div>

                {/* Listings Grid */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sizin İçin Önerilenler</h2>

                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                        </div>
                    ) : error ? (
                        <div className="rounded-xl bg-red-50 p-6 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    ) : listings.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                            <p className="text-lg text-gray-500">Henüz önerilen ilan bulunamadı.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {listings.map((listing) => (
                                <ListingCard
                                    key={listing.id}
                                    listing={listing}
                                    onClick={() => router.push(`/listings/${listing.id}`)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
