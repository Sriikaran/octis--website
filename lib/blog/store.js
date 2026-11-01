import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { getDbPool } from '../db/pool';
import { BLOG_CATEGORIES, isCanonicalCategorySlug } from './categories';
import { BlogError } from './errors';
import { estimateReadingMinutes } from './format';
import {
  validateAuthorPayload,
  validateCategoryPayload,
  validatePostPayload,
} from './validate';
import { starterPosts } from './starterPosts';

const DATA_FILE = path.join(process.cwd(), 'data', 'blog.json');
const PAGE_SIZE_DEFAULT = 6;

let fileLock = Promise.resolve();
function withFileLock(fn) {
  const run = fileLock.then(fn, fn);
  fileLock = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

function nowIso() {
  return new Date().toISOString();
}

function newId(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
}

function defaultAuthor() {
  const now = nowIso();
  return {
    id: 'author_octis_editorial',
    name: 'Octis Editorial',
    slug: 'octis-editorial',
    bio: 'The editorial desk for the Octis website. Articles appear here only after they are published from the admin desk.',
    avatar: '',
    designation: 'Octis',
    createdAt: now,
    updatedAt: now,
  };
}

function blankState() {
  return { categories: [], authors: [], posts: [], starterSeeded: false };
}

function ensureCanonical(state) {
  let changed = false;
  BLOG_CATEGORIES.forEach((category, index) => {
    if (!state.categories.some((item) => item.slug === category.slug)) {
      state.categories.push({
        id: `cat_${category.slug}`,
        name: category.name,
        slug: category.slug,
        description: category.description,
        sortOrder: index,
      });
      changed = true;
    }
  });
  if (!state.authors.some((author) => author.slug === 'octis-editorial')) {
    state.authors.push(defaultAuthor());
    changed = true;
  }
  if (!state.starterSeeded && state.posts.length === 0) {
    state.posts.push(...starterPosts());
    state.starterSeeded = true;
    changed = true;
  }
  state.categories.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  return changed;
}

function isPublic(post, at = new Date()) {
  if (!post) return false;
  if (post.status === 'published') return true;
  if (post.status === 'scheduled' && post.publishedAt && new Date(post.publishedAt) <= at) return true;
  return false;
}

function categoryOf(state, id) {
  return state.categories.find((category) => category.id === id) || null;
}

function authorOf(state, id) {
  return state.authors.find((author) => author.id === id) || null;
}

function toSummary(state, post) {
  const category = categoryOf(state, post.categoryId);
  const author = authorOf(state, post.authorId);
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage || '',
    category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
    author: author
      ? { id: author.id, name: author.name, slug: author.slug, designation: author.designation || '' }
      : null,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    readingTime: estimateReadingMinutes(`${post.title} ${post.excerpt} ${post.content}`),
    featured: Boolean(post.featured),
  };
}

function toAdmin(state, post) {
  return {
    ...toSummary(state, post),
    content: post.content,
    status: post.status,
    seoTitle: post.seoTitle || '',
    seoDescription: post.seoDescription || '',
    keywords: post.keywords || [],
    createdAt: post.createdAt,
    categoryId: post.categoryId,
    authorId: post.authorId,
  };
}

function publicPosts(state) {
  return state.posts
    .filter((post) => isPublic(post))
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
}

function requireRefs(state, value) {
  if (!categoryOf(state, value.categoryId)) {
    throw new BlogError(400, 'VALIDATION_FAILED', 'Choose a category.', { categoryId: 'Choose a category.' });
  }
  if (!authorOf(state, value.authorId)) {
    throw new BlogError(400, 'VALIDATION_FAILED', 'Choose an author.', { authorId: 'Choose an author.' });
  }
}

function assertUniqueSlug(state, slug, ignoreId) {
  if (state.posts.some((post) => post.slug === slug && post.id !== ignoreId)) {
    throw new BlogError(409, 'SLUG_TAKEN', 'Another article already uses that slug.', { slug: 'Slug is already in use.' });
  }
}

