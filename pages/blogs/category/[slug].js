import Link from 'next/link';
import LandingLayout from '../../../components/landing/LandingLayout';
import BlogBrowse from '../../../components/blog/BlogBrowse';
import { BLOG_CATEGORIES } from '../../../lib/blog/categories';
import { buildBreadcrumbSchema } from '../../../lib/seo';

export default function BlogCategoryPage({ listing }) {
  const category = listing.category;
  const path = `/blogs/category/${category.slug}`;
  return (
    <LandingLayout
      path={path}
      seo={{
        title: `${category.name} | Octis Blogs`,
        description: category.description,
        jsonLd: [
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blogs', path: '/blogs' },
            { name: category.name, path },
          ]),
        ],
      }}
    >
      <section className="pt-8 pb-16 md:pt-14">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-sm text-[#6b3a2a]">
            <Link href="/blogs" className="hover:text-[#1a2f4a]">Blogs</Link>
            <span aria-hidden="true"> / </span>
            {category.name}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-[#1a2f4a]">{category.name}</h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-[#4a2518]">{category.description}</p>
          <BlogBrowse
            categories={BLOG_CATEGORIES}
            activeSlug={category.slug}
            posts={listing.posts}
            page={listing.page}
            totalPages={listing.totalPages}
            total={listing.total}
            q={listing.q}
            basePath={path}
            emptyTitle="No articles in this category"
            emptyBody="Published articles in this category will appear here."
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
    categorySlug: params.slug,
    pageSize: 6,
  });
  if (!listing) return { notFound: true };
  return { props: { listing } };
}
