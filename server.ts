import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { supabase } from './src/lib/supabase';

const DATA_FILE = path.join(process.cwd(), 'data.json');

// Helper to calculate distance in KM between two lat/lng coordinates (Haversine formula)
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Initial DB Structure
interface DB {
  users: any[];
  events: any[];
  applications: any[];
  notifications: any[];
  cities: any[];
  subscriptionPlans: any[];
  subscriptions: any[];
  otps: any[];
  adminLogs: any[];
  loginLogs: any[];
  posts?: any[];
  reviews?: any[];
  eventBookings?: any[];
  organizers?: any[];
  organizerReviews?: any[];
  totalWebsiteClicks?: number;
}

const DEFAULT_DB: DB = {
  totalWebsiteClicks: 0,
  posts: [],
  reviews: [],
  eventBookings: [],
  organizerReviews: [],
  organizers: [],
  users: [

    {
      id: 'admin-1',
      email: 'abovez.in@gmail.com',
      phone: '9265993727',
      name: 'Rajnish',
      role: 'admin',
      password: 'Rajnish@345',
      createdAt: new Date().toISOString(),
      mobileVerified: true,
      emailVerified: true,
      status: 'active'
    }
  ],
  events: [], // STRICTLY NO DUMMY DATA
  applications: [], // STRICTLY NO DUMMY DATA
  notifications: [],
  cities: [
    { id: 'surat', name: 'Surat', isActive: true, lat: 21.1702, lng: 72.8311 },
    { id: 'mumbai', name: 'Mumbai', isActive: false, lat: 19.0760, lng: 72.8777 },
    { id: 'ahmedabad', name: 'Ahmedabad', isActive: false, lat: 23.0225, lng: 72.5714 },
    { id: 'vadodara', name: 'Vadodara', isActive: false, lat: 22.3072, lng: 73.1812 }
  ],
  subscriptionPlans: [
    {
      id: 'handler-trial',
      targetRole: 'handler',
      name: '1-Month Free Trial',
      durationMonths: 1,
      priceInr: 0,
      features: ['Publish Unlimited Events', 'View Crew Distance & Ratings', 'Direct Crew Approval', 'Priority Support'],
      isActive: true
    },
    {
      id: 'handler-monthly',
      targetRole: 'handler',
      name: 'Pro Monthly',
      durationMonths: 1,
      priceInr: 299,
      features: ['Publish Unlimited Events', 'Instant Broadcast to Nearby Crew', 'ID Verified Crew Filter', 'Priority Support'],
      isActive: true
    },
    {
      id: 'handler-quarterly',
      targetRole: 'handler',
      name: 'Pro 3-Months',
      durationMonths: 3,
      priceInr: 699,
      features: ['Save 22%', 'All Monthly Pro Features', 'Dedicated Account Manager'],
      isActive: true
    },
    {
      id: 'handler-yearly',
      targetRole: 'handler',
      name: 'Pro Annual',
      durationMonths: 12,
      priceInr: 1999,
      features: ['Best Value (Save 44%)', 'All Pro Features', 'Featured Event Badges'],
      isActive: true
    },
    {
      id: 'crew-trial',
      targetRole: 'crew',
      name: '1-Month Free Trial',
      durationMonths: 1,
      priceInr: 0,
      features: ['Unlimited Event Applications', 'Distance-based Event Discovery', 'Identity Verification Badge', 'Real-time Approval Alerts'],
      isActive: true
    },
    {
      id: 'crew-monthly',
      targetRole: 'crew',
      name: 'Crew Pass Monthly',
      durationMonths: 1,
      priceInr: 99,
      features: ['Apply to Unlimited Events', 'Instant Notification for New Events', 'Verified Member Status', 'Direct Handler Contact'],
      isActive: true
    },
    {
      id: 'crew-yearly',
      targetRole: 'crew',
      name: 'Crew Pass Yearly',
      durationMonths: 12,
      priceInr: 699,
      features: ['Save 40%', 'Featured Crew Profile', 'Priority Application Processing'],
      isActive: true
    }
  ],
  subscriptions: [],
  otps: [],
  adminLogs: [],
  loginLogs: []
};

