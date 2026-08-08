import { ReactNode, useState } from 'react';
import {  Bell,Menu, X, Home, ShoppingBag, Repeat, Wallet, Star, Trophy, Heart, User, LogOut, Bot, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import BackToTop from "./BackToTop";



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
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md border-slate-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center space-x-2 group"
              >
                <div className="p-2 transition-transform bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl group-hover:scale-105">
                  <Repeat className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text">
                  VoucherX
                </span>
              </button>

              <div className="hidden space-x-1 md:flex lg:space-x-2">
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
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-full px-4 py-1.5 shadow-sm space-x-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-bold text-amber-700 whitespace-nowrap">
                  {profile?.voucher_coins?.toLocaleString() || 0} Coins
                </span>
              </div>

              <button
                onClick={onOpenAI}
                className="relative p-2 transition-colors rounded-full text-slate-600 hover:bg-purple-50 hover:text-purple-600"
                title="AI Assistant"
              >
                <Bot className="w-5 h-5" />
                <span className="absolute w-2 h-2 bg-purple-500 rounded-full top-1 right-1 animate-pulse"></span>
              </button>

              <div className="items-center hidden space-x-3 md:flex">
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center px-3 py-2 space-x-2 transition-colors rounded-full hover:bg-slate-100"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{profile?.full_name}</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="p-2 transition-colors rounded-full text-slate-600 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg md:hidden text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="bg-white border-t md:hidden border-slate-200">
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
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => {
                  onNavigate('profile');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 space-x-3 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </button>
              <button
                onClick={() => {
                  onOpenAI();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 space-x-3 text-purple-600 rounded-lg hover:bg-purple-50"
              >
                <Bot className="w-5 h-5" />
                <span className="font-medium">AI Assistant</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-3 space-x-3 text-red-600 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="mt-16 border-t bg-white/90 text-slate-800 border-slate-200">
        <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 pb-8 border-b sm:grid-cols-2 lg:grid-cols-4 border-slate-200">
            <div>
              <div className="flex items-center mb-4 space-x-2">
                <div className="p-2 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl">
                  <Repeat className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-transparent bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text">
                  VoucherX
                </span>
              </div>
              <p className="mb-4 text-sm text-slate-600">
                Don't let your vouchers expire. Trade, earn, and repeat with AI-powered insights.
              </p>
              <p className="text-xs text-slate-500">
                Built for savvy shoppers who want to unlock the full value of their vouchers.
              </p>
            </div>

            <nav aria-label="Product" className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-700">Product</h3>
              <div className="flex flex-col space-y-2 text-sm">
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="text-left transition-colors text-slate-600 hover:text-teal-600"
                >
                  Marketplace
                </button>
                <button
                  onClick={() => onNavigate('exchange')}
                  className="text-left transition-colors text-slate-600 hover:text-teal-600"
                >
                  Exchange
                </button>
                <button
                  onClick={() => onNavigate('wallet')}
                  className="text-left transition-colors text-slate-600 hover:text-teal-600"
                >
                  Wallet
                </button>
                <button
                  onClick={() => onNavigate('challenges')}
                  className="text-left transition-colors text-slate-600 hover:text-teal-600"
                >
                  Challenges
                </button>
              </div>
            </nav>

            <nav aria-label="Company" className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-700">Company</h3>
              <div className="flex flex-col space-y-2 text-sm">
                <button
                  onClick={() => onNavigate('home')}
                  className="text-left transition-colors text-slate-600 hover:text-teal-600"
                >
                  About Us
                </button>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-left transition-colors text-slate-600 hover:text-teal-600"
                >
                  How It Works
                </button>
                <button
                  type="button"
                  className="text-left cursor-default text-slate-400"
                  aria-disabled="true"
                >
                  Careers (coming soon)
                </button>
              </div>
            </nav>

            <nav aria-label="Support" className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-700">Support</h3>
              <div className="flex flex-col space-y-2 text-sm">
                <a
                  href="mailto:support@voucherx.com"
                  className="text-left transition-colors text-slate-600 hover:text-teal-600"
                >
                  Help &amp; FAQ
                </a>
                <a
                  href="mailto:support@voucherx.com"
                  className="text-left transition-colors text-slate-600 hover:text-teal-600"
                >
                  Contact Us
                </a>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-left transition-colors text-slate-600 hover:text-teal-600"
                >
                  Terms &amp; Conditions
                </button>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-left transition-colors text-slate-600 hover:text-teal-600"
                >
                  Privacy Policy
                </button>
              </div>
            </nav>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} VoucherX. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-xs">
              <span className="text-slate-500">Join the community</span>
              <a
                href="https://github.com/jaiashwinisatish/VoucherX"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors text-slate-600 hover:text-teal-600"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors text-slate-600 hover:text-teal-600"
              >
                Twitter
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors text-slate-600 hover:text-teal-600"
              >
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
      <BackToTop />
    </div>
  );
}
