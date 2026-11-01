/** Canonical blog categories. Safe to import from the browser. */
export const BLOG_CATEGORIES = [
  {
    slug: 'jewellery-technology',
    name: 'Jewellery Technology',
    description: 'Billing, tagging, hallmarking, and workshop records for jewellery showrooms.',
  },
  {
    slug: 'pawn-industry',
    name: 'Pawn Industry',
    description: 'Appraisal, loan-to-value, interest, and custody for gold-loan desks.',
  },
  {
    slug: 'bullion-precious-metals',
    name: 'Bullion & Precious Metals',
    description: 'Physical stock, rates, and settlement for bullion trading.',
  },
  {
    slug: 'business-intelligence',
    name: 'Business Intelligence',
    description: 'How to read showroom and metal-business reports with care.',
  },
  {
    slug: 'technology-ai',
    name: 'Technology & AI',
    description: 'Practical notes on software, data, and automation for precious-metals businesses.',
  },
  {
    slug: 'business-growth',
    name: 'Business Growth',
    description: 'Operating questions for showrooms, lenders, and trading desks.',
  },
  {
    slug: 'company-updates',
    name: 'Company Updates',
    description: 'Notes from Octis about the website and products, published only when there is something real to say.',
  },
];

export function isCanonicalCategorySlug(slug) {
  return BLOG_CATEGORIES.some((category) => category.slug === slug);
}
