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
  isBanned?: boolean;
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
  genre?: string;
  dressCode?: string;
  ageRestriction?: number;
  contactEmail?: string;
  latitude?: number;
  longitude?: number;
  instagram?: string;
  twitter?: string;
  promoters?: string[];
  cancellationPolicy?: string;
  refundPolicy?: string;
  averageRating?: number;
  totalReviews?: number;
  createdAt: number;
}

export interface Booking {
  id: string;
  partyId: string;
  userId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: number;
  qrTicket?: string;
}

export interface Review {
  id: string;
  partyId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: number;
  helpful?: number;
}

export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: number;
}

export interface Analytics {
  partyId: string;
  totalBookings: number;
  totalRevenue: number;
  ticketssoldPercentage: number;
  averageRating: number;
  viewCount: number;
  shareCount: number;
}
