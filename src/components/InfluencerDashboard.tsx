import React from 'react';
import { PlusCircle, TrendingUp, Share2, Edit2, CheckCircle, LogOut, ShieldAlert, Loader2 } from 'lucide-react';
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
  onRequestVerification 
}) => {
  return (
    <div className="p-12 max-w-7xl mx-auto flex flex-col h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tighter">
              Welcome, <span className="text-indigo-400">{user.nickname}</span>
            </h1>
            {user.isVerified ? (
              <CheckCircle className="text-emerald-500" size={32} />
            ) : user.isVerificationPending ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/50 rounded text-amber-500 font-label text-[10px] uppercase font-bold tracking-widest">
                <Loader2 size={12} className="animate-spin" />
                Under Review
              </div>
            ) : (
              <button 
                onClick={onRequestVerification}
                className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/50 rounded text-indigo-400 font-label text-[10px] uppercase font-bold tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
              >
                <ShieldAlert size={12} />
                Get Verified
              </button>
            )}
          </div>
          <p className="text-slate-400 font-label text-xs uppercase tracking-widest opacity-60">
            Reputation Score: <span className="text-indigo-400 font-bold">84/100</span> • {parties.filter(p => p.status === 'PENDING').length} reviews pending
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onLogout}
            className="md:hidden bg-slate-900 border border-slate-800 text-slate-400 px-6 py-4 rounded font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-slate-800 transition-all"
          >
            <LogOut size={16} />
            Exit
          </button>
          <button 
            onClick={onCreateEvent}
            className="bg-indigo-600 text-white px-8 py-4 rounded font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
          >
            <PlusCircle size={16} />
            Deploy New Event
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg h-36 flex flex-col justify-between">
          <span className="font-label text-[10px] text-slate-500 uppercase tracking-widest">Global Reach</span>
          <div className="text-3xl font-display font-bold text-white">12.4K</div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
            <div className="w-[70%] h-full bg-indigo-500"></div>
          </div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg h-36 flex flex-col justify-between">
          <span className="font-label text-[10px] text-slate-500 uppercase tracking-widest">Live Nodes</span>
          <div className="text-3xl font-display font-bold text-emerald-500">
            {parties.filter(p => p.status === 'APPROVED').length.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-label font-bold">Verification Queue Active</div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-lg h-36 md:col-span-2 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="font-label text-[10px] text-slate-500 uppercase tracking-widest">Protocol Earnings</span>
            <div className="text-3xl font-display font-bold text-indigo-400 mt-1">$42,900.00</div>
          </div>
          <div className="absolute bottom-[-10px] right-[-10px] w-full h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full text-indigo-400" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 80 Q 25 20 50 60 T 100 10" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </section>

      <section className="space-y-8 flex-1">
        <div className="flex items-center justify-between opacity-80">
          <h2 className="font-display text-xl uppercase tracking-widest text-slate-400">Node Inventory</h2>
          <div className="flex gap-4">
            <button className="text-[10px] font-label text-indigo-400 uppercase tracking-widest font-bold border-b border-indigo-400">Inventory</button>
            <button className="text-[10px] font-label text-slate-500 uppercase tracking-widest hover:text-slate-200 transition-colors">Archived</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parties.map((party) => (
            <div key={party.id} className="bg-slate-950 border border-slate-800 rounded p-1 group hover:border-indigo-500/50 transition-all duration-300">
              <div className="h-40 w-full relative overflow-hidden">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={party.posterURL} alt={party.name} />
                <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded text-[10px] border border-slate-800 flex items-center gap-1.5 uppercase font-label font-bold">
                  {party.status === 'APPROVED' ? (
                    <>
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span className="text-emerald-500">Live</span>
                    </>
                  ) : party.status === 'PENDING' ? (
                    <>
                      <div className="w-1.5 h-1.5 bg-amber-500 animate-pulse rounded-full"></div>
                      <span className="text-amber-500">Queue</span>
                    </>
                  ) : (
                    <>
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span className="text-red-500">Offline</span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg mb-4 uppercase tracking-tight text-slate-200">{party.name}</h3>
                <div className="flex justify-between items-center text-slate-500 font-label text-[10px] uppercase tracking-widest border-t border-slate-800/50 pt-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={12} /> {party.ticketsSold}/{party.capacity}
                  </div>
                  <div className="flex items-center gap-3">
                    {party.status === 'APPROVED' ? (
                      <Share2 size={12} className="cursor-pointer hover:text-indigo-400" />
                    ) : (
                      <Edit2 size={12} className="cursor-pointer hover:text-indigo-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
