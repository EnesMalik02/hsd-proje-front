"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Plus, Filter, ArrowUpDown, ChevronDown } from "lucide-react";
import { MyListingCard, MyListingProps } from "./MyListingCard";

// Mock Data
const MOCK_LISTINGS: MyListingProps[] = [
    {
        id: "1",
        title: "Modern Villa in Beverly Hills",
        location: "90210 Beverly Hills, CA",
        price: 1200000,
        currency: "USD",
        status: "Active",
        image: "https://images.unsplash.com/photo-1600596542815-e32c21216316?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        stats: { beds: 4, baths: 3, sqft: 3500 },
        requestsCount: 3
    },
    {
        id: "2",
        title: "Downtown Loft Apartment",
        location: "New York, NY 10001",
        price: 850000,
        currency: "USD",
        status: "Pending",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        stats: { beds: 2, baths: 2, sqft: 1200 }
    },
    {
        id: "3",
        title: "Suburban Family Home",
        location: "Austin, TX 78701",
        price: 450000,
        currency: "USD",
        status: "Sold",
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        stats: { beds: 3, baths: 2, sqft: 2100 }
    },
    {
        id: "4",
        title: "Penthouse with City View",
        location: "Chicago, IL 60611",
        price: 2150000,
        currency: "USD",
        status: "Active",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        stats: { beds: 3, baths: 3.5, sqft: 2800 },
        requestsCount: 12
    }
];

export default function MyListings() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Statuses");

    const filteredListings = MOCK_LISTINGS.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Listings</h1>
                    <p className="text-gray-500 mt-1">Manage your property inventory and view incoming requests.</p>
                </div>
                <Link
                    href="/listings/create"
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Create New Listing
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by title, address, or ID..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors min-w-[140px] justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            {statusFilter}
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors min-w-[140px] justify-between">
                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="w-4 h-4 text-gray-500" />
                            Newest First
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map(listing => (
                    <MyListingCard
                        key={listing.id}
                        listing={listing}
                        onEdit={(id) => console.log("Edit", id)}
                        onRequests={(id) => console.log("Requests", id)}
                        onViewHistory={(id) => console.log("History", id)}
                    />
                ))}
            </div>

            {/* Empty State */}
            {filteredListings.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">No listings found matching your search.</p>
                </div>
            )}

            {/* Pagination (Visual Only) */}
            <div className="flex items-center justify-center gap-2 mt-8">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                    &lt;
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-600 text-white font-bold shadow-md">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors">3</button>
                <div className="px-2 text-gray-400 select-none">...</div>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors">8</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                    &gt;
                </button>
            </div>
        </div>
    );
}
