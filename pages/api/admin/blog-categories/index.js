import { createCategory, listCategoriesPublic } from '../../../../lib/blog/store';
import { methodNotAllowed, requireAdmin, sendBlogError } from '../../../../lib/blog/http';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') {
      const categories = await listCategoriesPublic();
      return res.status(200).json({ success: true, categories });
    }
    if (req.method === 'POST') {
      const category = await createCategory(req.body || {});
      return res.status(201).json({ success: true, category });
    }
    return methodNotAllowed(res, 'GET, POST');
  } catch (err) {
    return sendBlogError(res, err);
  }
}
