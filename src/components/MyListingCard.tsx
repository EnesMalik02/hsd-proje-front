import React from "react";
import { MapPin, Bed, Bath, Ruler, Pencil, FileText, Clock } from "lucide-react";

export interface MyListingProps {
    id: string;
    title: string;
    location: string;
    price: number | string;
    currency: string;
    status: "Active" | "Pending" | "Sold" | "Draft";
    image: string;
    stats: {
        beds: number;
        baths: number;
        sqft: number;
    };
    requestsCount?: number;
}

interface MyListingCardProps {
    listing: MyListingProps;
    onEdit?: (id: string) => void;
    onRequests?: (id: string) => void;
    onViewHistory?: (id: string) => void;
}

export function MyListingCard({ listing, onEdit, onRequests, onViewHistory }: MyListingCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active": return "bg-green-100 text-green-700 border-green-200";
            case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "Sold": return "bg-gray-100 text-gray-700 border-gray-200";
            case "Draft": return "bg-gray-100 text-gray-600 border-gray-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            {/* Image Section */}
            <div className="relative h-48 bg-gray-100">
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />

                {/* Status Badge */}
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(listing.status)} flex items-center gap-1.5`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${listing.status === 'Active' ? 'bg-green-500' : listing.status === 'Pending' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                    {listing.status}
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-bold">
                    {typeof listing.price === 'number' ? listing.price.toLocaleString() : listing.price} {listing.currency}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{listing.title}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    <span className="line-clamp-1">{listing.location}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs font-medium text-gray-600 mb-6">
                    <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4 text-gray-400" />
                        {listing.stats.beds} Beds
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4 text-gray-400" />
                        {listing.stats.baths} Baths
                    </div>
                    <div className="flex items-center gap-1">
                        <Ruler className="w-4 h-4 text-gray-400" />
                        {listing.stats.sqft.toLocaleString()} sqft
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => onEdit?.(listing.id)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                        >
                            <Pencil className="w-4 h-4" />
                            Edit
                        </button>
                        <button
                            onClick={() => onRequests?.(listing.id)}
                            className="relative flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors text-sm"
                        >
                            <FileText className="w-4 h-4" />
                            Requests
                            {listing.requestsCount ? (
                                <span className="absolute -top-1.5 -right-1.5 bg-white text-red-600 text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border border-red-100 shadow-sm">
                                    {listing.requestsCount}
                                </span>
                            ) : null}
                        </button>
                    </div>

                    <button
                        onClick={() => onViewHistory?.(listing.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 font-medium rounded-xl hover:bg-gray-100 hover:text-gray-700 transition-colors text-xs"
                    >
                        <Clock className="w-3.5 h-3.5" />
                        View History
                    </button>
                </div>
            </div>
        </div>
    );
}
