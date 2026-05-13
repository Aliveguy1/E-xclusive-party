import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={onCancel}
            data-testid="confirm-dialog-backdrop"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-[201] pointer-events-none"
          >
            <div
              className="glass-card rounded-2xl p-6 w-full max-w-md pointer-events-auto border border-white/10"
              data-testid="confirm-dialog"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isDangerous
                      ? 'bg-[#ff3b5c]/20'
                      : 'bg-[#2bf0ff]/20'
                  }`}
                >
                  <AlertCircle
                    size={20}
                    className={isDangerous ? 'text-[#ff3b5c]' : 'text-[#2bf0ff]'}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white">{title}</h2>
                  <p className="text-sm text-[#bba8d6]/70 mt-2">{message}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={onCancel}
                  disabled={isLoading}
                  className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider font-label transition-colors disabled:opacity-50"
                  data-testid="confirm-dialog-cancel"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider font-label transition-colors disabled:opacity-50 ${
                    isDangerous
                      ? 'bg-[#ff3b5c] hover:bg-[#ff2540] text-white'
                      : 'bg-[#2bf0ff] hover:bg-[#1fd4e8] text-[#0b0612]'
                  }`}
                  data-testid="confirm-dialog-confirm"
                >
                  {isLoading ? 'Processing…' : confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
