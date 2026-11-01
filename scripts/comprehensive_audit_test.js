const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function makeRequest({ port, method = 'GET', urlPath, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port,
      path: urlPath,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      timeout: 8000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
          json,
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runAudit() {
  console.log('=== STARTING COMPREHENSIVE POST-EXTRACTION SECURITY & READINESS AUDIT ===\n');
  const port = 3012;

  console.log(`Starting Next.js production server on port ${port}...`);
  const server = spawn('npx', ['next', 'start', '-p', String(port)], {
    cwd: 'C:\\Users\\srika\\OneDrive\\Desktop\\octis-website',
    shell: true,
    env: {
      ...process.env,
      DEMO_ADMIN_KEY: 'test-audit-admin-secret-key-32chars!',
    },
  });

  server.stdout.on('data', (d) => {
    // quiet stdout unless needed
  });
  server.stderr.on('data', (d) => process.stderr.write(d.toString()));

  // Wait 4.5s for server to start
  await new Promise((r) => setTimeout(r, 4500));

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // ----------------------------------------------------
    // TEST SUITE 1: HTTP Security Headers
    // ----------------------------------------------------
    console.log('\n--- Test Suite 1: Security Headers ---');
    const homeRes = await makeRequest({ port, urlPath: '/' });
    assert(homeRes.statusCode === 200, 'Homepage returns HTTP 200');
    assert(homeRes.headers['x-frame-options'] === 'SAMEORIGIN', 'X-Frame-Options is SAMEORIGIN');
    assert(homeRes.headers['x-content-type-options'] === 'nosniff', 'X-Content-Type-Options is nosniff');
    assert(homeRes.headers['referrer-policy'] === 'strict-origin-when-cross-origin', 'Referrer-Policy is strict-origin-when-cross-origin');
    assert(Boolean(homeRes.headers['strict-transport-security']), 'Strict-Transport-Security header is present');
    assert(!homeRes.headers['x-powered-by'], 'X-Powered-By header is stripped (poweredByHeader: false)');

    // ----------------------------------------------------
    // TEST SUITE 2: Public SEO & Crawler Control
    // ----------------------------------------------------
    console.log('\n--- Test Suite 2: Public SEO & Crawler Control ---');
    const robotsRes = await makeRequest({ port, urlPath: '/robots.txt' });
    assert(robotsRes.statusCode === 200, '/robots.txt returns 200');
    assert(robotsRes.data.includes('Disallow: /admin/'), '/robots.txt disallows /admin/');
    assert(robotsRes.data.includes('Disallow: /api/'), '/robots.txt disallows /api/');

    const sitemapRes = await makeRequest({ port, urlPath: '/sitemap.xml' });
    assert(sitemapRes.statusCode === 200, '/sitemap.xml returns 200');
    assert(sitemapRes.data.includes('https://octis.in/products'), '/sitemap.xml includes /products');
    assert(!sitemapRes.data.includes('/products/jewellery-erp'), '/sitemap.xml omits retired product pages');
    assert(!sitemapRes.data.includes('/admin/'), '/sitemap.xml NEVER includes /admin/ paths');
    assert(!sitemapRes.data.includes('/api/'), '/sitemap.xml NEVER includes /api/ paths');

    const adminPageRes = await makeRequest({ port, urlPath: '/admin/demo-bookings' });
    assert(adminPageRes.statusCode === 200, '/admin/demo-bookings loads admin page');
    assert(adminPageRes.data.includes('noindex, nofollow'), '/admin/demo-bookings includes noindex, nofollow meta tag');

    // ----------------------------------------------------
    // TEST SUITE 3: Public Page Routing Verification
    // ----------------------------------------------------
    console.log('\n--- Test Suite 3: Public Pages Availability ---');
    const pages = [
      '/products',
      '/features',
      '/pricing',
      '/faq',
      '/blogs',
      '/contact',
      '/request-demo',
    ];
    for (const p of pages) {
      const res = await makeRequest({ port, urlPath: p });
      assert(res.statusCode === 200, `Page ${p} returns 200 OK`);
    }
    for (const retired of ['/products/jewellery-erp', '/products/pawnify', '/products/bulion']) {
      const res = await makeRequest({ port, urlPath: retired });
      assert(res.statusCode === 308, `${retired} redirects away from a separate product page`);
      assert(res.headers.location === '/products', `${retired} redirects to /products`);
    }

    // ----------------------------------------------------
    // TEST SUITE 4: Contact Form API Validation & Storage
    // ----------------------------------------------------
    console.log('\n--- Test Suite 4: Contact Form API & Persistence ---');
    // 4.1 Empty submission rejection
    const emptyContact = await makeRequest({ port, method: 'POST', urlPath: '/api/contact', body: {} });
    assert(emptyContact.statusCode === 400 && emptyContact.json?.code === 'VALIDATION_FAILED', 'Contact API rejects empty payload with 400');

    // 4.2 Bot honeypot rejection
    const botContact = await makeRequest({
      port,
      method: 'POST',
      urlPath: '/api/contact',
      body: { name: 'Bot Name', phone: '9876543210', website_url: 'http://spam.com' },
    });
    assert(botContact.statusCode === 400, 'Contact API rejects bot honeypot submission');

    // 4.3 Valid submission acceptance & persistence
    const testTimestamp = Date.now();
    const validContact = await makeRequest({
      port,
      method: 'POST',
      urlPath: '/api/contact',
      body: {
        name: `Audit Tester ${testTimestamp}`,
        showroomName: 'Royal Jewels Audit',
        phone: '9876543210',
        email: 'audit@example.com',
        city: 'Mumbai',
        product: 'jewellery-erp',
        message: 'Comprehensive audit test inquiry message.',
      },
    });
    assert(validContact.statusCode === 201 && validContact.json?.success === true, 'Contact API accepts valid inquiry with 201 Created');

    // 4.4 Verify written to demo_bookings.json
    const bookingsRaw = fs.readFileSync('C:\\Users\\srika\\OneDrive\\Desktop\\octis-website\\data\\demo_bookings.json', 'utf8');
    const bookingsData = JSON.parse(bookingsRaw);
    const foundEnquiry = (bookingsData.enquiries || []).find((e) => e.name === `Audit Tester ${testTimestamp}`);
    assert(Boolean(foundEnquiry), 'Contact inquiry is durably saved in data/demo_bookings.json');

    // ----------------------------------------------------
    // TEST SUITE 5: Demo Booking Availability & Slot Engine
    // ----------------------------------------------------
    console.log('\n--- Test Suite 5: Booking Slot Calculation ---');
    // Sunday rejection
    const sundayRes = await makeRequest({ port, urlPath: '/api/demo/availability?date=2026-11-08' }); // 2026-11-08 is a Sunday
    assert(sundayRes.statusCode === 200 && sundayRes.json?.isAvailableDay === false, 'Availability correctly rejects Sunday as non-working day');

    // Past date rejection
    const pastRes = await makeRequest({ port, urlPath: '/api/demo/availability?date=2020-01-01' });
    assert(pastRes.statusCode === 200 && pastRes.json?.isAvailableDay === false, 'Availability correctly rejects past dates');

    // Valid business day slots (e.g. 2026-11-10 Tuesday)
    const validDateRes = await makeRequest({ port, urlPath: '/api/demo/availability?date=2026-11-10' });
    assert(validDateRes.statusCode === 200 && validDateRes.json?.slots?.length === 11, 'Availability returns 11 slots (10:00 to 18:00 with 30m+15m)');

    // ----------------------------------------------------
    // TEST SUITE 6: Concurrency & Duplicate Booking Prevention
    // ----------------------------------------------------
    console.log('\n--- Test Suite 6: Atomic Reservation & Concurrency Defense ---');
    // Find an open date with available slots
    let targetDate = '2026-11-16'; // Monday
    let targetTime = '14:30';

    const availSlotsRes = await makeRequest({ port, urlPath: `/api/demo/availability?date=${targetDate}` });
    const openSlot = (availSlotsRes.json?.slots || []).find((s) => s.available);
    if (openSlot) {
      targetTime = openSlot.time;
    } else {
      targetDate = '2026-11-17';
      targetTime = '10:00';
    }

    // First booking reservation
    const booking1 = await makeRequest({
      port,
      method: 'POST',
      urlPath: '/api/demo/book',
      body: {
        name: 'First Applicant',
        showroomName: 'First Showroom',
        email: 'applicant1@example.com',
        phone: '9876543211',
        city: 'Hyderabad',
        product: 'jewellery-erp',
        date: targetDate,
        time: targetTime,
      },
    });
    assert(booking1.statusCode === 201 && booking1.json?.success === true, 'First applicant reserves slot with 201 Created');

    // Immediate second booking attempt on identical slot
    const booking2 = await makeRequest({
      port,
      method: 'POST',
      urlPath: '/api/demo/book',
      body: {
        name: 'Conflicting Applicant',
        showroomName: 'Second Showroom',
        email: 'applicant2@example.com',
        phone: '9876543212',
        city: 'Bangalore',
        product: 'jewellery-erp',
        date: targetDate,
        time: targetTime,
      },
    });
    assert(booking2.statusCode === 409 && booking2.json?.code === 'SLOT_UNAVAILABLE', 'Conflicting booking on same slot is REJECTED with 409 Conflict (SLOT_UNAVAILABLE)');

    // ----------------------------------------------------
    // TEST SUITE 7: Admin Security & Authorization
    // ----------------------------------------------------
    console.log('\n--- Test Suite 7: Admin Security & Access Control ---');
    // 7.1 Missing credentials
    const noAuth = await makeRequest({ port, urlPath: '/api/demo/bookings' });
    assert(noAuth.statusCode === 401 && noAuth.json?.code === 'MISSING_ADMIN_KEY', 'Admin bookings rejects unauthenticated request with 401');

    // 7.2 Query parameter credentials rejected (prevents URL query string leakage)
    const queryAuth = await makeRequest({ port, urlPath: '/api/demo/bookings?adminKey=octis-demo-secret-2026' });
    assert(queryAuth.statusCode === 401 && queryAuth.json?.code === 'MISSING_ADMIN_KEY', 'Admin bookings REJECTS adminKey in URL query parameters');

    // 7.3 Invalid admin key
    const badAuth = await makeRequest({
      port,
      urlPath: '/api/demo/bookings',
      headers: { 'x-admin-key': 'completely-wrong-key' },
    });
    assert(badAuth.statusCode === 401 && badAuth.json?.code === 'INVALID_ADMIN_KEY', 'Admin bookings REJECTS invalid secret key');

    // 7.4 Valid admin key via x-admin-key header
    const goodAuth = await makeRequest({
      port,
      urlPath: '/api/demo/bookings',
      headers: { 'x-admin-key': 'test-audit-admin-secret-key-32chars!' },
    });
    assert(goodAuth.statusCode === 200 && goodAuth.json?.success === true, 'Admin bookings ACCEPTS valid x-admin-key header');
    assert(Array.isArray(goodAuth.json?.bookings) && goodAuth.json.bookings.length > 0, 'Admin bookings returns list of appointments');

    // 7.5 Status update without auth rejected
    const updateNoAuth = await makeRequest({
      port,
      method: 'PATCH',
      urlPath: `/api/demo/bookings/${booking1.json.referenceId}`,
      body: { status: 'confirmed' },
    });
    assert(updateNoAuth.statusCode === 401, 'Status update rejected without admin key');

    // 7.6 Status update with valid auth accepted
    const updateAuth = await makeRequest({
      port,
      method: 'PATCH',
      urlPath: `/api/demo/bookings/${booking1.json.referenceId}`,
      headers: { 'x-admin-key': 'test-audit-admin-secret-key-32chars!' },
      body: { status: 'completed', reason: 'Demonstration completed successfully' },
    });
    assert(updateAuth.statusCode === 200 && updateAuth.json?.booking?.status === 'completed', 'Status update succeeds with valid admin key');
    assert(updateAuth.json.booking.auditHistory.length >= 2, 'Audit history tracks creation and administrative status update');

    // ----------------------------------------------------
    // TEST SUITE 8: Blogs
    // ----------------------------------------------------
    console.log('\n--- Test Suite 8: Blogs ---');
    const blogKey = 'test-audit-admin-secret-key-32chars!';
    const blogHeaders = { 'x-admin-key': blogKey };
    const createdIds = [];
    const stamp = Date.now();

    try {
      const blogsPage = await makeRequest({ port, urlPath: '/blogs' });
      assert(blogsPage.statusCode === 200, '/blogs returns 200');
      assert(blogsPage.data.includes('Blogs & Insights'), '/blogs renders the editorial heading');
      assert(blogsPage.data.includes('No articles yet') || blogsPage.data.includes('Read more') || blogsPage.data.includes('Read article'), '/blogs shows articles or the empty state');

      const noBlogAuth = await makeRequest({ port, method: 'POST', urlPath: '/api/admin/blogs', body: { title: 'Nope' } });
      assert(noBlogAuth.statusCode === 401 && noBlogAuth.json?.code === 'MISSING_ADMIN_KEY', 'Blog admin API rejects missing credentials');

      const queryBlogAuth = await makeRequest({ port, urlPath: `/api/admin/blogs?adminKey=${blogKey}` });
      assert(queryBlogAuth.statusCode === 401 && queryBlogAuth.json?.code === 'MISSING_ADMIN_KEY', 'Blog admin API rejects admin key in the query string');

      const badArticle = await makeRequest({
        port,
        method: 'POST',
        urlPath: '/api/admin/blogs',
        headers: blogHeaders,
        body: { title: 'No' },
      });
      assert(badArticle.statusCode === 400 && badArticle.json?.code === 'VALIDATION_FAILED', 'Blog admin rejects an invalid article');

      const categoryList = await makeRequest({ port, urlPath: '/api/admin/blogs', headers: blogHeaders });
      assert(categoryList.statusCode === 200, 'Blog admin list accepts the admin key');
      const categoryId = categoryList.json.categories.find((item) => item.slug === 'jewellery-technology')?.id;
      const authorId = categoryList.json.authors[0]?.id;
      assert(Boolean(categoryId && authorId), 'Canonical category and default author exist');

      const draft = await makeRequest({
        port,
        method: 'POST',
        urlPath: '/api/admin/blogs',
        headers: blogHeaders,
        body: {
          title: `Audit blog draft ${stamp}`,
          excerpt: 'A short draft that must stay off the public site.',
          content: 'Draft body that is long enough to publish later in this audit.',
          categoryId,
          authorId,
          status: 'draft',
        },
      });
      assert(draft.statusCode === 201 && draft.json?.post?.status === 'draft', 'Admin can save an article as a draft');
      const draftId = draft.json?.post?.id;
      const draftSlug = draft.json?.post?.slug;
      if (draftId) createdIds.push(draftId);

      const hidden = await makeRequest({ port, urlPath: `/blogs/${draftSlug}` });
      assert(hidden.statusCode === 404, 'Draft article is not publicly accessible');
      const hiddenApi = await makeRequest({ port, urlPath: `/api/blogs/${draftSlug}` });
      assert(hiddenApi.statusCode === 404, 'Draft article is not returned by the public API');

      const edited = await makeRequest({
        port,
        method: 'PATCH',
        urlPath: `/api/admin/blogs/${draftId}`,
        headers: blogHeaders,
        body: {
          title: `Audit blog edited ${stamp}`,
          excerpt: 'Edited excerpt that is long enough for publication in the audit.',
          content: `Edited body with the unique word auditzincphrase ${stamp}.\n\n<script>alert(1)</script>\n\n[click](javascript:alert(1))`,
          seoTitle: `Audit SEO ${stamp}`,
          seoDescription: 'Audit description for the published test article.',
          keywords: 'audit, jewellery',
          status: 'draft',
        },
      });
      assert(edited.statusCode === 200 && edited.json?.post?.title.includes('edited'), 'Admin can edit a draft');

      const published = await makeRequest({
        port,
        method: 'PATCH',
        urlPath: `/api/admin/blogs/${draftId}`,
        headers: blogHeaders,
        body: { status: 'published' },
      });
      assert(published.statusCode === 200 && published.json?.post?.status === 'published', 'Admin can publish an article');
      const liveSlug = published.json?.post?.slug;

      const livePage = await makeRequest({ port, urlPath: `/blogs/${liveSlug}` });
      assert(livePage.statusCode === 200, 'Published article opens on its slug');
      assert(livePage.data.includes('Audit SEO'), 'Article page uses the SEO title');
      assert(livePage.data.includes('rel="canonical"'), 'Article page includes a canonical URL');
      assert(livePage.data.includes('og:type') && livePage.data.includes('article'), 'Article page sets Open Graph type article');
      assert(livePage.data.includes('"@type":"Article"') || livePage.data.includes('"@type": "Article"'), 'Article page includes Article JSON-LD');
      assert(!livePage.data.includes('<script>alert(1)</script>'), 'Article HTML does not execute stored script markup');
      assert(!livePage.data.includes('href="javascript:'), 'Article HTML drops javascript: links');

      const listing = await makeRequest({ port, urlPath: '/api/blogs?pageSize=6' });
      assert(listing.statusCode === 200 && listing.json.posts.some((post) => post.slug === liveSlug) || listing.json.featured?.slug === liveSlug, 'Published article appears in the public listing');

      const search = await makeRequest({ port, urlPath: `/api/blogs?q=auditzincphrase` });
      assert(search.statusCode === 200 && search.json.total >= 1, 'Search matches article content');
      const emptySearch = await makeRequest({ port, urlPath: '/blogs?q=zzznomatchauditphrase' });
      assert(emptySearch.statusCode === 200 && emptySearch.data.includes('No articles match that search'), 'Search empty state is shown');

      const categoryPage = await makeRequest({ port, urlPath: '/blogs/category/jewellery-technology' });
      assert(categoryPage.statusCode === 200 && categoryPage.data.includes('Jewellery Technology'), 'Category page lists the category');
      const missingCategory = await makeRequest({ port, urlPath: '/blogs/category/not-a-real-category' });
      assert(missingCategory.statusCode === 404, 'Unknown category returns 404');

      const second = await makeRequest({
        port,
        method: 'POST',
        urlPath: '/api/admin/blogs',
        headers: blogHeaders,
        body: {
          title: `Audit blog related ${stamp}`,
          excerpt: 'A second published article used to check related articles.',
          content: 'Related article body that shares the jewellery technology category.',
          categoryId,
          authorId,
          status: 'published',
        },
      });
      assert(second.statusCode === 201, 'Admin can create a second published article');
      if (second.json?.post?.id) createdIds.push(second.json.post.id);
      const relatedPage = await makeRequest({ port, urlPath: `/blogs/${liveSlug}` });
      assert(relatedPage.data.includes(`Audit blog related ${stamp}`), 'Related articles include another article in the category');

      for (let i = 0; i < 5; i += 1) {
        const extra = await makeRequest({
          port,
          method: 'POST',
          urlPath: '/api/admin/blogs',
          headers: blogHeaders,
          body: {
            title: `Audit blog page ${stamp} ${i}`,
            excerpt: `Pagination excerpt ${i} long enough to publish.`,
            content: `Pagination body ${i} for the audit listing.`,
            categoryId,
            authorId,
            status: 'published',
          },
        });
        if (extra.json?.post?.id) createdIds.push(extra.json.post.id);
      }
      const pageTwo = await makeRequest({ port, urlPath: '/blogs?page=2' });
      assert(pageTwo.statusCode === 200 && pageTwo.data.includes('Page 2'), 'Pagination exposes a second page');

      const scheduled = await makeRequest({
        port,
        method: 'POST',
        urlPath: '/api/admin/blogs',
        headers: blogHeaders,
        body: {
          title: `Audit blog scheduled ${stamp}`,
          excerpt: 'This scheduled article should stay hidden until its time.',
          content: 'Scheduled body that is not public yet.',
          categoryId,
          authorId,
          status: 'scheduled',
          publishedAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        },
      });
      assert(scheduled.statusCode === 201 && scheduled.json?.post?.status === 'scheduled', 'Admin can schedule an article');
      if (scheduled.json?.post?.id) createdIds.push(scheduled.json.post.id);
      const scheduledHidden = await makeRequest({ port, urlPath: `/blogs/${scheduled.json?.post?.slug}` });
      assert(scheduledHidden.statusCode === 404, 'A future scheduled article is not public');

      const sitemapLive = await makeRequest({ port, urlPath: '/sitemap.xml' });
      assert(sitemapLive.data.includes(`/blogs/${liveSlug}`), 'Sitemap includes the published article');
      assert(!sitemapLive.data.includes(`/blogs/${scheduled.json?.post?.slug}`), 'Sitemap omits the scheduled article');
      assert(sitemapLive.data.includes('/blogs/category/jewellery-technology'), 'Sitemap includes category pages');
      assert(!sitemapLive.data.includes('/admin/'), 'Sitemap still excludes admin paths');

      const missingArticle = await makeRequest({ port, urlPath: '/blogs/this-article-does-not-exist' });
      assert(missingArticle.statusCode === 404, 'Missing article URLs return 404');

      const unpublished = await makeRequest({
        port,
        method: 'PATCH',
        urlPath: `/api/admin/blogs/${draftId}`,
        headers: blogHeaders,
        body: { status: 'draft' },
      });
      assert(unpublished.statusCode === 200 && unpublished.json?.post?.status === 'draft', 'Admin can unpublish an article');
      const gone = await makeRequest({ port, urlPath: `/blogs/${liveSlug}` });
      assert(gone.statusCode === 404, 'Unpublishing removes the article from the public site');
      const sitemapAfter = await makeRequest({ port, urlPath: '/sitemap.xml' });
      assert(!sitemapAfter.data.includes(`/blogs/${liveSlug}`), 'Sitemap drops an unpublished article');

      const badImage = await makeRequest({
        port,
        method: 'POST',
        urlPath: '/api/admin/blog-images',
        headers: blogHeaders,
        body: { mime: 'image/png', data: Buffer.from('not an image').toString('base64') },
      });
      assert(badImage.statusCode === 400, 'Image upload rejects a file that is not an image');
    } finally {
      for (const id of createdIds) {
        await makeRequest({ port, method: 'DELETE', urlPath: `/api/admin/blogs/${id}`, headers: blogHeaders });
      }
    }

    console.log(`\n======================================================`);
    console.log(`AUDIT TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`======================================================\n`);
  } catch (err) {
    console.error('Audit run encountered fatal error:', err);
    failed++;
  } finally {
    server.kill('SIGTERM');
  }
}

runAudit();
