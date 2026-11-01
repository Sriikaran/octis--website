import { adminGet, deletePost, updatePost } from '../../../../lib/blog/store';
import { methodNotAllowed, requireAdmin, sendBlogError } from '../../../../lib/blog/http';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  const id = String(req.query.id || '');
  try {
    if (req.method === 'GET') {
      const post = await adminGet(id);
      return res.status(200).json({ success: true, post });
    }
    if (req.method === 'PATCH') {
      const post = await updatePost(id, req.body || {});
      return res.status(200).json({ success: true, post });
    }
    if (req.method === 'DELETE') {
      await deletePost(id);
      return res.status(200).json({ success: true, deleted: true });
    }
    return methodNotAllowed(res, 'GET, PATCH, DELETE');
  } catch (err) {
    return sendBlogError(res, err);
  }
}
