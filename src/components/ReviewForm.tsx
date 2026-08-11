import { useState, useEffect } from 'react';
import { Star, Send, X } from 'lucide-react';
import type { Trade } from '../types';
import { canReviewTrade, createReview } from '../utils/reviews';
import { useAuth } from '../contexts/AuthContext';

interface ReviewFormProps {
  tradeId: string;
  onReviewSubmitted?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ tradeId, onReviewSubmitted, onCancel }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canReview, setCanReview] = useState(false);
  const [trade, setTrade] = useState<Trade | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkReviewEligibility();
  }, [tradeId, user]);

  const checkReviewEligibility = async () => {
    if (!user) return;
    setIsChecking(true);
    try {
      const result = await canReviewTrade(tradeId, user.id);
      setCanReview(result.canReview);
      setError(result.reason);
      setTrade(result.trade || null);
    } catch (err) {
      console.error('Error checking review eligibility:', err);
      setError('Error checking review eligibility');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !trade || rating === 0) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Determine who to rate (the other party)
      const ratedUserId = trade.initiator_id === user.id ? trade.recipient_id : trade.initiator_id;

      const success = await createReview(
        tradeId,
        user.id,
        ratedUserId,
        rating,
        review.trim() || undefined
      );

      if (success) {
        setRating(0);
        setReview('');
        setHoveredRating(0);
        onReviewSubmitted?.();
      } else {
        setError('Failed to submit review. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Error submitting review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isChecking) {
    return (
      <div className="p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center justify-center py-4">
          <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!canReview) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-amber-800 text-sm">{error || 'You cannot review this trade.'}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg border border-slate-200 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Leave a Review</h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoveredRating || rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-slate-600">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="review-text" className="block text-sm font-medium text-slate-700 mb-2">
          Review (Optional)
        </label>
        <textarea
          id="review-text"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience with this trade..."
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          rows={4}
          maxLength={500}
        />
        <p className="text-xs text-slate-500 mt-1">{review.length}/500 characters</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={rating === 0 || isSubmitting}
          className="px-6 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Submit Review</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
