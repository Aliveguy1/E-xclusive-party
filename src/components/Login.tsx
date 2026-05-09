import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Sparkles, Zap, ArrowRight, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';
import { Logo } from './Logo';

interface LoginProps {
  onLogin: (username: string, password: string, role: UserRole) => boolean;
  onRegisterClick?: (role: UserRole) => void;
  allUsers?: Array<{ nickname: string; email: string; password: string; role: UserRole }>;
}

type AuthMode = 'mode' | 'login' | 'login-credentials' | 'register-choice';

export const Login: React.FC<LoginProps> = ({ onLogin, onRegisterClick, allUsers = [] }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('mode');
  const [hovered, setHovered] = useState<UserRole | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('USER');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    // Simulate validation delay
    setTimeout(() => {
      if (!username.trim()) {
        setLoginError('Username is required');
        setIsLoading(false);
        return;
      }
      if (!password.trim()) {
        setLoginError('Password is required');
        setIsLoading(false);
        return;
      }

      // Try to authenticate with registered users
      const user = allUsers.find(
        (u) => u.nickname.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (user && user.role === selectedRole) {
        const success = onLogin(username, password, selectedRole);
        if (!success) {
          setLoginError('Authentication failed');
        } else {
          setUsername('');
          setPassword('');
        }
      } else {
        setLoginError('Invalid username or password for this role');
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 md:p-10 relative overflow-hidden"
      data-testid="login-screen"
    >
      {/* Aurora orbs */}
      <div className="pointer-events-none absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full bg-[#ff2bd6]/20 blur-[120px] animate-drift" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 w-[600px] h-[600px] rounded-full bg-[#2bf0ff]/15 blur-[140px] animate-drift" style={{ animationDelay: '2s' }} />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-[#9b5cff]/10 blur-[100px]" />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-8">
            <Logo size="hero" showWordmark={false} />
          </div>
          <h1
            className="wordmark uppercase text-7xl md:text-8xl leading-none tracking-tighter mb-5"
            data-testid="login-app-name"
          >
            RiXzLa
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#ff2bd6]" />
            <span className="font-label text-[10px] uppercase tracking-[0.5em] text-[#ff5cc4] font-bold">
              Nightlife Protocol
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#2bf0ff]" />
          </div>
          <p className="font-sans text-[#bba8d6]/70 text-sm max-w-[300px] mx-auto leading-relaxed">
            Curated raves. Verified hosts. QR-gated guestlists. Step inside the city's most electric room.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="glass-card rounded-2xl p-8 md:p-9 space-y-7 relative overflow-hidden"
        >
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#ff2bd6]/60 to-transparent" />

          {authMode === 'mode' && (
            <>
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-white mb-1">Welcome to RiXzLa</h2>
                <p className="text-[#bba8d6]/60 text-xs">Continue or create your account</p>
              </div>

              <button
                onClick={() => setAuthMode('login')}
                className="w-full h-12 flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#ff2bd6] to-[#ff5cc4] hover:from-[#ff1bc8] hover:to-[#ff4bb8] transition-all font-bold text-white text-xs uppercase tracking-[0.18em] shadow-lg shadow-[#ff2bd6]/30"
                data-testid="auth-login-btn"
              >
                <LogIn size={16} />
                Sign In
              </button>

              <div className="flex items-center gap-4">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#9b5cff]/40 to-transparent" />
                <span className="font-label text-[9px] text-[#bba8d6]/50 uppercase tracking-[0.3em] font-bold whitespace-nowrap">
                  new here?
                </span>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#9b5cff]/40 to-transparent" />
              </div>

              <button
                onClick={() => setAuthMode('register-choice')}
                className="w-full h-12 flex items-center justify-center gap-3 rounded-lg bg-[#11091c]/70 border border-[#ff5cc4]/25 hover:border-[#ff5cc4]/60 hover:bg-[#11091c]/90 transition-all font-bold text-white text-xs uppercase tracking-[0.18em]"
                data-testid="auth-register-btn"
              >
                <UserPlus size={16} />
                Create Account
              </button>
            </>
          )}

          {authMode === 'login' && (
            <>
              <button
                onClick={() => {
                  setAuthMode('mode');
                  setLoginError('');
                  setUsername('');
                  setPassword('');
                }}
                className="text-[#bba8d6]/60 hover:text-white text-xs font-label uppercase tracking-wider transition-colors mb-2"
                data-testid="auth-back-to-mode"
              >
                ← Back
              </button>

              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-white mb-1">Sign In</h2>
                <p className="text-[#bba8d6]/60 text-xs">Choose your account type</p>
              </div>

              <button
                onClick={() => {
                  setSelectedRole('USER');
                  setAuthMode('login-credentials');
                  setLoginError('');
                }}
                onMouseEnter={() => setHovered('USER')}
                onMouseLeave={() => setHovered(null)}
                className="btn-neon w-full h-12 text-xs"
                data-testid="login-as-raver"
              >
                <Sparkles size={16} className={hovered === 'USER' ? 'animate-flicker' : ''} />
                Sign In as Raver
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center gap-4">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#9b5cff]/40 to-transparent" />
                <span className="font-label text-[9px] text-[#bba8d6]/50 uppercase tracking-[0.3em] font-bold whitespace-nowrap">
                  crew access
                </span>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#9b5cff]/40 to-transparent" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    setSelectedRole('INFLUENCER');
                    setAuthMode('login-credentials');
                    setLoginError('');
                  }}
                  onMouseEnter={() => setHovered('INFLUENCER')}
                  onMouseLeave={() => setHovered(null)}
                  className="col-span-2 group relative flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-[#11091c]/70 border border-[#ff5cc4]/25 hover:border-[#ff2bd6]/70 transition-all overflow-hidden"
                  data-testid="login-as-host"
                >
                  <span className="absolute inset-0 bg-gradient-to-br from-[#ff2bd6]/0 via-transparent to-[#9b5cff]/0 group-hover:from-[#ff2bd6]/10 group-hover:to-[#9b5cff]/10 transition-all" />
                  <Zap size={18} className="text-[#ff5cc4] group-hover:text-[#ff2bd6] transition-colors animate-pulse-glow" />
                  <span className="font-label text-[9px] uppercase tracking-[0.2em] font-bold text-[#f0e7ff]">
                    Host
                  </span>
                </button>
                <button
                  onClick={() => {
                    setSelectedRole('ADMIN');
                    setAuthMode('login-credentials');
                    setLoginError('');
                  }}
                  onMouseEnter={() => setHovered('ADMIN')}
                  onMouseLeave={() => setHovered(null)}
                  className="group relative flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-[#11091c]/70 border border-[#2bf0ff]/20 hover:border-[#2bf0ff]/60 transition-all"
                  data-testid="login-as-admin"
                >
                  <ShieldAlert size={18} className="text-[#2bf0ff]" />
                  <span className="font-label text-[9px] uppercase tracking-[0.2em] font-bold text-[#bff7ff]">
                    Root
                  </span>
                </button>
              </div>
            </>
          )}

          {authMode === 'login-credentials' && (
            <>
              <button
                onClick={() => {
                  setAuthMode('login');
                  setLoginError('');
                  setUsername('');
                  setPassword('');
                }}
                className="text-[#bba8d6]/60 hover:text-white text-xs font-label uppercase tracking-wider transition-colors mb-2"
                data-testid="auth-back-credentials"
              >
                ← Back
              </button>

              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-white mb-1">Sign In</h2>
                <p className="text-[#bba8d6]/60 text-xs">Enter your credentials</p>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[#ff3b5c]/10 border border-[#ff3b5c]/30 text-[#ff3b5c] text-xs mb-4">
                  <AlertCircle size={14} />
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#1a1425]/60 border border-[#ff5cc4]/25 focus:border-[#ff5cc4] focus:outline-none focus:ring-2 focus:ring-[#ff5cc4]/20 text-white placeholder-[#bba8d6]/40 text-sm transition-all"
                    disabled={isLoading}
                    data-testid="login-username-input"
                    autoFocus
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#1a1425]/60 border border-[#ff5cc4]/25 focus:border-[#ff5cc4] focus:outline-none focus:ring-2 focus:ring-[#ff5cc4]/20 text-white placeholder-[#bba8d6]/40 text-sm transition-all"
                    disabled={isLoading}
                    data-testid="login-password-input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-neon w-full h-12 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="login-submit"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            </>
          )}

          {authMode === 'register-choice' && (
            <>
              <button
                onClick={() => setAuthMode('mode')}
                className="text-[#bba8d6]/60 hover:text-white text-xs font-label uppercase tracking-wider transition-colors mb-2"
                data-testid="auth-back-to-mode"
              >
                ← Back
              </button>

              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-white mb-1">Create Account</h2>
                <p className="text-[#bba8d6]/60 text-xs">Choose account type to register</p>
              </div>

              <button
                onClick={() => onRegisterClick?.('USER')}
                className="btn-neon w-full h-12 text-xs"
                data-testid="register-as-raver"
              >
                <UserPlus size={16} />
                Register as Raver
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center gap-4">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#9b5cff]/40 to-transparent" />
                <span className="font-label text-[9px] text-[#bba8d6]/50 uppercase tracking-[0.3em] font-bold whitespace-nowrap">
                  join crew
                </span>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#9b5cff]/40 to-transparent" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => onRegisterClick?.('INFLUENCER')}
                  className="col-span-2 group relative flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-[#11091c]/70 border border-[#ff5cc4]/25 hover:border-[#ff2bd6]/70 transition-all overflow-hidden"
                  data-testid="register-as-host"
                >
                  <span className="absolute inset-0 bg-gradient-to-br from-[#ff2bd6]/0 via-transparent to-[#9b5cff]/0 group-hover:from-[#ff2bd6]/10 group-hover:to-[#9b5cff]/10 transition-all" />
                  <Zap size={18} className="text-[#ff5cc4] group-hover:text-[#ff2bd6] transition-colors animate-pulse-glow" />
                  <span className="font-label text-[9px] uppercase tracking-[0.2em] font-bold text-[#f0e7ff]">
                    Host
                  </span>
                </button>
                <button
                  onClick={() => onRegisterClick?.('ADMIN')}
                  className="group relative flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-[#11091c]/70 border border-[#2bf0ff]/20 hover:border-[#2bf0ff]/60 transition-all"
                  data-testid="register-as-admin"
                >
                  <ShieldAlert size={18} className="text-[#2bf0ff]" />
                  <span className="font-label text-[9px] uppercase tracking-[0.2em] font-bold text-[#bff7ff]">
                    Root
                  </span>
                </button>
              </div>

              <p className="text-[9px] text-[#bba8d6]/55 font-label uppercase tracking-widest text-center">
                Host nodes require <span className="text-[#ff5cc4]">Level 01</span> verification
              </p>
            </>
          )}

          {authMode === 'mode' && (
            <p className="text-[9px] text-[#bba8d6]/55 font-label uppercase tracking-widest text-center">
              By initializing, you accept the<br />
              <span className="text-[#ff5cc4] cursor-pointer hover:text-white transition-colors">
                RiXzLa House Rules
              </span>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};
