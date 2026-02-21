import { useState } from 'react';
import { Wallet as WalletIcon, Star, Calendar, CheckCircle, Clock, Copy, Tag } from 'lucide-react';
import { Voucher } from '../types';

const activeVouchers: Voucher[] = [
  {
    id: 'wallet1',
    seller_id: 'currentUser',
    brand_name: 'Amazon',
    category: 'tech',
    original_value: 100,
    selling_price: 85,
    discount_percentage: 15,
    expiry_date: '2025-12-31',
    status: 'verified',
    is_verified: true,
    views: 245,
    created_at: '2025-10-01',
    voucher_code: 'AMZ-XXXX-1234',
    description: 'Valid for all categories',
  },
  {
    id: 'wallet2',
    seller_id: 'currentUser',
    brand_name: 'Starbucks',
    category: 'food',
    original_value: 50,
    selling_price: 40,
    discount_percentage: 20,
    expiry_date: '2025-11-15',
    status: 'verified',
    is_verified: true,
    views: 189,
    created_at: '2025-10-03',
    voucher_code: 'SBX-YYYY-5678',
    description: 'Redeemable at any location',
  },
  {
    id: 'wallet3',
    seller_id: 'currentUser',
    brand_name: 'Nike',
    category: 'fashion',
    original_value: 150,
    selling_price: 120,
    discount_percentage: 20,
    expiry_date: '2025-10-25',
    status: 'verified',
    is_verified: true,
    views: 156,
    created_at: '2025-10-05',
    voucher_code: 'NIKE-ZZZZ-9012',
    description: 'Valid online and in-store',
  },
];

const redeemedVouchers: Voucher[] = [
  {
    id: 'redeemed1',
    seller_id: 'currentUser',
    brand_name: 'Netflix',
    category: 'entertainment',
    original_value: 60,
    selling_price: 46.8,
    discount_percentage: 22,
    expiry_date: '2025-12-15',
    status: 'verified',
    is_verified: true,
    views: 223,
    created_at: '2025-09-15',
    description: 'Redeemed on Oct 5, 2025',
  },
  {
    id: 'redeemed2',
    seller_id: 'currentUser',
    brand_name: 'Spotify',
    category: 'entertainment',
    original_value: 30,
    selling_price: 24.6,
    discount_percentage: 18,
    expiry_date: '2025-11-30',
    status: 'verified',
    is_verified: true,
    views: 98,
    created_at: '2025-09-20',
    description: 'Redeemed on Oct 1, 2025',
  },
];

