export type UserRole = 'USER' | 'INFLUENCER' | 'ADMIN';

export interface UserProfile {
  uid: string;
  email: string;
  nickname: string;
  role: UserRole;
  whatsapp?: string;
  instagram?: string;
  twitter?: string;
  isVerified: boolean;
  isVerificationPending?: boolean;
  photoURL?: string;
  createdAt: number;
}

export type PartyStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Party {
  id: string;
  hostId: string;
  hostName: string;
  name: string;
  description: string;
  date: string; // ISO string
  time: string;
  location: string;
  status: PartyStatus;
  posterURL: string;
  qrCode?: string;
  rejectionReason?: string;
  capacity?: number;
  ticketsSold?: number;
  price?: number;
  venue?: string;
  createdAt: number;
}
