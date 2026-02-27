export interface User {
    id: string;
    email?: string;
    full_name: string;
    username: string;
    avatar_url?: string;
    rating: number;
    total_trades: number;
    voucher_coins: number;
    is_admin: boolean;
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
    voucher_code?: string;
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
