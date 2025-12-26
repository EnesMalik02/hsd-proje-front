"use client";

import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { ListingCreate, Province, ProvinceApiResponse, District } from "@/lib/types";
import { compressImage } from "@/lib/imageUtils";
import { Loader2, X, Plus, MapPin, Image as ImageIcon, Layout, Tag, DollarSign, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
    ssr: false,
    loading: () => <div className="h-[250px] w-full bg-gray-50 animate-pulse rounded-xl" />
});

export default function CreateListingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Location States
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);
    const [loadingLocation, setLoadingLocation] = useState(true);

    const [formData, setFormData] = useState<ListingCreate>({
        title: "",
        description: "",
        images: [],
        category: "other",
        type: "sale",
        price: 0,
        currency: "TRY",
        location: {
            lat: 39.9334,
            lng: 32.8597,
            city: "",
            district: ""
        },
        status: "active"
    });

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await fetch("https://api.turkiyeapi.dev/v1/provinces");
                const json: ProvinceApiResponse = await res.json();
                if (json.status === "OK") {
                    setProvinces(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch provinces:", error);
            } finally {
                setLoadingLocation(false);
            }
        };

        fetchProvinces();
    }, []);

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCityName = e.target.value;
        const selectedProvince = provinces.find(p => p.name === selectedCityName);

        if (selectedProvince) {
            setAvailableDistricts(selectedProvince.districts);
            setFormData(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    city: selectedCityName,
                    district: "", // Reset district
                    lat: selectedProvince.coordinates?.latitude || 39.9334,
                    lng: selectedProvince.coordinates?.longitude || 32.8597
                }
            }));
        } else {
            setAvailableDistricts([]);
            setFormData(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    city: "",
                    district: "",
                }
            }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setError(null);
        setLoading(true);

        try {
            const newImages: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (formData.images.length + newImages.length >= 3) {
                    setError("En fazla 3 görsel yükleyebilirsiniz.");
                    break;
                }

                const compressedBase64 = await compressImage(file);
                newImages.push(compressedBase64);
            }

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Görsel yüklenirken bir sorun oluştu.");
        } finally {
            setLoading(false);
            e.target.value = "";
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.images.length === 0) {
            setError("Lütfen en az bir görsel yükleyin.");
            setLoading(false);
            return;
        }

        try {
            await authApi.createListing(formData);
            router.push("/");
        } catch (err: unknown) {
            console.error(err);
            setError("İlan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Yeni İlan Oluştur</h1>
                    <p className="text-sm text-gray-500">
                        Satmak veya bağışlamak istediğiniz ürünün detaylarını giriniz.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm border border-red-100 rounded-xl flex items-center gap-2">
                        <span className="font-bold">Hata:</span> {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Product Details (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-red-600" />
                                Ürün Görselleri
                            </h2>

                            {/* Images Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-2">
                                {formData.images.map((img, i) => (
                                    <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 group shadow-sm bg-gray-50">
                                        <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-600 rounded-full transition-colors opacity-0 group-hover:opacity-100 shadow-sm hover:bg-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                {formData.images.length < 3 && (
                                    <label className="relative aspect-[4/3] flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 hover:border-red-500 hover:bg-red-50 transition-all cursor-pointer group bg-gray-50/50">
                                        <div className="p-2 bg-white rounded-full group-hover:shadow-sm transition-all mb-2">
                                            <Plus className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 group-hover:text-red-600">Fotoğraf Ekle</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                            multiple
                                        />
                                    </label>
                                )}
                            </div>
                            <p className="text-xs text-gray-400">Maksimum 3 görsel yükleyebilirsiniz.</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Layout className="w-5 h-5 text-red-600" />
                                Ürün Bilgileri
                            </h2>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700">İlan Başlığı</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Örn: Az Kullanılmış iPhone 13 Pro"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700">Açıklama</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Ürünün detaylı açıklaması..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Kategori</label>
                                        <select
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="electronics">Elektronik</option>
                                            <option value="clothing">Giyim</option>
                                            <option value="home">Ev & Yaşam</option>
                                            <option value="other">Diğer</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">İlan Tipi</label>
                                        <select
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                                            value={formData.type}
                                            onChange={(e) => {
                                                const newType = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    type: newType,
                                                    price: newType === "donation" ? 0 : formData.price
                                                });
                                            }}
                                        >
                                            <option value="sale">Satılık</option>
                                            <option value="donation">Bağış</option>
                                        </select>
                                    </div>
                                </div>

                                {formData.type !== "donation" && (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-gray-700">Fiyat</label>
                                            <input
                                                type="number"
                                                min="0"
                                                required
                                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-gray-700">Para Birimi</label>
                                            <select
                                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                                                value={formData.currency}
                                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                            >
                                                <option value="TRY">TRY</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700">İletişim (İsteğe Bağlı)</label>
                                    <input
                                        type="tel"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                                        value={formData.phone_number || ""}
                                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                        placeholder="05XX XXX XX XX"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Location & Submit (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-red-600" />
                                Konum
                            </h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Şehir</label>
                                        <select
                                            required
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                                            value={formData.location.city}
                                            onChange={handleCityChange}
                                            disabled={loadingLocation}
                                        >
                                            <option value="">Seçiniz</option>
                                            {provinces.map((province) => (
                                                <option key={province.id} value={province.name}>
                                                    {province.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase">İlçe</label>
                                        <select
                                            required
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                                            value={formData.location.district}
                                            onChange={(e) => setFormData({ ...formData, location: { ...formData.location, district: e.target.value } })}
                                            disabled={!formData.location.city}
                                        >
                                            <option value="">Seçiniz</option>
                                            {availableDistricts.map((district) => (
                                                <option key={district.id} value={district.name}>
                                                    {district.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2 rounded-xl overflow-hidden border border-gray-200">
                                    <LocationPicker
                                        lat={formData.location.lat}
                                        lng={formData.location.lng}
                                        onLocationSelect={(lat: number, lng: number) => setFormData({ ...formData, location: { ...formData.location, lat, lng } })}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <button
                                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Yayınlanıyor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            İlanı Yayınla
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-3">
                                    İlan vererek <a href="#" className="underline hover:text-red-600">Kullanım Koşulları</a>nı kabul etmiş olursunuz.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
