import React, { useState } from 'react';
import { Check, X, SkipForward, Maximize, Calendar, User, Ticket, Zap } from 'lucide-react';
import { Party } from '../types';
import { motion, AnimatePresence } from 'motion/react';

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

  const handleNext = () => {
    if (currentIndex < pendingParties.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setRejectionReason('');
    }
  };

  if (!currentParty) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-950">
        <div className="w-24 h-24 rounded-sm bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-indigo-500/10 blur-xl"></div>
          <Check className="text-indigo-400 relative z-10" size={48} />
        </div>
        <h2 className="text-4xl font-display font-bold mb-4 uppercase tracking-tighter">Queue Decrypted</h2>
        <p className="text-slate-500 font-sans text-sm max-w-xs uppercase tracking-widest font-bold opacity-60">
          All pending node requests have been synchronized and authorized.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-light font-display">Party Approval <span className="text-slate-500">/ Queue</span></h2>
          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded border border-amber-500/20 uppercase tracking-widest">
            {pendingParties.length} PENDING
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-6 w-[1px] bg-slate-800"></div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded text-sm font-semibold transition-all shadow-lg shadow-indigo-600/10 font-label uppercase tracking-widest">
            Sync Registry
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-8 p-8 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950 overflow-hidden">
        {/* Left Pane: Poster Preview & Quick Stats */}
        <section className="col-span-4 flex flex-col gap-6 h-full">
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded p-1 relative group overflow-hidden">
            <img 
              src={currentParty.posterURL} 
              alt="Party Poster" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button className="bg-white/5 backdrop-blur-xl px-4 py-2 rounded border border-white/10 text-[10px] font-label uppercase tracking-widest">
                Enlarge Asset
              </button>
            </div>
          </div>
          
          <div className="bg-slate-900/40 border border-slate-800 rounded p-6">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-4 font-label">Asset Validation</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">AI Compliance</span>
                <span className="text-indigo-400 font-bold">88%</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '88%' }}
                  className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Right Pane: Event Logic Review */}
        <section className="col-span-8 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-slate-900/40 border border-slate-800 rounded p-8">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-3xl font-display font-bold tracking-tight mb-2 uppercase">{currentParty.name}</h3>
                <p className="text-slate-400 text-sm font-label uppercase tracking-wider">
                  Host: <span className="text-indigo-400">@{currentParty.hostName.toLowerCase().replace(/\s+/g, '_')}</span>
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleNext}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[10px] font-bold uppercase tracking-wider transition-all"
                >
                  Skip
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-10">
              <div className="border-l-2 border-indigo-500 pl-4 py-1">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-label">Location</p>
                <p className="text-sm font-medium">{currentParty.location}</p>
              </div>
              <div className="border-l-2 border-slate-700 pl-4 py-1">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-label">Base API Rate</p>
                <p className="text-sm font-medium text-indigo-400">${currentParty.price?.toFixed(2)}</p>
              </div>
              <div className="border-l-2 border-slate-700 pl-4 py-1">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-label">Identity</p>
                <p className="text-sm font-medium italic">{currentParty.date} • {currentParty.time}</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded p-6 mb-10">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-4 block font-label">Description Payload</span>
              <p className="text-sm text-slate-400 leading-relaxed font-sans">
                {currentParty.description}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded p-6 mb-10">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-4 block font-label">Rejection Log</span>
              <textarea 
                className="w-full bg-slate-950 border border-slate-800 rounded p-4 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Reason for code rejection..."
                rows={2}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>

            <div className="mt-auto flex gap-4 pt-4">
              <button 
                disabled={!rejectionReason || isApproving}
                onClick={() => onReject(currentParty.id, rejectionReason)}
                className="flex-1 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-xs font-bold uppercase tracking-wider hover:bg-red-500/20 transition-all disabled:opacity-20"
              >
                Reject Code
              </button>
              <button 
                disabled={isApproving}
                onClick={async () => {
                  setIsApproving(true);
                  await onApprove(currentParty.id);
                  setIsApproving(false);
                }}
                className="flex-[2] py-4 bg-emerald-500 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                {isApproving ? 'Executing...' : 'Approve & Trigger QR'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
