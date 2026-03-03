import {
  Repeat,
  ShieldCheck,
  TrendingUp,
  Users,
  Sparkles,
  ArrowRight,
  Gift,
  Star,
  Zap,
  Globe,
  CheckCircle,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Verified Vouchers',
      description: 'Every voucher is verified for authenticity before being listed, so you can trade with confidence.',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: TrendingUp,
      title: 'Smart Pricing',
      description: 'AI-powered recommendations help you get the best deals and maximize your savings on every trade.',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Join thousands of users who trade vouchers safely. Our rating system keeps the community reliable.',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      icon: Sparkles,
      title: 'AI Assistant',
      description: 'Get personalized insights, portfolio analysis, and smart matching powered by our built-in AI assistant.',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: Gift,
      title: 'Earn Rewards',
      description: 'Complete challenges, refer friends, and earn VoucherCoins that you can use towards premium features.',
      gradient: 'from-rose-500 to-red-600',
    },
    {
      icon: Globe,
      title: 'Multi-Brand Support',
      description: 'Trade vouchers from 50+ brands across tech, food, fashion, entertainment, and more categories.',
      gradient: 'from-cyan-500 to-blue-600',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50K+', label: 'Vouchers Traded' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '$2M+', label: 'Total Savings' },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Sign up in seconds with just your email. No credit card required to get started.',
    },
    {
      number: '02',
      title: 'List or Browse Vouchers',
      description: 'Add your unused vouchers or browse the marketplace for amazing deals from verified sellers.',
    },
    {
      number: '03',
      title: 'Trade & Save',
      description: 'Match with other users, trade vouchers you don\'t need, and save on the brands you love.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Repeat className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                VoucherX
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onGetStarted}
                className="px-5 py-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={onGetStarted}
                className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-8">
            <Zap className="h-4 w-4 mr-2" />
            The smart way to manage & trade vouchers
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
            Don't Let Your
            <br />
            <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
              Vouchers Expire
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Trade unused vouchers, discover amazing deals, and save money with
            VoucherX — the trusted marketplace for smart voucher management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <span>Get Started — It's Free</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold text-lg border-2 border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all"
            >
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Trade Smart
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              VoucherX gives you powerful tools to manage, trade, and maximize the value of your vouchers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Start trading vouchers in minutes. No complicated setup required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl text-white text-2xl font-bold mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute">
                    <ArrowRight className="h-6 w-6 text-slate-300 mt-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Trust Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Loved by Thousands of Users
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Here's what our community has to say about VoucherX.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah M.',
                role: 'Frequent Trader',
                text: "I saved over $500 last year by trading vouchers I wasn't going to use. VoucherX makes it incredibly easy!",
              },
              {
                name: 'James K.',
                role: 'New User',
                text: 'The AI assistant helped me optimize my voucher portfolio within minutes. Super impressed with the smart matching.',
              },
              {
                name: 'Emily R.',
                role: 'Power User',
                text: 'The verification system gives me confidence that every voucher I buy is legit. Great community and platform!',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-3xl p-12 sm:p-16 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Start Saving?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
              Join VoucherX today and never let another voucher go to waste. It's free to sign up!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-white text-teal-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
              >
                <span>Create Free Account</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-white/80">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Free forever plan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Repeat className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold text-slate-700">VoucherX</span>
          </div>
          <p>© {new Date().getFullYear()} VoucherX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
