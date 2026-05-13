import React from 'react';
import { motion } from 'motion/react';
import { X, MapPin, Clock, Users, DollarSign, Star, Share2, Ticket, Heart } from 'lucide-react';
import { Party, UserProfile } from '../types';

interface EventDetailsModalProps {
  party: Party;
  isOpen: boolean;
  onClose: () => void;
  onBook: (party: Party) => void;
  currentUser?: UserProfile;
  onShare?: (party: Party) => void;
  onFavorite?: (party: Party) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  party,
  isOpen,
  onClose,
  onBook,
  currentUser,
  onShare,
  onFavorite,
}) => {
  if (!isOpen) return null;

  const capacityUsed = party.ticketsSold || 0;
  const capacityTotal = party.capacity || 0;
  const capacityPercentage = capacityTotal > 0 ? (capacityUsed / capacityTotal) * 100 : 0;
  const ticketsAvailable = Math.max(0, capacityTotal - capacityUsed);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-[#0b0612] border border-[#ff5cc4]/20 rounded-3xl overflow-hidden my-8"
      >
        {/* Header with poster */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={party.posterURL}
            alt={party.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0612] via-transparent to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors text-white"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {/* Status badge */}
          {party.status === 'PENDING' && (
            <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-[#ff9d3c]/20 border border-[#ff9d3c] text-[#ff9d3c] text-xs font-bold uppercase tracking-widest font-label">
              Pending Approval
            </div>
          )}
          {party.status === 'REJECTED' && (
            <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-[#ff3b5c]/20 border border-[#ff3b5c] text-[#ff3b5c] text-xs font-bold uppercase tracking-widest font-label">
              Rejected
            </div>
          )}

          {/* Rating */}
          {party.averageRating !== undefined && (
            <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
              <Star size={14} className="text-[#b6ff3c]" fill="#b6ff3c" />
              <span className="text-white font-bold text-sm">
                {party.averageRating.toFixed(1)}
                <span className="text-[#bba8d6]/60 text-xs ml-1">({party.totalReviews})</span>
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="absolute bottom-6 right-6 flex gap-2">
            {onShare && (
              <button
                onClick={() => onShare(party)}
                className="p-3 rounded-full bg-black/40 hover:bg-black/60 transition-colors text-white border border-white/10"
                title="Share"
              >
                <Share2 size={18} />
              </button>
            )}
            {onFavorite && (
              <button
                onClick={() => onFavorite(party)}
                className="p-3 rounded-full bg-black/40 hover:bg-black/60 transition-colors text-white border border-white/10"
                title="Add to favorites"
              >
                <Heart size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
          {/* Title & Host */}
          <div>
            <h2 className="font-display text-3xl uppercase tracking-tighter text-white mb-2">
              {party.name}
            </h2>
            <p className="text-[#ff5cc4] text-sm font-label uppercase tracking-wider">
              Hosted by {party.hostName}
            </p>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-[#11091c]/70 border border-[#ff5cc4]/20">
              <div className="flex items-center gap-2 text-[#bba8d6]/60 text-xs font-label uppercase tracking-wider mb-1">
                <Clock size={12} />
                Time
              </div>
              <p className="text-white font-bold">{party.time}</p>
            </div>

            <div className="p-3 rounded-lg bg-[#11091c]/70 border border-[#ff5cc4]/20">
              <div className="flex items-center gap-2 text-[#bba8d6]/60 text-xs font-label uppercase tracking-wider mb-1">
                <MapPin size={12} />
                Location
              </div>
              <p className="text-white font-bold text-sm truncate">{party.location}</p>
            </div>

            <div className="p-3 rounded-lg bg-[#11091c]/70 border border-[#ff5cc4]/20">
              <div className="flex items-center gap-2 text-[#bba8d6]/60 text-xs font-label uppercase tracking-wider mb-1">
                <DollarSign size={12} />
                Price
              </div>
              <p className="text-white font-bold">${party.price?.toFixed(2)}</p>
            </div>

            <div className="p-3 rounded-lg bg-[#11091c]/70 border border-[#ff5cc4]/20">
              <div className="flex items-center gap-2 text-[#bba8d6]/60 text-xs font-label uppercase tracking-wider mb-1">
                <Users size={12} />
                Capacity
              </div>
              <p className="text-white font-bold">{ticketsAvailable}/{capacityTotal}</p>
            </div>
          </div>

          {/* Capacity Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#bba8d6]/60 text-xs font-label uppercase tracking-wider">
                Tickets Sold
              </span>
              <span className="text-white font-bold text-sm">
                {capacityPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#11091c]/70 rounded-full overflow-hidden border border-[#ff5cc4]/20">
              <div
                className="h-full bg-gradient-to-r from-[#ff2bd6] to-[#ff5cc4] transition-all"
                style={{ width: `${capacityPercentage}%` }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-[#ff5cc4] font-label text-xs uppercase tracking-wider mb-2 font-bold">
              About This Event
            </h3>
            <p className="text-[#bba8d6]/80 text-sm leading-relaxed">
              {party.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {party.genre && (
              <div>
                <h4 className="text-[#ff5cc4] font-label text-xs uppercase tracking-wider mb-1 font-bold">
                  Genre
                </h4>
                <p className="text-white text-sm">{party.genre}</p>
              </div>
            )}
            {party.dressCode && (
              <div>
                <h4 className="text-[#ff5cc4] font-label text-xs uppercase tracking-wider mb-1 font-bold">
                  Dress Code
                </h4>
                <p className="text-white text-sm">{party.dressCode}</p>
              </div>
            )}
            {party.ageRestriction && (
              <div>
                <h4 className="text-[#ff5cc4] font-label text-xs uppercase tracking-wider mb-1 font-bold">
                  Age Restriction
                </h4>
                <p className="text-white text-sm">{party.ageRestriction}+</p>
              </div>
            )}
            {party.instagram && (
              <div>
                <h4 className="text-[#ff5cc4] font-label text-xs uppercase tracking-wider mb-1 font-bold">
                  Instagram
                </h4>
                <p className="text-white text-sm">{party.instagram}</p>
              </div>
            )}
          </div>

          {/* Policies */}
          {(party.cancellationPolicy || party.refundPolicy) && (
            <div className="space-y-3 pt-4 border-t border-white/5">
              {party.cancellationPolicy && (
                <div>
                  <h4 className="text-[#ff5cc4] font-label text-xs uppercase tracking-wider mb-1 font-bold">
                    Cancellation Policy
                  </h4>
                  <p className="text-[#bba8d6]/70 text-xs leading-relaxed">{party.cancellationPolicy}</p>
                </div>
              )}
              {party.refundPolicy && (
                <div>
                  <h4 className="text-[#ff5cc4] font-label text-xs uppercase tracking-wider mb-1 font-bold">
                    Refund Policy
                  </h4>
                  <p className="text-[#bba8d6]/70 text-xs leading-relaxed">{party.refundPolicy}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with action button */}
        <div className="p-6 border-t border-white/5 flex gap-3 bg-[#11091c]/50 sticky bottom-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-lg bg-[#11091c]/70 border border-[#ff5cc4]/25 hover:border-[#ff2bd6] text-white font-bold uppercase tracking-widest text-xs transition-all"
          >
            Close
          </button>
          {party.status === 'APPROVED' && ticketsAvailable > 0 && currentUser?.role === 'USER' && (
            <button
              onClick={() => onBook(party)}
              className="flex-1 btn-neon flex items-center justify-center gap-2"
            >
              <Ticket size={16} />
              Book Now
            </button>
          )}
          {party.status !== 'APPROVED' && (
            <div className="flex-1 py-3 px-4 rounded-lg bg-[#ff9d3c]/10 border border-[#ff9d3c] text-[#ff9d3c] font-bold uppercase tracking-widest text-xs flex items-center justify-center">
              Not Available
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
