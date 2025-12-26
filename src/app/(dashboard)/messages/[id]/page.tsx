"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { chatApi, authApi } from "@/lib/api";
import { MessageResponse, MessageCreate } from "@/lib/types";
import { Loader2, Send } from "lucide-react";

export default function ChatDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [messages, setMessages] = useState<MessageResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
        const fetchMessages = async () => {
            try {
                const data = await chatApi.getChatMessages(id);
                setMessages(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
        // Poll for new messages every 5 seconds
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const payload: MessageCreate = {
                text: newMessage,
                type: "text"
            };
            const sentMsg = await chatApi.sendMessage(id, payload);
            setMessages(prev => [...prev, sentMsg]);
            setNewMessage("");
        } catch (err) {
            console.error("Failed to send message", err);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-130px)] max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden my-4">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h2 className="font-semibold text-gray-900 dark:text-white">Sohbet</h2>
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
                                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isMe
                                        ? 'bg-purple-600 text-white rounded-br-none'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
                                        }`}
                                >
                                    <p>{msg.text}</p>
                                    <span className={`text-[10px] block mt-1 ${isMe ? 'text-purple-200' : 'text-gray-500'}`}>
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
            <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Bir mesaj yazın..."
                        className="flex-1 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </button>
                </div>
            </form>
        </div>
    );
}
