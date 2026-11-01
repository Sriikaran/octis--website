import { deleteCategory, updateCategory } from '../../../../lib/blog/store';
import { methodNotAllowed, requireAdmin, sendBlogError } from '../../../../lib/blog/http';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  const id = String(req.query.id || '');
  try {
    if (req.method === 'PATCH') {
      const category = await updateCategory(id, req.body || {});
      return res.status(200).json({ success: true, category });
    }
    if (req.method === 'DELETE') {
      await deleteCategory(id);
      return res.status(200).json({ success: true, deleted: true });
    }
    return methodNotAllowed(res, 'PATCH, DELETE');
  } catch (err) {
    return sendBlogError(res, err);
  }
}
