import fs from 'fs';
import path from 'path';

/**
 * Homepage metal rates.
 *
 * Provider: Gold API (https://gold-api.com), real-time price endpoint.
 * No API key. Commercial display is permitted. Do not poll faster than the
 * provider's 30-second update; this service waits 60 seconds between calls.
 *
 * Endpoints (INR per troy ounce, not per gram):
 *   https://api.gold-api.com/price/XAU/INR
 *   https://api.gold-api.com/price/XAG/INR
 *
 * The INR figure is the provider's own spot quote. It is not converted again
 * with a second exchange rate. Grams use the troy ounce (31.1034768 g).
 * These are international spot prices. They are not a showroom board, not a
 * Hyderabad retail price, and not a digital-gold product quote. GST, making
 * charges, wastage, and local premiums are not included and are not added.
 * 22K is 24K × 22/24 and is labelled calculated. 18K is not offered.
 */

export const TROY_OUNCE_GRAMS = 31.1034768;
export const FRESH_MS = 60 * 1000;
export const STALE_MAX_MS = 6 * 60 * 60 * 1000;
export const SOURCE_STALE_MS = 2 * 60 * 60 * 1000;
export const SOURCE_MAX_AGE_MS = 72 * 60 * 60 * 1000;
export const UPSTREAM_TIMEOUT_MS = 20000;
export const GOLD_URL = 'https://api.gold-api.com/price/XAU/INR';
export const SILVER_URL = 'https://api.gold-api.com/price/XAG/INR';
export const SOURCE_NAME = 'Gold API';
export const UNAVAILABLE_MESSAGE = 'Live prices are currently unavailable.';

const GOLD_22_METHOD = '24K spot INR per gram × (22/24). Purity ratio only. Not an independently sourced 22K retail price.';
const SILVER_KG_METHOD = 'Fine silver INR per gram × 1000. The same spot quote, expressed per kilogram.';
const GOLD_MIN = 1000;
const GOLD_MAX = 500000;
const SILVER_MIN = 1;
const SILVER_MAX = 20000;

const DEFAULT_CACHE_FILE = path.join(process.cwd(), 'data', 'metal-rates-cache.json');

export function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function inrPerGramFromTroyOunce(pricePerTroyOunce) {
  if (!Number.isFinite(pricePerTroyOunce) || pricePerTroyOunce <= 0) {
    throw new Error('invalid_price');
  }
  return pricePerTroyOunce / TROY_OUNCE_GRAMS;
}

function reject(code) {
  const error = new Error(code);
  error.code = code;
  throw error;
}

function parseUpstream(body, expectedSymbol, now) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) reject('invalid_upstream');
  if (body.symbol !== expectedSymbol) reject('invalid_symbol');
  if (body.currency !== 'INR') reject('invalid_currency');
  if (typeof body.price !== 'number' && typeof body.price !== 'string') reject('invalid_price');
  if (typeof body.price === 'string' && !/^\d+(\.\d+)?$/.test(body.price.trim())) reject('invalid_price');
  const price = typeof body.price === 'number' ? body.price : Number(body.price);
  if (!Number.isFinite(price) || price <= 0) reject('invalid_price');
  const updated = Date.parse(body.updatedAt);
  if (!Number.isFinite(updated)) reject('invalid_timestamp');
  const skew = now - updated;
  if (skew > SOURCE_MAX_AGE_MS || skew < -5 * 60 * 1000) reject('invalid_timestamp');
  return {
    pricePerTroyOunce: price,
    sourceUpdatedAt: new Date(updated).toISOString(),
  };
}

