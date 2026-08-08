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

export interface Transaction {
    id: string;
    buyer_id: string;
    seller_id: string;
    voucher_id: string;
    amount: number;
    commission: number;
    status: 'pending' | 'escrow' | 'completed' | 'refunded' | 'disputed';
    payment_method?: string;
    created_at: string;
    completed_at?: string;
    voucher?: Voucher;
    buyer?: User;
    seller?: User;
}

export interface UserVoucher {
    id: string;
    user_id: string;
    voucher_id: string;
    acquisition_type: 'bought' | 'traded' | 'received';
    is_redeemed: boolean;
    redeemed_at?: string;
    acquired_at: string;
    vouchers?: Voucher;
}

export interface Rating {
    id: string;
    trade_id: string;
    rater_id: string;
    rated_id: string;
    rating: number;
    review?: string;
    created_at: string;
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    challenge_type: 'daily' | 'weekly' | 'monthly' | 'milestone';
    reward_coins: number;
    requirement: Record<string, unknown>;
    start_date: string;
    end_date?: string;
    is_active: boolean;
}

export interface UserChallenge {
    id: string;
    user_id: string;
    challenge_id: string;
    progress: number;
    completed: boolean;
    completed_at?: string;
    created_at: string;
    challenge?: Challenge;
}

export interface Notification {
    id: string;
    user_id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    is_read: boolean;
    created_at: string;
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
