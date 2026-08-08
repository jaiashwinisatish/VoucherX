import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, Filter, Tag, Star, Calendar, Eye, ShoppingCart, Plus, AlertCircle } from 'lucide-react';
import { Voucher } from '../types';
import AddVoucherModal from '../components/AddVoucherModal';
import { hasInvalidSupabaseConfig, supabase } from '../lib/supabase';
import { useCategories } from '../hooks/useCategories';

interface MarketplaceProps {
  onNavigate: (page: string) => void;
}

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
  {
    id: '7',
    seller_id: 'user7',
    brand_name: 'Target',
    category: 'fashion',
    original_value: 100,
    selling_price: 82,
    discount_percentage: 18,
    expiry_date: '2025-11-25',
    status: 'verified',
    is_verified: true,
    views: 167,
    created_at: '2025-10-09',
    description: 'Valid for all Target stores',
  },
  {
    id: '8',
    seller_id: 'user8',
    brand_name: 'Whole Foods',
    category: 'food',
    original_value: 80,
    selling_price: 68,
    discount_percentage: 15,
    expiry_date: '2025-12-10',
    status: 'verified',
    is_verified: true,
    views: 142,
    created_at: '2025-10-10',
    description: 'Organic groceries and more',
  },
];

function sanitizeSearchTerm(term: string): string {
  return term.trim().replace(/[%_\\]/g, '\\$&');
}

function sortVouchers(vouchers: Voucher[], sortBy: SortOption): Voucher[] {
  return [...vouchers].sort((a, b) => {
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
}

export default function Marketplace({ onNavigate }: MarketplaceProps) {
  const { categories } = useCategories();

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
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
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Marketplace</h1>
            <p className="text-slate-600">Discover verified vouchers from trusted sellers</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5" />
            <span>Add Voucher</span>
          </button>
        </div>
      </div>

      {hasInvalidSupabaseConfig && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <p className="text-amber-800 text-sm">
            Supabase is not configured, so marketplace search is showing sample data. Add valid Supabase credentials
            in `.env` to run real database search.
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <p className="text-red-700 text-sm">{errorMessage}</p>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search brands or descriptions..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center space-x-2"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        <div className="text-sm text-slate-600">
          {isLoading ? 'Searching vouchers...' : `${vouchers.length} vouchers found`}
        </div>

        {showFilters && (
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {['all', ...categories.map(c => c.name)].map(category => (

                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="discount">Best Discount</option>
                <option value="expiry">Expiring Soon</option>
                <option value="popular">Most Popular</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white/80 rounded-xl border border-slate-200 overflow-hidden animate-pulse">
              <div className="h-40 bg-slate-200" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-10 bg-slate-200 rounded" />
                <div className="h-10 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && vouchers.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vouchers.map((voucher) => {
            const daysLeft = getDaysUntilExpiry(voucher.expiry_date);
            const isExpired = daysLeft < 0;
            const isExpiringSoon = daysLeft <= 30 && daysLeft >= 0;

            return (
              <div
                key={voucher.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 hover:shadow-xl hover:scale-105 transition-all overflow-hidden group"
              >
                <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 p-6 flex items-center justify-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    {voucher.brand_name}
                  </div>

                  {voucher.is_verified && (
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current" />
                      <span>Verified</span>
                    </div>
                  )}

                  {isExpired ? (
                    <div className="absolute top-4 left-4 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Expired
                    </div>
                  ) : isExpiringSoon ? (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {daysLeft}d left
                    </div>
                  ) : null}

                  <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-slate-700">
                    {voucher.category}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-sm text-slate-600 line-clamp-2 min-h-[40px]">{voucher.description}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">Original Value</div>
                      <div className="text-xl font-bold text-slate-800">${voucher.original_value}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Your Price</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                        ${voucher.selling_price}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">You Save</span>
                    <span className="text-lg font-bold text-emerald-600">{voucher.discount_percentage}% OFF</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(voucher.expiry_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{voucher.views} views</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && vouchers.length === 0 && (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200">
          <Tag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No vouchers found</h3>
          <p className="text-slate-600 mb-4">Try adjusting your filters or search term</p>
          <button
            onClick={() => onNavigate('home')}
            className="px-5 py-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Back to Home
          </button>
        </div>
      )}

      <AddVoucherModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          // Optionally refresh marketplace here
          console.log('Voucher added successfully!');
        }}
      />
    </div>
  );
}
