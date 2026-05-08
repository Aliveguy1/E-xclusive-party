import React, { useState, useCallback } from 'react';
import { Check, SkipForward, Calendar, MapPin, DollarSign, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Party } from '../types';

interface AdminQueueProps {
  pendingParties: Party[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}

export const AdminQueue: React.FC<AdminQueueProps> = ({ pendingParties, onApprove, onReject }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  const currentParty = pendingParties[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => (i < pendingParties.length - 1 ? i + 1 : i));
    setRejectionReason('');
  }, [pendingParties.length]);

  const handleApprove = useCallback(async () => {
    if (!currentParty) return;
    setIsApproving(true);
    await onApprove(currentParty.id);
    setIsApproving(false);
  }, [currentParty, onApprove]);

  if (!currentParty) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center text-center p-12 relative z-10"
        data-testid="queue-empty"
      >
        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#ff2bd6]/15 to-[#2bf0ff]/15 border border-[#ff5cc4]/30 flex items-center justify-center mb-8 relative neon-ring">
          <Check className="text-white relative z-10" size={48} />
        </div>
        <h2 className="text-4xl font-display font-bold mb-3 uppercase tracking-tighter text-white">
          Queue Cleared
        </h2>
        <p className="text-[#bba8d6]/60 font-sans text-sm max-w-sm uppercase tracking-widest font-bold">
          All pending events have been reviewed and authorized.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen relative z-10" data-testid="admin-queue">
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#080410]/60 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white">
            Approval <span className="text-[#ff5cc4]">Queue</span>
          </h2>
          <span className="chip chip-pending">{pendingParties.length} Pending</span>
        </div>
        <div className="font-label text-[10px] uppercase tracking-[0.3em] text-[#bba8d6]/60">
          Reviewing <span className="text-white">{currentIndex + 1}</span> / {pendingParties.length}
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 md:p-8">
        {/* Poster */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          <motion.div
            layout
            key={currentParty.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-2 relative group overflow-hidden"
          >
            <div className="aspect-[3/4] rounded-xl overflow-hidden">
              <img
                src={currentParty.posterURL}
                alt="Party Poster"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <button
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              aria-label="Enlarge"
            >
              <Maximize2 size={14} />
            </button>
          </motion.div>

          <div className="glass-panel rounded-2xl p-5">
            <p className="text-[10px] text-[#bba8d6]/55 uppercase tracking-[0.3em] mb-4 font-label">
              Asset Validation
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#bba8d6]/80">AI Compliance</span>
                <span className="text-[#2bf0ff] font-bold">88%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '88%' }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#ff2bd6] via-[#9b5cff] to-[#2bf0ff] shadow-[0_0_12px_rgba(255,43,214,0.6)]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Review */}
        <section className="lg:col-span-7 flex flex-col gap-5 overflow-y-auto pr-1 custom-scrollbar">
          <div className="glass-card rounded-2xl p-7 md:p-8">
            <div className="flex justify-between items-start gap-4 mb-8">
              <div>
                <h3 className="font-display text-3xl md:text-4xl text-white uppercase tracking-tight leading-none">
                  {currentParty.name}
                </h3>
                <p className="text-[#bba8d6]/70 text-sm font-label uppercase tracking-wider mt-3">
                  Host:{' '}
                  <span className="text-[#ff5cc4]">
                    @{currentParty.hostName.toLowerCase().replace(/\s+/g, '_')}
                  </span>
                </p>
              </div>
              <button
                onClick={handleNext}
                className="btn-ghost"
                data-testid="queue-skip"
              >
                <SkipForward size={14} /> Skip
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                <div className="flex items-center gap-2 text-[#ff5cc4] mb-2">
                  <MapPin size={13} />
                  <p className="text-[10px] uppercase tracking-[0.25em] font-label font-bold">Venue</p>
                </div>
                <p className="text-sm text-white">{currentParty.location}</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                <div className="flex items-center gap-2 text-[#2bf0ff] mb-2">
                  <DollarSign size={13} />
                  <p className="text-[10px] uppercase tracking-[0.25em] font-label font-bold">Door</p>
                </div>
                <p className="text-sm text-white">${currentParty.price?.toFixed(2)}</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                <div className="flex items-center gap-2 text-[#9b5cff] mb-2">
                  <Calendar size={13} />
                  <p className="text-[10px] uppercase tracking-[0.25em] font-label font-bold">When</p>
                </div>
                <p className="text-sm text-white">
                  {currentParty.date} · {currentParty.time}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-[#080410]/70 border border-white/5 p-5 mb-7">
              <span className="text-[10px] text-[#bba8d6]/55 uppercase tracking-[0.3em] mb-3 block font-label font-bold">
                Description
              </span>
              <p className="text-sm text-[#e8def8]/90 leading-relaxed font-sans">
                {currentParty.description}
              </p>
            </div>

            <div className="rounded-xl bg-[#080410]/70 border border-white/5 p-5 mb-7">
              <span className="text-[10px] text-[#bba8d6]/55 uppercase tracking-[0.3em] mb-3 block font-label font-bold">
                Rejection Reason
              </span>
              <textarea
                className="w-full bg-[#11091c]/80 border border-white/5 rounded-lg p-4 text-sm text-white placeholder:text-[#bba8d6]/40 transition-colors"
                placeholder="Add a clear reason for the host…"
                rows={2}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                data-testid="queue-rejection-reason"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                disabled={!rejectionReason || isApproving}
                onClick={() => onReject(currentParty.id, rejectionReason)}
                className="flex-1 py-4 rounded-full bg-[#ff3b5c]/10 text-[#ff3b5c] border border-[#ff3b5c]/30 text-xs font-bold uppercase tracking-[0.22em] hover:bg-[#ff3b5c]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-label"
                data-testid="queue-reject"
              >
                Reject
              </button>
              <button
                disabled={isApproving}
                onClick={handleApprove}
                className="btn-neon flex-[2]"
                data-testid="queue-approve"
              >
                {isApproving ? 'Generating QR…' : 'Approve & Trigger QR'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
