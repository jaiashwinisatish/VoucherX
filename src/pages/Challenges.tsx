import { Trophy, Star, Zap, TrendingUp, Award, Target, Gift } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'milestone';
  reward: number;
  progress: number;
  total: number;
  completed: boolean;
}

const activeChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Trade Master',
    description: 'Complete 3 successful trades this week',
    type: 'weekly',
    reward: 50,
    progress: 1,
    total: 3,
    completed: false,
  },
  {
    id: '2',
    title: 'Quick Seller',
    description: 'Sell 2 vouchers within 24 hours',
    type: 'daily',
    reward: 30,
    progress: 0,
    total: 2,
    completed: false,
  },
  {
    id: '3',
    title: 'Smart Saver',
    description: 'Save $100 or more through trades',
    type: 'monthly',
    reward: 100,
    progress: 65,
    total: 100,
    completed: false,
  },
  {
    id: '4',
    title: 'Category Explorer',
    description: 'Trade vouchers from 5 different categories',
    type: 'weekly',
    reward: 40,
    progress: 3,
    total: 5,
    completed: false,
  },
];

const completedChallenges: Challenge[] = [
  {
    id: '5',
    title: 'First Trade',
    description: 'Complete your first voucher trade',
    type: 'milestone',
    reward: 25,
    progress: 1,
    total: 1,
    completed: true,
  },
  {
    id: '6',
    title: 'Early Bird',
    description: 'Make a purchase before 9 AM',
    type: 'daily',
    reward: 15,
    progress: 1,
    total: 1,
    completed: true,
  },
];

export default function Challenges() {
  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'weekly':
        return Target;
      case 'daily':
        return Zap;
      case 'monthly':
        return TrendingUp;
      default:
        return Award;
    }
  };

  const getChallengeColor = (type: string) => {
    switch (type) {
      case 'weekly':
        return 'from-blue-500 to-blue-600';
      case 'daily':
        return 'from-amber-500 to-amber-600';
      case 'monthly':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-teal-500 to-teal-600';
    }
  };

  const totalCoins = 350;
  const coinsThisWeek = 50;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-8 text-white transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/30">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Trophy className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Challenges</h1>
            <p className="text-white/90 text-lg">Complete challenges to earn VoucherCoins and rewards</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-100">VoucherCoins</span>
            <Star className="h-5 w-5 text-amber-100 fill-current" />
          </div>
          <div className="text-4xl font-bold mb-1">{totalCoins}</div>
          <div className="text-amber-100 text-sm">+{coinsThisWeek} this week</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100">Active Challenges</span>
            <Target className="h-5 w-5 text-blue-100" />
          </div>
          <div className="text-4xl font-bold mb-1">{activeChallenges.length}</div>
          <div className="text-blue-100 text-sm">Keep going!</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-100">Completed</span>
            <Trophy className="h-5 w-5 text-emerald-100" />
          </div>
          <div className="text-4xl font-bold mb-1">{completedChallenges.length}</div>
          <div className="text-emerald-100 text-sm">All time</div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Active Challenges</h2>
        <div className="space-y-4">
          {activeChallenges.map(challenge => {
            const Icon = getChallengeIcon(challenge.type);
            const colorClass = getChallengeColor(challenge.type);
            const progressPercentage = (challenge.progress / challenge.total) * 100;

            return (
              <div
                key={challenge.id}
                className="bg-gradient-to-br from-white via-yellow-50 to-amber-100 backdrop-blur-sm rounded-xl border border-amber-200 p-6 cursor-pointer transition-all duration-300 group hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-14 h-14 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-400`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-slate-800">{challenge.title}</h3>
                        <div className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-medium capitalize">
                          {challenge.type}
                        </div>
                      </div>
                      <p className="text-slate-600 mb-4">{challenge.description}</p>

                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-semibold text-slate-800">
                            {challenge.progress} / {challenge.total}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500`}
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-pink-400">
                      <Gift className="h-4 w-4" />
                      <span>{challenge.reward}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Completed Challenges</h2>
        <div className="space-y-4">
          {completedChallenges.map(challenge => {
            const Icon = getChallengeIcon(challenge.type);
            const colorClass = getChallengeColor(challenge.type);

            return (
              <div
                key={challenge.id}
                className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 border-2 border-emerald-200 rounded-xl p-6 cursor-pointer transition-all duration-300 group hover:scale-105 hover:-translate-y-2 hover:shadow-lg hover:shadow-emerald-500/20 hover:bg-emerald-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-14 h-14 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-8 group-hover:shadow-lg group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-blue-400`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-slate-800">{challenge.title}</h3>
                        <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <Trophy className="h-3 w-3 fill-current" />
                          <span>Completed</span>
                        </div>
                      </div>
                      <p className="text-slate-600">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-pink-400">
                      <Gift className="h-4 w-4" />
                      <span>+{challenge.reward}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-8 text-white transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/30">
        <div className="flex items-start space-x-4">
          <Trophy className="h-12 w-12 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold mb-3">How to Use VoucherCoins</h3>
            <ul className="space-y-2 text-white/90">
              <li className="flex items-start space-x-2">
                <span className="text-xl">🎁</span>
                <span>Unlock premium features and early access to auctions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-xl">💎</span>
                <span>Get fee-free trades when you have 500+ coins</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-xl">🎟️</span>
                <span>Redeem for real vouchers from partner brands</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-xl">🏆</span>
                <span>Compete on the leaderboard for monthly prizes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
