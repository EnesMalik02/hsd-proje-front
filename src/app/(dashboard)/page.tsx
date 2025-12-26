"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { ListingResponse } from "@/lib/types";
import { ListingCard } from "@/components/ListingCard";
import { Loader2, Search, Filter, ArrowUpDown, ChevronDown } from "lucide-react";

export default function Home() {
    const router = useRouter();
    const [listings, setListings] = useState<ListingResponse[]>([]);
    const [userName, setUserName] = useState<string>("User");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Statuses");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user data
                try {
                    const user = await authApi.getMe();
                    if (user && user.display_name) {
                        setUserName(user.display_name);
                    }
                } catch (e) {
                    console.log("Could not fetch user name");
                }

                const data = await authApi.getSuggestedListings();
                setListings(data);
            } catch (err) {
                console.error("Failed to fetch listings:", err);
                setError("İlanlar yüklenirken bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tekrar hoş geldin, {userName}</h1>
                    <p className="text-gray-500 mt-1">İlanlarınla ilgili gelişmeleri buradan takip edebilirsin.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="İlan başlığı, adres veya ID ile ara..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors min-w-[140px] justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            Tüm Durumlar
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors min-w-[140px] justify-between">
                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="w-4 h-4 text-gray-500" />
                            En Yeniler
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Listings Grid */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                </div>
            ) : error ? (
                <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
                    {error}
                </div>
            ) : listings.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
                    <p className="text-lg text-gray-500">Önerilen ilan bulunamadı.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {listings.map((listing, index) => (
                        <div key={listing.id} className="relative group">
                            {/* Badges Mockup */}
                            {index % 4 === 0 && (
                                <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">TREND</div>
                            )}
                            {index % 4 === 1 && (
                                <div className="absolute top-3 right-3 z-10 bg-white text-gray-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm">YENİ</div>
                            )}
                            {index % 4 === 3 && (
                                <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">POPÜLER</div>
                            )}

                            <ListingCard
                                listing={listing}
                                onClick={() => router.push(`/listings/${listing.id}`)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
