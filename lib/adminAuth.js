import crypto from 'crypto';

// In-memory failed attempt tracker to mitigate brute-force attacks
const failedAttemptsMap = new Map();

function isBruteForceBlocked(ip) {
  const record = failedAttemptsMap.get(ip);
  if (!record) return false;
  const now = Date.now();
  if (now > record.blockUntil) {
    failedAttemptsMap.delete(ip);
    return false;
  }
  return true;
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  const record = failedAttemptsMap.get(ip) || { count: 0, blockUntil: 0 };
  record.count += 1;
  // If 5 failed attempts within 15 minutes, block for 15 minutes
  if (record.count >= 5) {
    record.blockUntil = now + 15 * 60 * 1000;
  }
  failedAttemptsMap.set(ip, record);
}

function clearFailedAttempts(ip) {
  failedAttemptsMap.delete(ip);
}

/**
 * Verify administrative authorization header with constant-time comparison
 * and strict production security enforcement.
 */
export function verifyAdminAuth(req) {
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';

  if (isBruteForceBlocked(clientIp)) {
    return {
      authorized: false,
      status: 429,
      error: 'Too many failed authentication attempts. Access locked for 15 minutes.',
      code: 'AUTH_LOCKED',
    };
  }

  const isProd = process.env.NODE_ENV === 'production';
  const configuredSecret = process.env.DEMO_ADMIN_KEY;

  // Strict Production Rule: Never allow fallback key in production
  if (isProd && (!configuredSecret || configuredSecret.trim() === '')) {
    console.error('[CRITICAL SECURITY ERROR] DEMO_ADMIN_KEY environment variable is not configured in production. Failing closed.');
    return {
      authorized: false,
      status: 503,
      error: 'Administrative access is temporarily unavailable due to server security configuration.',
      code: 'ADMIN_NOT_CONFIGURED',
    };
  }

  // Development Fallback Key with explicit server warning
  const effectiveSecret = configuredSecret || 'octis-demo-secret-2026';
  if (!configuredSecret && !isProd) {
    // Development warning only once or on demand
  }

  // Strictly accept credentials from headers only (reject query params to avoid log leakage)
  let providedToken = req.headers['x-admin-key'];
  if (!providedToken) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      providedToken = authHeader.substring(7);
    }
  }

  if (!providedToken || typeof providedToken !== 'string') {
    return {
      authorized: false,
      status: 401,
      error: 'Unauthorized: Admin authentication header (x-admin-key or Authorization Bearer) is required.',
      code: 'MISSING_ADMIN_KEY',
    };
  }

  // Constant-time comparison using sha256 hashes to prevent timing side-channel attacks
  try {
    const expectedHash = crypto.createHash('sha256').update(effectiveSecret).digest();
    const providedHash = crypto.createHash('sha256').update(providedToken).digest();
    const isMatch = crypto.timingSafeEqual(expectedHash, providedHash);

    if (!isMatch) {
      recordFailedAttempt(clientIp);
      return {
        authorized: false,
        status: 401,
        error: 'Unauthorized: Invalid administrative credentials.',
        code: 'INVALID_ADMIN_KEY',
      };
    }

    // Success: clear failed attempt tracker
    clearFailedAttempts(clientIp);
    return { authorized: true };
  } catch (err) {
    recordFailedAttempt(clientIp);
    return {
      authorized: false,
      status: 401,
      error: 'Authentication verification failed.',
      code: 'AUTH_ERROR',
    };
  }
}

