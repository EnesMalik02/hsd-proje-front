"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authApi, chatApi, requestApi } from "@/lib/api";
import { ChatListResponse, ListingResponse } from "@/lib/types";
import Navbar from "@/components/Navbar";
import {
    Search, Heart, Share2, MapPin,
    Bed, Bath, Ruler, Calendar, CheckCircle2,
    Phone, CalendarDays, Hexagon, Loader2,
    Tag, Gift, MessageCircle, Send, X
} from "lucide-react";

export default function ListingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [listing, setListing] = useState<ListingResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [isDonation, setIsDonation] = useState(false);
    const [myChats, setMyChats] = useState<ChatListResponse[]>([]);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [sendingRequest, setSendingRequest] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

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

        const fetchChats = async () => {
            try {
                const chats = await chatApi.getMyChats();
                setMyChats(chats);
            } catch (err) {
                console.error("Failed to fetch chats", err);
            }
        }

        const checkFavorite = async () => {
            try {
                const favorites = await authApi.getFavorites();
                if (favorites.some(f => f.id === params.id)) {
                    setIsFavorite(true);
                }
            } catch (err) {
                console.error("Failed to check favorite status", err);
            }
        }

        if (params.id) {
            fetchListing();
            fetchChats();
            checkFavorite();
        }
    }, [params.id]);

    useEffect(() => {
        setIsDonation(listing?.price === 0 || listing?.type === 'donation');
    }, [listing]);

    const handleToggleFavorite = async () => {
        if (!listing) return;
        try {
            const res = await authApi.toggleFavorite(listing.id);
            setIsFavorite(res.is_favorite);
        } catch (err) {
            console.error("Failed to toggle favorite", err);
        }
    };

    const handleMessage = async () => {
        if (!listing) return;
        setSendingRequest(true);
        try {
            // Updated system: Check for existing chat or start new one directly
            const chat = await chatApi.startChat({ listing_id: listing.id });
            router.push(`/messages/${chat.id}`);
        } catch (err) {
            console.error("Failed to start chat", err);
            // Fallback: If startChat fails, maybe check existing list but startChat should return existing if any
            // Alert user
            alert("Sohbet başlatılırken bir hata oluştu.");
        } finally {
            setSendingRequest(false);
        }
    };

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
                    <Link href="/" className="hover:text-gray-900">Ana Sayfa</Link>
                    <span>/</span>
                    <span className="capitalize">{(() => {
                        const map: Record<string, string> = {
                            electronics: "Elektronik",
                            clothing: "Giyim",
                            home: "Ev & Yaşam",
                            other: "Diğer"
                        };
                        return map[listing.category] || listing.category;
                    })()}</span>
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
                        <div className="flex flex-col gap-4">
                            <div className="w-full h-[400px] md:h-[500px] relative group overflow-hidden rounded-2xl">
                                <img
                                    src={images[activeImage]}
                                    alt="Main"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-gray-900">
                                    {activeImage + 1} / {images.length} Fotoğraf
                                </div>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-2 pl-1">
                                {images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`relative h-24 w-32 flex-shrink-0 cursor-pointer rounded-xl overflow-hidden ${activeImage === idx ? 'ring-2 ring-red-600' : 'opacity-70 hover:opacity-100'}`}
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
                                    {listing.type === 'donation' ? 'Ücretsiz' : 'Satılık'}
                                </span>
                                <div className="flex items-center gap-1 text-gray-500 text-xs font-medium">
                                    <CalendarDays className="w-3 h-3" />
                                    Yayınlandı {new Date(listing.created_at || Date.now()).toLocaleDateString()}
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
                                <span className="block text-lg font-bold text-gray-900 capitalize">{(() => {
                                    const map: Record<string, string> = {
                                        electronics: "Elektronik",
                                        clothing: "Giyim",
                                        home: "Ev & Yaşam",
                                        other: "Diğer"
                                    };
                                    return map[listing.category] || listing.category;
                                })()}</span>
                                <span className="text-xs text-gray-500">Kategori</span>
                            </div>
                        </div>

                        {/* About */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Ürün Hakkında</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {listing.description}
                            </p>
                        </div>

                        {/* Location Map Placeholder */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Konum</h2>
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
                                        {isDonation ? (
                                            ''
                                        ) : (
                                            'İlan Fiyatı'
                                        )}
                                    </div>
                                    {isDonation ? (
                                        <div className="flex justify-center py-4">
                                            <style jsx>{`
                                                @keyframes scalePulse {
                                                    0%, 100% { transform: scale(1) rotate(40deg); }
                                                    50% { transform: scale(1.2) rotate(40deg); }
                                                }
                                                .donation-label {
                                                    animation: scalePulse 2s infinite ease-in-out;
                                                }
                                            `}</style>
                                            <div className="donation-label text-5xl font-extrabold text-red-600 border-4 border-red-600 px-4 py-1 rounded-xl shadow-lg bg-white/50 backdrop-blur-sm -rotate-[30deg]">
                                                ÜCRETSİZ
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-4xl font-extrabold text-red-600">
                                            {listing.price.toLocaleString()} {listing.currency}
                                        </div>
                                    )}
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
                                            İlan Sahibi
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        {listing.type === 'donation' ? 'İlan Sahibiyle' : 'Satıcıyla'} İletişime Geç
                                    </button>

                                    <button
                                        onClick={handleMessage}
                                        disabled={sendingRequest}
                                        className="w-full bg-white border-2 border-red-600 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {sendingRequest ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                                        Mesaj Gönder
                                    </button>
                                    {/* 
                            <button className="w-full bg-white border-2 border-red-600 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                                <CalendarDays className="w-4 h-4" />
                                Schedule Meeting
                            </button>
                            */}
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-6 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={handleToggleFavorite}
                                        className={`flex flex-col items-center justify-center gap-1 transition-colors ${isFavorite ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${isFavorite ? 'bg-red-50' : 'bg-gray-50'}`}>
                                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                                        </div>
                                        <span className="text-[10px] font-medium uppercase">Kaydet</span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-red-600 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shadow-sm">
                                            <Share2 className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-medium uppercase">Paylaş</span>
                                    </button>
                                </div>
                            </div>

                            {/* Verified Badge */}
                            <div className="bg-red-50 rounded-2xl p-4 flex items-start gap-3 border border-red-100">
                                <div className="bg-red-600 rounded-full p-1 mt-0.5">
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900">Loopa Onaylı İlan</div>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                        Bu ürünün orijinalliği ve durumu doğrulanmıştır.
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
                    <span className="text-base font-bold text-gray-900">Loopa</span>
                </div>
                © 2024 Loopa. Tüm hakları saklıdır.
            </footer>

        </div>
    );
}
