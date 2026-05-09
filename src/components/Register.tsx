import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Lock, Phone, User, AlertCircle } from 'lucide-react';
import { Logo } from './Logo';
import { UserRole } from '../types';

interface RegisterProps {
  onRegister: (userData: {
    nickname: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: UserRole;
  }) => void;
  onBackToLogin: () => void;
  role: UserRole;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onBackToLogin, role }) => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!nickname.trim()) {
      newErrors.nickname = 'Username is required';
    } else if (nickname.length < 3) {
      newErrors.nickname = 'Username must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Gmail is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    // Simulate registration delay
    setTimeout(() => {
      onRegister({
        nickname,
        email,
        password,
        phoneNumber,
        role,
      });
      setIsLoading(false);
    }, 600);
  };

  const getRoleDisplay = () => {
    if (role === 'USER') return 'Raver';
    if (role === 'INFLUENCER') return 'Host & Influencer';
    return 'Admin';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-10 relative overflow-hidden">
      {/* Aurora orbs */}
      <div className="pointer-events-none absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full bg-[#ff2bd6]/20 blur-[120px] animate-drift" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 w-[600px] h-[600px] rounded-full bg-[#2bf0ff]/15 blur-[140px] animate-drift" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={onBackToLogin}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#bba8d6] hover:text-white"
              data-testid="register-back-btn"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="wordmark text-4xl leading-tight tracking-tighter">Create Account</h1>
              <p className="text-[#bba8d6]/60 text-xs mt-1 uppercase tracking-widest font-label">
                Join as {getRoleDisplay()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="glass-card rounded-2xl p-8 md:p-9 relative overflow-hidden"
        >
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#ff2bd6]/60 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-5" data-testid="register-form">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white mb-2 font-label">
                <div className="flex items-center gap-2 mb-2">
                  <User size={14} className="text-[#ff5cc4]" />
                  Username (Nickname)
                </div>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g., neon_raver"
                className={`w-full px-4 py-3 rounded-lg bg-[#1a1425]/60 border transition-all text-sm ${
                  errors.nickname
                    ? 'border-[#ff3b5c]/60 focus:border-[#ff3b5c]'
                    : 'border-[#ff5cc4]/25 focus:border-[#ff5cc4]'
                } focus:outline-none focus:ring-2 focus:ring-[#ff5cc4]/20 text-white placeholder-[#bba8d6]/40`}
                data-testid="register-username"
                disabled={isLoading}
              />
              {errors.nickname && (
                <div className="flex items-center gap-2 mt-1 text-[#ff3b5c] text-xs">
                  <AlertCircle size={12} />
                  {errors.nickname}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white mb-2 font-label">
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={14} className="text-[#ff5cc4]" />
                  Email (Gmail)
                </div>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className={`w-full px-4 py-3 rounded-lg bg-[#1a1425]/60 border transition-all text-sm ${
                  errors.email
                    ? 'border-[#ff3b5c]/60 focus:border-[#ff3b5c]'
                    : 'border-[#ff5cc4]/25 focus:border-[#ff5cc4]'
                } focus:outline-none focus:ring-2 focus:ring-[#ff5cc4]/20 text-white placeholder-[#bba8d6]/40`}
                data-testid="register-email"
                disabled={isLoading}
              />
              {errors.email && (
                <div className="flex items-center gap-2 mt-1 text-[#ff3b5c] text-xs">
                  <AlertCircle size={12} />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white mb-2 font-label">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={14} className="text-[#ff5cc4]" />
                  Password (Min. 6 characters)
                </div>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-lg bg-[#1a1425]/60 border transition-all text-sm ${
                  errors.password
                    ? 'border-[#ff3b5c]/60 focus:border-[#ff3b5c]'
                    : 'border-[#ff5cc4]/25 focus:border-[#ff5cc4]'
                } focus:outline-none focus:ring-2 focus:ring-[#ff5cc4]/20 text-white placeholder-[#bba8d6]/40`}
                data-testid="register-password"
                disabled={isLoading}
              />
              {errors.password && (
                <div className="flex items-center gap-2 mt-1 text-[#ff3b5c] text-xs">
                  <AlertCircle size={12} />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.18em] text-white mb-2 font-label">
                <div className="flex items-center gap-2 mb-2">
                  <Phone size={14} className="text-[#ff5cc4]" />
                  WhatsApp Number
                </div>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                className={`w-full px-4 py-3 rounded-lg bg-[#1a1425]/60 border transition-all text-sm ${
                  errors.phoneNumber
                    ? 'border-[#ff3b5c]/60 focus:border-[#ff3b5c]'
                    : 'border-[#ff5cc4]/25 focus:border-[#ff5cc4]'
                } focus:outline-none focus:ring-2 focus:ring-[#ff5cc4]/20 text-white placeholder-[#bba8d6]/40`}
                data-testid="register-phone"
                disabled={isLoading}
              />
              {errors.phoneNumber && (
                <div className="flex items-center gap-2 mt-1 text-[#ff3b5c] text-xs">
                  <AlertCircle size={12} />
                  {errors.phoneNumber}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-neon w-full h-12 text-xs mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="register-submit"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-[9px] text-[#bba8d6]/55 font-label uppercase tracking-widest text-center">
              By signing up, you accept the<br />
              <span className="text-[#ff5cc4] cursor-pointer hover:text-white transition-colors">
                RiXzLa House Rules
              </span>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
