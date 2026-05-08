/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Navigation';
import { AdminQueue } from './components/AdminQueue';
import { UserRegistry } from './components/UserRegistry';
import { QRManagement } from './components/QRManagement';
import { InfluencerDashboard } from './components/InfluencerDashboard';
import { Discover } from './components/Discover';
import { ProfileView } from './components/ProfileView';
import { BottomNav } from './components/BottomNav';
import { Login } from './components/Login';
import { UserRole, UserProfile, Party } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, Calendar as CalendarIcon, X } from 'lucide-react';
import { generateGoogleCalendarLink } from './services/calendar';

// Mock Data
const MOCK_USERS: UserProfile[] = [
  {
    uid: '1',
    email: 'admin@vibecheck.io',
    nickname: 'admin_portal',
    role: 'ADMIN',
    isVerified: true,
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150',
    createdAt: Date.now()
  },
  {
    uid: '2',
    email: 'stellar@vibecheck.io',
    nickname: 'StellarVibe',
    role: 'INFLUENCER',
    isVerified: true,
    photoURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?fit=crop&w=150&h=150',
    createdAt: Date.now()
  },
  {
    uid: '3',
    email: 'user@vibecheck.io',
    nickname: 'julian_voss',
    role: 'USER',
    isVerified: false,
    photoURL: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?fit=crop&w=150&h=150',
    createdAt: Date.now()
  }
];

const MOCK_PARTIES: Party[] = [
  {
    id: 'p1',
    hostId: '2',
    hostName: 'Lumina Entertainment',
    name: 'NEON VOID: SYNESTHESIA',
    description: 'An immersive sensory experience at the intersection of digital art and industrial techno. Featuring a 360-degree LED installation and spatial audio from internationally acclaimed DJs.',
    date: 'OCT 28, 2023',
    time: '22:00',
    location: 'Soundstage London',
    status: 'PENDING',
    posterURL: 'https://images.unsplash.com/photo-1514525253361-bee8718a300c?fit=crop&w=800&q=80',
    capacity: 200,
    ticketsSold: 0,
    price: 45,
    createdAt: Date.now()
  },
  {
    id: 'p2',
    hostId: '2',
    hostName: 'Lumina Entertainment',
    name: 'ELECTRIC FLUX',
    description: 'Intense close-up of a high-tech DJ controller in a dark club, illuminated by vibrant neon pink and violet light.',
    date: 'NOV 05, 2023',
    time: '23:30',
    location: 'District 42',
    status: 'APPROVED',
    posterURL: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?fit=crop&w=800&q=80',
    capacity: 500,
    ticketsSold: 450,
    price: 45,
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://vibecheck.io/p/p2',
    createdAt: Date.now()
  },
  {
    id: 'p3',
    hostId: '2',
    hostName: 'Stellar Events',
    name: 'VELVET SKIES',
    description: 'A sophisticated luxury rooftop bar at dusk, overlooking a sprawling city skyline.',
    date: 'NOV 12, 2023',
    time: '21:00',
    location: 'The Zenith Lounge',
    status: 'APPROVED',
    posterURL: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?fit=crop&w=800&q=80',
    capacity: 100,
    ticketsSold: 88,
    price: 120,
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://vibecheck.io/p/p3',
    createdAt: Date.now()
  },
  {
    id: 'p4',
    hostId: '2',
    hostName: 'Underground Records',
    name: 'CHROME PULSE',
    description: 'Experience the pulse of the underground with techno legends.',
    date: 'NOV 19, 2023',
    time: '02:00',
    location: 'The Vault',
    status: 'PENDING',
    posterURL: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?fit=crop&w=800&q=80',
    capacity: 300,
    ticketsSold: 0,
    price: 35,
    createdAt: Date.now()
  }
];

