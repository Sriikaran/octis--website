import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminShell, { adminFetch } from '../../../../components/admin/AdminShell';
import MarkdownBody from '../../../../components/blog/MarkdownBody';
import { Cover } from '../../../../components/blog/ArticleCard';
import { formatBlogDate, readingLabel } from '../../../../lib/blog/format';

function PreviewBody({ id }) {
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminFetch(`/api/admin/blogs/${id}`).then(({ res, data }) => {
      if (cancelled) return;
      if (!res.ok) setError(data.error || 'Article not found.');
      else setPost(data.post);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) return <p className="text-sm text-red-700">{error}</p>;
  if (!post) return <p className="text-sm text-slate-500">Loading preview…</p>;

  return (
    <div>
      <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
        Preview only. This page is not public. Status: {post.status}.
      </p>
      <div className="mx-auto mt-6 max-w-3xl">
        <p className="text-sm text-[#9a7209]">{post.category?.name}</p>
        <h2 className="mt-2 font-display text-4xl text-[#1a2f4a]">{post.title}</h2>
        <p className="mt-3 text-lg text-[#4a2518]">{post.excerpt}</p>
        <p className="mt-3 text-sm text-[#6b3a2a]">
          {post.author?.name}
          {post.publishedAt ? ` · ${formatBlogDate(post.publishedAt)}` : ''}
          {` · ${readingLabel(post.readingTime)}`}
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl">
          <Cover src={post.coverImage} alt={post.title} label={post.category?.name} />
        </div>
        <div className="mt-8">
          <MarkdownBody source={post.content} />
        </div>
        <Link href={`/admin/blogs/${post.id}`} className="mt-8 inline-block text-sm font-semibold text-[#1a2f4a]">
          Back to editor
        </Link>
      </div>
    </div>
  );
}

export default function BlogPreviewPage() {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '';
  return (
    <AdminShell title="Article preview">
      {id ? <PreviewBody id={id} /> : null}
    </AdminShell>
  );
}
