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
            className="group relative flex flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-md cursor-pointer border border-gray-100 dark:border-gray-700"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                {listing.images && listing.images.length > 0 ? (
                    <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <span className="text-sm">Görsel Yok</span>
                    </div>
                )}

                {/* Price Tag */}
                <div className="absolute top-2 right-2 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-gray-900 backdrop-blur-sm shadow-sm dark:bg-black/70 dark:text-white">
                    {listing.price} {listing.currency}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-start justify-between">
                    <h3 className="line-clamp-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {listing.title}
                    </h3>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-gray-500 dark:text-gray-400 flex-1">
                    {listing.description}
                </p>

                {/* Footer Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{listing.location.city}, {listing.location.district}</span>
                    </div>
                    {listing.category && (
                        <div className="flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 dark:bg-gray-700">
                            <Tag className="h-3 w-3" />
                            <span>{listing.category}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
