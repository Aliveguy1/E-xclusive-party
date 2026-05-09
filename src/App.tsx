/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, Calendar as CalendarIcon, X } from 'lucide-react';

import { Sidebar } from './components/Navigation';
import { AdminQueue } from './components/AdminQueue';
import { UserRegistry } from './components/UserRegistry';
import { QRManagement } from './components/QRManagement';
import { InfluencerDashboard } from './components/InfluencerDashboard';
import { Discover } from './components/Discover';
import { ProfileView } from './components/ProfileView';
import { BottomNav } from './components/BottomNav';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Logo } from './components/Logo';
import { UserRole, UserProfile, Party } from './types';
import { generateGoogleCalendarLink } from './services/calendar';

// ---------------- Mock Data ----------------
const MOCK_USERS: UserProfile[] = [
  {
    uid: '1',
    email: 'admin@rixzla.io',
    nickname: 'admin_portal',
    role: 'ADMIN',
    isVerified: true,
    photoURL:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150',
    createdAt: Date.now(),
  },
  {
    uid: '2',
    email: 'stellar@rixzla.io',
    nickname: 'StellarVibe',
    role: 'INFLUENCER',
    isVerified: true,
    photoURL:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?fit=crop&w=150&h=150',
    createdAt: Date.now(),
  },
  {
    uid: '3',
    email: 'user@rixzla.io',
    nickname: 'julian_voss',
    role: 'USER',
    isVerified: false,
    photoURL:
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?fit=crop&w=150&h=150',
    createdAt: Date.now(),
  },
];

const MOCK_PARTIES: Party[] = [
  {
    id: 'p1',
    hostId: '2',
    hostName: 'Lumina Entertainment',
    name: 'NEON VOID: SYNESTHESIA',
    description:
      'An immersive sensory experience at the intersection of digital art and industrial techno. 360° LED installation, spatial audio, internationally acclaimed DJs.',
    date: 'OCT 28, 2026',
    time: '22:00',
    location: 'Soundstage London',
    status: 'PENDING',
    posterURL:
      'https://images.unsplash.com/photo-1514525253361-bee8718a300c?fit=crop&w=800&q=80',
    capacity: 200,
    ticketsSold: 0,
    price: 45,
    createdAt: Date.now(),
  },
  {
    id: 'p2',
    hostId: '2',
    hostName: 'Lumina Entertainment',
    name: 'ELECTRIC FLUX',
    description:
      'Intense close-up sensorial techno: high-tech DJ controllers in a dark club, illuminated by vibrant neon pink and violet light.',
    date: 'NOV 05, 2026',
    time: '23:30',
    location: 'District 42',
    status: 'APPROVED',
    posterURL:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?fit=crop&w=800&q=80',
    capacity: 500,
    ticketsSold: 450,
    price: 45,
    qrCode:
      'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://rixzla.io/p/p2',
    createdAt: Date.now(),
  },
  {
    id: 'p3',
    hostId: '2',
    hostName: 'Stellar Events',
    name: 'VELVET SKIES',
    description:
      'A sophisticated luxury rooftop bar at dusk, overlooking a sprawling city skyline. House. Disco. View.',
    date: 'NOV 12, 2026',
    time: '21:00',
    location: 'The Zenith Lounge',
    status: 'APPROVED',
    posterURL:
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?fit=crop&w=800&q=80',
    capacity: 100,
    ticketsSold: 88,
    price: 120,
    qrCode:
      'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://rixzla.io/p/p3',
    createdAt: Date.now(),
  },
  {
    id: 'p4',
    hostId: '2',
    hostName: 'Underground Records',
    name: 'CHROME PULSE',
    description:
      'Experience the pulse of the underground with techno legends. Strict door. Dark room. Heavy bass.',
    date: 'NOV 19, 2026',
    time: '02:00',
    location: 'The Vault',
    status: 'PENDING',
    posterURL:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?fit=crop&w=800&q=80',
    capacity: 300,
    ticketsSold: 0,
    price: 35,
    createdAt: Date.now(),
  },
];

