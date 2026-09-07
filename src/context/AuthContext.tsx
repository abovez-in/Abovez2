import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, UserSubscription, AppNotification, City } from '../types';
import { api } from '../lib/api';
import { ALL_INDIAN_CITIES } from '../data/indianCities';

interface OtpModalState {
  open: boolean;
  userId: string;
  type: 'mobile' | 'email';
  demoCode?: string;
  target?: string;
}

export type NavTab = 'home' | 'book-event' | 'find-crew' | 'jobs' | 'hire-crew' | 'events' | 'organizers' | 'crew-dashboard' | 'admin';

interface AuthContextType {
  user: User | null;
  subscription: UserSubscription | null;
  activeCity: City;
  cities: City[];
  notifications: AppNotification[];
  unreadNotifCount: number;
  activeTab: NavTab;
  selectedBookingCategory: string;

  // Modal States
  authModalType: 'crew-signup' | 'crew-login' | 'handler-signup' | 'handler-login' | 'admin-login' | null;
  otpModalState: OtpModalState | null;
  idUploadModalOpen: boolean;
  createEventModalOpen: boolean;
  subscriptionModalOpen: boolean;
  cityModalOpen: boolean;
  editProfileModalOpen: boolean;

  // Actions
  login: (user: User, subscription?: UserSubscription | null) => void;
  logout: () => void;
  setUserAndSub: (user: User, subscription?: UserSubscription | null) => void;
  refreshNotifications: () => Promise<void>;
  setActiveCity: (city: City) => void;
  setActiveTab: (tab: NavTab | string) => void;
  setSelectedBookingCategory: (category: string) => void;
  navigateToBookEvent: (category?: string) => void;

  openAuthModal: (type: 'crew-signup' | 'crew-login' | 'handler-signup' | 'handler-login' | 'admin-login') => void;
  closeAuthModal: () => void;
  openOtpModal: (userId: string, type: 'mobile' | 'email', demoCode?: string, target?: string) => void;
  closeOtpModal: () => void;
  openIdUploadModal: () => void;
  closeIdUploadModal: () => void;
  openCreateEventModal: () => void;
  closeCreateEventModal: () => void;
  openSubscriptionModal: () => void;
  closeSubscriptionModal: () => void;
  openCityModal: () => void;
  closeCityModal: () => void;
  openEditProfileModal: () => void;
  closeEditProfileModal: () => void;
}

