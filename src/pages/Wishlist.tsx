import { useState, useEffect } from 'react';
import {
  Heart,
  Plus,
  Bell,
  BellOff,
  X,
  Trash2,
  Loader,
  Sparkles,
  Tag,
  ShoppingBag,
  ArrowRight,
  Star,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { WishlistItem } from '../types';
import { useCategories } from '../hooks/useCategories';

export default function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const { categories } = useCategories();

  

  // Mock matching vouchers (for now, can be dynamic later)
  const matchingVouchers = [
    { brand: 'Apple', count: 3, lowestPrice: 120, discount: 20 },
    { brand: 'Sephora', count: 5, lowestPrice: 60, discount: 18 },
  ];

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWishlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const newItem = {
        user_id: user.id,
        brand_name: brandName,
        category,
        max_price: maxPrice ? parseFloat(maxPrice) : null,
        notify: true
      };

      const { data, error } = await supabase
        .from('wishlists')
        .insert([newItem])
        .select()
        .single();

      if (error) throw error;

      setItems([data, ...items]);
      setBrandName('');
      setCategory('');
      setMaxPrice('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          <Heart className="h-6 w-6 text-pink-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-slate-500 mt-4 font-medium">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-red-600 rounded-2xl p-8 sm:p-10 text-white">
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/30">
              <Heart className="h-8 w-8 fill-current" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">Wishlist</h1>
              <p className="text-white/80 text-lg mt-1">Track brands you love & get notified on deals</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-white text-pink-600 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center space-x-2 group"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Add Brand</span>
          </button>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-6 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <Sparkles className="absolute right-8 bottom-6 h-8 w-8 text-white/20" />
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-pink-200 shadow-xl shadow-pink-100/50 animate-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Add to Wishlist</h2>
            </div>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleAddWishlist} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all bg-white placeholder-slate-400"
                placeholder="e.g., Amazon, Netflix, Starbucks"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all bg-white"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Max Price <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all bg-white placeholder-slate-400"
                  placeholder="$0"
                  min="0"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3.5 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-pink-200 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {submitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Adding...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Add to Wishlist</span>
                </span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Matching Vouchers Alert */}
      {matchingVouchers.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl p-6 sm:p-8 text-white">
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Bell className="h-5 w-5 animate-bounce" />
              </div>
              <h2 className="text-xl font-bold">Matching Vouchers Available!</h2>
            </div>
            <div className="space-y-3">
              {matchingVouchers.map((match, index) => (
                <div
                  key={index}
                  className="bg-white/15 backdrop-blur-sm rounded-xl p-5 hover:bg-white/25 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl font-bold">
                        {match.brand.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-lg mb-0.5">{match.brand}</div>
                        <div className="flex items-center space-x-3 text-sm text-white/80">
                          <span className="flex items-center space-x-1">
                            <Tag className="h-3.5 w-3.5" />
                            <span>{match.count} voucher{match.count > 1 ? 's' : ''}</span>
                          </span>
                          <span>•</span>
                          <span>from ${match.lowestPrice}</span>
                          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                            {match.discount}% off
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-white text-teal-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-teal-50 hover:scale-105 transition-all flex items-center space-x-2 shadow-lg">
                      <span>View</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </div>
      )}

      {/* Wishlist Items Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-slate-800">Your Wishlist</h2>
            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(item => (
            <div
              key={item.id}
              className="group relative bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 hover:shadow-2xl hover:shadow-pink-100/60 hover:-translate-y-2 hover:border-pink-200 transition-all duration-500"
            >
              {/* Gradient accent bar */}
              <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center">
                      <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                        {item.brand_name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-pink-700 transition-colors">
                      {item.brand_name}
                    </h3>
                    <Heart className="h-5 w-5 text-pink-500 fill-pink-500 group-hover:scale-125 transition-transform duration-300" />
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    <div className="bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border border-slate-200">
                      {item.category}
                    </div>
                    {item.max_price && (
                      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-teal-200 flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span>Max: ${item.max_price}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  className={`flex items-center space-x-2 text-sm font-semibold transition-all rounded-lg px-3 py-1.5 ${item.notify
                      ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                      : 'text-slate-500 bg-slate-50 hover:bg-slate-100'
                    }`}
                >
                  {item.notify ? (
                    <>
                      <Bell className="h-4 w-4" />
                      <span>Alerts On</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="h-4 w-4" />
                      <span>Alerts Off</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center space-x-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all text-sm font-medium"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-20 bg-gradient-to-br from-pink-50/80 via-white to-rose-50/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-pink-200">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-12 w-12 text-pink-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center shadow-lg">
                <Plus className="h-4 w-4 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Your wishlist is empty</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Start adding brands you're interested in—we'll notify you when matching vouchers are listed!
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-pink-200/50 hover:scale-105 transition-all inline-flex items-center space-x-3"
            >
              <Heart className="h-5 w-5" />
              <span>Add Your First Brand</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* How Wishlist Works */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-pink-50 rounded-full text-sm font-semibold text-pink-700 mb-3">
            <Sparkles className="h-4 w-4 mr-2" />
            How It Works
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Never miss a deal again</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: ShoppingBag,
              title: 'Add Brands',
              description: 'Add your favorite brands and set your preferred maximum price',
              step: '1',
              gradient: 'from-pink-500 to-rose-500',
            },
            {
              icon: Bell,
              title: 'Get Notified',
              description: 'Receive instant alerts when matching vouchers are listed',
              step: '2',
              gradient: 'from-rose-500 to-red-500',
            },
            {
              icon: Star,
              title: 'Save Money',
              description: 'Grab the best deals on your favorite brands before anyone else',
              step: '3',
              gradient: 'from-red-500 to-orange-500',
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative text-center group"
              >
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md z-10">
                  {item.step}
                </div>
                <div className="pt-4 p-6 rounded-2xl border border-slate-100 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-50 hover:-translate-y-1 transition-all duration-300">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