export default function App() {
  const [allUsers, setAllUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [parties, setParties] = useState<Party[]>(MOCK_PARTIES);
  const [currentView, setCurrentView] = useState('discover');
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState<
    { id: string; message: string }[]
  >([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registeringRole, setRegisteringRole] = useState<UserRole | null>(null);

  const approvedParties = useMemo(
    () => parties.filter((p) => p.status === 'APPROVED'),
    [parties]
  );

  const handleAddToCalendar = useCallback((party: Party) => {
    window.open(generateGoogleCalendarLink(party), '_blank');
    setShowNotifications(false);
  }, []);

  const notifyUser = useCallback((message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setActiveNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setActiveNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  }, []);

  const handleLogin = useCallback(
    (username: string, password: string, role: UserRole) => {
      // First check if user exists with credentials
      const registeredUser = allUsers.find(
        (u) =>
          u.nickname.toLowerCase() === username.toLowerCase() &&
          (u as any).password === password &&
          u.role === role
      );

      if (registeredUser) {
        setCurrentUser(registeredUser);
        if (role === 'ADMIN') setCurrentView('queue');
        else if (role === 'INFLUENCER') setCurrentView('influencer');
        else setCurrentView('discover');
        return true;
      }

      // Fallback to mock users for demo
      const mockUser = MOCK_USERS.find((u) => u.role === role);
      if (mockUser && (username === 'demo' || username.toLowerCase() === 'admin_portal')) {
        setCurrentUser(mockUser);
        if (role === 'ADMIN') setCurrentView('queue');
        else if (role === 'INFLUENCER') setCurrentView('influencer');
        else setCurrentView('discover');
        return true;
      }

      return false;
    },
    [allUsers]
  );

  const handleRegister = useCallback(
    (userData: {
      nickname: string;
      email: string;
      password: string;
      phoneNumber: string;
      role: UserRole;
    }) => {
      const newUser: any = {
        uid: `user_${Date.now()}`,
        email: userData.email,
        nickname: userData.nickname,
        role: userData.role,
        password: userData.password,
        whatsapp: userData.phoneNumber,
        isVerified: userData.role === 'USER',
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.nickname}`,
        createdAt: Date.now(),
      };

      setAllUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      notifyUser(`Welcome ${userData.nickname}! Account created successfully`);

      if (userData.role === 'ADMIN') setCurrentView('queue');
      else if (userData.role === 'INFLUENCER') setCurrentView('influencer');
      else setCurrentView('discover');

      setIsRegistering(false);
      setRegisteringRole(null);
    },
    [notifyUser]
  );

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setCurrentView('discover');
  }, []);

  const handleApprove = useCallback(
    async (partyId: string) => {
      try {
        const party = parties.find((p) => p.id === partyId);
        if (!party) return;

        const response = await fetch('/api/admin/approve-party', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            partyId: party.id,
            partyLink: `https://rixzla.io/p/${party.id}`,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setParties((current) =>
            current.map((p) =>
              p.id === partyId
                ? { ...p, status: 'APPROVED' as const, qrCode: data.qrCode }
                : p
            )
          );
          notifyUser(`"${party.name}" approved · QR generated`);
        }
      } catch (err) {
        console.error('Failed to approve party:', err);
        notifyUser('Approval failed · check connection');
      }
    },
    [parties, notifyUser]
  );

  const handleReject = useCallback(
    async (partyId: string, reason: string) => {
      const party = parties.find((p) => p.id === partyId);
      setParties((current) =>
        current.map((p) =>
          p.id === partyId
            ? { ...p, status: 'REJECTED' as const, rejectionReason: reason }
            : p
        )
      );
      if (party) notifyUser(`"${party.name}" rejected · ${reason}`);
    },
    [parties, notifyUser]
  );

  const handleRequestVerification = useCallback(
    (userId: string) => {
      setAllUsers((prev) =>
        prev.map((u) =>
          u.uid === userId ? { ...u, isVerificationPending: true } : u
        )
      );
      setCurrentUser((prev) =>
        prev && prev.uid === userId ? { ...prev, isVerificationPending: true } : prev
      );
      notifyUser('Verification request submitted');
    },
    [notifyUser]
  );

  const handleApproveVerification = useCallback(
    (userId: string) => {
      setAllUsers((prev) =>
        prev.map((u) =>
          u.uid === userId
            ? { ...u, isVerified: true, isVerificationPending: false }
            : u
        )
      );
      setCurrentUser((prev) =>
        prev && prev.uid === userId
          ? { ...prev, isVerified: true, isVerificationPending: false }
          : prev
      );
      notifyUser('Identity authorized · welcome aboard');
    },
    [notifyUser]
  );

  if (!currentUser) {
    if (isRegistering && registeringRole) {
      return (
        <Register
          role={registeringRole}
          onRegister={handleRegister}
          onBackToLogin={() => {
            setIsRegistering(false);
            setRegisteringRole(null);
          }}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onRegisterClick={(role) => {
          setIsRegistering(true);
          setRegisteringRole(role);
        }}
        allUsers={allUsers as any}
      />
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'queue':
        return (
          <AdminQueue
            pendingParties={parties.filter((p) => p.status === 'PENDING')}
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
        return <QRManagement approvedParties={approvedParties} />;
      case 'influencer':
        return (
          <InfluencerDashboard
            user={currentUser}
            parties={parties.filter((p) => p.hostId === currentUser.uid)}
            onCreateEvent={() => notifyUser('Event creation modal coming soon')}
            onLogout={handleLogout}
            onRequestVerification={() => handleRequestVerification(currentUser.uid)}
          />
        );
      case 'discover':
        return (
          <Discover
            parties={parties}
            onBook={(p) => notifyUser(`Requesting entry to ${p.name}…`)}
          />
        );
      case 'profile':
        return <ProfileView user={currentUser} onLogout={handleLogout} />;
      default:
        return (
          <Discover
            parties={parties}
            onBook={(p) => notifyUser(`Requesting entry to ${p.name}…`)}
          />
        );
    }
  };

  const isConsoleRole =
    currentUser.role === 'ADMIN' || currentUser.role === 'INFLUENCER';

  return (
    <div
      className="min-h-screen flex text-white relative"
      data-testid="app-root"
    >
      {isConsoleRole && (
        <Sidebar
          role={currentUser.role}
          currentView={currentView}
          onViewChange={setCurrentView}
          onLogout={handleLogout}
        />
      )}

      <main
        className={`flex-1 flex flex-col min-h-screen relative overflow-x-hidden ${
          isConsoleRole ? 'lg:ml-72' : ''
        }`}
      >
        {/* Toast notifications */}
        <div className="fixed top-24 right-6 z-[100] space-y-2 pointer-events-none">
          <AnimatePresence>
            {activeNotifications.map((nav) => (
              <motion.div
                key={nav.id}
                layout
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                className="glass-card pointer-events-auto px-5 py-3 rounded-full text-white font-label text-[10px] uppercase tracking-[0.22em] font-bold shadow-[0_20px_50px_-12px_rgba(255,43,214,0.6)] border-neon-magenta"
                data-testid="toast-notification"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff2bd6] mr-2 align-middle animate-pulse" />
                {nav.message}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Mobile/User header */}
        {currentUser.role === 'USER' && (
          <header
            className="h-[72px] flex justify-between items-center px-5 md:px-8 bg-[#080410]/70 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40"
            data-testid="user-header"
          >
            <Logo size="sm" />

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications((s) => !s)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                    showNotifications
                      ? 'border-[#ff2bd6]/60 text-[#ff5cc4] bg-[#ff2bd6]/10'
                      : 'border-white/5 text-[#bba8d6]/65 hover:text-white hover:border-[#ff5cc4]/40'
                  }`}
                  aria-label="Notifications"
                  data-testid="user-bell"
                >
                  <Bell size={17} />
                </button>
                {approvedParties.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#b6ff3c] rounded-full shadow-[0_0_8px_rgba(182,255,60,0.8)]" />
                )}

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 8 }}
                      className="absolute right-0 mt-3 w-[320px] glass-card rounded-2xl p-5 z-50 overflow-hidden"
                      data-testid="user-notifications"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-label text-[10px] uppercase tracking-[0.3em] font-bold text-[#bba8d6]/55">
                          Live Now
                        </span>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-[#bba8d6]/55 hover:text-white"
                          aria-label="Close"
                        >
                          <X size={15} />
                        </button>
                      </div>
                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                        {approvedParties.map((party) => (
                          <div
                            key={party.id}
                            className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center group hover:border-[#ff5cc4]/30 transition-all"
                          >
                            <div className="min-w-0">
                              <p className="font-bold font-display text-sm uppercase tracking-tight text-white truncate">
                                {party.name}
                              </p>
                              <p className="font-label text-[9px] text-[#ff5cc4] uppercase tracking-[0.22em] mt-1">
                                {party.date} · {party.time}
                              </p>
                            </div>
                            <button
                              onClick={() => handleAddToCalendar(party)}
                              className="ml-3 p-2.5 bg-[#ff2bd6]/10 text-[#ff5cc4] rounded-full hover:bg-[#ff2bd6] hover:text-white transition-all"
                              title="Add to Calendar"
                              data-testid={`notify-calendar-${party.id}`}
                            >
                              <CalendarIcon size={13} />
                            </button>
                          </div>
                        ))}
                        {approvedParties.length === 0 && (
                          <p className="text-center py-6 text-[10px] text-[#bba8d6]/45 uppercase tracking-widest font-label font-bold">
                            No active events
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setCurrentView('profile')}
                className="w-10 h-10 rounded-full overflow-hidden border border-[#ff5cc4]/30 hover:border-[#ff2bd6] transition-colors shadow-[0_0_18px_-4px_rgba(255,43,214,0.6)]"
                aria-label="Profile"
                data-testid="user-avatar"
              >
                <img
                  src={currentUser.photoURL}
                  alt="Me"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </header>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {currentUser.role === 'USER' && (
          <BottomNav currentTab={currentView} onTabChange={setCurrentView} />
        )}
      </main>
    </div>
  );
}
