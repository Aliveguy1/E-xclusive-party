import React from 'react';
import { Search, PlusCircle, Download, Share2, MoreVertical } from 'lucide-react';
import { Party } from '../types';

interface QRManagementProps {
  approvedParties: Party[];
}

export const QRManagement: React.FC<QRManagementProps> = ({ approvedParties }) => {
  return (
    <div className="p-12 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="flex gap-12">
          <div>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">Total Codes</p>
            <p className="font-display text-5xl leading-none text-on-surface font-bold">{approvedParties.length}</p>
          </div>
          <div>
            <p className="font-label text-xs uppercase tracking-widest text-tertiary mb-2">Active Now</p>
            <p className="font-display text-5xl leading-none text-tertiary font-bold">{approvedParties.length}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
            <input 
              className="bg-surface-container-low border-0 border-b-2 border-outline-variant/40 focus:border-primary focus:ring-0 text-sm pl-10 pr-4 py-2 w-64 transition-all"
              placeholder="Search event or ID..."
              type="text"
            />
          </div>
          <button className="bg-primary text-black px-6 py-2 rounded-full font-label text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all font-bold">
            <PlusCircle size={16} />
            Generate New
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {approvedParties.map((party) => (
          <div key={party.id} className="glass-card rounded-2xl p-6 group flex flex-col transition-all duration-500 hover:translate-y-[-4px]">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                  <img src={party.posterURL} alt={party.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-on-surface font-bold text-xl leading-tight uppercase font-display">{party.name}</h3>
                  <p className="text-on-surface-variant text-xs mt-1 uppercase font-label">{party.venue || 'Main Stage'} • {party.time}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                    <span className="font-label text-[10px] text-tertiary uppercase tracking-widest font-bold">Active</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="bg-[#151219] aspect-square rounded-2xl relative flex items-center justify-center p-8 mb-6 border border-tertiary shadow-[0_0_15px_rgba(23,222,202,0.2)]">
              {party.qrCode ? (
                <img src={party.qrCode} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="text-on-surface-variant text-xs opacity-50 font-label uppercase tracking-widest">Generating QR...</div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-xl bg-[#151219] border border-tertiary/30 flex items-center justify-center shadow-2xl">
                  <span className="font-display text-primary text-xl tracking-tighter">X</span>
                </div>
              </div>
            </div>

            <div className="mt-auto flex gap-3">
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: party.name,
                      text: `Check out ${party.name} at ${party.venue || 'Club'}! Use this QR code for entry.`,
                      url: party.qrCode || window.location.href
                    }).catch(console.error);
                  } else {
                    navigator.clipboard.writeText(`Party: ${party.name}\nVenue: ${party.venue}\nTime: ${party.time}\nQR: ${party.qrCode || 'Pending'}`);
                    alert('Details copied to clipboard!');
                  }
                }}
                className="flex-1 border border-indigo-500/20 text-slate-300 bg-indigo-500/5 px-4 py-3 rounded-sm font-label text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Share2 size={16} />
                Broadcast Protocol
              </button>
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = party.qrCode || '';
                  link.download = `${party.name.replace(/\s+/g, '_')}_QR.png`;
                  link.click();
                }}
                className="w-12 h-12 border border-slate-800 text-slate-500 rounded-sm flex items-center justify-center hover:bg-slate-800 hover:text-white transition-all"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
