

export interface Location {
    lat: number;
    lng: number;
    city: string;
    district: string;
}

export interface ListingCreate {
    title: string;
    description: string;
    images: string[];
    category: string;
    type: string;
    price: number;
    currency: string;
    location: Location;
    status: string;
    phone_number?: string;
}

export interface ListingResponse {
    title: string;
    description: string;
    images: string[];
    category: string;
    type: string;
    price: number;
    currency: string;
    location: Location;
    status: string;
    id: string;
    owner_id: string;
    owner_name: string;
    owner_avatar?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    phone_number?: string;
}

export interface UserUpdate {
    display_name?: string | null;
    username?: string | null;
    photo_url?: string | null;
    bio?: string | null;
    fcm_token?: string | null;
    verification_doc?: string | null;
    location?: Location | null;
}

export interface UserLogin {
    identifier: string;
    password: string;
}

export interface UserRegister {
    email: string;
    username: string;
    password: string;
    display_name: string;
}

export interface Token {
    access_token: string;
    token_type: string;
}

export interface UserResponse {
    email: string;
    display_name: string;
    username: string;
    photo_url?: string | null;
    role?: string;
    bio?: string | null;
    fcm_token?: string | null;
    verification_doc?: string | null;
    location?: Location | null;
    uid: string;
    is_verified?: boolean;
    stats?: UserStats;
    created_at?: string | null;
}

export interface UserStats {
    carbon_saved?: number;
    items_donated?: number;
    items_received?: number;
}

export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface HTTPValidationError {
    detail: ValidationError[];
}

export interface ChatListResponse {
    id: string;
    participants: string[];
    listing_id: string;
    status: string;
    last_message?: string | null;
    last_message_time?: string | null;
    unread_count?: Record<string, number>;
    listing_title?: string;
    listing_image?: string;
}

export interface ChatStart {
    listing_id: string;
}

export interface MessageResponse {
    text?: string | null;
    type: string;
    media_url?: string | null;
    id: string;
    sender_id: string;
    created_at?: string | null;
}

export interface MessageCreate {
    text?: string | null;
    type?: string;
    media_url?: string | null;
}

export interface District {
    id: number;
    name: string;
}

export interface Province {
    id: number;
    name: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    districts: District[];
}

export interface ProvinceApiResponse {
    status: string;
    data: Province[];
}


export interface RequestCreate {
    listing_id: string;
    message: string;
}

export interface RequestUpdate {
    status: string;
}

export interface ListingSnapshot {
    title: string;
    image?: string | null;
    price: number;
}

export interface RequestResponse {
    listing_id: string;
    message: string;
    id: string;
    requester_id: string;
    requester_name: string;
    requester_avatar?: string | null;
    requester_role: string;
    seller_id: string;
    listing_snapshot: ListingSnapshot;
    status: string;
    created_at?: string | null;
}

export interface NotificationResponse {
    recipient_id: string;
    type: string;
    title: string;
    body: string;
    related_item_id?: string | null;
    id: string;
    is_read: boolean;
    created_at?: string | null;
}
