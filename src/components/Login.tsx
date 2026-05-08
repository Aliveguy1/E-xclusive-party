import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [nickname, setNickname] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
          <span className="font-label text-[10px] uppercase tracking-[0.4em] text-indigo-400 mb-6 block font-bold">X-Clusiv Entry Protocol</span>
          <h1 className="font-display text-7xl md:text-8xl text-white mb-8 leading-none tracking-tighter uppercase relative z-10">X-CLUSIV</h1>
          <p className="font-sans text-slate-500 text-sm max-w-[280px] mx-auto uppercase tracking-widest font-medium opacity-60">Architecting the future of curated nightlife empire.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-10 space-y-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
          
          <div className="space-y-6">
            <button 
              onClick={() => onLogin('USER')}
              className="w-full h-16 flex items-center justify-center gap-4 bg-white text-black font-bold rounded-sm hover:bg-indigo-50 transition-all active:scale-98 shadow-xl uppercase tracking-widest text-xs"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale" alt="Google" />
              Sign up as Guest (Raver)
            </button>

            <div className="flex items-center gap-6">
              <div className="flex-grow h-[1px] bg-slate-800"></div>
              <span className="font-label text-[9px] text-slate-600 uppercase tracking-[0.3em] font-bold">Network Nodes</span>
              <div className="flex-grow h-[1px] bg-slate-800"></div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <button 
                  onClick={() => onLogin('INFLUENCER')}
                  className="flex-1 flex flex-col items-center justify-center gap-3 py-6 bg-slate-950 border border-indigo-500/20 rounded-sm font-label text-[9px] uppercase tracking-widest font-bold text-slate-400 hover:text-white hover:border-indigo-500 transition-all group relative overflow-hidden"
                >
                  <div className="w-2 h-2 bg-indigo-500 rounded-full group-hover:animate-ping opacity-60"></div>
                  Host (Influencer)
                </button>
                <button 
                  onClick={() => onLogin('ADMIN')}
                  className="w-24 flex flex-col items-center justify-center gap-3 py-6 bg-slate-950 border border-slate-800 rounded-sm font-label text-[9px] uppercase tracking-widest font-bold text-slate-600 hover:text-red-500 hover:border-red-500/30 transition-all group"
                >
                  <div className="w-2 h-2 bg-red-800 rounded-full"></div>
                  Root
                </button>
              </div>
              <p className="text-[9px] text-indigo-400/60 font-label uppercase tracking-widest text-center animate-pulse">
                * Host Node registration requires Level 01 Admin Verification
              </p>
            </div>
          </div>
        </div>

        <p className="text-center font-sans text-slate-600 text-[10px] mt-12 uppercase tracking-widest font-bold opacity-40 leading-relaxed">
          By initializing, you accept the <br /> <span className="text-indigo-400 cursor-pointer hover:text-white">Central Operations Protocol</span>.
        </p>
      </div>
    </div>
  );
};
