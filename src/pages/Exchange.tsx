import { useState } from 'react';
import { Repeat, Sparkles, TrendingUp, ArrowRight, Star, Check, Plus, X, Tag, Calendar, DollarSign, MessageSquare } from 'lucide-react';
import { Voucher } from '../types';

interface ExchangeProps {
  onNavigate: (page: string) => void;
}

const defaultVouchers: Voucher[] = [
  {
    id: 'my1',
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
  },
  {
    id: 'my2',
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
    created_at: '2025-10-07',
  },
  {
    id: 'my3',
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
  },
];

const suggestedMatches: (Voucher & { matchScore: number; reason: string })[] = [
  {
    id: 'match1',
    seller_id: 'user7',
    brand_name: 'Netflix',
    category: 'entertainment',
    original_value: 60,
    selling_price: 46.8,
    discount_percentage: 22,
    expiry_date: '2025-12-15',
    status: 'verified',
    is_verified: true,
    views: 223,
    created_at: '2025-10-08',
    matchScore: 95,
    reason: 'Perfect match for entertainment lovers!',
  },
  {
    id: 'match2',
    seller_id: 'user8',
    brand_name: 'Nike',
    category: 'fashion',
    original_value: 120,
    selling_price: 90,
    discount_percentage: 25,
    expiry_date: '2025-12-20',
    status: 'verified',
    is_verified: true,
    views: 312,
    created_at: '2025-10-05',
    matchScore: 88,
    reason: 'Great value and high demand brand',
  },
  {
    id: 'match3',
    seller_id: 'user9',
    brand_name: 'Uber',
    category: 'travel',
    original_value: 75,
    selling_price: 52.5,
    discount_percentage: 30,
    expiry_date: '2025-10-20',
    status: 'verified',
    is_verified: true,
    views: 156,
    created_at: '2025-10-06',
    matchScore: 82,
    reason: 'Similar value, expiring soon - act fast!',
  },
];

const CATEGORIES = ['tech', 'entertainment', 'food', 'fashion', 'travel', 'health', 'education', 'other'];

