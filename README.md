# Shopify ZIP-Based Dynamic Pricing – Full Guide

## Project Structure

```
inern/
├── index.js                  ← Express API (deploy to Vercel/Render)
├── package.json
├── vercel.json               ← Vercel deployment config
├── shopify-custom-liquid.html ← Paste into Shopify Custom Liquid block
└── .gitignore
```

---

## Step 1 – Shopify Development Store (manual)

1. Go to [partners.shopify.com](https://partners.shopify.com) → create a free account.
2. In the Partner Dashboard → **Stores** → **Add store** → **Development store**.
3. Add a sample product with a price.
4. Note the **variant ID** from the URL when editing the product  
   (e.g., `https://your-store.myshopify.com/admin/products/123456789/variants/987654321` → variant ID is `987654321`).

---

## Step 2 – Deploy the Backend API

### Option A: Vercel (easiest – free)

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# From the inern/ folder
vercel login
vercel --prod
```

Copy the printed URL, e.g. `https://your-api.vercel.app`

### Option B: Render (free tier)

1. Push this folder to a GitHub repo.
2. Go to [render.com](https://render.com) → New → **Web Service**.
3. Connect your GitHub repo.
4. Set:
   - **Build command**: `npm install`
   - **Start command**: `node index.js`
5. Click **Deploy** and copy the live URL.

### Test your API with curl

```bash
curl -X POST https://YOUR_API_URL/api/get-price \
  -H "Content-Type: application/json" \
  -d '{"zipCode":"75028","variantId":"987654321"}'

# Expected: {"zipCode":"75028","variantId":"987654321","price":1499,"currency":"USD","formatted":"$1,499"}
```

---

## Step 3 – Inject Frontend into Shopify

1. In Shopify Admin → **Online Store** → **Themes** → **Customize**.
2. Navigate to your **Product** page template.
3. Click **Add block** → **Custom Liquid** → place it below the price section.
4. Open `shopify-custom-liquid.html` and paste the **entire file** contents.
5. Find this line and replace with your actual API URL:
   ```js
   var API_URL = 'YOUR_BACKEND_API_URL/api/get-price';
   ```
   → becomes, e.g.:
   ```js
   var API_URL = 'https://your-api.vercel.app/api/get-price';
   ```
6. Click **Save**.

---

## Step 4 – Test All ZIP Codes

| ZIP Code | Expected Price |
|----------|---------------|
| 75028    | $1,499        |
| 10001    | $1,699        |
| 90210    | $1,799        |
| anything else | $1,599   |

---

## Pricing Logic Reference

| ZIP   | Price   |
|-------|---------|
| 75028 | $1,499  |
| 10001 | $1,699  |
| 90210 | $1,799  |
| *     | $1,599  |
