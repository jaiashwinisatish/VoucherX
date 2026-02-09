import { ReactNode, useState } from 'react';
import { Bell, Menu, X, Home, ShoppingBag, Repeat, Wallet, Star, Trophy, Heart, User, LogOut, Bot } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenAI: () => void;
}

export default function Layout({ children, currentPage, onNavigate, onOpenAI }: LayoutProps) {
  const { profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'exchange', label: 'Exchange', icon: Repeat },
    { id: 'wallet', label: 'My Wallet', icon: Wallet },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center space-x-2 group"
              >
                <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-2 rounded-xl group-hover:scale-105 transition-transform">
                  <Repeat className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  VoucherX
                </span>
              </button>

              <div className="hidden md:flex space-x-1 lg:space-x-2">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`px-3 py-2 lg:px-4 rounded-lg flex items-center space-x-1.5 lg:space-x-2 transition-all ${isActive
                        ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-full px-4 py-1.5 shadow-sm space-x-2">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-bold text-amber-700 whitespace-nowrap">
                  {profile?.voucher_coins?.toLocaleString() || 0} Coins
                </span>
              </div>

              <button
                onClick={onOpenAI}
                className="relative p-2 text-slate-600 hover:bg-purple-50 hover:text-purple-600 rounded-full transition-colors"
                title="AI Assistant"
              >
                <Bot className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              </button>

              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center space-x-2 hover:bg-slate-100 rounded-full px-3 py-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{profile?.full_name}</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${isActive
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => {
                  onNavigate('profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg flex items-center space-x-3 text-slate-600 hover:bg-slate-100"
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Profile</span>
              </button>
              <button
                onClick={() => {
                  onOpenAI();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg flex items-center space-x-3 text-purple-600 hover:bg-purple-50"
              >
                <Bot className="h-5 w-5" />
                <span className="font-medium">AI Assistant</span>
              </button>
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-3 rounded-lg flex items-center space-x-3 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600">
            <p className="text-lg font-semibold mb-2">Don't let your vouchers expire. Trade. Earn. Repeat.</p>
            <p className="text-sm">&copy; 2025 VoucherX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
