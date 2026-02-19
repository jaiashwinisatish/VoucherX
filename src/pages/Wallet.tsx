import { useState } from 'react';
import { Wallet as WalletIcon, Star, Calendar, CheckCircle, Clock, Copy, Tag, Plus } from 'lucide-react';
import { Voucher } from '../types';
import AddVoucherModal from '../components/AddVoucherModal';

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
  const [showAddModal, setShowAddModal] = useState(false);

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
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <WalletIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">My Wallet</h1>
              <p className="text-white/90 text-lg">Manage your vouchers and track your savings</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <Plus className="h-5 w-5" />
            <span>Add Voucher</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600">Active Vouchers</span>
            <Tag className="h-5 w-5 text-teal-600" />
          </div>
          <div className="text-3xl font-bold text-slate-800">{activeVouchers.length}</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600">Total Value</span>
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl font-bold text-slate-800">${totalValue}</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600">Total Savings</span>
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-emerald-600">${totalSavings.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === 'active'
              ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            Active ({activeVouchers.length})
          </button>
          <button
            onClick={() => setActiveTab('redeemed')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === 'redeemed'
              ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
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
                className={`bg-white border-2 rounded-xl p-6 transition-all ${isExpiringSoon && !isRedeemed
                  ? 'border-red-300 bg-red-50'
                  : 'border-slate-200 hover:shadow-lg'
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-slate-800">{voucher.brand_name}</h3>
                      {voucher.is_verified && (
                        <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-current" />
                          <span>Verified</span>
                        </div>
                      )}
                      {isRedeemed && (
                        <div className="bg-slate-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3 fill-current" />
                          <span>Redeemed</span>
                        </div>
                      )}
                    </div>
                    <div className="inline-block bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                      {voucher.category}
                    </div>
                    <p className="text-sm text-slate-600 mb-4">{voucher.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Original Value</span>
                    <div className="text-lg font-bold text-slate-800">${voucher.original_value}</div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">You Paid</span>
                    <div className="text-lg font-bold text-teal-600">${voucher.selling_price}</div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Saved</span>
                    <div className="text-lg font-bold text-emerald-600">
                      ${(voucher.original_value - voucher.selling_price).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Expires</span>
                    <div className={`text-sm font-bold ${isExpiringSoon && !isRedeemed ? 'text-red-600' : 'text-slate-800'}`}>
                      {isRedeemed ? 'Used' : `${daysLeft} days`}
                    </div>
                  </div>
                </div>

                {!isRedeemed && voucher.voucher_code && (
                  <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500 block mb-1">Voucher Code</span>
                        <div className="text-lg font-mono font-bold text-slate-800">{voucher.voucher_code}</div>
                      </div>
                      <button
                        onClick={() => handleCopyCode(voucher.voucher_code!, voucher.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 text-teal-600 rounded-lg font-medium text-sm transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                        <span>{copiedCode === voucher.id ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {isExpiringSoon && !isRedeemed && (
                  <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4 flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-red-800 font-medium">
                      This voucher expires in {daysLeft} days! Use it soon.
                    </span>
                  </div>
                )}

                {!isRedeemed && (
                  <div className="flex flex-wrap gap-3">
                    <button className="flex-1 min-w-[150px] bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                      Redeem Now
                    </button>
                    <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
                      Trade
                    </button>
                    <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
                      Sell
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {vouchers.length === 0 && (
            <div className="text-center py-16">
              <WalletIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                {activeTab === 'active' ? 'No active vouchers' : 'No redeemed vouchers'}
              </h3>
              <p className="text-slate-600">
                {activeTab === 'active' ? 'Start by buying or trading vouchers' : 'Redeemed vouchers will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>

      <AddVoucherModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          // Optionally refresh vouchers list here
          console.log('Voucher added successfully!');
        }}
      />
    </div>
  );
}
