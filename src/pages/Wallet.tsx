import { useState } from 'react';
import { Wallet as WalletIcon, Star, Calendar, CheckCircle, Clock, Copy, Tag, TrendingUp, ArrowRight, Repeat, ShoppingBag, Shield } from 'lucide-react';
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

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  tech: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  food: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  fashion: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  entertainment: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

const brandGradients: Record<string, string> = {
  Amazon: 'from-amber-400 to-orange-500',
  Starbucks: 'from-green-500 to-emerald-600',
  Nike: 'from-slate-700 to-slate-900',
  Netflix: 'from-red-500 to-red-700',
  Spotify: 'from-green-400 to-green-600',
};

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

  const getExpiryStatus = (daysLeft: number) => {
    if (daysLeft <= 0) return { label: 'Expired', color: 'text-red-700 bg-red-100' };
    if (daysLeft <= 7) return { label: `${daysLeft}d left`, color: 'text-red-700 bg-red-100' };
    if (daysLeft <= 30) return { label: `${daysLeft}d left`, color: 'text-amber-700 bg-amber-100' };
    return { label: `${daysLeft}d left`, color: 'text-emerald-700 bg-emerald-100' };
  };

  const handleCopyCode = (code: string, voucherId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(voucherId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const vouchers = activeTab === 'active' ? activeVouchers : redeemedVouchers;

  const totalValue = activeVouchers.reduce((sum, v) => sum + v.original_value, 0);
  const totalSavings = activeVouchers.reduce((sum, v) => sum + (v.original_value - v.selling_price), 0);
  const totalRedeemed = redeemedVouchers.reduce((sum, v) => sum + v.original_value, 0);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-teal-500 via-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-10 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-18 h-18 bg-white/15 backdrop-blur-md rounded-2xl p-4 ring-2 ring-white/20">
              <WalletIcon className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">My Wallet</h1>
              <p className="text-blue-100 text-base sm:text-lg mt-1">Manage your vouchers and track your savings</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md rounded-xl px-5 py-3 ring-1 ring-white/20">
            <TrendingUp className="h-5 w-5 text-emerald-300" />
            <span className="text-sm font-semibold">
              You've saved <span className="text-emerald-300">${totalSavings.toFixed(2)}</span> total
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Active</span>
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
              <Tag className="h-5 w-5 text-teal-600" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-800">{activeVouchers.length}</div>
          <p className="text-xs text-slate-400 mt-1">vouchers</p>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Total Value</span>
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-800">${totalValue}</div>
          <p className="text-xs text-slate-400 mt-1">in vouchers</p>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Savings</span>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">${totalSavings.toFixed(2)}</div>
          <p className="text-xs text-slate-400 mt-1">money saved</p>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Redeemed</span>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-800">${totalRedeemed}</div>
          <p className="text-xs text-slate-400 mt-1">value used</p>
        </div>
      </div>

      {/* Tab Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Tab Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 px-6 py-4 font-semibold text-sm sm:text-base transition-all relative ${
              activeTab === 'active'
                ? 'text-teal-700 bg-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Active ({activeVouchers.length})</span>
            </span>
            {activeTab === 'active' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('redeemed')}
            className={`flex-1 px-6 py-4 font-semibold text-sm sm:text-base transition-all relative ${
              activeTab === 'redeemed'
                ? 'text-teal-700 bg-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Redeemed ({redeemedVouchers.length})</span>
            </span>
            {activeTab === 'redeemed' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-600"></div>
            )}
          </button>
        </div>

        {/* Voucher List */}
        <div className="p-4 sm:p-6 space-y-5">
          {vouchers.map(voucher => {
            const daysLeft = getDaysUntilExpiry(voucher.expiry_date);
            const isExpiringSoon = daysLeft <= 30;
            const isRedeemed = activeTab === 'redeemed';
            const expiryStatus = getExpiryStatus(daysLeft);
            const catColor = categoryColors[voucher.category] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
            const brandGradient = brandGradients[voucher.brand_name] || 'from-slate-500 to-slate-700';

            return (
              <div
                key={voucher.id}
                className={`group relative bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  isExpiringSoon && !isRedeemed
                    ? 'border-red-200 hover:border-red-300'
                    : isRedeemed
                    ? 'border-slate-200 opacity-90 hover:opacity-100'
                    : 'border-slate-200 hover:border-teal-300 hover:-translate-y-0.5'
                }`}
              >
                {/* Brand color bar */}
                <div className={`h-1.5 bg-gradient-to-r ${brandGradient}`}></div>

                <div className="p-5 sm:p-6">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${brandGradient} rounded-xl flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-lg">{voucher.brand_name[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center flex-wrap gap-2">
                          <h3 className="text-xl font-bold text-slate-800">{voucher.brand_name}</h3>
                          {voucher.is_verified && (
                            <div className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center space-x-1">
                              <Shield className="h-3 w-3" />
                              <span>Verified</span>
                            </div>
                          )}
                          {isRedeemed && (
                            <div className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center space-x-1">
                              <CheckCircle className="h-3 w-3" />
                              <span>Redeemed</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-block ${catColor.bg} ${catColor.text} border ${catColor.border} px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                            {voucher.category}
                          </span>
                          {!isRedeemed && (
                            <span className={`inline-block ${expiryStatus.color} px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                              <Clock className="h-3 w-3 inline -mt-0.5 mr-1" />
                              {expiryStatus.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-sm text-slate-400">Discount</div>
                      <div className="text-2xl font-extrabold text-teal-600">-{voucher.discount_percentage}%</div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 mb-5">{voucher.description}</p>

                  {/* Value Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    <div className="bg-slate-50 rounded-xl p-3 text-center hover:bg-slate-100 transition-colors">
                      <span className="text-xs text-slate-400 block mb-0.5">Original</span>
                      <div className="text-lg font-bold text-slate-800">${voucher.original_value}</div>
                    </div>
                    <div className="bg-teal-50 rounded-xl p-3 text-center hover:bg-teal-100 transition-colors">
                      <span className="text-xs text-teal-500 block mb-0.5">You Paid</span>
                      <div className="text-lg font-bold text-teal-700">${voucher.selling_price}</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3 text-center hover:bg-emerald-100 transition-colors">
                      <span className="text-xs text-emerald-500 block mb-0.5">Saved</span>
                      <div className="text-lg font-bold text-emerald-700">
                        ${(voucher.original_value - voucher.selling_price).toFixed(2)}
                      </div>
                    </div>
                    <div className={`rounded-xl p-3 text-center transition-colors ${
                      isRedeemed ? 'bg-purple-50 hover:bg-purple-100' : 'bg-blue-50 hover:bg-blue-100'
                    }`}>
                      <span className={`text-xs block mb-0.5 ${isRedeemed ? 'text-purple-500' : 'text-blue-500'}`}>
                        {isRedeemed ? 'Status' : 'Expires'}
                      </span>
                      <div className={`text-sm font-bold ${isRedeemed ? 'text-purple-700' : isExpiringSoon ? 'text-red-600' : 'text-blue-700'}`}>
                        {isRedeemed ? 'Used' : new Date(voucher.expiry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {/* Voucher Code */}
                  {!isRedeemed && voucher.voucher_code && (
                    <div className="bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 rounded-xl p-4 mb-5 border border-dashed border-slate-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 block mb-1">Voucher Code</span>
                          <div className="text-lg font-mono font-bold text-slate-800 tracking-wider">{voucher.voucher_code}</div>
                        </div>
                        <button
                          onClick={() => handleCopyCode(voucher.voucher_code!, voucher.id)}
                          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                            copiedCode === voucher.id
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                              : 'bg-white hover:bg-teal-50 text-teal-600 border border-slate-200 hover:border-teal-300 hover:shadow-md'
                          }`}
                        >
                          <Copy className="h-4 w-4" />
                          <span>{copiedCode === voucher.id ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Expiry Warning */}
                  {isExpiringSoon && !isRedeemed && (
                    <div className={`rounded-xl p-3.5 mb-5 flex items-center space-x-3 ${
                      daysLeft <= 7
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-amber-50 border border-amber-200'
                    }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        daysLeft <= 7 ? 'bg-red-100' : 'bg-amber-100'
                      }`}>
                        <Clock className={`h-4 w-4 ${daysLeft <= 7 ? 'text-red-600' : 'text-amber-600'}`} />
                      </div>
                      <span className={`text-sm font-medium ${daysLeft <= 7 ? 'text-red-800' : 'text-amber-800'}`}>
                        {daysLeft <= 7
                          ? `Expires in ${daysLeft} days! Use it before it's gone.`
                          : `Expires in ${daysLeft} days. Plan to use it soon.`
                        }
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!isRedeemed && (
                    <div className="flex flex-wrap gap-3">
                      <button className="flex-1 min-w-[140px] bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Redeem Now</span>
                      </button>
                      <button className="px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-teal-50 hover:text-teal-700 hover:shadow-md transition-all duration-200 flex items-center space-x-2">
                        <Repeat className="h-4 w-4" />
                        <span>Trade</span>
                      </button>
                      <button className="px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-blue-50 hover:text-blue-700 hover:shadow-md transition-all duration-200 flex items-center space-x-2">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Sell</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {vouchers.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <WalletIcon className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                {activeTab === 'active' ? 'No active vouchers' : 'No redeemed vouchers'}
              </h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                {activeTab === 'active'
                  ? 'Head to the Marketplace to discover great deals on vouchers.'
                  : 'Once you redeem a voucher, it will appear here for your records.'}
              </p>
              {activeTab === 'active' && (
                <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                  <span>Browse Marketplace</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
