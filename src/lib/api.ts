import { User, EventItem, Application, AppNotification, City, SubscriptionPlan, UserSubscription, CrewReview, CrewVerifiedProfile, EventOrganizer, OrganizerReview, EventBooking } from '../types';

const API_BASE = '/api';


async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type');
  let data: any;
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    data = { error: text || `HTTP ${res.status} ${res.statusText}` };
  }

  if (!res.ok) {
    throw new Error(data?.error || 'An error occurred. Please try again.');
  }
  return data as T;
}

export const api = {
  // Cities
  getCities: async (): Promise<City[]> => {
    const res = await fetch(`${API_BASE}/cities`);
    return handleResponse<City[]>(res);
  },

  addCity: async (cityData: { name: string; isActive: boolean; lat?: number; lng?: number }) => {
    const res = await fetch(`${API_BASE}/cities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cityData)
    });
    return handleResponse(res);
  },

  // Auth
  signupCrew: async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/signup-crew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ user: User; trialSubscription: UserSubscription; demoOtps: { mobileOtp: string; emailOtp?: string } }>(res);
  },

  signupHandler: async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/signup-handler`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ user: User; trialSubscription: UserSubscription; demoOtps: { mobileOtp: string } }>(res);
  },

  verifyOtp: async (userId: string, type: 'mobile' | 'email', code: string) => {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, type, code })
    });
    return handleResponse<{ message: string; user: User }>(res);
  },

  resendOtp: async (userId: string, type: 'mobile' | 'email') => {
    const res = await fetch(`${API_BASE}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, type })
    });
    return handleResponse<{ message: string; demoOtp: string }>(res);
  },

  login: async (identifier: string, password: string, role?: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password, role })
    });
    return handleResponse<{ user: User; subscription: UserSubscription | null }>(res);
  },

  uploadId: async (userId: string, idDocumentUrl: string) => {
    const res = await fetch(`${API_BASE}/auth/upload-id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, idDocumentUrl })
    });
    return handleResponse<{ message: string; user: User }>(res);
  },

  // Events
  getEvents: async (params?: { city?: string; category?: string; minPay?: number; search?: string; userLat?: number; userLng?: number }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
    }
    const queryString = searchParams.toString();
    const url = queryString ? `${API_BASE}/events?${queryString}` : `${API_BASE}/events`;
    const res = await fetch(url);
    return handleResponse<(EventItem & { distanceKm?: number })[]>(res);
  },

  getEventById: async (id: string) => {
    const res = await fetch(`${API_BASE}/events/${id}`);
    return handleResponse<EventItem>(res);
  },

  createEvent: async (eventData: any) => {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    return handleResponse<{ message: string; event: EventItem }>(res);
  },

  updateEventStatus: async (eventId: string, status: string) => {
    const res = await fetch(`${API_BASE}/events/${eventId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return handleResponse<{ message: string; event: EventItem }>(res);
  },

  updateEvent: async (eventId: string, data: any) => {
    const res = await fetch(`${API_BASE}/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; event: EventItem }>(res);
  },

  deleteEvent: async (eventId: string, handlerId?: string) => {
    const res = await fetch(`${API_BASE}/events/${eventId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handlerId })
    });
    return handleResponse<{ message: string }>(res);
  },

  updateProfile: async (userId: string, data: any) => {
    const res = await fetch(`${API_BASE}/users/${userId}/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; user: User }>(res);
  },

  deleteAccount: async (userId: string) => {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse<{ message: string }>(res);
  },

  // Community / Experience Posts
  getPosts: async () => {
    const res = await fetch(`${API_BASE}/posts`);
    return handleResponse<any[]>(res);
  },

  createPost: async (postData: any) => {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    return handleResponse<{ message: string; post: any }>(res);
  },

  likePost: async (postId: string, userId: string) => {
    const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return handleResponse<{ success: boolean; likes: string[] }>(res);
  },

  addComment: async (postId: string, userId: string, text: string) => {
    const res = await fetch(`${API_BASE}/posts/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, text })
    });
    return handleResponse<{ message: string; comment: any; comments: any[] }>(res);
  },

  deletePost: async (postId: string, userId?: string) => {
    const res = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return handleResponse<{ message: string }>(res);
  },

  applyForEvent: async (eventId: string, crewId: string) => {
    const res = await fetch(`${API_BASE}/events/${eventId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crewId })
    });
    return handleResponse<{ message: string; application: Application }>(res);
  },

  getEventApplications: async (eventId: string) => {
    const res = await fetch(`${API_BASE}/events/${eventId}/applications`);
    return handleResponse<Application[]>(res);
  },

  getMyApplications: async (crewId: string) => {
    const res = await fetch(`${API_BASE}/applications/my?crewId=${crewId}`);
    return handleResponse<Application[]>(res);
  },

  getCrewApplications: async (crewId: string) => {
    const res = await fetch(`${API_BASE}/applications/my?crewId=${crewId}`);
    return handleResponse<Application[]>(res);
  },

  updateApplicationStatus: async (applicationId: string, status: 'approved' | 'rejected' | 'completed') => {
    const res = await fetch(`${API_BASE}/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return handleResponse<{ message: string; application: Application; event: EventItem }>(res);
  },

  // Notifications
  getNotifications: async (userId: string): Promise<AppNotification[]> => {
    if (!userId) return [];
    try {
      const res = await fetch(`${API_BASE}/notifications?userId=${encodeURIComponent(userId)}`);
      const data = await handleResponse<AppNotification[]>(res);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('Unable to get notifications:', err);
      return [];
    }
  },

  markNotificationRead: async (notifId: string) => {
    const res = await fetch(`${API_BASE}/notifications/${encodeURIComponent(notifId)}/read`, {
      method: 'PATCH'
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Subscriptions
  getPlans: async (role?: string) => {
    const url = role ? `${API_BASE}/subscriptions/plans?role=${encodeURIComponent(role)}` : `${API_BASE}/subscriptions/plans`;
    const res = await fetch(url);
    return handleResponse<SubscriptionPlan[]>(res);
  },

  subscribe: async (userId: string, planId: string) => {
    const res = await fetch(`${API_BASE}/subscriptions/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, planId })
    });
    return handleResponse<{ message: string; subscription: UserSubscription }>(res);
  },

  // Admin
  getAdminDashboard: async () => {
    const res = await fetch(`${API_BASE}/admin/dashboard`);
    return handleResponse<any>(res);
  },

  getAdminUsers: async (params?: { role?: string; verificationStatus?: string }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val) searchParams.append(key, val);
      });
    }
    const queryString = searchParams.toString();
    const url = queryString ? `${API_BASE}/admin/users?${queryString}` : `${API_BASE}/admin/users`;
    const res = await fetch(url);
    return handleResponse<User[]>(res);
  },

  updateAdminUser: async (userId: string, data: any) => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; user: User }>(res);
  },

  toggleVerifyCrewId: async (userId: string, status: boolean) => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idVerified: status })
    });
    return handleResponse<{ message: string; user: User }>(res);
  },

  getAdminEvents: async () => {
    const res = await fetch(`${API_BASE}/admin/events`);
    return handleResponse<EventItem[]>(res);
  },

  deleteAdminEvent: async (id: string) => {
    const res = await fetch(`${API_BASE}/admin/events/${id}`, {
      method: 'DELETE'
    });
    return handleResponse<{ message: string }>(res);
  },

  getAdminAuditLogs: async () => {
    const res = await fetch(`${API_BASE}/admin/audit-logs`);
    return handleResponse<any[]>(res);
  },

  getAdminLoginLogs: async () => {
    const res = await fetch(`${API_BASE}/admin/login-logs`);
    return handleResponse<any[]>(res);
  },

  // Crew Verified Profile & Reviews
  getCrewVerifiedProfile: async (crewId: string): Promise<CrewVerifiedProfile> => {
    const res = await fetch(`${API_BASE}/crew/${encodeURIComponent(crewId)}/profile`);
    return handleResponse<CrewVerifiedProfile>(res);
  },

  submitCrewReview: async (data: {
    handlerId: string;
    crewId: string;
    eventId: string;
    rating: number;
    punctualityRating?: number;
    workQualityRating?: number;
    comment?: string;
    isNoShow?: boolean;
  }) => {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; review: CrewReview }>(res);
  },

  getCrewReviews: async (crewId: string): Promise<CrewReview[]> => {
    const res = await fetch(`${API_BASE}/reviews/crew/${encodeURIComponent(crewId)}`);
    return handleResponse<CrewReview[]>(res);
  },

  // Event Organizers Directory & Reviews
  getOrganizersDirectory: async (params?: { city?: string; category?: string; search?: string; minRating?: number; sort?: string }): Promise<EventOrganizer[]> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
    }
    const queryString = searchParams.toString();
    const url = queryString ? `${API_BASE}/organizers/directory?${queryString}` : `${API_BASE}/organizers/directory`;
    const res = await fetch(url);
    return handleResponse<EventOrganizer[]>(res);
  },

  getOrganizerById: async (id: string): Promise<EventOrganizer> => {
    const res = await fetch(`${API_BASE}/organizers/${encodeURIComponent(id)}`);
    return handleResponse<EventOrganizer>(res);
  },

  submitOrganizerReview: async (organizerId: string, reviewData: {
    clientId?: string;
    clientName: string;
    clientCity?: string;
    eventTitle: string;
    eventCategory?: string;
    eventDate?: string;
    rating: number;
    decorRating?: number;
    coordinationRating?: number;
    punctualityRating?: number;
    comment: string;
    praiseTags?: string[];
  }) => {
    const res = await fetch(`${API_BASE}/organizers/${encodeURIComponent(organizerId)}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    return handleResponse<{ message: string; review: OrganizerReview }>(res);
  },

  createEventBooking: async (bookingData: {
    organizerId: string;
    organizerName: string;
    organizerCompany: string;
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
  }) => {
    const res = await fetch(`${API_BASE}/event-bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return handleResponse<{ message: string; booking: EventBooking }>(res);
  },

  getEventBookings: async (params?: { organizerId?: string; handlerId?: string; clientId?: string }): Promise<EventBooking[]> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val) searchParams.append(key, val);
      });
    }
    const queryString = searchParams.toString();
    const url = queryString ? `${API_BASE}/event-bookings?${queryString}` : `${API_BASE}/event-bookings`;
    const res = await fetch(url);
    return handleResponse<EventBooking[]>(res);
  },

  updateEventBookingStatus: async (bookingId: string, status: string) => {
    const res = await fetch(`${API_BASE}/event-bookings/${encodeURIComponent(bookingId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return handleResponse<{ message: string; booking: EventBooking }>(res);
  },

  trackWebsiteClick: async (pageName: string, user?: any) => {

    try {
      const res = await fetch(`${API_BASE}/track-website-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pageName, user })
      });
      return await res.json();
    } catch {
      return null;
    }
  }
};
