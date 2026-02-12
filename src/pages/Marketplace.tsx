import { useState } from 'react';
import { Search, Filter, Tag, Star, Calendar, Eye, ShoppingCart, Plus } from 'lucide-react';
import { Voucher } from '../types';
import AddVoucherModal from '../components/AddVoucherModal';

interface MarketplaceProps {
  onNavigate: (page: string) => void;
}

const allVouchers: Voucher[] = [
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

export default function Marketplace({ onNavigate }: MarketplaceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = ['all', 'food', 'fashion', 'travel', 'entertainment', 'tech', 'health'];

  const filteredVouchers = allVouchers.filter(voucher => {
    const matchesSearch = voucher.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || voucher.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedVouchers = [...filteredVouchers].sort((a, b) => {
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

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

        {showFilters && (
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
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
                onChange={(e) => setSortBy(e.target.value)}
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedVouchers.map(voucher => {
          const daysLeft = getDaysUntilExpiry(voucher.expiry_date);
          const isExpiringSoon = daysLeft <= 30;

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

                {isExpiringSoon && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {daysLeft}d left
                  </div>
                )}

                <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-slate-700">
                  {voucher.category}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600 line-clamp-2 min-h-[40px]">
                  {voucher.description}
                </p>

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
                  <span className="text-lg font-bold text-emerald-600">
                    {voucher.discount_percentage}% OFF
                  </span>
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

      {sortedVouchers.length === 0 && (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200">
          <Tag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No vouchers found</h3>
          <p className="text-slate-600">Try adjusting your filters or search term</p>
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
