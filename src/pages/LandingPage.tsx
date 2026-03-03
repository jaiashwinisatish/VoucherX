import { Repeat, Bot, ArrowRight, ShoppingBag, Wallet, Shield, TrendingUp, Star, Github } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Get smart recommendations and insights powered by AI to maximize the value of your vouchers.',
      gradient: 'from-purple-500 to-blue-600',
    },
    {
      icon: Repeat,
      title: 'Smart Exchange',
      description: "Trade vouchers you don't need for ones you want. Our matching algorithm finds the best deals.",
      gradient: 'from-teal-500 to-emerald-600',
    },
    {
      icon: Wallet,
      title: 'Digital Wallet',
      description: 'Store, organize, and track all your vouchers in one secure place with expiry alerts.',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: ShoppingBag,
      title: 'Marketplace',
      description: 'Browse and purchase discounted vouchers from a curated marketplace of verified sellers.',
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      icon: Shield,
      title: 'Verified & Secure',
      description: 'Every voucher is verified before listing. Trade with confidence knowing your transactions are safe.',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      icon: TrendingUp,
      title: 'Expiry Insights',
      description: 'Never let a voucher go to waste. Get timely reminders and analytics on your portfolio.',
      gradient: 'from-green-500 to-teal-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navbar */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-2 rounded-xl">
                <Repeat className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                VoucherX
              </span>
            </div>
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all text-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 rounded-full px-4 py-1.5 mb-6">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-teal-700">Earn VoucherCoins on every trade</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Trade Vouchers{' '}
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Smartly
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Don't let your vouchers expire. Buy, sell, and exchange gift cards and vouchers with
              AI-powered insights — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
              >
                <span>Start Trading</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <a
                href="https://github.com/jaiashwinisatish/VoucherX"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:border-slate-400 hover:bg-white transition-all flex items-center justify-center space-x-2"
              >
                <Github className="h-5 w-5" />
                <span>View on GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Everything You Need to Manage Vouchers
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            From AI-driven insights to a secure marketplace, VoucherX has you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-lg text-teal-100 mb-8 max-w-xl mx-auto">
              Join VoucherX today and get 100 VoucherCoins as a welcome bonus. Turn unused vouchers into value.
            </p>
            <button
              onClick={onGetStarted}
              className="bg-white text-teal-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all inline-flex items-center space-x-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-1.5 rounded-lg">
                <Repeat className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                VoucherX
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com/jaiashwinisatish/VoucherX"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-700 transition-colors flex items-center space-x-1.5"
              >
                <Github className="h-5 w-5" />
                <span className="text-sm font-medium">GitHub</span>
              </a>
            </div>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} VoucherX. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
