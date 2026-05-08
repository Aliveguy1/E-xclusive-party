import React from 'react';
import { UserProfile } from '../types';
import { MessageSquare, Instagram, Twitter, ShieldCheck, LogOut, ChevronRight, Settings, Camera } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
  return (
    <main className="max-w-xl mx-auto px-6 py-12 space-y-12 pb-32 bg-slate-950">
      <section className="flex flex-col items-center text-center space-y-8">
        <div className="relative group">
          <div className="w-36 h-36 rounded-sm p-1 border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.15)] relative">
            <img 
              src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nickname}`} 
              alt="Avatar" 
              className="w-full h-full object-cover rounded-sm" 
            />
            <div className="absolute inset-0 border border-slate-800 scale-95 pointer-events-none"></div>
          </div>
          <button className="absolute bottom-[-10px] right-[-10px] bg-indigo-600 text-white p-3 rounded-sm shadow-xl border border-slate-800 hover:bg-indigo-500 transition-colors">
            <Camera size={18} />
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3">
            <h2 className="font-display text-4xl text-slate-100 uppercase tracking-tighter leading-none">{user.nickname}</h2>
            {user.isVerified && <ShieldCheck className="text-emerald-500" size={24} fill="currentColor" fillOpacity={0.1} />}
          </div>
          <p className="text-slate-500 font-label text-[10px] uppercase tracking-[0.3em] font-bold">{user.role} • {user.email}</p>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="font-label text-[10px] text-slate-600 uppercase tracking-widest px-1 font-bold">Metadata / Connectivity</h3>
        <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden divide-y divide-slate-800/80">
          <div className="p-6 flex items-center justify-between group hover:bg-slate-800/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-500/10 rounded text-indigo-400">
                <MessageSquare size={22} />
              </div>
              <div className="flex flex-col">
                <label className="text-[9px] text-slate-500 font-label uppercase tracking-widest font-bold mb-1">WhatsApp Protocol</label>
                <span className="text-slate-200 font-medium text-sm">{user.whatsapp || 'Pending sync'}</span>
              </div>
            </div>
            <ChevronRight className="text-slate-600 opacity-40 group-hover:translate-x-1 transition-all" size={20} />
          </div>

          <div className="p-6 flex items-center justify-between group hover:bg-slate-800/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-500/10 rounded text-indigo-400">
                <Instagram size={22} />
              </div>
              <div className="flex flex-col">
                <label className="text-[9px] text-slate-500 font-label uppercase tracking-widest font-bold mb-1">IG Handle</label>
                <span className="text-slate-200 font-medium text-sm">{user.instagram || '@vibe_protocol'}</span>
              </div>
            </div>
            <ChevronRight className="text-slate-600 opacity-40 group-hover:translate-x-1 transition-all" size={20} />
          </div>

          <div className="p-6 flex items-center justify-between group hover:bg-slate-800/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-500/10 rounded text-indigo-400">
                <Twitter size={22} />
              </div>
              <div className="flex flex-col">
                <label className="text-[9px] text-slate-500 font-label uppercase tracking-widest font-bold mb-1">X Protocol</label>
                <span className="text-slate-200 font-medium text-sm">{user.twitter || '@exclusive_node'}</span>
              </div>
            </div>
            <ChevronRight className="text-slate-600 opacity-40 group-hover:translate-x-1 transition-all" size={20} />
          </div>
        </div>
      </section>

      <section className="space-y-4 pt-4 border-t border-slate-800/50">
        <button className="w-full flex items-center justify-between p-6 bg-slate-900/40 border border-slate-800 rounded hover:bg-slate-900 transition-colors group">
          <div className="flex items-center gap-4">
            <Settings className="text-slate-500 group-hover:text-indigo-400 transition-colors" size={20} />
            <span className="font-bold uppercase font-label text-[10px] tracking-widest text-slate-300">System Preferences</span>
          </div>
          <ChevronRight size={18} className="text-slate-600" />
        </button>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-between p-6 bg-red-500/5 border border-red-900/30 rounded text-red-500 hover:bg-red-500/10 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <LogOut size={20} />
            <span className="font-bold uppercase font-label text-[10px] tracking-widest">Terminate Session</span>
          </div>
        </button>
      </section>
    </main>
  );
};
