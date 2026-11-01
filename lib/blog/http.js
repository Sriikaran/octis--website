import { verifyAdminAuth } from '../adminAuth';
import { BlogError } from './errors';

export function requireAdmin(req, res) {
  const auth = verifyAdminAuth(req);
  if (!auth.authorized) {
    res.status(auth.status).json({
      success: false,
      error: auth.error,
      code: auth.code,
    });
    return false;
  }
  return true;
}

export function sendBlogError(res, err) {
  if (err instanceof BlogError) {
    return res.status(err.status).json({
      success: false,
      code: err.code,
      error: err.message,
      ...(err.fields ? { fields: err.fields } : {}),
    });
  }
  console.error('[blog]', err);
  return res.status(500).json({ success: false, error: 'Blog request failed.' });
}

export function methodNotAllowed(res, allow) {
  res.setHeader('Allow', allow);
  return res.status(405).json({ success: false, error: 'Method not allowed.' });
}
