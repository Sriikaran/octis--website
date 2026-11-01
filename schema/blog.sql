-- =========================================================================
-- OCTIS MARKETING WEBSITE — BLOG SCHEMA
-- =========================================================================
-- Apply this only to the isolated marketing-site database
-- (the same database used for demo bookings, via DEMO_DATABASE_URL).
-- NEVER run this against the Octis Jewellery ERP production database.
-- Statements are additive. They do not drop or rewrite existing tables.
-- The website also applies these CREATE statements itself when Postgres
-- is configured. This file is the reviewed schema record.
-- =========================================================================

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