export function buildVerifiedQuote({ goldBody, silverBody, fetchedAt }) {
  const now = Date.parse(fetchedAt);
  if (!Number.isFinite(now)) reject('invalid_timestamp');
  const gold = parseUpstream(goldBody, 'XAU', now);
  const silver = parseUpstream(silverBody, 'XAG', now);
  const goldPerGram = inrPerGramFromTroyOunce(gold.pricePerTroyOunce);
  const silverPerGram = inrPerGramFromTroyOunce(silver.pricePerTroyOunce);
  if (goldPerGram < GOLD_MIN || goldPerGram > GOLD_MAX) reject('price_out_of_range');
  if (silverPerGram < SILVER_MIN || silverPerGram > SILVER_MAX) reject('price_out_of_range');

  const fetchedIso = new Date(now).toISOString();
  const sourceUpdatedAt = gold.sourceUpdatedAt < silver.sourceUpdatedAt
    ? gold.sourceUpdatedAt
    : silver.sourceUpdatedAt;

  return {
    schema: 1,
    verified: true,
    fetchedAt: fetchedIso,
    sourceUpdatedAt,
    currency: 'INR',
    gstIncluded: false,
    source: SOURCE_NAME,
    sourceDetail: 'gold-api.com international spot',
    feedType: 'international_spot',
    metals: {
      gold24k: {
        metal: 'Gold',
        purity: '24K',
        price: roundMoney(goldPerGram),
        currency: 'INR',
        unit: 'g',
        derived: false,
        source: SOURCE_NAME,
        sourceUpdatedAt: gold.sourceUpdatedAt,
        fetchedAt: fetchedIso,
        note: 'Fine gold spot (XAU), converted from INR per troy ounce to INR per gram.',
      },
      gold22k: {
        metal: 'Gold',
        purity: '22K',
        price: roundMoney(goldPerGram * (22 / 24)),
        currency: 'INR',
        unit: 'g',
        derived: true,
        methodology: GOLD_22_METHOD,
        source: SOURCE_NAME,
        sourceUpdatedAt: gold.sourceUpdatedAt,
        fetchedAt: fetchedIso,
        note: 'Calculated indicative value from the 24K spot quote.',
      },
      silver: {
        metal: 'Silver',
        purity: 'Fine',
        price: roundMoney(silverPerGram),
        currency: 'INR',
        unit: 'g',
        derived: false,
        source: SOURCE_NAME,
        sourceUpdatedAt: silver.sourceUpdatedAt,
        fetchedAt: fetchedIso,
        note: 'Fine silver spot (XAG), converted from INR per troy ounce to INR per gram.',
      },
      silverPerKg: {
        metal: 'Silver',
        purity: 'Fine',
        price: roundMoney(silverPerGram * 1000),
        currency: 'INR',
        unit: 'kg',
        derived: true,
        methodology: SILVER_KG_METHOD,
        source: SOURCE_NAME,
        sourceUpdatedAt: silver.sourceUpdatedAt,
        fetchedAt: fetchedIso,
        note: 'Unit conversion of the per-gram spot quote.',
      },
    },
  };
}

function priceClose(actual, expected, tolerance) {
  return Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance;
}

export function isVerifiedQuote(quote) {
  if (!quote || quote.schema !== 1 || quote.verified !== true) return false;
  if (quote.source !== SOURCE_NAME || quote.currency !== 'INR' || quote.gstIncluded !== false) return false;
  if (quote.feedType !== 'international_spot') return false;
  if (!Number.isFinite(Date.parse(quote.fetchedAt))) return false;
  if (!Number.isFinite(Date.parse(quote.sourceUpdatedAt))) return false;
  const gold = quote.metals?.gold24k;
  const karat = quote.metals?.gold22k;
  const silver = quote.metals?.silver;
  const kilo = quote.metals?.silverPerKg;
  const spot = (metal, unit, derived) => Boolean(
    metal
    && metal.currency === 'INR'
    && metal.unit === unit
    && metal.derived === derived
    && metal.source === SOURCE_NAME
    && Number.isFinite(metal.price)
    && metal.price > 0
  );
  if (!spot(gold, 'g', false) || !spot(silver, 'g', false) || !spot(karat, 'g', true) || !spot(kilo, 'kg', true)) {
    return false;
  }
  if (gold.price < GOLD_MIN || gold.price > GOLD_MAX) return false;
  if (silver.price < SILVER_MIN || silver.price > SILVER_MAX) return false;
  if (karat.methodology !== GOLD_22_METHOD || kilo.methodology !== SILVER_KG_METHOD) return false;
  if (!priceClose(karat.price, gold.price * (22 / 24), 0.02)) return false;
  if (!priceClose(kilo.price, silver.price * 1000, 6)) return false;
  return true;
}

