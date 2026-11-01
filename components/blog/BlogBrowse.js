import Link from 'next/link';
import ArticleCard, { Cover } from './ArticleCard';
import { formatBlogDate, readingLabel } from '../../lib/blog/format';

function hrefFor(basePath, page, q) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export default function BlogBrowse({
  categories = [],
  activeSlug = '',
  featured = null,
  posts = [],
  page = 1,
  totalPages = 1,
  total = 0,
  q = '',
  basePath = '/blogs',
  showSearch = true,
  showCategories = true,
  emptyTitle = 'No articles yet',
  emptyBody = 'Published articles will appear here.',
}) {
  return (
    <div>
      {showSearch && (
        <form action={basePath} method="get" className="mt-8 flex max-w-xl gap-2" role="search">
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <input
            id="blog-search"
            name="q"
            defaultValue={q}
            placeholder="Search articles"
            className="h-11 flex-1 rounded-md border border-[#e4d5bc] bg-white px-3 text-sm text-[#1a2f4a]"
          />
          <button type="submit" className="h-11 rounded-md bg-[#1a2f4a] px-4 text-sm font-semibold text-[#f7f1e6]">
            Search
          </button>
        </form>
      )}

      {showCategories && (
        <nav aria-label="Article categories" className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
          <Link
            href="/blogs"
            className={`text-sm ${activeSlug ? 'text-[#4a2518]' : 'text-[#1a2f4a] underline decoration-[#c9a96e] underline-offset-4'}`}
            aria-current={activeSlug ? undefined : 'page'}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/blogs/category/${category.slug}`}
              className={`text-sm ${
                activeSlug === category.slug
                  ? 'text-[#1a2f4a] underline decoration-[#c9a96e] underline-offset-4'
                  : 'text-[#4a2518] hover:text-[#1a2f4a]'
              }`}
              aria-current={activeSlug === category.slug ? 'page' : undefined}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      )}

      {q && (
        <p className="mt-6 text-sm text-[#4a2518]">
          {total === 0 ? 'No articles match that search.' : `${total} article${total === 1 ? '' : 's'} for “${q}”.`}
        </p>
      )}

      {featured && (
        <article className="mt-10 grid items-center gap-8 md:grid-cols-2">
          <Link href={`/blogs/${featured.slug}`} className="block overflow-hidden rounded-2xl">
            <Cover src={featured.coverImage} alt="" label={featured.category?.name} />
          </Link>
          <div>
            {featured.category && (
              <Link href={`/blogs/category/${featured.category.slug}`} className="text-sm text-[#9a7209]">
                {featured.category.name}
              </Link>
            )}
            <h2 className="mt-2 font-display text-3xl leading-tight text-[#1a2f4a] sm:text-4xl">
              <Link href={`/blogs/${featured.slug}`}>{featured.title}</Link>
            </h2>
            <p className="mt-3 text-base leading-7 text-[#4a2518]">{featured.excerpt}</p>
            <p className="mt-4 text-sm text-[#6b3a2a]">
              {featured.author?.name}
              {featured.publishedAt ? ` · ${formatBlogDate(featured.publishedAt)}` : ''}
              {` · ${readingLabel(featured.readingTime)}`}
            </p>
            <Link
              href={`/blogs/${featured.slug}`}
              className="mt-6 inline-flex h-11 items-center rounded-md bg-[#1a2f4a] px-5 text-sm font-semibold text-[#f7f1e6]"
            >
              Read article
            </Link>
          </div>
        </article>
      )}

      {posts.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        !featured && (
          <div className="mt-12 max-w-lg">
            <h2 className="font-display text-2xl text-[#1a2f4a]">{q ? 'Nothing matched' : emptyTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-[#4a2518]">{q ? 'Try a title, a category, or a word from the article.' : emptyBody}</p>
          </div>
        )
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-10 flex items-center gap-4 text-sm">
          {page > 1 ? (
            <Link href={hrefFor(basePath, page - 1, q)} className="font-semibold text-[#1a2f4a]">
              Previous
            </Link>
          ) : (
            <span className="text-[#b7a48a]">Previous</span>
          )}
          <span className="text-[#6b3a2a]">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={hrefFor(basePath, page + 1, q)} className="font-semibold text-[#1a2f4a]">
              Next
            </Link>
          ) : (
            <span className="text-[#b7a48a]">Next</span>
          )}
        </nav>
      )}
    </div>
  );
}
