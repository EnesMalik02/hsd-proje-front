"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Plus, Filter, ArrowUpDown, ChevronDown } from "lucide-react";
import { MyListingCard } from "./MyListingCard";
import { ListingResponse } from "@/lib/types";

interface MyListingsProps {
    listings: ListingResponse[];
    onEdit?: (id: string) => void;
}

export default function MyListings({ listings, onEdit }: MyListingsProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Statuses");

    const filteredListings = listings.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (listing.description && listing.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search your listings..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors justify-between min-w-[140px]">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            {statusFilter}
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    <Link
                        href="/listings/create"
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 border border-red-600 rounded-lg text-sm font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Listing
                    </Link>
                </div>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map(listing => (
                    <div key={listing.id} className="h-full">
                        <MyListingCard
                            listing={listing}
                            onEdit={onEdit}
                            onRequests={(id) => console.log("Requests", id)}
                            onViewHistory={(id) => console.log("History", id)}
                        />
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredListings.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium mb-2">No listings found.</p>
                    <p className="text-gray-400 text-sm">Create a new listing to get started.</p>
                </div>
            )}
        </div>
    );
}
