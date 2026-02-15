import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Activity, DollarSign, Clock, Flame,
  ChevronDown, ChevronUp, BarChart3, Zap, Shield,
  ArrowUpRight, ArrowDownRight, Minus, Sparkles
} from 'lucide-react';
import { Voucher } from '../types';
import {
  predictVoucherDemand,
  analyzeMarket,
  formatSellTime,
  formatPriceRange,
} from '../utils/pricePrediction';

// ============================================
// Voucher Prediction Card (per voucher)
// ============================================
interface PredictionCardProps {
  voucher: Voucher;
  similarVouchers?: Voucher[];
  sellerRating?: number;
  compact?: boolean;
}

export function VoucherPredictionCard({ voucher, similarVouchers = [], sellerRating = 4.0, compact = false }: PredictionCardProps) {
  const [expanded, setExpanded] = useState(false);

  const prediction = predictVoucherDemand({
    voucher,
    similarVouchers,
    sellerRating,
    currentSaves: Math.round(voucher.views * 0.14),
  });

  const demandColors = {
    High: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100' },
    Medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100' },
    Low: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100' },
  };

  const colors = demandColors[prediction.demandScore];

  if (compact) {
    return (
      <div className={`${colors.bg} ${colors.border} border rounded-lg p-3 space-y-2`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-xs font-semibold text-slate-600">AI Insight</span>
          </div>
          <span className={`${colors.badge} ${colors.text} px-2 py-0.5 rounded-full text-xs font-bold`}>
            {prediction.demandEmoji} {prediction.demandScore}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-500">Price</span>
            <p className="font-bold text-slate-800">{formatPriceRange(prediction.suggestedPriceMin, prediction.suggestedPriceMax)}</p>
          </div>
          <div>
            <span className="text-slate-500">Sell Time</span>
            <p className="font-bold text-slate-800">~{formatSellTime(prediction.expectedSellTimeHours, prediction.expectedSellTimeMax)}</p>
          </div>
        </div>
        {prediction.priceAction !== 'hold' && (
          <div className={`flex items-center space-x-1 text-xs ${prediction.priceAction === 'decrease' ? 'text-red-600' : 'text-emerald-600'}`}>
            {prediction.priceAction === 'decrease' ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
            <span>{prediction.priceAction === 'decrease' ? 'Reduce' : 'Increase'} by ₹{prediction.priceActionAmount} for faster sale</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl overflow-hidden transition-all duration-300`}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">AI Price Predictor</h4>
              <p className="text-xs text-slate-500">Confidence: {prediction.confidenceScore}%</p>
            </div>
          </div>
          <span className={`${colors.badge} ${colors.text} px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1`}>
            <span>{prediction.demandEmoji}</span>
            <span>{prediction.demandScore} Demand</span>
          </span>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/70 rounded-lg p-3 text-center">
            <DollarSign className="h-4 w-4 text-teal-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500">Suggested Price</p>
            <p className="text-sm font-bold text-slate-800">{formatPriceRange(prediction.suggestedPriceMin, prediction.suggestedPriceMax)}</p>
          </div>
          <div className="bg-white/70 rounded-lg p-3 text-center">
            <Clock className="h-4 w-4 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500">Sell Time</p>
            <p className="text-sm font-bold text-slate-800">{formatSellTime(prediction.expectedSellTimeHours, prediction.expectedSellTimeMax)}</p>
          </div>
          <div className="bg-white/70 rounded-lg p-3 text-center">
            <Activity className="h-4 w-4 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500">Liquidity</p>
            <p className="text-sm font-bold text-slate-800">{prediction.liquidityScore}%</p>
          </div>
        </div>

        {/* Price Action Alert */}
        {prediction.priceAction !== 'hold' && (
          <div className={`mt-3 flex items-center space-x-2 p-2 rounded-lg ${
            prediction.priceAction === 'decrease' 
              ? 'bg-orange-100 text-orange-700' 
              : 'bg-emerald-100 text-emerald-700'
          }`}>
            {prediction.priceAction === 'decrease' ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
            <span className="text-xs font-medium">
              {prediction.priceAction === 'decrease'
                ? `💡 Reduce price by ₹${prediction.priceActionAmount} for faster sale`
                : `💡 You can increase price by ₹${prediction.priceActionAmount} — demand supports it`}
            </span>
          </div>
        )}
        {prediction.priceAction === 'hold' && (
          <div className="mt-3 flex items-center space-x-2 p-2 rounded-lg bg-blue-100 text-blue-700">
            <Minus className="h-4 w-4" />
            <span className="text-xs font-medium">✅ Your price is well-positioned — hold steady</span>
          </div>
        )}
      </div>

      {/* Expandable Reasoning */}
      <div className="border-t border-slate-200/50">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-2 flex items-center justify-between text-xs text-slate-600 hover:bg-white/30 transition-colors"
        >
          <span className="font-medium">📝 Detailed Reasoning</span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {expanded && (
          <div className="px-4 pb-4 space-y-2">
            {prediction.reasoning.map((reason, i) => (
              <p key={i} className="text-xs text-slate-600 leading-relaxed">
                {reason}
              </p>
            ))}

            {/* Risk Metrics */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200/50">
              <div className="flex items-center space-x-2">
                <Shield className={`h-4 w-4 ${
                  prediction.depreciationRisk === 'Low' ? 'text-emerald-500' :
                  prediction.depreciationRisk === 'Medium' ? 'text-amber-500' : 'text-red-500'
                }`} />
                <div>
                  <p className="text-xs text-slate-500">Depreciation Risk</p>
                  <p className={`text-xs font-bold ${
                    prediction.depreciationRisk === 'Low' ? 'text-emerald-700' :
                    prediction.depreciationRisk === 'Medium' ? 'text-amber-700' : 'text-red-700'
                  }`}>{prediction.depreciationRisk}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-xs text-slate-500">Confidence</p>
                  <p className="text-xs font-bold text-purple-700">{prediction.confidenceScore}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Market Overview Dashboard
// ============================================
interface MarketDashboardProps {
  vouchers: Voucher[];
}

export function MarketDashboard({ vouchers }: MarketDashboardProps) {
  const analytics = analyzeMarket(vouchers);

  const trendIcon = analytics.demandTrend === 'rising'
    ? <TrendingUp className="h-5 w-5 text-emerald-500" />
    : analytics.demandTrend === 'falling'
    ? <TrendingDown className="h-5 w-5 text-red-500" />
    : <Minus className="h-5 w-5 text-amber-500" />;

  const trendColor = analytics.demandTrend === 'rising' ? 'text-emerald-600' : analytics.demandTrend === 'falling' ? 'text-red-600' : 'text-amber-600';

  return (
    <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 rounded-xl border border-purple-200 p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Market Intelligence</h3>
          <p className="text-sm text-slate-500">AI-powered market analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-4 w-4 text-teal-500" />
            <span className="text-xs text-slate-500">Avg Price</span>
          </div>
          <p className="text-xl font-bold text-slate-800">₹{analytics.avgPrice}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-slate-500">Avg Sell Time</span>
          </div>
          <p className="text-xl font-bold text-slate-800">~{analytics.avgSellTime}h</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-slate-500">Avg Discount</span>
          </div>
          <p className="text-xl font-bold text-slate-800">{analytics.avgDiscount}%</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            {trendIcon}
            <span className="text-xs text-slate-500">Demand Trend</span>
          </div>
          <p className={`text-xl font-bold capitalize ${trendColor}`}>{analytics.demandTrend}</p>
        </div>
      </div>

      {analytics.hotCategories.length > 0 && (
        <div className="flex items-center space-x-3">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-sm text-slate-600">
            <span className="font-semibold">Trending:</span>{' '}
            {analytics.hotCategories.map((cat, i) => (
              <span key={cat}>
                <span className="inline-flex items-center px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  {cat}
                </span>
                {i < analytics.hotCategories.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================
// Inline Prediction Badge (tiny, for voucher cards)
// ============================================
interface PredictionBadgeProps {
  voucher: Voucher;
  similarVouchers?: Voucher[];
}

export function PredictionBadge({ voucher, similarVouchers = [] }: PredictionBadgeProps) {
  const prediction = predictVoucherDemand({ voucher, similarVouchers });

  const colors = {
    High: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    Low: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-bold ${colors[prediction.demandScore]}`}>
      <span>{prediction.demandEmoji}</span>
      <span>{prediction.demandScore}</span>
      <span className="text-slate-400">|</span>
      <span>₹{prediction.suggestedPriceMin}-{prediction.suggestedPriceMax}</span>
    </div>
  );
}
