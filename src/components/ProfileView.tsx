import React from 'react';
import {
  MessageSquare,
  Instagram,
  Twitter,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Settings,
  Camera,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onLogout: () => void;
}

interface ConnectRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}

const ConnectRow: React.FC<ConnectRowProps> = ({ icon: Icon, label, value, accent }) => (
  <div className="p-5 flex items-center justify-between group hover:bg-white/[0.02] transition-colors cursor-pointer">
    <div className="flex items-center gap-4">
      <div
        className="w-11 h-11 flex items-center justify-center rounded-xl"
        style={{
          background: `${accent}1A`,
          color: accent,
          boxShadow: `0 0 18px -6px ${accent}`,
        }}
      >
        <Icon size={20} />
      </div>
      <div className="flex flex-col">
        <label className="text-[9px] text-[#bba8d6]/55 font-label uppercase tracking-[0.25em] font-bold mb-1">
          {label}
        </label>
        <span className="text-white font-medium text-sm">{value}</span>
      </div>
    </div>
    <ChevronRight
      className="text-[#bba8d6]/35 group-hover:translate-x-1 transition-all"
      size={18}
    />
  </div>
);

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
  const handleChangePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          console.log('Photo updated:', file.name);
          // In a real app, you'd upload this to Firebase Storage
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSettings = () => {
    console.log('Opening system preferences');
    // Navigate to settings page or open modal
  };

  return (
    <main
      className="max-w-xl mx-auto px-5 py-10 space-y-10 pb-32 relative z-10"
      data-testid="profile-view"
    >
      <section className="flex flex-col items-center text-center space-y-7">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full p-1 neon-ring relative">
            <img
              src={
                user.photoURL ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nickname}`
              }
              alt="Avatar"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <button
            onClick={handleChangePhoto}
            className="absolute bottom-0 right-0 bg-gradient-to-br from-[#ff2bd6] to-[#9b5cff] text-white p-2.5 rounded-full shadow-xl hover:scale-105 transition-transform"
            aria-label="Change photo"
            data-testid="profile-change-photo"
          >
            <Camera size={15} />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3">
            <h2
              className="font-display text-3xl text-white uppercase tracking-tighter leading-none"
              data-testid="profile-nickname"
            >
              @{user.nickname}
            </h2>
            {user.isVerified && (
              <ShieldCheck className="text-[#b6ff3c]" size={22} fill="currentColor" fillOpacity={0.15} />
            )}
          </div>
          <p className="text-[#bba8d6]/55 font-label text-[10px] uppercase tracking-[0.35em] font-bold">
            {user.role} · {user.email}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-label text-[10px] text-[#bba8d6]/45 uppercase tracking-[0.3em] px-1 font-bold">
          Connections
        </h3>
        <div className="glass-card rounded-2xl overflow-hidden divide-y divide-white/5">
          <ConnectRow
            icon={MessageSquare}
            label="WhatsApp"
            value={user.whatsapp || 'Pending sync'}
            accent="#b6ff3c"
          />
          <ConnectRow
            icon={Instagram}
            label="Instagram"
            value={user.instagram || '@vibe_protocol'}
            accent="#ff2bd6"
          />
          <ConnectRow
            icon={Twitter}
            label="X / Twitter"
            value={user.twitter || '@exclusive_node'}
            accent="#2bf0ff"
          />
        </div>
      </section>

      <section className="space-y-3">
        <button
          onClick={handleSettings}
          className="w-full flex items-center justify-between p-5 glass-card rounded-2xl hover:bg-white/[0.04] transition-colors group"
          data-testid="profile-settings"
        >
          <div className="flex items-center gap-4">
            <Settings
              className="text-[#bba8d6]/65 group-hover:text-[#ff5cc4] transition-colors"
              size={18}
            />
            <span className="font-bold uppercase font-label text-[10px] tracking-[0.25em] text-[#e8def8]/90">
              System Preferences
            </span>
          </div>
          <ChevronRight size={16} className="text-[#bba8d6]/45" />
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between p-5 rounded-2xl bg-[#ff3b5c]/8 border border-[#ff3b5c]/25 text-[#ff3b5c] hover:bg-[#ff3b5c]/15 transition-colors group"
          data-testid="profile-logout"
        >
          <div className="flex items-center gap-4">
            <LogOut size={18} />
            <span className="font-bold uppercase font-label text-[10px] tracking-[0.25em]">
              End Session
            </span>
          </div>
        </button>
      </section>
    </main>
  );
};
