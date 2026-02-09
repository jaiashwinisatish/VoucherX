import { User, Star, TrendingUp, Award, Calendar, CheckCircle, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Profile() {
  const { profile } = useAuth();

  const stats = [
    { label: 'Total Trades', value: profile?.total_trades || 12, icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
    { label: 'VoucherCoins', value: profile?.voucher_coins || 350, icon: Star, color: 'from-amber-500 to-amber-600' },
    { label: 'Rating', value: `${profile?.rating || 4.8}/5`, icon: Award, color: 'from-emerald-500 to-emerald-600' },
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
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-8 text-white"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <User className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{profile?.full_name || 'User'}</h1>
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(profile?.rating || 4.8) ? 'fill-amber-400 text-amber-400' : 'text-white/40'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white/90">{profile?.rating?.toFixed(1) || '4.8'} rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm">Member since October 2025</span>
              </div>
            </div>
          </div>
          <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center space-x-2">
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
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-transparent hover:bg-gradient-to-br hover:from-blue-500 hover:to-emerald-400 group"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-600">{stat.label}</span>
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:from-fuchsia-500 group-hover:to-cyan-400`}>
                  <Icon className="h-5 w-5 text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-800 group-hover:text-white transition-colors duration-300">{stat.value}</div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="grid lg:grid-cols-2 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.18,
            },
          },
        }}
      >
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
          }}
        >
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-blue-400 hover:scale-[1.03] hover:shadow-xl group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:from-fuchsia-500 group-hover:to-cyan-400 group-hover:scale-110">
                  <CheckCircle className="h-5 w-5 text-white drop-shadow-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{activity.description}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-xs font-semibold text-emerald-600 capitalize group-hover:text-white transition-colors duration-300">
                  {activity.status}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.1 } },
          }}
        >
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Reviews & Ratings</h2>
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                className="p-4 bg-slate-50 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-fuchsia-400 hover:to-amber-300 hover:scale-[1.03] hover:shadow-xl group"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.09 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-800 group-hover:text-white transition-colors duration-300">{review.from}</span>
                  <div className="flex items-center space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2 group-hover:text-white transition-colors duration-300">{review.comment}</p>
                <p className="text-xs text-slate-500 group-hover:text-white transition-colors duration-300">{new Date(review.date).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12,
            },
          },
        }}
      >
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-xl text-center transition-all duration-300 cursor-pointer ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg hover:from-fuchsia-500 hover:to-cyan-400 hover:scale-110 hover:shadow-2xl'
                  : 'bg-slate-100 text-slate-400 hover:bg-gradient-to-br hover:from-slate-300 hover:to-slate-100 hover:text-slate-600 hover:scale-105'
              }`}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
              }}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <div className="text-xs font-semibold">{achievement.title}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Trading Preferences</h2>
        <div className="space-y-4">
          {[{
            label: 'Email Notifications',
            desc: 'Receive updates about trades and matches',
            on: true,
            color: 'bg-gradient-to-r from-teal-500 to-blue-600',
            knob: 'translate-x-6',
          }, {
            label: 'Auto-Accept Smart Matches',
            desc: 'Automatically accept trades above 90% match score',
            on: false,
            color: 'bg-slate-300',
            knob: 'translate-x-1',
          }, {
            label: 'Expiry Alerts',
            desc: 'Get notified 7 days before voucher expires',
            on: true,
            color: 'bg-gradient-to-r from-teal-500 to-blue-600',
            knob: 'translate-x-6',
          }].map((pref, idx) => (
            <motion.div
              key={pref.label}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-fuchsia-400 hover:scale-[1.03] hover:shadow-xl group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <div>
                <div className="font-medium text-slate-800">{pref.label}</div>
                <div className="text-sm text-slate-600">{pref.desc}</div>
              </div>
              <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${pref.color} transition-all duration-300 group-hover:from-fuchsia-500 group-hover:to-cyan-400 group-hover:scale-110`}>
                <span className={`${pref.knob} inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 group-hover:bg-yellow-300`} />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