export default function App() {
  const [allUsers, setAllUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [parties, setParties] = useState<Party[]>(MOCK_PARTIES);
  const [currentView, setCurrentView] = useState('discover');
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState<{id: string, message: string}[]>([]);

  const handleAddToCalendar = (party: Party) => {
    window.open(generateGoogleCalendarLink(party), '_blank');
    setShowNotifications(false);
  };

  const notifyUser = (message: string) => {
    const id = Date.now().toString();
    setActiveNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setActiveNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Handle Login
  const handleLogin = (role: UserRole) => {
    const user = allUsers.find(u => u.role === role) || allUsers[2];
    setCurrentUser(user);
    if (role === 'ADMIN') setCurrentView('queue');
    else if (role === 'INFLUENCER') setCurrentView('influencer');
    else setCurrentView('discover');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('discover');
  };

  // Handle Approval (Calls Express Server for QR)
  const handleApprove = async (partyId: string) => {
    try {
      const party = parties.find(p => p.id === partyId);
      if (!party) return;

      const response = await fetch('/api/admin/approve-party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partyId: party.id,
          partyLink: `https://vibecheck.io/p/${party.id}`
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setParties(current => current.map(p => 
          p.id === partyId 
            ? { ...p, status: 'APPROVED' as const, qrCode: data.qrCode }
            : p
        ));
        notifyUser(`Party "${party.name}" has been approved! QR Code generated.`);
      }
    } catch (err) {
      console.error('Failed to approve party:', err);
    }
  };

  const handleReject = async (partyId: string, reason: string) => {
    setParties(current => current.map(p => 
      p.id === partyId 
        ? { ...p, status: 'REJECTED' as const, rejectionReason: reason }
        : p
    ));
    const party = parties.find(p => p.id === partyId);
    if (party) {
        notifyUser(`Party "${party.name}" was rejected. Reason: ${reason}`);
    }
  };

  const handleRequestVerification = (userId: string) => {
    setAllUsers(prev => prev.map(u => 
        u.uid === userId ? { ...u, isVerificationPending: true } : u
    ));
    if (currentUser?.uid === userId) {
        setCurrentUser(prev => prev ? { ...prev, isVerificationPending: true } : null);
    }
    notifyUser("Verification request submitted protocol.");
  };

  const handleApproveVerification = (userId: string) => {
    setAllUsers(prev => prev.map(u => 
        u.uid === userId ? { ...u, isVerified: true, isVerificationPending: false } : u
    ));
    if (currentUser?.uid === userId) {
        setCurrentUser(prev => prev ? { ...prev, isVerified: true, isVerificationPending: false } : null);
    }
    notifyUser("User verification protocol authorized.");
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'queue':
        return (
          <AdminQueue 
            pendingParties={parties.filter(p => p.status === 'PENDING')} 
            onApprove={handleApprove}
            onReject={handleReject}
          />
        );
      case 'registry':
        return (
          <UserRegistry 
            users={allUsers} 
            onApproveVerification={handleApproveVerification}
          />
        );
      case 'qr':
        return <QRManagement approvedParties={parties.filter(p => p.status === 'APPROVED')} />;
      case 'influencer':
        return (
          <InfluencerDashboard 
            user={currentUser} 
            parties={parties.filter(p => p.hostId === currentUser.uid)}
            onCreateEvent={() => alert('Event creation modal would open here')}
            onLogout={handleLogout}
            onRequestVerification={() => handleRequestVerification(currentUser.uid)}
          />
        );
      case 'discover':
        return <Discover parties={parties} onBook={(p) => alert(`Booking for ${p.name}`)} />;
      case 'profile':
        return <ProfileView user={currentUser} onLogout={handleLogout} />;
      default:
        return <Discover parties={parties} onBook={(p) => alert(`Booking for ${p.name}`)} />;
    }
  };

  return (
    <div className="min-h-screen flex text-slate-100 bg-slate-950">
      {/* Sidebar for Admin/Influencer on Desktop */}
      {(currentUser.role === 'ADMIN' || currentUser.role === 'INFLUENCER') && (
        <Sidebar 
          role={currentUser.role} 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          onLogout={handleLogout}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-h-screen relative overflow-x-hidden ${
        (currentUser.role === 'ADMIN' || currentUser.role === 'INFLUENCER') ? 'ml-72' : ''
      }`}>
        {/* Simple Toast-like notification */}
        <div className="fixed top-24 right-8 z-[100] space-y-2">
            {activeNotifications.map(nav => (
                <motion.div 
                    key={nav.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-indigo-600/90 backdrop-blur-md text-white px-6 py-3 rounded border border-indigo-400/30 shadow-xl font-label text-[10px] uppercase tracking-widest font-bold"
                >
                    {nav.message}
                </motion.div>
            ))}
        </div>
        {/* Mobile-friendly Header for regular users */}
        {currentUser.role === 'USER' && (
          <header className="h-20 flex justify-between items-center px-8 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40">
            <h1 className="font-display text-4xl font-bold text-indigo-500 uppercase tracking-tighter">X-CLUSIV</h1>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Bell 
                  className={`cursor-pointer transition-colors ${showNotifications ? 'text-indigo-400' : 'text-slate-500 hover:text-indigo-400'}`} 
                  size={24} 
                  onClick={() => setShowNotifications(!showNotifications)}
                />
                {parties.some(p => p.status === 'APPROVED') && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                )}
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: 10 }}
                      className="absolute right-0 mt-6 w-80 bg-slate-900 border border-slate-800 rounded p-4 z-50 overflow-hidden shadow-2xl"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <span className="font-label text-[10px] uppercase tracking-widest font-bold text-slate-500">Live Protocols</span>
                        <X size={16} className="cursor-pointer text-slate-500 hover:text-white" onClick={() => setShowNotifications(false)} />
                      </div>
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {parties.filter(p => p.status === 'APPROVED').map(party => (
                          <div key={party.id} className="p-4 bg-slate-950 border border-slate-800/80 rounded space-y-3 group hover:border-indigo-500/30 transition-all">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold font-display text-sm uppercase tracking-tight line-clamp-1 text-slate-200">{party.name}</p>
                                <p className="font-label text-[9px] text-indigo-400/60 uppercase tracking-widest mt-1">{party.date} • {party.time}</p>
                              </div>
                              <button 
                                onClick={() => handleAddToCalendar(party)}
                                className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-sm hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                                title="Add to Calendar"
                              >
                                <CalendarIcon size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {parties.filter(p => p.status === 'APPROVED').length === 0 && (
                          <p className="text-center py-6 text-[10px] text-slate-600 uppercase tracking-widest font-label font-bold">No active protocols.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div 
                className="w-10 h-10 rounded-sm border border-slate-800 overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors"
                onClick={() => setCurrentView('profile')}
              >
                <img src={currentUser.photoURL} alt="Me" className="w-full h-full object-cover" />
              </div>
            </div>
          </header>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Nav for regular users */}
        {currentUser.role === 'USER' && (
          <BottomNav currentTab={currentView} onTabChange={setCurrentView} />
        )}
      </main>
    </div>
  );
}
