
import { TrendingUp, Star, Tag, Calendar, Eye, Bot } from 'lucide-react';
import { Voucher } from '../types';

interface HomeProps {
  onNavigate: (page: string) => void;
  onOpenAI: () => void;
}

const featuredVouchers: Voucher[] = [
  {
    id: '1',
    seller_id: 'user1',
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
    description: 'Valid for all categories on Amazon',
  },
  {
    id: '2',
    seller_id: 'user2',
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
    description: 'Redeemable at any Starbucks location',
  },
  {
    id: '3',
    seller_id: 'user3',
    brand_name: 'Nike',
    category: 'fashion',
    original_value: 200,
    selling_price: 150,
    discount_percentage: 25,
    expiry_date: '2025-12-20',
    status: 'verified',
    is_verified: true,
    views: 312,
    created_at: '2025-10-05',
    description: 'Valid for online and in-store purchases',
  },
  {
    id: '4',
    seller_id: 'user4',
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
    description: 'Valid for Uber rides only',
  },
  {
    id: '5',
    seller_id: 'user5',
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
    description: '3-month premium subscription',
  },
  {
    id: '6',
    seller_id: 'user6',
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
    description: '6-month streaming subscription',
  },
];

const categories = [
  { name: 'Food & Dining', icon: '🍔', color: 'from-orange-500 to-red-500', count: 234 },
  { name: 'Fashion', icon: '👕', color: 'from-pink-500 to-purple-500', count: 189 },
  { name: 'Tech', icon: '💻', color: 'from-blue-500 to-cyan-500', count: 312 },
  { name: 'Travel', icon: '✈️', color: 'from-green-500 to-teal-500', count: 156 },
  { name: 'Entertainment', icon: '🎬', color: 'from-purple-500 to-pink-500', count: 198 },
  { name: 'Health', icon: '💊', color: 'from-emerald-500 to-green-500', count: 145 },
];

export default function Home({ onNavigate, onOpenAI }: HomeProps) {
  
  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-blue-600 to-purple-600 rounded-3xl p-12 text-white">
        <div className="relative z-10 max-w-3xl">
          <h1
            className="text-5xl md:text-6xl font-bold mb-6 text-white bg-gradient-to-r from-amber-400 via-orange-600 to-pink-600 bg-clip-text text-transparent transition-all duration-700 hover:scale-105 hover:from-pink-500 hover:to-amber-400 animate-pulse"
            style={{
              letterSpacing: '0.02em',
              cursor: 'pointer',
            }}
          >
            Don't Let Your Vouchers Expire
          </h1>
          <p className="text-xl mb-8 text-white/90">
            Trade, buy, and sell vouchers with confidence. Get AI-powered recommendations and never miss a great deal.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('marketplace')}
              className="px-8 py-4 bg-white text-teal-600 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
            >
              Explore Marketplace
            </button>
            <button
              onClick={onOpenAI}
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center space-x-2"
            >
              <Bot className="h-5 w-5" />
              <span>Try AI Assistant</span>
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => onNavigate('marketplace')}
              // className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:scale-105 transition-all text-center group"
              className="
  relative overflow-hidden
  bg-white/70 dark:bg-blue-100/60
  backdrop-blur-xl
  rounded-2xl p-6
  text-center group
  transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
  hover:-translate-y-3 hover:scale-[1.05]
  hover:shadow-[0_30px_70px_-20px_rgba(16,185,129,0.35)]
"
            >
              <div className={`text-4xl mb-3 group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <h3 className="font-semibold text-slate-800 text-sm mb-1">{category.name}</h3>
              <p className="text-xs text-slate-600">{category.count} vouchers</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Featured Vouchers</h2>
            <p className="text-slate-600 mt-1">Handpicked deals just for you</p>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            View All →
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVouchers.map((voucher) => {
            const daysLeft = getDaysUntilExpiry(voucher.expiry_date);
            const isExpiringSoon = daysLeft <= 30;

            return (
              <div
                key={voucher.id}
                // className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-200 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
                className="
  relative overflow-hidden
  bg-white/80 dark:bg-blue-100/60
  backdrop-blur-xl
  rounded-2xl p-6
  text-center group
  transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
  hover:-translate-y-3 hover:scale-[1.05]
  hover:shadow-[0_30px_70px_-20px_rgba(16,185,129,0.35)]
"
              >
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 p-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                      {voucher.brand_name}
                    </div>
                    <div className="inline-block bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium text-slate-700">
                      {voucher.category}
                    </div>
                  </div>

                  {voucher.is_verified && (
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current" />
                      <span>Verified</span>
                    </div>
                  )}

                  {isExpiringSoon && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                      {daysLeft} days left
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px]">
                    {voucher.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs text-slate-500">Original Price</div>
                      <div className="text-lg font-bold text-slate-400 line-through">
                        ${voucher.original_value}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Your Price</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                        ${voucher.selling_price}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">You Save</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-emerald-600">
                          {voucher.discount_percentage}% OFF
                        </span>
                        <Tag className="h-4 w-4 text-emerald-600" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Expires {new Date(voucher.expiry_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{voucher.views} views</span>
                    </div>
                  </div>

                  <button 
                  
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg group-hover:scale-105 transition-all">
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer group hover:from-teal-600 hover:to-teal-700">
          <TrendingUp className="h-10 w-10 mb-4 opacity-80 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-2xl font-bold mb-2">2,547</h3>
          <p className="text-teal-100">Active Vouchers</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer group hover:from-blue-600 hover:to-blue-700">
          <Star className="h-10 w-10 mb-4 opacity-80 fill-current group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-2xl font-bold mb-2">1,234</h3>
          <p className="text-blue-100">Happy Traders</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer group hover:from-purple-600 hover:to-purple-700">
          <Tag className="h-10 w-10 mb-4 opacity-80 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-2xl font-bold mb-2">35%</h3>
          <p className="text-purple-100">Average Savings</p>
        </div>
      </section>

      <section className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 text-white">
        <div className="max-w-2xl">
          <h2
          //  className="text-3xl font-bold mb-4 "
           className="text-3xl md:text-6xl font-bold mb-4 text-white bg-gradient-to-r from-amber-400 via-orange-600 to-pink-600 bg-clip-text text-transparent transition-all duration-700 hover:scale-105 hover:from-pink-500 hover:to-amber-400 animate-pulse"
           
           >
          Start Trading Today</h2>
          <p className="text-lg text-white/90 mb-6">
            Join thousands of users who are saving money and getting the most out of their vouchers.
          </p>
          <button
            onClick={() => onNavigate('exchange')}
            className="px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
          >
            Start Trading
          </button>
        </div>
      </section>
    </div>
  );
}
