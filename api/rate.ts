import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_KEY = process.env.EXCHANGE_RATE_API_KEY;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { source, target } = req.query;

  // Validation
  if (!source || !target) {
    return res.status(400).json({ 
      error: 'Missing source or target currency' 
    });
  }

  if (!API_KEY) {
    return res.status(500).json({ 
      error: 'API key not configured' 
    });
  }

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${source}/${target}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.result === 'error') {
      return res.status(400).json({ 
        error: data['error-type'] || 'Invalid currency pair' 
      });
    }

    return res.status(200).json({
      conversion_rate: data.conversion_rate
    });
  } catch (error: any) {
    console.error('Rate API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch exchange rate' 
    });
  }
}