const SEED_SURAT_ORGANIZERS = [
  {
    id: 'org-surat-royal-weddings',
    name: 'Harshil Shah',
    companyName: 'Surat Royal Weddings & Planners',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    bio: 'Surat’s premier luxury wedding curators specializing in royal Gujarati & Rajasthani weddings, NRI destination marriages, theme Mandap setups, Haldi, Sangeet choreography, and 5-star hospitality crew management.',
    city: 'Surat',
    area: 'Vesu',
    address: '402, SNS Platina, Near Reliance Market, Vesu, Surat',
    phone: '9825109842',
    email: 'info@suratroyalweddings.com',
    categories: ['Wedding', 'Catering & Hospitality', 'Full Production'],
    rating: 4.9,
    reviewCount: 34,
    completedEventsCount: 88,
    startingPriceInr: 75000,
    verified: true,
    featured: true,
    servicesOffered: [
      'Theme Mandap & Floral Decor',
      'Bride & Groom Grand Entry Concepts',
      'VIP Hospitality & Usher Management',
      'Sangeet Stage, Truss & Line Array Sound',
      'Royal Banquet Catering & Live Counters'
    ],
    photos: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'org-apex-corporate-stage',
    name: 'Jigar Patel',
    companyName: 'Apex Corporate & Stage Management',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
    bio: 'Professional corporate event management company handling Annual General Meetings (AGM), Diamond & Textile B2B product launches, dealer meets, executive conferences, and dynamic LED stage productions in Surat.',
    city: 'Surat',
    area: 'Piplod',
    address: '7th Floor, International Trade Center, Piplod Main Road, Surat',
    phone: '9879543120',
    email: 'events@apexsurat.com',
    categories: ['Corporate', 'Concerts & Shows', 'Full Production'],
    rating: 4.8,
    reviewCount: 29,
    completedEventsCount: 65,
    startingPriceInr: 45000,
    verified: true,
    featured: true,
    servicesOffered: [
      'P3 LED Video Walls & Stage Trussing',
      'Professional Sound & Lighting Engineering',
      'VIP Guest Registration & Usher Crew',
      'Corporate Gala & Award Night Execution',
      'Simultaneous Translation & AV Streaming'
    ],
    photos: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'org-vibrant-expos-stalls',
    name: 'Nilesh Vaghani',
    companyName: 'Vibrant Gujarat Expos & Stall Creators',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    bio: 'Turnkey exhibition and trade expo organizers in Surat. Experts in octonorm & customized wooden stall design, SIECC Sarsana expo execution, industrial trade fairs, and exhibition security & helper staff deployment.',
    city: 'Surat',
    area: 'Adajan',
    address: 'B-301, Prime Shoppers, Near LP Savani Road, Adajan, Surat',
    phone: '9712903847',
    email: 'info@vibrantexpos.in',
    categories: ['Exhibition', 'Corporate', 'Full Production'],
    rating: 4.9,
    reviewCount: 22,
    completedEventsCount: 52,
    startingPriceInr: 30000,
    verified: true,
    featured: false,
    servicesOffered: [
      'Customized 3D Stall Fabrication & Lighting',
      'Trade Fair Floor Layout & Octonorm Stalls',
      'Exhibition Registration Desk & Hostesses',
      'Security Bouncers & Housekeeping Staff',
      'Badge Printing & Visitor Flow Coordination'
    ],
    photos: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'org-celebrations-kingdom-parties',
    name: 'Pooja Mehta',
    companyName: 'Celebrations Kingdom & Birthday Bash',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    bio: 'Creating memorable milestones! We design customized 1st birthdays, luxury anniversary galas, surprise proposals, baby showers, and grand private parties across Surat’s top clubhouses, farms, and banquet halls.',
    city: 'Surat',
    area: 'VIP Road',
    address: '104, City Light Shopping Arcade, VIP Road, Surat',
    phone: '9904221190',
    email: 'celebrate@kingdomsurat.com',
    categories: ['Birthday & Parties', 'Catering & Hospitality'],
    rating: 4.7,
    reviewCount: 19,
    completedEventsCount: 94,
    startingPriceInr: 15000,
    verified: true,
    featured: false,
    servicesOffered: [
      'Neon & Organic Balloon Backdrop Decor',
      'Magic Shows, Game Anchors & DJ Entertainment',
      'Theme Cake & Gourmet Dessert Counters',
      'Kids Activity Zones & Mascot Artists',
      'Return Gift Curation & Photography'
    ],
    photos: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'org-surat-live-concerts',
    name: 'Kunal Dave',
    companyName: 'Surat Live Beats & Concert Productions',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    bio: 'High-octane live stage shows, Navratri mega garba setups, celebrity artist management, Bollywood DJ nights, and cutting-edge stadium audio-visual productions in Surat and South Gujarat.',
    city: 'Surat',
    area: 'Ghod Dod Road',
    address: '302, Jolly Plaza, Ghod Dod Road, Surat',
    phone: '9824156789',
    email: 'production@suratlivebeats.com',
    categories: ['Concerts & Shows', 'Full Production', 'Photography & AV'],
    rating: 4.9,
    reviewCount: 31,
    completedEventsCount: 48,
    startingPriceInr: 50000,
    verified: true,
    featured: true,
    servicesOffered: [
      'JBL & RCF Line Array Live Concert Audio',
      'Beam Sharpy Moving Heads & Laser Show',
      'Celebrity Artist & Band Booking',
      'Heavy Duty Aluminum Roof Trussing',
      'Crowd Management & Entry Barricading'
    ],
    photos: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'org-royal-flavours-catering',
    name: 'Ghanshyam Balar',
    companyName: 'Royal Flavours Banquet & Catering Services',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    bio: 'Authentic Surati, Kathiyawadi, North Indian, Mexican, and live gourmet counter catering for weddings and corporate gatherings of 200 to 5000+ guests with impeccably trained hospitality crew.',
    city: 'Surat',
    area: 'Varachha',
    address: '501, Silver Point, Mini Bazar, Varachha, Surat',
    phone: '9825876543',
    email: 'catering@royalflavours.in',
    categories: ['Catering & Hospitality', 'Wedding', 'Corporate'],
    rating: 4.8,
    reviewCount: 26,
    completedEventsCount: 112,
    startingPriceInr: 25000,
    verified: true,
    featured: false,
    servicesOffered: [
      'Surati & Kathiyawadi Traditional Thali Feasts',
      'Live Chaat, Italian, & Wok Counters',
      'Groomed Uniform Waiters & Serving Crew',
      'Royal Silverware & Buffet Counter Setup',
      'Mocktail Bar & Liquid Nitrogen Ice Cream'
    ],
    photos: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'org-lenscraft-cinematography',
    name: 'Viral Dobariya',
    companyName: 'LensCraft Cinematography & Stage AV',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
    bio: 'Award-winning wedding cinematography, 4K multi-camera live streaming, LED screen rigging, and drone coverage for mega events, grand marriages, and exhibitions in Surat.',
    city: 'Surat',
    area: 'Katargam',
    address: '202, Platinum Plaza, Katargam Main Road, Surat',
    phone: '9909988776',
    email: 'shoot@lenscraftsurat.com',
    categories: ['Photography & AV', 'Wedding', 'Corporate'],
    rating: 4.9,
    reviewCount: 27,
    completedEventsCount: 78,
    startingPriceInr: 20000,
    verified: true,
    featured: false,
    servicesOffered: [
      '4K Cinematic Wedding Films & Teasers',
      '4K Multi-Cam YouTube / LED Live Switching',
      'DGCA Licensed Aerial Drone Cinematography',
      'P2.9 Ultra HD Stage LED Screens',
      'Pre-Wedding Concept Video Shoots'
    ],
    photos: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'org-dreamcraft-luxury-events',
    name: 'Ananya Desai',
    companyName: 'DreamCraft Luxury Event Curators',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    bio: 'Boutique bespoke event planning studio in Surat. We specialize in aesthetic luxury wedding themes, farmhouse sunset parties, bespoke floral installations, and VIP hospitality curation.',
    city: 'Surat',
    area: 'Dumas Road',
    address: 'Villa 12, Palm Avenue, Dumas Road, Surat',
    phone: '9825012345',
    email: 'hello@dreamcraftsurat.com',
    categories: ['Wedding', 'Corporate', 'Birthday & Parties', 'Full Production'],
    rating: 5.0,
    reviewCount: 18,
    completedEventsCount: 38,
    startingPriceInr: 100000,
    verified: true,
    featured: true,
    servicesOffered: [
      'End-to-End Turnkey Wedding Designing',
      'Exotic Floral & Imported Glass Mandaps',
      'Artist & Celebrity Guest Hospitality',
      'Farmhouse Destination Lighting & Draping',
      'Personalized Welcome Hampers & Ushers'
    ],
    photos: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

const SEED_ORGANIZER_REVIEWS = [
  {
    id: 'rev-org-1',
    organizerId: 'org-surat-royal-weddings',
    organizerName: 'Harshil Shah',
    organizerCompany: 'Surat Royal Weddings & Planners',
    clientId: 'client-101',
    clientName: 'Bhavin & Sneha Choksi',
    clientCity: 'Vesu, Surat',
    eventTitle: 'Grand Sangeet & Traditional Gujarati Wedding',
    eventCategory: 'Wedding',
    eventDate: '2026-02-10',
    rating: 5,
    decorRating: 5,
    coordinationRating: 5,
    punctualityRating: 5,
    comment: 'Harshil bhai and his team managed our 3-day wedding at Avadh Utopia flawlessly! The Mandap decor and guest management crew were top class. Every single guest praised the punctuality and royal hospitality.',
    praiseTags: ['Flawless Coordination', 'Breathtaking Mandap Decor', 'Polite Hospitality Crew', '100% On Time'],
    createdAt: '2026-02-12T14:30:00.000Z'
  },
  {
    id: 'rev-org-2',
    organizerId: 'org-surat-royal-weddings',
    organizerName: 'Harshil Shah',
    organizerCompany: 'Surat Royal Weddings & Planners',
    clientId: 'client-102',
    clientName: 'Dr. Manish Kalsariya',
    clientCity: 'Citylight, Surat',
    eventTitle: 'Royal Haldi & Mehendi Carnival',
    eventCategory: 'Wedding',
    eventDate: '2026-01-24',
    rating: 5,
    decorRating: 5,
    coordinationRating: 4.8,
    punctualityRating: 5,
    comment: 'The floral Haldi theme was spectacular. The crew they provided for guest ushering was exceptionally well-trained. Value for money was 10/10!',
    praiseTags: ['Vibrant Decor', 'Great Crew Coordination', 'Very Polite Staff'],
    createdAt: '2026-01-26T10:15:00.000Z'
  },
  {
    id: 'rev-org-3',
    organizerId: 'org-apex-corporate-stage',
    organizerName: 'Jigar Patel',
    organizerCompany: 'Apex Corporate & Stage Management',
    clientId: 'client-201',
    clientName: 'Ravi Sanghavi (Director, Sanghavi Gems)',
    clientCity: 'Piplod, Surat',
    eventTitle: 'Diamond B2B Expo & Annual Dealers Conclave',
    eventCategory: 'Corporate',
    eventDate: '2026-01-18',
    rating: 5,
    decorRating: 4.9,
    coordinationRating: 5,
    punctualityRating: 5,
    comment: 'Apex Corporate handled our 600-delegate national convention with absolute precision. The P3 LED backdrop and registration booth flow were seamless.',
    praiseTags: ['High Technical Precision', 'Crystal Clear Sound', 'Zero Delays'],
    createdAt: '2026-01-20T16:45:00.000Z'
  },
  {
    id: 'rev-org-4',
    organizerId: 'org-vibrant-expos-stalls',
    organizerName: 'Nilesh Vaghani',
    organizerCompany: 'Vibrant Gujarat Expos & Stall Creators',
    clientId: 'client-301',
    clientName: 'Kishore Goti (TexFab Machinery)',
    clientCity: 'Sarsana, Surat',
    eventTitle: 'SIECC International Textile Machinery Expo',
    eventCategory: 'Exhibition',
    eventDate: '2026-02-02',
    rating: 5,
    decorRating: 5,
    coordinationRating: 4.8,
    punctualityRating: 5,
    comment: 'Stall fabrication was completed 12 hours before schedule! Excellent structural finish and immediate helper staff support during the 4 expo days.',
    praiseTags: ['Ahead of Schedule', 'Sturdy 3D Stalls', 'Helpful Staff'],
    createdAt: '2026-02-05T09:20:00.000Z'
  },
  {
    id: 'rev-org-5',
    organizerId: 'org-celebrations-kingdom-parties',
    organizerName: 'Pooja Mehta',
    organizerCompany: 'Celebrations Kingdom & Birthday Bash',
    clientId: 'client-401',
    clientName: 'Priyanka & Chirag Shah',
    clientCity: 'Adajan, Surat',
    eventTitle: 'Ayaan 1st Birthday Jungle Safari Theme',
    eventCategory: 'Birthday & Parties',
    eventDate: '2026-02-08',
    rating: 5,
    decorRating: 5,
    coordinationRating: 5,
    punctualityRating: 5,
    comment: 'Pooja did magic! The kids went crazy with the mascot and customized game arena. Highly recommend Celebrations Kingdom for stress-free birthday parties.',
    praiseTags: ['Kids Loved It', 'Amazing Balloon Art', 'Super Friendly Anchor'],
    createdAt: '2026-02-09T18:00:00.000Z'
  },
  {
    id: 'rev-org-6',
    organizerId: 'org-surat-live-concerts',
    organizerName: 'Kunal Dave',
    organizerCompany: 'Surat Live Beats & Concert Productions',
    clientId: 'client-501',
    clientName: 'Siddharth Vashi (SVNIT Youth Festival)',
    clientCity: 'Dumas Road, Surat',
    eventTitle: 'College Spring Fest Celebrity Rock Night',
    eventCategory: 'Concerts & Shows',
    eventDate: '2026-01-30',
    rating: 5,
    decorRating: 4.8,
    coordinationRating: 5,
    punctualityRating: 5,
    comment: 'Rocking sound setup! 8,000 students attended and the audio clarity across the entire ground was thunderous. Kunal managed the artist rider effortlessly.',
    praiseTags: ['Thunderous Sound', 'Mesmerizing Light Show', 'Tight Crowd Control'],
    createdAt: '2026-02-01T11:10:00.000Z'
  }
];

function readDB(): DB {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (!parsed.loginLogs) parsed.loginLogs = [];
      if (!parsed.posts) parsed.posts = [];
      if (!parsed.reviews) parsed.reviews = [];
      if (!parsed.eventBookings) parsed.eventBookings = [];
      if (!parsed.organizers) parsed.organizers = [];
      if (!parsed.organizerReviews) parsed.organizerReviews = [];
      if (!parsed.notifications || !Array.isArray(parsed.notifications)) parsed.notifications = [];
      if (!parsed.events || !Array.isArray(parsed.events)) parsed.events = [];
      if (!parsed.applications || !Array.isArray(parsed.applications)) parsed.applications = [];
      if (!parsed.users || !Array.isArray(parsed.users)) parsed.users = [];
      if (!parsed.subscriptions || !Array.isArray(parsed.subscriptions)) parsed.subscriptions = [];
      if (!parsed.subscriptionPlans || !Array.isArray(parsed.subscriptionPlans)) parsed.subscriptionPlans = DEFAULT_DB.subscriptionPlans;
      if (!parsed.cities || !Array.isArray(parsed.cities)) parsed.cities = DEFAULT_DB.cities;
      if (!parsed.otps || !Array.isArray(parsed.otps)) parsed.otps = [];
      if (!parsed.adminLogs || !Array.isArray(parsed.adminLogs)) parsed.adminLogs = [];
      if (typeof parsed.totalWebsiteClicks !== 'number') parsed.totalWebsiteClicks = 0;
      const adminUser = (parsed.users || []).find((u: any) => u.role === 'admin');
      if (adminUser) {
        adminUser.name = 'Rajnish';
        adminUser.password = 'Rajnish@345';
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading data.json, falling back to default DB', err);
  }
  const initDb = {
    ...DEFAULT_DB,
    organizers: [],
    organizerReviews: []
  };
  saveDB(initDb);
  return initDb;
}


function saveDB(db: DB) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing data.json', err);
  }
}