function statusCopy(dataStatus) {
  if (dataStatus === 'live') {
    return {
      label: 'Live spot quote',
      message: null,
    };
  }
  if (dataStatus === 'cached') {
    return {
      label: 'Cached spot quote',
      message: null,
    };
  }
  if (dataStatus === 'stale') {
    return {
      label: 'Stale spot quote',
      message: null,
    };
  }
  return {
    label: UNAVAILABLE_MESSAGE,
    message: UNAVAILABLE_MESSAGE,
  };
}

function withStatus(metal, dataStatus) {
  return { ...metal, dataStatus };
}

export function toPublicPayload(quote, dataStatus, extra = {}) {
  const copy = statusCopy(dataStatus);
  const base = {
    ok: dataStatus === 'live' || dataStatus === 'cached' || dataStatus === 'stale',
    dataStatus,
    label: copy.label,
    message: copy.message,
    source: quote ? quote.source : null,
    sourceDetail: quote ? quote.sourceDetail : null,
    feedType: quote ? quote.feedType : null,
    gstIncluded: quote ? false : null,
    gstNote: 'International spot metal value only. GST, making charges, wastage, and local premiums are not included. This is not a showroom or city retail price.',
    currency: quote ? 'INR' : null,
    unitNote: 'Displayed gold and silver gram prices are converted from the provider INR-per-troy-ounce spot quote. 1 troy ounce = 31.1034768 grams.',
    fetchedAt: quote ? quote.fetchedAt : null,
    sourceUpdatedAt: quote ? quote.sourceUpdatedAt : null,
    metals: quote
      ? {
          gold24k: withStatus(quote.metals.gold24k, dataStatus),
          gold22k: withStatus(quote.metals.gold22k, dataStatus),
          silver: withStatus(quote.metals.silver, dataStatus),
          silverPerKg: withStatus(quote.metals.silverPerKg, dataStatus),
        }
      : null,
    nextRefreshSeconds: extra.nextRefreshSeconds || 0,
    refreshCooldown: Boolean(extra.refreshCooldown),
  };
  return base;
}

function attemptTime(stored, now) {
  const parsed = stored?.lastAttemptAt ? Date.parse(stored.lastAttemptAt) : NaN;
  if (!Number.isFinite(parsed)) return 0;
  if (parsed > now + 5000) return 0;
  return parsed;
}

function secondsUntilRefresh(attemptAt, now) {
  if (!attemptAt) return 0;
  const left = FRESH_MS - (now - attemptAt);
  if (left <= 0) return 0;
  return Math.ceil(left / 1000);
}

function sourceAge(quote, now) {
  return now - Date.parse(quote.sourceUpdatedAt);
}

function storedRecord(parsed) {
  if (!parsed || typeof parsed !== 'object') return null;
  const quote = isVerifiedQuote(parsed.quote) ? parsed.quote : null;
  const lastAttemptAt = typeof parsed.lastAttemptAt === 'string' ? parsed.lastAttemptAt : null;
  if (!quote && !lastAttemptAt) return null;
  return { quote, lastAttemptAt };
}

async function persist(cache, value) {
  try {
    await cache.write(value);
  } catch {
    // A cache write failure must not replace the quote with a made-up price.
  }
}

async function readStored(cache) {
  try {
    return await cache.read();
  } catch {
    return null;
  }
}

