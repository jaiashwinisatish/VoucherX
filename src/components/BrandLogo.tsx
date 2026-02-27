import { useMemo, useState } from 'react';

interface BrandLogoProps {
  brandName: string;
  brandLogoUrl?: string;
  className?: string;
}

const domainOverrides: Record<string, string> = {
  starbucks: 'starbucks.com',
  amazon: 'amazon.com',
  nike: 'nike.com',
  netflix: 'netflix.com',
  spotify: 'spotify.com',
  uber: 'uber.com',
  apple: 'apple.com',
};

const toDomain = (brandName: string): string => {
  const key = brandName.trim().toLowerCase();
  if (domainOverrides[key]) {
    return domainOverrides[key];
  }

  const normalized = key.replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '');
  return `${normalized}.com`;
};

const getInitials = (brandName: string): string => {
  const words = brandName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

export default function BrandLogo({ brandName, brandLogoUrl, className = 'h-12 w-12 rounded-lg' }: BrandLogoProps) {
  const [hasError, setHasError] = useState(false);

  const logoUrl = useMemo(() => {
    if (brandLogoUrl?.trim()) {
      return brandLogoUrl;
    }

    return `https://logo.clearbit.com/${toDomain(brandName)}`;
  }, [brandLogoUrl, brandName]);

  if (hasError) {
    return (
      <div
        className={`${className} bg-slate-200 text-slate-600 border border-slate-300 flex items-center justify-center font-semibold uppercase shrink-0`}
        aria-label={`${brandName} logo placeholder`}
      >
        <span className="text-xs sm:text-sm">{getInitials(brandName)}</span>
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${brandName} logo`}
      loading="lazy"
      onError={() => setHasError(true)}
      className={`${className} object-contain bg-white border border-slate-200 p-1.5 shrink-0`}
    />
  );
}