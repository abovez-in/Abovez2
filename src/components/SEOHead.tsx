import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteSEO {
  title: string;
  description: string;
  canonical: string;
  robots: string;
}

const CANONICAL_BASE = 'https://abovez.in';

const SEO_CONFIG: Record<string, RouteSEO> = {
  '/': {
    title: 'AboveZ - Event Organizers Booking & Crew Hiring Platform Surat',
    description: 'Event organizers booking and crew hiring platform with category-based planner directory, genuine client ratings & reviews, and verified crew profiles in Surat.',
    canonical: `${CANONICAL_BASE}/`,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  '/jobs': {
    title: 'Event Crew Jobs & Hiring in Surat | AboveZ',
    description: 'Browse verified event crew jobs in Surat. Apply for weddings, corporate events, and concerts with transparent daily pay and instant hiring on AboveZ.',
    canonical: `${CANONICAL_BASE}/jobs`,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  '/hire-crew': {
    title: 'Hire Event Organizers & Planners in Surat | AboveZ',
    description: 'Hire top-rated wedding curators, corporate planners, and exhibition stage organizers in Surat with genuine client reviews on AboveZ.',
    canonical: `${CANONICAL_BASE}/hire-crew`,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  '/find-crew': {
    title: 'Become Verified Event Crew Member | AboveZ Surat',
    description: 'Register as verified event crew member in Surat. Find flexible event work, hospitality, catering, and stage production opportunities.',
    canonical: `${CANONICAL_BASE}/find-crew`,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  '/book-event': {
    title: 'Book Event Planners & Organizers | AboveZ Surat',
    description: 'Book verified event organizers and production agencies in Surat for weddings, birthdays, trade expos, and corporate conferences.',
    canonical: `${CANONICAL_BASE}/book-event`,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  '/admin': {
    title: 'Admin Portal | AboveZ',
    description: 'AboveZ administrator portal.',
    canonical: `${CANONICAL_BASE}/admin`,
    robots: 'noindex, nofollow'
  }
};

export const SEOHead: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Normalize path by stripping trailing slash for matching
    const rawPath = location.pathname;
    const cleanPath = rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;

    const seo = SEO_CONFIG[cleanPath] || {
      title: '404 - Page Not Found | AboveZ',
      description: 'The requested page could not be found on AboveZ.',
      canonical: `${CANONICAL_BASE}${cleanPath}`,
      robots: 'noindex, nofollow'
    };

    // Update document title
    document.title = seo.title;

    // Update meta description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', seo.description);

    // Update or add canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seo.canonical);

    // Update or add robots meta
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', seo.robots);

    // Update OpenGraph tags
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', seo.canonical);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', seo.title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', seo.description);
  }, [location.pathname]);

  return null;
};
