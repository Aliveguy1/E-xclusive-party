import React, { useMemo } from 'react';
import { PlusCircle, TrendingUp, Share2, Edit2, CheckCircle, LogOut, ShieldAlert, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Party, UserProfile } from '../types';

interface InfluencerDashboardProps {
  user: UserProfile;
  parties: Party[];
  onCreateEvent: () => void;
  onLogout: () => void;
  onRequestVerification: () => void;
}

export const InfluencerDashboard: React.FC<InfluencerDashboardProps> = ({
  user,
  parties,
  onCreateEvent,
  onLogout,
  onRequestVerification,
}) => {
  const stats = useMemo(() => {
    const live = parties.filter((p) => p.status === 'APPROVED');
    const pending = parties.filter((p) => p.status === 'PENDING');
    const sold = parties.reduce((acc, p) => acc + (p.ticketsSold ?? 0), 0);
    const revenue = parties.reduce(
      (acc, p) => acc + (p.ticketsSold ?? 0) * (p.price ?? 0),
      0
    );
    return { live, pending, sold, revenue };
  }, [parties]);

  return (
    <div
      className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col h-full relative z-10"
      data-testid="influencer-dashboard"
    >
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tighter text-white leading-none">
              Welcome,{' '}
              <span className="wordmark">@{user.nickname}</span>
            </h1>
            {user.isVerified ? (
              <CheckCircle className="text-[#b6ff3c]" size={28} />
            ) : user.isVerificationPending ? (
              <div className="chip chip-pending">
                <Loader2 size={11} className="animate-spin" />
                Under Review
              </div>
            ) : (
              <button
                onClick={onRequestVerification}
                className="chip chip-magenta hover:scale-105 transition-transform"
                data-testid="dashboard-request-verification"
              >
                <ShieldAlert size={11} />
                Get Verified
              </button>
            )}
          </div>
          <p className="text-[#bba8d6]/70 font-label text-xs uppercase tracking-widest">
            Reputation: <span className="text-[#2bf0ff] font-bold">84/100</span> · {stats.pending.length} reviews pending
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="md:hidden btn-ghost"
            data-testid="dashboard-logout-mobile"
          >
            <LogOut size={14} />
            Exit
          </button>
          <button
            onClick={onCreateEvent}
            className="btn-neon"
            data-testid="dashboard-create-event"
          >
            <PlusCircle size={14} />
            Deploy New Event
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
        <StatCard label="Global Reach" value="12.4K" accent="#ff2bd6" />
        <StatCard
          label="Live Events"
          value={stats.live.length.toString().padStart(2, '0')}
          accent="#b6ff3c"
        />
        <StatCard
          label="Tickets Sold"
          value={stats.sold.toLocaleString()}
          accent="#2bf0ff"
        />
        <StatCard
          label="Earnings"
          value={`$${stats.revenue.toLocaleString()}`}
          accent="#9b5cff"
          wide
        />
      </section>

      <section className="space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl uppercase tracking-[0.2em] text-white">
            Event Inventory
          </h2>
          <div className="flex gap-5">
            <button className="text-[10px] font-label text-white uppercase tracking-[0.25em] font-bold border-b border-[#ff2bd6] pb-1">
              Active
            </button>
            <button className="text-[10px] font-label text-[#bba8d6]/50 uppercase tracking-[0.25em] hover:text-white transition-colors">
              Archived
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {parties.map((party) => (
            <motion.div
              key={party.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
              data-testid={`dashboard-event-${party.id}`}
            >
              <div className="h-44 w-full relative overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={party.posterURL}
                  alt={party.name}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0612] via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  {party.status === 'APPROVED' ? (
                    <span className="chip chip-live">
                      <span className="w-1.5 h-1.5 bg-[#b6ff3c] rounded-full" /> Live
                    </span>
                  ) : party.status === 'PENDING' ? (
                    <span className="chip chip-pending">
                      <span className="w-1.5 h-1.5 bg-[#ffb84d] rounded-full animate-pulse" />
                      In Queue
                    </span>
                  ) : (
                    <span className="chip chip-rejected">
                      <span className="w-1.5 h-1.5 bg-[#ff3b5c] rounded-full" /> Rejected
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg mb-3 uppercase tracking-tight text-white leading-tight">
                  {party.name}
                </h3>
                <div className="flex justify-between items-center text-[#bba8d6]/65 font-label text-[10px] uppercase tracking-[0.18em] border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={12} className="text-[#ff5cc4]" />
                    {party.ticketsSold ?? 0}/{party.capacity ?? 0}
                  </div>
                  <div className="flex items-center gap-3 text-[#bba8d6]/70">
                    {party.status === 'APPROVED' ? (
                      <Share2
                        size={13}
                        className="cursor-pointer hover:text-[#2bf0ff] transition-colors"
                      />
                    ) : (
                      <Edit2
                        size={13}
                        className="cursor-pointer hover:text-[#ff5cc4] transition-colors"
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const StatCard: React.FC<{
  label: string;
  value: string;
  accent: string;
  wide?: boolean;
}> = ({ label, value, accent, wide }) => (
  <div
    className={`glass-card rounded-2xl p-5 h-32 flex flex-col justify-between relative overflow-hidden ${
      wide ? 'col-span-2' : ''
    }`}
  >
    <span
      className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 blur-2xl"
      style={{ background: accent }}
    />
    <span className="font-label text-[10px] text-[#bba8d6]/55 uppercase tracking-[0.25em] font-bold relative z-10">
      {label}
    </span>
    <div
      className="text-3xl font-display font-bold relative z-10"
      style={{ color: accent }}
    >
      {value}
    </div>
    <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden relative z-10">
      <div
        className="h-full w-3/4 rounded-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
    </div>
  </div>
);
