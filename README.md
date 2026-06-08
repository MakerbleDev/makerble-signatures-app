# Makerble Signature Generator

A white-label email signature generator. Organisations set up their branding once and share a link with their team. Each team member fills in their own details and downloads a Gmail-ready signature.

## Live URL
`https://signatures.makerble.com`

---

## Tech stack
- **React + Vite** — frontend
- **Supabase** — database (org configs) + storage (logo uploads)
- **Vercel** — hosting

---

## Deployment

### 1. Supabase setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL editor and run the schema SQL found in `src/lib/supabase.js`
3. Go to **Storage → New bucket**, name it `logos`, set to **Public**
4. Copy your project URL and anon key from **Settings → API**

### 2. Local development
```bash
npm install
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
npm run dev
```

### 3. Deploy to Vercel
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → import the repo
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

### 4. Custom domain (Abdulsalam)
In your DNS provider, add:
```
CNAME  signatures  cname.vercel-dns.com
```
Then in the Vercel project: **Settings → Domains → Add → signatures.makerble.com**

---

## Routes
| Route | Description |
|---|---|
| `/` | Landing page |
| `/setup` | Admin setup flow (3 steps) |
| `/org/:slug` | Team member signature generator |

---

## How it works
1. An org admin visits `/setup`, fills in branding + defaults, gets a shareable URL
2. They share `signatures.makerble.com/org/their-org` with their team
3. Each team member visits that URL, fills in name/role/phone/email
4. They click **Launch preview** or **Download**, then paste into Gmail

---

## Updating an org's settings
Currently requires direct Supabase dashboard access (Table Editor → organisations). 
A future edit flow can be added at `/org/:slug/edit` with passcode verification.
