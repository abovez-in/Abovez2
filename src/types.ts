export type UserRole = 'crew' | 'handler' | 'admin';

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: UserRole;
  createdAt: string;
  mobileVerified: boolean;
  emailVerified: boolean;
  status: 'active' | 'suspended' | 'unverified';
  avatarUrl?: string;
  bio?: string;
  
  // Crew fields
  gender?: string;
  address?: string;
  city?: string;
  area?: string;
  state?: string;
  dob?: string;
  skills?: string[];
  experience?: string;
  availability?: string;
  rating?: number;
  reviewCount?: number;
  completedEventsCount?: number;
  noShowCount?: number;
  lat?: number;
  lng?: number;
  idDocumentUrl?: string;
  idVerificationStatus?: 'none' | 'pending' | 'verified' | 'rejected';
  idRejectionReason?: string;
  
  // Handler fields
  companyName?: string;
}

export interface CrewReview {
  id: string;
  crewId: string;
  crewName?: string;
  handlerId: string;
  handlerName: string;
  handlerCompany?: string;
  eventId: string;
  eventTitle: string;
  eventDate?: string;
  rating: number; // 1 to 5
  punctualityRating?: number; // 1 to 5
  workQualityRating?: number; // 1 to 5
  comment: string;
  isNoShow?: boolean;
  createdAt: string;
}

export interface CrewVerifiedProfile {
  user: User;
  stats: {
    rating: number;
    reviewCount: number;
    completedEventsCount: number;
    noShowCount: number;
    reliabilityScore: number; // percentage e.g. 100
    mobileVerified: boolean;
    idVerified: boolean;
  };
  skills: string[];
  experience: string;
  previousEvents: {
    eventId: string;
    eventTitle: string;
    eventCategory: string;
    eventDate: string;
    eventArea: string;
    eventPay: number;
    status: string;
    review?: CrewReview;
  }[];
  reviews: CrewReview[];
}

export interface PostComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: UserRole;
  text: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  authorCompany?: string;
  content: string;
  imageUrl?: string;
  eventTag?: string;
  experienceType?: string;
  city: string;
  likes: string[];
  comments: PostComment[];
  createdAt: string;
}

export interface City {
  id: string;
  name: string;
  state?: string;
  isActive: boolean;
  lat: number;
  lng: number;
  isPopular?: boolean;
}

export type EventCategory = 
  | 'Wedding' 
  | 'Corporate' 
  | 'Exhibition' 
  | 'Concert/Stage' 
  | 'Promotional' 
  | 'Setup Crew' 
  | 'Hospitality' 
  | 'Other';

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  handlerId: string;
  handlerName: string;
  handlerCompany?: string;
  city: string;
  area: string;
  fullAddress: string;
  lat: number;
  lng: number;
  eventDate: string;
  startTime: string;
  endTime: string;
  payPerPerson: number;
  totalCrewNeeded: number;
  approvedCrewCount: number;
  workType: string;
  instructions?: string;
  bannerUrl?: string;
  status: 'active' | 'crew_full' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Application {
  id: string;
  eventId: string;
  eventTitle: string;
  eventCategory: string;
  eventDate: string;
  eventPay: number;
  eventArea: string;
  crewId: string;
  crewName: string;
  crewAge?: number;
  crewPhone: string;
  crewCity: string;
  crewArea: string;
  crewSkills: string[];
  crewExperience: string;
  crewRating: number;
  idVerified: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  appliedAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'event_alert' | 'application_update' | 'system';
  read: boolean;
  createdAt: string;
  eventId?: string;
}

export interface SubscriptionPlan {
  id: string;
  targetRole: 'crew' | 'handler';
  name: string;
  durationMonths: number;
  priceInr: number;
  features: string[];
  isActive: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  startDate: string;
  expiryDate: string;
  status: 'active' | 'expired';
  isTrial: boolean;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetUserId: string;
  timestamp: string;
}

export interface UserLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userRole: UserRole | 'guest';
  userCity: string;
  action: string;
  timestamp: string;
  date: string;
  time: string;
  ip: string;
  userAgent?: string;
}

export type OrganizerCategory =
  | 'Wedding'
  | 'Corporate'
  | 'Exhibition'
  | 'Birthday & Parties'
  | 'Concerts & Shows'
  | 'Catering & Hospitality'
  | 'Photography & AV'
  | 'Full Production';

export interface OrganizerReview {
  id: string;
  organizerId: string;
  organizerName?: string;
  organizerCompany?: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  clientCity?: string;
  eventTitle: string;
  eventCategory: string;
  eventDate: string;
  rating: number; // 1 to 5
  decorRating?: number;
  coordinationRating?: number;
  punctualityRating?: number;
  comment: string;
  praiseTags?: string[];
  createdAt: string;
}

export interface EventOrganizer {
  id: string;
  name: string;
  companyName: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  city: string;
  area: string;
  address?: string;
  phone: string;
  email: string;
  categories: OrganizerCategory[];
  rating: number;
  reviewCount: number;
  completedEventsCount: number;
  startingPriceInr: number;
  verified: boolean;
  servicesOffered: string[];
  photos?: string[];
  reviews?: OrganizerReview[];
  featured?: boolean;
}

export interface EventBooking {
  id: string;
  bookingRef: string;
  organizerId: string;
  organizerName: string;
  organizerCompany: string;
  organizerPhone?: string;
  clientId?: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientCity: string;
  eventName: string;
  category: string;
  eventDate: string;
  eventTime?: string;
  venueArea: string;
  guestCount: string;
  budgetRange: string;
  servicesRequested: string[];
  specialNotes?: string;
  status: 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}


