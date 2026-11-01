import { listAllBookings } from '../../../../lib/demoStorage';
import { verifyAdminAuth } from '../../../../lib/adminAuth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
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

  try {
    const { status, product, date, search } = req.query;
    const bookings = await listAllBookings({
      status: status ? String(status) : undefined,
      product: product ? String(product) : undefined,
      date: date ? String(date) : undefined,
      search: search ? String(search) : undefined,
    });

    return res.status(200).json({
      success: true,
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Error fetching admin demo bookings:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve bookings.',
    });
  }
}

