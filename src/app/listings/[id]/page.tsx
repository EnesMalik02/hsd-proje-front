"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { ListingResponse } from "@/lib/types";
import Navbar from "@/components/Navbar";
import {
    Search, Heart, Share2, Printer, MapPin,
    Bed, Bath, Ruler, Calendar, CheckCircle2,
    Phone, CalendarDays, Hexagon, Loader2,
    Tag, Gift
} from "lucide-react";

export default function ListingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [listing, setListing] = useState<ListingResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const data = await authApi.getListing(params.id as string);
                setListing(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) {
            fetchListing();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
        )
    }

    if (!listing) return null;

    // Real images from API (base64 or URL)
    // Fallback if no images provided
    const images = listing.images && listing.images.length > 0 ? listing.images : [
        "https://images.unsplash.com/photo-1555529733-0e670560f7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Navbar />

            {/* Breadcrumbs */}

            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <Link href="/" className="hover:text-gray-900">Home</Link>
                    <span>/</span>
                    <span className="capitalize">{listing.category || "Listing"}</span>
                    <span>/</span>
                    <span className="text-gray-900">{listing.title}</span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 pb-20">
                {/* Gallery */}
                <div className="mb-10">
                    {images.length === 1 ? (
                        <div className="w-full h-[400px] md:h-[500px] relative group overflow-hidden rounded-2xl">
                            <img
                                src={images[0]}
                                alt="Main"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
                            <div className="md:col-span-3 h-full relative group">
                                <img
                                    src={images[activeImage]}
                                    alt="Main"
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-gray-900">
                                    {activeImage + 1} / {images.length} Photos
                                </div>
                            </div>
                            <div className="hidden md:flex flex-col gap-4 h-full overflow-y-auto">
                                {images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`relative h-1/3 cursor-pointer rounded-2xl overflow-hidden ${activeImage === idx ? 'ring-2 ring-red-600' : ''}`}
                                        onClick={() => setActiveImage(idx)}
                                    >
                                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Header Info */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                    {listing.type === 'donation' ? <Gift className="w-3 h-3" /> : null}
                                    {listing.type === 'donation' ? 'Donation' : 'For Sale'}
                                </span>
                                <div className="flex items-center gap-1 text-gray-500 text-xs font-medium">
                                    <CalendarDays className="w-3 h-3" />
                                    Listed {new Date(listing.created_at || Date.now()).toLocaleDateString()}
                                </div>
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight break-words">
                                {listing.title}
                            </h1>
                            <div className="flex items-center text-gray-500 font-medium">
                                <MapPin className="w-4 h-4 mr-1 text-red-600" />
                                {listing.location.city}, {listing.location.district}
                            </div>
                        </div>

                        {/* Key Stats (Conditional) */}
                        {/* Only show these if relevant (e.g. Real Estate), or show generic stats */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-gray-50/50">
                                <Tag className="w-6 h-6 text-red-600 mb-2" />
                                <span className="block text-lg font-bold text-gray-900 capitalize">{listing.category}</span>
                                <span className="text-xs text-gray-500">Category</span>
                            </div>
                        </div>

                        {/* About */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">About this item</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {listing.description}
                            </p>
                        </div>

                        {/* Amenities / Features (Mocked or derived) */}
                        {/* 
                <div>
                     <h2 className="text-xl font-bold text-gray-900 mb-6">Features</h2>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                        {["Condition: New", "Original Box", "Receipt Available"].map((item) => (
                            <div key={item} className="flex items-center gap-2 text-gray-600">
                                <CheckCircle2 className="w-5 h-5 text-red-600" />
                                <span className="text-sm font-medium">{item}</span>
                            </div>
                        ))}
                     </div>
                </div>
                */}

                        {/* Location Map Placeholder */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Location</h2>
                            <div className="w-full h-80 bg-gray-100 rounded-2xl relative overflow-hidden flex items-center justify-center">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps?q=${listing.location.lat},${listing.location.lng}&z=15&output=embed`}
                                >
                                </iframe>
                            </div>
                        </div>

                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Price Card */}
                            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6">
                                <div className="mb-6">
                                    <div className="text-xs text-gray-500 font-medium mb-1">
                                        {listing.type === 'donation' ? 'Estimated Value' : 'Listing Price'}
                                    </div>
                                    <div className="text-4xl font-extrabold text-red-600">
                                        {listing.price.toLocaleString()} {listing.currency}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                        {listing.owner_avatar ? (
                                            <img src={listing.owner_avatar} alt="Owner" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white font-bold text-lg">
                                                {listing.owner_name?.charAt(0) || "U"}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-lg">{listing.owner_name}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            Seller / Donor
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Contact {listing.type === 'donation' ? 'Donor' : 'Seller'}
                                    </button>
                                    {/* 
                            <button className="w-full bg-white border-2 border-red-600 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                                <CalendarDays className="w-4 h-4" />
                                Schedule Meeting
                            </button>
                            */}
                                </div>

                                <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-100">
                                    <button className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-red-600 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shadow-sm">
                                            <Heart className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-medium uppercase">Save</span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-red-600 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shadow-sm">
                                            <Share2 className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-medium uppercase">Share</span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-red-600 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shadow-sm">
                                            <Printer className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-medium uppercase">Print</span>
                                    </button>
                                </div>
                            </div>

                            {/* Verified Badge */}
                            <div className="bg-red-50 rounded-2xl p-4 flex items-start gap-3 border border-red-100">
                                <div className="bg-red-600 rounded-full p-1 mt-0.5">
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900">HSD Verified Listing</div>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                        This item has been verified for authenticity and condition.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-100 py-8 text-center text-xs text-gray-400">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="bg-red-600 p-1 rounded-lg">
                        <Hexagon className="w-4 h-4 text-white fill-current" />
                    </div>
                    <span className="text-base font-bold text-gray-900">HSD Proje</span>
                </div>
                © 2024 HSD Proje. All rights reserved.
            </footer>
        </div>
    );
}