async function fetchPair(fetchImpl, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const init = {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    };
    const [goldRes, silverRes] = await Promise.all([
      fetchImpl(GOLD_URL, init),
      fetchImpl(SILVER_URL, init),
    ]);
    if (!goldRes || !silverRes || goldRes.ok !== true || silverRes.ok !== true) {
      reject('upstream_http');
    }
    return {
      goldBody: await goldRes.json(),
      silverBody: await silverRes.json(),
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function resolveMetalRates({
  refresh = false,
  now = Date.now(),
  cache,
  fetchImpl = globalThis.fetch,
  timeoutMs = UPSTREAM_TIMEOUT_MS,
} = {}) {
  if (!cache) reject('cache_required');
  const stored = await readStored(cache);
  const quote = isVerifiedQuote(stored?.quote) ? stored.quote : null;
  const attemptedAt = attemptTime(stored, now);
  const fetchedAge = quote ? now - Date.parse(quote.fetchedAt) : Infinity;
  const fresh = quote && fetchedAge >= 0 && fetchedAge <= FRESH_MS;
  const usableStale = quote && fetchedAge >= 0 && fetchedAge <= STALE_MAX_MS;
  const cooling = attemptedAt > 0 && now - attemptedAt < FRESH_MS;
  const refreshSeconds = secondsUntilRefresh(attemptedAt || (quote ? Date.parse(quote.fetchedAt) : 0), now);

  if (quote && fresh) {
    const dataStatus = sourceAge(quote, now) > SOURCE_STALE_MS ? 'stale' : 'cached';
    return toPublicPayload(quote, dataStatus, {
      nextRefreshSeconds: refreshSeconds,
      refreshCooldown: Boolean(refresh),
    });
  }

  if (cooling) {
    if (usableStale) {
      return toPublicPayload(quote, 'stale', {
        nextRefreshSeconds: refreshSeconds,
        refreshCooldown: true,
      });
    }
    return toPublicPayload(null, 'unavailable', {
      nextRefreshSeconds: refreshSeconds,
      refreshCooldown: true,
    });
  }

  const failedStore = {
    quote: usableStale ? quote : null,
    lastAttemptAt: new Date(now).toISOString(),
  };

  try {
    const bodies = await fetchPair(fetchImpl, timeoutMs);
    const built = buildVerifiedQuote({
      goldBody: bodies.goldBody,
      silverBody: bodies.silverBody,
      fetchedAt: new Date(now).toISOString(),
    });
    await persist(cache, {
      quote: built,
      lastAttemptAt: new Date(now).toISOString(),
    });
    const dataStatus = sourceAge(built, now) > SOURCE_STALE_MS ? 'stale' : 'live';
    return toPublicPayload(built, dataStatus, {
      nextRefreshSeconds: Math.ceil(FRESH_MS / 1000),
      refreshCooldown: false,
    });
  } catch {
    await persist(cache, failedStore);
    if (usableStale) {
      return toPublicPayload(quote, 'stale', {
        nextRefreshSeconds: Math.ceil(FRESH_MS / 1000),
        refreshCooldown: false,
      });
    }
    return toPublicPayload(null, 'unavailable', {
      nextRefreshSeconds: Math.ceil(FRESH_MS / 1000),
      refreshCooldown: false,
    });
  }
}

export function createMemoryCache(initial = null) {
  let state = initial;
  return {
    async read() {
      return state;
    },
    async write(value) {
      state = value;
    },
  };
}

export function createFileCache(filePath = DEFAULT_CACHE_FILE) {
  let memory = null;
  let mutex = Promise.resolve();

  function acquire() {
    let release;
    const next = new Promise((resolve) => {
      release = resolve;
    });
    const current = mutex.then(() => release);
    mutex = mutex.then(() => next);
    return current;
  }

  return {
    async read() {
      if (memory) return memory;
      try {
        const raw = await fs.promises.readFile(filePath, 'utf8');
        memory = storedRecord(JSON.parse(raw));
        return memory;
      } catch {
        return null;
      }
    },
    async write(value) {
      const release = await acquire();
      const temp = `${filePath}.tmp-${process.pid}-${Date.now()}`;
      try {
        memory = value;
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        await fs.promises.writeFile(temp, JSON.stringify(value), 'utf8');
        try {
          await fs.promises.rename(temp, filePath);
        } catch {
          await fs.promises.rm(filePath, { force: true });
          await fs.promises.rename(temp, filePath);
        }
      } finally {
        await fs.promises.rm(temp, { force: true }).catch(() => {});
        release();
      }
    },
  };
}

let sharedCache = null;
let inflight = null;

export function getSharedMetalRates(options = {}) {
  if (!sharedCache) sharedCache = createFileCache();
  if (inflight) return inflight;
  inflight = resolveMetalRates({ ...options, cache: sharedCache }).finally(() => {
    inflight = null;
  });
  return inflight;
}
