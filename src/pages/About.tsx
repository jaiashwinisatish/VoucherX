import { Repeat, Bot, ShoppingBag, Wallet, Trophy, Shield, TrendingUp, Heart, Users, Zap, Target, Clock } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: ShoppingBag,
      title: 'Marketplace',
      description: 'Browse and buy discounted vouchers from verified sellers. Save money on your favorite brands.',
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      icon: Repeat,
      title: 'Smart Exchange',
      description: 'Trade vouchers you no longer need for ones you actually want. Our system finds the best matches.',
      gradient: 'from-teal-500 to-emerald-600',
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Get personalized recommendations and insights powered by AI to maximize your voucher value.',
      gradient: 'from-purple-500 to-blue-600',
    },
    {
      icon: Wallet,
      title: 'Digital Wallet',
      description: 'Store and manage all your vouchers in one secure place with real-time balance tracking.',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: Trophy,
      title: 'Challenges & Rewards',
      description: 'Complete challenges to earn VoucherCoins. The more you trade, the more you earn.',
      gradient: 'from-yellow-500 to-amber-600',
    },
    {
      icon: Clock,
      title: 'Expiry Insights',
      description: 'Never let a voucher go to waste. Get timely alerts before your vouchers expire.',
      gradient: 'from-blue-500 to-indigo-600',
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Verified & Secure',
      description: 'Every voucher is verified before listing. Trade with confidence.',
    },
    {
      icon: TrendingUp,
      title: 'Save More Money',
      description: 'Buy vouchers at discounted prices and stretch your budget further.',
    },
    {
      icon: Zap,
      title: 'Instant Transactions',
      description: 'Fast and seamless trading experience with real-time updates.',
    },
    {
      icon: Users,
      title: 'Growing Community',
      description: 'Join thousands of savvy shoppers trading vouchers every day.',
    },
    {
      icon: Target,
      title: 'Personalized Deals',
      description: 'AI-powered recommendations tailored to your preferences and needs.',
    },
    {
      icon: Heart,
      title: 'Wishlist Tracking',
      description: 'Save vouchers you want and get notified when prices drop.',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl mb-6">
          <Repeat className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
          About{' '}
          <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            VoucherX
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          VoucherX is a smart voucher trading platform that helps you buy, sell, and exchange
          gift cards and vouchers. Stop letting unused vouchers go to waste — turn them into
          value with AI-powered insights and a thriving community of traders.
        </p>
      </section>

      {/* What is VoucherX */}
      <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">What is VoucherX?</h2>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            Have you ever received a gift card you never used? Or found a voucher buried in your
            email that expired before you could redeem it? VoucherX solves this problem.
          </p>
          <p>
            We provide a platform where users can list their unused vouchers for sale at discounted
            prices, exchange them for vouchers they actually want, or discover great deals on the
            marketplace. Our AI assistant helps you make smarter trading decisions by analyzing
            market trends and your personal preferences.
          </p>
          <p>
            Whether you are a casual shopper looking to save or an active trader maximizing
            value, VoucherX gives you the tools to get the most out of every voucher.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Key Features</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Everything you need to manage, trade, and maximize the value of your vouchers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Benefits */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Why VoucherX?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Here are some reasons why thousands of users trust VoucherX for their voucher needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-slate-100 hover:bg-white/80 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-3xl p-8 sm:p-12 text-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Sign Up & List</h3>
            <p className="text-teal-100 text-sm leading-relaxed">
              Create your free account and list any unused vouchers you want to sell or exchange.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Trade & Earn</h3>
            <p className="text-teal-100 text-sm leading-relaxed">
              Browse the marketplace, exchange vouchers, and earn VoucherCoins with every trade.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Save & Enjoy</h3>
            <p className="text-teal-100 text-sm leading-relaxed">
              Redeem discounted vouchers on your favorite brands and save money on every purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-slate-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Open Source</h2>
        <p className="text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
          VoucherX is proudly open source. We believe in transparency and community-driven
          development. Contributions, feedback, and ideas are always welcome.
        </p>
        <a
          href="https://github.com/jaiashwinisatish/VoucherX"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          <span>View on GitHub</span>
        </a>
      </section>
    </div>
  );
}
