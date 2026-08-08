import { useState } from 'react';
import { Repeat, Sparkles, TrendingUp, ArrowRight, Star, Check } from 'lucide-react';
import { Voucher } from '../types';

interface ExchangeProps {
  onNavigate: (page: string) => void;
}

const myVouchers: Voucher[] = [
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
    voucher_code: 'AMZ-XXXX-1234',
    description: 'Valid for all categories',
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
    voucher_code: 'SPOT-XXXX-5678',
    description: '3-month premium subscription',
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
    voucher_code: 'SBUX-XXXX-9012',
    description: 'Redeemable at any location',
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
    voucher_code: 'NFLX-XXXX-1111',
    description: '6-month premium subscription',
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
    voucher_code: 'NIKE-XXXX-2222',
    description: 'Valid for online and in-store purchases',
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
    created_at: '2026-01-06',
    voucher_code: 'UBER-XXXX-3333',
    description: 'Valid for all Uber rides',
    matchScore: 82,
    reason: 'Similar value, expiring soon - act fast!',
  },
];

export default function Exchange({ onNavigate }: ExchangeProps) {
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [showMatches, setShowMatches] = useState(false);

  const handleFindMatches = () => {
    if (selectedVoucher) {
      setShowMatches(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-brand rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center space-x-4 mb-2">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
            <Repeat className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Smart Exchange</h1>
            <p className="text-white/90 text-lg">AI-powered voucher matching for the best trades</p>
          </div>
        </div>
      </div>

      <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft">
        <div className="flex items-start space-x-4">
          <Sparkles className="h-8 w-8 text-brand-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-main-text mb-2">How Smart Exchange Works</h3>
            <ul className="space-y-2 text-muted-text">
              <li className="flex items-start space-x-2">
                <Check className="h-5 w-5 text-status-success flex-shrink-0 mt-0.5" />
                <span>Select a voucher you want to trade</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="h-5 w-5 text-status-success flex-shrink-0 mt-0.5" />
                <span>Our AI finds the best matches based on value, brand popularity, and expiry</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="h-5 w-5 text-status-success flex-shrink-0 mt-0.5" />
                <span>Send trade requests to other users</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="h-5 w-5 text-status-success flex-shrink-0 mt-0.5" />
                <span>Complete the trade securely once accepted</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {!showMatches ? (
        <div className="space-y-4">
          <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft">
            <h2 className="text-xl font-bold text-main-text mb-4">Select a Voucher to Trade</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myVouchers.map(voucher => (
                <div
                  key={voucher.id}
                  onClick={() => setSelectedVoucher(voucher.id)}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${selectedVoucher === voucher.id
                    ? 'border-brand-primary bg-brand-primary/5 shadow-lg scale-105'
                    : 'border-main-border hover:border-brand-primary/30 hover:shadow-md bg-muted-bg/30'
                    }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-main-text">{voucher.brand_name}</h3>
                      <p className="text-sm text-dim">{voucher.category}</p>
                    </div>
                    {voucher.is_verified && (
                      <div className="bg-status-success text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-sm">
                        <Star className="h-3 w-3 fill-current" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-text">Value</span>
                      <span className="text-lg font-bold text-main-text">${voucher.original_value}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-text">Discount</span>
                      <span className="text-lg font-bold text-status-success">{voucher.discount_percentage}%</span>
                    </div>
                  </div>
                  {selectedVoucher === voucher.id && (
                    <div className="mt-4 text-center text-sm font-bold text-brand-primary">
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
            className="w-full bg-gradient-brand text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg"
          >
            <Sparkles className="h-5 w-5" />
            <span>Find Smart Matches</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-main-text">AI-Matched Vouchers</h2>
              <button
                onClick={() => setShowMatches(false)}
                className="text-sm text-brand-primary hover:underline font-bold"
              >
                ← Change Voucher
              </button>
            </div>
            <p className="text-muted-text mb-6">
              Based on your {myVouchers.find(v => v.id === selectedVoucher)?.brand_name} voucher, here are the best matches
            </p>

            <div className="space-y-4">
              {suggestedMatches.map(match => (
                <div
                  key={match.id}
                  className="bg-card border border-main-border rounded-xl p-6 hover:shadow-lg transition-all group shadow-soft"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-2xl font-bold text-main-text">{match.brand_name}</h3>
                        <div className="bg-gradient-brand text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-sm">
                          <TrendingUp className="h-3 w-3" />
                          <span>{match.matchScore}% Match</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-text mb-4 italic">"{match.reason}"</p>
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <span className="text-xs text-dim block mb-1">Original Value</span>
                          <div className="text-lg font-bold text-main-text">${match.original_value}</div>
                        </div>
                        <div>
                          <span className="text-xs text-dim block mb-1">Current Price</span>
                          <div className="text-lg font-bold text-brand-primary">${match.selling_price}</div>
                        </div>
                        <div>
                          <span className="text-xs text-dim block mb-1">Discount</span>
                          <div className="text-lg font-bold text-status-success">{match.discount_percentage}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-brand text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center space-x-2 shadow-md">
                    <span>Send Trade Request</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft">
        <h2 className="text-xl font-bold text-main-text mb-4">Recent Trade Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-status-success/10 rounded-lg border border-status-success/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-status-success rounded-full flex items-center justify-center shadow-sm">
                <Repeat className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-main-text">Netflix ⇄ Target</div>
                <div className="text-sm text-dim">Completed 2 days ago</div>
              </div>
            </div>
            <div className="text-status-success font-bold text-sm bg-status-success/10 px-3 py-1 rounded-full">Completed</div>
          </div>
          <div className="flex items-center justify-between p-4 bg-status-warning/10 rounded-lg border border-status-warning/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-status-warning rounded-full flex items-center justify-center shadow-sm">
                <Repeat className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-main-text">Spotify ⇄ Uber</div>
                <div className="text-sm text-dim">Pending response</div>
              </div>
            </div>
            <div className="text-status-warning font-bold text-sm bg-status-warning/10 px-3 py-1 rounded-full">Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
}
