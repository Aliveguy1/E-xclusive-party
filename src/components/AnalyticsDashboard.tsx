import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Share2,
  Star,
} from 'lucide-react';
import { Party } from '../types';

interface AnalyticsDashboardProps {
  parties: Party[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ parties }) => {
  const stats = useMemo(() => {
    const approved = parties.filter((p) => p.status === 'APPROVED');
    const pending = parties.filter((p) => p.status === 'PENDING');

    const totalTickets = approved.reduce((sum, p) => sum + (p.ticketsSold || 0), 0);
    const totalRevenue = approved.reduce((sum, p) => sum + ((p.ticketsSold || 0) * (p.price || 0)), 0);
    const avgRating = approved.length > 0
      ? approved.reduce((sum, p) => sum + (p.averageRating || 0), 0) / approved.length
      : 0;
    const totalViewCount = approved.reduce((sum, p) => sum + 100 * (Math.random() + 0.5), 0); // Mock
    const totalShares = approved.reduce((sum, p) => sum + Math.floor(Math.random() * 50), 0); // Mock

    return {
      approved: approved.length,
      pending: pending.length,
      totalTickets,
      totalRevenue,
      avgRating,
      totalViewCount,
      totalShares,
    };
  }, [parties]);

  const topParty = useMemo(() => {
    return parties
      .filter((p) => p.status === 'APPROVED')
      .sort((a, b) => (b.ticketsSold || 0) - (a.ticketsSold || 0))[0];
  }, [parties]);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    suffix = '',
    color = 'text-[#ff5cc4]',
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    suffix?: string;
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-[#ff5cc4]/50 transition-all"
    >
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#ff2bd6]/20 to-[#9b5cff]/20 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-300" />

      <div className={`${color} mb-3 relative z-10`}>{Icon}</div>
      <p className="text-[#bba8d6]/60 text-xs uppercase font-label tracking-wider mb-2">
        {label}
      </p>
      <p className="text-white font-display text-3xl font-bold relative z-10">
        {value}
        {suffix && <span className="text-lg text-[#bba8d6]/60 ml-1">{suffix}</span>}
      </p>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-3xl uppercase tracking-tighter text-white mb-2">
          Analytics Dashboard
        </h2>
        <p className="text-[#bba8d6]/60 text-sm">
          Track your event performance and audience engagement
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BarChart3 size={24} />}
          label="Active Events"
          value={stats.approved}
          color="text-[#ff5cc4]"
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          label="Pending Review"
          value={stats.pending}
          color="text-[#ff9d3c]"
        />
        <StatCard
          icon={<Users size={24} />}
          label="Total Tickets Sold"
          value={stats.totalTickets}
          color="text-[#2bf0ff]"
        />
        <StatCard
          icon={<DollarSign size={24} />}
          label="Total Revenue"
          value={`$${(stats.totalRevenue).toFixed(0)}`}
          color="text-[#b6ff3c]"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Eye size={24} />}
          label="Event Views"
          value={Math.floor(stats.totalViewCount)}
          color="text-[#ff5cc4]"
        />
        <StatCard
          icon={<Share2 size={24} />}
          label="Total Shares"
          value={stats.totalShares}
          color="text-[#2bf0ff]"
        />
        <StatCard
          icon={<Star size={24} />}
          label="Avg Rating"
          value={stats.avgRating.toFixed(1)}
          suffix="⭐"
          color="text-[#b6ff3c]"
        />
      </div>

      {/* Top Performer */}
      {topParty && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#ff2bd6]/10 to-[#9b5cff]/10 rounded-full -translate-x-1/2 -translate-y-1/2" />

          <h3 className="font-bold text-[#ff5cc4] text-xs uppercase tracking-widest font-label mb-4 relative z-10">
            🔥 Top Event
          </h3>

          <div className="relative z-10">
            <div className="flex gap-4 mb-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-[#ff5cc4]/20 shrink-0">
                <img
                  src={topParty.posterURL}
                  alt={topParty.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h4 className="font-display text-white text-lg uppercase tracking-tight mb-1">
                  {topParty.name}
                </h4>
                <p className="text-[#bba8d6]/60 text-sm mb-3">{topParty.location}</p>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-[#bba8d6]/50 text-xs uppercase font-label tracking-wider mb-1">
                      Sold
                    </p>
                    <p className="text-white font-bold">
                      {topParty.ticketsSold}/{topParty.capacity}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#bba8d6]/50 text-xs uppercase font-label tracking-wider mb-1">
                      Revenue
                    </p>
                    <p className="text-white font-bold">
                      ${((topParty.ticketsSold || 0) * (topParty.price || 0)).toFixed(0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#bba8d6]/50 text-xs uppercase font-label tracking-wider mb-1">
                      Rating
                    </p>
                    <p className="text-white font-bold">
                      {topParty.averageRating?.toFixed(1) || '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity bar */}
            <div>
              <div className="w-full h-2 bg-[#11091c]/70 rounded-full overflow-hidden border border-[#ff5cc4]/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      topParty.capacity
                        ? ((topParty.ticketsSold || 0) / topParty.capacity) * 100
                        : 0
                    }%`,
                  }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-[#ff2bd6] to-[#ff5cc4]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Events Table */}
      {parties.filter((p) => p.status === 'APPROVED').length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/5">
            <h3 className="font-bold text-white text-lg uppercase tracking-tight">
              Events Summary
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#11091c]/50 border-b border-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-[#bba8d6]/60 text-xs uppercase font-label tracking-wider font-bold">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-[#bba8d6]/60 text-xs uppercase font-label tracking-wider font-bold">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-[#bba8d6]/60 text-xs uppercase font-label tracking-wider font-bold">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-[#bba8d6]/60 text-xs uppercase font-label tracking-wider font-bold">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-[#bba8d6]/60 text-xs uppercase font-label tracking-wider font-bold">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {parties
                  .filter((p) => p.status === 'APPROVED')
                  .slice(0, 5)
                  .map((party, index) => (
                    <tr key={party.id} className="border-b border-white/5 hover:bg-[#11091c]/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-white font-bold">{party.name}</p>
                      </td>
                      <td className="px-6 py-4 text-[#bba8d6]/70">
                        {party.date}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">
                            {party.ticketsSold}/{party.capacity}
                          </span>
                          <div className="w-16 h-1.5 bg-[#11091c]/70 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#ff5cc4] to-[#ff2bd6]"
                              style={{
                                width: `${
                                  party.capacity
                                    ? ((party.ticketsSold || 0) / party.capacity) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white font-bold">
                        ${((party.ticketsSold || 0) * (party.price || 0)).toFixed(0)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-white font-bold">
                            {party.averageRating?.toFixed(1) || '—'}
                          </span>
                          {party.averageRating && (
                            <Star size={12} className="text-[#b6ff3c] fill-[#b6ff3c]" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {parties.filter((p) => p.status === 'APPROVED').length === 0 && (
        <div className="text-center py-16">
          <p className="text-[#bba8d6]/60">
            Create and publish events to see analytics
          </p>
        </div>
      )}
    </div>
  );
};
