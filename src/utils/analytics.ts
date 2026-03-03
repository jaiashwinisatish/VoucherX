/**
 * Analytics utility for VoucherX using Google Analytics 4 (gtag.js).
 *
 * Setup:
 * 1. Set the environment variable VITE_GA_MEASUREMENT_ID to your GA4 Measurement ID (e.g., G-XXXXXXXXXX)
 * 2. The gtag.js script is loaded in index.html
 * 3. Analytics is initialized in App.tsx on mount
 *
 * Usage:
 *   import { trackEvent, trackPageView } from '../utils/analytics';
 *   trackPageView('/marketplace');
 *   trackEvent('purchase', 'buy_voucher', 'Amazon', 85);
 */

// Extend window to include gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

/**
 * Initialize Google Analytics 4.
 * Loads the gtag.js script dynamically and configures it with the measurement ID.
 * Does nothing if no measurement ID is configured.
 */
export function initAnalytics(): void {
  if (!GA_MEASUREMENT_ID) {
    if (import.meta.env.DEV) {
      console.info('[Analytics] No GA Measurement ID configured. Set VITE_GA_MEASUREMENT_ID in your .env file.');
    }
    return;
  }

  // Avoid loading twice
  if (document.querySelector(`script[src*="googletagmanager"]`)) return;

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll send page views manually for SPA navigation
  });
}

/**
 * Track a page view.
 * @param pagePath - The page path (e.g., '/marketplace', '/wallet')
 * @param pageTitle - Optional page title
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
  });
}

/**
 * Track a custom event.
 * @param action - The event action (e.g., 'buy_voucher', 'copy_code')
 * @param category - The event category (e.g., 'Purchase', 'Engagement')
 * @param label - Optional event label (e.g., brand name)
 * @param value - Optional numeric value (e.g., price)
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
): void {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}

// ─── Pre-defined event helpers ───────────────────────────────────────────────

/** Track when a user copies a voucher code */
export function trackCopyCode(brandName: string): void {
  trackEvent('copy_code', 'Engagement', brandName);
}

/** Track when a user clicks "Redeem Now" */
export function trackRedeemVoucher(brandName: string, value: number): void {
  trackEvent('redeem_voucher', 'Purchase', brandName, value);
}

/** Track when a user clicks "Trade" on a voucher */
export function trackTradeVoucher(brandName: string): void {
  trackEvent('trade_voucher', 'Exchange', brandName);
}

/** Track when a user clicks "Sell" on a voucher */
export function trackSellVoucher(brandName: string): void {
  trackEvent('sell_voucher', 'Exchange', brandName);
}

/** Track when a user adds an item to their wishlist */
export function trackAddToWishlist(brandName: string, category: string): void {
  trackEvent('add_to_wishlist', 'Wishlist', `${brandName} (${category})`);
}

/** Track when a user removes an item from their wishlist */
export function trackRemoveFromWishlist(brandName: string): void {
  trackEvent('remove_from_wishlist', 'Wishlist', brandName);
}

/** Track when the AI assistant is opened */
export function trackOpenAIAssistant(): void {
  trackEvent('open_ai_assistant', 'Engagement');
}

/** Track marketplace search/filter interactions */
export function trackMarketplaceSearch(query: string): void {
  trackEvent('search', 'Marketplace', query);
}

/** Track navigation between pages */
export function trackNavigation(page: string): void {
  trackPageView(`/${page}`, `VoucherX - ${page.charAt(0).toUpperCase() + page.slice(1)}`);
}
