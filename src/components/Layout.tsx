import { ReactNode, useState } from 'react';
import { Menu, X, Home, ShoppingBag, Repeat, Wallet, Star, Trophy, Heart, User, LogOut, Bot, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

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
    <div className="min-h-screen bg-gradient-page overflow-x-hidden">
      <nav className="bg-nav backdrop-blur-md border-b border-main-border sticky top-0 z-50 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center space-x-2 lg:space-x-4 min-w-0">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center space-x-2 shrink-0 group mr-2"
              >
                <div className="bg-gradient-brand p-1.5 rounded-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-brand">
                  <Repeat className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-black bg-gradient-brand bg-clip-text text-transparent tracking-tighter hidden sm:inline-block whitespace-nowrap">
                  VoucherX
                </span>
              </button>

              <div className="hidden md:flex items-center space-x-0.5 lg:space-x-1 overflow-hidden">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`px-2 lg:px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all duration-300 shrink-0 ${isActive
                        ? 'bg-gradient-brand text-white shadow-brand font-bold'
                        : 'text-muted-text hover:bg-card-hover hover:text-main-text font-medium'
                        }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="text-[10px] lg:text-[11px] uppercase tracking-wider whitespace-nowrap">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-3 shrink-0 ml-4">
              <div className="hidden lg:flex items-center bg-card border border-main-border rounded-lg px-2 py-1 shadow-soft space-x-1.5 group cursor-default">
                <div className="p-1 bg-brand-accent/20 rounded-md group-hover:rotate-12 transition-transform">
                  <Star className="h-3 w-3 text-brand-accent fill-brand-accent" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-dim uppercase tracking-widest leading-none mb-0.5">VC</span>
                  <span className="text-[11px] font-black text-main-text leading-none">
                    {profile?.voucher_coins?.toLocaleString() || 0}
                  </span>
                </div>
              </div>

              <button
                onClick={onOpenAI}
                className="relative p-2 text-muted-text hover:bg-brand-primary/10 hover:text-brand-primary rounded-lg transition-all duration-300 border border-transparent hover:border-brand-primary/20 group"
                title="AI Assistant"
              >
                <Bot className="h-4.5 w-4.5 group-hover:scale-110" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-primary rounded-full border border-page"></span>
              </button>

              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              <div className="hidden md:flex items-center space-x-1.5 lg:space-x-2">
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center space-x-1.5 bg-muted-bg/30 hover:bg-card-hover border border-main-border rounded-lg pl-1.5 pr-2.5 py-1.5 transition-all duration-300 group"
                >
                  <div className="w-7 h-7 bg-gradient-brand rounded-md flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="flex flex-col items-start leading-none gap-0.5">
                    <span className="text-[7px] font-black text-dim uppercase tracking-widest">Trader</span>
                    <span className="text-[11px] font-bold text-main-text truncate max-w-[50px]">{profile?.full_name?.split(' ')[0]}</span>
                  </div>
                </button>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-dim hover:bg-status-error/10 hover:text-status-error rounded-lg border border-transparent hover:border-status-error/20 transition-all duration-300"
                  title="Sign Out"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-main-text bg-muted-bg/30 border border-main-border rounded-lg hover:bg-card-hover transition-all"
              >
                {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-main-border bg-card animate-in slide-in-from-top duration-300">
            <div className="px-6 py-8 space-y-3">
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-brand rounded-2xl flex items-center justify-center shadow-brand">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-main-text">{profile?.full_name}</span>
                    <span className="text-xs font-bold text-brand-primary">{profile?.voucher_coins?.toLocaleString()} VoucherCoins</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
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
                      className={`w-full px-5 py-4 rounded-2xl flex items-center space-x-4 transition-all ${isActive
                        ? 'bg-gradient-brand text-white shadow-brand font-black'
                        : 'text-muted-text hover:bg-muted-bg font-bold'
                        }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="uppercase tracking-wider text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 mt-6 border-t border-main-border grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    onOpenAI();
                    setMobileMenuOpen(false);
                  }}
                  className="px-5 py-4 rounded-2xl flex flex-col items-center justify-center space-y-2 bg-brand-primary/10 text-brand-primary font-black border border-brand-primary/20"
                >
                  <Bot className="h-6 w-6" />
                  <span className="text-[10px] uppercase tracking-widest">AI Suite</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-5 py-4 rounded-2xl flex flex-col items-center justify-center space-y-2 bg-status-error/10 text-status-error font-black border border-status-error/20"
                >
                  <LogOut className="h-6 w-6" />
                  <span className="text-[10px] uppercase tracking-widest">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      <footer className="mt-20 bg-footer backdrop-blur-xl border-t border-main-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 border-b border-main-border pb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-gradient-brand p-3 rounded-[1.25rem] shadow-brand">
                  <Repeat className="h-7 w-7 text-white" />
                </div>
                <span className="text-3xl font-black bg-gradient-brand bg-clip-text text-transparent tracking-tighter">
                  VoucherX
                </span>
              </div>
              <p className="text-muted-text text-lg font-medium mb-8 leading-relaxed max-w-sm">
                The leading decentralized protocol for voucher liquidity. Trade value, earn rewards, and optimize your assets.
              </p>
              <div className="flex items-center space-x-5">
                {['Twitter', 'Discord', 'GitHub', 'Medium'].map((social) => (
                  <button key={social} className="w-12 h-12 bg-card border border-main-border rounded-xl flex items-center justify-center text-dim hover:text-brand-primary hover:border-brand-primary/30 transition-all hover:-translate-y-1 shadow-soft">
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-current rounded-sm opacity-20"></div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-main-text">Protocol</h3>
              <div className="flex flex-col space-y-4">
                {['Marketplace', 'Exchange', 'Vaults', 'Governance'].map(link => (
                  <button key={link} className="text-dim hover:text-brand-primary font-bold text-sm text-left transition-all hover:translate-x-1">{link}</button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-main-text">Resources</h3>
              <div className="flex flex-col space-y-4">
                {['Whitepaper', 'API Docs', 'Risk Tools', 'Audits'].map(link => (
                  <button key={link} className="text-dim hover:text-brand-primary font-bold text-sm text-left transition-all hover:translate-x-1">{link}</button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-main-text">Legal</h3>
              <div className="flex flex-col space-y-4">
                {['Privacy', 'Terms', 'Cookie Policy', 'Licenses'].map(link => (
                  <button key={link} className="text-dim hover:text-brand-primary font-bold text-sm text-left transition-all hover:translate-x-1">{link}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[11px] font-black text-dim uppercase tracking-widest">
              &copy; {new Date().getFullYear()} VoucherX Protocol. Non-Custodial & Permissionless.
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-status-success rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-status-success uppercase tracking-widest leading-none">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
