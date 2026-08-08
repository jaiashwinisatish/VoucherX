import { User, Star, TrendingUp, Award, Calendar, CheckCircle, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Profile() {
  const { profile } = useAuth();

  const stats = [
    { label: 'Total Trades', value: profile?.total_trades || 12, icon: TrendingUp, color: 'bg-brand-primary' },
    { label: 'VoucherCoins', value: profile?.voucher_coins || 350, icon: Star, color: 'bg-brand-accent' },
    { label: 'Rating', value: `${profile?.rating || 4.8}/5`, icon: Award, color: 'bg-status-success' },
  ];

  const recentActivity = [
    {
      type: 'trade',
      description: 'Traded Netflix for Starbucks',
      date: '2025-10-07',
      status: 'completed',
    },
    {
      type: 'purchase',
      description: 'Bought Amazon voucher ($100)',
      date: '2025-10-05',
      status: 'completed',
    },
    {
      type: 'sale',
      description: 'Sold Spotify voucher ($30)',
      date: '2025-10-03',
      status: 'completed',
    },
    {
      type: 'trade',
      description: 'Traded Nike for Uber',
      date: '2025-10-01',
      status: 'completed',
    },
  ];

  const reviews = [
    {
      id: '1',
      from: 'John Doe',
      rating: 5,
      comment: 'Great trader! Fast and reliable. Highly recommended.',
      date: '2025-10-06',
    },
    {
      id: '2',
      from: 'Jane Smith',
      rating: 5,
      comment: 'Smooth transaction. Very trustworthy seller.',
      date: '2025-10-04',
    },
    {
      id: '3',
      from: 'Mike Johnson',
      rating: 4,
      comment: 'Good experience overall. Quick response time.',
      date: '2025-10-02',
    },
  ];

  const achievements = [
    { title: 'First Trade', unlocked: true, icon: '🎯' },
    { title: 'Power Trader', unlocked: true, icon: '⚡' },
    { title: 'Trusted Seller', unlocked: true, icon: '🛡️' },
    { title: 'Coin Master', unlocked: false, icon: '👑' },
    { title: 'Top Rated', unlocked: false, icon: '⭐' },
    { title: 'Category King', unlocked: false, icon: '🏆' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        className="bg-gradient-brand rounded-2xl p-8 text-white shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/30">
              <User className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{profile?.full_name || 'User'}</h1>
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(profile?.rating || 4.8) ? 'fill-brand-accent text-brand-accent' : 'text-white/40'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-white/90 font-bold">{profile?.rating?.toFixed(1) || '4.8'} rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm font-medium">Member since October 2025</span>
              </div>
            </div>
          </div>
          <button className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold hover:bg-white/30 transition-all flex items-center space-x-2 border border-white/20 shadow-sm">
            <Settings className="h-5 w-5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border transition-all duration-300 hover:scale-[1.03] shadow-soft group"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-muted-text uppercase tracking-wider">{stat.label}</span>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-main-text">{stat.value}</div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-main-text mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-brand-primary" />
            <span>Recent Activity</span>
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-muted-bg/50 rounded-xl border border-main-border/50 hover:bg-card-hover transition-all group"
              >
                <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-main-text">{activity.description}</p>
                  <p className="text-xs text-dim mt-1">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-xs font-bold text-status-success bg-status-success/10 px-3 py-1 rounded-full capitalize">
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-main-text mb-4 flex items-center space-x-2">
            <Star className="h-5 w-5 text-brand-accent fill-brand-accent" />
            <span>Reviews & Ratings</span>
          </h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-muted-bg/50 rounded-xl border border-main-border/50 hover:bg-card-hover transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-main-text">{review.from}</span>
                  <div className="flex items-center space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-brand-accent text-brand-accent" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-text mb-2 italic">"{review.comment}"</p>
                <p className="text-xs text-dim font-medium">{new Date(review.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-main-text mb-6 flex items-center space-x-2">
          <Award className="h-5 w-5 text-brand-accent" />
          <span>Achievements</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl text-center transition-all duration-300 cursor-default ${achievement.unlocked
                  ? 'bg-gradient-to-br from-brand-primary to-blue-600 text-white shadow-lg hover:scale-110'
                  : 'bg-muted-bg text-dim border border-main-border grayscale opacity-60'
                }`}
            >
              <div className="text-4xl mb-3 filter drop-shadow-md">{achievement.icon}</div>
              <div className="text-xs font-bold leading-tight">{achievement.title}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-xl font-bold text-main-text mb-6 flex items-center space-x-2">
          <Settings className="h-5 w-5 text-muted-text" />
          <span>Trading Preferences</span>
        </h2>
        <div className="space-y-4">
          {[{
            label: 'Email Notifications',
            desc: 'Receive updates about trades and matches',
            on: true,
          }, {
            label: 'Auto-Accept Smart Matches',
            desc: 'Automatically accept trades above 90% match score',
            on: false,
          }, {
            label: 'Expiry Alerts',
            desc: 'Get notified 7 days before voucher expires',
            on: true,
          }].map((pref) => (
            <div
              key={pref.label}
              className="flex items-center justify-between p-5 bg-muted-bg/50 rounded-2xl border border-main-border/50 hover:bg-card-hover transition-all"
            >
              <div>
                <div className="font-bold text-main-text mb-1">{pref.label}</div>
                <div className="text-sm text-muted-text font-medium">{pref.desc}</div>
              </div>
              <button className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all ${pref.on ? 'bg-brand-primary shadow-brand' : 'bg-dim/30'}`}>
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all shadow-md ${pref.on ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
