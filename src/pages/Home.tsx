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
    voucher_code: 'XXXX-XXXX-XXXX',
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
    voucher_code: 'XXXX-XXXX-XXXX',
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
    voucher_code: 'XXXX-XXXX-XXXX',
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
    voucher_code: 'XXXX-XXXX-XXXX',
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
    voucher_code: 'XXXX-XXXX-XXXX',
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
    voucher_code: 'XXXX-XXXX-XXXX',
    description: '6-month streaming subscription',
  },
];

const categories = [
  { name: 'Food & Dining', icon: '🍔', count: 234 },
  { name: 'Fashion', icon: '👕', count: 189 },
  { name: 'Tech', icon: '💻', count: 312 },
  { name: 'Travel', icon: '✈️', count: 156 },
  { name: 'Entertainment', icon: '🎬', count: 198 },
  { name: 'Health', icon: '💊', count: 145 },
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
    <div className="space-y-12">
      <section className="relative overflow-hidden bg-gradient-brand rounded-[2.5rem] p-12 md:p-16 text-white shadow-brand">
        <div className="relative z-10 max-w-3xl">
          <h1
            className="text-5xl md:text-7xl font-black mb-8 leading-[1.1]"
            style={{ letterSpacing: '-0.02em' }}
          >
            Don't Let Your <span className="text-brand-accent">Vouchers</span> Expire
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-white/90 font-medium leading-relaxed">
            Trade, buy, and sell vouchers with confidence. Get AI-powered recommendations and never miss a great deal.
          </p>
          <div className="flex flex-wrap gap-5">
            <button
              onClick={() => onNavigate('marketplace')}
              className="px-10 py-5 bg-white text-brand-primary rounded-2xl font-bold hover:shadow-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Explore Marketplace
            </button>
            <button
              onClick={onOpenAI}
              className="px-10 py-5 bg-white/20 backdrop-blur-md text-white rounded-2xl font-bold hover:bg-white/30 active:scale-95 transition-all flex items-center space-x-3 border border-white/30 shadow-lg"
            >
              <Bot className="h-6 w-6" />
              <span>Try AI Assistant</span>
            </button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-[30rem] h-[30rem] bg-white/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -left-20 -bottom-20 w-[20rem] h-[20rem] bg-brand-accent/20 rounded-full blur-[80px]"></div>
      </section>

      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-main-text">Explore Categories</h2>
            <p className="text-dim mt-2 font-medium">Find exactly what you're looking for</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => onNavigate('marketplace')}
              className="
                group relative bg-card backdrop-blur-xl rounded-[2rem] p-8
                text-center border border-main-border
                transition-all duration-500 ease-out
                hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-primary/10
                hover:border-brand-primary/30
              "
            >
              <div className="text-5xl mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">
                {category.icon}
              </div>
              <h3 className="font-bold text-main-text text-base mb-1">{category.name}</h3>
              <p className="text-xs text-dim font-bold tracking-wider uppercase">{category.count} Listings</p>
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/0 to-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-main-text">Featured Vouchers</h2>
            <p className="text-dim mt-2 font-medium">Handpicked premium deals just for you</p>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="group flex items-center space-x-2 text-brand-primary font-bold hover:translate-x-1 transition-all"
          >
            <span>View All</span>
            <TrendingUp className="h-4 w-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredVouchers.map((voucher) => {
            const daysLeft = getDaysUntilExpiry(voucher.expiry_date);
            const isExpired = daysLeft < 0;
            const isExpiringSoon = daysLeft <= 30 && daysLeft >= 0;

            return (
              <div
                key={voucher.id}
                className="
                  group relative bg-card backdrop-blur-xl rounded-[2rem]
                  border border-main-border overflow-hidden
                  transition-all duration-500 hover:-translate-y-3
                  shadow-soft hover:shadow-2xl hover:shadow-brand-primary/5
                "
              >
                <div className="relative h-56 bg-muted-bg/50 p-8 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-5 transition-opacity"></div>
                  <div className="text-center z-10 transition-transform duration-500 group-hover:scale-110">
                    <div className="text-4xl font-black bg-gradient-brand bg-clip-text text-transparent mb-3 tracking-tight">
                      {voucher.brand_name}
                    </div>
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-card text-main-text border border-main-border shadow-sm">
                      {voucher.category}
                    </div>
                  </div>

                  {voucher.is_verified && (
                    <div className="absolute top-5 right-5 bg-status-success text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-lg">
                      <Star className="h-3 w-3 fill-current" />
                      <span>Verified</span>
                    </div>
                  )}

                  {isExpired ? (
                    <div className="absolute top-5 left-5 bg-dim text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg">
                      Expired
                    </div>
                  ) : isExpiringSoon ? (
                    <div className="absolute top-5 left-5 bg-status-error text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg animate-pulse">
                      {daysLeft}d Remaining
                    </div>
                  ) : null}
                </div>

                <div className="p-8">
                  <p className="text-muted-text text-sm font-medium mb-6 line-clamp-2 min-h-[40px] leading-relaxed">
                    {voucher.description}
                  </p>

                  <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-dim uppercase tracking-widest">Retail</div>
                      <div className="text-xl font-bold text-dim line-through decoration-status-error/30 decoration-2">
                        ${voucher.original_value}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Trade At</div>
                      <div className="text-3xl font-black bg-gradient-brand bg-clip-text text-transparent">
                        ${voucher.selling_price}
                      </div>
                    </div>
                  </div>

                  <div className="relative bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-5 mb-8 overflow-hidden group/save">
                    <div className="absolute inset-0 bg-brand-primary/5 translate-x-full group-hover/save:translate-x-0 transition-transform duration-500"></div>
                    <div className="relative flex items-center justify-between">
                      <span className="text-sm font-black text-main-text uppercase tracking-wider">Net Savings</span>
                      <div className="flex items-center space-x-2 bg-brand-primary text-white px-3 py-1 rounded-lg">
                        <span className="text-lg font-black italic">
                          {voucher.discount_percentage}%
                        </span>
                        <Tag className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold text-dim mb-8">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-brand-primary/50" />
                      <span>Expires {new Date(voucher.expiry_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-brand-primary/50" />
                      <span>{voucher.views} Views</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-brand text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-brand hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
                    Swap Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        {[
          { icon: TrendingUp, val: '2,547', label: 'Active Assets', color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
          { icon: Star, val: '1,234', label: 'Pro Traders', color: 'text-brand-secondary', bg: 'bg-brand-secondary/10' },
          { icon: Tag, val: '35%', label: 'Avg. Yield', color: 'text-brand-accent', bg: 'bg-brand-accent/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-card backdrop-blur-xl border border-main-border rounded-[2rem] p-10 hover:shadow-2xl transition-all group cursor-default">
            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon className="h-8 w-8" />
            </div>
            <h3 className="text-4xl font-black text-main-text mb-2">{stat.val}</h3>
            <p className="text-muted-text font-bold uppercase tracking-widest text-xs">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="relative overflow-hidden bg-brand-accent rounded-[2.5rem] p-12 md:p-16 text-inverse shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Elite Trading <br />Waitlist Open</h2>
          <p className="text-lg md:text-xl opacity-90 mb-10 font-bold leading-relaxed">
            Join the decentralized voucher revolution. Be the first to access our institutional-grade trading platform.
          </p>
          <button
            onClick={() => onNavigate('exchange')}
            className="px-10 py-5 bg-inverse text-brand-accent rounded-2xl font-black uppercase tracking-widest hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            Get Early Access
          </button>
        </div>
        <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      </section>
    </div>
  );
}
