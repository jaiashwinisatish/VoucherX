/**
 * Smart Assistant Utilities
 *
 * These functions use rule-based heuristics (if/else logic, thresholds, and
 * deterministic filters) to generate voucher insights. They do NOT use any
 * AI, machine-learning, or language-model APIs.
 */
import { Voucher } from '../types';

export interface VoucherAnalysis {
  totalValue: number;
  totalSavings: number;
  averageDiscount: number;
  expiringCount: number;
  recommendations: string[];
}

export interface DiscountCalculation {
  originalTotal: number;
  finalTotal: number;
  totalDiscount: number;
  discountBreakdown: {
    voucher: string;
    discount: number;
  }[];
  warnings: string[];
}

export const analyzeVouchers = (vouchers: Voucher[]): VoucherAnalysis => {
  const totalValue = vouchers.reduce((sum, v) => sum + v.original_value, 0);
  const totalSavings = vouchers.reduce((sum, v) => sum + (v.original_value - v.selling_price), 0);
  const averageDiscount = vouchers.length > 0
    ? vouchers.reduce((sum, v) => sum + v.discount_percentage, 0) / vouchers.length
    : 0;

  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const expiringVouchers = vouchers.filter(v => {
    const expiryDate = new Date(v.expiry_date);
    return expiryDate <= thirtyDaysFromNow && expiryDate > today;
  });

  const recommendations: string[] = [];

  if (expiringVouchers.length > 0) {
    recommendations.push(
      `⚠️ You have ${expiringVouchers.length} voucher${expiringVouchers.length > 1 ? 's' : ''} expiring within 30 days. Consider using or trading them soon!`
    );
  }

  const lowDiscountVouchers = vouchers.filter(v => v.discount_percentage < 10);
  if (lowDiscountVouchers.length > 0) {
    recommendations.push(
      `💡 ${lowDiscountVouchers.length} of your vouchers have less than 10% discount. You might find better deals in the marketplace.`
    );
  }

  const highValueVouchers = vouchers.filter(v => v.original_value > 100);
  if (highValueVouchers.length > 0) {
    recommendations.push(
      `🌟 You have ${highValueVouchers.length} high-value vouchers (>$100). These are great for trading!`
    );
  }

  if (totalSavings > 50) {
    recommendations.push(
      `🎉 Congratulations! You've saved $${totalSavings.toFixed(2)} through VoucherX. Keep it up!`
    );
  }

  const categoryCount: Record<string, number> = {};
  vouchers.forEach(v => {
    categoryCount[v.category] = (categoryCount[v.category] || 0) + 1;
  });

  const dominantCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
  if (dominantCategory && dominantCategory[1] > vouchers.length / 2) {
    recommendations.push(
      `📊 Most of your vouchers are in the ${dominantCategory[0]} category. Consider diversifying to get more trading opportunities.`
    );
  }

  return {
    totalValue,
    totalSavings,
    averageDiscount: Number(averageDiscount.toFixed(2)),
    expiringCount: expiringVouchers.length,
    recommendations,
  };
};

export const checkExpiryStatus = (vouchers: Voucher[]): {
  expiringSoon: Voucher[];
  expired: Voucher[];
  safe: Voucher[];
} => {
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const expiringSoon: Voucher[] = [];
  const expired: Voucher[] = [];
  const safe: Voucher[] = [];

  vouchers.forEach(voucher => {
    const expiryDate = new Date(voucher.expiry_date);

    if (expiryDate < today) {
      expired.push(voucher);
    } else if (expiryDate <= thirtyDaysFromNow) {
      expiringSoon.push(voucher);
    } else {
      safe.push(voucher);
    }
  });

  return { expiringSoon, expired, safe };
};

