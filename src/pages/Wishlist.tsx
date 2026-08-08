import { useState, useEffect } from 'react';
import { Heart, Plus, Bell, BellOff, X, Trash2, Loader, Sparkles } from 'lucide-react';
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
        <Loader className="h-8 w-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-brand rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
              <Heart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Wishlist</h1>
              <p className="text-white/90 text-lg">Track brands you want and get notified</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold hover:bg-white/30 transition-all flex items-center space-x-2 border border-white/20 shadow-sm"
          >
            <Plus className="h-5 w-5" />
            <span>Add Brand</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-card backdrop-blur-sm rounded-2xl p-8 border-2 border-brand-primary shadow-xl animate-in fade-in zoom-in duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-main-text flex items-center space-x-2">
              <Plus className="h-6 w-6 text-brand-primary" />
              <span>Add to Wishlist</span>
            </h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 text-muted-text hover:bg-card-hover rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleAddWishlist} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-main-text mb-2 tracking-wide uppercase">
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-5 py-3.5 bg-muted-bg border border-main-border text-main-text rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none"
                placeholder="e.g., Apple, Netflix, Starbucks"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-main-text mb-2 tracking-wide uppercase">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-5 py-3.5 bg-muted-bg border border-main-border text-main-text rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none"
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
                <label className="block text-sm font-bold text-main-text mb-2 tracking-wide uppercase">
                  Max Price (Optional)
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-5 py-3.5 bg-muted-bg border border-main-border text-main-text rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none"
                  placeholder="$0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-brand text-white py-4 rounded-xl font-bold hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-50 shadow-md"
            >
              {submitting ? 'Adding...' : 'Add to Wishlist'}
            </button>
          </form>
        </div>
      )}

      {matchingVouchers.length > 0 && (
        <div className="bg-status-success/10 backdrop-blur-sm rounded-2xl p-6 border border-status-success/20 shadow-soft">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-status-success p-2 rounded-lg text-white shadow-sm">
              <Bell className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-status-success">Matching Vouchers Available!</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {matchingVouchers.map((match, index) => (
              <div key={index} className="bg-card border border-status-success/10 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div>
                  <div className="font-bold text-main-text mb-1">{match.brand}</div>
                  <div className="text-sm text-muted-text font-medium">
                    {match.count} voucher{match.count > 1 ? 's' : ''} from <span className="text-status-success font-bold">${match.lowestPrice}</span> • {match.discount}% off
                  </div>
                </div>
                <button className="bg-gradient-brand text-white px-5 py-2 rounded-lg font-bold text-sm hover:shadow-md hover:scale-105 transition-all shadow-sm">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-main-text mb-6">Your Wishlist ({items.length})</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-card backdrop-blur-sm rounded-xl border border-main-border p-6 hover:shadow-xl transition-all shadow-soft group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-xl font-bold text-main-text">{item.brand_name}</h3>
                    <div className="p-2 bg-brand-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                      <Heart className="h-5 w-5 text-brand-primary fill-brand-primary" />
                    </div>
                  </div>
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <div className="bg-muted-bg text-main-text border border-main-border px-3 py-1 rounded-full text-xs font-bold capitalize">
                      {item.category}
                    </div>
                    {item.max_price && (
                      <div className="bg-status-success/10 text-status-success border border-status-success/20 px-3 py-1 rounded-full text-xs font-bold">
                        Max: ${item.max_price}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-main-border">
                <button
                  className={`flex items-center space-x-2 text-sm font-bold transition-all p-2 rounded-lg hover:bg-muted-bg ${item.notify
                    ? 'text-status-success'
                    : 'text-dim'
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
                  className="p-2 text-status-error hover:bg-status-error/10 rounded-lg transition-all"
                  title="Delete Item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20 bg-card backdrop-blur-sm rounded-2xl border border-main-border shadow-soft">
            <div className="w-20 h-20 bg-muted-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-dim" />
            </div>
            <h3 className="text-2xl font-bold text-main-text mb-2">Your wishlist is empty</h3>
            <p className="text-muted-text font-medium mb-8">Add brands you're interested in to get notified</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-8 py-4 bg-gradient-brand text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all inline-flex items-center space-x-3 shadow-md"
            >
              <Plus className="h-6 w-6" />
              <span>Add Your First Brand</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-card backdrop-blur-sm rounded-2xl p-8 border border-main-border shadow-soft">
        <h3 className="text-xl font-bold text-main-text mb-8 flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-brand-primary" />
          <span>How Wishlist Works</span>
        </h3>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-bold text-main-text mb-2">Add Brands</h4>
            <p className="text-sm text-muted-text font-medium leading-relaxed">Add your favorite brands and set your preferred price</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-bold text-main-text mb-2">Get Notified</h4>
            <p className="text-sm text-muted-text font-medium leading-relaxed">Receive alerts when matching vouchers are listed</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-bold text-main-text mb-2">Save Money</h4>
            <p className="text-sm text-muted-text font-medium leading-relaxed">Never miss a great deal on your favorite brands</p>
          </div>
        </div>
      </div>
    </div>
  );
}
