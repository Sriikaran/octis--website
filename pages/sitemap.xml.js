const STATIC_URLS = [
  ['/', 'daily', '1.0'],
  ['/products', 'weekly', '0.9'],
  ['/features', 'weekly', '0.8'],
  ['/pricing', 'weekly', '0.8'],
  ['/faq', 'weekly', '0.7'],
  ['/blogs', 'weekly', '0.8'],
  ['/contact', 'monthly', '0.8'],
  ['/request-demo', 'weekly', '0.9'],
];

function xmlEscape(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function Sitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  const { listSitemapEntries } = await import('../lib/blog/store');
  const { absoluteUrl } = await import('../lib/seo');
  const dynamic = await listSitemapEntries();
  const urls = [
    ...STATIC_URLS.map(([path, changefreq, priority]) => ({ loc: absoluteUrl(path), changefreq, priority })),
    ...dynamic.categories.map((entry) => ({ loc: absoluteUrl(entry.path), changefreq: 'weekly', priority: '0.6' })),
    ...dynamic.authors.map((entry) => ({ loc: absoluteUrl(entry.path), changefreq: 'weekly', priority: '0.5' })),
    ...dynamic.posts.map((entry) => ({
      loc: absoluteUrl(entry.path),
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: entry.updatedAt,
    })),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => {
      const lastmod = url.lastmod ? `<lastmod>${xmlEscape(url.lastmod)}</lastmod>` : '';
      return `<url><loc>${xmlEscape(url.loc)}</loc>${lastmod}<changefreq>${url.changefreq}</changefreq><priority>${url.priority}</priority></url>`;
    }),
    '</urlset>',
  ].join('');

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.write(body);
  res.end();
  return { props: {} };
}

export default Sitemap;
