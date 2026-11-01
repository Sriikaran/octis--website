import Link from 'next/link';
import LandingLayout from '../../components/landing/LandingLayout';
import MarkdownBody from '../../components/blog/MarkdownBody';
import ArticleCard, { Cover } from '../../components/blog/ArticleCard';
import ShareBar from '../../components/blog/ShareBar';
import { formatBlogDate, readingLabel } from '../../lib/blog/format';
import { absoluteUrl, buildBreadcrumbSchema, OG_IMAGE } from '../../lib/seo';

export default function BlogArticlePage({ article, previous, next, related, shareUrl }) {
  const path = `/blogs/${article.slug}`;
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;
  const updated =
    article.updatedAt &&
    article.publishedAt &&
    new Date(article.updatedAt).getTime() - new Date(article.publishedAt).getTime() > 60 * 1000;
  const image = article.coverImage ? absoluteUrl(article.coverImage) : OG_IMAGE;

  return (
    <LandingLayout
      path={path}
      seo={{
        title: `${title} | Octis`,
        description,
        keywords: (article.keywords || []).join(', '),
        ogType: 'article',
        ogImage: article.coverImage || undefined,
        articlePublishedTime: article.publishedAt || undefined,
        articleModifiedTime: article.updatedAt || undefined,
        jsonLd: [
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blogs', path: '/blogs' },
            ...(article.category ? [{ name: article.category.name, path: `/blogs/category/${article.category.slug}` }] : []),
            { name: article.title, path },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description,
            image,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt || article.publishedAt,
            author: article.author
              ? {
                  '@type': 'Person',
                  name: article.author.name,
                  url: absoluteUrl(`/blogs/author/${article.author.slug}`),
                }
              : undefined,
            publisher: {
              '@type': 'Organization',
              name: 'Octis',
              logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png') },
            },
            mainEntityOfPage: shareUrl,
          },
        ],
      }}
    >
      <article className="pt-8 pb-16 md:pt-12">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm text-[#6b3a2a]">
            <Link href="/" className="hover:text-[#1a2f4a]">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link href="/blogs" className="hover:text-[#1a2f4a]">Blogs</Link>
            {article.category && (
              <>
                <span aria-hidden="true"> / </span>
                <Link href={`/blogs/category/${article.category.slug}`} className="hover:text-[#1a2f4a]">
                  {article.category.name}
                </Link>
              </>
            )}
          </p>
          {article.category && (
            <p className="mt-6 text-sm text-[#9a7209]">{article.category.name}</p>
          )}
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-tight text-[#1a2f4a] sm:text-5xl">
            {article.title}
          </h1>
          {article.excerpt ? <p className="mt-4 text-lg leading-8 text-[#4a2518]">{article.excerpt}</p> : null}
          <p className="mt-5 text-sm text-[#6b3a2a]">
            {article.author ? (
              <Link href={`/blogs/author/${article.author.slug}`} className="font-medium text-[#1a2f4a]">
                {article.author.name}
              </Link>
            ) : null}
            {article.publishedAt ? ` · ${formatBlogDate(article.publishedAt)}` : ''}
            {updated ? ` · Updated ${formatBlogDate(article.updatedAt)}` : ''}
            {` · ${readingLabel(article.readingTime)}`}
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-6 mt-8">
          <div className="overflow-hidden rounded-2xl">
            <Cover src={article.coverImage} alt={article.title} label={article.category?.name} />
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 mt-10">
          <MarkdownBody source={article.content} />
          <div className="mt-10 border-t border-[#eadfce] pt-6">
            <ShareBar title={article.title} url={shareUrl} />
            <Link href="/blogs" className="mt-6 inline-block text-sm font-semibold text-[#1a2f4a]">
              Back to Blogs
            </Link>
          </div>
          {(previous || next) && (
            <nav aria-label="More articles" className="mt-8 grid gap-4 sm:grid-cols-2">
              {previous ? (
                <Link href={`/blogs/${previous.slug}`} className="rounded-xl border border-[#eadfce] bg-white p-4">
                  <span className="text-xs text-[#9a7209]">Previous</span>
                  <span className="mt-1 block font-display text-lg text-[#1a2f4a]">{previous.title}</span>
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`/blogs/${next.slug}`} className="rounded-xl border border-[#eadfce] bg-white p-4 sm:text-right">
                  <span className="text-xs text-[#9a7209]">Next</span>
                  <span className="mt-1 block font-display text-lg text-[#1a2f4a]">{next.title}</span>
                </Link>
              ) : null}
            </nav>
          )}
        </div>

        {related.length > 0 && (
          <div className="max-w-6xl mx-auto px-6 mt-14">
            <h2 className="font-display text-2xl text-[#1a2f4a]">Related articles</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          </div>
        )}
      </article>
    </LandingLayout>
  );
}

export async function getServerSideProps({ params, res }) {
  res.setHeader('Cache-Control', 'no-store');
  const { getPublicArticle } = await import('../../lib/blog/store');
  const { absoluteUrl: abs } = await import('../../lib/seo');
  const result = await getPublicArticle(params.slug);
  if (!result) return { notFound: true };
  return {
    props: {
      article: result.article,
      previous: result.previous,
      next: result.next,
      related: result.related,
      shareUrl: abs(`/blogs/${result.article.slug}`),
    },
  };
}
