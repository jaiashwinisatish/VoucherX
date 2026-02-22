import { useState, useEffect } from 'react';
import { Heart, Plus, Bell, BellOff, X, Trash2, Loader } from 'lucide-react';
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
      <div className="flex justify-center items-center py-12">
        <Loader className="h-8 w-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-500 to-red-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Heart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Wishlist</h1>
              <p className="text-white/90 text-lg">Track brands you want and get notified</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-all flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Brand</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-pink-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Add to Wishlist</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleAddWishlist} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Amazon, Netflix, Starbucks"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Max Price (Optional)
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="$0"
                  min="0"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-pink-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add to Wishlist'}
            </button>
          </form>
        </div>
      )}

      {matchingVouchers.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Matching Vouchers Available!</h2>
          </div>
          <div className="space-y-3">
            {matchingVouchers.map((match, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold mb-1">{match.brand}</div>
                    <div className="text-sm text-white/90">
                      {match.count} voucher{match.count > 1 ? 's' : ''} from ${match.lowestPrice} • {match.discount}% off
                    </div>
                  </div>
                  <button className="bg-white text-teal-600 px-4 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Your Wishlist ({items.length})</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <h3 className="text-xl font-semibold text-slate-800">{item.brand_name}</h3>
                    <Heart className="h-5 w-5 text-pink-600 fill-pink-600" />
                  </div>
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <div className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-medium capitalize">
                      {item.category}
                    </div>
                    {item.max_price && (
                      <div className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium">
                        Max: ${item.max_price}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors ${item.notify
                      ? 'text-emerald-600 hover:text-emerald-700'
                      : 'text-slate-600 hover:text-slate-700'
                    }`}
                >
                  {item.notify ? (
                    <>
                      <Bell className="h-4 w-4" />
                      <span>Notifications On</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="h-4 w-4" />
                      <span>Notifications Off</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200">
            <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Your wishlist is empty</h3>
            <p className="text-slate-600 mb-6">Add brands you're interested in to get notified</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Your First Brand</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">How Wishlist Works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="h-7 w-7 text-white" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Add Brands</h4>
            <p className="text-sm text-slate-600">Add your favorite brands and set your preferred price</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell className="h-7 w-7 text-white" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Get Notified</h4>
            <p className="text-sm text-slate-600">Receive alerts when matching vouchers are listed</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Save Money</h4>
            <p className="text-sm text-slate-600">Never miss a great deal on your favorite brands</p>
          </div>
        </div>
      </div>
    </div>
  );
}
