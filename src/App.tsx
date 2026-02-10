
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
  },
];

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [isAIOpen, setIsAIOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading VoucherX...</p>
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
        return <Marketplace onNavigate={setCurrentPage} />;
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
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center z-40"
          title="Open AI Assistant"
        >
          <Bot className="h-7 w-7" />
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
