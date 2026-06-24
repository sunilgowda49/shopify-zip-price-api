const express = require('express');
const cors = require('cors');

const app = express();

// ---------------------------------------------------------------------------
// CORS – allow any origin so the Shopify storefront can call this API
// ---------------------------------------------------------------------------
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ---------------------------------------------------------------------------
// ZIP-code → price map
// ---------------------------------------------------------------------------
const ZIP_PRICES = {
  '75028': 1499,
  '10001': 1699,
  '90210': 1799,
};
const DEFAULT_PRICE = 1599;

// ---------------------------------------------------------------------------
// POST /api/get-price
// Body: { zipCode: string, variantId: string | number }
// ---------------------------------------------------------------------------
app.post('/api/get-price', (req, res) => {
  const { zipCode, variantId } = req.body;

  if (!zipCode) {
    return res.status(400).json({ error: 'zipCode is required' });
  }

  const cleanZip = String(zipCode).trim();
  const price = ZIP_PRICES[cleanZip] ?? DEFAULT_PRICE;

  return res.json({
    zipCode: cleanZip,
    variantId: variantId ?? null,
    price,
    currency: 'USD',
    formatted: `$${price.toLocaleString()}`,
  });
});

// Serve the demo page at root
const path = require('path');
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'demo.html')));

// Health-check
app.get('/health', (req, res) => res.json({ status: 'ok', message: 'Price API is running' }));

// ---------------------------------------------------------------------------
// Local dev server (Vercel / Render ignore this block)
// ---------------------------------------------------------------------------
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`✅  Price API listening on http://localhost:${PORT}`));
}

module.exports = app;