export const calculateMultiVoucherDiscount = (
  baseAmount: number,
  vouchers: Voucher[],
  rules?: {
    maxStackable?: number;
    allowSameCategory?: boolean;
    maxTotalDiscount?: number;
  }
): DiscountCalculation => {
  const warnings: string[] = [];
  const discountBreakdown: { voucher: string; discount: number }[] = [];

  const maxStackable = rules?.maxStackable ?? 3;
  const allowSameCategory = rules?.allowSameCategory ?? false;
  const maxTotalDiscount = rules?.maxTotalDiscount ?? 50;

  let applicableVouchers = vouchers.filter(v => v.is_verified);

  if (applicableVouchers.length > maxStackable) {
    applicableVouchers = applicableVouchers
      .sort((a, b) => b.discount_percentage - a.discount_percentage)
      .slice(0, maxStackable);
    warnings.push(`Only ${maxStackable} vouchers can be stacked. Using the best ${maxStackable}.`);
  }

  if (!allowSameCategory) {
    const usedCategories = new Set<string>();
    applicableVouchers = applicableVouchers.filter(v => {
      if (usedCategories.has(v.category)) {
        warnings.push(`Skipping ${v.brand_name} - category ${v.category} already used.`);
        return false;
      }
      usedCategories.add(v.category);
      return true;
    });
  }

  let remainingAmount = baseAmount;
  let totalDiscountAmount = 0;

  applicableVouchers.forEach(voucher => {
    if (voucher.original_value > remainingAmount) {
      warnings.push(`${voucher.brand_name} voucher value ($${voucher.original_value}) exceeds remaining amount ($${remainingAmount.toFixed(2)}).`);
      return;
    }

    const voucherDiscount = voucher.original_value - voucher.selling_price;
    totalDiscountAmount += voucherDiscount;
    remainingAmount -= voucher.original_value;

    discountBreakdown.push({
      voucher: voucher.brand_name,
      discount: voucherDiscount,
    });
  });

  const discountPercentage = (totalDiscountAmount / baseAmount) * 100;
  if (discountPercentage > maxTotalDiscount) {
    const adjustedDiscount = (baseAmount * maxTotalDiscount) / 100;
    warnings.push(`Total discount capped at ${maxTotalDiscount}%. Adjusted from $${totalDiscountAmount.toFixed(2)} to $${adjustedDiscount.toFixed(2)}.`);
    totalDiscountAmount = adjustedDiscount;
  }

  const finalTotal = baseAmount - totalDiscountAmount;

  return {
    originalTotal: baseAmount,
    finalTotal: Math.max(finalTotal, 0),
    totalDiscount: totalDiscountAmount,
    discountBreakdown,
    warnings,
  };
};

export const generateSmartRecommendations = (
  userVouchers: Voucher[],
  marketplaceVouchers: Voucher[],
  userPreferences?: string[]
): string[] => {
  const recommendations: string[] = [];
  const userCategories = new Set(userVouchers.map(v => v.category));

  const bestMarketplaceDeals = marketplaceVouchers
    .filter(v => v.is_verified && v.discount_percentage > 25)
    .sort((a, b) => b.discount_percentage - a.discount_percentage)
    .slice(0, 3);

  if (bestMarketplaceDeals.length > 0) {
    recommendations.push(
      `🔥 Hot deals available: ${bestMarketplaceDeals.map(v => `${v.brand_name} (${v.discount_percentage}% off)`).join(', ')}`
    );
  }

  marketplaceVouchers.forEach(mv => {
    if (userPreferences?.includes(mv.brand_name)) {
      recommendations.push(
        `❤️ Your wishlist brand ${mv.brand_name} is available at ${mv.discount_percentage}% off!`
      );
    }
  });

  const newCategories = marketplaceVouchers
    .filter(v => !userCategories.has(v.category))
    .map(v => v.category);

  const uniqueNewCategories = [...new Set(newCategories)].slice(0, 2);
  if (uniqueNewCategories.length > 0) {
    recommendations.push(
      `🆕 Explore new categories: ${uniqueNewCategories.join(', ')} vouchers are trending!`
    );
  }

  const tradeableVouchers = userVouchers.filter(v => {
    const daysUntilExpiry = Math.ceil(
      (new Date(v.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 60 && v.original_value > 50;
  });

  if (tradeableVouchers.length > 0) {
    recommendations.push(
      `🔄 You have ${tradeableVouchers.length} great vouchers for trading. Check the Exchange page for smart matches!`
    );
  }

  return recommendations;
};

export const optimizeVoucherPortfolio = (vouchers: Voucher[]): {
  keepVouchers: Voucher[];
  tradeVouchers: Voucher[];
  sellVouchers: Voucher[];
  reasons: Record<string, string>;
} => {
  const keepVouchers: Voucher[] = [];
  const tradeVouchers: Voucher[] = [];
  const sellVouchers: Voucher[] = [];
  const reasons: Record<string, string> = {};

  vouchers.forEach(voucher => {
    const daysUntilExpiry = Math.ceil(
      (new Date(voucher.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < 15) {
      if (voucher.discount_percentage > 20) {
        keepVouchers.push(voucher);
        reasons[voucher.id] = 'High discount and expiring soon - use immediately!';
      } else {
        sellVouchers.push(voucher);
        reasons[voucher.id] = 'Low discount and expiring soon - sell quickly to recover value.';
      }
    } else if (daysUntilExpiry < 45) {
      if (voucher.original_value > 75) {
        tradeVouchers.push(voucher);
        reasons[voucher.id] = 'High value with moderate time left - perfect for trading!';
      } else {
        keepVouchers.push(voucher);
        reasons[voucher.id] = 'Good voucher to keep for personal use.';
      }
    } else {
      if (voucher.discount_percentage > 30) {
        keepVouchers.push(voucher);
        reasons[voucher.id] = 'Excellent discount - hold onto this one!';
      } else {
        tradeVouchers.push(voucher);
        reasons[voucher.id] = 'Plenty of time left - great for trading to get better deals.';
      }
    }
  });

  return { keepVouchers, tradeVouchers, sellVouchers, reasons };
};
