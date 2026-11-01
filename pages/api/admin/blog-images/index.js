import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { methodNotAllowed, requireAdmin, sendBlogError } from '../../../../lib/blog/http';
import { BlogError } from '../../../../lib/blog/errors';

export const config = {
  api: { bodyParser: { sizeLimit: '2mb' } },
};

const TYPES = {
  'image/jpeg': { ext: 'jpg', magic: (buf) => buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff },
  'image/png': { ext: 'png', magic: (buf) => buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 },
  'image/webp': {
    ext: 'webp',
    magic: (buf) => buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP',
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
  if (!requireAdmin(req, res)) return;
  try {
    const mime = String(req.body?.mime || '');
    const spec = TYPES[mime];
    if (!spec) throw new BlogError(400, 'VALIDATION_FAILED', 'Upload a JPEG, PNG, or WebP image.');
    const raw = String(req.body?.data || '').replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(raw, 'base64');
    if (!buffer.length || buffer.length > 1_500_000) {
      throw new BlogError(400, 'VALIDATION_FAILED', 'Image must be under 1.5 MB.');
    }
    if (!spec.magic(buffer)) throw new BlogError(400, 'VALIDATION_FAILED', 'The file contents do not match an allowed image.');
    const filename = `${crypto.randomBytes(16).toString('hex')}.${spec.ext}`;
    const dir = path.join(process.cwd(), 'public', 'uploads', 'blog');
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(path.join(dir, filename), buffer);
    return res.status(201).json({ success: true, path: `/uploads/blog/${filename}` });
  } catch (err) {
    return sendBlogError(res, err);
  }
}
