import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Minus, Plus, AlertCircle, Check } from 'lucide-react';
import { Party, UserProfile } from '../types';

interface TicketBookingProps {
  party: Party;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number, totalPrice: number) => void;
}

export const TicketBooking: React.FC<TicketBookingProps> = ({
  party,
  user,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const ticketsAvailable = Math.max(0, (party.capacity || 0) - (party.ticketsSold || 0));
  const unitPrice = party.price || 0;
  const totalPrice = quantity * unitPrice;
  const platformFee = totalPrice * 0.05; // 5% platform fee
  const finalTotal = totalPrice + platformFee;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= ticketsAvailable) {
      setQuantity(newQuantity);
    }
  };

  const handleBooking = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsConfirmed(true);
    setTimeout(() => {
      onConfirm(quantity, finalTotal);
      setIsProcessing(false);
      setIsConfirmed(false);
      setQuantity(1);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#0b0612] border border-[#ff5cc4]/20 rounded-3xl p-8 relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-6 right-6 p-2 text-[#bba8d6]/55 hover:text-white transition-colors disabled:opacity-50"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {isConfirmed ? (
          /* Success State */
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="w-16 h-16 rounded-full bg-[#b6ff3c]/20 border border-[#b6ff3c] flex items-center justify-center mx-auto mb-6"
            >
              <Check size={32} className="text-[#b6ff3c]" />
            </motion.div>

            <h2 className="font-display text-2xl text-white uppercase tracking-tighter mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-[#bba8d6]/70 text-sm mb-6">
              Your tickets have been secured. Check your email for confirmation.
            </p>

            <div className="bg-[#11091c]/70 border border-[#b6ff3c]/30 rounded-xl p-4 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#bba8d6]/60 text-xs uppercase font-label tracking-wider">
                  Booking ID
                </span>
                <span className="text-white font-bold font-mono text-sm">
                  #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#bba8d6]/60 text-xs uppercase font-label tracking-wider">
                  Tickets
                </span>
                <span className="text-white font-bold">{quantity}x</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/10">
                <span className="text-[#ff5cc4] text-xs uppercase font-label tracking-wider font-bold">
                  Total Paid
                </span>
                <span className="text-white font-bold text-lg">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 btn-neon"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl text-white uppercase tracking-tighter mb-1">
                Get Tickets
              </h2>
              <p className="text-[#bba8d6]/65 text-sm">{party.name}</p>
            </div>

            {/* Availability Warning */}
            {ticketsAvailable < 5 && ticketsAvailable > 0 && (
              <div className="p-3 rounded-lg bg-[#ff9d3c]/10 border border-[#ff9d3c] flex gap-2">
                <AlertCircle size={16} className="text-[#ff9d3c] shrink-0 mt-0.5" />
                <p className="text-[#ff9d3c] text-xs">
                  Only {ticketsAvailable} tickets left - selling fast!
                </p>
              </div>
            )}

            {ticketsAvailable === 0 && (
              <div className="p-3 rounded-lg bg-[#ff3b5c]/10 border border-[#ff3b5c] flex gap-2">
                <AlertCircle size={16} className="text-[#ff3b5c] shrink-0 mt-0.5" />
                <p className="text-[#ff3b5c] text-xs">
                  Sold out! Join the waitlist to get notified if tickets become available.
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-[#ff5cc4] font-label text-xs uppercase tracking-wider mb-3 font-bold">
                Number of Tickets
              </label>
              <div className="flex items-center justify-between bg-[#11091c]/70 border border-[#ff5cc4]/15 rounded-xl p-4">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || isProcessing}
                  className="p-2 rounded-lg hover:bg-[#ff5cc4]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[#ff5cc4]"
                >
                  <Minus size={18} />
                </button>

                <div className="text-center">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        Math.min(Math.max(1, parseInt(e.target.value) || 1), ticketsAvailable)
                      )
                    }
                    className="w-12 text-center bg-transparent text-white font-bold text-xl focus:outline-none"
                    min="1"
                    max={ticketsAvailable}
                    disabled={isProcessing}
                  />
                  <p className="text-[#bba8d6]/50 text-xs mt-1">Max: {ticketsAvailable}</p>
                </div>

                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= ticketsAvailable || isProcessing}
                  className="p-2 rounded-lg hover:bg-[#ff5cc4]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[#ff5cc4]"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 p-4 rounded-xl bg-[#11091c]/70 border border-[#ff5cc4]/15">
              <div className="flex justify-between items-center">
                <span className="text-[#bba8d6]/60 text-sm">
                  {quantity} × ${unitPrice.toFixed(2)}
                </span>
                <span className="text-white font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#bba8d6]/60 text-sm">Platform Fee (5%)</span>
                <span className="text-white font-bold">${platformFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                <span className="text-[#ff5cc4] font-bold text-sm uppercase tracking-wider">
                  Total
                </span>
                <span className="text-white font-bold text-lg">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* User Info */}
            <div className="p-3 rounded-lg bg-[#11091c]/70 border border-white/5">
              <p className="text-[#bba8d6]/60 text-xs uppercase font-label tracking-wider mb-1">
                Booking For
              </p>
              <p className="text-white font-bold">{user.nickname}</p>
              <p className="text-[#bba8d6]/65 text-xs mt-1">{user.email}</p>
            </div>

            {/* Payment Methods Info */}
            <div className="p-3 rounded-lg bg-[#2bf0ff]/10 border border-[#2bf0ff]/20 flex gap-2">
              <AlertCircle size={14} className="text-[#2bf0ff] shrink-0 mt-0.5" />
              <p className="text-[#2bf0ff]/80 text-xs">
                We accept Stripe & PayPal. Your payment is secure and encrypted.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 rounded-lg bg-[#11091c]/70 border border-[#ff5cc4]/25 hover:border-[#ff2bd6] text-white font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={ticketsAvailable === 0 || isProcessing}
                className="flex-1 btn-neon disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm & Pay
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
