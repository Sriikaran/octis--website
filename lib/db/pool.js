import { Pool } from 'pg';

let pool = null;
let mockPool = null;

/**
 * Allows injecting a test mock pool for unit tests and CI contract verification
 */
export function setMockDbPool(customPool) {
  mockPool = customPool;
}

export function resetMockDbPool() {
  mockPool = null;
}

/**
 * Returns the singleton PostgreSQL Pool for the website's isolated demo booking database.
 * Strictly uses process.env.DEMO_DATABASE_URL only.
 */
export function getDbPool() {
  if (mockPool) {
    return mockPool;
  }

  const dbUrl = process.env.DEMO_DATABASE_URL;

  if (!dbUrl || dbUrl.trim() === '') {
    return null;
  }

  if (!pool) {
    const isLocalhost = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
    const sslOption = process.env.DEMO_DB_SSL === 'false' 
      ? false 
      : isLocalhost 
        ? false 
        : { rejectUnauthorized: false };

    pool = new Pool({
      connectionString: dbUrl,
      max: Number(process.env.DEMO_DB_MAX_CONNECTIONS) || 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: sslOption,
    });

    pool.on('error', (err) => {
      console.error('[OCTIS DB POOL ERROR] Unexpected client error in demo booking database pool:', err);
    });
  }

  return pool;
}

/**
 * Close pool and release all connections
 */
export async function closeDbPool() {
  if (pool) {
    try {
      await pool.end();
    } catch (e) {}
    pool = null;
  }
}

/**
 * Health check helper to verify database connectivity.
 */
export async function testDbConnection() {
  const activePool = getDbPool();
  if (!activePool) {
    return {
      connected: false,
      reason: 'DEMO_DATABASE_URL is not configured in environment variables.',
    };
  }

  try {
    const client = await activePool.connect();
    try {
      const res = await client.query('SELECT NOW() as current_time, version() as pg_version;');
      return {
        connected: true,
        timestamp: res.rows[0]?.current_time,
        version: res.rows[0]?.pg_version,
      };
    } finally {
      client.release();
    }
  } catch (err) {
    return {
      connected: false,
      error: err.message,
      code: err.code,
    };
  }
}
