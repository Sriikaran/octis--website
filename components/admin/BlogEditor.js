import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MarkdownBody from '../blog/MarkdownBody';
import { adminFetch } from './AdminShell';

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  categoryId: '',
  authorId: '',
  coverImage: '',
  seoTitle: '',
  seoDescription: '',
  keywords: '',
  featured: false,
  status: 'draft',
  publishedAt: '',
};

function toLocalInput(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

async function uploadImage(file) {
  const data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the image.'));
    reader.readAsDataURL(file);
  });
  const { res, data: body } = await adminFetch('/api/admin/blog-images', {
    method: 'POST',
    body: JSON.stringify({ mime: file.type, data }),
  });
  if (!res.ok) throw new Error(body.error || 'Image upload failed.');
  return body.path;
}

export default function BlogEditor({ postId }) {
  const router = useRouter();
  const contentRef = useRef(null);
  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState('');
  const [fields, setFields] = useState({});
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const directory = await adminFetch('/api/admin/blogs');
      if (!directory.res.ok) return;
      if (cancelled) return;
      setCategories(directory.data.categories || []);
      setAuthors(directory.data.authors || []);
      if (!postId) {
        setForm((current) => ({
          ...current,
          categoryId: directory.data.categories?.[0]?.id || '',
          authorId: directory.data.authors?.[0]?.id || '',
        }));
        return;
      }
      const existing = await adminFetch(`/api/admin/blogs/${postId}`);
      if (!existing.res.ok || cancelled) {
        setError(existing.data.error || 'Article not found.');
        return;
      }
      const post = existing.data.post;
      setForm({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        categoryId: post.categoryId || '',
        authorId: post.authorId || '',
        coverImage: post.coverImage || '',
        seoTitle: post.seoTitle || '',
        seoDescription: post.seoDescription || '',
        keywords: (post.keywords || []).join(', '),
        featured: Boolean(post.featured),
        status: post.status || 'draft',
        publishedAt: toLocalInput(post.publishedAt),
      });
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function insertAround(before, after, placeholder) {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const selected = form.content.slice(start, end) || placeholder;
    const next = `${form.content.slice(0, start)}${before}${selected}${after}${form.content.slice(end)}`;
    setField('content', next);
  }

  async function onCover(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      setField('coverImage', await uploadImage(file));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function onInlineImage(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const imagePath = await uploadImage(file);
      insertAround(`\n\n![${file.name}](${imagePath})\n\n`, '', '');
    } catch (err) {
      setError(err.message);
    }
  }

  async function save(status) {
    setSaving(true);
    setError('');
    setFields({});
    if (status === 'scheduled' && !form.publishedAt) {
      setSaving(false);
      setError('Choose a future time before scheduling.');
      return;
    }
    const payload = {
      ...form,
      status,
      keywords: form.keywords,
      publishedAt: status === 'scheduled' ? new Date(form.publishedAt).toISOString() : undefined,
      featured: Boolean(form.featured),
    };
    const { res, data } = await adminFetch(postId ? `/api/admin/blogs/${postId}` : '/api/admin/blogs', {
      method: postId ? 'PATCH' : 'POST',
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      setError(data.error || 'Could not save the article.');
      setFields(data.fields || {});
      return;
    }
    if (!postId) {
      router.replace(`/admin/blogs/${data.post.id}`);
      return;
    }
    setForm((current) => ({ ...current, status: data.post.status, slug: data.post.slug }));
  }

  async function remove() {
    if (!postId) return;
    if (!window.confirm('Delete this article? This cannot be undone.')) return;
    const { res, data } = await adminFetch(`/api/admin/blogs/${postId}`, { method: 'DELETE' });
    if (!res.ok) {
      setError(data.error || 'Could not delete the article.');
      return;
    }
    router.push('/admin/blogs');
  }

  const fieldClass = 'mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-sm';

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/admin/blogs" className="text-sm text-slate-600 hover:text-slate-900">All articles</Link>
          <span className="text-xs uppercase tracking-wide text-slate-500">{form.status}</span>
        </div>
        {error ? <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
        <label className="block text-sm font-medium" htmlFor="title">Title</label>
        <input id="title" className={fieldClass} value={form.title} onChange={(e) => setField('title', e.target.value)} />
        {fields.title ? <p className="mt-1 text-xs text-red-700">{fields.title}</p> : null}

        <label className="mt-4 block text-sm font-medium" htmlFor="slug">Slug</label>
        <input id="slug" className={fieldClass} value={form.slug} onChange={(e) => setField('slug', e.target.value)} placeholder="Generated from the title if left blank" />
        {fields.slug ? <p className="mt-1 text-xs text-red-700">{fields.slug}</p> : null}

        <label className="mt-4 block text-sm font-medium" htmlFor="excerpt">Excerpt</label>
        <textarea id="excerpt" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" rows={3} value={form.excerpt} onChange={(e) => setField('excerpt', e.target.value)} />
        {fields.excerpt ? <p className="mt-1 text-xs text-red-700">{fields.excerpt}</p> : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => insertAround('\n\n## ', '\n\n', 'Heading')}>Heading</button>
          <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => insertAround('**', '**', 'bold')}>Bold</button>
          <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => insertAround('*', '*', 'italic')}>Italic</button>
          <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => insertAround('\n- ', '', 'List item')}>List</button>
          <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => insertAround('\n> ', '\n', 'Quote')}>Quote</button>
          <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => insertAround('[', '](https://)', 'link text')}>Link</button>
          <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => insertAround('\n```\n', '\n```\n', 'code')}>Code</button>
          <label className="cursor-pointer rounded border border-slate-300 px-2 py-1 text-xs">
            Image
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onInlineImage} />
          </label>
          <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => setPreview((value) => !value)}>
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
        {preview ? (
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-5">
            <MarkdownBody source={form.content} />
          </div>
        ) : (
          <textarea
            ref={contentRef}
            className="mt-3 min-h-[320px] w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm leading-6"
            value={form.content}
            onChange={(e) => setField('content', e.target.value)}
            aria-label="Article content"
          />
        )}
        {fields.content ? <p className="mt-1 text-xs text-red-700">{fields.content}</p> : null}
        <p className="mt-2 text-xs text-slate-500">Markdown: headings, bold, italic, lists, links, images, quotes, and code blocks.</p>
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="block text-sm font-medium" htmlFor="category">Category</label>
          <select id="category" className={fieldClass} value={form.categoryId} onChange={(e) => setField('categoryId', e.target.value)}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <label className="mt-3 block text-sm font-medium" htmlFor="author">Author</label>
          <select id="author" className={fieldClass} value={form.authorId} onChange={(e) => setField('authorId', e.target.value)}>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>{author.name}</option>
            ))}
          </select>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setField('featured', e.target.checked)} />
            Featured article
          </label>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium">Cover image</p>
          {form.coverImage ? <img src={form.coverImage} alt="" className="mt-2 aspect-[16/10] w-full rounded-md object-cover" /> : null}
          <label className="mt-2 inline-block cursor-pointer text-sm text-[#1a2f4a] underline">
            Upload
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onCover} />
          </label>
          {form.coverImage ? (
            <button type="button" className="ml-3 text-sm text-slate-500" onClick={() => setField('coverImage', '')}>Remove</button>
          ) : null}
          {fields.coverImage ? <p className="mt-1 text-xs text-red-700">{fields.coverImage}</p> : null}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="block text-sm font-medium" htmlFor="seo-title">SEO title</label>
          <input id="seo-title" className={fieldClass} value={form.seoTitle} onChange={(e) => setField('seoTitle', e.target.value)} />
          <label className="mt-3 block text-sm font-medium" htmlFor="seo-description">SEO description</label>
          <textarea id="seo-description" rows={3} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.seoDescription} onChange={(e) => setField('seoDescription', e.target.value)} />
          <label className="mt-3 block text-sm font-medium" htmlFor="keywords">Keywords</label>
          <input id="keywords" className={fieldClass} value={form.keywords} onChange={(e) => setField('keywords', e.target.value)} placeholder="Comma separated" />
          <label className="mt-3 block text-sm font-medium" htmlFor="publish-at">Publish at</label>
          <input id="publish-at" type="datetime-local" className={fieldClass} value={form.publishedAt} onChange={(e) => setField('publishedAt', e.target.value)} />
          {fields.publishedAt ? <p className="mt-1 text-xs text-red-700">{fields.publishedAt}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => save(form.status === 'published' || form.status === 'scheduled' ? form.status : 'draft')}
            className="h-10 rounded-md border border-slate-300 bg-white text-sm font-semibold"
          >
            {form.status === 'draft' ? 'Save draft' : 'Save changes'}
          </button>
          <button type="button" disabled={saving} onClick={() => save('published')} className="h-10 rounded-md bg-[#1a2f4a] text-sm font-semibold text-white">Publish</button>
          <button type="button" disabled={saving} onClick={() => save('scheduled')} className="h-10 rounded-md border border-slate-300 bg-white text-sm font-semibold">Schedule</button>
          {form.status !== 'draft' && (
            <button type="button" disabled={saving} onClick={() => save('draft')} className="h-10 rounded-md border border-slate-300 bg-white text-sm">Unpublish</button>
          )}
          {postId && (
            <Link href={`/admin/blogs/preview/${postId}`} className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 text-sm">
              Open preview
            </Link>
          )}
          {postId && (
            <button type="button" onClick={remove} className="h-10 rounded-md text-sm text-red-700">Delete article</button>
          )}
        </div>
      </aside>
    </div>
  );
}
