
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Layout from './components/Layout';
import AIAssistant from './components/AIAssistant';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Exchange from './pages/Exchange';
import Wallet from './pages/Wallet';
import Challenges from './pages/Challenges';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import { Voucher } from './types';
import { Bot } from 'lucide-react';
import ExpiryInsights from "./pages/ExpiryInsights";
import ErrorBoundary from "./components/ErrorBoundary";



const mockUserVouchers: Voucher[] = [
  {
    id: 'my1',
    seller_id: 'currentUser',
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
    voucher_code: 'AMZ-XXXX-1111',
    description: 'Valid for all items',
  },
  {
    id: 'my2',
    seller_id: 'currentUser',
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
    voucher_code: 'SBUX-XXXX-2222',
    description: 'Valid at all outlets',
  },
  {
    id: 'my3',
    seller_id: 'currentUser',
    brand_name: 'Nike',
    category: 'fashion',
    original_value: 150,
    selling_price: 120,
    discount_percentage: 20,
    expiry_date: '2025-10-25',
    status: 'verified',
    is_verified: true,
    views: 156,
    created_at: '2025-10-05',
    voucher_code: 'NIKE-XXXX-3333',
    description: 'Valid on online store',
  },
];

const mockMarketplaceVouchers: Voucher[] = [
  {
    id: '1',
    seller_id: 'user1',
    brand_name: 'Apple',
    category: 'tech',
    original_value: 200,
    selling_price: 170,
    discount_percentage: 15,
    expiry_date: '2025-12-31',
    status: 'verified',
    is_verified: true,
    views: 345,
    created_at: '2025-10-01',
    voucher_code: 'APL-XXXX-4444',
    description: 'Valid for all products',
  },
  {
    id: '2',
    seller_id: 'user2',
    brand_name: 'Netflix',
    category: 'entertainment',
    original_value: 60,
    selling_price: 45,
    discount_percentage: 25,
    expiry_date: '2025-11-30',
    status: 'verified',
    is_verified: true,
    views: 289,
    created_at: '2025-10-02',
    voucher_code: 'NFLX-XXXX-5555',
    description: 'Premium subscription',
  },
];

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [isAIOpen, setIsAIOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-text font-bold">Initializing VoucherX...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} onOpenAI={() => setIsAIOpen(true)} />;
      case 'marketplace':
        return <Marketplace />;
      case 'exchange':
        return <Exchange onNavigate={setCurrentPage} />;
      case 'wallet':
        return <Wallet />;
      case 'challenges':
        return <Challenges />;
      case 'wishlist':
        return <Wishlist />;
      case 'profile':
        return <Profile />;
      case 'expiry-insights':
        return <ExpiryInsights />;

      default:
        return <Home onNavigate={setCurrentPage} onOpenAI={() => setIsAIOpen(true)} />;
    }
  };

  return (
    <>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage} onOpenAI={() => setIsAIOpen(true)}>
        {renderPage()}
      </Layout>

      <AIAssistant
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        userVouchers={mockUserVouchers}
        marketplaceVouchers={mockMarketplaceVouchers}
      />

      {!isAIOpen && (
        <button
          onClick={() => setIsAIOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-brand text-white rounded-full shadow-brand hover:scale-110 hover:rotate-6 transition-all flex items-center justify-center z-40 border-2 border-white/20"
          title="Open AI Assistant"
        >
          <Bot className="h-8 w-8" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-status-error rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </button>
      )}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}


export default App;