export default function Exchange({ onNavigate }: ExchangeProps) {
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [showMatches, setShowMatches] = useState(false);
  const [customVouchers, setCustomVouchers] = useState<Voucher[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    brand_name: '',
    category: 'tech',
    original_value: '',
    discount_percentage: '',
    expiry_date: '',
    description: '',
  });
  const [formError, setFormError] = useState('');

  const myVouchers = [...defaultVouchers, ...customVouchers];

  const handleCreateVoucher = () => {
    setFormError('');

    if (!formData.brand_name.trim()) {
      setFormError('Brand name is required.');
      return;
    }
    if (!formData.original_value || Number(formData.original_value) <= 0) {
      setFormError('Please enter a valid voucher value.');
      return;
    }
    if (!formData.discount_percentage || Number(formData.discount_percentage) < 0 || Number(formData.discount_percentage) > 100) {
      setFormError('Discount must be between 0 and 100.');
      return;
    }
    if (!formData.expiry_date) {
      setFormError('Expiry date is required.');
      return;
    }
    if (new Date(formData.expiry_date) <= new Date()) {
      setFormError('Expiry date must be in the future.');
      return;
    }

    const value = Number(formData.original_value);
    const discount = Number(formData.discount_percentage);

    const newVoucher: Voucher = {
      id: `custom-${Date.now()}`,
      seller_id: 'currentUser',
      brand_name: formData.brand_name.trim(),
      category: formData.category,
      original_value: value,
      selling_price: Number((value * (1 - discount / 100)).toFixed(2)),
      discount_percentage: discount,
      voucher_code: '',
      expiry_date: formData.expiry_date,
      status: 'active',
      is_verified: false,
      description: formData.description.trim() || undefined,
      views: 0,
      created_at: new Date().toISOString().split('T')[0],
    };

    setCustomVouchers(prev => [...prev, newVoucher]);
    setFormData({ brand_name: '', category: 'tech', original_value: '', discount_percentage: '', expiry_date: '', description: '' });
    setShowCreateModal(false);
  };

  const handleFindMatches = () => {
    if (selectedVoucher) {
      setShowMatches(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Repeat className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Smart Exchange</h1>
            <p className="text-white/90 text-lg">AI-powered voucher matching for the best trades</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
        <div className="flex items-start space-x-4">
          <Sparkles className="h-8 w-8 text-teal-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">How Smart Exchange Works</h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start space-x-2">
                <Check className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <span>Select a voucher you want to trade</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <span>Our AI finds the best matches based on value, brand popularity, and expiry</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <span>Send trade requests to other users</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <span>Complete the trade securely once accepted</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {!showMatches ? (
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Select a Voucher to Trade</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Create Custom Voucher</span>
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myVouchers.map(voucher => (
                <div
                  key={voucher.id}
                  onClick={() => setSelectedVoucher(voucher.id)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedVoucher === voucher.id
                      ? 'border-teal-500 bg-teal-50 shadow-lg scale-105'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">{voucher.brand_name}</h3>
                      <p className="text-sm text-slate-600">{voucher.category}</p>
                    </div>
                    {voucher.is_verified && (
                      <div className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-current" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Value</span>
                      <span className="text-lg font-bold text-slate-800">${voucher.original_value}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Discount</span>
                      <span className="text-lg font-bold text-emerald-600">{voucher.discount_percentage}%</span>
                    </div>
                  </div>
                  {selectedVoucher === voucher.id && (
                    <div className="mt-4 text-center text-sm font-semibold text-teal-600">
                      ✓ Selected for Trade
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleFindMatches}
            disabled={!selectedVoucher}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            <Sparkles className="h-5 w-5" />
            <span>Find Smart Matches</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">AI-Matched Vouchers</h2>
              <button
                onClick={() => setShowMatches(false)}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                ← Change Voucher
              </button>
            </div>
            <p className="text-slate-600 mb-6">
              Based on your {myVouchers.find(v => v.id === selectedVoucher)?.brand_name} voucher, here are the best matches
            </p>

            <div className="space-y-4">
              {suggestedMatches.map(match => (
                <div
                  key={match.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-2xl font-semibold text-slate-800">{match.brand_name}</h3>
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{match.matchScore}% Match</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{match.reason}</p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-xs text-slate-500">Original Value</span>
                          <div className="text-lg font-bold text-slate-800">${match.original_value}</div>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500">Current Price</span>
                          <div className="text-lg font-bold text-teal-600">${match.selling_price}</div>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500">Discount</span>
                          <div className="text-lg font-bold text-emerald-600">{match.discount_percentage}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                    <span>Send Trade Request</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Voucher Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-5 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Create Custom Voucher</h3>
                  <p className="text-white/80 text-xs">Add your own voucher for trading</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {formError}
                </div>
              )}

              {/* Brand Name */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                  <Tag className="h-4 w-4 text-slate-500" />
                  <span>Brand / Voucher Name *</span>
                </label>
                <input
                  type="text"
                  value={formData.brand_name}
                  onChange={e => setFormData({ ...formData, brand_name: e.target.value })}
                  placeholder="e.g. Amazon, Starbucks, Custom Gift Card"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                  <Star className="h-4 w-4 text-slate-500" />
                  <span>Category *</span>
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white capitalize"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Value & Discount Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                    <DollarSign className="h-4 w-4 text-slate-500" />
                    <span>Value ($) *</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.original_value}
                    onChange={e => setFormData({ ...formData, original_value: e.target.value })}
                    placeholder="100"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                    <TrendingUp className="h-4 w-4 text-slate-500" />
                    <span>Discount (%) *</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={e => setFormData({ ...formData, discount_percentage: e.target.value })}
                    placeholder="15"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Computed Selling Price Preview */}
              {formData.original_value && formData.discount_percentage && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 text-sm">
                  <span className="text-slate-600">Selling Price: </span>
                  <span className="font-bold text-teal-700">
                    ${(Number(formData.original_value) * (1 - Number(formData.discount_percentage) / 100)).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Expiry Date */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>Expiry Date *</span>
                </label>
                <input
                  type="date"
                  value={formData.expiry_date}
                  onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Description (Optional) */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                  <MessageSquare className="h-4 w-4 text-slate-500" />
                  <span>Description / Message (optional)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add any details about the voucher..."
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateVoucher}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Voucher</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Trade Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <Repeat className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-slate-800">Netflix ⇄ Target</div>
                <div className="text-sm text-slate-600">Completed 2 days ago</div>
              </div>
            </div>
            <div className="text-emerald-600 font-semibold">Completed</div>
          </div>
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                <Repeat className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-slate-800">Spotify ⇄ Uber</div>
                <div className="text-sm text-slate-600">Pending response</div>
              </div>
            </div>
            <div className="text-amber-600 font-semibold">Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
}
