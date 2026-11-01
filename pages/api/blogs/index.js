import { listPublicPosts } from '../../../lib/blog/store';
import { sendBlogError, methodNotAllowed } from '../../../lib/blog/http';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET');
  try {
    const result = await listPublicPosts({
      page: req.query.page,
      pageSize: req.query.pageSize,
      q: req.query.q,
      categorySlug: req.query.category,
      authorSlug: req.query.author,
    });
    if (!result) return res.status(404).json({ success: false, error: 'Not found.' });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return sendBlogError(res, err);
  }
}
