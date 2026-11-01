import { updateBookingStatus } from '../../../../lib/demoStorage';
import { verifyAdminAuth } from '../../../../lib/adminAuth';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Security gate: Enforce server-side constant-time header authorization
  const authCheck = verifyAdminAuth(req);
  if (!authCheck.authorized) {
    return res.status(authCheck.status || 401).json({
      success: false,
      error: authCheck.error,
      code: authCheck.code,
    });
  }

  const { id } = req.query; // referenceId
  const { status, reason } = req.body || {};

  if (!status) {
    return res.status(400).json({ success: false, error: 'Target status is required.' });
  }

  try {
    const result = await updateBookingStatus(String(id), String(status), reason);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error updating booking ${id}:`, error);
    return res.status(500).json({ success: false, error: 'Failed to update booking status.' });
  }
}

