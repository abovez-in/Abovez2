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
    title: 'AboveZ - Fresh Banana Wafers | Long ₹210/kg & Round ₹220/kg | WhatsApp 9265993727',
    description: 'AboveZ Fresh Banana Wafers - Premium Long (₹210/kg) & Round (₹220/kg) Crispy Banana Chips. Order online via WhatsApp at 9265993727.',
    canonical: `${CANONICAL_BASE}/`,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  '/wafers': {
    title: 'Buy Banana Wafers Online | Long ₹210/kg & Round ₹220/kg | AboveZ',
    description: 'Order freshly fried banana wafers in Rock Salt and Black Pepper flavors. Long wafers ₹210/kg and round wafers ₹220/kg. WhatsApp 9265993727.',
    canonical: `${CANONICAL_BASE}/wafers`,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  '/wholesale': {
    title: 'Wholesale Banana Wafers Bulk Order Surat | AboveZ',
    description: 'Wholesale banana chips in 10kg, 25kg, 50kg bulk packs for retailers, caterers and shops. WhatsApp inquiry at 9265993727.',
    canonical: `${CANONICAL_BASE}/wholesale`,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  }
};

export const SEOHead: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const rawPath = location.pathname;
    const cleanPath = rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;

    const seo = SEO_CONFIG[cleanPath] || SEO_CONFIG['/'];

    document.title = seo.title;

    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', seo.description);

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seo.canonical);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seo.description);
  }, [location.pathname]);

  return null;
};
