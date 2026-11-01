import LandingLayout from '../../components/landing/LandingLayout';
import BlogBrowse from '../../components/blog/BlogBrowse';
import { BLOG_CATEGORIES } from '../../lib/blog/categories';
import { buildBreadcrumbSchema } from '../../lib/seo';

export default function BlogsPage({ listing }) {
  return (
    <LandingLayout
      path="/blogs"
      seo={{
        title: 'Blogs & Insights | Octis',
        description: 'Industry notes from Octis on jewellery technology, pawn lending, bullion, and the software behind those businesses.',
        jsonLd: [
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blogs', path: '/blogs' },
          ]),
        ],
      }}
    >
      <section className="pt-8 pb-16 md:pt-14">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-sm font-medium text-[#9a7209]">Blogs</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-[#1a2f4a] sm:text-5xl">
            Blogs & Insights
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#4a2518]">
            Notes on jewellery technology, pawn lending, bullion, and running those businesses with clearer information.
          </p>
          <BlogBrowse
            categories={BLOG_CATEGORIES}
            featured={listing.featured}
            posts={listing.posts}
            page={listing.page}
            totalPages={listing.totalPages}
            total={listing.total}
            q={listing.q}
            emptyTitle="No articles yet"
            emptyBody="When Octis publishes an article, it will be listed here."
          />
        </div>
      </section>
    </LandingLayout>
  );
}

export async function getServerSideProps({ query, res }) {
  res.setHeader('Cache-Control', 'no-store');
  const { listPublicPosts } = await import('../../lib/blog/store');
  const listing = await listPublicPosts({ page: query.page, q: query.q, pageSize: 6 });
  return { props: { listing } };
}
