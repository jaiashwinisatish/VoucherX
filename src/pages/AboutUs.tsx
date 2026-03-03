import {
  Repeat,
  Users,
  Shield,
  Sparkles,
  Globe,
  Heart,
  Target,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle,
  Zap,
  Github,
} from 'lucide-react';

interface AboutUsProps {
  onNavigate: (page: string) => void;
}

export default function AboutUs({ onNavigate }: AboutUsProps) {
  const coreValues = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'Every voucher is verified before listing. Our verification system ensures authenticity so you can trade with confidence.',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We build for our community. User feedback drives our roadmap, and every feature is designed to make trading easier.',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'From AI-powered matching to smart portfolio analysis, we leverage cutting-edge technology to maximize your savings.',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      icon: Globe,
      title: 'Sustainability',
      description: 'We believe in reducing waste. Every traded voucher is a voucher saved from expiring unused — better for wallets and the planet.',
      gradient: 'from-amber-500 to-orange-600',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users', icon: Users },
    { value: '50K+', label: 'Vouchers Traded', icon: Repeat },
    { value: '95%', label: 'Satisfaction Rate', icon: Heart },
    { value: '$2M+', label: 'Total Savings', icon: TrendingUp },
  ];

  const teamHighlights = [
    {
      title: 'Open Source',
      description: 'VoucherX is proudly open source. We welcome contributions from developers worldwide to make the platform even better.',
      icon: Github,
    },
    {
      title: 'Community Driven',
      description: 'Our features are shaped by real user needs. We listen, iterate, and ship improvements based on community feedback.',
      icon: Users,
    },
    {
      title: 'Security Focused',
      description: 'Built with security best practices — from Supabase authentication to row-level security policies on every database table.',
      icon: Shield,
    },
  ];

  const milestones = [
    {
      year: '2024',
      title: 'The Idea',
      description: 'VoucherX was born from a simple frustration — too many gift cards and vouchers expiring unused in drawers everywhere.',
    },
    {
      year: '2025',
      title: 'Platform Launch',
      description: 'We launched the marketplace with core trading features, AI-powered matching, and a growing community of early adopters.',
    },
    {
      year: '2026',
      title: 'Growing Together',
      description: 'Open-sourced and thriving. Multi-brand support, challenges, wishlists, and smart exchange — all built with our community.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-8 sm:p-12 text-white">
        <div className="max-w-3xl">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            <Heart className="h-4 w-4 mr-2 fill-current" />
            Our Story
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
            Making Every Voucher
            <br />
            <span className="text-white/90">Count</span>
          </h1>
          <p className="text-lg text-white/90 leading-relaxed max-w-2xl">
            VoucherX is on a mission to eliminate voucher waste. We connect people who have vouchers they
            won't use with people who want them — creating value for everyone and ensuring no discount goes to waste.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 text-center hover:shadow-lg transition-all"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl mb-3">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600 mt-1 font-medium">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Our Story Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
            <p>
              It started with a simple observation: billions of dollars in gift cards and vouchers go unused
              every year. People receive vouchers for brands they don't shop at, forget about cards tucked in wallets,
              or let digital codes expire in their inboxes.
            </p>
            <p>
              We asked ourselves: <span className="font-semibold text-slate-800">what if there was a better way?</span> What if
              you could trade that unused coffee shop voucher for one at your favorite clothing store? What if AI could
              match you with the perfect trade partner?
            </p>
            <p>
              That's how VoucherX was born — a smart, community-driven marketplace where every voucher finds its
              perfect owner. Today, we're helping thousands of users save money and reduce waste, one trade at a time.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">What We Stand For</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Our core values guide every decision we make and every feature we build.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-r ${value.gradient} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Our Journey</h2>
          <p className="text-slate-600 text-lg">From idea to impact — here's how we got here.</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{milestone.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{milestone.description}</p>
                  {index < milestones.length - 1 && (
                    <div className="mt-6 border-l-2 border-dashed border-slate-200 h-4 ml-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team / Open Source Section */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Built in the Open</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            VoucherX is an open-source project. Here's what makes our approach special.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {teamHighlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200 text-center hover:shadow-lg transition-all"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl mb-5">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">{highlight.title}</h3>
                <p className="text-slate-600 leading-relaxed">{highlight.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 sm:p-12 text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">What Makes VoucherX Different</h2>
          <div className="space-y-5">
            {[
              { icon: Zap, text: 'AI-powered smart matching finds the best trades for you automatically' },
              { icon: Shield, text: 'Every voucher is verified before listing — no scams, no expired codes' },
              { icon: Award, text: 'Earn VoucherCoins through challenges, referrals, and active trading' },
              { icon: Target, text: 'Wishlist alerts notify you instantly when your desired vouchers become available' },
              { icon: TrendingUp, text: 'Portfolio analytics help you maximize the value of your voucher collection' },
              { icon: Globe, text: 'Support for 50+ brands across tech, food, fashion, entertainment, and more' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center mt-0.5">
                    <Icon className="h-4 w-4 text-teal-400" />
                  </div>
                  <p className="text-white/90 leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Open Source CTA */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl mb-5">
          <Github className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Contribute to VoucherX</h2>
        <p className="text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
          VoucherX is open source and welcomes contributions. Whether you're fixing bugs, adding features,
          or improving docs — every contribution makes a difference.
        </p>
        <a
          href="https://github.com/jaiashwinisatish/VoucherX"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          <Github className="h-5 w-5" />
          <span>View on GitHub</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      {/* Join Us CTA */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-8 sm:p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
        <p className="text-white/90 max-w-xl mx-auto mb-8 text-lg">
          Join thousands of users who are already saving money by trading vouchers on VoucherX.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('marketplace')}
            className="w-full sm:w-auto px-8 py-4 bg-white text-teal-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => onNavigate('exchange')}
            className="w-full sm:w-auto px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/30 hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Repeat className="h-5 w-5" />
            <span>Start Trading</span>
          </button>
        </div>
        <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-white/80">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Free to use</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Verified vouchers</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>AI-powered matching</span>
          </div>
        </div>
      </div>
    </div>
  );
}
