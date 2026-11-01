import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  FRESH_MS,
  GOLD_URL,
  SILVER_URL,
  SOURCE_NAME,
  STALE_MAX_MS,
  TROY_OUNCE_GRAMS,
  UNAVAILABLE_MESSAGE,
  buildVerifiedQuote,
  createFileCache,
  createMemoryCache,
  inrPerGramFromTroyOunce,
  isVerifiedQuote,
  resolveMetalRates,
  roundMoney,
} from '../lib/metalRatesService.js';

let passed = 0;
let failed = 0;

async function test(description, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`  [PASS] ${description}`);
  } catch (err) {
    failed += 1;
    console.error(`  [FAIL] ${description}`);
    console.error(err);
  }
}

function spotBodies(now, goldPerGram, silverPerGram, overrides = {}) {
  const updatedAt = new Date(now).toISOString();
  return {
    gold: {
      currency: 'INR',
      symbol: 'XAU',
      name: 'Gold',
      price: goldPerGram * TROY_OUNCE_GRAMS,
      updatedAt,
      ...overrides.gold,
    },
    silver: {
      currency: 'INR',
      symbol: 'XAG',
      name: 'Silver',
      price: silverPerGram * TROY_OUNCE_GRAMS,
      updatedAt,
      ...overrides.silver,
    },
  };
}

function mockFetch(goldBody, silverBody, options = {}) {
  const calls = [];
  const impl = async (url) => {
    calls.push(url);
    if (options.fail) {
      if (options.fail === 'timeout') {
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => resolve({ ok: true, status: 200, json: async () => goldBody }), 5000);
          options.signalWait?.(timer, resolve, reject);
        });
      }
      throw new Error('forced failure');
    }
    const ok = options.ok !== false;
    const body = String(url).includes('/XAG/') ? silverBody : goldBody;
    return {
      ok,
      status: options.status || (ok ? 200 : 503),
      async json() {
        if (options.badJson) throw new Error('not json');
        return body;
      },
    };
  };
  impl.calls = calls;
  return impl;
}

function hangingFetch() {
  const calls = [];
  const impl = (url, init) => new Promise((resolve, reject) => {
    calls.push(url);
    const timer = setTimeout(() => resolve({ ok: true, status: 200, json: async () => ({}) }), 5000);
    init?.signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      const error = new Error('aborted');
      error.name = 'AbortError';
      reject(error);
    });
  });
  impl.calls = calls;
  return impl;
}

