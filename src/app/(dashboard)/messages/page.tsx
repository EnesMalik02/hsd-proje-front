"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { chatApi } from "@/lib/api";
import { ChatListResponse } from "@/lib/types";
import { Loader2, MessageCircle } from "lucide-react";

export default function MessagesPage() {
    const [chats, setChats] = useState<ChatListResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const data = await chatApi.getMyChats();
                setChats(data);
            } catch (err) {
                console.error(err);
                setError("Mesajlar yüklenirken bir hata oluştur.");
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
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

    if (chats.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <MessageCircle className="h-12 w-12 mb-4 opacity-50" />
                <p>Henüz hiç mesajınız yok.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Mesajlar</h1>
            <div className="space-y-4">
                {chats.map((chat) => (
                    <Link
                        key={chat.id}
                        href={`/messages/${chat.id}`}
                        className="block bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors shadow-sm"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {/* Assuming users/me returns ID, we might need logic to show 'Other User' name. 
                                        For now, listing participants or generic title. 
                                        Ideal: Backend provides `other_participant_name` or similar.
                                        Fallback: "Sohbet"
                                    */}
                                    Sohbet
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                    {chat.last_message || "Henüz mesaj yok"}
                                </p>
                            </div>
                            {chat.last_message_time && (
                                <span className="text-xs text-gray-400">
                                    {new Date(chat.last_message_time).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
