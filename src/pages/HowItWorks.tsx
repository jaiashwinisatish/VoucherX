import { Search, ShieldCheck, Repeat, Wallet, Sparkles, ArrowRight, Gift, TrendingUp, Users, Star } from 'lucide-react';

interface HowItWorksProps {
  onNavigate: (page: string) => void;
}

const steps = [
  {
    number: '01',
    title: 'Browse & Discover',
    description:
      'Explore our marketplace filled with verified vouchers from top brands. Use filters to find the perfect deal by category, discount, or expiry date.',
    icon: Search,
    color: 'from-teal-500 to-cyan-500',
    shadowColor: 'shadow-teal-500/25',
  },
  {
    number: '02',
    title: 'Verify & Trust',
    description:
      'Every voucher listed on VoucherX goes through a verification process. Look for the verified badge to ensure authenticity before you buy.',
    icon: ShieldCheck,
    color: 'from-blue-500 to-indigo-500',
    shadowColor: 'shadow-blue-500/25',
  },
  {
    number: '03',
    title: 'Trade & Exchange',
    description:
      'Have vouchers you don\'t need? Use our AI-powered Smart Exchange to find the best trade matches based on value, brand popularity, and expiry.',
    icon: Repeat,
    color: 'from-purple-500 to-pink-500',
    shadowColor: 'shadow-purple-500/25',
  },
  {
    number: '04',
    title: 'Save & Earn',
    description:
      'Buy vouchers at a discount, earn VoucherCoins by completing challenges, and unlock exclusive rewards. Your wallet keeps everything organized.',
    icon: Wallet,
    color: 'from-amber-500 to-orange-500',
    shadowColor: 'shadow-amber-500/25',
  },
];

const features = [
  {
    title: 'AI-Powered Recommendations',
    description: 'Get personalized voucher suggestions based on your preferences and trading history.',
    icon: Sparkles,
  },
  {
    title: 'Smart Matching',
    description: 'Our algorithm finds the best trade matches so you always get the most value.',
    icon: TrendingUp,
  },
  {
    title: 'Verified Sellers',
    description: 'All sellers are verified and vouchers are authenticated before listing.',
    icon: ShieldCheck,
  },
  {
    title: 'Community Driven',
    description: 'Join thousands of users who are saving money through voucher trading.',
    icon: Users,
  },
  {
    title: 'Earn Rewards',
    description: 'Complete challenges and earn VoucherCoins to unlock premium features.',
    icon: Gift,
  },
  {
    title: 'Wishlist Alerts',
    description: 'Set alerts for your favorite brands and get notified when matching vouchers appear.',
    icon: Star,
  },
];

const stats = [
  { value: '2,500+', label: 'Active Vouchers' },
  { value: '1,200+', label: 'Happy Traders' },
  { value: '35%', label: 'Average Savings' },
  { value: '50+', label: 'Brand Partners' },
];

export default function HowItWorks({ onNavigate }: HowItWorksProps) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-blue-600 to-purple-600 rounded-3xl p-10 md:p-16 text-white text-center">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Simple, Secure, Smart</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How VoucherX Works
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            VoucherX makes it easy to buy, sell, and trade vouchers with confidence.
            Follow these simple steps to start saving today.
          </p>
          <button
            onClick={() => onNavigate('marketplace')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-600 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </section>

      {/* Steps Section */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Four Simple Steps</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            From discovery to savings, here's how you can make the most of your vouchers on VoucherX.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg ${step.shadowColor}`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-sm font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                        STEP {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 text-center cursor-pointer hover:shadow-lg hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300"
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-slate-600">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features Grid */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Why Choose VoucherX?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Built with cutting-edge technology and a user-first approach to make voucher trading effortless.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 cursor-pointer hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-10 md:p-12 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Saving?</h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of savvy shoppers who are getting the most out of their vouchers with VoucherX.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('marketplace')}
            className="px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
          >
            Explore Marketplace
          </button>
          <button
            onClick={() => onNavigate('exchange')}
            className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all"
          >
            Start Trading
          </button>
        </div>
      </section>
    </div>
  );
}
