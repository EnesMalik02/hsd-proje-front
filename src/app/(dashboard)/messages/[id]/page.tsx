"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { chatApi, authApi } from "@/lib/api";
import { MessageResponse, MessageCreate } from "@/lib/types";
import { Loader2, Send } from "lucide-react";

export default function ChatDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [messages, setMessages] = useState<MessageResponse[]>([]);
    const [chatMeta, setChatMeta] = useState<{
        listing_id?: string;
        listing_title?: string;
        listing_image?: string;
        other_user_name?: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Fetch current user ID to determine message alignment
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await authApi.getMe();
                setUserId(user.uid);
            } catch (err) {
                console.error("Failed to fetch user", err);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch messages
                const msgs = await chatApi.getChatMessages(id);
                setMessages(msgs);

                // Fetch chat metadata (listing info)
                // Since we don't have a direct getChatById, we fetch all chats and find this one
                // Optimally this should be a single endpoint, but we work with what we have.
                const myChats = await chatApi.getMyChats();
                const currentChat = myChats.find(c => c.id === id);

                if (currentChat) {
                    let otherUserName = "Kullanıcı";
                    // Try to resolve other user name if we have userId (me)
                    if (userId) {
                        const otherId = currentChat.participants.find(p => p !== userId);
                        if (otherId) {
                            try {
                                const u = await authApi.getUser(otherId);
                                otherUserName = u.display_name || u.username || "Kullanıcı";
                            } catch (e) { console.error(e); }
                        }
                    }

                    setChatMeta({
                        listing_id: currentChat.listing_id,
                        listing_title: currentChat.listing_title,
                        listing_image: currentChat.listing_image,
                        other_user_name: otherUserName
                    });
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) { // Wait for userId to be set to fetch meta correctly
            fetchData();
        }

        // Poll for new messages every 5 seconds
        const interval = setInterval(async () => {
            try {
                const msgs = await chatApi.getChatMessages(id);
                setMessages(msgs);
            } catch (e) { console.error(e); }
        }, 5000);

        return () => clearInterval(interval);
    }, [id, userId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !userId) return;

        const tempId = `temp-${Date.now()}`;
        const tempMsg: MessageResponse = {
            id: tempId,
            text: newMessage,
            type: "text",
            sender_id: userId,
            created_at: new Date().toISOString()
        };

        // Optimistic update
        setMessages(prev => [...prev, tempMsg]);
        setNewMessage("");
        setSending(true);

        try {
            const payload: MessageCreate = {
                text: tempMsg.text,
                type: "text"
            };
            const sentMsg = await chatApi.sendMessage(id, payload);

            // Replace temp message with real one
            setMessages(prev => prev.map(m => m.id === tempId ? sentMsg : m));
        } catch (err) {
            console.error("Failed to send message", err);
            // Revert on failure
            setMessages(prev => prev.filter(m => m.id !== tempId));
            alert("Mesaj gönderilemedi.");
            setNewMessage(tempMsg.text || ""); // Restore text
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-130px)] max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden my-4">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between shadow-sm relative z-10">
                <div
                    onClick={() => chatMeta?.listing_id && router.push(`/listings/${chatMeta.listing_id}`)}
                    className={`flex items-center gap-3 ${chatMeta?.listing_id ? 'cursor-pointer hover:bg-gray-50 p-2 -ml-2 rounded-xl transition-colors' : ''}`}
                >
                    {chatMeta?.listing_image ? (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                            <img src={chatMeta.listing_image} alt="Product" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                            <span className="text-xs">No Img</span>
                        </div>
                    )}

                    <div>
                        <h2 className="font-bold text-lg text-gray-900 leading-tight">
                            {chatMeta?.other_user_name || "Sohbet"}
                        </h2>
                        {chatMeta?.listing_title && (
                            <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                                {chatMeta.listing_title}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-gray-500 text-sm">
                        Henüz mesaj yok. İlk mesajı siz atın!
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === userId;
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] rounded-2xl px-5 py-3 text-sm shadow-sm ${isMe
                                        ? 'bg-red-600 text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                        }`}
                                >
                                    <p className="font-medium">{msg.text}</p>
                                    <span className={`text-[10px] block mt-1.5 font-medium opacity-70 ${isMe ? 'text-white' : 'text-gray-500'}`}>
                                        {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Bir mesaj yazın..."
                        className="flex-1 rounded-full border-2 border-gray-100 bg-gray-50 px-6 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-0 transition-all font-medium"
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="p-3 rounded-full bg-red-600 text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-red-500/25 active:scale-95"
                    >
                        {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </button>
                </div>
            </form>
        </div>
    );
}
