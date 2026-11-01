import { LANDING_FAQS } from './landingFaqs';

export const BRAND = 'Octis';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://octis.in').replace(/\/$/, '');
export const DEFAULT_TITLE = 'Octis | Integrated Jewellery ERP & Business Intelligence Platform';
export const DEFAULT_DESCRIPTION =
  'Unify jewellery showroom billing, inventory, gold loan management, and bullion trading with Octis. Cloud POS, HUID compliance, and AI business intelligence for Indian jewellers.';
export const CONTACT_PHONE = '+917396029339';
export const CONTACT_PHONE_DISPLAY = '+91 7396 029 339';
export const CONTACT_EMAIL = 'hello@octis.in';
export const DEMO_EMAIL = 'demo@octis.in';
export const BRAND_LOGO_SRC = '/logo.png';
export const OG_IMAGE_SRC = '/og-image.png';
export const OG_IMAGE = `${SITE_URL}${OG_IMAGE_SRC}`;

export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND,
    url: SITE_URL,
    logo: absoluteUrl(BRAND_LOGO_SRC),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: CONTACT_PHONE,
        email: CONTACT_EMAIL,
        contactType: 'customer support',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
      },
      {
        '@type': 'ContactPoint',
        email: DEMO_EMAIL,
        contactType: 'sales',
        areaServed: 'IN',
      },
    ],
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND,
    url: SITE_URL,
    inLanguage: 'en-IN',
  };
}

export function buildSoftwareAppSchema({
  name = BRAND,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  applicationCategory = 'BusinessApplication',
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    applicationCategory,
    operatingSystem: 'Web',
    url: absoluteUrl(path),
    description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      description: 'Contact sales for custom enterprise pricing or demo trial',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
  };
}

