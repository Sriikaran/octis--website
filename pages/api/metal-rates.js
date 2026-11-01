import { getSharedMetalRates, UNAVAILABLE_MESSAGE } from '../../lib/metalRatesService';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      ok: false,
      dataStatus: 'unavailable',
      message: 'Method not allowed',
      metals: null,
    });
  }

  try {
    const refresh = req.query?.refresh === '1';
    const payload = await getSharedMetalRates({ refresh });
    const status = payload.dataStatus === 'unavailable' ? 503 : 200;
    return res.status(status).json(payload);
  } catch {
    return res.status(503).json({
      ok: false,
      dataStatus: 'unavailable',
      label: UNAVAILABLE_MESSAGE,
      message: UNAVAILABLE_MESSAGE,
      metals: null,
      gstIncluded: null,
      source: null,
    });
  }
}
