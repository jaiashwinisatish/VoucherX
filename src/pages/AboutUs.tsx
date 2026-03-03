import { Heart, Shield, Users, Zap, Target, ArrowRight, Github, Globe, Sparkles, TrendingUp } from 'lucide-react';

interface AboutUsProps {
  onNavigate: (page: string) => void;
}

const teamValues = [
  {
    title: 'Transparency',
    description: 'Every voucher is verified so you always know exactly what you\'re getting.',
    icon: Shield,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Community First',
    description: 'Built by the community, for the community. Our platform thrives on trust and collaboration.',
    icon: Users,
    color: 'from-teal-500 to-cyan-500',
  },
  {
    title: 'Innovation',
    description: 'AI-powered matching and smart recommendations keep you ahead of every deal.',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Sustainability',
    description: 'Reduce voucher waste by trading what you don\'t need for what you do.',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
  },
];

const milestones = [
  { year: '2024', title: 'Idea Born', description: 'VoucherX started as an open-source project to solve voucher waste.' },
  { year: '2025', title: 'Community Growth', description: 'Thousands of users joined, trading vouchers across dozens of brands.' },
  { year: '2026', title: 'AI Integration', description: 'Smart matching and AI-powered insights launched to supercharge trading.' },
];

const stats = [
  { value: '2,500+', label: 'Active Vouchers', icon: Target },
  { value: '1,200+', label: 'Community Members', icon: Users },
  { value: '35%', label: 'Average Savings', icon: TrendingUp },
  { value: '100%', label: 'Open Source', icon: Github },
];

export default function AboutUs({ onNavigate }: AboutUsProps) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-blue-600 to-purple-600 rounded-3xl p-10 md:p-16 text-white">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">About VoucherX</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            We're on a Mission to End Voucher Waste
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8">
            VoucherX is an open-source platform that empowers people to trade, buy, and sell
            vouchers so nothing goes to waste. We believe every voucher deserves to be used —
            and every user deserves a great deal.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('marketplace')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-600 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href="https://github.com/jaiashwinisatish/VoucherX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all"
            >
              <Github className="h-5 w-5" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 text-center cursor-pointer hover:shadow-lg hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          );
        })}
      </section>

      {/* Our Story Section */}
      <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Story</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            We've all been there — a gift card you forgot about, a voucher that expired before
            you could use it, or a discount code for a brand you never shop at. VoucherX was
            created to solve this problem.
          </p>
          <p className="text-slate-600 leading-relaxed mb-6">
            What started as a simple idea has grown into a vibrant community of savvy shoppers
            who trade, buy, and sell vouchers every day. Our AI-powered matching engine ensures
            you always find the best deal, and our verification system means you can trade with
            confidence.
          </p>
          <p className="text-slate-600 leading-relaxed">
            As an open-source project, VoucherX is built by developers who care about creating
            a fairer, more sustainable way to use vouchers. We welcome contributions from
            anyone who shares our vision.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">What We Stand For</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            These core values guide every decision we make and every feature we build.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {teamValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Our Journey</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            From a simple idea to a thriving community — here's how VoucherX has evolved.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 via-blue-500 to-purple-500" />

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`relative flex items-start gap-6 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full border-4 border-white shadow-md z-10" />

                {/* Content card */}
                <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                    <div className="inline-block bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full mb-3">
                      {milestone.year}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{milestone.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source CTA */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-10 md:p-12 text-white text-center">
        <Globe className="h-12 w-12 mx-auto mb-4 text-teal-400" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Built in the Open</h2>
        <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          VoucherX is fully open-source. We believe in transparency, collaboration, and
          building software that belongs to everyone. Contribute code, report bugs, or
          simply star the repo — every bit helps.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://github.com/jaiashwinisatish/VoucherX"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-800 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
          >
            <Github className="h-5 w-5" />
            <span>Star on GitHub</span>
          </a>
          <a
            href="https://github.com/jaiashwinisatish/VoucherX/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
          >
            <span>View Open Issues</span>
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-10 md:p-12 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join?</h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Start trading vouchers today and become part of a community that believes no voucher should go to waste.
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
