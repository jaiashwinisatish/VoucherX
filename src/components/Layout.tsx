import { ReactNode, useState, useEffect, useRef } from 'react';
import {  Bell,Menu, X, Home, ShoppingBag, Repeat, Wallet, Star, Trophy, Heart, User, LogOut, Bot, Calendar } from 'lucide-react';
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
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'exchange', label: 'Exchange', icon: Repeat },
    { id: 'wallet', label: 'My Wallet', icon: Wallet },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'expiry-insights', label: 'Expiry Insights', icon: Calendar },

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

      </nav>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Sidebar Drawer */}
        <div
          ref={sidebarRef}
          className={`absolute top-0 left-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-2 rounded-xl">
                <Repeat className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                VoucherX
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-5 py-4 border-b border-slate-100">
            <button
              onClick={() => {
                onNavigate('profile');
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 w-full hover:bg-slate-50 rounded-lg p-2 -m-2 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800">{profile?.full_name || 'User'}</p>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-medium text-amber-700">
                    {profile?.voucher_coins?.toLocaleString() || 0} Coins
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="px-3 py-3 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
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
                  className={`w-full px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md'
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
                onOpenAI();
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-lg flex items-center space-x-3 text-purple-600 hover:bg-purple-50 transition-all"
            >
              <Bot className="h-5 w-5" />
              <span className="font-medium">AI Assistant</span>
            </button>
          </div>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-slate-200 bg-white">
            <button
              onClick={() => {
                handleSignOut();
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-lg flex items-center space-x-3 text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="mt-16 bg-white/90 text-slate-800 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-slate-200 pb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-2 rounded-xl">
                  <Repeat className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  VoucherX
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Don't let your vouchers expire. Trade, earn, and repeat with AI-powered insights.
              </p>
              <p className="text-xs text-slate-500">
                Built for savvy shoppers who want to unlock the full value of their vouchers.
              </p>
            </div>

            <nav aria-label="Product" className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">Product</h3>
              <div className="flex flex-col space-y-2 text-sm">
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="text-slate-600 hover:text-teal-600 text-left transition-colors"
                >
                  Marketplace
                </button>
                <button
                  onClick={() => onNavigate('exchange')}
                  className="text-slate-600 hover:text-teal-600 text-left transition-colors"
                >
                  Exchange
                </button>
                <button
                  onClick={() => onNavigate('wallet')}
                  className="text-slate-600 hover:text-teal-600 text-left transition-colors"
                >
                  Wallet
                </button>
                <button
                  onClick={() => onNavigate('challenges')}
                  className="text-slate-600 hover:text-teal-600 text-left transition-colors"
                >
                  Challenges
                </button>
              </div>
            </nav>

            <nav aria-label="Company" className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">Company</h3>
              <div className="flex flex-col space-y-2 text-sm">
                <button
                  onClick={() => onNavigate('home')}
                  className="text-slate-600 hover:text-teal-600 text-left transition-colors"
                >
                  About Us
                </button>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-slate-600 hover:text-teal-600 text-left transition-colors"
                >
                  How It Works
                </button>
                <button
                  type="button"
                  className="text-slate-400 cursor-default text-left"
                  aria-disabled="true"
                >
                  Careers (coming soon)
                </button>
              </div>
            </nav>

            <nav aria-label="Support" className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">Support</h3>
              <div className="flex flex-col space-y-2 text-sm">
                <a
                  href="mailto:support@voucherx.com"
                  className="text-slate-600 hover:text-teal-600 text-left transition-colors"
                >
                  Help &amp; FAQ
                </a>
                <a
                  href="mailto:support@voucherx.com"
                  className="text-slate-600 hover:text-teal-600 text-left transition-colors"
                >
                  Contact Us
                </a>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-slate-600 hover:text-teal-600 text-left transition-colors"
                >
                  Terms &amp; Conditions
                </button>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-slate-600 hover:text-teal-600 text-left transition-colors"
                >
                  Privacy Policy
                </button>
              </div>
            </nav>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} VoucherX. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-xs">
              <span className="text-slate-500">Join the community</span>
              <a
                href="https://github.com/jaiashwinisatish/VoucherX"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-teal-600 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-teal-600 transition-colors"
              >
                Twitter
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-teal-600 transition-colors"
              >
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
