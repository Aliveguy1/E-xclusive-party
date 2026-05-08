import React from 'react';
import { Compass, Sparkles, Ticket, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'discover', label: 'Discover', Icon: Compass },
  { id: 'studio', label: 'Studio', Icon: Sparkles },
  { id: 'tickets', label: 'Tickets', Icon: Ticket },
  { id: 'profile', label: 'Profile', Icon: User },
] as const;

export const BottomNav: React.FC<BottomNavProps> = React.memo(({ currentTab, onTabChange }) => {
  return (
    <nav
      className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-[460px] z-50"
      data-testid="bottom-nav"
    >
      <div className="relative rounded-2xl bg-[#0b0612]/80 backdrop-blur-xl border border-[#ff5cc4]/15 shadow-[0_20px_60px_-12px_rgba(255,43,214,0.45)] overflow-hidden">
        <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#ff2bd6]/60 to-transparent" />
        <div className="flex justify-around items-center h-16 px-3">
          {TABS.map(({ id, label, Icon }) => {
            const active = currentTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all duration-300 ${
                  active ? 'text-white' : 'text-[#bba8d6]/55 hover:text-[#bba8d6]'
                }`}
                data-testid={`bottom-nav-${id}`}
              >
                {active && (
                  <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#ff2bd6] shadow-[0_0_10px_rgba(255,43,214,0.9)]" />
                )}
                <Icon
                  size={20}
                  className={active ? 'drop-shadow-[0_0_10px_rgba(255,43,214,0.8)]' : ''}
                  fill={active ? 'currentColor' : 'none'}
                  fillOpacity={active ? 0.12 : 0}
                />
                <span
                  className={`font-label text-[9px] uppercase tracking-[0.22em] mt-0.5 font-bold ${
                    active ? 'wordmark' : ''
                  }`}
                  style={active ? undefined : {}}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
});

BottomNav.displayName = 'BottomNav';
