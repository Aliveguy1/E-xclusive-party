import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, UserCheck } from 'lucide-react';

interface FollowButtonProps {
  userId: string;
  userName: string;
  isFollowing?: boolean;
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
  className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  userName,
  isFollowing = false,
  onFollow,
  onUnfollow,
  className = '',
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);

    if (isFollowing) {
      onUnfollow?.(userId);
    } else {
      onFollow?.(userId);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
        isFollowing
          ? 'bg-[#11091c]/70 border border-[#ff5cc4]/30 text-white hover:border-[#ff3b5c] hover:bg-[#ff3b5c]/10'
          : 'bg-gradient-to-r from-[#ff2bd6] to-[#ff5cc4] text-white hover:from-[#ff1bc8] hover:to-[#ff4bb8] shadow-lg shadow-[#ff2bd6]/30'
      } ${className}`}
      title={isFollowing ? `Unfollow ${userName}` : `Follow ${userName}`}
    >
      <motion.div
        animate={isAnimating ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.4 }}
      >
        {isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
      </motion.div>
      {isFollowing ? 'Following' : 'Follow'}
    </motion.button>
  );
};
