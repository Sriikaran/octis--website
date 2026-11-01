import { getPublicArticle } from '../../../lib/blog/store';
import { sendBlogError, methodNotAllowed } from '../../../lib/blog/http';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET');
  try {
    const article = await getPublicArticle(String(req.query.slug || ''));
    if (!article) return res.status(404).json({ success: false, error: 'Article not found.' });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ success: true, ...article });
  } catch (err) {
    return sendBlogError(res, err);
  }
}
