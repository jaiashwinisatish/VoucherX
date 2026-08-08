import {
  Repeat,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  Github,
  Heart,
  Lock,
  Clock,
} from 'lucide-react';

interface AboutProps {
  onNavigate: (page: string) => void;
}

export default function About({ onNavigate }: AboutProps) {
  const features = [
    {
      icon: Repeat,
      title: 'Trade & Exchange',
      description:
        'Swap vouchers you don't need for ones you actually want. Our smart matching system finds the best trades for you.',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Verified & Secure',
      description:
        'Every voucher goes through a verification process. Encrypted codes are only revealed after a confirmed purchase.',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: TrendingUp,
      title: 'Save Money',
      description:
        'Buy vouchers at a discount from other users. Every listing shows the exact savings percentage upfront.',
      color: 'from-emerald-500 to-green-500',
    },
    {
      icon: Clock,
      title: 'Never Waste a Voucher',
      description:
        'Get expiry alerts before your vouchers expire. Sell or trade them instead of letting value go to waste.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Lock,
      title: 'Escrow Protection',
      description:
        'Payments are held in escrow until the buyer confirms the voucher works, keeping both parties safe.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Star,
      title: 'Earn Rewards',
      description:
        'Complete challenges, trade vouchers, and earn VoucherCoins. The more you participate, the more you earn.',
      color: 'from-rose-500 to-red-500',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'List or Browse',
      description: 'Post vouchers you want to sell or browse the marketplace for deals.',
    },
    {
      step: '02',
      title: 'Trade or Buy',
      description: 'Swap vouchers with other users or purchase at discounted prices.',
    },
    {
      step: '03',
      title: 'Verify & Redeem',
      description: 'Verified voucher codes are revealed after purchase. Redeem at your leisure.',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '2,500+' },
    { label: 'Vouchers Traded', value: '10,000+' },
    { label: 'Average Savings', value: '22%' },
    { label: 'Brands Supported', value: '150+' },
  ];

  return (
    <div className="space-y-16 pb-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium border border-teal-100">
          <Heart className="h-4 w-4 fill-teal-500 text-teal-500" />
          Open source & community-driven
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 leading-tight">
          About{' '}
          <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            VoucherX
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          VoucherX is a peer-to-peer voucher trading platform that helps people unlock the
          full value of their unused gift cards and vouchers. Instead of letting them expire,
          trade, sell, or exchange them with others.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => onNavigate('marketplace')}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            Explore Marketplace
            <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href="https://github.com/jaiashwinisatish/VoucherX"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:shadow transition-all flex items-center gap-2"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/80 backdrop-blur-md rounded-xl p-5 text-center border border-slate-200 shadow-sm"
          >
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              {stat.value}
            </p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800">Why VoucherX?</h2>
          <p className="text-slate-600 mt-2 max-w-xl mx-auto">
            Everything you need to get the most out of your vouchers and gift cards.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">{feature.title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-8 max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800">How It Works</h2>
          <p className="text-slate-600 mt-2">Three simple steps to start saving.</p>
        </div>
        <div className="space-y-6">
          {howItWorks.map((item, index) => (
            <div
              key={item.step}
              className="flex items-start gap-5 bg-white/80 backdrop-blur-md rounded-xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">{item.step}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('marketplace')}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Open Source */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 sm:p-10 text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-xl">
          <Users className="h-7 w-7 text-teal-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Open Source & Community-Driven</h2>
        <p className="text-slate-300 max-w-lg mx-auto leading-relaxed">
          VoucherX is built in the open. Contributions are welcome — whether it's code,
          bug reports, design feedback, or documentation. Join a growing community of
          developers and shoppers making voucher trading better for everyone.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a
            href="https://github.com/jaiashwinisatish/VoucherX"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-white text-slate-800 rounded-lg font-semibold hover:bg-slate-100 transition-all inline-flex items-center gap-2 text-sm"
          >
            <Github className="h-4 w-4" />
            Contribute on GitHub
          </a>
          <a
            href="https://github.com/jaiashwinisatish/VoucherX/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 border border-slate-600 text-slate-300 rounded-lg font-semibold hover:bg-slate-700 transition-all inline-flex items-center gap-2 text-sm"
          >
            Report an Issue
          </a>
        </div>
      </section>

      {/* Resources */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 text-center">Resources</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="https://github.com/jaiashwinisatish/VoucherX#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/80 backdrop-blur-md rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group block"
          >
            <h3 className="font-semibold text-slate-800 group-hover:text-teal-600 transition-colors flex items-center gap-2">
              Documentation
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Technical docs, setup guides, and API references in the project README.
            </p>
          </a>
          <a
            href="https://github.com/jaiashwinisatish/VoucherX/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/80 backdrop-blur-md rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group block"
          >
            <h3 className="font-semibold text-slate-800 group-hover:text-teal-600 transition-colors flex items-center gap-2">
              Issue Tracker
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Browse open issues, request features, or report bugs on GitHub.
            </p>
          </a>
          <a
            href="https://github.com/jaiashwinisatish/VoucherX/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/80 backdrop-blur-md rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group block"
          >
            <h3 className="font-semibold text-slate-800 group-hover:text-teal-600 transition-colors flex items-center gap-2">
              Discussions
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Ask questions, share ideas, and connect with the community.
            </p>
          </a>
          <button
            onClick={() => onNavigate('home')}
            className="bg-white/80 backdrop-blur-md rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group text-left"
          >
            <h3 className="font-semibold text-slate-800 group-hover:text-teal-600 transition-colors flex items-center gap-2">
              Back to Home
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Explore featured vouchers and get started with VoucherX.
            </p>
          </button>
        </div>
      </section>
    </div>
  );
}
