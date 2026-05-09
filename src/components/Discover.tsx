import React, { useMemo, useState, useCallback } from 'react';
import { Search, Heart, ShieldCheck, Calendar, MapPin, Sparkles, Flame } from 'lucide-react';
import { motion } from 'motion/react';
import { Party } from '../types';
import { generateGoogleCalendarLink } from '../services/calendar';

interface DiscoverProps {
  parties: Party[];
  onBook: (party: Party) => void;
}

type FilterTab = 'foryou' | 'upcoming';

const PartyCard = React.memo(function PartyCard({
  party,
  onCalendar,
}: {
  party: Party;
  onCalendar: (p: Party) => void;
}) {
  const [isFavorited, setIsFavorited] = React.useState(false);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    console.log(`Party ${party.name} ${!isFavorited ? 'saved' : 'unsaved'} to favorites`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300"
      data-testid={`party-card-${party.id}`}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={party.posterURL}
          alt={party.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0612] via-[#0b0612]/30 to-transparent" />
        <div className="absolute top-3 left-3 chip chip-live">
          <span className="w-1.5 h-1.5 rounded-full bg-[#b6ff3c] animate-pulse" />
          Live
        </div>
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#bba8d6]/70 hover:text-[#ff5cc4] hover:border-[#ff2bd6]/50 transition-all"
          aria-label="Save"
          data-testid={`party-favorite-${party.id}`}
        >
          <Heart size={15} fill={isFavorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="font-display text-xl text-white uppercase leading-tight tracking-tight">
            {party.name}
          </h3>
          <button
            onClick={() => onCalendar(party)}
            className="shrink-0 w-9 h-9 rounded-full bg-[#ff2bd6]/10 border border-[#ff2bd6]/30 flex items-center justify-center text-[#ff5cc4] hover:bg-[#ff2bd6]/25 transition-all"
            aria-label="Add to calendar"
            data-testid={`party-calendar-${party.id}`}
          >
            <Calendar size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[#bba8d6]/65 text-xs mb-5">
          <MapPin size={12} className="text-[#2bf0ff]" />
          <span className="font-label uppercase tracking-wider">{party.location}</span>
          <ShieldCheck size={11} className="text-[#b6ff3c]" />
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="font-label text-[9px] text-[#ff5cc4] uppercase tracking-[0.22em] font-bold">
              From
            </span>
            <span className="font-display text-lg text-white leading-none mt-1">
              ${party.price?.toFixed(0)}
            </span>
          </div>
          <div className="text-right">
            <p className="font-label text-[9px] text-[#bba8d6]/55 uppercase tracking-[0.22em]">
              {party.date}
            </p>
            <p className="font-label text-[10px] text-white mt-1">{party.time}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export const Discover: React.FC<DiscoverProps> = ({ parties, onBook }) => {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<FilterTab>('foryou');

  const approved = useMemo(
    () => parties.filter((p) => p.status === 'APPROVED'),
    [parties]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = approved;
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.hostName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [approved, query]);

  const featured = filtered[0];

  const handleCalendar = useCallback((p: Party) => {
    window.open(generateGoogleCalendarLink(p), '_blank');
  }, []);

  return (
    <main
      className="max-w-7xl mx-auto px-5 md:px-8 py-7 pb-32 relative z-10"
      data-testid="discover-screen"
    >
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.4em] text-[#ff5cc4] font-bold mb-2">
              Tonight in the city
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-white tracking-tighter uppercase leading-none">
              The Floor <span className="wordmark">Awaits</span>
            </h1>
          </div>
          <div className="hidden md:flex chip chip-magenta">
            <Flame size={11} /> {approved.length} Live
          </div>
        </div>

        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bba8d6]/45 group-focus-within:text-[#ff5cc4] transition-colors"
            size={18}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#11091c]/70 border border-[#ff5cc4]/15 rounded-xl text-white py-4 pl-12 pr-4 transition-all font-sans placeholder:text-[#bba8d6]/40 backdrop-blur-sm"
            placeholder="Search parties, venues, hosts…"
            type="text"
            data-testid="discover-search"
          />
        </div>
      </section>

      <section className="mb-8 flex gap-7 border-b border-white/5">
        {(
          [
            { id: 'foryou', label: 'For You' },
            { id: 'upcoming', label: 'Upcoming' },
          ] as { id: FilterTab; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-4 font-label text-xs tracking-[0.25em] uppercase font-bold transition-all relative ${
              tab === t.id ? 'text-white' : 'text-[#bba8d6]/45 hover:text-white'
            }`}
            data-testid={`discover-tab-${t.id}`}
          >
            {t.label}
            {tab === t.id && (
              <motion.span
                layoutId="discover-tab-underline"
                className="absolute -bottom-px left-0 right-0 h-[2px] bg-gradient-to-r from-[#ff2bd6] to-[#2bf0ff] rounded-full"
              />
            )}
          </button>
        ))}
      </section>

      {featured && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
          data-testid="discover-featured"
        >
          <div className="relative rounded-2xl overflow-hidden border border-[#ff5cc4]/20 aspect-[16/9] md:aspect-[21/9] group">
            <img
              src={featured.posterURL}
              alt={featured.name}
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0612] via-[#0b0612]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0612]/90 via-transparent to-transparent" />

            <div className="absolute top-6 left-6 flex gap-2">
              <div className="chip chip-live">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b6ff3c] animate-pulse" />
                Tonight · Live
              </div>
              <div className="chip chip-cyan">
                <Sparkles size={10} /> Featured
              </div>
            </div>

            <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10">
              <p className="font-label text-[10px] uppercase tracking-[0.4em] text-[#ff5cc4] font-bold mb-3">
                {featured.hostName}
              </p>
              <h2 className="font-display text-4xl md:text-6xl text-white mb-3 leading-none uppercase tracking-tighter neon-text">
                {featured.name}
              </h2>
              <p className="font-sans text-[#bba8d6]/80 text-sm mb-6 max-w-xl line-clamp-2">
                {featured.description}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-5 text-[#bba8d6]/80 font-label text-[10px] uppercase tracking-widest">
                  <span className="flex items-center gap-2">
                    <Calendar size={13} className="text-[#ff5cc4]" />
                    {featured.date} · {featured.time}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={13} className="text-[#2bf0ff]" />
                    {featured.location}
                  </span>
                </div>
                <button
                  onClick={() => onBook(featured)}
                  className="btn-neon"
                  data-testid="discover-featured-book"
                >
                  Request Entry
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {filtered.length > 1 && (
        <section
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-testid="discover-grid"
        >
          {filtered.slice(1).map((party) => (
            <PartyCard key={party.id} party={party} onCalendar={handleCalendar} />
          ))}
        </section>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-[#bba8d6]/50 font-label uppercase tracking-widest text-sm">
          No matching parties · adjust your search
        </div>
      )}
    </main>
  );
};
