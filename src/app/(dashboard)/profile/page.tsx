"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { UserResponse, ListingResponse } from "@/lib/types";
import {
    User, Settings, LogOut, MapPin, Calendar, Share2,
    Heart, MessageSquare, Star, Gift, Box, Leaf, X
} from "lucide-react";
import MyListings from "@/components/MyListings";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [listings, setListings] = useState<ListingResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'listings' | 'requests' | 'reviews'>('listings');
    const [formData, setFormData] = useState({
        display_name: "",
        bio: "",
        photo_url: ""
    });

    // Edit Listing State
    const [editingListing, setEditingListing] = useState<ListingResponse | null>(null);
    const [editForm, setEditForm] = useState({ title: "", price: 0, currency: "TRY", status: "active" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await authApi.getMe();
                setUser(userData);
                setFormData({
                    display_name: userData.display_name || "",
                    bio: userData.bio || "",
                    photo_url: userData.photo_url || ""
                });

                // Fetch user listings
                const userListings = await authApi.getMyListings();
                setListings(userListings);
            } catch (err) {
                console.error(err);
                // Setup mock user for demo if failed
                if (!user) {
                    setUser({
                        display_name: "Jane Doe",
                        email: "jane@example.com",
                        username: "janed_eco",
                        uid: "mock",
                        photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
                        bio: "Passionate about circular economy and reducing waste. Avid recycler and vintage collector based in Berlin.",
                        location: { city: "Berlin", district: "Germany", lat: 0, lng: 0 },
                        created_at: "2023-03-01T00:00:00Z",
                        stats: { items_donated: 14, items_received: 8, carbon_saved: 125 }
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await authApi.updateMe(formData);
            setUser(prev => prev ? { ...prev, ...formData } : null);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Profil güncellenemedi");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        authApi.logout();
        router.push("/auth/login");
    };

    const handleEditClick = (id: string) => {
        const listing = listings.find(l => l.id === id);
        if (listing) {
            setEditingListing(listing);
            setEditForm({
                title: listing.title,
                price: listing.price || 0,
                currency: listing.currency || "TRY",
                status: listing.status || "active"
            });
        }
    };

    const handleUpdateListing = async () => {
        if (!editingListing) return;
        try {
            const updated = await authApi.updateListing(editingListing.id, editForm);
            setListings(listings.map(l => l.id === updated.id ? updated : l));
            setEditingListing(null);
        } catch (err) {
            console.error(err);
            alert("İlan güncellenemedi.");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

    const displayUser: UserResponse = user || {
        display_name: "Kullanıcı",
        email: "user@example.com",
        username: "user",
        uid: "mock",
        photo_url: "",
        bio: "",
        stats: { items_donated: 0, items_received: 0, carbon_saved: 0 }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - Profile Card */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                            {displayUser.photo_url ? (
                                <img
                                    src={displayUser.photo_url}
                                    alt={displayUser.display_name}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center shadow-lg">
                                    <User className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="w-full space-y-4 animate-in fade-in">
                                <input
                                    type="text"
                                    value={formData.display_name}
                                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="Name"
                                />
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                    rows={3}
                                    placeholder="Bio"
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleSave} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-bold">Save</button>
                                    <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-bold">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold text-gray-900">{displayUser.display_name}</h1>
                                <p className="text-red-600 font-medium text-sm mb-4">@{displayUser.username || "username"}</p>

                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    {displayUser.bio || "No bio description."}
                                </p>

                                <div className="w-full space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-gray-500 text-sm">
                                        <MapPin className="w-4 h-4" />
                                        {displayUser.location?.city || "Unknown City"}, {displayUser.location?.district || "Country"}
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-500 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        Joined {displayUser.created_at ? new Date(displayUser.created_at).toLocaleDateString() : "Recently"}
                                    </div>
                                </div>

                                <div className="w-full space-y-3">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                    <button className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                        <Share2 className="w-4 h-4" />
                                        Share Profile
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full py-2 text-gray-400 hover:text-red-600 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>

            {/* Right Content - Dashboard */}
            <div className="lg:col-span-8 space-y-8">



                {/* Content Tabs */}
                <div>
                    <div className="flex items-center gap-8 border-b border-gray-200 mb-6">
                        <button
                            onClick={() => setActiveTab('listings')}
                            className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'listings' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Box className="w-4 h-4" />
                            My Listings
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{listings.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'requests' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Heart className="w-4 h-4" />
                            My Requests
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'reviews' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Reviews
                        </button>
                    </div>

                    {/* Tab Panels */}
                    <div className="min-h-[300px]">
                        {activeTab === 'listings' && (
                            <MyListings listings={listings} onEdit={handleEditClick} />
                        )}
                        {activeTab === 'requests' && (
                            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <Heart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No requests yet</p>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <Star className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No reviews yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Listing Modal */}
            {editingListing && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-lg text-gray-900">İlanı Düzenle</h3>
                            <button onClick={() => setEditingListing(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat</label>
                                    <input
                                        type="number"
                                        value={editForm.price}
                                        onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Para Birimi</label>
                                    <select
                                        value={editForm.currency}
                                        onChange={e => setEditForm({ ...editForm, currency: e.target.value })}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                                    >
                                        <option value="TRY">TRY</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                                <select
                                    value={editForm.status}
                                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                                >
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="sold">Sold</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                            <button
                                onClick={() => setEditingListing(null)}
                                className="px-5 py-2.5 text-gray-700 font-bold hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-xl transition-all text-sm"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleUpdateListing}
                                className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all text-sm"
                            >
                                Değişiklikleri Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
