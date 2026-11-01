import { adminList, createAuthor } from '../../../../lib/blog/store';
import { methodNotAllowed, requireAdmin, sendBlogError } from '../../../../lib/blog/http';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') {
      const data = await adminList();
      return res.status(200).json({ success: true, authors: data.authors });
    }
    if (req.method === 'POST') {
      const author = await createAuthor(req.body || {});
      return res.status(201).json({ success: true, author });
    }
    return methodNotAllowed(res, 'GET, POST');
  } catch (err) {
    return sendBlogError(res, err);
  }
}
