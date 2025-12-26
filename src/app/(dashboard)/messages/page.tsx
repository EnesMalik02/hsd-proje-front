"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { chatApi, authApi, requestApi } from "@/lib/api"; // Added requestApi
import { ChatListResponse } from "@/lib/types"; // Still used for chatApi return type
import { Loader2, MessageCircle } from "lucide-react";

export default function MessagesPage() {
    const [items, setItems] = useState<{
        id: string;
        type: 'chat' | 'request';
        title: string;
        subtitle: string;
        date: Date;
        link?: string;
        status?: string;
        image?: string | null;
        listing_id?: string;
    }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter(); // Use router for navigation

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get current user
                const me = await authApi.getMe();

                // 2. Fetch all data in parallel
                const [chats, outRequests, inRequests] = await Promise.all([
                    chatApi.getMyChats(),
                    requestApi.getRequests("requester"),
                    requestApi.getRequests("seller")
                ]);

                const combinedItems: {
                    id: string;
                    type: 'chat' | 'request';
                    title: string;
                    subtitle: string;
                    date: Date;
                    link?: string;
                    status?: string;
                    listing_id?: string;
                    image?: string | null;
                }[] = [];

                // 3. Process Chats
                // We need to fetch names for chats
                const chatPromises = chats.map(async (chat) => {
                    const otherId = chat.participants.find(p => p !== me.uid);
                    let title = "Sohbet";
                    if (otherId) {
                        try {
                            const user = await authApi.getUser(otherId);
                            title = user.display_name || user.username || "Kullanıcı";
                        } catch (e) {
                            console.error(`Failed to fetch user ${otherId}`, e);
                        }
                    }
                    return {
                        id: chat.id,
                        type: 'chat' as const,
                        title,
                        subtitle: chat.listing_title ? `${chat.listing_title} • ${chat.last_message || "Mesaj yok"}` : (chat.last_message || "Henüz mesaj yok"),
                        date: chat.last_message_time ? new Date(chat.last_message_time) : new Date(0),
                        link: `/messages/${chat.id}`,
                        image: chat.listing_image
                    };
                });

                const processedChats = await Promise.all(chatPromises);
                combinedItems.push(...processedChats);

                // 4. Process Outbound Requests (I am requester, I want to see Seller Name)
                const outPromises = outRequests.map(async (req) => {
                    let title = "Satıcı";
                    try {
                        const seller = await authApi.getUser(req.seller_id);
                        title = seller.display_name || seller.username || "Satıcı";
                    } catch (e) {
                        console.error(`Failed to fetch seller ${req.seller_id}`, e);
                    }
                    // Try to find existing chat
                    const existingChat = chats.find(c => c.listing_id === req.listing_id);

                    return {
                        id: req.id,
                        type: 'request' as const,
                        title: `${title} (İstek)`,
                        subtitle: `${req.listing_snapshot.title} için istek: ${req.message}`,
                        date: req.created_at ? new Date(req.created_at) : new Date(),
                        link: existingChat ? `/messages/${existingChat.id}` : undefined,
                        status: req.status,
                        image: req.listing_snapshot.image,
                        listing_id: req.listing_id
                    };
                });

                const processedOut = await Promise.all(outPromises);
                combinedItems.push(...processedOut);

                // 5. Process Inbound Requests (I am seller, I see Requester Name)
                const inItems = inRequests.map(req => {
                    // Try to find existing chat with this requester
                    const existingChat = chats.find(c =>
                        c.listing_id === req.listing_id &&
                        c.participants.includes(req.requester_id)
                    );

                    return {
                        id: req.id,
                        type: 'request' as const,
                        title: `${req.requester_name} (İstek)`,
                        subtitle: `${req.listing_snapshot.title} için istek: ${req.message}`,
                        date: req.created_at ? new Date(req.created_at) : new Date(),
                        link: existingChat ? `/messages/${existingChat.id}` : undefined,
                        status: req.status,
                        image: req.listing_snapshot.image,
                        listing_id: req.listing_id
                    };
                });
                combinedItems.push(...inItems);

                // 6. Sort by date desc
                combinedItems.sort((a, b) => b.date.getTime() - a.date.getTime());

                setItems(combinedItems);

            } catch (err) {
                console.error(err);
                setError("Mesajlar yüklenirken bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleItemClick = async (item: any) => {
        if (item.link) {
            router.push(item.link);
            return;
        }

        if (item.type === 'request' && item.listing_id) {
            setLoading(true);
            try {
                const chat = await chatApi.startChat({ listing_id: item.listing_id });
                router.push(`/messages/${chat.id}`);
            } catch (err) {
                console.error("Failed to navigate to chat", err);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-64 items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <MessageCircle className="h-12 w-12 mb-4 opacity-50" />
                <p>Henüz hiç mesajınız veya isteğiniz yok.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Mesajlar</h1>
            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className="block bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-red-600 transition-all duration-300 shadow-sm hover:shadow-md relative group cursor-pointer"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-700 transition-colors truncate">
                                        {item.title}
                                    </h3>
                                    {item.type === 'request' && (
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase font-extrabold tracking-wider border ${item.status === 'pending' ? 'bg-white border-red-200 text-red-600' :
                                            item.status === 'accepted' ? 'bg-white border-green-200 text-green-600' :
                                                'bg-gray-50 border-gray-200 text-gray-400'
                                            }`}>
                                            {item.status === 'pending' ? 'Bekliyor' :
                                                item.status === 'accepted' ? 'Kabul Edildi' :
                                                    item.status === 'rejected' ? 'Reddedildi' :
                                                        item.status}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors line-clamp-1">
                                    {item.subtitle}
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-gray-400 group-hover:text-red-500 transition-colors whitespace-nowrap flex-shrink-0 bg-gray-50 px-2 py-1 rounded-lg">
                                {item.date.toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
