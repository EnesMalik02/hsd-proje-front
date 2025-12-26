import React from "react";
import { ListingResponse } from "@/lib/types";
import { MapPin, Tag } from "lucide-react";

interface ListingCardProps {
    listing: ListingResponse;
    onClick?: () => void;
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
    return (
        <div
            onClick={onClick}
            className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200 transition-all hover:shadow-md hover:border-red-200 cursor-pointer h-full"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                {listing.images && listing.images.length > 0 ? (
                    <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 bg-gray-50">
                        <span className="text-xs font-medium">Görsel Yok</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4 gap-3">
                <div>
                    <h3 className="line-clamp-1 text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                        {listing.title}
                    </h3>

                    {/* New Category Location */}
                    {listing.category && (
                        <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">
                            {listing.category}
                        </p>
                    )}

                    <p className="mt-1 line-clamp-2 text-xs text-gray-500 leading-relaxed font-medium">
                        {listing.description || "Açıklama bulunmuyor."}
                    </p>
                </div>

                {/* Footer Info */}
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-gray-300" />
                        <span className="line-clamp-1">
                            {listing.location.city}
                            {listing.location.district ? `, ${listing.location.district}` : ""}
                        </span>
                    </div>

                    <div className="text-sm font-bold">
                        {listing.price === 0 || listing.type === 'donation' ? (
                            <span className="text-green-600 px-2 py-0.5 bg-green-50 rounded-md">BAĞIŞ</span>
                        ) : (
                            <span className="text-red-600">{listing.price} {listing.currency}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
