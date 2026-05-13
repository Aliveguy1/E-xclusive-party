import React, { useMemo, useState } from 'react';
import {
  Search,
  Ban,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Mail,
  ShieldAlert,
} from 'lucide-react';
import { UserProfile } from '../types';

interface UserRegistryProps {
  users: UserProfile[];
  onApproveVerification: (userId: string) => void;
  onBanInfluencer?: (userId: string) => void;
}

export const UserRegistry: React.FC<UserRegistryProps> = ({ users, onApproveVerification, onBanInfluencer }) => {
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'INFLUENCER' | 'USER' | 'ADMIN'>('ALL');
  const [banConfirm, setBanConfirm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (!q) return true;
      return (
        u.nickname.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.uid.toLowerCase().includes(q)
      );
    });
  }, [users, query, roleFilter]);

  return (
    <div
      className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 relative z-10"
      data-testid="user-registry"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-3 uppercase tracking-tighter leading-none">
            Identity <span className="wordmark">Registry</span>
          </h1>
          <p className="text-[#bba8d6]/65 font-sans text-sm max-w-xl uppercase tracking-widest font-medium">
            Authorize hosts, screen ravers, manage protocol access.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[260px] relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bba8d6]/45"
            size={18}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#11091c]/70 border border-[#ff5cc4]/15 rounded-xl text-white pl-12 pr-4 py-3 transition-all font-sans placeholder:text-[#bba8d6]/40"
            placeholder="Filter by nickname, email or ID…"
            type="text"
            data-testid="registry-search"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
          className="bg-[#11091c]/70 border border-[#ff5cc4]/15 text-white px-5 py-3 font-label text-[10px] uppercase tracking-widest cursor-pointer rounded-xl"
          data-testid="registry-role-filter"
        >
          <option value="ALL">All Roles</option>
          <option value="INFLUENCER">Hosts</option>
          <option value="USER">Ravers</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-7 py-5 font-label text-[10px] uppercase tracking-[0.25em] text-[#bba8d6]/60 font-bold">
                  Identity
                </th>
                <th className="px-7 py-5 font-label text-[10px] uppercase tracking-[0.25em] text-[#bba8d6]/60 font-bold">
                  Role
                </th>
                <th className="px-7 py-5 font-label text-[10px] uppercase tracking-[0.25em] text-[#bba8d6]/60 font-bold">
                  Verification
                </th>
                <th className="px-7 py-5 font-label text-[10px] uppercase tracking-[0.25em] text-[#bba8d6]/60 font-bold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((user) => (
                <tr
                  key={user.uid}
                  className="hover:bg-white/[0.02] transition-colors group"
                  data-testid={`registry-row-${user.uid}`}
                >
                  <td className="px-7 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#ff5cc4]/20">
                        <img
                          src={
                            user.photoURL ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nickname}`
                          }
                          alt={user.nickname}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="block font-bold text-white font-display text-base uppercase tracking-tight">
                          @{user.nickname}
                        </span>
                        <span className="text-[10px] text-[#bba8d6]/55 uppercase tracking-wider font-label">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-7 py-5">
                    <span
                      className={`chip ${
                        user.role === 'ADMIN'
                          ? 'chip-cyan'
                          : user.role === 'INFLUENCER'
                          ? 'chip-magenta'
                          : 'chip-pending'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-7 py-5">
                    {user.isVerified ? (
                      <div className="flex items-center gap-2 text-[#b6ff3c]">
                        <ShieldCheck size={15} />
                        <span className="font-label text-[10px] uppercase tracking-widest font-bold">
                          Authorized
                        </span>
                      </div>
                    ) : user.isVerificationPending ? (
                      <div className="flex items-center gap-2 text-[#ffb84d] animate-pulse">
                        <ShieldAlert size={15} />
                        <span className="font-label text-[10px] uppercase tracking-widest font-bold">
                          Review Requested
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[#bba8d6]/45">
                        <span className="w-1.5 h-1.5 bg-[#bba8d6]/35 rounded-full" />
                        <span className="font-label text-[10px] uppercase tracking-widest font-bold">
                          Unverified
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-7 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      {user.isVerificationPending && (
                        <button
                          onClick={() => onApproveVerification(user.uid)}
                          className="p-2 rounded-lg bg-[#b6ff3c]/10 text-[#b6ff3c] border border-[#b6ff3c]/30 hover:bg-[#b6ff3c]/20 transition-all"
                          title="Authorize"
                          data-testid={`registry-approve-${user.uid}`}
                        >
                          <ShieldCheck size={16} />
                        </button>
                      )}
                      <button className="p-2 rounded-lg bg-white/[0.02] text-[#bba8d6]/55 border border-white/5 hover:text-[#2bf0ff] hover:border-[#2bf0ff]/40 transition-all">
                        <Mail size={16} />
                      </button>
                      {user.role === 'INFLUENCER' && !user.isBanned && (
                        <button
                          onClick={() => setBanConfirm(user.uid)}
                          className="p-2 rounded-lg bg-white/[0.02] text-[#bba8d6]/55 border border-white/5 hover:text-[#ff3b5c] hover:border-[#ff3b5c]/40 transition-all"
                          title="Ban this host"
                          data-testid={`registry-ban-${user.uid}`}
                        >
                          <Ban size={16} />
                        </button>
                      )}
                      {banConfirm === user.uid && (
                        <div className="absolute right-0 top-full mt-2 bg-[#0b0612] border border-[#ff3b5c]/30 rounded-lg p-3 z-10 whitespace-nowrap">
                          <p className="text-xs text-white mb-2">Ban this host?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setBanConfirm(null)}
                              className="px-2 py-1 text-xs rounded bg-white/10 text-white hover:bg-white/20 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                onBanInfluencer?.(user.uid);
                                setBanConfirm(null);
                              }}
                              className="px-2 py-1 text-xs rounded bg-[#ff3b5c] text-white hover:bg-[#ff2540] transition-colors"
                            >
                              Ban
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-7 py-10 text-center text-[#bba8d6]/45 font-label uppercase tracking-widest text-xs"
                  >
                    No users match your filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-7 py-5 border-t border-white/5 flex items-center justify-between">
          <p className="text-[#bba8d6]/45 font-label text-[10px] uppercase tracking-widest font-bold">
            {filtered.length} of {users.length} nodes
          </p>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-lg border border-white/5 flex items-center justify-center text-[#bba8d6]/55 hover:bg-white/[0.04] transition-all">
              <ChevronLeft size={16} />
            </button>
            <button className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ff2bd6] to-[#9b5cff] text-white flex items-center justify-center font-bold text-xs uppercase shadow-[0_8px_24px_-8px_rgba(255,43,214,0.7)]">
              01
            </button>
            <button className="w-9 h-9 rounded-lg border border-white/5 flex items-center justify-center text-[#bba8d6]/55 hover:bg-white/[0.04] transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
