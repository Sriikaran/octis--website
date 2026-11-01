import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export async function adminFetch(url, options = {}) {
  const key = sessionStorage.getItem('octis_admin_key') || '';
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    'x-admin-key': key,
    ...(options.headers || {}),
  };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

export default function AdminShell({ title, children }) {
  const [state, setState] = useState('checking');
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('octis_admin_key') || '';
    if (!saved) {
      setState('login');
      return;
    }
    fetch('/api/admin/blogs', { headers: { 'x-admin-key': saved } })
      .then((res) => {
        if (res.ok) setState('in');
        else {
          sessionStorage.removeItem('octis_admin_key');
          setState('login');
        }
      })
      .catch(() => setState('login'));
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError('');
    const key = keyInput.trim();
    const res = await fetch('/api/admin/blogs', { headers: { 'x-admin-key': key } });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      sessionStorage.setItem('octis_admin_key', key);
      setState('in');
    } else {
      setError(data.error || 'That admin key was not accepted.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Head>
        <title>{title} | Octis</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <header className="bg-[#1a2f4a] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs text-[#e8d7b0]">Octis admin</p>
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/admin/blogs" className="text-[#e8d7b0] hover:text-white">Blogs</Link>
            <Link href="/admin/demo-bookings" className="text-[#e8d7b0] hover:text-white">Demo bookings</Link>
            <Link href="/" className="text-[#e8d7b0] hover:text-white">Site</Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        {state === 'checking' && <p className="text-sm text-slate-500">Checking access…</p>}
        {state === 'login' && (
          <form onSubmit={submit} className="max-w-md rounded-xl border border-slate-200 bg-white p-6">
            <label htmlFor="admin-key" className="text-sm font-medium">Admin key</label>
            <input
              id="admin-key"
              type="password"
              value={keyInput}
              onChange={(event) => setKeyInput(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3"
              autoComplete="current-password"
            />
            {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
            <button type="submit" className="mt-4 h-10 rounded-md bg-[#1a2f4a] px-4 text-sm font-semibold text-white">
              Continue
            </button>
          </form>
        )}
        {state === 'in' ? children : null}
      </main>
    </div>
  );
}
