import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Bell, Lock, Eye, EyeOff, Mail, Trash2, AlertCircle } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface SettingsProps {
  user: UserProfile;
  onBack: () => void;
  onLogout: () => void;
  onUpdateSettings?: (settings: { notifications: boolean; twoFactor: boolean; emailVerified: boolean }) => void;
  onDeleteAccount?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onBack, onLogout, onUpdateSettings, onDeleteAccount }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    twoFactor: false,
    emailVerified: user.isVerified,
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleSettingsChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    onUpdateSettings?.({
      ...settings,
      [key]: value,
    });
    setSuccessMessage(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePasswordChange = () => {
    const newErrors: Record<string, string> = {};

    if (!passwords.current.trim()) {
      newErrors.current = 'Current password required';
    }
    if (!passwords.new.trim()) {
      newErrors.new = 'New password required';
    } else if (passwords.new.length < 6) {
      newErrors.new = 'Password must be at least 6 characters';
    }
    if (passwords.new !== passwords.confirm) {
      newErrors.confirm = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSuccessMessage('Password updated successfully');
    setPasswords({ current: '', new: '', confirm: '' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteAccount = () => {
    onDeleteAccount?.();
    onLogout();
  };

  const getRoleLabel = () => {
    if (user.role === 'USER') return 'Raver';
    if (user.role === 'INFLUENCER') return 'Host';
    return 'Administrator';
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto px-5 py-10 pb-32 relative z-10"
      data-testid="settings-page"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={20} className="text-[#ff5cc4]" />
        </button>
        <div>
          <h1 className="font-display text-3xl text-white uppercase tracking-tighter">
            Settings
          </h1>
          <p className="text-[#bba8d6]/65 text-sm font-label uppercase tracking-wider mt-1">
            Account preferences & security
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Account Info Section */}
        <section className="space-y-4">
          <h2 className="font-label text-[10px] text-[#ff5cc4] uppercase tracking-[0.3em] font-bold">
            Account Information
          </h2>
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#bba8d6]/55 text-[10px] font-label uppercase tracking-wider mb-1">
                  Username
                </p>
                <p className="text-white font-bold text-lg">@{user.nickname}</p>
              </div>
              <div className="text-right">
                <p className="text-[#bba8d6]/55 text-[10px] font-label uppercase tracking-wider mb-1">
                  Account Type
                </p>
                <p className="text-[#ff5cc4] font-bold capitalize">{getRoleLabel()}</p>
              </div>
            </div>
            <div className="border-t border-white/5 pt-4">
              <p className="text-[#bba8d6]/55 text-[10px] font-label uppercase tracking-wider mb-2">
                Email Address
              </p>
              <p className="text-white">{user.email}</p>
            </div>
            <div className="border-t border-white/5 pt-4 flex items-center justify-between">
              <div>
                <p className="text-[#bba8d6]/55 text-[10px] font-label uppercase tracking-wider mb-1">
                  Email Verification
                </p>
                <p className="text-sm">
                  {user.isVerified ? (
                    <span className="text-[#b6ff3c] font-bold">✓ Verified</span>
                  ) : (
                    <span className="text-[#ff5cc4]">⊙ Pending</span>
                  )}
                </p>
              </div>
              {!user.isVerified && (
                <button className="px-4 py-2 rounded-lg bg-[#ff5cc4]/10 text-[#ff5cc4] text-xs font-bold uppercase hover:bg-[#ff5cc4]/20 transition-colors">
                  Verify Email
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="space-y-4">
          <h2 className="font-label text-[10px] text-[#ff5cc4] uppercase tracking-[0.3em] font-bold">
            Preferences
          </h2>
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-[#9b5cff]" />
                <div>
                  <p className="text-white font-bold text-sm">Email Notifications</p>
                  <p className="text-[#bba8d6]/55 text-xs">Receive event updates & recommendations</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingsChange('notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#bba8d6]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff5cc4]" />
              </label>
            </div>

            <div className="border-t border-white/5 pt-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-[#2bf0ff]" />
                <div>
                  <p className="text-white font-bold text-sm">Two-Factor Authentication</p>
                  <p className="text-[#bba8d6]/55 text-xs">Add extra security to your account</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactor}
                  onChange={(e) => handleSettingsChange('twoFactor', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#bba8d6]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2bf0ff]" />
              </label>
            </div>
          </div>
        </section>

        {/* Password Section */}
        <section className="space-y-4">
          <h2 className="font-label text-[10px] text-[#ff5cc4] uppercase tracking-[0.3em] font-bold">
            Security
          </h2>
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-[10px] text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                Current Password
              </label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
                className={`w-full bg-[#11091c]/70 border ${
                  errors.current ? 'border-[#ff3b5c]' : 'border-[#ff5cc4]/15'
                } rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors`}
                placeholder="Enter your current password"
              />
              {errors.current && <p className="text-[#ff3b5c] text-xs mt-1">{errors.current}</p>}
            </div>

            <div>
              <label className="block text-[10px] text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))}
                  className={`w-full bg-[#11091c]/70 border ${
                    errors.new ? 'border-[#ff3b5c]' : 'border-[#ff5cc4]/15'
                  } rounded-xl text-white px-4 py-3 pr-12 focus:outline-none focus:border-[#ff2bd6] transition-colors`}
                  placeholder="Enter new password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bba8d6]/55 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.new && <p className="text-[#ff3b5c] text-xs mt-1">{errors.new}</p>}
            </div>

            <div>
              <label className="block text-[10px] text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                Confirm Password
              </label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
                className={`w-full bg-[#11091c]/70 border ${
                  errors.confirm ? 'border-[#ff3b5c]' : 'border-[#ff5cc4]/15'
                } rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors`}
                placeholder="Confirm your new password"
              />
              {errors.confirm && <p className="text-[#ff3b5c] text-xs mt-1">{errors.confirm}</p>}
            </div>

            <button
              onClick={handlePasswordChange}
              className="w-full py-3 rounded-lg bg-[#9b5cff]/10 text-[#9b5cff] border border-[#9b5cff]/30 font-bold uppercase tracking-wider text-xs hover:bg-[#9b5cff]/20 transition-colors font-label"
            >
              Update Password
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4">
          <h2 className="font-label text-[10px] text-[#ff3b5c] uppercase tracking-[0.3em] font-bold">
            Danger Zone
          </h2>
          <div className="glass-card rounded-2xl p-6 border border-[#ff3b5c]/20 space-y-4">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-[#ff3b5c]/10 hover:bg-[#ff3b5c]/15 transition-colors group"
              data-testid="settings-delete-account"
            >
              <div className="flex items-center gap-3">
                <Trash2 size={18} className="text-[#ff3b5c]" />
                <div className="text-left">
                  <p className="text-white font-bold text-sm">Delete Account</p>
                  <p className="text-[#ff3b5c]/70 text-xs">Permanently remove your account and all data</p>
                </div>
              </div>
            </button>

            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-lg bg-[#ff3b5c]/15 border border-[#ff3b5c]/30 flex items-start gap-4"
              >
                <AlertCircle size={20} className="text-[#ff3b5c] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-white font-bold mb-3">Are you sure you want to delete your account?</p>
                  <p className="text-[#ff3b5c]/80 text-sm mb-4">This action cannot be undone. All your data will be permanently deleted.</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-xs font-bold uppercase font-label"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 rounded-lg bg-[#ff3b5c] text-white hover:bg-[#ff2540] transition-colors text-xs font-bold uppercase font-label"
                    >
                      Delete Permanently
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed bottom-10 right-6 px-6 py-3 rounded-full bg-[#b6ff3c] text-[#0b0612] text-xs font-bold uppercase tracking-wider font-label"
          >
            ✓ {successMessage}
          </motion.div>
        )}
      </div>
    </motion.main>
  );
};
