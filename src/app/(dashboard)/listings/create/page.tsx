"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { ListingCreate } from "@/lib/types";

export default function CreateListingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<ListingCreate>({
        title: "",
        description: "",
        images: [], // Simulating images for now
        category: "other",
        type: "sale",
        price: 0,
        currency: "TRY",
        location: {
            lat: 39.9334, // Default Anchor
            lng: 32.8597,
            city: "Ankara",
            district: "Cankaya"
        },
        status: "active"
    });

    const [imageUrl, setImageUrl] = useState("");

    const handleAddImage = () => {
        if (imageUrl) {
            setFormData(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
            setImageUrl("");
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await authApi.createListing(formData);
            router.push("/");
        } catch (err: any) {
            console.error(err);
            setError("İlan oluşturulurken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Yeni Satış İlanı Oluştur</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Satmak istediğiniz ürünün detaylarını girin.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">İlan Başlığı</label>
                    <input
                        type="text"
                        required
                        className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Örn: iPhone 13 Pro - Temiz"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Açıklama</label>
                    <textarea
                        required
                        rows={4}
                        className="flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Ürünün özelliklerinden bahsedin..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Fiyat</label>
                        <input
                            type="number"
                            min="0"
                            required
                            className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Para Birimi</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        >
                            <option value="TRY">TRY</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Kategori</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="electronics">Elektronik</option>
                            <option value="clothing">Giyim</option>
                            <option value="home">Ev & Yaşam</option>
                            <option value="other">Diğer</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Tip</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="sale">Satılık</option>
                            <option value="donation">Bağış</option>
                        </select>
                    </div>
                </div>

                {/* Simplified Location Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Şehir</label>
                        <input
                            type="text"
                            required
                            className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.location.city}
                            onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">İlçe</label>
                        <input
                            type="text"
                            required
                            className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.location.district}
                            onChange={(e) => setFormData({ ...formData, location: { ...formData.location, district: e.target.value } })}
                        />
                    </div>
                </div>

                {/* Image URL Input (Temporary) */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Görsel URL (Opsiyonel)</label>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                        />
                        <button
                            type="button"
                            onClick={handleAddImage}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-sm font-medium transition-colors"
                        >
                            Ekle
                        </button>
                    </div>
                    {formData.images.length > 0 && (
                        <div className="flex gap-2 mt-2">
                            {formData.images.map((img, i) => (
                                <div key={i} className="relative w-16 h-16 rounded overflow-hidden border border-gray-200">
                                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-11 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Oluşturuluyor..." : "İlanı Yayınla"}
                </button>
            </form>
        </div>
    );
}
