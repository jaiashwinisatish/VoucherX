import { Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { useState } from 'react';
import type { Trade, Voucher } from '../types';
import { shareToTwitter, shareToLinkedIn, copyTradeLink } from '../utils/socialShare';

interface SocialShareProps {
  trade: Trade;
  vouchers?: {
    initiator?: Voucher;
    recipient?: Voucher;
  };
  className?: string;
}

export default function SocialShare({ trade, vouchers, className = '' }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const success = await copyTradeLink(trade.id);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-slate-600 mr-2">Share:</span>
      <button
        onClick={() => shareToTwitter(trade, vouchers)}
        className="p-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
        title="Share on Twitter/X"
      >
        <Twitter className="h-5 w-5" />
      </button>
      <button
        onClick={() => shareToLinkedIn(trade, vouchers)}
        className="p-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
        title="Share on LinkedIn"
      >
        <Linkedin className="h-5 w-5" />
      </button>
      <button
        onClick={handleCopyLink}
        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-1"
        title="Copy link"
      >
        {copied ? (
          <>
            <Check className="h-5 w-5 text-emerald-600" />
            <span className="text-xs text-emerald-600">Copied!</span>
          </>
        ) : (
          <LinkIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
