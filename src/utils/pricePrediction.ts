import { Voucher } from '../types';

// ============================================
// Types
// ============================================
export interface VoucherPrediction {
  suggestedPriceMin: number;
  suggestedPriceMax: number;
  expectedSellTimeHours: number;
  expectedSellTimeMax: number;
  demandScore: 'High' | 'Medium' | 'Low';
  demandEmoji: string;
  reasoning: string[];
  confidenceScore: number; // 0-100
  depreciationRisk: 'Low' | 'Medium' | 'High';
  liquidityScore: number; // 0-100
  priceAction: 'increase' | 'hold' | 'decrease';
  priceActionAmount: number;
}

export interface MarketAnalytics {
  avgPrice: number;
  avgSellTime: number;
  totalListings: number;
  avgDiscount: number;
  demandTrend: 'rising' | 'stable' | 'falling';
  hotCategories: string[];
}

export interface PredictionInput {
  voucher: Voucher;
  similarVouchers?: Voucher[];
  sellerRating?: number;
  sellerSuccessRate?: number;
  seasonalEvent?: string;
  currentSaves?: number;
}

// ============================================
// Seasonal Events & Multipliers
// ============================================
const SEASONAL_EVENTS: Record<string, { demandMultiplier: number; categories: string[] }> = {
  'New Year Sale': { demandMultiplier: 1.4, categories: ['tech', 'fashion', 'entertainment'] },
  'Valentine\'s Sale': { demandMultiplier: 1.3, categories: ['food', 'entertainment', 'fashion'] },
  'Republic Day': { demandMultiplier: 1.2, categories: ['tech', 'fashion'] },
  'Holi Festival': { demandMultiplier: 1.25, categories: ['food', 'fashion', 'entertainment'] },
  'Summer Sale': { demandMultiplier: 1.35, categories: ['travel', 'entertainment', 'food'] },
  'Independence Day': { demandMultiplier: 1.2, categories: ['tech', 'fashion'] },
  'Raksha Bandhan': { demandMultiplier: 1.15, categories: ['fashion', 'food'] },
  'Diwali Sale': { demandMultiplier: 1.5, categories: ['tech', 'fashion', 'food', 'entertainment'] },
  'Black Friday': { demandMultiplier: 1.45, categories: ['tech', 'fashion', 'entertainment'] },
  'Christmas Sale': { demandMultiplier: 1.4, categories: ['food', 'entertainment', 'fashion', 'tech'] },
  'End of Season': { demandMultiplier: 1.3, categories: ['fashion'] },
};

// Brand popularity scores (higher = more popular)
const BRAND_POPULARITY: Record<string, number> = {
  'Amazon': 95, 'Flipkart': 90, 'Apple': 92, 'Nike': 88,
  'Starbucks': 82, 'Netflix': 87, 'Spotify': 80, 'Uber': 78,
  'Zomato': 85, 'Swiggy': 84, 'Myntra': 83, 'Ajio': 75,
  'Target': 70, 'Whole Foods': 65, 'Google Play': 77, 'Steam': 76,
};

// Category base demand
const CATEGORY_DEMAND: Record<string, number> = {
  'tech': 85, 'food': 80, 'fashion': 75, 'entertainment': 72,
  'travel': 68, 'health': 65, 'education': 60,
};

