import { useState } from 'react';
import {
  X,
  ShoppingCart,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { Voucher } from '../types';
import {
  createCheckoutSession,
  isStripeConfigured,
  PaymentStatus,
} from '../utils/paymentService';

interface CheckoutModalProps {
  voucher: Voucher;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (voucherId: string, transactionId: string) => void;
}

export default function CheckoutModal({
  voucher,
  isOpen,
  onClose,
  onPaymentComplete,
}: CheckoutModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [message, setMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');

  if (!isOpen) return null;

  const savings = voucher.original_value - voucher.selling_price;

  const handleCheckout = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('processing');
    setMessage('');

    const result = await createCheckoutSession({ voucher, buyerEmail: email });

    setStatus(result.status);
    setMessage(result.message ?? '');

    if (result.status === 'success' && result.transactionId) {
      setTransactionId(result.transactionId);
      onPaymentComplete(voucher.id, result.transactionId);
    }
  };

  const handleClose = () => {
    // Reset state on close
    setStatus('idle');
    setMessage('');
    setEmail('');
    setTransactionId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={status === 'processing' ? undefined : handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Checkout</h2>
              <p className="text-white/80 text-xs">Secure payment</p>
            </div>
          </div>
          {status !== 'processing' && (
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-5">
          {/* ─── SUCCESS STATE ────────────────────────────── */}
          {status === 'success' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Payment Successful!</h3>
              <p className="text-slate-600 text-sm">{message}</p>
              {transactionId && (
                <p className="text-xs text-slate-500 font-mono bg-slate-50 rounded-lg px-3 py-2 inline-block">
                  Transaction: {transactionId}
                </p>
              )}
              <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Done
              </button>
            </div>
          )}

          {/* ─── PROCESSING STATE ─────────────────────────── */}
          {status === 'processing' && (
            <div className="text-center space-y-4 py-8">
              <Loader2 className="h-12 w-12 text-teal-600 animate-spin mx-auto" />
              <h3 className="text-lg font-semibold text-slate-800">Processing Payment…</h3>
              <p className="text-sm text-slate-600">Please wait while we process your payment securely.</p>
            </div>
          )}

          {/* ─── IDLE / ERROR STATE (checkout form) ──────── */}
          {(status === 'idle' || status === 'error') && (
            <>
              {/* Voucher Summary */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-slate-800">{voucher.brand_name}</h3>
                  <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                    {voucher.discount_percentage}% OFF
                  </span>
                </div>
                {voucher.description && (
                  <p className="text-sm text-slate-600">{voucher.description}</p>
                )}
                <div className="flex items-end justify-between border-t border-slate-200 pt-3">
                  <div>
                    <span className="text-xs text-slate-500 block">Original Value</span>
                    <span className="text-slate-400 line-through text-sm">${voucher.original_value}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">You Save</span>
                    <span className="text-emerald-600 font-bold">${savings.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                      ${voucher.selling_price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="checkout-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Error */}
              {status === 'error' && message && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800">{message}</p>
                    <button
                      onClick={() => {
                        setStatus('idle');
                        setMessage('');
                      }}
                      className="text-xs text-red-600 hover:text-red-800 underline mt-1 flex items-center space-x-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Try again</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Demo notice */}
              {!isStripeConfigured && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    Stripe is not configured. Payments are simulated in demo mode.
                    Set <code className="bg-amber-100 px-1 rounded">VITE_STRIPE_PUBLISHABLE_KEY</code> to enable
                    real payments.
                  </p>
                </div>
              )}

              {/* Trust badges */}
              <div className="flex items-center justify-center space-x-6 text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-teal-600" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CreditCard className="h-4 w-4 text-teal-600" />
                  <span>Stripe Powered</span>
                </div>
              </div>

              {/* Pay button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span>Pay ${voucher.selling_price}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Payment flow info */}
              <div className="text-center">
                <p className="text-xs text-slate-400">
                  Payment is held in escrow until the seller confirms voucher validity.
                  You can request a refund if there are any issues.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
