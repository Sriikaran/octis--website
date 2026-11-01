import Link from 'next/link';
import { formatBlogDate, readingLabel } from '../../lib/blog/format';

export function Cover({ src, alt, label }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || ''}
        className="aspect-[16/10] w-full object-cover"
        loading="lazy"
      />
    );
  }
  return (
    <div className="flex aspect-[16/10] w-full items-end bg-[#1a2f4a] p-4">
      <span className="font-display text-xl text-[#e8d7b0]">{label || 'Octis'}</span>
    </div>
  );
}

export default function ArticleCard({ article }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#eadfce] bg-white">
      <Link href={`/blogs/${article.slug}`} className="block overflow-hidden">
        <Cover src={article.coverImage} alt="" label={article.category?.name} />
      </Link>
      <div className="flex flex-1 flex-col px-4 py-4">
        {article.category && (
          <Link href={`/blogs/category/${article.category.slug}`} className="text-xs font-medium text-[#9a7209]">
            {article.category.name}
          </Link>
        )}
        <h2 className="mt-1.5 font-display text-xl leading-snug text-[#1a2f4a]">
          <Link href={`/blogs/${article.slug}`} className="hover:text-[#9a7209]">
            {article.title}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#4a2518]">{article.excerpt}</p>
        <p className="mt-4 text-xs text-[#6b3a2a]">
          {article.author?.name}
          {article.publishedAt ? ` · ${formatBlogDate(article.publishedAt)}` : ''}
          {` · ${readingLabel(article.readingTime)}`}
        </p>
        <Link href={`/blogs/${article.slug}`} className="mt-3 text-sm font-semibold text-[#1a2f4a]">
          Read more
        </Link>
      </div>
    </article>
  );
}
