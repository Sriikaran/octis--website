import { BlogError } from './errors';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const RESERVED_SLUGS = new Set(['category', 'author', 'new', 'preview', 'api', 'admin']);
const STATUSES = new Set(['draft', 'published', 'scheduled']);
const COVER_RE = /^\/(?:uploads\/blog|landing)\/[a-zA-Z0-9][a-zA-Z0-9._-]{0,160}$/;

export function slugify(value) {
  return String(value || '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function cleanText(value, max) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export function assertSlug(slug, label = 'Slug') {
  if (!slug || !SLUG_RE.test(slug) || slug.length > 80) {
    throw new BlogError(400, 'VALIDATION_FAILED', `${label} must be lowercase words separated by hyphens.`, {
      slug: 'Use lowercase letters, numbers, and hyphens.',
    });
  }
  if (RESERVED_SLUGS.has(slug)) {
    throw new BlogError(400, 'VALIDATION_FAILED', `${label} is reserved.`, { slug: 'Choose a different slug.' });
  }
}

export function normalizeKeywords(value) {
  const list = Array.isArray(value)
    ? value
    : String(value || '')
        .split(',')
        .map((item) => item.trim());
  const unique = [];
  for (const item of list) {
    const word = cleanText(item, 40);
    if (!word || unique.includes(word)) continue;
    unique.push(word);
    if (unique.length >= 12) break;
  }
  return unique;
}

export function normalizeCover(value) {
  const cover = String(value || '').trim();
  if (!cover) return '';
  if (!COVER_RE.test(cover) || cover.includes('..')) {
    throw new BlogError(400, 'VALIDATION_FAILED', 'Cover image must be an uploaded blog image.', {
      coverImage: 'Upload a JPEG, PNG, or WebP image.',
    });
  }
  return cover;
}

export function validatePostPayload(input, { existing = null } = {}) {
  const source = input || {};
  const errors = {};
  const title = cleanText(source.title, 160);
  if (!title || title.length < 3) errors.title = 'Title must be at least 3 characters.';

  const requestedSlug = source.slug === undefined || source.slug === '' ? slugify(title) : slugify(source.slug);
  if (!requestedSlug || !SLUG_RE.test(requestedSlug)) errors.slug = 'Slug must use lowercase letters, numbers, and hyphens.';
  else if (RESERVED_SLUGS.has(requestedSlug)) errors.slug = 'That slug is reserved.';

  const status = source.status || existing?.status || 'draft';
  if (!STATUSES.has(status)) errors.status = 'Status must be draft, published, or scheduled.';

  const excerpt = String(source.excerpt || '').trim().slice(0, 320);
  const content = String(source.content || '').replace(/\r\n/g, '\n').slice(0, 100000);
  const publishing = status === 'published' || status === 'scheduled';
  if (publishing && excerpt.length < 20) errors.excerpt = 'Published articles need an excerpt of at least 20 characters.';
  if (publishing && content.trim().length < 20) errors.content = 'Published articles need a body of at least 20 characters.';

  let coverImage = existing?.coverImage || '';
  if (source.coverImage !== undefined) {
    try {
      coverImage = normalizeCover(source.coverImage);
    } catch (err) {
      errors.coverImage = err.fields?.coverImage || err.message;
    }
  }

  let publishedAt = existing?.publishedAt || null;
  if (status === 'published') {
    const current = publishedAt ? new Date(publishedAt) : null;
    if (!current || Number.isNaN(current.getTime()) || current.getTime() > Date.now()) {
      publishedAt = new Date().toISOString();
    }
  } else if (status === 'scheduled') {
    const when = new Date(source.publishedAt || '');
    const alreadyDue =
      existing?.status === 'scheduled' &&
      existing.publishedAt &&
      new Date(existing.publishedAt).getTime() <= Date.now() &&
      String(source.publishedAt || '') === String(existing.publishedAt);
    if (alreadyDue) {
      publishedAt = existing.publishedAt;
    } else if (Number.isNaN(when.getTime()) || when.getTime() <= Date.now() + 30 * 1000) {
      errors.publishedAt = 'Schedule a time at least a minute in the future.';
    } else {
      publishedAt = when.toISOString();
    }
  }

  if (Object.keys(errors).length) {
    throw new BlogError(400, 'VALIDATION_FAILED', 'Check the article fields and try again.', errors);
  }

  return {
    title,
    slug: requestedSlug,
    excerpt,
    content,
    coverImage,
    categoryId: String(source.categoryId || existing?.categoryId || ''),
    authorId: String(source.authorId || existing?.authorId || ''),
    status,
    featured: Boolean(source.featured) && status !== 'draft',
    seoTitle: cleanText(source.seoTitle, 70),
    seoDescription: cleanText(source.seoDescription, 160),
    keywords: normalizeKeywords(source.keywords),
    publishedAt,
  };
}

export function validateCategoryPayload(input, { creating = false } = {}) {
  const name = cleanText(input?.name, 80);
  const description = String(input?.description || '').trim().slice(0, 280);
  if (name.length < 2) {
    throw new BlogError(400, 'VALIDATION_FAILED', 'Category name is required.', { name: 'Enter a category name.' });
  }
  const slug = creating ? slugify(input?.slug || name) : undefined;
  if (creating) assertSlug(slug, 'Category slug');
  return { name, description, slug };
}

export function validateAuthorPayload(input, { creating = false } = {}) {
  const name = cleanText(input?.name, 80);
  const bio = String(input?.bio || '').trim().slice(0, 500);
  const designation = cleanText(input?.designation, 80);
  let avatar = '';
  if (name.length < 2) {
    throw new BlogError(400, 'VALIDATION_FAILED', 'Author name is required.', { name: 'Enter an author name.' });
  }
  if (input?.avatar) {
    avatar = normalizeCover(input.avatar);
  }
  const slug = creating ? slugify(input?.slug || name) : undefined;
  if (creating) assertSlug(slug, 'Author slug');
  return { name, bio, designation, avatar, slug };
}
