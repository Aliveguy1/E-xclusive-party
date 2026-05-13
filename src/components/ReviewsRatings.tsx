import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Send, User, X } from 'lucide-react';
import { Review, Party, UserProfile } from '../types';

interface ReviewsRatingsProps {
  partyId: string;
  reviews: Review[];
  averageRating?: number;
  totalReviews?: number;
  onAddReview?: (rating: number, comment: string) => void;
  currentUser?: UserProfile;
  canReview?: boolean;
}

export const ReviewsRatings: React.FC<ReviewsRatingsProps> = ({
  partyId,
  reviews,
  averageRating = 0,
  totalReviews = 0,
  onAddReview,
  currentUser,
  canReview = false,
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmitReview = async () => {
    if (!comment.trim() || rating === 0) return;

    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 800));

    onAddReview?.(rating, comment);
    setComment('');
    setRating(5);
    setShowReviewForm(false);
    setIsSubmitting(false);
  };

  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-1 p-6 rounded-2xl bg-gradient-to-br from-[#ff2bd6]/10 to-[#9b5cff]/10 border border-[#ff5cc4]/20">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < Math.round(averageRating) ? 'text-[#b6ff3c] fill-[#b6ff3c]' : 'text-[#bba8d6]/30'}
                />
              ))}
            </div>
          </div>
          <p className="font-display text-4xl text-white font-bold mb-1">
            {averageRating.toFixed(1)}
          </p>
          <p className="text-[#bba8d6]/60 text-xs uppercase font-label tracking-wider">
            {totalReviews} reviews
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-3 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingDistribution[stars as keyof typeof ratingDistribution];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <Star size={12} className="text-[#ff5cc4]" fill="#ff5cc4" />
                  <span className="text-[#bba8d6]/60 text-xs font-bold">{stars}</span>
                </div>
                <div className="flex-1 h-2 bg-[#11091c]/70 rounded-full overflow-hidden border border-[#ff5cc4]/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, delay: (5 - stars) * 0.1 }}
                    className="h-full bg-gradient-to-r from-[#ff5cc4] to-[#ff2bd6]"
                  />
                </div>
                <span className="text-[#bba8d6]/60 text-xs w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Review Button */}
      {canReview && currentUser && (
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="w-full py-3 px-4 rounded-xl bg-[#ff2bd6]/15 border border-[#ff5cc4]/30 hover:border-[#ff2bd6] text-white font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
        >
          <Star size={14} />
          {showReviewForm ? 'Cancel' : 'Share Your Experience'}
        </button>
      )}

      {/* Review Form */}
      {showReviewForm && canReview && currentUser && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-6 rounded-2xl bg-[#11091c]/70 border border-[#ff5cc4]/20 space-y-4"
        >
          {/* Rating Selector */}
          <div>
            <label className="block text-[#ff5cc4] font-label text-xs uppercase tracking-wider mb-3 font-bold">
              Your Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={24}
                    className={`transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-[#b6ff3c] fill-[#b6ff3c]'
                        : 'text-[#bba8d6]/30'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-[#ff5cc4] font-label text-xs uppercase tracking-wider mb-2 font-bold">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What was your experience? (min. 10 characters)"
              maxLength={1000}
              rows={4}
              className="w-full bg-[#0b0612]/70 border border-[#ff5cc4]/15 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#ff5cc4] transition-colors resize-none placeholder-[#bba8d6]/40"
              disabled={isSubmitting}
            />
            <p className="text-[#bba8d6]/50 text-xs mt-1">
              {comment.length}/1000
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmitReview}
            disabled={comment.trim().length < 10 || isSubmitting}
            className="w-full btn-neon disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Posting...
              </>
            ) : (
              <>
                <Send size={14} />
                Post Review
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="font-display text-lg text-white uppercase tracking-tight">
          Reviews ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#bba8d6]/60 text-sm">No reviews yet. Be the first to share!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-[#11091c]/70 border border-[#ff5cc4]/10 hover:border-[#ff5cc4]/30 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {review.userPhoto ? (
                    <img
                      src={review.userPhoto}
                      alt={review.userName}
                      className="w-10 h-10 rounded-lg object-cover border border-[#ff5cc4]/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff2bd6] to-[#9b5cff] flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                  <div>
                    <p className="text-white font-bold text-sm">{review.userName}</p>
                    <p className="text-[#bba8d6]/50 text-xs">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < review.rating
                          ? 'text-[#b6ff3c] fill-[#b6ff3c]'
                          : 'text-[#bba8d6]/30'
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <p className="text-[#bba8d6]/80 text-sm leading-relaxed mb-3">{review.comment}</p>

              {/* Helpful Button */}
              {review.helpful !== undefined && (
                <button className="text-[#bba8d6]/50 hover:text-[#ff5cc4] text-xs uppercase font-label tracking-wider transition-colors">
                  👍 Helpful ({review.helpful})
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