const DEFAULT_CITY: City = ALL_INDIAN_CITIES.find(c => c.id === 'surat') || ALL_INDIAN_CITIES[0];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('crewconnect_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [subscription, setSubscription] = useState<UserSubscription | null>(() => {
    try {
      const saved = localStorage.getItem('crewconnect_sub');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeCity, setActiveCityState] = useState<City>(() => {
    try {
      const saved = localStorage.getItem('crewconnect_city');
      return saved ? JSON.parse(saved) : DEFAULT_CITY;
    } catch {
      return DEFAULT_CITY;
    }
  });

  const [cities, setCities] = useState<City[]>(ALL_INDIAN_CITIES);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedBookingCategory, setSelectedBookingCategory] = useState<string>('All');

  // Derive activeTab from current URL pathname
  const getActiveTab = (): NavTab => {
    const p = location.pathname;
    if (p === '/book-event') return 'book-event';
    if (p === '/find-crew' || p === '/crew-dashboard') return 'find-crew';
    if (p === '/jobs' || p === '/events') return 'jobs';
    if (p === '/hire-crew' || p === '/organizers') return 'hire-crew';
    if (p === '/admin') return 'admin';
    return 'home';
  };

  const activeTab = getActiveTab();

  const setActiveTab = (tab: NavTab | string) => {
    if (tab === 'home' || tab === '/') {
      navigate('/');
    } else if (tab === 'book-event' || tab === '/book-event') {
      navigate('/book-event');
    } else if (tab === 'find-crew' || tab === 'crew-dashboard' || tab === '/find-crew' || tab === '/crew-dashboard') {
      navigate('/find-crew');
    } else if (tab === 'jobs' || tab === 'events' || tab === '/jobs' || tab === '/events') {
      navigate('/jobs');
    } else if (tab === 'hire-crew' || tab === 'organizers' || tab === '/hire-crew' || tab === '/organizers') {
      navigate('/hire-crew');
    } else if (tab === 'admin' || tab === '/admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const navigateToBookEvent = (category?: string) => {
    if (category) {
      setSelectedBookingCategory(category);
    }
    navigate('/book-event');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modals
  const [authModalType, setAuthModalType] = useState<'crew-signup' | 'crew-login' | 'handler-signup' | 'handler-login' | 'admin-login' | null>(null);
  const [otpModalState, setOtpModalState] = useState<OtpModalState | null>(null);
  const [idUploadModalOpen, setIdUploadModalOpen] = useState(false);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);

  // Check for hidden admin access via secret URL parameter or hash
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const hash = window.location.hash;

      if (
        params.get('admin') === 'abovez' ||
        params.get('admin') === 'true' ||
        params.get('page') === 'admin' ||
        hash === '#admin' ||
        hash === '#/admin'
      ) {
        if (location.pathname !== '/admin') {
          navigate('/admin');
        }
      }
    } catch (err) {
      console.error('Error parsing admin URL:', err);
    }
  }, [location.search, location.pathname]);

  // Load cities on mount
  useEffect(() => {
    api.getCities().then(res => {
      if (res && res.length > 0) {
        setCities(res);
        const surat = res.find(c => c.id === 'surat');
        if (surat && !localStorage.getItem('crewconnect_city')) {
          setActiveCityState(surat);
        }
      }
    }).catch(err => console.error('Failed to load cities:', err));
  }, []);

  // Fetch notifications whenever user changes
  const refreshNotifications = async () => {
    if (!user || !user.id) {
      setNotifications([]);
      return;
    }
    try {
      const res = await api.getNotifications(user.id);
      setNotifications(Array.isArray(res) ? res : []);
    } catch (err) {
      console.warn('Unable to load notifications', err);
      setNotifications([]);
    }
  };

  useEffect(() => {
    if (user?.id) {
      refreshNotifications();
      const interval = setInterval(refreshNotifications, 10000); // Auto refresh every 10s
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [user?.id]);

  const login = (newUser: User, newSub?: UserSubscription | null) => {
    setUser(newUser);
    setSubscription(newSub || null);
    localStorage.setItem('crewconnect_user', JSON.stringify(newUser));
    if (newSub) localStorage.setItem('crewconnect_sub', JSON.stringify(newSub));

    if (newUser.role === 'handler') {
      navigate('/hire-crew');
    } else if (newUser.role === 'crew') {
      navigate('/find-crew');
    } else if (newUser.role === 'admin') {
      navigate('/admin');
    }
  };

  const logout = () => {
    setUser(null);
    setSubscription(null);
    setNotifications([]);
    localStorage.removeItem('crewconnect_user');
    localStorage.removeItem('crewconnect_sub');
    navigate('/');
  };

  const setUserAndSub = (newUser: User, newSub?: UserSubscription | null) => {
    setUser(newUser);
    localStorage.setItem('crewconnect_user', JSON.stringify(newUser));
    if (newSub !== undefined) {
      setSubscription(newSub);
      if (newSub) localStorage.setItem('crewconnect_sub', JSON.stringify(newSub));
      else localStorage.removeItem('crewconnect_sub');
    }
  };

  const setActiveCity = (c: City) => {
    setActiveCityState(c);
    localStorage.setItem('crewconnect_city', JSON.stringify(c));
  };

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadNotifCount = safeNotifications.filter(n => n && !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        activeCity,
        cities,
        notifications,
        unreadNotifCount,
        activeTab,
        selectedBookingCategory,
        authModalType,
        otpModalState,
        idUploadModalOpen,
        createEventModalOpen,
        subscriptionModalOpen,
        cityModalOpen,
        editProfileModalOpen,

        login,
        logout,
        setUserAndSub,
        refreshNotifications,
        setActiveCity,
        setActiveTab,
        setSelectedBookingCategory,
        navigateToBookEvent,

        openAuthModal: (type) => setAuthModalType(type),
        closeAuthModal: () => setAuthModalType(null),

        openOtpModal: (userId, type, demoCode, target) =>
          setOtpModalState({ open: true, userId, type, demoCode, target }),
        closeOtpModal: () => setOtpModalState(null),

        openIdUploadModal: () => setIdUploadModalOpen(true),
        closeIdUploadModal: () => setIdUploadModalOpen(false),

        openCreateEventModal: () => setCreateEventModalOpen(true),
        closeCreateEventModal: () => setCreateEventModalOpen(false),

        openSubscriptionModal: () => setSubscriptionModalOpen(true),
        closeSubscriptionModal: () => setSubscriptionModalOpen(false),

        openCityModal: () => setCityModalOpen(true),
        closeCityModal: () => setCityModalOpen(false),

        openEditProfileModal: () => setEditProfileModalOpen(true),
        closeEditProfileModal: () => setEditProfileModalOpen(false)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
