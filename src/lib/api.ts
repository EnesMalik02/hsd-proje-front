import { UserLogin, UserRegister, Token, UserResponse, ListingCreate, ListingResponse, UserUpdate, ChatListResponse, MessageResponse, MessageCreate } from "./types";

const API_URL = "https://hsd-proje.onrender.com";

// Helper to set cookie
function setCookie(name: string, value: string, days: number) {
    if (typeof window === "undefined") return;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
}

// Helper to delete cookie
function deleteCookie(name: string) {
    if (typeof window === "undefined") return;
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export class ApiError extends Error {
    status: number;
    data: any;

    constructor(status: number, data: any) {
        super(`API Error: ${status}`);
        this.status = status;
        this.data = data;
    }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as any),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(response.status, errorData);
    }

    return response.json();
}

export const authApi = {
    login: async (data: UserLogin): Promise<Token> => {
        const res = await request<Token>("/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        });
        if (typeof window !== "undefined") {
            localStorage.setItem("access_token", res.access_token);
            setCookie("access_token", res.access_token, 7);
        }
        return res;
    },

    register: async (data: UserRegister): Promise<Token> => {
        const res = await request<Token>("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        });
        if (typeof window !== "undefined") {
            localStorage.setItem("access_token", res.access_token);
            setCookie("access_token", res.access_token, 7);
        }
        return res;
    },

    getMe: async (): Promise<UserResponse> => {
        return request<UserResponse>("/users/me", {
            method: "GET",
        });
    },

    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            deleteCookie("access_token");
        }
    },

    createListing: async (data: ListingCreate): Promise<ListingResponse> => {
        return request<ListingResponse>("/listings/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    updateMe: async (data: UserUpdate): Promise<UserResponse> => {
        return request<UserResponse>("/users/me", {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    getSuggestedListings: async (): Promise<ListingResponse[]> => {
        return request<ListingResponse[]>("/listings/suggested", {
            method: "GET",
        });
    },

    getListing: async (id: string): Promise<ListingResponse> => {
        return request<ListingResponse>(`/listings/${id}`, {
            method: "GET",
        });
    },

    getMyListings: async (): Promise<ListingResponse[]> => {
        return request<ListingResponse[]>("/listings/me", {
            method: "GET",
        });
    },

    updateListing: async (id: string, data: any): Promise<ListingResponse> => {
        return request<ListingResponse>(`/listings/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },
};

export const chatApi = {
    getMyChats: async (): Promise<ChatListResponse[]> => {
        return request<ChatListResponse[]>("/chats/", {
            method: "GET",
        });
    },

    getChatMessages: async (chatId: string): Promise<MessageResponse[]> => {
        return request<MessageResponse[]>(`/chats/${chatId}/messages`, {
            method: "GET",
        });
    },

    sendMessage: async (chatId: string, data: MessageCreate): Promise<MessageResponse> => {
        return request<MessageResponse>(`/chats/${chatId}/messages`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
};
