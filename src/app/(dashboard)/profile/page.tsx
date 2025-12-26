"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { UserResponse } from "@/lib/types";
import { User } from "lucide-react";

export default function ProfilePage() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            setError("Kullanıcı bilgileri alınamadı.");
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

    if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;
    if (!user) return <div className="p-8 text-center text-red-500">{error || "Kullanıcı bulunamadı"}</div>;

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">

                {/* Banner/Header */}
                <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500"></div>

                <div className="px-6 pb-6">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="relative">
                            {user.photo_url ? (
                                <img
                                    src={user.photo_url}
                                    alt={user.display_name}
                                    className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 object-cover bg-white"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                    <User className="w-10 h-10 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Profili Düzenle
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ad Soyad</label>
                                <input
                                    type="text"
                                    value={formData.display_name}
                                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Biyografi</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Profil Fotoğrafı URL</label>
                                <input
                                    type="url"
                                    value={formData.photo_url}
                                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
                                >
                                    {saving ? "Kaydediliyor..." : "Kaydet"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.display_name}</h1>
                                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>

                            {user.bio && (
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-800 pt-6 mt-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{user.stats?.items_donated || 0}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Bağışlanan</div>
                                </div>
                                <div className="text-center border-l border-gray-100 dark:border-gray-800">
                                    <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{user.stats?.items_received || 0}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Alınan</div>
                                </div>
                                <div className="text-center border-l border-gray-100 dark:border-gray-800">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{user.stats?.carbon_saved || 0}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Karbon Tasarrufu</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