function listPublicFromState(state, { page = 1, pageSize = PAGE_SIZE_DEFAULT, q = '', categorySlug = '', authorSlug = '' }) {
  const size = Math.min(12, Math.max(1, Number(pageSize) || PAGE_SIZE_DEFAULT));
  let category = null;
  let author = null;
  if (categorySlug) {
    category = state.categories.find((item) => item.slug === categorySlug) || null;
    if (!category) return null;
  }
  if (authorSlug) {
    author = state.authors.find((item) => item.slug === authorSlug) || null;
    if (!author) return null;
  }

  let posts = publicPosts(state);
  if (category) posts = posts.filter((post) => post.categoryId === category.id);
  if (author) posts = posts.filter((post) => post.authorId === author.id);

  const query = String(q || '').trim().slice(0, 120);
  if (query) {
    const needle = query.toLowerCase();
    posts = posts.filter((post) => {
      const cat = categoryOf(state, post.categoryId);
      return [post.title, post.excerpt, post.content, cat?.name || '', cat?.slug || ''].join('\n').toLowerCase().includes(needle);
    });
  }

  const requestedPage = Number(page) || 1;
  const featured =
    !query && !category && !author && requestedPage === 1 ? posts.find((post) => post.featured) || null : null;
  const grid = featured ? posts.filter((post) => post.id !== featured.id) : posts;
  const total = grid.length;
  const totalPages = Math.max(1, Math.ceil(total / size) || 1);
  const safePage = Math.min(Math.max(1, requestedPage), totalPages);
  const start = (safePage - 1) * size;

  return {
    posts: grid.slice(start, start + size).map((post) => toSummary(state, post)),
    featured: featured ? toSummary(state, featured) : null,
    page: safePage,
    pageSize: size,
    totalPages,
    total,
    q: query,
    category: category
      ? { id: category.id, name: category.name, slug: category.slug, description: category.description }
      : null,
    author: author
      ? {
          id: author.id,
          name: author.name,
          slug: author.slug,
          bio: author.bio,
          avatar: author.avatar,
          designation: author.designation,
        }
      : null,
  };
}

function articleFromState(state, slug) {
  const post = state.posts.find((item) => item.slug === slug);
  if (!post || !isPublic(post)) return null;
  const visible = publicPosts(state);
  const index = visible.findIndex((item) => item.id === post.id);
  const newer = index > 0 ? visible[index - 1] : null;
  const older = index >= 0 && index < visible.length - 1 ? visible[index + 1] : null;
  const related = visible.filter((item) => item.categoryId === post.categoryId && item.id !== post.id).slice(0, 3);
  return {
    article: toAdmin(state, post),
    previous: older ? toSummary(state, older) : null,
    next: newer ? toSummary(state, newer) : null,
    related: related.map((item) => toSummary(state, item)),
  };
}

async function readFileState() {
  try {
    const raw = await fs.promises.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      authors: Array.isArray(parsed.authors) ? parsed.authors : [],
      posts: Array.isArray(parsed.posts) ? parsed.posts : [],
      starterSeeded: Boolean(parsed.starterSeeded),
    };
  } catch (err) {
    if (err.code === 'ENOENT') return blankState();
    throw err;
  }
}

async function writeFileState(state) {
  await fs.promises.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const payload = {
    categories: state.categories,
    authors: state.authors,
    posts: state.posts,
    starterSeeded: Boolean(state.starterSeeded),
  };
  const temp = `${DATA_FILE}.tmp-${process.pid}-${Date.now()}`;
  await fs.promises.writeFile(temp, JSON.stringify(payload, null, 2), 'utf8');
  await fs.promises.rename(temp, DATA_FILE);
}

