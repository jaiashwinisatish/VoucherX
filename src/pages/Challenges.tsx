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
        return 'bg-brand-primary';
      case 'daily':
        return 'bg-brand-accent';
      case 'monthly':
        return 'bg-status-success';
      default:
        return 'bg-brand-primary';
    }
  };

  const totalCoins = 350;
  const coinsThisWeek = 50;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-brand rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
            <Trophy className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Challenges</h1>
            <p className="text-white/90 text-lg">Complete challenges to earn VoucherCoins and rewards</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft group hover:scale-[1.03] transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-muted-text uppercase tracking-widest">VoucherCoins</span>
            <div className="p-2 bg-brand-accent/20 rounded-lg group-hover:scale-110 transition-transform">
              <Star className="h-6 w-6 text-brand-accent fill-brand-accent" />
            </div>
          </div>
          <div className="text-4xl font-bold text-main-text mb-1">{totalCoins}</div>
          <div className="text-status-success text-sm font-bold">+{coinsThisWeek} this week</div>
        </div>

        <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft group hover:scale-[1.03] transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-muted-text uppercase tracking-widest">Active Challenges</span>
            <div className="p-2 bg-brand-primary/20 rounded-lg group-hover:scale-110 transition-transform">
              <Target className="h-6 w-6 text-brand-primary" />
            </div>
          </div>
          <div className="text-4xl font-bold text-main-text mb-1">{activeChallenges.length}</div>
          <div className="text-brand-primary text-sm font-bold">Keep going!</div>
        </div>

        <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft group hover:scale-[1.03] transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-muted-text uppercase tracking-widest">Completed</span>
            <div className="p-2 bg-status-success/20 rounded-lg group-hover:scale-110 transition-transform">
              <Trophy className="h-6 w-6 text-status-success" />
            </div>
          </div>
          <div className="text-4xl font-bold text-main-text mb-1">{completedChallenges.length}</div>
          <div className="text-status-success text-sm font-bold">All time progress</div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-main-text flex items-center space-x-2">
          <Zap className="h-6 w-6 text-brand-accent fill-brand-accent" />
          <span>Active Challenges</span>
        </h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {activeChallenges.map(challenge => {
            const Icon = getChallengeIcon(challenge.type);
            const colorClass = getChallengeColor(challenge.type);
            const progressPercentage = (challenge.progress / challenge.total) * 100;

            return (
              <div
                key={challenge.id}
                className="bg-card backdrop-blur-sm rounded-xl border border-main-border p-6 shadow-soft hover:shadow-xl transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-6 flex-1">
                    <div className={`w-14 h-14 ${colorClass} rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg text-white`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-3 mb-2">
                        <h3 className="text-xl font-bold text-main-text">{challenge.title}</h3>
                        <div className="bg-muted-bg text-muted-text border border-main-border px-3 py-1 rounded-full text-xs font-bold capitalize">
                          {challenge.type}
                        </div>
                      </div>
                      <p className="text-muted-text text-sm font-medium mb-4">{challenge.description}</p>

                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs font-bold mb-2">
                          <span className="text-dim uppercase tracking-wider">Progress</span>
                          <span className="text-main-text">
                            {challenge.progress} / {challenge.total}
                          </span>
                        </div>
                        <div className="w-full bg-muted-bg rounded-full h-3 p-1 border border-main-border overflow-hidden">
                          <div
                            className={`h-full ${colorClass} rounded-full transition-all duration-700 ease-out shadow-sm`}
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="bg-gradient-brand text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-md group-hover:scale-110 transition-transform">
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

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-main-text flex items-center space-x-2">
          <Award className="h-6 w-6 text-status-success" />
          <span>Completed Challenges</span>
        </h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {completedChallenges.map(challenge => {
            const Icon = getChallengeIcon(challenge.type);
            const colorClass = getChallengeColor(challenge.type);

            return (
              <div
                key={challenge.id}
                className="bg-card backdrop-blur-sm border border-status-success/20 rounded-xl p-6 shadow-soft opacity-80 group hover:opacity-100 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-6 flex-1">
                    <div className={`w-14 h-14 ${colorClass} rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 text-white shadow-lg`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-3 mb-2">
                        <h3 className="text-xl font-bold text-main-text">{challenge.title}</h3>
                        <div className="bg-status-success/20 text-status-success px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 border border-status-success/20">
                          <Trophy className="h-3 w-3 fill-current" />
                          <span>Redeemed</span>
                        </div>
                      </div>
                      <p className="text-dim text-sm font-medium">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 border border-brand-primary/20">
                      <Star className="h-4 w-4" />
                      <span>+{challenge.reward}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-start space-x-6">
          <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 hidden md:block">
            <Trophy className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-6">How to Use VoucherCoins</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <div className="text-2xl mb-2">🎁</div>
                <h4 className="font-bold mb-1">Premium Perks</h4>
                <p className="text-sm text-white/80">Unlock exclusive features and early access to hot auctions.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <div className="text-2xl mb-2">💎</div>
                <h4 className="font-bold mb-1">Free Trades</h4>
                <p className="text-sm text-white/80">Zero transaction fees once you hit the 500 coin milestone.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <div className="text-2xl mb-2">🎟️</div>
                <h4 className="font-bold mb-1">Real Rewards</h4>
                <p className="text-sm text-white/80">Redeem coins for branded vouchers from our top partners.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <div className="text-2xl mb-2">🏆</div>
                <h4 className="font-bold mb-1">GLory</h4>
                <p className="text-sm text-white/80">Dominate the monthly leaderboards for grand prize pools.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
