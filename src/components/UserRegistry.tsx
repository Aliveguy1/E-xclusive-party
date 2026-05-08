import React from 'react';
import { Search, Filter, Ban, ChevronLeft, ChevronRight, CheckCircle, ShieldCheck, Mail, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types';

interface UserRegistryProps {
  users: UserProfile[];
  onApproveVerification: (userId: string) => void;
}

export const UserRegistry: React.FC<UserRegistryProps> = ({ users, onApproveVerification }) => {
  return (
    <div className="p-12 max-w-7xl mx-auto space-y-12 bg-slate-950">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-6xl text-white mb-4 uppercase tracking-tighter">Identity Registry</h1>
          <p className="text-slate-500 font-sans text-sm max-w-xl uppercase tracking-widest font-medium opacity-60">
            Biometric and social authorization management. Centralize protocol access and status verification.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded p-6 flex flex-wrap items-center gap-6">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-100 pl-12 pr-4 py-3 outline-none transition-all font-sans placeholder:text-slate-700 rounded-sm"
            placeholder="Filter by nickname or node ID..."
            type="text"
          />
        </div>
        <div className="flex gap-4">
          <select className="bg-slate-950 border border-slate-800 text-slate-300 px-6 py-3 outline-none focus:border-indigo-500 font-label text-[10px] uppercase tracking-widest cursor-pointer rounded-sm">
            <option>All Access Levels</option>
            <option>Host Node</option>
            <option>Network Node</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800">
              <th className="px-8 py-5 font-label text-[10px] uppercase tracking-widest text-slate-500 font-bold">Node Identity</th>
              <th className="px-8 py-5 font-label text-[10px] uppercase tracking-widest text-slate-500 font-bold">Role Descriptor</th>
              <th className="px-8 py-5 font-label text-[10px] uppercase tracking-widest text-slate-500 font-bold">Verification Status</th>
              <th className="px-8 py-5 font-label text-[10px] uppercase tracking-widest text-slate-500 font-bold text-right">Auth Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {users.map((user) => (
              <tr key={user.uid} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-sm border border-slate-800 overflow-hidden bg-slate-950 p-0.5">
                      <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nickname}`} alt={user.nickname} className="w-full h-full object-cover rounded-sm" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-100 font-display text-lg uppercase tracking-tight">@{user.nickname}</span>
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 rounded-sm bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-label text-[10px] uppercase tracking-widest font-bold">
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-6">
                  {user.isVerified ? (
                    <div className="flex items-center gap-2 text-emerald-500">
                      <ShieldCheck size={16} />
                      <span className="font-label text-[10px] uppercase tracking-widest font-bold">Authorized</span>
                    </div>
                  ) : user.isVerificationPending ? (
                    <div className="flex items-center gap-2 text-amber-500 animate-pulse">
                      <ShieldAlert size={16} />
                      <span className="font-label text-[10px] uppercase tracking-widest font-bold">Review Requested</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                      <span className="font-label text-[10px] uppercase tracking-widest font-bold">Unverified</span>
                    </div>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3">
                    {user.isVerificationPending && (
                      <button 
                        onClick={() => onApproveVerification(user.uid)}
                        className="p-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10" 
                        title="Authorize Identity"
                      >
                        <ShieldCheck size={18} />
                      </button>
                    )}
                    <button className="p-2 bg-slate-950 text-slate-600 border border-slate-800 rounded hover:text-indigo-400 hover:border-indigo-500 transition-all">
                      <Mail size={18} />
                    </button>
                    <button className="p-2 bg-slate-950 text-slate-600 border border-slate-800 rounded hover:text-red-500 hover:border-red-500 transition-all">
                      <Ban size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-8 bg-slate-950/50 border-t border-slate-800/50 flex items-center justify-between">
          <p className="text-slate-600 font-label text-[10px] uppercase tracking-widest font-bold">Index Data Source Root • {users.length} Nodes</p>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded border border-slate-800 flex items-center justify-center text-slate-600 hover:bg-slate-800 transition-all">
              <ChevronLeft size={18} />
            </button>
            <button className="w-10 h-10 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-lg shadow-indigo-600/20">01</button>
            <button className="w-10 h-10 rounded border border-slate-800 flex items-center justify-center text-slate-600 hover:bg-slate-800 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
