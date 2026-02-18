import { useState } from 'react';
import { Repeat, Sparkles, TrendingUp, ArrowRight, Star, Check } from 'lucide-react';
import { Voucher } from '../types';

const myVouchers: Voucher[] = [
  {
    id: 'my1',
    seller_id: 'currentUser',
    brand_name: 'Amazon',
    category: 'tech',
    original_value: 100,
    selling_price: 85,
    discount_percentage: 15,
    voucher_code: 'AMAZ85301',
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
    voucher_code: 'SPOT24302',
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
    voucher_code: 'STAR40303',
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
    voucher_code: 'NETF46301',
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
    voucher_code: 'NIKE90302',
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
    voucher_code: 'UBER52303',
    expiry_date: '2025-10-20',
    status: 'verified',
    is_verified: true,
    views: 156,
    created_at: '2025-10-06',
    matchScore: 82,
    reason: 'Similar value, expiring soon - act fast!',
  },
];

export default function Exchange(): JSX.Element {
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [showMatches, setShowMatches] = useState(false);

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
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Select a Voucher to Trade</h2>
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
