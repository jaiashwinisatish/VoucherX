import { useState } from 'react';

/**
 * Maps common brand names to their domain for logo fetching.
 * Uses logo.clearbit.com as a free, high-quality logo API.
 */
const BRAND_DOMAINS: Record<string, string> = {
  amazon: 'amazon.com',
  starbucks: 'starbucks.com',
  nike: 'nike.com',
  uber: 'uber.com',
  spotify: 'spotify.com',
  netflix: 'netflix.com',
  apple: 'apple.com',
  google: 'google.com',
  walmart: 'walmart.com',
  target: 'target.com',
  'best buy': 'bestbuy.com',
  bestbuy: 'bestbuy.com',
  adidas: 'adidas.com',
  zara: 'zara.com',
  sephora: 'sephora.com',
  nordstrom: 'nordstrom.com',
  ikea: 'ikea.com',
  costco: 'costco.com',
  'home depot': 'homedepot.com',
  mcdonald: 'mcdonalds.com',
  mcdonalds: 'mcdonalds.com',
  "mcdonald's": 'mcdonalds.com',
  'pizza hut': 'pizzahut.com',
  dominos: 'dominos.com',
  "domino's": 'dominos.com',
  'dunkin donuts': 'dunkindonuts.com',
  dunkin: 'dunkindonuts.com',
  chipotle: 'chipotle.com',
  'taco bell': 'tacobell.com',
  subway: 'subway.com',
  hulu: 'hulu.com',
  disney: 'disney.com',
  hbo: 'hbo.com',
  playstation: 'playstation.com',
  xbox: 'xbox.com',
  steam: 'steampowered.com',
  twitch: 'twitch.tv',
  airbnb: 'airbnb.com',
  lyft: 'lyft.com',
  doordash: 'doordash.com',
  grubhub: 'grubhub.com',
  instacart: 'instacart.com',
  ebay: 'ebay.com',
  etsy: 'etsy.com',
  shopify: 'shopify.com',
  visa: 'visa.com',
  mastercard: 'mastercard.com',
  paypal: 'paypal.com',
};

/**
 * Generates a consistent color based on the brand name string for the fallback avatar.
 */
function getBrandColor(brandName: string): string {
  const colors = [
    'from-teal-500 to-emerald-600',
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-red-600',
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-indigo-500 to-purple-600',
    'from-orange-500 to-amber-600',
    'from-pink-500 to-rose-600',
  ];

  let hash = 0;
  for (let i = 0; i < brandName.length; i++) {
    hash = brandName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Resolves the logo URL for a given brand name.
 * Uses logo.clearbit.com which provides free, high-quality brand logos.
 */
export function getBrandLogoUrl(brandName: string): string | null {
  const normalized = brandName.toLowerCase().trim();
  const domain = BRAND_DOMAINS[normalized];
  if (domain) {
    return `https://logo.clearbit.com/${domain}`;
  }
  // Fallback: try using the brand name directly as a domain
  const sanitized = normalized.replace(/[^a-z0-9]/g, '');
  return `https://logo.clearbit.com/${sanitized}.com`;
}

interface BrandLogoProps {
  brandName: string;
  /** Size variant: 'sm' (32px), 'md' (48px), 'lg' (64px) */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg',
};

/**
 * BrandLogo component displays a brand's official logo with a styled fallback.
 *
 * - Fetches logos from logo.clearbit.com (free API)
 * - Shows a gradient initial avatar as fallback if the logo fails to load
 * - Responsive and consistent sizing across all card layouts
 */
export default function BrandLogo({ brandName, size = 'md', className = '' }: BrandLogoProps) {
  const [hasError, setHasError] = useState(false);
  const logoUrl = getBrandLogoUrl(brandName);
  const initial = brandName.charAt(0).toUpperCase();
  const gradientColor = getBrandColor(brandName);

  if (hasError || !logoUrl) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center flex-shrink-0 shadow-sm ${className}`}
        title={brandName}
        aria-label={`${brandName} logo`}
      >
        <span className={`${textSizes[size]} font-bold text-white`}>{initial}</span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm ${className}`}
      title={brandName}
      aria-label={`${brandName} logo`}
    >
      <img
        src={logoUrl}
        alt={`${brandName} logo`}
        className="w-[75%] h-[75%] object-contain"
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  );
}
