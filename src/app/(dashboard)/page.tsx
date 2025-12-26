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
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back, Alex</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening with your listings today.</p>
                </div>
            </div>

            {/* Suggested Listings Header & Filters */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Suggested Listings</h2>
                <div className="flex gap-2">
                    <button className="px-4 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-full shadow-sm hover:bg-red-700 transition-colors">All</button>
                    <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors">Trending</button>
                    <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors">New Arrivals</button>
                    <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors">Best Value</button>
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
                    <p className="text-lg text-gray-500">No suggested listings found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {listings.map((listing, index) => (
                        <div key={listing.id} className="relative group">
                            {/* Badges Mockup */}
                            {index % 4 === 0 && (
                                <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">TRENDING</div>
                            )}
                            {index % 4 === 1 && (
                                <div className="absolute top-3 right-3 z-10 bg-white text-gray-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm">NEW</div>
                            )}
                            {index % 4 === 3 && (
                                <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">HOT</div>
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
