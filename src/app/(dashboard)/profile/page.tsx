"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { UserResponse } from "@/lib/types";
import { User, LogOut, LayoutGrid, Settings } from "lucide-react";
import MyListings from "@/components/MyListings";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'listings'>('profile');

    // Edit Mode state
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        display_name: "",
        bio: "",
        photo_url: ""
    });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const data = await authApi.getMe();
            setUser(data);
            setFormData({
                display_name: data.display_name || "",
                bio: data.bio || "",
                photo_url: data.photo_url || ""
            });
        } catch (err) {
            console.error(err);
            // Don't block UI on error, allow logout
            setLoading(false);
            // setError("Kullanıcı bilgileri alınamadı."); 
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Only send updated fields
            const updatedUser = await authApi.updateMe({
                display_name: formData.display_name,
                bio: formData.bio,
                photo_url: formData.photo_url
            });
            setUser(updatedUser);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            setError("Profil güncellenemedi.");
        } finally {
            setSaving(false);
        }
    }

    const handleLogout = () => {
        authApi.logout();
        router.push("/auth/login");
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

    // Fallback UI if user fetch fails but we want to show the page layout or at least logout
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
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                {/* Banner/Header */}
                <div className="h-40 bg-gradient-to-r from-red-600 to-red-400"></div>

                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-16 mb-6">
                        <div className="relative">
                            {displayUser.photo_url ? (
                                <img
                                    src={displayUser.photo_url}
                                    alt={displayUser.display_name}
                                    className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white shadow-md"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center shadow-md">
                                    <User className="w-12 h-12 text-gray-300" />
                                </div>
                            )}
                        </div>

                        {!isEditing && (
                            <div className="flex items-center gap-3 mb-2">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    <Settings className="w-4 h-4" />
                                    Profili Düzenle
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Çıkış Yap
                                </button>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="max-w-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
                            {/* ... Editing Form Fields ... */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Ad Soyad</label>
                                    <input
                                        type="text"
                                        value={formData.display_name}
                                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Biyografi</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-gray-400"
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Profil Fotoğrafı URL</label>
                                    <input
                                        type="url"
                                        value={formData.photo_url}
                                        onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                                >
                                    {saving ? "Kaydediliyor..." : "Kaydet"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-8">
                                <h1 className="text-3xl font-extrabold text-gray-900">{displayUser.display_name}</h1>
                                <p className="text-gray-500">{displayUser.email}</p>
                            </div>

                            {/* Tabs */}
                            <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all relative ${activeTab === 'profile'
                                        ? 'text-red-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <User className="w-4 h-4" />
                                    Profil
                                    {activeTab === 'profile' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-full"></div>}
                                </button>
                                <button
                                    onClick={() => setActiveTab('listings')}
                                    className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all relative ${activeTab === 'listings'
                                        ? 'text-red-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                    İlanlarım
                                    {activeTab === 'listings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-full"></div>}
                                </button>
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'profile' ? (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {displayUser.bio && (
                                        <div className="mb-8">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">Hakkında</h3>
                                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-gray-700 leading-relaxed">{displayUser.bio}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                                            <div className="text-3xl font-extrabold text-purple-600 mb-1">{displayUser.stats?.items_donated || 0}</div>
                                            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Bağışlanan</div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                                            <div className="text-3xl font-extrabold text-pink-600 mb-1">{displayUser.stats?.items_received || 0}</div>
                                            <div className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Alınan</div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                                            <div className="text-3xl font-extrabold text-green-600 mb-1">{displayUser.stats?.carbon_saved || 0}</div>
                                            <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Karbon Tasarrufu</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <MyListings />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
