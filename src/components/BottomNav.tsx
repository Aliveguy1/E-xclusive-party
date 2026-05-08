import React from 'react';
import { Compass, Sparkles, Ticket, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'discover', label: 'Discover', Icon: Compass },
    { id: 'studio', label: 'Studio', Icon: Sparkles },
    { id: 'tickets', label: 'Tickets', Icon: Ticket },
    { id: 'profile', label: 'Profile', Icon: User },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[440px] rounded-sm z-50 bg-slate-950/80 backdrop-blur-xl border border-slate-800 shadow-2xl">
      <div className="flex justify-around items-center h-16 px-4">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center justify-center transition-all duration-300 ${
              currentTab === id 
                ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(79,70,229,0.3)] scale-105' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon size={20} fill={currentTab === id ? 'currentColor' : 'none'} fillOpacity={0.1} />
            <span className="font-label text-[9px] uppercase tracking-widest mt-1.5 font-bold">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
