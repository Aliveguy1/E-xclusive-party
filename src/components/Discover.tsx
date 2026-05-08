import React from 'react';
import { Search, Heart, Verified, Calendar, MapPin, Zap } from 'lucide-react';
import { Party } from '../types';

import { generateGoogleCalendarLink } from '../services/calendar';

interface DiscoverProps {
  parties: Party[];
  onBook: (party: Party) => void;
}

export const Discover: React.FC<DiscoverProps> = ({ parties, onBook }) => {
  const featured = parties.find(p => p.status === 'APPROVED');

  const handleAddToCalendar = (party: Party) => {
    const link = generateGoogleCalendarLink(party);
    window.open(link, '_blank');
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 pb-32 bg-slate-950">
      <section className="mb-8">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            className="w-full bg-slate-900 border-b border-slate-800 focus:border-indigo-500 focus:ring-0 text-slate-100 py-4 pl-12 pr-4 transition-all duration-300 font-sans backdrop-blur-sm placeholder:text-slate-600"
            placeholder="Search event protocol..."
            type="text"
          />
        </div>
      </section>

      <section className="mb-8 flex gap-6 border-b border-slate-800/50">
        <button className="pb-4 font-label text-xs text-indigo-400 border-b-2 border-indigo-500 tracking-widest uppercase font-bold">For You</button>
        <button className="pb-4 font-label text-xs text-slate-500 hover:text-slate-200 transition-colors tracking-widest uppercase">Upcoming</button>
      </section>

      {featured && (
        <section className="mb-12">
          <div className="relative rounded overflow-hidden border border-slate-800 aspect-[16/9] group bg-slate-900">
            <img 
              src={featured.posterURL} 
              alt={featured.name} 
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            <div className="absolute top-6 left-6">
              <div className="flex items-center gap-2 px-3 py-1 rounded-sm bg-slate-950/80 backdrop-blur-md border border-emerald-500/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-label text-[10px] text-emerald-500 uppercase tracking-widest font-bold">Live Status</span>
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-indigo-400 font-label text-[10px] uppercase tracking-[0.2em] font-bold">{featured.venue || 'VIP Node'}</span>
                <Verified className="text-emerald-500" size={14} fill="currentColor" fillOpacity={0.2} />
              </div>
              <h2 className="font-display text-5xl md:text-6xl text-white mb-2 leading-none uppercase tracking-tighter">{featured.name}</h2>
              <p className="font-sans text-slate-400 text-sm mb-6 max-w-xl line-clamp-2">{featured.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-slate-300 opacity-80 uppercase font-label text-[10px] tracking-widest">
                  <div className="flex items-center gap-2"><Calendar size={14} className="text-indigo-500" /> FRIDAY • {featured.time}</div>
                </div>
                <button 
                  onClick={() => onBook(featured)}
                  className="bg-indigo-600 text-white px-8 py-3 rounded text-[10px] uppercase font-bold tracking-widest active:scale-95 transition-all shadow-lg shadow-indigo-600/20"
                >
                  Request Entry
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {parties.filter(p => p.status === 'APPROVED').map((party) => (
          <div key={party.id} className="bg-slate-950 border border-slate-800 rounded p-1 flex flex-col group hover:border-indigo-500/50 transition-all overflow-hidden">
            <div className="relative h-56 overflow-hidden bg-slate-900">
              <img 
                src={party.posterURL} 
                alt={party.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" 
              />
              <div className="absolute top-3 right-3 bg-indigo-600 text-white font-label text-[10px] px-2 py-1 rounded uppercase font-bold shadow-lg">Live Node</div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-display text-2xl text-slate-100 uppercase leading-none tracking-tight">{party.name}</h3>
                <div className="flex gap-3">
                  <Calendar 
                    className="text-indigo-400 cursor-pointer hover:text-white transition-colors" 
                    size={18} 
                    onClick={() => handleAddToCalendar(party)}
                  />
                  <Heart className="text-slate-600 cursor-pointer hover:text-red-500 transition-colors" size={18} />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-6">
                <p className="font-sans text-xs text-slate-500 font-medium uppercase tracking-wider">{party.venue || 'Soundstage London'}</p>
                <Verified className="text-emerald-500/60" size={12} fill="currentColor" fillOpacity={0.1} />
              </div>
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-800/50">
                <div className="flex flex-col">
                  <span className="font-label text-[9px] text-indigo-400 uppercase tracking-widest font-bold">Protocol Saturation</span>
                  <span className="font-label text-sm text-white">${party.price?.toFixed(2)}</span>
                </div>
                <span className="font-label text-[10px] text-slate-500 uppercase tracking-widest">{party.date}</span>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};
