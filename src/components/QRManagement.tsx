import React, { useState, useMemo } from 'react';
import { Search, PlusCircle, Download, Share2, MoreVertical, QrCode } from 'lucide-react';
import { Party } from '../types';

interface QRManagementProps {
  approvedParties: Party[];
}

export const QRManagement: React.FC<QRManagementProps> = ({ approvedParties }) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return approvedParties;
    return approvedParties.filter(
      (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    );
  }, [approvedParties, query]);

  return (
    <div
      className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 relative z-10"
      data-testid="qr-management"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="flex gap-12">
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#bba8d6]/55 mb-2 font-bold">
              Total Codes
            </p>
            <p className="font-display text-5xl leading-none text-white font-bold">
              {approvedParties.length}
            </p>
          </div>
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#b6ff3c] mb-2 font-bold">
              Active
            </p>
            <p className="font-display text-5xl leading-none text-[#b6ff3c] font-bold">
              {approvedParties.length}
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bba8d6]/45"
              size={15}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full md:w-64 bg-[#11091c]/70 border border-[#ff5cc4]/15 rounded-xl text-sm text-white pl-11 pr-4 py-3 placeholder:text-[#bba8d6]/40"
              placeholder="Search event or ID…"
              type="text"
              data-testid="qr-search"
            />
          </div>
          <button className="btn-neon" data-testid="qr-generate-new">
            <PlusCircle size={14} />
            Generate
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((party) => (
          <div
            key={party.id}
            className="glass-card rounded-2xl p-6 group flex flex-col transition-all duration-500 hover:-translate-y-1"
            data-testid={`qr-card-${party.id}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#ff5cc4]/20 shrink-0">
                  <img
                    src={party.posterURL}
                    alt={party.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight uppercase font-display">
                    {party.name}
                  </h3>
                  <p className="text-[#bba8d6]/65 text-[10px] mt-1 uppercase font-label tracking-wider">
                    {party.location} · {party.time}
                  </p>
                  <div className="mt-2 chip chip-live">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b6ff3c] animate-pulse" />
                    Active
                  </div>
                </div>
              </div>
              <button
                className="p-2 text-[#bba8d6]/55 hover:text-[#ff5cc4] transition-colors"
                aria-label="Options"
              >
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="bg-white aspect-square rounded-2xl relative flex items-center justify-center p-6 mb-6 neon-ring-cyan">
              {party.qrCode ? (
                <img
                  src={party.qrCode}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-[#0b0612]/60 text-xs font-label uppercase tracking-widest flex items-center gap-2">
                  <QrCode size={18} /> Generating…
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-xl bg-[#0b0612] border border-[#ff2bd6]/40 flex items-center justify-center shadow-2xl">
                  <span className="wordmark text-base leading-none">R</span>
                </div>
              </div>
            </div>

            <div className="mt-auto flex gap-3">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: party.name,
                        text: `${party.name} at ${party.location} — RiXzLa entry pass.`,
                        url: party.qrCode || window.location.href,
                      })
                      .catch(console.error);
                  } else {
                    navigator.clipboard.writeText(
                      `Party: ${party.name}\nVenue: ${party.location}\nTime: ${party.time}\nQR: ${
                        party.qrCode || 'Pending'
                      }`
                    );
                  }
                }}
                className="flex-1 btn-ghost"
                data-testid={`qr-share-${party.id}`}
              >
                <Share2 size={14} />
                Broadcast
              </button>
              <button
                onClick={() => {
                  if (!party.qrCode) return;
                  const link = document.createElement('a');
                  link.href = party.qrCode;
                  link.download = `${party.name.replace(/\s+/g, '_')}_RiXzLa.png`;
                  link.click();
                }}
                className="w-12 h-12 rounded-full bg-[#11091c]/70 border border-[#ff5cc4]/15 text-[#bba8d6]/70 flex items-center justify-center hover:text-white hover:border-[#ff2bd6]/50 transition-all"
                aria-label="Download"
                data-testid={`qr-download-${party.id}`}
              >
                <Download size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
