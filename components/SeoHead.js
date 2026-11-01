import Head from 'next/head';
import {
  BRAND,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  OG_IMAGE,
  absoluteUrl,
  buildLandingJsonLd,
  ROUTE_SEO,
} from '../lib/seo';

export default function SeoHead({
  title,
  description,
  path = '/',
  robots = 'index, follow',
  jsonLd,
  ogType = 'website',
  ogImage,
  keywords,
  articlePublishedTime,
  articleModifiedTime,
}) {
  const routeMeta = ROUTE_SEO[path] || {};
  const finalTitle = title || routeMeta.title || DEFAULT_TITLE;
  const finalDescription = description || routeMeta.description || DEFAULT_DESCRIPTION;
  const canonical = absoluteUrl(path);
  const schemas = jsonLd ?? (routeMeta.getJsonLd ? routeMeta.getJsonLd() : buildLandingJsonLd());
  const image = ogImage ? (String(ogImage).startsWith('http') ? ogImage : absoluteUrl(ogImage)) : OG_IMAGE;

  return (
    <Head>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="robots" content={robots} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <link rel="canonical" href={canonical} />

      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={BRAND} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1536" />
      <meta property="og:image:height" content="1024" />
      <meta property="og:image:alt" content="Octis jewellery shop management software for India" />
      <meta property="og:locale" content="en_IN" />
      {articlePublishedTime ? <meta property="article:published_time" content={articlePublishedTime} /> : null}
      {articleModifiedTime ? <meta property="article:modified_time" content={articleModifiedTime} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />

      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Head>
  );
}
