import React from "react";
import { MoreVertical, MapPin, Clock } from "lucide-react";
import { ListingResponse } from "@/lib/types";

interface MyListingCardProps {
    listing: ListingResponse;
    onEdit?: (id: string) => void;
    onRequests?: (id: string) => void;
    onViewHistory?: (id: string) => void;
}

export function MyListingCard({ listing, onEdit, onRequests, onViewHistory }: MyListingCardProps) {
    // Format date helper
    const formatDate = (dateString?: string) => {
        if (!dateString) return "Recently";
        return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group h-full flex flex-col">
            {/* Image Section */}
            <div className="relative aspect-[4/3] bg-gray-100">
                {listing.images && listing.images.length > 0 ? (
                    <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        No Image
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-gray-900 shadow-sm border border-gray-100">
                    {listing.status || 'AVAILABLE'}
                </div>

                {/* Pending Badge Mockup based on screenshot if needed, sticking to status for now */}
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 line-clamp-1 pr-4">{listing.title}</h3>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(listing.id);
                        }}
                        className="text-gray-400 hover:text-gray-600 p-1 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Edit Listing"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                    {listing.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    <div className="flex items-center text-xs text-gray-400 font-medium gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(listing.created_at || "")}
                    </div>

                    <span className={`text-xs font-bold uppercase tracking-wider ${!listing.price || listing.price === 0 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                        {!listing.price || listing.price === 0 ? 'FREE' : listing.type === 'exchange' ? 'EXCHANGE' : `${listing.price} ${listing.currency}`}
                    </span>
                </div>
            </div>
        </div>
    );
}
