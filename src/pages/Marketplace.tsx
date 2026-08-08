import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, Filter, Tag, Star, Calendar, Eye, ShoppingCart, AlertCircle } from 'lucide-react';
import { Voucher } from '../types';
import { hasInvalidSupabaseConfig, supabase } from '../lib/supabase';
import { useCategories } from '../hooks/useCategories';



type SortOption = 'newest' | 'discount' | 'expiry' | 'popular' | 'price_low' | 'price_high';

const SEARCH_DEBOUNCE_MS = 350;
const QUERY_LIMIT = 60;

const fallbackVouchers: Voucher[] = [
  {
    id: '1',
    seller_id: 'user1',
    brand_name: 'Amazon',
    category: 'tech',
    original_value: 100,
    selling_price: 85,
    discount_percentage: 15,
    voucher_code: 'AMZ-DEMO-001',
    expiry_date: '2026-12-31',
    status: 'verified',
    is_verified: true,
    views: 245,
    created_at: '2026-01-01',
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
    voucher_code: 'SBUX-DEMO-002',
    expiry_date: '2026-11-15',
    status: 'verified',
    is_verified: true,
    views: 189,
    created_at: '2026-01-03',
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
    voucher_code: 'NIKE-DEMO-003',
    expiry_date: '2026-12-20',
    status: 'verified',
    is_verified: true,
    views: 312,
    created_at: '2026-01-05',
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
    voucher_code: 'UBER-DEMO-004',
    expiry_date: '2026-10-20',
    status: 'verified',
    is_verified: true,
    views: 156,
    created_at: '2026-01-06',
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
    voucher_code: 'SPOT-DEMO-005',
    expiry_date: '2026-11-30',
    status: 'verified',
    is_verified: true,
    views: 98,
    created_at: '2026-01-07',
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
    voucher_code: 'NFLX-DEMO-006',
    expiry_date: '2026-12-15',
    status: 'verified',
    is_verified: true,
    views: 223,
    created_at: '2026-01-08',
    description: '6-month streaming subscription',
  },
];

const sanitizeSearchTerm = (input: string): string => {
  return input.trim().replace(/[,%()]/g, ' ').replace(/\s+/g, ' ');
};