function recordUserActivityLog(db: DB, user: any, action: string, req?: express.Request) {
  if (!db.loginLogs) db.loginLogs = [];
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  const clientIp = req ? (req.headers['x-forwarded-for'] as string || req.socket?.remoteAddress || '127.0.0.1') : '127.0.0.1';

  const logEntry = {
    id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    userId: user?.id || 'guest',
    userName: user?.name || user?.email || 'Guest User',
    userEmail: user?.email || 'N/A',
    userPhone: user?.phone || 'N/A',
    userRole: user?.role || 'guest',
    userCity: user?.city || 'Surat',
    action,
    timestamp: now.toISOString(),
    date: dateStr,
    time: timeStr,
    ip: String(clientIp).split(',')[0],
    userAgent: req ? (req.headers['user-agent'] || 'Web Browser') : 'AboveZ Web Portal'
  };

  db.loginLogs.unshift(logEntry);
  if (db.loginLogs.length > 500) {
    db.loginLogs = db.loginLogs.slice(0, 500);
  }
  return logEntry;
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const PORT = 3000;
  readDB(); // Initialize DB file

  // --- SEO & CANONICAL CONSOLIDATED REDIRECT MIDDLEWARE ---
  // Consolidates HTTP->HTTPS, WWW->non-WWW, trailing slash removal, and legacy routes into a single 301 hop
  app.use((req, res, next) => {
    // Skip backend API calls
    if (req.path.startsWith('/api/')) {
      return next();
    }

    const hostHeader = (req.headers.host || '').split(':')[0].toLowerCase();
    const isLocalhost = hostHeader === 'localhost' || hostHeader === '127.0.0.1' || hostHeader.includes('run.app');

    // 1. Protocol normalization
    const forwardedProto = (req.headers['x-forwarded-proto'] as string || '').toLowerCase();
    const isHttp = forwardedProto === 'http';
    const targetProto = (!isLocalhost && isHttp) ? 'https' : (forwardedProto || (req.secure ? 'https' : 'http'));
    const protoChanged = !isLocalhost && isHttp;

    // 2. Host normalization (strip www. -> apex domain abovez.in)
    let targetHost = hostHeader;
    let hostChanged = false;
    if (!isLocalhost && hostHeader.startsWith('www.')) {
      targetHost = hostHeader.replace(/^www\./, '');
      hostChanged = true;
    }

    // 3. Path normalization (strip trailing slash from paths other than root)
    let targetPath = req.path;
    let pathChanged = false;
    if (targetPath.length > 1 && targetPath.endsWith('/') && !targetPath.includes('.')) {
      targetPath = targetPath.replace(/\/+$/, '');
      pathChanged = true;
    }

    // 4. Legacy URL mapping (Permanent 301 redirect)
    const legacyRedirects: Record<string, string> = {
      '/events': '/jobs',
      '/organizers': '/hire-crew',
      '/crew-dashboard': '/find-crew'
    };

    if (legacyRedirects[targetPath]) {
      targetPath = legacyRedirects[targetPath];
      pathChanged = true;
    }

    // Issue a single consolidated 301 Permanent Redirect if any component changed
    if (protoChanged || hostChanged || pathChanged) {
      const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
      const finalLocation = isLocalhost 
        ? `${targetPath}${queryString}`
        : `${targetProto}://${targetHost}${targetPath}${queryString}`;

      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.redirect(301, finalLocation);
    }

    next();
  });

  // --- DEDICATED SEO ENDPOINTS ---
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://abovez.in/sitemap.xml
`);
  });

  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    const today = new Date().toISOString().split('T')[0];
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://abovez.in/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://abovez.in/jobs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://abovez.in/hire-crew</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://abovez.in/find-crew</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://abovez.in/book-event</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`);
  });

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Track Website Clicks & Visitor Views
  app.post('/api/track-website-click', (req, res) => {
    const db = readDB();
    db.totalWebsiteClicks = (db.totalWebsiteClicks || 0) + 1;

    const { user, page } = req.body || {};
    recordUserActivityLog(db, user, `Website Visit / Page Click (${page || 'Homepage'})`, req);

    saveDB(db);
    res.json({ success: true, totalWebsiteClicks: db.totalWebsiteClicks });
  });

  // Get Cities
  app.get('/api/cities', (req, res) => {
    const db = readDB();
    // Return all cities with isActive: true
    const allCities = (db.cities || []).map(c => ({ ...c, isActive: true }));
    res.json(allCities);
  });

  // Admin add city
  app.post('/api/cities', (req, res) => {
    const { name, isActive, lat, lng } = req.body;
    if (!name) return res.status(400).json({ error: 'City name is required' });

    const db = readDB();
    const id = name.toLowerCase().trim().replace(/\s+/g, '-');
    const existing = db.cities.find(c => c.id === id);
    if (existing) {
      existing.isActive = isActive !== undefined ? isActive : existing.isActive;
      existing.lat = lat || existing.lat;
      existing.lng = lng || existing.lng;
    } else {
      db.cities.push({
        id,
        name,
        isActive: isActive !== undefined ? isActive : true,
        lat: lat || 21.1702,
        lng: lng || 72.8311
      });
    }
    saveDB(db);
    res.json({ message: 'City updated', cities: db.cities });
  });

  // CREW SIGNUP
  app.post('/api/auth/signup-crew', async (req, res) => {
    const { name, email, phone, password, gender, dob, state, city, address, skills, experience, availability, avatarUrl } = req.body;
    
    // Strict mandatory validation - All core registration fields required
    if (!name || !email || !phone || !password || !state || !city || !address || !dob || !gender || !skills || (Array.isArray(skills) && skills.length === 0)) {
      return res.status(400).json({ error: 'All registration details (Full Name, Phone, Email, Password, Gender, Date of Birth, State, City, Local Address, and at least 1 Work Skill) are mandatory.' });
    }

    const db = readDB();
    const existing = db.users.find(u => u.email === email || u.phone === phone);
    if (existing) {
      return res.status(400).json({ error: 'User with this email or phone already exists.' });
    }

    const userId = 'crew-' + Date.now();
    const newUser = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password, // Simple string match for MVP
      role: 'crew',
      gender: gender.trim(),
      createdAt: new Date().toISOString(),
      mobileVerified: true,
      emailVerified: true,
      status: 'active',
      avatarUrl: avatarUrl ? avatarUrl.trim() : '', // Optional - empty by default, no auto assignment
      address: address.trim(),
      city: city.trim(),
      area: address ? address.split(',')[0].trim() : city.trim(),
      state: state.trim(),
      dob: dob.trim(),
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map((s: string) => s.trim()).filter(Boolean) : ['General Event Staff']),
      experience: experience || 'Fresher',
      availability: availability || 'Flexible / Weekend Work',
      rating: 5.0,
      lat: 21.1702 + (Math.random() * 0.04 - 0.02),
      lng: 72.8311 + (Math.random() * 0.04 - 0.02),
      idVerificationStatus: 'none'
    };

    // Save to Supabase
    try {
      await supabase.from('users').upsert([{
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
        role: newUser.role,
        address: newUser.address,
        city: newUser.city,
        state: newUser.state,
        skills: newUser.skills,
        experience: newUser.experience,
        availability: newUser.availability,
        mobileVerified: newUser.mobileVerified,
        emailVerified: newUser.emailVerified,
        status: newUser.status,
        idVerificationStatus: newUser.idVerificationStatus
      }], { onConflict: 'id' });
    } catch (err) {
      console.log('Supabase user insert note:', err);
    }

    db.users.push(newUser);

    // Create 1-month trial subscription for crew
    const trialSub = {
      id: 'sub-' + Date.now(),
      userId,
      planId: 'crew-trial',
      planName: '1-Month Free Trial',
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      isTrial: true
    };
    db.subscriptions.push(trialSub);

    // Generate OTPs for mobile and email
    const mobileOtp = generateOtp();
    const emailOtp = generateOtp();

    db.otps.push(
      { id: 'otp-' + Date.now() + '-m', userId, type: 'mobile', target: phone, code: mobileOtp, expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), verified: false },
      { id: 'otp-' + Date.now() + '-e', userId, type: 'email', target: email, code: emailOtp, expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), verified: false }
    );

    recordUserActivityLog(db, newUser, 'New Crew Member Registration', req);
    saveDB(db);

    const { password: _, ...userWithoutPassword } = newUser;
    res.json({
      user: userWithoutPassword,
      trialSubscription: trialSub,
      demoOtps: { mobileOtp, emailOtp }
    });
  });

  // HANDLER SIGNUP
  app.post('/api/auth/signup-handler', async (req, res) => {
    const { name, email, phone, password, companyName, address, city, state, avatarUrl } = req.body;
    
    // Strict mandatory validation
    if (!name || !companyName || !email || !phone || !password || !state || !city || !address) {
      return res.status(400).json({ error: 'All registration fields (Full Name, Company / Event Agency Name, Mobile, Email, Password, State, City, and Office/Local Address) are mandatory.' });
    }

    const db = readDB();
    const existing = db.users.find(u => u.email === email || u.phone === phone);
    if (existing) {
      return res.status(400).json({ error: 'User with this email or phone already exists.' });
    }

    const userId = 'handler-' + Date.now();
    const newUser = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      role: 'handler',
      companyName: companyName.trim(),
      createdAt: new Date().toISOString(),
      mobileVerified: true,
      emailVerified: true,
      status: 'active',
      avatarUrl: avatarUrl ? avatarUrl.trim() : '', // Optional - blank by default
      address: address.trim(),
      city: city.trim(),
      state: state.trim()
    };

    // Save to Supabase
    try {
      await supabase.from('users').upsert([{
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
        role: newUser.role,
        address: newUser.address,
        city: newUser.city,
        state: newUser.state,
        company_name: newUser.companyName,
        mobileVerified: newUser.mobileVerified,
        emailVerified: newUser.emailVerified,
        status: newUser.status
      }], { onConflict: 'id' });
    } catch (err) {
      console.log('Supabase handler insert note:', err);
    }

    db.users.push(newUser);

    // Create 1-month trial subscription for handler
    const trialSub = {
      id: 'sub-' + Date.now(),
      userId,
      planId: 'handler-trial',
      planName: '1-Month Free Trial',
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      isTrial: true
    };
    db.subscriptions.push(trialSub);

    const mobileOtp = generateOtp();
    db.otps.push(
      { id: 'otp-' + Date.now() + '-m', userId, type: 'mobile', target: phone, code: mobileOtp, expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), verified: false }
    );

    recordUserActivityLog(db, newUser, 'New Event Handler Registration', req);
    saveDB(db);

    const { password: _, ...userWithoutPassword } = newUser;
    res.json({
      user: userWithoutPassword,
      trialSubscription: trialSub,
      demoOtps: { mobileOtp }
    });
  });

  // VERIFY OTP
  app.post('/api/auth/verify-otp', async (req, res) => {
    const { userId, type, code } = req.body;
    if (!userId || !type || !code) {
      return res.status(400).json({ error: 'UserId, type, and code are required.' });
    }

    const db = readDB();
    const otpRecord = db.otps.find(
      o => o.userId === userId && o.type === type && o.code === code && !o.verified
    );

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP code.' });
    }

    otpRecord.verified = true;

    const user = db.users.find(u => u.id === userId);
    if (user) {
      if (type === 'mobile') user.mobileVerified = true;
      if (type === 'email') user.emailVerified = true;

      // If user required verifications complete, mark active
      if (user.role === 'crew' && user.mobileVerified && user.emailVerified) {
        user.status = 'active';
      } else if (user.role === 'handler' && user.mobileVerified) {
        user.status = 'active';
      }

      // Update in Supabase
      try {
        await supabase.from('users').update({
          mobileVerified: user.mobileVerified,
          emailVerified: user.emailVerified,
          status: user.status
        }).eq('id', user.id);
      } catch (err) {}

      recordUserActivityLog(db, user, `Mobile/Email OTP Verified (${type})`, req);
    }

    saveDB(db);

    const { password: _, ...updatedUser } = user;
    res.json({ message: `${type} verified successfully!`, user: updatedUser });
  });

  // RESEND OTP
  app.post('/api/auth/resend-otp', (req, res) => {
    const { userId, type } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newCode = generateOtp();
    db.otps.push({
      id: 'otp-' + Date.now(),
      userId,
      type,
      target: type === 'mobile' ? user.phone : user.email,
      code: newCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      verified: false
    });

    saveDB(db);
    res.json({ message: 'New OTP sent successfully!', demoOtp: newCode });
  });

  // LOGIN
  app.post('/api/auth/login', async (req, res) => {
    const { identifier, password, role } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Please enter your email/phone and password.' });
    }

    const db = readDB();
    // Admin authentication check
    const isRajnishUser = identifier.toLowerCase() === 'rajnish' || 
      identifier.toLowerCase() === 'abovez.in@gmail.com' || 
      identifier.toLowerCase() === 'rajnish@abovez.in' || 
      identifier === '9265993727' || 
      identifier.toLowerCase() === 'admin' || 
      identifier.toLowerCase() === 'admin@abovez.in';
    if (isRajnishUser && password === 'Rajnish@345') {
      let adminUser = db.users.find(u => u.role === 'admin');
      if (!adminUser) {
        adminUser = {
          id: 'admin-1',
          email: 'abovez.in@gmail.com',
          phone: '9265993727',
          name: 'Rajnish',
          role: 'admin',
          password: 'Rajnish@345',
          createdAt: new Date().toISOString(),
          mobileVerified: true,
          emailVerified: true,
          status: 'active'
        };
        db.users.push(adminUser);
      } else {
        adminUser.name = 'Rajnish';
        adminUser.email = 'abovez.in@gmail.com';
        adminUser.phone = '9265993727';
        adminUser.password = 'Rajnish@345';
      }
      recordUserActivityLog(db, adminUser, 'Admin Authentication Login', req);
      saveDB(db);
      return res.json({ user: adminUser, subscription: null });
    }

    // Check user in local state or Supabase
    let user = db.users.find(
      u => (u.email.toLowerCase() === identifier.toLowerCase() || u.phone === identifier) && u.password === password
    );

    if (!user) {
      try {
        const { data } = await supabase.from('users').select('*').or(`email.eq.${identifier},phone.eq.${identifier}`).maybeSingle();
        if (data && data.password === password) {
          user = data;
        }
      } catch (err) {}
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. Please check your email/phone and password.' });
    }

    if (role && user.role !== role && user.role !== 'admin') {
      return res.status(403).json({ error: `This account is registered as a ${user.role}. Please log in on the appropriate portal.` });
    }

    // Record login activity log
    recordUserActivityLog(db, user, `User Logged In (${user.role.toUpperCase()})`, req);

    // Get active subscription
    const sub = db.subscriptions.find(s => s.userId === user.id && s.status === 'active');

    saveDB(db);

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, subscription: sub || null });
  });

  // UPLOAD ID DOCUMENT (Crew)
  app.post('/api/auth/upload-id', (req, res) => {
    const { userId, idDocumentUrl } = req.body;
    if (!userId || !idDocumentUrl) {
      return res.status(400).json({ error: 'User ID and document file are required.' });
    }

    const db = readDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.idDocumentUrl = idDocumentUrl;
    user.idVerificationStatus = 'pending';

    recordUserActivityLog(db, user, 'Uploaded Govt ID Document for Verification', req);
    saveDB(db);

    const { password: _, ...updatedUser } = user;
    res.json({ message: 'ID document submitted for admin verification.', user: updatedUser });
  });

  // GET EVENTS (Browse)
  app.get('/api/events', async (req, res) => {
    const { city, category, minPay, search, userLat, userLng } = req.query;
    
    // 1. Attempt Supabase query
    let supabaseEvents: any[] | null = null;
    try {
      let query = supabase.from('events').select('*');
      if (city) query = query.ilike('city', `%${city}%`);
      if (category && category !== 'All') query = query.ilike('category', `%${category}%`);
      if (minPay) query = query.gte('payPerPerson', Number(minPay));
      
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        supabaseEvents = data;
      }
    } catch (err) {
      console.log('Supabase events fetch note:', err);
    }

    const db = readDB();
    const sourceList = (supabaseEvents && supabaseEvents.length > 0) ? supabaseEvents : db.events;
    let filtered = sourceList.filter((e: any) => e.status !== 'cancelled');

    if (city) {
      filtered = filtered.filter((e: any) => (e.city || '').toLowerCase() === (city as string).toLowerCase());
    }

    if (category && category !== 'All') {
      filtered = filtered.filter((e: any) => (e.category || '').toLowerCase() === (category as string).toLowerCase());
    }

    if (minPay) {
      filtered = filtered.filter((e: any) => Number(e.payPerPerson || e.pay_per_person || 0) >= Number(minPay));
    }

    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(
        (e: any) =>
          (e.title || '').toLowerCase().includes(q) ||
          (e.workType || e.work_type || '').toLowerCase().includes(q) ||
          (e.area || '').toLowerCase().includes(q)
      );
    }

    // Attach distance calculation
    const uLat = userLat ? Number(userLat) : 21.1702;
    const uLng = userLng ? Number(userLng) : 72.8311;

    const results = filtered.map((evt: any) => {
      const distance = calculateDistanceKm(uLat, uLng, evt.lat || 21.1702, evt.lng || 72.8311);
      return { ...evt, distanceKm: distance };
    });

    res.json(results);
  });

  // GET EVENT BY ID
  app.get('/api/events/:id', async (req, res) => {
    // Check Supabase first
    try {
      const { data, error } = await supabase.from('events').select('*').eq('id', req.params.id).maybeSingle();
      if (!error && data) {
        return res.json(data);
      }
    } catch (err) {
      console.log('Supabase single event fetch note:', err);
    }

    const db = readDB();
    const evt = db.events.find(e => e.id === req.params.id);
    if (!evt) return res.status(404).json({ error: 'Event not found' });
    res.json(evt);
  });

  // CREATE EVENT (Handler)
  app.post('/api/events', async (req, res) => {
    const {
      handlerId,
      title,
      category,
      city,
      area,
      fullAddress,
      lat,
      lng,
      eventDate,
      startTime,
      endTime,
      payPerPerson,
      totalCrewNeeded,
      workType,
      instructions,
      bannerUrl
    } = req.body;

    if (!handlerId || !title || !category || !eventDate || !payPerPerson || !totalCrewNeeded) {
      return res.status(400).json({ error: 'Please fill in all required event details.' });
    }

    const db = readDB();
    const handler = db.users.find(u => u.id === handlerId);
    if (!handler) return res.status(404).json({ error: 'Handler user not found.' });

    // Check handler active subscription or trial
    const sub = db.subscriptions.find(s => s.userId === handlerId && s.status === 'active');
    if (!sub || new Date(sub.expiryDate) < new Date()) {
      return res.status(403).json({ error: 'Your subscription or trial has expired. Please upgrade your plan to publish new events.' });
    }

    const eventId = 'event-' + Date.now();
    const newEvent = {
      id: eventId,
      title,
      category,
      handlerId,
      handlerName: handler.name,
      handlerCompany: handler.companyName || handler.name,
      city: city || 'Surat',
      area: area || 'Vesu',
      fullAddress: fullAddress || 'Vesu Main Road, Surat',
      lat: lat || (21.1702 + (Math.random() * 0.03 - 0.015)),
      lng: lng || (72.8311 + (Math.random() * 0.03 - 0.015)),
      eventDate,
      startTime: startTime || '09:00 AM',
      endTime: endTime || '06:00 PM',
      payPerPerson: Number(payPerPerson),
      totalCrewNeeded: Number(totalCrewNeeded),
      approvedCrewCount: 0,
      workType: workType || category,
      instructions: instructions || '',
      bannerUrl: bannerUrl ? bannerUrl.trim() : '',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Save to Supabase
    try {
      await supabase.from('events').insert([newEvent]);
    } catch (err) {
      console.log('Supabase event insert note:', err);
    }

    db.events.unshift(newEvent);

    // Send notifications to nearby crew members matching Surat
    const matchingCrew = db.users.filter(u => u.role === 'crew' && u.city?.toLowerCase() === (city || 'surat').toLowerCase());
    matchingCrew.forEach(async (crew) => {
      const notif = {
        id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        userId: crew.id,
        title: `⚡ New ${category} Event in ${newEvent.area}!`,
        message: `${newEvent.title} is hiring ${totalCrewNeeded} crew members. Pay: ₹${payPerPerson}/person. Apply now!`,
        type: 'event_alert',
        read: false,
        createdAt: new Date().toISOString(),
        eventId: newEvent.id
      };
      db.notifications.unshift(notif);
      try { await supabase.from('notifications').insert([notif]); } catch (e) {}
    });

    saveDB(db);
    res.json({ message: 'Event published successfully!', event: newEvent });
  });

  // EDIT EVENT (Handler)
  app.put('/api/events/:id', async (req, res) => {
    const eventId = req.params.id;
    const {
      handlerId,
      title,
      category,
      city,
      area,
      fullAddress,
      lat,
      lng,
      eventDate,
      startTime,
      endTime,
      payPerPerson,
      totalCrewNeeded,
      workType,
      instructions,
      bannerUrl,
      status
    } = req.body;

    const db = readDB();
    const evt = db.events.find(e => e.id === eventId);
    if (!evt) return res.status(404).json({ error: 'Event not found' });

    if (handlerId && evt.handlerId !== handlerId) {
      const user = db.users.find(u => u.id === handlerId);
      if (user && user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to edit this event.' });
      }
    }

    if (title) evt.title = title;
    if (category) evt.category = category;
    if (city) evt.city = city;
    if (area) evt.area = area;
    if (fullAddress) evt.fullAddress = fullAddress;
    if (lat) evt.lat = lat;
    if (lng) evt.lng = lng;
    if (eventDate) evt.eventDate = eventDate;
    if (startTime) evt.startTime = startTime;
    if (endTime) evt.endTime = endTime;
    if (payPerPerson !== undefined) evt.payPerPerson = Number(payPerPerson);
    if (totalCrewNeeded !== undefined) evt.totalCrewNeeded = Number(totalCrewNeeded);
    if (workType) evt.workType = workType;
    if (instructions !== undefined) evt.instructions = instructions;
    if (bannerUrl) evt.bannerUrl = bannerUrl;
    if (status) evt.status = status;

    // Update in Supabase
    try {
      await supabase.from('events').update(evt).eq('id', eventId);
    } catch (err) {
      console.log('Supabase event update note:', err);
    }

    // Synchronize application references
    db.applications.filter(a => a.eventId === eventId).forEach(a => {
      a.eventTitle = evt.title;
      a.eventCategory = evt.category;
      a.eventDate = evt.eventDate;
      a.eventPay = evt.payPerPerson;
      a.eventArea = evt.area;
    });

    saveDB(db);
    res.json({ message: 'Event updated successfully!', event: evt });
  });

  // DELETE EVENT (Handler)
  app.delete('/api/events/:id', async (req, res) => {
    const eventId = req.params.id;
    const { handlerId } = req.body || {};
    const db = readDB();

    const evtIndex = db.events.findIndex(e => e.id === eventId);
    if (evtIndex === -1) return res.status(404).json({ error: 'Event not found' });

    const evt = db.events[evtIndex];
    if (handlerId && evt.handlerId !== handlerId) {
      const user = db.users.find(u => u.id === handlerId);
      if (user && user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to delete this event.' });
      }
    }

    // Delete in Supabase
    try {
      await supabase.from('events').delete().eq('id', eventId);
    } catch (err) {
      console.log('Supabase event delete note:', err);
    }

    db.events.splice(evtIndex, 1);

    // Notify applied crew members
    const affectedApps = db.applications.filter(a => a.eventId === eventId);
    affectedApps.forEach(async (app) => {
      const notif = {
        id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        userId: app.crewId,
        title: '⚠️ Event Removed / Cancelled',
        message: `The event "${evt.title}" on ${evt.eventDate} was removed by the organizer.`,
        type: 'event_alert',
        read: false,
        createdAt: new Date().toISOString()
      };
      db.notifications.unshift(notif);
      try { await supabase.from('notifications').insert([notif]); } catch (e) {}
    });

    // Remove applications for this deleted event
    db.applications = db.applications.filter(a => a.eventId !== eventId);

    saveDB(db);
    res.json({ message: 'Event deleted successfully.' });
  });

  // UPDATE EVENT STATUS
  app.patch('/api/events/:id/status', async (req, res) => {
    const { status } = req.body;
    const db = readDB();
    const evt = db.events.find(e => e.id === req.params.id);
    if (!evt) return res.status(404).json({ error: 'Event not found' });

    evt.status = status;
    try {
      await supabase.from('events').update({ status }).eq('id', req.params.id);
    } catch (err) {
      console.log('Supabase event status update note:', err);
    }

    saveDB(db);
    res.json({ message: 'Event status updated', event: evt });
  });

  // APPLY FOR EVENT (Crew)
  app.post('/api/events/:id/apply', async (req, res) => {
    const { crewId } = req.body;
    const eventId = req.params.id;

    if (!crewId) return res.status(400).json({ error: 'Crew user ID is required.' });

    const db = readDB();
    const crew = db.users.find(u => u.id === crewId);
    if (!crew) return res.status(404).json({ error: 'Crew member not found.' });

    const evt = db.events.find(e => e.id === eventId);
    if (!evt) return res.status(404).json({ error: 'Event not found.' });

    if (evt.status !== 'active') {
      return res.status(400).json({ error: 'This event is no longer accepting applications.' });
    }

    const existingApp = db.applications.find(a => a.eventId === eventId && a.crewId === crewId);
    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied for this event.' });
    }

    // Check crew subscription status
    const sub = db.subscriptions.find(s => s.userId === crewId && s.status === 'active');
    if (!sub || new Date(sub.expiryDate) < new Date()) {
      return res.status(403).json({ error: 'Your Crew Pass subscription or trial has expired. Please renew your plan to apply.' });
    }

    // Calculate age from DOB if present
    let age = 22;
    if (crew.dob) {
      const birthYear = new Date(crew.dob).getFullYear();
      if (!isNaN(birthYear)) age = new Date().getFullYear() - birthYear;
    }

    const newApp = {
      id: 'app-' + Date.now(),
      eventId: evt.id,
      eventTitle: evt.title,
      eventCategory: evt.category,
      eventDate: evt.eventDate,
      eventPay: evt.payPerPerson,
      eventArea: evt.area,
      crewId: crew.id,
      crewName: crew.name,
      crewAge: age,
      crewPhone: crew.phone,
      crewCity: crew.city || 'Surat',
      crewArea: crew.area || 'Surat',
      crewSkills: crew.skills || ['General Event Staff'],
      crewExperience: crew.experience || '1 year',
      crewRating: crew.rating || 5.0,
      idVerified: crew.idVerificationStatus === 'verified',
      status: 'pending',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Insert into Supabase
    try {
      await supabase.from('applications').insert([newApp]);
    } catch (err) {
      console.log('Supabase application insert note:', err);
    }

    db.applications.unshift(newApp);

    // Notify Event Handler
    const notif = {
      id: 'notif-' + Date.now(),
      userId: evt.handlerId,
      title: '📥 New Crew Application Received',
      message: `${crew.name} applied for "${evt.title}". Review their profile now.`,
      type: 'application_update',
      read: false,
      createdAt: new Date().toISOString(),
      eventId: evt.id
    };
    db.notifications.unshift(notif);
    try { await supabase.from('notifications').insert([notif]); } catch (e) {}

    saveDB(db);
    res.json({ message: 'Application submitted successfully!', application: newApp });
  });

  // GET APPLICATIONS FOR AN EVENT (Handler)
  app.get('/api/events/:id/applications', async (req, res) => {
    // Check Supabase first
    try {
      const { data, error } = await supabase.from('applications').select('*').eq('eventId', req.params.id);
      if (!error && Array.isArray(data) && data.length > 0) {
        return res.json(data);
      }
    } catch (err) {
      console.log('Supabase event apps fetch note:', err);
    }

    const db = readDB();
    const apps = db.applications.filter(a => a.eventId === req.params.id);
    res.json(apps);
  });

  // GET MY APPLICATIONS (Crew)
  app.get('/api/applications/my', async (req, res) => {
    const { crewId } = req.query;
    if (!crewId) return res.status(400).json({ error: 'crewId is required' });

    // Check Supabase first
    try {
      const { data, error } = await supabase.from('applications').select('*').eq('crewId', crewId);
      if (!error && Array.isArray(data) && data.length > 0) {
        return res.json(data);
      }
    } catch (err) {
      console.log('Supabase my apps fetch note:', err);
    }

    const db = readDB();
    const apps = db.applications.filter(a => a.crewId === crewId);
    res.json(apps);
  });

  // UPDATE APPLICATION STATUS (Approve / Reject)
  app.patch('/api/applications/:id/status', async (req, res) => {
    const { status } = req.body; // 'approved' | 'rejected' | 'completed'
    if (!['approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const db = readDB();
    const appRecord = db.applications.find(a => a.id === req.params.id);
    if (!appRecord) return res.status(404).json({ error: 'Application not found.' });

    appRecord.status = status;
    appRecord.updatedAt = new Date().toISOString();

    // Update in Supabase
    try {
      await supabase.from('applications').update({ status, updatedAt: appRecord.updatedAt }).eq('id', req.params.id);
    } catch (err) {
      console.log('Supabase app status update note:', err);
    }

    const evt = db.events.find(e => e.id === appRecord.eventId);
    if (evt) {
      if (status === 'approved') {
        const approvedCount = db.applications.filter(a => a.eventId === evt.id && a.status === 'approved').length;
        evt.approvedCrewCount = approvedCount;
        if (approvedCount >= evt.totalCrewNeeded) {
          evt.status = 'crew_full';
        }
      } else if (status === 'rejected') {
        const approvedCount = db.applications.filter(a => a.eventId === evt.id && a.status === 'approved').length;
        evt.approvedCrewCount = approvedCount;
        if (evt.status === 'crew_full' && approvedCount < evt.totalCrewNeeded) {
          evt.status = 'active';
        }
      }
    }

    // Notify Crew
    const statusText = status === 'approved' ? '🎉 Congratulations! You have been Selected' : status === 'rejected' ? 'Application Update' : 'Event Completed';
    const statusMsg = status === 'approved' 
      ? `You have been selected for "${appRecord.eventTitle}" on ${appRecord.eventDate}! Click to view event details and contact information.`
      : `Your application for "${appRecord.eventTitle}" was not selected this time. Keep applying for other nearby events!`;

    const notif = {
      id: 'notif-' + Date.now(),
      userId: appRecord.crewId,
      title: statusText,
      message: statusMsg,
      type: 'application_update',
      read: false,
      createdAt: new Date().toISOString(),
      eventId: appRecord.eventId
    };

    db.notifications.unshift(notif);
    try { await supabase.from('notifications').insert([notif]); } catch (e) {}

    saveDB(db);
    res.json({ message: `Application ${status}!`, application: appRecord, event: evt });
  });

  // GET NOTIFICATIONS
  app.get('/api/notifications', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.json([]);

    // Try Supabase first
    try {
      const { data, error } = await supabase.from('notifications').select('*').eq('userId', userId);
      if (!error && Array.isArray(data) && data.length > 0) {
        return res.json(data);
      }
    } catch (err) {
      console.log('Supabase notifications fetch note:', err);
    }

    const db: any = readDB();
    if (!db.notifications || !Array.isArray(db.notifications)) db.notifications = [];
    const notifs = db.notifications.filter((n: any) => n && n.userId === userId);
    res.json(notifs || []);
  });

  // MARK NOTIFICATION READ
  app.patch('/api/notifications/:id/read', async (req, res) => {
    const db = readDB();
    const notif = db.notifications.find(n => n.id === req.params.id);
    if (notif) notif.read = true;
    try {
      await supabase.from('notifications').update({ read: true }).eq('id', req.params.id);
    } catch (err) {}
    saveDB(db);
    res.json({ success: true });
  });

  // GET PLANS
  app.get('/api/subscriptions/plans', (req, res) => {
    const { role } = req.query;
    const db = readDB();
    let plans = db.subscriptionPlans.filter(p => p.isActive);
    if (role) {
      plans = plans.filter(p => p.targetRole === role);
    }
    res.json(plans);
  });

  // SUBSCRIBE
  app.post('/api/subscriptions/subscribe', (req, res) => {
    const { userId, planId } = req.body;
    if (!userId || !planId) return res.status(400).json({ error: 'userId and planId required' });

    const db = readDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const plan = db.subscriptionPlans.find(p => p.id === planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    // Mark previous active subs expired
    db.subscriptions.filter(s => s.userId === userId).forEach(s => s.status = 'expired');

    const durationDays = plan.durationMonths * 30;
    const newSub = {
      id: 'sub-' + Date.now(),
      userId,
      planId: plan.id,
      planName: plan.name,
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      isTrial: plan.priceInr === 0
    };

    db.subscriptions.push(newSub);
    saveDB(db);

    res.json({ message: 'Subscription updated successfully!', subscription: newSub });
  });

  // ADMIN DASHBOARD METRICS
  app.get('/api/admin/dashboard', (req, res) => {
    const db = readDB();
    const handlers = db.users.filter(u => u.role === 'handler');
    const crewMembers = db.users.filter(u => u.role === 'crew');
    const totalHandlers = handlers.length;
    const totalCrew = crewMembers.length;
    const totalEvents = db.events.length;
    const activeEvents = db.events.filter(e => e.status === 'active').length;
    const totalApplications = db.applications.length;
    const activeSubs = db.subscriptions.filter(s => s.status === 'active').length;
    const pendingVerifications = db.users.filter(u => u.idVerificationStatus === 'pending').length;
    const verifiedCrew = db.users.filter(u => u.role === 'crew' && u.idVerified).length;

    res.json({
      stats: {
        totalUsers: db.users.filter(u => u.role !== 'admin').length,
        totalCrew,
        totalHandlers,
        totalEvents,
        activeEvents,
        totalApplications,
        verifiedCrew,
        activeSubs,
        pendingVerifications,
        totalLogins: (db.loginLogs || []).length,
        totalWebsiteClicks: db.totalWebsiteClicks || 0
      },
      loginLogs: db.loginLogs || [],
      crewMembers: crewMembers.map(({ password, ...u }) => u),
      handlers: handlers.map(({ password, ...u }) => u),
      events: db.events,
      recentUsers: db.users.filter(u => u.role !== 'admin').slice(-5).reverse(),
      recentEvents: db.events.slice(-5).reverse()
    });
  });

  // ADMIN GET USERS
  app.get('/api/admin/users', (req, res) => {
    const { role, verificationStatus } = req.query;
    const db = readDB();
    let users = db.users.filter(u => u.role !== 'admin');

    if (role) {
      users = users.filter(u => u.role === role);
    }
    if (verificationStatus) {
      users = users.filter(u => u.idVerificationStatus === verificationStatus);
    }

    // Omit passwords
    const safeUsers = users.map(({ password, ...u }) => u);
    res.json(safeUsers);
  });

  // ADMIN UPDATE USER STATUS / ID VERIFY
  app.patch('/api/admin/users/:id', (req, res) => {
    const { status, idVerificationStatus, idRejectionReason, adminEmail } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (status) user.status = status;
    if (idVerificationStatus) {
      user.idVerificationStatus = idVerificationStatus;
      if (idRejectionReason) user.idRejectionReason = idRejectionReason;

      // Log admin audit
      db.adminLogs.unshift({
        id: 'audit-' + Date.now(),
        adminId: 'admin-1',
        adminEmail: adminEmail || 'admin@crewconnect.in',
        action: `ID Verification set to ${idVerificationStatus} for user ${user.name} (${user.id})`,
        targetUserId: user.id,
        timestamp: new Date().toISOString()
      });

      // Notify user
      const msg = idVerificationStatus === 'verified'
        ? '✅ Great news! Your Identity Document has been verified. You now have a Verified Badge on your profile.'
        : `❌ Your ID document was not approved. Reason: ${idRejectionReason || 'Document unclear or invalid'}. Please re-upload a clear photo.`;

      db.notifications.unshift({
        id: 'notif-' + Date.now(),
        userId: user.id,
        title: idVerificationStatus === 'verified' ? 'Identity Verified! ✅' : 'ID Verification Notice',
        message: msg,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    saveDB(db);
    const { password: _, ...safeUser } = user;
    res.json({ message: 'User updated successfully', user: safeUser });
  });

  // ADMIN GET/DELETE EVENTS
  app.get('/api/admin/events', (req, res) => {
    const db = readDB();
    res.json(db.events);
  });

  app.delete('/api/admin/events/:id', (req, res) => {
    const db = readDB();
    const idx = db.events.findIndex(e => e.id === req.params.id);
    if (idx !== -1) {
      db.events.splice(idx, 1);
      saveDB(db);
      return res.json({ message: 'Event removed by admin.' });
    }
    res.status(404).json({ error: 'Event not found' });
  });

  // ADMIN AUDIT LOGS
  app.get('/api/admin/audit-logs', (req, res) => {
    const db = readDB();
    res.json(db.adminLogs);
  });

  // ADMIN USER LOGS & LOGIN HISTORY
  app.get('/api/admin/login-logs', (req, res) => {
    const db = readDB();
    res.json(db.loginLogs || []);
  });

  // UPDATE USER PROFILE (Avatar Photo, Bio, Details, Gender)
  app.patch('/api/users/:id/profile', (req, res) => {
    const userId = req.params.id;
    const { name, phone, avatarUrl, bio, companyName, address, state, city, area, skills, experience, dob, gender } = req.body;
    const db = readDB();

    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (bio !== undefined) user.bio = bio;
    if (companyName !== undefined) user.companyName = companyName;
    if (address !== undefined) user.address = address;
    if (state !== undefined) user.state = state;
    if (city !== undefined) user.city = city;
    if (area !== undefined) user.area = area;
    if (gender !== undefined) user.gender = gender;
    if (skills !== undefined) user.skills = Array.isArray(skills) ? skills : [skills];
    if (experience !== undefined) user.experience = experience;
    if (dob !== undefined) user.dob = dob;

    // Update in community posts if present
    if (db.posts) {
      db.posts.filter((p: any) => p.authorId === userId).forEach((p: any) => {
        if (name) p.authorName = name;
        if (avatarUrl !== undefined) p.authorAvatar = avatarUrl;
      });
    }

    recordUserActivityLog(db, user, 'Updated Profile & Information', req);
    saveDB(db);

    const { password: _, ...cleanUser } = user;
    res.json({ message: 'Profile updated successfully!', user: cleanUser });
  });

  // DELETE USER ACCOUNT
  app.delete('/api/users/:id', async (req, res) => {
    const userId = req.params.id;
    const db = readDB();

    const userIdx = db.users.findIndex(u => u.id === userId);
    if (userIdx === -1) {
      return res.status(404).json({ error: 'User account not found' });
    }

    const user = db.users[userIdx];

    // Remove user
    db.users.splice(userIdx, 1);

    // Remove applications created by this crew
    db.applications = (db.applications || []).filter(a => a.crewId !== userId);

    // Remove subscriptions
    db.subscriptions = (db.subscriptions || []).filter(s => s.userId !== userId);

    // Remove notifications
    db.notifications = (db.notifications || []).filter(n => n.userId !== userId);

    // If handler, mark their events or remove them
    if (user.role === 'handler') {
      db.events = (db.events || []).filter(e => e.handlerId !== userId);
    }

    // Try Supabase delete if applicable
    try {
      await supabase.from('users').delete().eq('id', userId);
    } catch (e) {
      console.log('Supabase user delete note:', e);
    }

    recordUserActivityLog(db, user, 'User Permanently Deleted Account', req);
    saveDB(db);

    res.json({ message: 'Account and associated data deleted permanently.' });
  });

  // COMMUNITY / EXPERIENCE POSTS (Instagram-like Feed)
  app.get('/api/posts', (req, res) => {
    const db = readDB();
    res.json(db.posts || []);
  });

  app.post('/api/posts', (req, res) => {
    const { authorId, content, imageUrl, eventTag, experienceType, city } = req.body;
    if (!authorId || !content) {
      return res.status(400).json({ error: 'Author ID and content are required.' });
    }
    const db = readDB();
    const user = db.users.find(u => u.id === authorId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newPost = {
      id: 'post-' + Date.now(),
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatarUrl || '',
      authorCompany: user.companyName || '',
      content,
      imageUrl: imageUrl || '',
      eventTag: eventTag || '',
      experienceType: experienceType || 'Event Experience',
      city: city || user.city || 'Surat',
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    if (!db.posts) db.posts = [];
    db.posts.unshift(newPost);

    recordUserActivityLog(db, user, 'Shared Community Post / Experience Story', req);
    saveDB(db);
    res.json({ message: 'Post shared successfully!', post: newPost });
  });

  app.post('/api/posts/:id/like', (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const db = readDB();
    if (!db.posts) db.posts = [];
    const post = db.posts.find((p: any) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (!Array.isArray(post.likes)) post.likes = [];

    const idx = post.likes.indexOf(userId);
    if (idx === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(idx, 1);
    }

    saveDB(db);
    res.json({ success: true, likes: post.likes });
  });

  app.post('/api/posts/:id/comment', (req, res) => {
    const { userId, text } = req.body;
    if (!userId || !text) return res.status(400).json({ error: 'userId and text are required' });

    const db = readDB();
    if (!db.posts) db.posts = [];
    const post = db.posts.find((p: any) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!Array.isArray(post.comments)) post.comments = [];

    const newComment = {
      id: 'comm-' + Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatarUrl || '',
      userRole: user.role,
      text,
      createdAt: new Date().toISOString()
    };

    post.comments.push(newComment);
    saveDB(db);
    res.json({ message: 'Comment added', comment: newComment, comments: post.comments });
  });

  app.delete('/api/posts/:id', (req, res) => {
    const { userId } = req.body || {};
    const db = readDB();
    if (!db.posts) db.posts = [];

    const postIndex = db.posts.findIndex((p: any) => p.id === req.params.id);
    if (postIndex === -1) return res.status(404).json({ error: 'Post not found' });

    const post = db.posts[postIndex];
    if (userId && post.authorId !== userId) {
      const user = db.users.find(u => u.id === userId);
      if (user && user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to delete this post.' });
      }
    }

    db.posts.splice(postIndex, 1);
    saveDB(db);
    res.json({ message: 'Post deleted successfully.' });
  });

  // --- CREW VERIFIED PROFILE & REVIEWS ENDPOINTS ---

  // GET VERIFIED CREW PROFILE (Includes badges, stats, previous events, no-show history, reviews)
  app.get('/api/crew/:id/profile', (req, res) => {
    const crewId = req.params.id;
    const db = readDB();
    const user = db.users.find(u => u.id === crewId);
    if (!user) return res.status(404).json({ error: 'Crew member not found.' });

    if (!db.reviews) db.reviews = [];

    // Get all reviews for this crew
    const crewReviews = db.reviews.filter((r: any) => r.crewId === crewId);

    // Get all applications for this crew
    const crewApps = db.applications.filter((a: any) => a.crewId === crewId);
    const approvedOrCompletedApps = crewApps.filter((a: any) => a.status === 'approved' || a.status === 'completed');

    // Calculate completed events & no-show count
    const completedCount = user.completedEventsCount !== undefined
      ? user.completedEventsCount
      : crewApps.filter((a: any) => a.status === 'completed').length;

    const noShowCount = user.noShowCount || crewReviews.filter((r: any) => r.isNoShow).length || 0;
    
    // Reliability Score calculation
    const totalAssigned = Math.max(1, approvedOrCompletedApps.length + noShowCount);
    const reliabilityScore = Math.max(0, Math.round(((totalAssigned - noShowCount) / totalAssigned) * 100));

    // Calculate real rating
    let averageRating = user.rating || 5.0;
    if (crewReviews.length > 0) {
      const validRatings = crewReviews.filter((r: any) => !r.isNoShow && r.rating > 0);
      if (validRatings.length > 0) {
        const sum = validRatings.reduce((acc: number, cur: any) => acc + cur.rating, 0);
        averageRating = Math.round((sum / validRatings.length) * 10) / 10;
      }
    }

    const previousEvents = approvedOrCompletedApps.map((a: any) => {
      const rev = crewReviews.find((r: any) => r.eventId === a.eventId);
      return {
        eventId: a.eventId,
        eventTitle: a.eventTitle,
        eventCategory: a.eventCategory || 'Event',
        eventDate: a.eventDate,
        eventArea: a.eventArea,
        eventPay: a.eventPay,
        status: a.status,
        review: rev || undefined
      };
    });

    const { password: _, ...cleanUser } = user;

    const profile = {
      user: {
        ...cleanUser,
        rating: averageRating,
        reviewCount: crewReviews.length,
        completedEventsCount: completedCount,
        noShowCount: noShowCount
      },
      stats: {
        rating: averageRating,
        reviewCount: crewReviews.length,
        completedEventsCount: completedCount,
        noShowCount: noShowCount,
        reliabilityScore: reliabilityScore,
        mobileVerified: !!user.mobileVerified,
        idVerified: user.idVerificationStatus === 'verified'
      },
      skills: user.skills || ['Guest Hospitality', 'VIP Service', 'Registration Desk'],
      experience: user.experience || 'Experienced Event Staff (Surat)',
      previousEvents,
      reviews: crewReviews
    };

    res.json(profile);
  });

  // SUBMIT REVIEW & RATING FOR CREW (By Organizer / Handler)
  app.post('/api/reviews', (req, res) => {
    const {
      handlerId,
      crewId,
      eventId,
      rating,
      punctualityRating,
      workQualityRating,
      comment,
      isNoShow
    } = req.body;

    if (!handlerId || !crewId || !eventId) {
      return res.status(400).json({ error: 'Handler ID, Crew ID, and Event ID are required.' });
    }

    const db = readDB();
    const handler = db.users.find(u => u.id === handlerId);
    if (!handler) return res.status(404).json({ error: 'Organizer not found.' });

    const crew = db.users.find(u => u.id === crewId);
    if (!crew) return res.status(404).json({ error: 'Crew member not found.' });

    const event = db.events.find(e => e.id === eventId);
    const eventTitle = event ? event.title : 'Event';
    const eventDate = event ? event.eventDate : new Date().toISOString().split('T')[0];

    if (!db.reviews) db.reviews = [];

    // Check if review already exists for this event+crew
    const existingIndex = db.reviews.findIndex((r: any) => r.crewId === crewId && r.eventId === eventId && r.handlerId === handlerId);

    const reviewId = existingIndex >= 0 ? db.reviews[existingIndex].id : 'rev-' + Date.now();
    const reviewData = {
      id: reviewId,
      crewId,
      crewName: crew.name,
      handlerId,
      handlerName: handler.name,
      handlerCompany: handler.companyName || handler.name,
      eventId,
      eventTitle,
      eventDate,
      rating: Number(rating) || 5,
      punctualityRating: punctualityRating ? Number(punctualityRating) : undefined,
      workQualityRating: workQualityRating ? Number(workQualityRating) : undefined,
      comment: comment || (isNoShow ? 'Marked as No-Show by Organizer' : 'Great work and timely attendance.'),
      isNoShow: !!isNoShow,
      createdAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      db.reviews[existingIndex] = reviewData;
    } else {
      db.reviews.unshift(reviewData);
    }

    // Update Crew stats in DB
    const allCrewReviews = db.reviews.filter((r: any) => r.crewId === crewId);
    const validRatings = allCrewReviews.filter((r: any) => !r.isNoShow && r.rating > 0);
    if (validRatings.length > 0) {
      const sum = validRatings.reduce((acc: number, cur: any) => acc + cur.rating, 0);
      crew.rating = Math.round((sum / validRatings.length) * 10) / 10;
    }
    crew.reviewCount = allCrewReviews.length;

    if (isNoShow) {
      crew.noShowCount = (crew.noShowCount || 0) + 1;
    } else {
      crew.completedEventsCount = (crew.completedEventsCount || 0) + 1;
    }

    // Also update application status to 'completed' if not already
    const appRecord = db.applications.find(a => a.eventId === eventId && a.crewId === crewId);
    if (appRecord) {
      appRecord.status = isNoShow ? 'rejected' : 'completed';
      appRecord.updatedAt = new Date().toISOString();
    }

    // Notify Crew member
    db.notifications.unshift({
      id: 'notif-' + Date.now(),
      userId: crewId,
      title: isNoShow ? '⚠️ Event Attendance Status Update' : `⭐ You Received a ${rating}-Star Review!`,
      message: isNoShow 
        ? `${handler.name} reported a no-show for "${eventTitle}". Please ensure 100% attendance for future events.`
        : `${handler.name} reviewed your work on "${eventTitle}": "${comment || 'Excellent work!'}"`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString(),
      eventId: eventId
    });

    recordUserActivityLog(db, handler, `Submitted Rating & Review (${rating} ⭐) for crew ${crew.name}`, req);
    saveDB(db);

    res.json({ message: 'Review submitted successfully!', review: reviewData });
  });

  // GET REVIEWS FOR A SPECIFIC CREW
  app.get('/api/reviews/crew/:crewId', async (req, res) => {
    // Try Supabase first
    try {
      const { data, error } = await supabase.from('reviews').select('*').eq('crewId', req.params.crewId);
      if (!error && Array.isArray(data) && data.length > 0) {
        return res.json(data);
      }
    } catch (err) {
      console.log('Supabase reviews fetch note:', err);
    }

    const db = readDB();
    if (!db.reviews) db.reviews = [];
    const reviews = db.reviews.filter((r: any) => r.crewId === req.params.crewId);
    res.json(reviews);
  });

  // ==========================================
  // EVENT ORGANIZERS DIRECTORY & BOOKING APIS
  // ==========================================

  // GET ORGANIZERS DIRECTORY (Categorized, Reviewed, Filterable)
  app.get('/api/organizers/directory', async (req, res) => {
    const { city, category, search, minRating, sort } = req.query;

    // Check Supabase first
    let supabaseOrganizers: any[] | null = null;
    try {
      const { data, error } = await supabase.from('organizers').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        supabaseOrganizers = data;
      }
    } catch (err) {
      console.log('Supabase organizers fetch note:', err);
    }

    const db: any = readDB();
    if (!db.organizers) db.organizers = [];
    if (!db.organizerReviews) db.organizerReviews = [];

    // Merge registered handlers with company names into organizers list
    const registeredHandlers = (db.users || [])
      .filter((u: any) => (u.role === 'handler' || u.role === 'admin') && u.companyName)
      .map((h: any) => {
        const handlerEvents = (db.events || []).filter((e: any) => e.handlerId === h.id);
        const categories = handlerEvents.length > 0
          ? Array.from(new Set(handlerEvents.map((e: any) => e.category as any)))
          : ['Wedding', 'Corporate', 'Full Production'];
        
        return {
          id: h.id,
          name: h.name,
          companyName: h.companyName || h.name,
          avatarUrl: h.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
          bio: `${h.companyName} is a verified event management company in ${h.city || 'Surat'}.`,
          city: h.city || 'Surat',
          area: h.area || 'Surat Central',
          address: h.address || 'Surat, Gujarat',
          phone: h.phone,
          email: h.email,
          categories: categories.length > 0 ? categories : ['Wedding', 'Corporate'],
          rating: 4.8,
          reviewCount: (db.organizerReviews || []).filter((r: any) => r.organizerId === h.id).length,
          completedEventsCount: handlerEvents.length || 0,
          startingPriceInr: 25000,
          verified: !!h.mobileVerified,
          servicesOffered: ['Event Staffing & Crew', 'Stage & Sound Setup', 'Guest Coordination'],
          photos: []
        };
      });

    // Combine base organizers and registered handlers
    const allOrgMap = new Map<string, any>();
    if (supabaseOrganizers && supabaseOrganizers.length > 0) {
      supabaseOrganizers.forEach(o => allOrgMap.set(o.id, o));
    } else {
      (db.organizers || []).forEach((o: any) => allOrgMap.set(o.id, o));
    }
    registeredHandlers.forEach((h: any) => {
      if (!allOrgMap.has(h.id)) allOrgMap.set(h.id, h);
    });

    let list = Array.from(allOrgMap.values()).map((org: any) => ({
      ...org,
      city: org.city || 'Surat',
      area: org.area || 'Surat Central',
      companyName: org.companyName || org.name || 'Event Management',
      name: org.name || org.companyName || 'Organizer',
      bio: org.bio || 'Verified event organizer',
      categories: Array.isArray(org.categories) ? org.categories : ['Wedding', 'Corporate'],
      servicesOffered: Array.isArray(org.servicesOffered) ? org.servicesOffered : ['Event Management'],
      startingPriceInr: org.startingPriceInr || (typeof org.startingPrice === 'number' ? org.startingPrice : 20000),
      rating: typeof org.rating === 'number' ? org.rating : 4.8,
      reviewCount: typeof org.reviewCount === 'number' ? org.reviewCount : 0
    }));

    // Filter by city
    if (city) {
      const c = (city as string).toLowerCase();
      list = list.filter(o => (o.city || '').toLowerCase() === c);
    }

    // Filter by category
    if (category && category !== 'All' && category !== 'all') {
      const cat = (category as string).toLowerCase();
      list = list.filter(o =>
        Array.isArray(o.categories) && o.categories.some((c: string) => String(c).toLowerCase().includes(cat) || cat.includes(String(c).toLowerCase()))
      );
    }

    // Filter by search query
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(o =>
        (o.companyName || '').toLowerCase().includes(q) ||
        (o.name || '').toLowerCase().includes(q) ||
        (o.area || '').toLowerCase().includes(q) ||
        (o.bio || '').toLowerCase().includes(q) ||
        (Array.isArray(o.servicesOffered) && o.servicesOffered.some((s: string) => String(s).toLowerCase().includes(q)))
      );
    }

    // Filter by minimum rating
    if (minRating) {
      list = list.filter(o => (o.rating || 0) >= Number(minRating));
    }

    // Attach latest reviews and compute current ratings
    list = list.map(org => {
      const orgRevs = (db.organizerReviews || []).filter((r: any) => r.organizerId === org.id);
      let calculatedRating = org.rating;
      if (orgRevs.length > 0) {
        const sum = orgRevs.reduce((acc: number, r: any) => acc + (r.rating || 5), 0);
        calculatedRating = Math.round((sum / orgRevs.length) * 10) / 10;
      }
      return {
        ...org,
        rating: calculatedRating,
        reviewCount: Math.max(org.reviewCount || 0, orgRevs.length),
        reviews: orgRevs.slice(0, 3)
      };
    });

    // Sorting
    if (sort === 'rating_high') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'reviews_high') {
      list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else if (sort === 'price_low') {
      list.sort((a, b) => (a.startingPriceInr || 0) - (b.startingPriceInr || 0));
    } else if (sort === 'price_high') {
      list.sort((a, b) => (b.startingPriceInr || 0) - (a.startingPriceInr || 0));
    } else {
      // Default: featured first, then highest rating
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.rating || 0) - (a.rating || 0));
    }

    res.json(list);
  });

  // GET SINGLE ORGANIZER DETAILS & FULL REVIEWS
  app.get('/api/organizers/:id', async (req, res) => {
    const orgId = req.params.id;

    // Try Supabase first
    try {
      const { data, error } = await supabase.from('organizers').select('*').eq('id', orgId).maybeSingle();
      if (!error && data) {
        return res.json({
          ...data,
          categories: Array.isArray(data.categories) ? data.categories : ['Wedding', 'Corporate'],
          servicesOffered: Array.isArray(data.servicesOffered) ? data.servicesOffered : ['Event Management'],
          startingPriceInr: data.startingPriceInr || (typeof data.startingPrice === 'number' ? data.startingPrice : 20000),
          rating: typeof data.rating === 'number' ? data.rating : 4.8,
          reviewCount: typeof data.reviewCount === 'number' ? data.reviewCount : 0
        });
      }
    } catch (err) {}

    const db: any = readDB();
    if (!db.organizers) db.organizers = [];
    if (!db.organizerReviews) db.organizerReviews = [];

    let org = (db.organizers || []).find((o: any) => o.id === orgId);
    if (!org) {
      const handler = (db.users || []).find((u: any) => u.id === orgId && (u.role === 'handler' || u.role === 'admin'));
      if (handler) {
        const handlerEvents = (db.events || []).filter((e: any) => e.handlerId === handler.id);
        org = {
          id: handler.id,
          name: handler.name,
          companyName: handler.companyName || handler.name,
          avatarUrl: handler.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
          bio: `${handler.companyName || handler.name} is a verified event management company in ${handler.city || 'Surat'}.`,
          city: handler.city || 'Surat',
          area: handler.area || 'Surat',
          address: handler.address || 'Surat, Gujarat',
          phone: handler.phone,
          email: handler.email,
          categories: ['Wedding', 'Corporate', 'Full Production'],
          rating: 4.8,
          reviewCount: 0,
          completedEventsCount: handlerEvents.length || 0,
          startingPriceInr: 25000,
          verified: !!handler.mobileVerified,
          servicesOffered: ['Event Staffing & Crew', 'Stage & Sound Setup', 'Guest Coordination'],
          photos: []
        };
      }
    }

    if (!org) return res.status(404).json({ error: 'Organizer not found' });

    const reviews = (db.organizerReviews || []).filter((r: any) => r.organizerId === orgId);
    const pastEvents = (db.events || []).filter((e: any) => e.handlerId === orgId);

    // Calculate rating breakdowns
    let calculatedRating = org.rating || 4.8;
    let avgDecor = 4.9;
    let avgCoordination = 4.8;
    let avgPunctuality = 4.9;

    if (reviews.length > 0) {
      const sum = reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0);
      calculatedRating = Math.round((sum / reviews.length) * 10) / 10;

      const decors = reviews.filter((r: any) => r.decorRating).map((r: any) => r.decorRating);
      if (decors.length > 0) avgDecor = Math.round((decors.reduce((a: number, b: number) => a + b, 0) / decors.length) * 10) / 10;

      const coords = reviews.filter((r: any) => r.coordinationRating).map((r: any) => r.coordinationRating);
      if (coords.length > 0) avgCoordination = Math.round((coords.reduce((a: number, b: number) => a + b, 0) / coords.length) * 10) / 10;

      const puncts = reviews.filter((r: any) => r.punctualityRating).map((r: any) => r.punctualityRating);
      if (puncts.length > 0) avgPunctuality = Math.round((puncts.reduce((a: number, b: number) => a + b, 0) / puncts.length) * 10) / 10;
    }

    res.json({
      ...org,
      categories: Array.isArray(org.categories) ? org.categories : ['Wedding', 'Corporate'],
      servicesOffered: Array.isArray(org.servicesOffered) ? org.servicesOffered : ['Event Management'],
      startingPriceInr: org.startingPriceInr || (typeof org.startingPrice === 'number' ? org.startingPrice : 20000),
      rating: calculatedRating,
      reviewCount: Math.max(org.reviewCount || 0, reviews.length),
      avgDecor,
      avgCoordination,
      avgPunctuality,
      reviews,
      pastEvents
    });
  });

  // SUBMIT REVIEW & RATING FOR AN ORGANIZER (By Client)
  app.post('/api/organizers/:id/reviews', async (req, res) => {
    const orgId = req.params.id;
    const {
      clientId,
      clientName,
      clientCity,
      eventTitle,
      eventCategory,
      eventDate,
      rating,
      decorRating,
      coordinationRating,
      punctualityRating,
      comment,
      praiseTags
    } = req.body;

    if (!clientName || !eventTitle || !rating || !comment) {
      return res.status(400).json({ error: 'Client name, event title, rating, and feedback comment are required.' });
    }

    const db = readDB();
    if (!db.organizerReviews) db.organizerReviews = [];

    const newReview = {
      id: 'rev-org-' + Date.now(),
      organizerId: orgId,
      clientId: clientId || 'guest-' + Date.now(),
      clientName,
      clientCity: clientCity || 'Surat',
      eventTitle,
      eventCategory: eventCategory || 'Wedding',
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      rating: Number(rating) || 5,
      decorRating: decorRating ? Number(decorRating) : 5,
      coordinationRating: coordinationRating ? Number(coordinationRating) : 5,
      punctualityRating: punctualityRating ? Number(punctualityRating) : 5,
      comment,
      praiseTags: Array.isArray(praiseTags) ? praiseTags : ['Highly Recommended', 'Great Service'],
      createdAt: new Date().toISOString()
    };

    // Save to Supabase
    try {
      await supabase.from('organizer_reviews').insert([newReview]);
    } catch (err) {
      console.log('Supabase organizer review insert note:', err);
    }

    db.organizerReviews.unshift(newReview);

    // Update organizer rating in db.organizers if exists
    if (db.organizers) {
      const org = db.organizers.find(o => o.id === orgId);
      if (org) {
        const allRevs = db.organizerReviews.filter((r: any) => r.organizerId === orgId);
        const sum = allRevs.reduce((acc: number, r: any) => acc + (r.rating || 5), 0);
        org.rating = Math.round((sum / allRevs.length) * 10) / 10;
        org.reviewCount = allRevs.length;
      }
    }

    // Send notification to organizer if handler exists
    const handler = db.users.find(u => u.id === orgId);
    if (handler) {
      const notif = {
        id: 'notif-' + Date.now(),
        userId: handler.id,
        title: `⭐ New ${rating}-Star Client Review!`,
        message: `${clientName} reviewed your event "${eventTitle}": "${comment.slice(0, 80)}..."`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString()
      };
      db.notifications.unshift(notif);
      try { await supabase.from('notifications').insert([notif]); } catch (e) {}
    }

    recordUserActivityLog(db, { name: clientName, email: 'client' }, `Submitted Client Review for Organizer ${orgId} (${rating} ⭐)`, req);
    saveDB(db);

    res.json({ message: 'Review submitted successfully!', review: newReview });
  });

  // SUBMIT EVENT BOOKING INQUIRY (Client books organizer)
  app.post('/api/event-bookings', async (req, res) => {
    const {
      organizerId,
      organizerName,
      organizerCompany,
      clientId,
      clientName,
      clientPhone,
      clientEmail,
      clientCity,
      eventName,
      category,
      eventDate,
      eventTime,
      venueArea,
      guestCount,
      budgetRange,
      servicesRequested,
      specialNotes
    } = req.body;

    if (!organizerId || !clientName || !clientPhone || !eventName || !category || !eventDate) {
      return res.status(400).json({ error: 'Please provide client contact details, event name, category, and date.' });
    }

    const db = readDB();
    if (!db.eventBookings) db.eventBookings = [];

    const bookingRef = 'BK-' + Math.floor(10000 + Math.random() * 90000);
    const newBooking = {
      id: 'booking-' + Date.now(),
      bookingRef,
      organizerId,
      organizerName: organizerName || 'Event Organizer',
      organizerCompany: organizerCompany || 'Event Organizer',
      clientId: clientId || undefined,
      clientName,
      clientPhone,
      clientEmail: clientEmail || '',
      clientCity: clientCity || 'Surat',
      eventName,
      category,
      eventDate,
      eventTime: eventTime || 'Full Day',
      venueArea: venueArea || 'Surat',
      guestCount: guestCount || '200-500 Guests',
      budgetRange: budgetRange || '₹50,000 - ₹1,50,000',
      servicesRequested: Array.isArray(servicesRequested) ? servicesRequested : ['Stage & Decor', 'Hospitality Crew'],
      specialNotes: specialNotes || '',
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Supabase
    try {
      await supabase.from('event_bookings').insert([newBooking]);
    } catch (err) {
      console.log('Supabase event booking insert note:', err);
    }

    db.eventBookings.unshift(newBooking);

    // Send notification to Organizer if handler account exists
    const orgHandler = db.users.find(u => u.id === organizerId);
    if (orgHandler) {
      const notif = {
        id: 'notif-' + Date.now(),
        userId: orgHandler.id,
        title: `🎉 New Event Booking Request (${bookingRef})!`,
        message: `${clientName} requested a booking for "${eventName}" (${category}) on ${eventDate}. Contact: ${clientPhone}`,
        type: 'application_update',
        read: false,
        createdAt: new Date().toISOString()
      };
      db.notifications.unshift(notif);
      try { await supabase.from('notifications').insert([notif]); } catch (e) {}
    }

    recordUserActivityLog(db, { name: clientName, phone: clientPhone }, `Submitted Event Booking Request ${bookingRef} for ${organizerCompany || organizerName}`, req);
    saveDB(db);

    res.json({ message: 'Event booking request submitted successfully!', booking: newBooking });
  });

  // GET EVENT BOOKINGS (For Handler or Client)
  app.get('/api/event-bookings', async (req, res) => {
    const { organizerId, handlerId, clientId } = req.query;

    // Check Supabase first
    try {
      let query = supabase.from('event_bookings').select('*');
      const targetOrgId = (organizerId || handlerId) as string;
      if (targetOrgId) {
        query = query.eq('organizerId', targetOrgId);
      } else if (clientId) {
        query = query.or(`clientId.eq.${clientId},clientPhone.eq.${clientId}`);
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return res.json(data);
      }
    } catch (err) {
      console.log('Supabase bookings fetch note:', err);
    }

    const db = readDB();
    if (!db.eventBookings) db.eventBookings = [];

    let list = db.eventBookings;

    const targetOrgId = (organizerId || handlerId) as string;
    if (targetOrgId) {
      list = list.filter(b => b.organizerId === targetOrgId);
    } else if (clientId) {
      list = list.filter(b => b.clientId === clientId || b.clientPhone === clientId);
    }

    res.json(list);
  });

  // UPDATE EVENT BOOKING STATUS
  app.patch('/api/event-bookings/:id/status', async (req, res) => {
    const { status } = req.body;
    if (!['new', 'contacted', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status.' });
    }

    const db = readDB();
    if (!db.eventBookings) db.eventBookings = [];
    const booking = db.eventBookings.find(b => b.id === req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });

    booking.status = status;
    booking.updatedAt = new Date().toISOString();

    // Update in Supabase
    try {
      await supabase.from('event_bookings').update({ status, updatedAt: booking.updatedAt }).eq('id', req.params.id);
    } catch (err) {
      console.log('Supabase booking update note:', err);
    }

    saveDB(db);
    res.json({ message: `Booking status updated to ${status}!`, booking });
  });

  // CONTINUOUS SUPABASE DATABASE SYNC FUNCTION
  async function syncAllToSupabase() {
    try {
      const db = readDB();
      if (!db) return;

      // 1. Sync Users
      if (db.users && db.users.length > 0) {
        const usersToSync = db.users.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          password: u.password,
          role: u.role,
          address: u.address,
          city: u.city,
          state: u.state,
          skills: u.skills || [],
          experience: u.experience,
          availability: u.availability,
          company_name: u.companyName,
          mobileVerified: !!u.mobileVerified,
          emailVerified: !!u.emailVerified,
          status: u.status || 'active',
          idVerificationStatus: u.idVerificationStatus || 'none'
        }));
        await supabase.from('users').upsert(usersToSync, { onConflict: 'id' });

        // Sync crew_profiles
        const crewUsers = db.users.filter((u: any) => u.role === 'crew');
        if (crewUsers.length > 0) {
          const crewProfiles = crewUsers.map((u: any) => ({
            user_id: u.id,
            skills: u.skills && u.skills.length > 0 ? u.skills : ['Hospitality & Welcoming', 'Stage & Sound Management'],
            daily_rate: 1800,
            badge: u.status === 'verified' || u.idVerificationStatus === 'verified' ? 'Verified Crew Pro' : 'Active Crew Member',
            id_proof_verified: u.status === 'verified' || u.idVerificationStatus === 'verified',
            bio: `${u.experience || 'Experienced crew'} - Available for ${u.availability || 'Events in Surat'}`
          }));
          await supabase.from('crew_profiles').upsert(crewProfiles, { onConflict: 'user_id' });
        }

        // Sync organizer_profiles
        const orgUsers = db.users.filter((u: any) => u.role === 'organizer' || u.role === 'admin');
        if (orgUsers.length > 0) {
          const orgProfiles = orgUsers.map((u: any) => ({
            user_id: u.id,
            company_name: u.companyName || `${u.name} Event Productions`,
            categories: ['Wedding Planner', 'Corporate & Conference', 'Concerts'],
            rating: 4.9,
            experience_years: 6,
            verified: true
          }));
          await supabase.from('organizer_profiles').upsert(orgProfiles, { onConflict: 'user_id' });
        }
      }

      // 2. Sync Events
      if (db.events && db.events.length > 0) {
        await supabase.from('events').upsert(db.events, { onConflict: 'id' });
      }

      // 3. Sync Organizers
      if (db.organizers && db.organizers.length > 0) {
        await supabase.from('organizers').upsert(db.organizers, { onConflict: 'id' });
      }

      // 4. Sync Applications
      if (db.applications && db.applications.length > 0) {
        await supabase.from('applications').upsert(db.applications, { onConflict: 'id' });
        const eventApps = db.applications.map((a: any) => ({
          id: a.id,
          event_id: a.eventId,
          crew_user_id: a.crewId,
          status: a.status || 'pending',
          bid_amount: a.payPerPerson || 1800
        }));
        await supabase.from('event_applications').upsert(eventApps, { onConflict: 'id' });
      }

      // 5. Sync Event Bookings
      if (db.eventBookings && db.eventBookings.length > 0) {
        await supabase.from('event_bookings').upsert(db.eventBookings, { onConflict: 'id' });
      }
    } catch (err) {
      console.log('Periodic Supabase sync note:', err);
    }
  }

  // Initial Sync and 30-sec background loop
  setTimeout(syncAllToSupabase, 3000);
  setInterval(syncAllToSupabase, 30000);

  // --- VITE MIDDLEWARE OR STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));

    const validPublicRoutes = ['/', '/jobs', '/hire-crew', '/find-crew', '/book-event'];
    const adminRoutes = ['/admin'];

    app.get('*', (req, res) => {
      // If it's a file request that was not found in static assets, return 404 Not Found
      if (req.path.includes('.') && !req.path.endsWith('.html')) {
        return res.status(404).send('Not Found');
      }

      const indexPath = path.join(distPath, 'index.html');
      if (!fs.existsSync(indexPath)) {
        return res.status(404).send('Not Found');
      }

      let html = fs.readFileSync(indexPath, 'utf-8');
      const cleanPath = req.path.length > 1 && req.path.endsWith('/') ? req.path.slice(0, -1) : req.path;

      if (validPublicRoutes.includes(cleanPath)) {
        const canonicalUrl = cleanPath === '/' ? 'https://abovez.in/' : `https://abovez.in${cleanPath}`;
        // Ensure canonical tag matches exact canonical URL on initial page fetch
        html = html.replace(/<link rel="canonical"[^>]*\/>/i, `<link rel="canonical" href="${canonicalUrl}" id="canonical-url" />`);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(html);
      } else if (adminRoutes.includes(cleanPath)) {
        html = html.replace(/<meta name="robots"[^>]*\/>/i, '<meta name="robots" content="noindex, nofollow" />');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(html);
      } else {
        // Unknown route -> Return genuine HTTP 404 status with noindex meta
        html = html.replace(/<meta name="robots"[^>]*\/>/i, '<meta name="robots" content="noindex, nofollow" />');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(404).send(html);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