export default function Wallet() {
  const [activeTab, setActiveTab] = useState<'active' | 'redeemed'>('active');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCopyCode = (code: string, voucherId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(voucherId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const vouchers = activeTab === 'active' ? activeVouchers : redeemedVouchers;

  const totalValue = activeVouchers.reduce((sum, v) => sum + v.original_value, 0);
  const totalSavings = activeVouchers.reduce((sum, v) => sum + (v.original_value - v.selling_price), 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-brand rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center space-x-4 mb-2">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
            <WalletIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">My Wallet</h1>
            <p className="text-white/90 text-lg">Manage your vouchers and track your savings</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-text font-medium">Active Vouchers</span>
            <Tag className="h-5 w-5 text-brand-primary" />
          </div>
          <div className="text-3xl font-bold text-main-text">{activeVouchers.length}</div>
        </div>
        <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-text font-medium">Total Value</span>
            <Star className="h-5 w-5 text-brand-accent fill-brand-accent" />
          </div>
          <div className="text-3xl font-bold text-main-text">${totalValue}</div>
        </div>
        <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-text font-medium">Total Savings</span>
            <CheckCircle className="h-5 w-5 text-status-success" />
          </div>
          <div className="text-3xl font-bold text-status-success">${totalSavings.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-card backdrop-blur-sm rounded-xl border border-main-border overflow-hidden shadow-soft">
        <div className="flex bg-muted-bg/50 border-b border-main-border p-1 gap-1">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all ${activeTab === 'active'
                ? 'bg-gradient-brand text-white shadow-md'
                : 'text-muted-text hover:bg-card-hover'
              }`}
          >
            Active ({activeVouchers.length})
          </button>
          <button
            onClick={() => setActiveTab('redeemed')}
            className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all ${activeTab === 'redeemed'
                ? 'bg-gradient-brand text-white shadow-md'
                : 'text-muted-text hover:bg-card-hover'
              }`}
          >
            Redeemed ({redeemedVouchers.length})
          </button>
        </div>

        <div className="p-6 space-y-4">
          {vouchers.map(voucher => {
            const daysLeft = getDaysUntilExpiry(voucher.expiry_date);
            const isExpiringSoon = daysLeft <= 30;
            const isRedeemed = activeTab === 'redeemed';

            return (
              <div
                key={voucher.id}
                className={`bg-card border-2 rounded-xl p-6 transition-all ${isExpiringSoon && !isRedeemed
                    ? 'border-status-error/30 bg-status-error/5'
                    : 'border-main-border hover:shadow-lg'
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-main-text">{voucher.brand_name}</h3>
                      {voucher.is_verified && (
                        <div className="bg-status-success text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-sm">
                          <Star className="h-3 w-3 fill-current" />
                          <span>Verified</span>
                        </div>
                      )}
                      {isRedeemed && (
                        <div className="bg-dim text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3 fill-current" />
                          <span>Redeemed</span>
                        </div>
                      )}
                    </div>
                    <div className="inline-block bg-muted-bg text-main-text border border-main-border px-3 py-1 rounded-full text-xs font-medium mb-3">
                      {voucher.category}
                    </div>
                    <p className="text-sm text-muted-text mb-4">{voucher.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-xs text-dim block mb-1">Original Value</span>
                    <div className="text-lg font-bold text-main-text">${voucher.original_value}</div>
                  </div>
                  <div>
                    <span className="text-xs text-dim block mb-1">You Paid</span>
                    <div className="text-lg font-bold text-brand-primary">${voucher.selling_price}</div>
                  </div>
                  <div>
                    <span className="text-xs text-dim block mb-1">Saved</span>
                    <div className="text-lg font-bold text-status-success">
                      ${(voucher.original_value - voucher.selling_price).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-dim block mb-1">Expires</span>
                    <div className={`text-sm font-bold ${isExpiringSoon && !isRedeemed ? 'text-status-error text-xl animate-pulse' : 'text-main-text'}`}>
                      {isRedeemed ? 'Used' : `${daysLeft} days`}
                    </div>
                  </div>
                </div>

                {!isRedeemed && voucher.voucher_code && (
                  <div className="bg-muted-bg border border-main-border rounded-lg p-4 mb-4 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-dim block mb-1">Voucher Code</span>
                        <div className="text-lg font-mono font-bold text-main-text tracking-wider">{voucher.voucher_code}</div>
                      </div>
                      <button
                        onClick={() => handleCopyCode(voucher.voucher_code!, voucher.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-card hover:bg-card-hover text-brand-primary border border-brand-primary/20 rounded-lg font-bold text-sm transition-all shadow-sm"
                      >
                        <Copy className="h-4 w-4" />
                        <span>{copiedCode === voucher.id ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {isExpiringSoon && !isRedeemed && (
                  <div className="bg-status-error/10 border border-status-error/20 rounded-lg p-4 mb-4 flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-status-error animate-spin" style={{ animationDuration: '3s' }} />
                    <span className="text-sm text-status-error font-bold">
                      CRITICAL: This voucher expires in {daysLeft} days! Use it soon.
                    </span>
                  </div>
                )}

                {!isRedeemed && (
                  <div className="flex flex-wrap gap-3">
                    <button className="flex-1 min-w-[150px] bg-gradient-brand text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all shadow-md">
                      Redeem Now
                    </button>
                    <button className="px-6 py-3 bg-muted-bg text-main-text border border-main-border rounded-lg font-bold hover:bg-card-hover transition-all shadow-sm">
                      Trade
                    </button>
                    <button className="px-6 py-3 bg-muted-bg text-main-text border border-main-border rounded-lg font-bold hover:bg-card-hover transition-all shadow-sm">
                      Sell
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {vouchers.length === 0 && (
            <div className="text-center py-16">
              <WalletIcon className="h-16 w-16 text-dim/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-main-text mb-2">
                {activeTab === 'active' ? 'No active vouchers' : 'No redeemed vouchers'}
              </h3>
              <p className="text-muted-text">
                {activeTab === 'active' ? 'Start by buying or trading vouchers' : 'Redeemed vouchers will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
