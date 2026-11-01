import Link from 'next/link';
import LandingLayout from '../../../components/landing/LandingLayout';
import BlogBrowse from '../../../components/blog/BlogBrowse';
import { buildBreadcrumbSchema } from '../../../lib/seo';

export default function BlogAuthorPage({ listing }) {
  const author = listing.author;
  const path = `/blogs/author/${author.slug}`;
  const description = author.bio || `Articles by ${author.name}.`;
  return (
    <LandingLayout
      path={path}
      seo={{
        title: `${author.name} | Octis Blogs`,
        description,
        jsonLd: [
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blogs', path: '/blogs' },
            { name: author.name, path },
          ]),
        ],
      }}
    >
      <section className="pt-8 pb-16 md:pt-14">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-sm text-[#6b3a2a]">
            <Link href="/blogs" className="hover:text-[#1a2f4a]">Blogs</Link>
            <span aria-hidden="true"> / </span>
            {author.name}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-[#1a2f4a]">{author.name}</h1>
          {author.designation ? <p className="mt-2 text-sm text-[#9a7209]">{author.designation}</p> : null}
          {author.bio ? <p className="mt-3 max-w-xl text-base leading-relaxed text-[#4a2518]">{author.bio}</p> : null}
          <BlogBrowse
            posts={listing.posts}
            page={listing.page}
            totalPages={listing.totalPages}
            total={listing.total}
            q={listing.q}
            basePath={path}
            showCategories={false}
            emptyTitle="No published articles"
            emptyBody="Articles from this author will appear here after they are published."
          />
        </div>
      </section>
    </LandingLayout>
  );
}

export async function getServerSideProps({ params, query, res }) {
  res.setHeader('Cache-Control', 'no-store');
  const { listPublicPosts } = await import('../../../lib/blog/store');
  const listing = await listPublicPosts({
    page: query.page,
    q: query.q,
    authorSlug: params.slug,
    pageSize: 6,
  });
  if (!listing) return { notFound: true };
  return { props: { listing } };
}