const sortVouchers = (source: Voucher[], sortBy: SortOption): Voucher[] => {
  return [...source].sort((a, b) => {
    switch (sortBy) {
      case 'discount':
        return b.discount_percentage - a.discount_percentage;
      case 'expiry':
        return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
      case 'popular':
        return b.views - a.views;
      case 'price_low':
        return a.selling_price - b.selling_price;
      case 'price_high':
        return b.selling_price - a.selling_price;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
};

export default function Marketplace() {
  const { categories } = useCategories();

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const activeRequestId = useRef(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchInput);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const localFallbackData = useMemo(() => {
    const normalizedTerm = sanitizeSearchTerm(debouncedSearchTerm).toLowerCase();
    const filtered = fallbackVouchers.filter((voucher) => {
      const matchesSearch =
        normalizedTerm.length === 0 ||
        voucher.brand_name.toLowerCase().includes(normalizedTerm) ||
        voucher.description?.toLowerCase().includes(normalizedTerm);
      const matchesCategory = selectedCategory === 'all' || voucher.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return sortVouchers(filtered, sortBy);
  }, [debouncedSearchTerm, selectedCategory, sortBy]);

  const fetchMarketplaceVouchers = useCallback(async () => {
    const requestId = ++activeRequestId.current;
    setIsLoading(true);
    setErrorMessage(null);

    if (hasInvalidSupabaseConfig) {
      setVouchers(localFallbackData);
      setIsLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('vouchers')
        .select('*')
        .eq('is_verified', true)
        .in('status', ['verified', 'active']);

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const normalizedSearchTerm = sanitizeSearchTerm(debouncedSearchTerm);
      if (normalizedSearchTerm) {
        const pattern = `%${normalizedSearchTerm}%`;
        query = query.or(`brand_name.ilike.${pattern},description.ilike.${pattern}`);
      }

      switch (sortBy) {
        case 'discount':
          query = query.order('discount_percentage', { ascending: false });
          break;
        case 'expiry':
          query = query.order('expiry_date', { ascending: true });
          break;
        case 'popular':
          query = query.order('views', { ascending: false });
          break;
        case 'price_low':
          query = query.order('selling_price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('selling_price', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(QUERY_LIMIT);
      if (error) throw error;

      if (requestId !== activeRequestId.current) return;
      setVouchers((data ?? []) as Voucher[]);
    } catch (error) {
      if (requestId !== activeRequestId.current) return;
      console.error('Marketplace search failed:', error);
      setErrorMessage('Unable to load marketplace vouchers right now. Please try again.');
      setVouchers([]);
    } finally {
      if (requestId === activeRequestId.current) {
        setIsLoading(false);
      }
    }
  }, [debouncedSearchTerm, localFallbackData, selectedCategory, sortBy]);

  useEffect(() => {
    fetchMarketplaceVouchers();
  }, [fetchMarketplaceVouchers]);

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-card backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-main-border shadow-soft">
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-main-text mb-3 tracking-tight">Marketplace</h1>
          <p className="text-dim font-medium text-lg">Acquire vetted vouchers with verified liquidity</p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </div>

      {hasInvalidSupabaseConfig && (
        <div className="bg-status-warning/5 border border-status-warning/20 rounded-2xl p-5 flex items-start space-x-4">
          <div className="p-2 bg-status-warning/10 rounded-xl">
            <AlertCircle className="h-5 w-5 text-status-warning" />
          </div>
          <p className="text-status-warning text-sm font-medium">
            Supabase is not configured. Serving sample data from local protocol cache.
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-status-error/5 border border-status-error/20 rounded-2xl p-5 flex items-start space-x-4">
          <div className="p-2 bg-status-error/10 rounded-xl">
            <AlertCircle className="h-5 w-5 text-status-error" />
          </div>
          <p className="text-status-error text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      <div className="bg-card backdrop-blur-xl rounded-[2rem] p-8 border border-main-border shadow-soft space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-dim group-focus-within:text-brand-primary transition-colors" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search assets (e.g. Amazon, Tech...)"
              className="w-full pl-14 pr-6 py-4 bg-muted-bg border border-main-border text-main-text rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all font-medium outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center space-x-3 shadow-md ${showFilters
              ? 'bg-brand-primary text-white shadow-brand shadow-lg'
              : 'bg-muted-bg text-main-text border border-main-border hover:bg-card-hover'
              }`}
          >
            <Filter className={`h-4 w-4 ${showFilters ? 'animate-pulse' : ''}`} />
            <span>Advanced Filters</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-dim px-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-brand-primary animate-ping' : 'bg-status-success'}`}></div>
            <span>{isLoading ? 'Querying Chain...' : `${vouchers.length} Verified Listings`}</span>
          </div>
          {debouncedSearchTerm && (
            <span>Results for: "{debouncedSearchTerm}"</span>
          )}
        </div>

        {showFilters && (
          <div className="grid lg:grid-cols-2 gap-8 pt-8 border-t border-main-border animate-in fade-in slide-in-from-top-4 duration-500">
            <div>
              <label className="block text-[10px] font-black text-dim uppercase tracking-widest mb-4">Market Category</label>
              <div className="flex flex-wrap gap-2">
                {['all', ...categories.map(c => c.name)].map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border ${selectedCategory === category
                      ? 'bg-gradient-brand text-white border-transparent shadow-brand'
                      : 'bg-card text-dim border-main-border hover:border-brand-primary/30 hover:text-main-text'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-dim uppercase tracking-widest mb-4">Order Metrics</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full appearance-none px-6 py-4 bg-muted-bg border border-main-border text-main-text rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all font-bold outline-none cursor-pointer"
                >
                  <option value="newest">Latest Listings</option>
                  <option value="discount">Highest Yield (Discount)</option>
                  <option value="expiry">Imminent Expiry</option>
                  <option value="popular">High Velocity (Popular)</option>
                  <option value="price_low">Value: Low to High</option>
                  <option value="price_high">Value: High to Low</option>
                </select>
                <Filter className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-dim pointer-events-none" />
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-card rounded-[2rem] border border-main-border overflow-hidden animate-pulse">
              <div className="h-56 bg-muted-bg" />
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <div className="h-6 bg-muted-bg rounded-lg w-3/4" />
                  <div className="h-4 bg-muted-bg rounded-lg w-1/2" />
                </div>
                <div className="h-20 bg-muted-bg rounded-2xl" />
                <div className="h-12 bg-muted-bg rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && vouchers.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {vouchers.map((voucher) => {
            const daysLeft = getDaysUntilExpiry(voucher.expiry_date);
            const isExpired = daysLeft < 0;
            const isExpiringSoon = daysLeft <= 30 && daysLeft >= 0;

            return (
              <div
                key={voucher.id}
                className="group relative bg-card backdrop-blur-xl rounded-[2rem] border border-main-border hover:shadow-2xl hover:shadow-brand-primary/5 transition-all duration-500 overflow-hidden shadow-soft flex flex-col"
              >
                <div className="relative h-56 bg-muted-bg/50 p-8 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  <div className="text-center z-10 transition-transform duration-500 group-hover:scale-110">
                    <div className="text-4xl font-black bg-gradient-brand bg-clip-text text-transparent mb-3 tracking-tighter">
                      {voucher.brand_name}
                    </div>
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-card text-main-text border border-main-border shadow-sm">
                      {voucher.category}
                    </div>
                  </div>

                  {voucher.is_verified && (
                    <div className="absolute top-6 right-6 bg-status-success text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-lg">
                      <Star className="h-3 w-3 fill-current" />
                      <span>Verified</span>
                    </div>
                  )}

                  {isExpired ? (
                    <div className="absolute top-6 left-6 bg-dim text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg">
                      Expired
                    </div>
                  ) : isExpiringSoon ? (
                    <div className="absolute top-6 left-6 bg-status-error text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg animate-pulse">
                      {daysLeft}d left
                    </div>
                  ) : null}
                </div>

                <div className="p-8 space-y-8 flex-1 flex flex-col">
                  <p className="text-muted-text text-sm font-medium line-clamp-2 min-h-[40px] leading-relaxed">
                    {voucher.description}
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-dim uppercase tracking-widest">Market Value</div>
                      <div className="text-xl font-bold text-dim line-through decoration-status-error/30 decoration-2">
                        ${voucher.original_value}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Ask Price</div>
                      <div className="text-3xl font-black bg-gradient-brand bg-clip-text text-transparent">
                        ${voucher.selling_price}
                      </div>
                    </div>
                  </div>

                  <div className="relative bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-4 overflow-hidden group/save">
                    <div className="absolute inset-0 bg-brand-primary/5 translate-x-full group-hover/save:translate-x-0 transition-transform duration-500"></div>
                    <div className="relative flex items-center justify-between">
                      <span className="text-xs font-black text-main-text uppercase tracking-wider italic">Savings Yield</span>
                      <div className="flex items-center space-x-2 text-status-success">
                        <span className="text-xl font-black">
                          {voucher.discount_percentage}%
                        </span>
                        <Tag className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold text-dim">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-brand-primary/50" />
                      <span>{new Date(voucher.expiry_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-brand-primary/50" />
                      <span>{voucher.views}</span>
                    </div>
                  </div>

                  <button className="w-full mt-auto bg-gradient-brand text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-brand hover:-translate-y-1 active:translate-y-0.5 transition-all shadow-lg flex items-center justify-center space-x-3">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Execute Trade</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && vouchers.length === 0 && (
        <div className="text-center py-24 bg-card backdrop-blur-xl rounded-[2.5rem] border border-main-border shadow-soft">
          <div className="w-24 h-24 bg-muted-bg rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Tag className="h-12 w-12 text-dim opacity-40 rotate-12" />
          </div>
          <h3 className="text-2xl font-black text-main-text mb-3 tracking-tight">No Matching Assets</h3>
          <p className="text-dim font-medium mb-10 max-w-sm mx-auto">Try broadening your search criteria or checking different categories.</p>
          <button
            onClick={() => {
              setSearchInput('');
              setSelectedCategory('all');
            }}
            className="px-8 py-4 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs hover:shadow-brand transition-all shadow-lg"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