// ============================================
// Helper Functions
// ============================================
function getDaysRemaining(expiryDate: string): number {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return Math.max(0, Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

function getExpiryRiskFactor(daysRemaining: number): { factor: number; label: string } {
  if (daysRemaining <= 0) return { factor: 0, label: 'Expired' };
  if (daysRemaining <= 3) return { factor: 0.3, label: 'Critical - expires in days' };
  if (daysRemaining <= 7) return { factor: 0.5, label: 'High risk - less than a week' };
  if (daysRemaining <= 15) return { factor: 0.7, label: 'Moderate risk - ~2 weeks left' };
  if (daysRemaining <= 30) return { factor: 0.85, label: 'Low risk - ~1 month left' };
  if (daysRemaining <= 60) return { factor: 0.93, label: 'Safe - 1-2 months left' };
  return { factor: 1.0, label: 'Very safe - plenty of time' };
}

function getEngagementScore(views: number, saves?: number): number {
  const viewScore = Math.min(views / 5, 100); // Cap at 500 views = 100
  const saveScore = saves ? Math.min(saves * 3, 100) : viewScore * 0.15;
  return Math.round(viewScore * 0.6 + saveScore * 0.4);
}

function detectCurrentSeason(): string | null {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  if (month === 1 && day <= 15) return 'New Year Sale';
  if (month === 1 && day === 26) return 'Republic Day';
  if (month === 2 && day >= 7 && day <= 14) return 'Valentine\'s Sale';
  if (month === 3 && day >= 10 && day <= 20) return 'Holi Festival';
  if (month >= 4 && month <= 5) return 'Summer Sale';
  if (month === 8 && day === 15) return 'Independence Day';
  if (month === 8 && day >= 20) return 'Raksha Bandhan';
  if (month === 10 || (month === 11 && day <= 5)) return 'Diwali Sale';
  if (month === 11 && day >= 20 && day <= 30) return 'Black Friday';
  if (month === 12 && day >= 15) return 'Christmas Sale';
  return null;
}

// ============================================
// Main Prediction Engine
// ============================================
export function predictVoucherDemand(input: PredictionInput): VoucherPrediction {
  const { voucher, similarVouchers = [], sellerRating = 3.5, sellerSuccessRate = 70, currentSaves = 0 } = input;
  const seasonalEvent = input.seasonalEvent || detectCurrentSeason();

  const daysRemaining = getDaysRemaining(voucher.expiry_date);
  const expiryRisk = getExpiryRiskFactor(daysRemaining);
  const engagementScore = getEngagementScore(voucher.views, currentSaves);
  const brandPop = BRAND_POPULARITY[voucher.brand_name] || 60;
  const categoryDemand = CATEGORY_DEMAND[voucher.category] || 60;

  // ---- DEMAND CALCULATION ----
  let demandScore = 0;

  // 1. Brand popularity (0-25)
  demandScore += (brandPop / 100) * 25;

  // 2. Category demand (0-20)
  demandScore += (categoryDemand / 100) * 20;

  // 3. Expiry factor (0-15) - more time = higher demand
  demandScore += expiryRisk.factor * 15;

  // 4. Engagement (0-20)
  demandScore += (engagementScore / 100) * 20;

  // 5. Seller reputation (0-10)
  demandScore += (sellerRating / 5) * 5 + (sellerSuccessRate / 100) * 5;

  // 6. Seasonal boost (0-10)
  let seasonalBoost = 0;
  if (seasonalEvent && SEASONAL_EVENTS[seasonalEvent]) {
    const event = SEASONAL_EVENTS[seasonalEvent];
    if (event.categories.includes(voucher.category)) {
      seasonalBoost = (event.demandMultiplier - 1) * 20; // Up to 10 points
      demandScore += Math.min(seasonalBoost, 10);
    }
  }

  // 7. Discount attractiveness bonus
  const discountBonus = voucher.discount_percentage > 20 ? 5 : voucher.discount_percentage > 10 ? 2.5 : 0;
  demandScore += discountBonus;

  demandScore = Math.min(Math.round(demandScore), 100);

  // ---- DEMAND LABEL ----
  const demandLabel: 'High' | 'Medium' | 'Low' = demandScore >= 70 ? 'High' : demandScore >= 45 ? 'Medium' : 'Low';
  const demandEmoji = demandLabel === 'High' ? '🔥' : demandLabel === 'Medium' ? '📊' : '❄️';

  // ---- PRICE PREDICTION ----
  const currentDiscount = ((voucher.original_value - voucher.selling_price) / voucher.original_value) * 100;

  // Compute fair market value
  let fairValueFactor = 1.0;
  if (demandScore >= 70) fairValueFactor = 0.88; // High demand → can sell at ~88% of original
  else if (demandScore >= 45) fairValueFactor = 0.80;
  else fairValueFactor = 0.70;

  // Adjust for expiry
  fairValueFactor *= expiryRisk.factor;

  // Adjust for brand premium
  if (brandPop >= 85) fairValueFactor += 0.05;

  // Similar voucher analysis
  if (similarVouchers.length > 0) {
    const similarPrices = similarVouchers
      .filter(sv => sv.category === voucher.category)
      .map(sv => sv.selling_price / sv.original_value);
    if (similarPrices.length > 0) {
      const avgRatio = similarPrices.reduce((a, b) => a + b, 0) / similarPrices.length;
      fairValueFactor = (fairValueFactor + avgRatio) / 2; // Blend with market
    }
  }

  const fairValue = Math.round(voucher.original_value * fairValueFactor);
  const priceMin = Math.max(Math.round(fairValue * 0.95), Math.round(voucher.original_value * 0.5));
  const priceMax = Math.min(Math.round(fairValue * 1.08), Math.round(voucher.original_value * 0.98));

  // ---- SELL TIME PREDICTION ----
  let baseSellHours = 24;

  if (demandScore >= 80) baseSellHours = 4;
  else if (demandScore >= 70) baseSellHours = 8;
  else if (demandScore >= 55) baseSellHours = 18;
  else if (demandScore >= 40) baseSellHours = 36;
  else baseSellHours = 72;

  // High engagement reduces sell time
  if (engagementScore > 60) baseSellHours *= 0.7;

  // Seller reputation factor
  if (sellerRating >= 4.5) baseSellHours *= 0.8;
  else if (sellerRating < 3) baseSellHours *= 1.3;

  // Seasonal boost
  if (seasonalBoost > 3) baseSellHours *= 0.75;

  const sellTimeMin = Math.max(1, Math.round(baseSellHours * 0.7));
  const sellTimeMax = Math.max(2, Math.round(baseSellHours * 1.3));

  // ---- DEPRECIATION RISK ----
  const depreciationRisk: 'Low' | 'Medium' | 'High' =
    daysRemaining <= 7 ? 'High' : daysRemaining <= 21 ? 'Medium' : 'Low';

  // ---- LIQUIDITY SCORE ----
  const liquidityScore = Math.min(100, Math.round(
    demandScore * 0.5 + engagementScore * 0.3 + (sellerRating / 5) * 100 * 0.2
  ));

  // ---- PRICE ACTION RECOMMENDATION ----
  let priceAction: 'increase' | 'hold' | 'decrease' = 'hold';
  let priceActionAmount = 0;

  if (voucher.selling_price > priceMax) {
    priceAction = 'decrease';
    priceActionAmount = voucher.selling_price - fairValue;
  } else if (voucher.selling_price < priceMin && demandScore >= 65) {
    priceAction = 'increase';
    priceActionAmount = fairValue - voucher.selling_price;
  }

  // ---- REASONING ----
  const reasoning: string[] = [];

  // Expiry reasoning
  if (daysRemaining <= 7) {
    reasoning.push(`⚠️ Voucher expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} — high urgency, price aggressively to sell fast`);
  } else if (daysRemaining <= 30) {
    reasoning.push(`⏰ Expires in ${daysRemaining} days — moderate time pressure`);
  } else {
    reasoning.push(`✅ ${daysRemaining} days until expiry — low risk for buyers`);
  }

  // Price competitiveness
  if (voucher.selling_price <= fairValue) {
    reasoning.push(`💰 Price is competitive with fair market value (₹${fairValue})`);
  } else {
    reasoning.push(`📉 Current price is above fair market value (₹${fairValue}) — consider reducing`);
  }

  // Engagement
  if (engagementScore >= 60) {
    reasoning.push(`👀 High user engagement (${voucher.views} views${currentSaves ? `, ${currentSaves} saves` : ''}) — strong buyer interest`);
  } else if (engagementScore >= 30) {
    reasoning.push(`📊 Moderate engagement (${voucher.views} views) — attracting some interest`);
  } else {
    reasoning.push(`🔍 Low engagement (${voucher.views} views) — consider improving listing visibility`);
  }

  // Seller rep
  if (sellerRating >= 4.5) {
    reasoning.push(`⭐ Strong seller reputation (${sellerRating} rating) — builds buyer confidence`);
  } else if (sellerRating >= 3.5) {
    reasoning.push(`👤 Average seller reputation (${sellerRating} rating)`);
  } else {
    reasoning.push(`⚠️ Below-average seller rating (${sellerRating}) — may reduce buyer trust`);
  }

  // Seasonal
  if (seasonalEvent) {
    if (seasonalBoost > 3) {
      reasoning.push(`🎉 ${seasonalEvent} is boosting demand for ${voucher.category} vouchers!`);
    } else {
      reasoning.push(`📅 ${seasonalEvent} is active but doesn't strongly impact ${voucher.category}`);
    }
  }

  // Brand
  if (brandPop >= 85) {
    reasoning.push(`🏷️ ${voucher.brand_name} is a highly popular brand — commands premium pricing`);
  }

  // Discount
  if (currentDiscount >= 25) {
    reasoning.push(`🎯 ${currentDiscount.toFixed(0)}% discount is very attractive to buyers`);
  }

  // Confidence score
  const confidenceScore = Math.min(100, Math.round(
    50 + (similarVouchers.length > 0 ? 20 : 0) + (engagementScore > 30 ? 15 : 0) + (sellerRating >= 4 ? 10 : 0) + (seasonalEvent ? 5 : 0)
  ));

  return {
    suggestedPriceMin: priceMin,
    suggestedPriceMax: priceMax,
    expectedSellTimeHours: sellTimeMin,
    expectedSellTimeMax: sellTimeMax,
    demandScore: demandLabel,
    demandEmoji,
    reasoning,
    confidenceScore,
    depreciationRisk,
    liquidityScore,
    priceAction,
    priceActionAmount: Math.abs(Math.round(priceActionAmount)),
  };
}

// ============================================
// Market Analytics for Dashboard
// ============================================
export function analyzeMarket(vouchers: Voucher[]): MarketAnalytics {
  if (vouchers.length === 0) {
    return { avgPrice: 0, avgSellTime: 0, totalListings: 0, avgDiscount: 0, demandTrend: 'stable', hotCategories: [] };
  }

  const avgPrice = Math.round(vouchers.reduce((sum, v) => sum + v.selling_price, 0) / vouchers.length);
  const avgDiscount = Math.round(vouchers.reduce((sum, v) => sum + v.discount_percentage, 0) / vouchers.length);

  // Hot categories = most listings
  const categoryCounts: Record<string, number> = {};
  vouchers.forEach(v => {
    categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
  });
  const hotCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);

  // Simulate demand trend based on avg views
  const avgViews = vouchers.reduce((sum, v) => sum + v.views, 0) / vouchers.length;
  const demandTrend: 'rising' | 'stable' | 'falling' = avgViews > 200 ? 'rising' : avgViews > 100 ? 'stable' : 'falling';

  // Estimate avg sell time from demand
  const avgSellTime = demandTrend === 'rising' ? 8 : demandTrend === 'stable' ? 18 : 36;

  return {
    avgPrice,
    avgSellTime,
    totalListings: vouchers.length,
    avgDiscount,
    demandTrend,
    hotCategories,
  };
}

// ============================================
// Format helpers for UI
// ============================================
export function formatSellTime(minHours: number, maxHours: number): string {
  const format = (h: number) => {
    if (h < 1) return '< 1 hour';
    if (h < 24) return `${h} hour${h !== 1 ? 's' : ''}`;
    const days = Math.round(h / 24);
    return `${days} day${days !== 1 ? 's' : ''}`;
  };
  return `${format(minHours)} – ${format(maxHours)}`;
}

export function formatPriceRange(min: number, max: number): string {
  return `₹${min.toLocaleString()} – ₹${max.toLocaleString()}`;
}
