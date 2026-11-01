import { getAvailableSlots } from '../../../lib/demoStorage';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      success: false,
      error: 'Query parameter "date" (YYYY-MM-DD) is required.',
    });
  }

  try {
    const result = await getAvailableSlots(String(date));
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error in /api/demo/availability:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve slot availability. Please try again.',
    });
  }
}

