import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell, { adminFetch } from '../../../components/admin/AdminShell';
import { isCanonicalCategorySlug } from '../../../lib/blog/categories';

function Articles() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    const { res, data } = await adminFetch('/api/admin/blogs');
    if (!res.ok) {
      setError(data.error || 'Could not load articles.');
      return;
    }
    setPosts(data.posts || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(post, status) {
    const { res, data } = await adminFetch(`/api/admin/blogs/${post.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setError(data.error || 'Could not update the article.');
      return;
    }
    load();
  }

  async function remove(post) {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    const { res, data } = await adminFetch(`/api/admin/blogs/${post.id}`, { method: 'DELETE' });
    if (!res.ok) {
      setError(data.error || 'Could not delete the article.');
      return;
    }
    load();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Articles</h2>
        <Link href="/admin/blogs/new" className="rounded-md bg-[#1a2f4a] px-3 py-2 text-sm font-semibold text-white">New article</Link>
      </div>
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      {posts.length === 0 ? (
        <p className="text-sm text-slate-600">No articles yet. Create one when there is something worth publishing.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    <Link href={`/admin/blogs/${post.id}`} className="font-medium text-[#1a2f4a]">{post.title}</Link>
                  </td>
                  <td className="px-4 py-3">{post.category?.name}</td>
                  <td className="px-4 py-3 capitalize">{post.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/admin/blogs/${post.id}`} className="text-[#1a2f4a]">Edit</Link>
                      <Link href={`/admin/blogs/preview/${post.id}`} className="text-[#1a2f4a]">Preview</Link>
                      {post.status === 'published' ? (
                        <button type="button" className="text-[#1a2f4a]" onClick={() => setStatus(post, 'draft')}>Unpublish</button>
                      ) : (
                        <button type="button" className="text-[#1a2f4a]" onClick={() => setStatus(post, 'published')}>Publish</button>
                      )}
                      <button type="button" className="text-red-700" onClick={() => remove(post)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  async function load() {
    const { res, data } = await adminFetch('/api/admin/blogs');
    if (res.ok) setCategories(data.categories || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(event) {
    event.preventDefault();
    const { res, data } = await adminFetch('/api/admin/blog-categories', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
    if (!res.ok) {
      setError(data.error || 'Could not create the category.');
      return;
    }
    setName('');
    setDescription('');
    setError('');
    load();
  }

  async function save(category) {
    const { res, data } = await adminFetch(`/api/admin/blog-categories/${category.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name: category.name, description: category.description }),
    });
    if (!res.ok) setError(data.error || 'Could not update the category.');
  }

  async function remove(category) {
    if (!window.confirm(`Delete ${category.name}?`)) return;
    const { res, data } = await adminFetch(`/api/admin/blog-categories/${category.id}`, { method: 'DELETE' });
    if (!res.ok) {
      setError(data.error || 'Could not delete the category.');
      return;
    }
    load();
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {categories.map((category) => (
        <form
          key={category.id}
          className="rounded-xl border border-slate-200 bg-white p-4"
          onSubmit={(event) => {
            event.preventDefault();
            save(category);
          }}
        >
          <input
            className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
            value={category.name}
            onChange={(event) => setCategories((list) => list.map((item) => item.id === category.id ? { ...item, name: event.target.value } : item))}
            aria-label="Category name"
          />
          <textarea
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            rows={2}
            value={category.description}
            onChange={(event) => setCategories((list) => list.map((item) => item.id === category.id ? { ...item, description: event.target.value } : item))}
            aria-label="Category description"
          />
          <div className="mt-2 flex gap-3 text-sm">
            <button type="submit" className="font-semibold text-[#1a2f4a]">Save</button>
            {!isCanonicalCategorySlug(category.slug) && (
              <button type="button" className="text-red-700" onClick={() => remove(category)}>Delete</button>
            )}
          </div>
        </form>
      ))}
      <form onSubmit={create} className="rounded-xl border border-dashed border-slate-300 p-4">
        <p className="text-sm font-medium">New category</p>
        <input className="mt-2 h-10 w-full rounded-md border border-slate-300 px-3 text-sm" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" rows={2} placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit" className="mt-2 text-sm font-semibold text-[#1a2f4a]">Add category</button>
      </form>
    </div>
  );
}

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');

  async function load() {
    const { res, data } = await adminFetch('/api/admin/blogs');
    if (res.ok) setAuthors(data.authors || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(event) {
    event.preventDefault();
    const { res, data } = await adminFetch('/api/admin/blog-authors', {
      method: 'POST',
      body: JSON.stringify({ name, designation, bio }),
    });
    if (!res.ok) {
      setError(data.error || 'Could not create the author.');
      return;
    }
    setName('');
    setDesignation('');
    setBio('');
    load();
  }

  async function save(author) {
    const { res, data } = await adminFetch(`/api/admin/blog-authors/${author.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name: author.name, designation: author.designation, bio: author.bio }),
    });
    if (!res.ok) setError(data.error || 'Could not update the author.');
  }

  async function remove(author) {
    if (!window.confirm(`Delete ${author.name}?`)) return;
    const { res, data } = await adminFetch(`/api/admin/blog-authors/${author.id}`, { method: 'DELETE' });
    if (!res.ok) {
      setError(data.error || 'Could not delete the author.');
      return;
    }
    load();
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {authors.map((author) => (
        <form
          key={author.id}
          className="rounded-xl border border-slate-200 bg-white p-4"
          onSubmit={(event) => {
            event.preventDefault();
            save(author);
          }}
        >
          <input className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm" value={author.name} onChange={(event) => setAuthors((list) => list.map((item) => item.id === author.id ? { ...item, name: event.target.value } : item))} aria-label="Author name" />
          <input className="mt-2 h-10 w-full rounded-md border border-slate-300 px-3 text-sm" value={author.designation || ''} onChange={(event) => setAuthors((list) => list.map((item) => item.id === author.id ? { ...item, designation: event.target.value } : item))} aria-label="Designation" />
          <textarea className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" rows={3} value={author.bio || ''} onChange={(event) => setAuthors((list) => list.map((item) => item.id === author.id ? { ...item, bio: event.target.value } : item))} aria-label="Bio" />
          <div className="mt-2 flex gap-3 text-sm">
            <button type="submit" className="font-semibold text-[#1a2f4a]">Save</button>
            <button type="button" className="text-red-700" onClick={() => remove(author)}>Delete</button>
          </div>
        </form>
      ))}
      <form onSubmit={create} className="rounded-xl border border-dashed border-slate-300 p-4">
        <p className="text-sm font-medium">New author</p>
        <input className="mt-2 h-10 w-full rounded-md border border-slate-300 px-3 text-sm" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="mt-2 h-10 w-full rounded-md border border-slate-300 px-3 text-sm" placeholder="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
        <textarea className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" rows={3} placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        <button type="submit" className="mt-2 text-sm font-semibold text-[#1a2f4a]">Add author</button>
      </form>
    </div>
  );
}

export default function AdminBlogsPage() {
  const [tab, setTab] = useState('articles');
  return (
    <AdminShell title="Blogs">
      <div className="mb-6 flex gap-4 text-sm">
        {['articles', 'categories', 'authors'].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={tab === item ? 'font-semibold text-[#1a2f4a] underline decoration-[#c9a96e] underline-offset-4' : 'capitalize text-slate-600'}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === 'articles' && <Articles />}
      {tab === 'categories' && <Categories />}
      {tab === 'authors' && <Authors />}
    </AdminShell>
  );
}