function isReadOnlyFs(err) {
  if (!err) return false;
  if (err.code === 'EROFS' || err.code === 'EACCES' || err.code === 'EPERM' || err.code === 'ENOTSUP') return true;
  return typeof err.message === 'string' && /read-only file system/i.test(err.message);
}

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS blog_authors (
  id VARCHAR(40) PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(80) UNIQUE NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  avatar VARCHAR(300) NOT NULL DEFAULT '',
  designation VARCHAR(80) NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS blog_categories (
  id VARCHAR(40) PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(80) UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS blog_posts (
  id VARCHAR(40) PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  slug VARCHAR(80) UNIQUE NOT NULL,
  excerpt VARCHAR(320) NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  cover_image VARCHAR(300) NOT NULL DEFAULT '',
  category_id VARCHAR(40) NOT NULL REFERENCES blog_categories(id),
  author_id VARCHAR(40) NOT NULL REFERENCES blog_authors(id),
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  seo_title VARCHAR(70) NOT NULL DEFAULT '',
  seo_description VARCHAR(160) NOT NULL DEFAULT '',
  keywords TEXT NOT NULL DEFAULT '[]',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT blog_posts_status_check CHECK (status IN ('draft', 'published', 'scheduled'))
);
CREATE INDEX IF NOT EXISTS blog_posts_status_published_idx ON blog_posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON blog_posts (category_id);
CREATE INDEX IF NOT EXISTS blog_posts_author_idx ON blog_posts (author_id);
`;

let schemaReady = null;
async function ensurePgSchema(pool) {
  if (!schemaReady) {
    schemaReady = (async () => {
      const client = await pool.connect();
      try {
        const statements = SCHEMA_SQL.split(';').map((statement) => statement.trim()).filter(Boolean);
        for (const statement of statements) {
          await client.query(statement);
        }
      } catch (err) {
        schemaReady = null;
        throw err;
      } finally {
        client.release();
      }
    })();
  }
  await schemaReady;
}

function mapCategory(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    sortOrder: row.sort_order || 0,
  };
}

function mapAuthor(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    bio: row.bio || '',
    avatar: row.avatar || '',
    designation: row.designation || '',
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function mapPost(row) {
  let keywords = [];
  try {
    keywords = JSON.parse(row.keywords || '[]');
  } catch (err) {
    keywords = [];
  }
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || '',
    content: row.content || '',
    coverImage: row.cover_image || '',
    categoryId: row.category_id,
    authorId: row.author_id,
    status: row.status,
    featured: Boolean(row.featured),
    seoTitle: row.seo_title || '',
    seoDescription: row.seo_description || '',
    keywords: Array.isArray(keywords) ? keywords : [],
    publishedAt: row.published_at ? new Date(row.published_at).toISOString() : null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

async function readPg(client) {
  const [categories, authors, posts] = await Promise.all([
    client.query('SELECT id, name, slug, description, sort_order FROM blog_categories'),
    client.query('SELECT id, name, slug, bio, avatar, designation, created_at, updated_at FROM blog_authors'),
    client.query('SELECT * FROM blog_posts'),
  ]);
  return {
    categories: categories.rows.map(mapCategory),
    authors: authors.rows.map(mapAuthor),
    posts: posts.rows.map(mapPost),
  };
}

async function writePg(client, state) {
  await client.query('DELETE FROM blog_posts');
  await client.query('DELETE FROM blog_authors');
  await client.query('DELETE FROM blog_categories');
  for (const category of state.categories) {
    await client.query(
      'INSERT INTO blog_categories (id, name, slug, description, sort_order) VALUES ($1, $2, $3, $4, $5)',
      [category.id, category.name, category.slug, category.description || '', category.sortOrder || 0]
    );
  }
  for (const author of state.authors) {
    await client.query(
      `INSERT INTO blog_authors (id, name, slug, bio, avatar, designation, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [author.id, author.name, author.slug, author.bio || '', author.avatar || '', author.designation || '', author.createdAt, author.updatedAt]
    );
  }
  for (const post of state.posts) {
    await client.query(
      `INSERT INTO blog_posts (
        id, title, slug, excerpt, content, cover_image, category_id, author_id, status, featured,
        seo_title, seo_description, keywords, published_at, created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      [
        post.id,
        post.title,
        post.slug,
        post.excerpt || '',
        post.content || '',
        post.coverImage || '',
        post.categoryId,
        post.authorId,
        post.status,
        Boolean(post.featured),
        post.seoTitle || '',
        post.seoDescription || '',
        JSON.stringify(post.keywords || []),
        post.publishedAt,
        post.createdAt,
        post.updatedAt,
      ]
    );
  }
}

async function mutate(fn) {
  const pool = getDbPool();
  if (!pool) {
    return withFileLock(async () => {
      const state = await readFileState();
      const seeded = ensureCanonical(state);
      const result = await fn(state);
      if (seeded || result.save) {
        try {
          await writeFileState(state);
        } catch (err) {
          // Serverless hosts cannot persist data/blog.json. Public reads still use the in-memory catalogue.
          if (!isReadOnlyFs(err) || result.save) throw err;
        }
      }
      return result.value;
    });
  }

  await ensurePgSchema(pool);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(884212)');
    const state = await readPg(client);
    const seeded = ensureCanonical(state);
    const result = await fn(state);
    if (seeded || result.save) await writePg(client, state);
    await client.query('COMMIT');
    return result.value;
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      /* ignore */
    }
    throw err;
  } finally {
    client.release();
  }
}

async function read(fn) {
  return mutate(async (state) => ({ save: false, value: await fn(state) }));
}

export function listCategoriesPublic() {
  return read((state) =>
    state.categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
    }))
  );
}

export function listPublicPosts(options) {
  return read((state) => listPublicFromState(state, options));
}

export function getPublicArticle(slug) {
  return read((state) => articleFromState(state, slug));
}

export function listSitemapEntries() {
  return read((state) => {
    const posts = publicPosts(state).map((post) => ({
      path: `/blogs/${post.slug}`,
      updatedAt: post.updatedAt,
    }));
    const categories = state.categories.map((category) => ({
      path: `/blogs/category/${category.slug}`,
      updatedAt: null,
    }));
    const authors = state.authors
      .filter((author) => state.posts.some((post) => post.authorId === author.id && isPublic(post)))
      .map((author) => ({ path: `/blogs/author/${author.slug}`, updatedAt: null }));
    return { posts, categories, authors };
  });
}

export function adminList() {
  return read((state) => ({
    posts: [...state.posts]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .map((post) => toAdmin(state, post)),
    categories: state.categories,
    authors: state.authors,
  }));
}

export function adminGet(id) {
  return read((state) => {
    const post = state.posts.find((item) => item.id === id);
    if (!post) throw new BlogError(404, 'NOT_FOUND', 'Article not found.');
    return toAdmin(state, post);
  });
}

export function createPost(input) {
  return mutate((state) => {
    const value = validatePostPayload(input);
    if (value.status !== 'draft') requireRefs(state, value);
    else {
      if (!value.categoryId) value.categoryId = state.categories[0]?.id || '';
      if (!value.authorId) value.authorId = state.authors[0]?.id || '';
      requireRefs(state, value);
    }
    assertUniqueSlug(state, value.slug);
    if (value.featured) state.posts.forEach((post) => { post.featured = false; });
    const now = nowIso();
    const post = { id: newId('post'), ...value, createdAt: now, updatedAt: now };
    state.posts.push(post);
    return { save: true, value: toAdmin(state, post) };
  });
}

export function updatePost(id, input) {
  return mutate((state) => {
    const existing = state.posts.find((post) => post.id === id);
    if (!existing) throw new BlogError(404, 'NOT_FOUND', 'Article not found.');
    const value = validatePostPayload({ ...existing, ...input, status: input.status || existing.status }, { existing });
    requireRefs(state, value);
    assertUniqueSlug(state, value.slug, id);
    if (value.featured) state.posts.forEach((post) => { if (post.id !== id) post.featured = false; });
    Object.assign(existing, value, { updatedAt: nowIso() });
    return { save: true, value: toAdmin(state, existing) };
  });
}

export function deletePost(id) {
  return mutate((state) => {
    const index = state.posts.findIndex((post) => post.id === id);
    if (index === -1) throw new BlogError(404, 'NOT_FOUND', 'Article not found.');
    state.posts.splice(index, 1);
    return { save: true, value: { deleted: true } };
  });
}

export function createCategory(input) {
  return mutate((state) => {
    const value = validateCategoryPayload(input, { creating: true });
    if (state.categories.some((category) => category.slug === value.slug)) {
      throw new BlogError(409, 'SLUG_TAKEN', 'A category with that slug already exists.');
    }
    const category = {
      id: newId('cat'),
      name: value.name,
      slug: value.slug,
      description: value.description,
      sortOrder: state.categories.reduce((max, item) => Math.max(max, item.sortOrder || 0), 0) + 1,
    };
    state.categories.push(category);
    return { save: true, value: category };
  });
}

export function updateCategory(id, input) {
  return mutate((state) => {
    const category = state.categories.find((item) => item.id === id);
    if (!category) throw new BlogError(404, 'NOT_FOUND', 'Category not found.');
    const value = validateCategoryPayload(input);
    category.name = value.name;
    category.description = value.description;
    return { save: true, value: category };
  });
}

export function deleteCategory(id) {
  return mutate((state) => {
    const category = state.categories.find((item) => item.id === id);
    if (!category) throw new BlogError(404, 'NOT_FOUND', 'Category not found.');
    if (isCanonicalCategorySlug(category.slug)) {
      throw new BlogError(400, 'CATEGORY_REQUIRED', 'This category is part of the site navigation and cannot be deleted.');
    }
    if (state.posts.some((post) => post.categoryId === id)) {
      throw new BlogError(400, 'CATEGORY_IN_USE', 'Move or delete the articles in this category first.');
    }
    state.categories = state.categories.filter((item) => item.id !== id);
    return { save: true, value: { deleted: true } };
  });
}

export function createAuthor(input) {
  return mutate((state) => {
    const value = validateAuthorPayload(input, { creating: true });
    if (state.authors.some((author) => author.slug === value.slug)) {
      throw new BlogError(409, 'SLUG_TAKEN', 'An author with that slug already exists.');
    }
    const now = nowIso();
    const author = {
      id: newId('author'),
      name: value.name,
      slug: value.slug,
      bio: value.bio,
      avatar: value.avatar,
      designation: value.designation,
      createdAt: now,
      updatedAt: now,
    };
    state.authors.push(author);
    return { save: true, value: author };
  });
}

export function updateAuthor(id, input) {
  return mutate((state) => {
    const author = state.authors.find((item) => item.id === id);
    if (!author) throw new BlogError(404, 'NOT_FOUND', 'Author not found.');
    const value = validateAuthorPayload({ ...author, ...input });
    author.name = value.name;
    author.bio = value.bio;
    author.designation = value.designation;
    if (input.avatar !== undefined) author.avatar = value.avatar;
    author.updatedAt = nowIso();
    return { save: true, value: author };
  });
}

export function deleteAuthor(id) {
  return mutate((state) => {
    const author = state.authors.find((item) => item.id === id);
    if (!author) throw new BlogError(404, 'NOT_FOUND', 'Author not found.');
    if (state.authors.length <= 1) {
      throw new BlogError(400, 'AUTHOR_REQUIRED', 'At least one author is required.');
    }
    if (state.posts.some((post) => post.authorId === id)) {
      throw new BlogError(400, 'AUTHOR_IN_USE', 'Reassign the articles by this author first.');
    }
    state.authors = state.authors.filter((item) => item.id !== id);
    return { save: true, value: { deleted: true } };
  });
}
