import React from 'react';
import { LayoutDashboard, Users, QrCode, BarChart3, Settings, LogOut } from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, currentView, onViewChange, onLogout }) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 z-50">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-sm flex items-center justify-center">
            <span className="font-bold text-white">X</span>
          </div>
          <h1 className="text-xl font-display font-bold tracking-tight uppercase tracking-tighter">X-CLUSIV</h1>
        </div>
        
        <nav className="space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-4 font-label">Portal</p>
            <ul className="space-y-2">
              <li 
                onClick={() => onViewChange(role === 'ADMIN' ? 'queue' : 'influencer')}
                className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-all ${
                  (currentView === 'queue' || currentView === 'influencer')
                    ? 'text-indigo-400 bg-indigo-400/10 border-r-2 border-indigo-500' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`w-1 h-4 border-l-2 transition-colors ${currentView === 'queue' || currentView === 'influencer' ? 'border-indigo-400' : 'border-slate-800'}`}></div>
                <span className="text-xs font-bold uppercase tracking-widest">{role === 'ADMIN' ? 'Admin Console' : 'Influencer Feed'}</span>
              </li>
              {role === 'ADMIN' && (
                <li 
                  onClick={() => onViewChange('registry')}
                  className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-all ${
                    currentView === 'registry'
                      ? 'text-indigo-400 bg-indigo-400/10 border-r-2 border-indigo-500' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className={`w-1 h-4 border-l-2 transition-colors ${currentView === 'registry' ? 'border-indigo-400' : 'border-slate-800'}`}></div>
                  <span className="text-xs font-bold uppercase tracking-widest">User Directory</span>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-4 font-label">Tools</p>
            <ul className="space-y-2">
              <li 
                onClick={() => onViewChange(role === 'ADMIN' ? 'qr' : 'analytics')}
                className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-all ${
                  (currentView === 'qr' || currentView === 'analytics')
                    ? 'text-indigo-400 bg-indigo-400/10 border-r-2 border-indigo-500' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`w-1 h-4 border-l-2 transition-colors ${currentView === 'qr' || currentView === 'analytics' ? 'border-indigo-400' : 'border-slate-800'}`}></div>
                <span className="text-xs font-bold uppercase tracking-widest">{role === 'ADMIN' ? 'QR Engine' : 'Analytics Node'}</span>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      
      <div className="mt-auto p-4 space-y-4">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded hover:bg-red-500/10 hover:border-red-500/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <LogOut size={16} className="text-slate-500 group-hover:text-red-500 transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-red-500">Terminate Protocol</span>
          </div>
        </button>

        <div className="flex items-center gap-3 p-2 bg-slate-900/30 rounded border border-slate-800/50">
          <div className="w-8 h-8 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold">
            {role === 'ADMIN' ? 'RT' : 'VH'}
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-bold truncate tracking-widest uppercase text-slate-200">{role === 'ADMIN' ? 'Root Terminal' : 'Verified Host'}</p>
            <p className="text-[8px] text-slate-600 truncate font-label tracking-wide">SECURE LINK ENCRYPTED</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
