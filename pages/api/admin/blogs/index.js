import { adminList, createPost } from '../../../../lib/blog/store';
import { methodNotAllowed, requireAdmin, sendBlogError } from '../../../../lib/blog/http';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') {
      const data = await adminList();
      return res.status(200).json({ success: true, ...data });
    }
    if (req.method === 'POST') {
      const post = await createPost(req.body || {});
      return res.status(201).json({ success: true, post });
    }
    return methodNotAllowed(res, 'GET, POST');
  } catch (err) {
    return sendBlogError(res, err);
  }
}
