import React, { useState } from 'react';
import { LogOut, LayoutDashboard, Users, QrCode, BarChart3, X, Menu } from 'lucide-react';
import { UserRole } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  role: UserRole;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({ role, currentView, onViewChange, onLogout }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const portalItems: NavItem[] =
    role === 'ADMIN'
      ? [
          { id: 'queue', label: 'Approval Queue', icon: LayoutDashboard },
          { id: 'registry', label: 'User Registry', icon: Users },
        ]
      : [{ id: 'influencer', label: 'Host Dashboard', icon: LayoutDashboard }];

  const toolItems: NavItem[] =
    role === 'ADMIN'
      ? [{ id: 'qr', label: 'QR Engine', icon: QrCode }]
      : [{ id: 'analytics', label: 'Analytics', icon: BarChart3 }];

  const handleNavClick = (itemId: string) => {
    onViewChange(itemId);
    setIsMobileOpen(false);
  };

  const renderItem = (item: NavItem) => {
    const active = currentView === item.id;
    const Icon = item.icon;
    return (
      <li
        key={item.id}
        onClick={() => handleNavClick(item.id)}
        className={`group flex items-center gap-3 pl-4 pr-3 py-3 rounded-lg cursor-pointer transition-all relative ${
          active
            ? 'bg-gradient-to-r from-[#ff2bd6]/15 to-transparent text-white'
            : 'text-[#bba8d6]/65 hover:text-white hover:bg-white/[0.03]'
        }`}
        data-testid={`sidebar-nav-${item.id}`}
      >
        <span
          className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full transition-all ${
            active ? 'bg-gradient-to-b from-[#ff2bd6] to-[#9b5cff] shadow-[0_0_10px_rgba(255,43,214,0.7)]' : 'bg-transparent'
          }`}
        />
        <Icon size={15} className={active ? 'text-[#ff5cc4]' : 'text-[#bba8d6]/50'} />
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] font-label">{item.label}</span>
      </li>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-[#11091c]/80 border border-[#ff5cc4]/20 text-[#ff5cc4] hover:border-[#ff2bd6] transition-all"
        data-testid="sidebar-mobile-toggle"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 flex flex-col shrink-0 z-50 bg-[#080410]/85 backdrop-blur-xl border-r border-[#ff5cc4]/10 transition-transform lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        data-testid="sidebar"
      >
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#ff2bd6]/40 to-transparent" />

        <div className="p-7 pb-2">
          <Logo size="md" />
          <p className="mt-3 font-label text-[9px] uppercase tracking-[0.4em] text-[#bba8d6]/45">
            {role === 'ADMIN' ? 'Root Console' : 'Host Console'}
          </p>
        </div>

        <nav className="px-4 pt-6 space-y-7 flex-1 overflow-y-auto custom-scrollbar">
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#bba8d6]/40 mb-3 font-label px-2">
              Portal
            </p>
            <ul className="space-y-1">{portalItems.map(renderItem)}</ul>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#bba8d6]/40 mb-3 font-label px-2">
              Tools
            </p>
            <ul className="space-y-1">{toolItems.map(renderItem)}</ul>
          </div>
        </nav>

        <div className="p-4 space-y-3 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-[#ff2bd6] to-[#9b5cff] flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-[#ff2bd6]/30">
              {role === 'ADMIN' ? 'RT' : 'VH'}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white">
                {role === 'ADMIN' ? 'Root Terminal' : 'Verified Host'}
              </p>
              <p className="text-[8px] text-[#bba8d6]/45 font-label tracking-wider uppercase">
                Secure link · encrypted
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onLogout();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-[#ff3b5c]/10 hover:border-[#ff3b5c]/30 transition-all group"
            data-testid="sidebar-logout"
          >
            <div className="flex items-center gap-3">
              <LogOut size={15} className="text-[#bba8d6]/60 group-hover:text-[#ff3b5c] transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] font-label text-[#bba8d6]/70 group-hover:text-[#ff3b5c]">
                End Session
              </span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';
