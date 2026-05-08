import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';
import { Logo } from './Logo';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [hovered, setHovered] = useState<UserRole | null>(null);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 md:p-10 relative overflow-hidden"
      data-testid="login-screen"
    >
      {/* Aurora orbs */}
      <div className="pointer-events-none absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full bg-[#ff2bd6]/20 blur-[120px] animate-drift" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 w-[600px] h-[600px] rounded-full bg-[#2bf0ff]/15 blur-[140px] animate-drift" style={{ animationDelay: '2s' }} />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-[#9b5cff]/10 blur-[100px]" />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-8">
            <Logo size="hero" showWordmark={false} />
          </div>
          <h1
            className="wordmark uppercase text-7xl md:text-8xl leading-none tracking-tighter mb-5"
            data-testid="login-app-name"
          >
            RiXzLa
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#ff2bd6]" />
            <span className="font-label text-[10px] uppercase tracking-[0.5em] text-[#ff5cc4] font-bold">
              Nightlife Protocol
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#2bf0ff]" />
          </div>
          <p className="font-sans text-[#bba8d6]/70 text-sm max-w-[300px] mx-auto leading-relaxed">
            Curated raves. Verified hosts. QR-gated guestlists. Step inside the city's most electric room.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="glass-card rounded-2xl p-8 md:p-9 space-y-7 relative overflow-hidden"
        >
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#ff2bd6]/60 to-transparent" />

          <button
            onClick={() => onLogin('USER')}
            onMouseEnter={() => setHovered('USER')}
            onMouseLeave={() => setHovered(null)}
            className="btn-neon w-full h-14 text-xs"
            data-testid="login-as-raver"
          >
            <Sparkles size={16} className={hovered === 'USER' ? 'animate-flicker' : ''} />
            Enter as Raver
            <ArrowRight size={16} />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#9b5cff]/40 to-transparent" />
            <span className="font-label text-[9px] text-[#bba8d6]/50 uppercase tracking-[0.3em] font-bold whitespace-nowrap">
              or join the crew
            </span>
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#9b5cff]/40 to-transparent" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onLogin('INFLUENCER')}
              onMouseEnter={() => setHovered('INFLUENCER')}
              onMouseLeave={() => setHovered(null)}
              className="col-span-2 group relative flex flex-col items-center justify-center gap-2 py-5 rounded-xl bg-[#11091c]/70 border border-[#ff5cc4]/25 hover:border-[#ff2bd6]/70 transition-all overflow-hidden"
              data-testid="login-as-host"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-[#ff2bd6]/0 via-transparent to-[#9b5cff]/0 group-hover:from-[#ff2bd6]/10 group-hover:to-[#9b5cff]/10 transition-all" />
              <Zap size={18} className="text-[#ff5cc4] group-hover:text-[#ff2bd6] transition-colors animate-pulse-glow" />
              <span className="font-label text-[10px] uppercase tracking-[0.22em] font-bold text-[#f0e7ff]">
                Host · Influencer
              </span>
            </button>
            <button
              onClick={() => onLogin('ADMIN')}
              onMouseEnter={() => setHovered('ADMIN')}
              onMouseLeave={() => setHovered(null)}
              className="group relative flex flex-col items-center justify-center gap-2 py-5 rounded-xl bg-[#11091c]/70 border border-[#2bf0ff]/20 hover:border-[#2bf0ff]/60 transition-all"
              data-testid="login-as-admin"
            >
              <ShieldAlert size={18} className="text-[#2bf0ff]" />
              <span className="font-label text-[10px] uppercase tracking-[0.22em] font-bold text-[#bff7ff]">
                Root
              </span>
            </button>
          </div>

          <p className="text-[9px] text-[#bba8d6]/55 font-label uppercase tracking-widest text-center">
            Host nodes require <span className="text-[#ff5cc4]">Level 01</span> verification
          </p>
        </motion.div>

        <p className="text-center font-sans text-[#bba8d6]/40 text-[10px] mt-10 uppercase tracking-widest font-bold leading-relaxed">
          By initializing, you accept the<br />
          <span className="text-[#ff5cc4] cursor-pointer hover:text-white transition-colors">
            RiXzLa House Rules
          </span>
        </p>
      </div>
    </div>
  );
};