export function buildBreadcrumbSchema(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildFaqSchema(faqs = LANDING_FAQS) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export function buildLandingJsonLd() {
  return [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildSoftwareAppSchema({
      name: 'Octis Jewellery ERP',
      description: DEFAULT_DESCRIPTION,
      path: '/',
    }),
  ];
}

export const ROUTE_SEO = {
  '/': {
    title: 'Octis | Integrated Jewellery ERP & Business Intelligence Platform',
    description:
      'Unify jewellery showroom billing, inventory, gold loan management, and bullion trading with Octis. Cloud POS, HUID compliance, and AI business intelligence for Indian jewellers.',
    path: '/',
    getJsonLd: () => [
      buildOrganizationSchema(),
      buildWebSiteSchema(),
      buildSoftwareAppSchema({
        name: 'Octis Jewellery ERP Platform',
        description:
          'Unified jewellery retail ERP, pawn lending software, and bullion trading platform.',
        path: '/',
      }),
    ],
  },
  '/products': {
    title: 'Products Ecosystem | Octis Jewellery ERP, Pawnify & Bulion',
    description:
      'Explore the Octis software suite: Jewellery ERP for retail showrooms, Pawnify for gold loan brokers, and Bulion for physical bullion trading and settlement.',
    path: '/products',
    getJsonLd: () => [
      buildOrganizationSchema(),
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
      ]),
    ],
  },
  '/products/jewellery-erp': {
    title: 'Octis Jewellery ERP | POS, Inventory, Karigars & Business Intelligence',
    description:
      'Complete jewellery retail ERP for Indian showrooms. Fast touch POS, automated GST & HUID compliance, karigar job tracking, savings schemes, and AI stock insights.',
    path: '/products/jewellery-erp',
    getJsonLd: () => [
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Jewellery ERP', path: '/products/jewellery-erp' },
      ]),
      buildSoftwareAppSchema({
        name: 'Octis Jewellery ERP',
        description:
          'Cloud POS, inventory, HUID compliance, karigar tracking, and AI insights for Indian jewellery retailers.',
        path: '/products/jewellery-erp',
      }),
    ],
  },
  '/products/pawnify': {
    title: 'Pawnify | Gold & Silver Loan Broker Management Software',
    description:
      'Dedicated Girvi & gold loan management software for Indian pawn brokers. Multi-item appraisal, RBI LTV compliance, Actual/365 interest engine, and vault custody.',
    path: '/products/pawnify',
    getJsonLd: () => [
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Pawnify', path: '/products/pawnify' },
      ]),
      buildSoftwareAppSchema({
        name: 'Pawnify - Gold & Silver Loan Broker ERP',
        description:
          'Indian pawn broker software with RBI-compliant LTV calculations, Actual/365 interest accrual, Aadhaar/PAN KYC, and custody management.',
        path: '/products/pawnify',
      }),
    ],
  },
  '/products/bulion': {
    title: 'Bulion | Physical Bullion Inventory, Live Rates & Deal Settlement',
    description:
      'Enterprise bullion trading software for Indian dealers, refiners, and wholesalers. Live rate quotation, customer rate reservation blocks, and two-way deal settlement.',
    path: '/products/bulion',
    getJsonLd: () => [
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Bulion', path: '/products/bulion' },
      ]),
      buildSoftwareAppSchema({
        name: 'Bulion - Trading & Inventory ERP',
        description:
          'Physical gold and silver bullion management, real-time rate feed integration, customer reservation locks, and metal position ledgers.',
        path: '/products/bulion',
      }),
    ],
  },
  '/features': {
    title: 'Platform Features & Capabilities | Octis Jewellery Software',
    description:
      'Discover Octis platform capabilities: lightning-fast POS billing, real-time inventory reconciliation, 100+ business intelligence reports, and AI analytics.',
    path: '/features',
    getJsonLd: () => [
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Features', path: '/features' },
      ]),
    ],
  },
  '/pricing': {
    title: 'Pricing & Plans | Octis Jewellery ERP',
    description:
      'Transparent, value-driven plans for Indian jewellery retailers. Starter, Professional, and Enterprise plans tailored to single showrooms and multi-branch chains.',
    path: '/pricing',
    getJsonLd: () => [
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Pricing', path: '/pricing' },
      ]),
      buildSoftwareAppSchema({
        name: 'Octis Jewellery ERP Plans',
        description: 'Starter, Professional, and Enterprise editions of Octis Jewellery ERP.',
        path: '/pricing',
      }),
    ],
  },
  '/faq': {
    title: 'Frequently Asked Questions | Octis Jewellery ERP & Software Suite',
    description:
      'Find answers to common questions about Octis jewellery software, BIS HUID hallmarking, GST invoicing, gold savings schemes, data migration, and AI features.',
    path: '/faq',
    getJsonLd: () => [
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'FAQ', path: '/faq' },
      ]),
      buildFaqSchema(LANDING_FAQS),
    ],
  },
  '/blogs': {
    title: 'Blogs & Insights | Octis',
    description:
      'Industry notes from Octis on jewellery technology, pawn lending, bullion, and the software behind those businesses.',
    path: '/blogs',
    getJsonLd: () => [
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Blogs', path: '/blogs' },
      ]),
    ],
  },
  '/contact': {
    title: 'Contact & Showroom Advisory | Octis Jewellery Technology',
    description:
      'Connect with Octis showroom technology specialists. Schedule a consultation or speak with our advisory team at +91 7396 029 339.',
    path: '/contact',
    getJsonLd: () => [
      buildOrganizationSchema(),
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
      ]),
    ],
  },
  '/request-demo': {
    title: 'Schedule a Live Demo & Appointment | Octis Jewellery Software',
    description:
      'Book a live 1-on-1 demonstration of Octis Jewellery ERP, Pawnify, or Bulion. Choose your date, select an open time slot, and meet our showroom advisory team.',
    path: '/request-demo',
    getJsonLd: () => [
      buildOrganizationSchema(),
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Request Demo', path: '/request-demo' },
      ]),
    ],
  },
};
