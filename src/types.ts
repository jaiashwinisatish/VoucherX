export interface User {
    id: string;
    email?: string;
    full_name: string;
    username: string;
    avatar_url?: string;
    bio?: string;
    rating: number;
    total_trades: number;
    voucher_coins: number;
    is_admin: boolean;
    follower_count?: number;
    following_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Voucher {
    id: string;
    seller_id: string;
    brand_name: string;
    category: string;
    original_value: number;
    selling_price: number;
    discount_percentage: number;
    voucher_code: string;
    expiry_date: string;
    status: 'pending_verification' | 'verified' | 'active' | 'sold' | 'expired';
    is_verified: boolean;
    proof_url?: string;
    description?: string;
    views: number;
    created_at: string;
    seller?: User;
}

export interface Trade {
    id: string;
    initiator_id: string;
    recipient_id: string;
    initiator_voucher_id: string;
    recipient_voucher_id?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
    match_score: number;
    created_at: string;
    completed_at?: string;
    initiator?: User;
    recipient?: User;
    initiator_voucher?: Voucher;
    recipient_voucher?: Voucher;
}

export interface WishlistItem {
    id: string;
    user_id: string;
    brand_name: string;
    category: string;
    max_price?: number;
    notify: boolean;
    created_at: string;
}

export interface Follow {
    id: string;
    follower_id: string;
    following_id: string;
    created_at: string;
    follower?: User;
    following?: User;
}

export interface Review {
    id: string;
    trade_id: string;
    rater_id: string;
    rated_id: string;
    rating: number;
    review?: string;
    created_at: string;
    rater?: User;
    rated?: User;
    trade?: Trade;
}

export interface CommunityThread {
    id: string;
    author_id: string;
    title: string;
    content: string;
    is_pinned: boolean;
    is_locked: boolean;
    reply_count: number;
    view_count: number;
    last_reply_at?: string;
    created_at: string;
    updated_at: string;
    author?: User;
}

export interface ThreadReply {
    id: string;
    thread_id: string;
    author_id: string;
    content: string;
    parent_reply_id?: string;
    created_at: string;
    updated_at: string;
    author?: User;
    parent_reply?: ThreadReply;
}

export interface TradeShare {
    id: string;
    trade_id: string;
    shared_by_id: string;
    share_platform: 'twitter' | 'linkedin' | 'copy_link';
    created_at: string;
}