async function main() {
  console.log('=== METAL RATE SERVICE TESTS (mocked upstream unless marked UPSTREAM) ===\n');
  const now = Date.parse('2026-10-31T19:30:00.000Z');

  await test('converts troy ounces to grams and does not apply GST', () => {
    const perGram = inrPerGramFromTroyOunce(10000 * TROY_OUNCE_GRAMS);
    assert.equal(perGram, 10000);
    assert.notEqual(roundMoney(perGram * 1.03), roundMoney(perGram));
    assert.equal(TROY_OUNCE_GRAMS, 31.1034768);
  });

  await test('valid upstream response builds 24K, calculated 22K, and silver per gram and kilogram', () => {
    const bodies = spotBodies(now, 10000, 100);
    const quote = buildVerifiedQuote({
      goldBody: bodies.gold,
      silverBody: bodies.silver,
      fetchedAt: new Date(now).toISOString(),
    });
    assert.equal(quote.metals.gold24k.price, 10000);
    assert.equal(quote.metals.gold24k.currency, 'INR');
    assert.equal(quote.metals.gold24k.unit, 'g');
    assert.equal(quote.metals.gold24k.derived, false);
    assert.equal(quote.metals.gold22k.price, 9166.67);
    assert.equal(quote.metals.gold22k.derived, true);
    assert.match(quote.metals.gold22k.methodology, /22\/24/);
    assert.equal(quote.metals.silver.price, 100);
    assert.equal(quote.metals.silver.unit, 'g');
    assert.equal(quote.metals.silverPerKg.price, 100000);
    assert.equal(quote.metals.silverPerKg.unit, 'kg');
    assert.equal(quote.metals.silverPerKg.derived, true);
    assert.equal(quote.gstIncluded, false);
    assert.equal(quote.metals.gold18k, undefined);
  });

  await test('resolve marks a valid fetch as live and keeps the source name', async () => {
    const bodies = spotBodies(now, 12000, 150);
    const fetchImpl = mockFetch(bodies.gold, bodies.silver);
    const payload = await resolveMetalRates({
      now,
      cache: createMemoryCache(),
      fetchImpl,
      timeoutMs: 1000,
    });
    assert.equal(payload.dataStatus, 'live');
    assert.equal(payload.ok, true);
    assert.equal(payload.source, SOURCE_NAME);
    assert.equal(payload.gstIncluded, false);
    assert.equal(payload.metals.gold24k.price, 12000);
    assert.equal(payload.metals.gold24k.dataStatus, 'live');
    assert.equal(payload.label, 'Live spot quote');
    assert.deepEqual(fetchImpl.calls, [GOLD_URL, SILVER_URL]);
    assert.equal(GOLD_URL.includes('key'), false);
    assert.equal(SILVER_URL.includes('key'), false);
  });

  await test('missing price field does not produce a number', async () => {
    const bodies = spotBodies(now, 12000, 150);
    delete bodies.gold.price;
    const payload = await resolveMetalRates({
      now,
      cache: createMemoryCache(),
      fetchImpl: mockFetch(bodies.gold, bodies.silver),
    });
    assert.equal(payload.dataStatus, 'unavailable');
    assert.equal(payload.message, UNAVAILABLE_MESSAGE);
    assert.equal(payload.metals, null);
  });

  await test('invalid numeric prices are rejected', async () => {
    for (const price of [NaN, Infinity, -5, 0, 'nope', '', null, true, '12abc']) {
      const bodies = spotBodies(now, 12000, 150);
      bodies.gold.price = price;
      const payload = await resolveMetalRates({
        now,
        cache: createMemoryCache(),
        fetchImpl: mockFetch(bodies.gold, bodies.silver),
      });
      assert.equal(payload.dataStatus, 'unavailable', `price ${String(price)} should be unavailable`);
      assert.equal(payload.metals, null);
    }
  });

  await test('non-INR currency is rejected', async () => {
    const bodies = spotBodies(now, 12000, 150, { gold: { currency: 'USD' } });
    const payload = await resolveMetalRates({
      now,
      cache: createMemoryCache(),
      fetchImpl: mockFetch(bodies.gold, bodies.silver),
    });
    assert.equal(payload.dataStatus, 'unavailable');
    assert.equal(payload.metals, null);
  });

  await test('invalid JSON and HTTP errors do not invent prices', async () => {
    const bodies = spotBodies(now, 12000, 150);
    const invalid = await resolveMetalRates({
      now,
      cache: createMemoryCache(),
      fetchImpl: mockFetch(bodies.gold, bodies.silver, { badJson: true }),
    });
    const httpError = await resolveMetalRates({
      now,
      cache: createMemoryCache(),
      fetchImpl: mockFetch(bodies.gold, bodies.silver, { ok: false, status: 502 }),
    });
    assert.equal(invalid.dataStatus, 'unavailable');
    assert.equal(httpError.dataStatus, 'unavailable');
    assert.equal(httpError.message, UNAVAILABLE_MESSAGE);
    assert.equal(JSON.stringify(httpError).includes('73450'), false);
  });

  await test('upstream timeout returns unavailable', async () => {
    const payload = await resolveMetalRates({
      now,
      cache: createMemoryCache(),
      fetchImpl: hangingFetch(),
      timeoutMs: 30,
    });
    assert.equal(payload.dataStatus, 'unavailable');
    assert.equal(payload.metals, null);
  });

  await test('a fresh verified cache is reused and not labelled live', async () => {
    const bodies = spotBodies(now, 11000, 140);
    const quote = buildVerifiedQuote({
      goldBody: bodies.gold,
      silverBody: bodies.silver,
      fetchedAt: new Date(now - 10_000).toISOString(),
    });
    const fetchImpl = mockFetch(bodies.gold, bodies.silver);
    const payload = await resolveMetalRates({
      now,
      cache: createMemoryCache({ quote, lastAttemptAt: quote.fetchedAt }),
      fetchImpl,
    });
    assert.equal(payload.dataStatus, 'cached');
    assert.equal(payload.label, 'Cached spot quote');
    assert.equal(payload.metals.gold24k.price, 11000);
    assert.equal(payload.fetchedAt, quote.fetchedAt);
    assert.equal(fetchImpl.calls.length, 0);
  });

  await test('refresh during the cooldown does not call upstream', async () => {
    const bodies = spotBodies(now, 11000, 140);
    const quote = buildVerifiedQuote({
      goldBody: bodies.gold,
      silverBody: bodies.silver,
      fetchedAt: new Date(now - 15_000).toISOString(),
    });
    const fetchImpl = mockFetch(bodies.gold, bodies.silver);
    const payload = await resolveMetalRates({
      refresh: true,
      now,
      cache: createMemoryCache({ quote, lastAttemptAt: quote.fetchedAt }),
      fetchImpl,
    });
    assert.equal(payload.dataStatus, 'cached');
    assert.equal(payload.refreshCooldown, true);
    assert.ok(payload.nextRefreshSeconds > 0);
    assert.equal(fetchImpl.calls.length, 0);
  });

  await test('an expired fresh window fetches again', async () => {
    const oldNow = now - (FRESH_MS + 5000);
    const oldBodies = spotBodies(oldNow, 10000, 100);
    const quote = buildVerifiedQuote({
      goldBody: oldBodies.gold,
      silverBody: oldBodies.silver,
      fetchedAt: new Date(oldNow).toISOString(),
    });
    const nextBodies = spotBodies(now, 13000, 160);
    const fetchImpl = mockFetch(nextBodies.gold, nextBodies.silver);
    const payload = await resolveMetalRates({
      now,
      cache: createMemoryCache({ quote, lastAttemptAt: quote.fetchedAt }),
      fetchImpl,
    });
    assert.equal(payload.dataStatus, 'live');
    assert.equal(payload.metals.gold24k.price, 13000);
    assert.equal(fetchImpl.calls.length, 2);
  });

  await test('upstream failure with a verified quote inside six hours is stale, not live', async () => {
    const oldNow = now - (2 * 60 * 60 * 1000);
    const bodies = spotBodies(oldNow, 10500, 130);
    const quote = buildVerifiedQuote({
      goldBody: bodies.gold,
      silverBody: bodies.silver,
      fetchedAt: new Date(oldNow).toISOString(),
    });
    const fetchImpl = mockFetch(bodies.gold, bodies.silver, { ok: false, status: 500 });
    const payload = await resolveMetalRates({
      now,
      cache: createMemoryCache({ quote, lastAttemptAt: quote.fetchedAt }),
      fetchImpl,
    });
    assert.equal(payload.dataStatus, 'stale');
    assert.equal(payload.label, 'Stale spot quote');
    assert.notEqual(payload.label, 'Live spot quote');
    assert.equal(payload.metals.gold24k.price, 10500);
    assert.equal(payload.fetchedAt, quote.fetchedAt);
    assert.equal(payload.sourceUpdatedAt, quote.sourceUpdatedAt);
  });

  await test('a quote older than the stale window is not shown when upstream fails', async () => {
    const oldNow = now - (STALE_MAX_MS + 60 * 1000);
    const bodies = spotBodies(oldNow, 10500, 130);
    const quote = buildVerifiedQuote({
      goldBody: bodies.gold,
      silverBody: bodies.silver,
      fetchedAt: new Date(oldNow).toISOString(),
    });
    const payload = await resolveMetalRates({
      now,
      cache: createMemoryCache({ quote, lastAttemptAt: quote.fetchedAt }),
      fetchImpl: mockFetch(bodies.gold, bodies.silver, { ok: false, status: 500 }),
    });
    assert.equal(payload.dataStatus, 'unavailable');
    assert.equal(payload.metals, null);
    assert.equal(payload.message, UNAVAILABLE_MESSAGE);
  });

  await test('no live data and no cache returns the unavailable sentence only', async () => {
    const payload = await resolveMetalRates({
      now,
      cache: createMemoryCache(),
      fetchImpl: mockFetch({}, {}, { ok: false, status: 503 }),
    });
    assert.equal(payload.ok, false);
    assert.equal(payload.message, UNAVAILABLE_MESSAGE);
    assert.equal(payload.metals, null);
    assert.equal(payload.source, null);
  });

  await test('a failed attempt starts the cooldown and the next call does not retry immediately', async () => {
    const fetchImpl = mockFetch({}, {}, { ok: false, status: 503 });
    const cache = createMemoryCache();
    const first = await resolveMetalRates({ now, cache, fetchImpl });
    const second = await resolveMetalRates({ now: now + 1000, cache, fetchImpl, refresh: true });
    assert.equal(first.dataStatus, 'unavailable');
    assert.equal(second.dataStatus, 'unavailable');
    assert.equal(second.refreshCooldown, true);
    assert.equal(fetchImpl.calls.length, 2);
  });

  await test('a provider timestamp older than two hours is not called live', async () => {
    const updatedAt = new Date(now - (3 * 60 * 60 * 1000)).toISOString();
    const bodies = spotBodies(now, 12000, 150, {
      gold: { updatedAt },
      silver: { updatedAt },
    });
    const payload = await resolveMetalRates({
      now,
      cache: createMemoryCache(),
      fetchImpl: mockFetch(bodies.gold, bodies.silver),
    });
    assert.equal(payload.dataStatus, 'stale');
    assert.notEqual(payload.dataStatus, 'live');
  });

  await test('a provider timestamp older than 72 hours is rejected', async () => {
    const updatedAt = new Date(now - (80 * 60 * 60 * 1000)).toISOString();
    const bodies = spotBodies(now, 12000, 150, {
      gold: { updatedAt },
      silver: { updatedAt },
    });
    assert.throws(
      () => buildVerifiedQuote({
        goldBody: bodies.gold,
        silverBody: bodies.silver,
        fetchedAt: new Date(now).toISOString(),
      }),
      /invalid_timestamp/
    );
  });

  await test('file cache round-trips a verified quote and ignores a corrupt file', async () => {
    const bodies = spotBodies(now, 12000, 150);
    const quote = buildVerifiedQuote({
      goldBody: bodies.gold,
      silverBody: bodies.silver,
      fetchedAt: new Date(now).toISOString(),
    });
    const file = path.join(os.tmpdir(), `octis-metal-${process.pid}-${now}.json`);
    const writer = createFileCache(file);
    await writer.write({ quote, lastAttemptAt: quote.fetchedAt });
    const reader = createFileCache(file);
    const stored = await reader.read();
    assert.equal(isVerifiedQuote(stored.quote), true);
    assert.equal(stored.quote.metals.gold24k.price, 12000);
    await fs.writeFile(file, '{', 'utf8');
    const broken = createFileCache(file);
    assert.equal(await broken.read(), null);
    await fs.rm(file, { force: true });
  });

  await test('source files do not contain the old hardcoded prices', async () => {
    const files = [
      'components/landing/LiveMetalPricesModal.js',
      'lib/metalRatesService.js',
      'pages/api/metal-rates.js',
    ];
    const banned = ['73450', '67325', '88500', '7450', '6830', '92000', 'MCX Reference', 'MetalPriceAPI', 'Reference Market Benchmark'];
    for (const file of files) {
      const text = await fs.readFile(new URL(`../${file}`, import.meta.url), 'utf8');
      for (const token of banned) {
        assert.equal(text.includes(token), false, `${file} still contains ${token}`);
      }
      assert.equal(text.includes('process.env'), false, `${file} should not read an API key`);
    }
    const modal = await fs.readFile(new URL('../components/landing/LiveMetalPricesModal.js', import.meta.url), 'utf8');
    assert.equal(modal.includes(UNAVAILABLE_MESSAGE), true);
    assert.equal(modal.includes('/api/metal-rates'), true);
  });

  console.log('\n=== UPSTREAM CONNECTIVITY (real Gold API, not mocked) ===\n');
  let upstreamOk = false;
  try {
    const live = await resolveMetalRates({
      refresh: true,
      cache: createMemoryCache(),
      timeoutMs: 25000,
    });
    if (live.dataStatus !== 'live') {
      console.log(JSON.stringify({ dataStatus: live.dataStatus, message: live.message }));
    }
    assert.equal(live.dataStatus, 'live');
    assert.equal(live.source, SOURCE_NAME);
    assert.equal(live.gstIncluded, false);
    assert.equal(live.metals.gold24k.derived, false);
    assert.equal(live.metals.gold22k.derived, true);
    assert.ok(live.metals.gold24k.price > 1000 && live.metals.gold24k.price < 500000);
    assert.ok(live.metals.silver.price > 1 && live.metals.silver.price < 20000);
    const ratio = live.metals.gold22k.price / live.metals.gold24k.price;
    assert.ok(Math.abs(ratio - (22 / 24)) < 0.001);
    console.log(JSON.stringify({
      dataStatus: live.dataStatus,
      source: live.source,
      sourceDetail: live.sourceDetail,
      gstIncluded: live.gstIncluded,
      currency: live.currency,
      sourceUpdatedAt: live.sourceUpdatedAt,
      fetchedAt: live.fetchedAt,
      gold24kInrPerGram: live.metals.gold24k.price,
      gold22kCalculatedInrPerGram: live.metals.gold22k.price,
      silverInrPerGram: live.metals.silver.price,
      silverInrPerKg: live.metals.silverPerKg.price,
    }, null, 2));
    upstreamOk = true;
    passed += 1;
    console.log('  [PASS] real Gold API INR spot quote');
  } catch (err) {
    failed += 1;
    console.error('  [FAIL] real Gold API INR spot quote');
    console.error(err);
  }

  console.log(`\nMETAL RATE TESTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(upstreamOk
    ? 'Upstream check: real provider responded with a verified INR spot quote.'
    : 'Upstream check: real provider did not return a usable quote. Mocked tests do not prove the provider is up.');
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
