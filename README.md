# ✈️ Travel Portfolio — Full Stack App

A cinematic, full-stack travel portfolio to document and showcase every place you've visited.

**Stack:** React + Tailwind + Framer Motion · Node.js + Express · MongoDB Atlas · Cloudinary · JWT Auth

---

## 📁 Project Structure

```
travel-portfolio/
├── backend/                  # Express API
│   ├── config/               # DB + Cloudinary setup
│   ├── controllers/          # Route logic
│   ├── middleware/           # JWT auth middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   └── server.js             # Entry point
│
└── frontend/                 # React (Vite) app
    └── src/
        ├── api/              # Axios instance
        ├── components/       # Reusable components
        │   ├── layout/       # Navbar, Footer, AdminLayout
        │   └── ui/           # Button, Input, Badge, etc.
        ├── context/          # AuthContext (JWT state)
        ├── pages/            # All pages
        │   └── admin/        # Admin dashboard pages
        └── App.jsx           # Routes
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier is fine)
- Cloudinary account (free tier is fine)

---

### Step 1 — Clone & Setup

```bash
# Clone the repo (or unzip this folder)
cd travel-portfolio
```

---

### Step 2 — Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Now open `backend/.env` and fill in:

```env
MONGODB_URI=mongodb+srv://traveladmin:sonu@0306@cluster0.abc12.mongodb.net/travel-portfolio?retryWrites=true&w=majority
JWT_SECRET=61b6666c7bc0137a8ff795f24b07ef8f777351ec141d801f77b4f9e98f14a753be76a2c45b6b9d08232d152919df5b880cf4e7ef98347e679c67338ab70c692b
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=dmsu0kuji
CLOUDINARY_API_KEY=727354766531332
CLOUDINARY_API_SECRET=yKuCSVCKll3HVzl7fY9dign-J8s
FRONTEND_URL=http://localhost:5173
```

**Get MongoDB URI:**

1. Go to https://cloud.mongodb.com
2. Create free cluster → Connect → Connect your application
3. Copy the connection string, replace `<password>` with your DB user password

**Get Cloudinary credentials:**

1. Go to https://cloudinary.com → Sign up free
2. Dashboard shows Cloud Name, API Key, API Secret

```bash
# Start backend (development with auto-reload)
npm run dev

# You should see:
# ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
# 🚀 Server running on port 5000 in development mode
```

---

### Step 3 — Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Open `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_OWNER_NAME=Your Name
VITE_TAGLINE=Wanderer. Storyteller. Explorer.
```

```bash
# Start frontend dev server
npm run dev

# Open http://localhost:5173
```

---

### Step 4 — Create Your Admin Account

1. Visit `http://localhost:5173/login`
2. There's no register page — use the API directly the first time:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Your Name","email":"you@email.com","password":"YourPassword123!"}'
```

> **The first registered user automatically becomes admin.**
> All subsequent registrations are regular users.

3. Log in at `/login` with your credentials
4. You'll be redirected to the admin dashboard at `/admin`

---

## 🗺️ Using the Admin Dashboard

### Adding Your First Country

1. Go to `/admin/countries` → **Add Country**
2. Fill in: name, continent, visit date, description, flag emoji
3. Upload a cover photo (goes to Cloudinary automatically)
4. Check "Feature on homepage" to show it on the hero section

### Adding Places

1. Go to `/admin/places` → **Add Place**
2. Select parent country
3. Add name, description, tags (comma-separated), rating
4. Upload cover image

### Writing Blog Posts

1. Go to `/admin/blogs` → **New Post**
2. Select country + place (optional)
3. Write in the rich text editor (bold, italic, headings, blockquotes, lists, links)
4. Set status to **Published** to make it visible
5. Add tags and a short excerpt for preview cards

---

## 🚀 Deployment

### Deploy Backend to Render (Free Tier)

1. Push your backend to a GitHub repo
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo → select `backend/` as root directory
4. Settings:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Node version:** 18
5. Add all environment variables from your `.env` file (except `NODE_ENV` = `production`, `FRONTEND_URL` = your Vercel URL)
6. Deploy — Render gives you a URL like `https://travel-api-xxxx.onrender.com`

> **Note:** Free Render services sleep after 15 min inactivity. First request after sleep takes ~30s.
> Upgrade to paid ($7/mo) to avoid cold starts.

---

### Deploy Frontend to Vercel

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Build first to check for errors
npm run build

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: travel-portfolio
# - Directory: ./
# - Override settings? No
```

Or use Vercel dashboard:

1. Go to https://vercel.com → Import Git Repository
2. Select your frontend folder
3. Add environment variable: `VITE_API_URL=https://your-render-api.onrender.com/api`
4. Deploy!

---

### Deploy Frontend to Netlify (Alternative)

```bash
cd frontend
npm run build

# Deploy dist/ folder to Netlify
npx netlify-cli deploy --prod --dir=dist
```

Or drag & drop the `dist/` folder at https://app.netlify.com

Add env var `VITE_API_URL` in Netlify → Site settings → Environment variables.

---

## 🗄️ MongoDB Atlas Setup (Detailed)

1. Go to https://cloud.mongodb.com → Sign up free
2. Create a free M0 cluster (choose closest region)
3. **Database Access** → Add user: username + strong password (save these!)
4. **Network Access** → Add IP Address → Allow Access from Anywhere (`0.0.0.0/0`)
   - For production: restrict to your Render IP address
5. **Connect** → Connect your application → Node.js → Copy URI
6. Replace `<password>` in URI with your actual password

---

## 🔧 Environment Variables Reference

### Backend `.env`

| Variable                | Description                          |
| ----------------------- | ------------------------------------ |
| `MONGODB_URI`           | MongoDB Atlas connection string      |
| `JWT_SECRET`            | Random secret for signing JWT tokens |
| `JWT_EXPIRES_IN`        | Token expiry (e.g. `7d`, `30d`)      |
| `PORT`                  | Server port (default: 5000)          |
| `NODE_ENV`              | `development` or `production`        |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard            |
| `CLOUDINARY_API_KEY`    | From Cloudinary dashboard            |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard            |
| `FRONTEND_URL`          | Your frontend URL (for CORS)         |

### Frontend `.env`

| Variable          | Description                        |
| ----------------- | ---------------------------------- |
| `VITE_API_URL`    | Backend API URL                    |
| `VITE_OWNER_NAME` | Your name (shown in navbar/footer) |
| `VITE_TAGLINE`    | Tagline for hero section           |

---

## 📡 API Endpoints Reference

```
# Auth
POST   /api/auth/register        Register user
POST   /api/auth/login           Login
GET    /api/auth/me              Get current user (protected)

# Countries (public)
GET    /api/countries            All countries
GET    /api/countries/featured   Featured countries (homepage)
GET    /api/countries/stats      Stats (counts, continents)
GET    /api/countries/:slug      Single country with places + blogs

# Countries (admin only)
POST   /api/countries            Create country (multipart/form-data)
PUT    /api/countries/:id        Update country
DELETE /api/countries/:id        Delete + cascade

# Places (public)
GET    /api/places               All places (filter: ?country=ID)
GET    /api/places/:id           Single place

# Places (admin only)
POST   /api/places               Create place
PUT    /api/places/:id           Update place
POST   /api/places/:id/images    Upload gallery images
DELETE /api/places/:id           Delete place

# Blogs (public)
GET    /api/blogs                All published posts (paginated)
GET    /api/blogs/:slug          Single post

# Blogs (authenticated)
POST   /api/blogs/:id/like       Toggle like
POST   /api/blogs/:id/comment    Add comment (optional auth)

# Blogs (admin only)
POST   /api/blogs                Create post
PUT    /api/blogs/:id            Update post
DELETE /api/blogs/:id            Delete post
PUT    /api/blogs/:id/comment/:commentId/approve   Approve comment
```

---

## 🎨 Design Customization

### Colors

Edit `frontend/tailwind.config.js`:

- `amber` — main accent color (currently gold)
- `void` — dark background palette
- `ivory` — text color

### Fonts

Edit `frontend/index.html` — change the Google Fonts import.
Then update `tailwind.config.js` → `fontFamily`.

### Hero Image

In `frontend/src/pages/Home.jsx`, find the `backgroundImage` URL and replace with your own photo.

---

## 🔒 Security Notes

- JWT tokens stored in `localStorage` (simple approach — consider `httpOnly` cookies for production)
- All admin routes protected server-side with `protect + adminOnly` middleware
- Comments require admin approval before appearing publicly
- Images validated by MIME type on both client and server
- CORS configured to only allow your frontend domain

---

## 💡 Ideas for Further Improvement

1. **Map Integration** — Add Leaflet.js to show visited countries on a world map
2. **Dark/Light Mode Toggle** — Already set up in Tailwind (`darkMode: 'class'`)
3. **Search** — Full-text search across countries and blog posts
4. **Email Notifications** — Notify admin when a new comment is submitted
5. **Analytics** — Track page views per post/country
6. **PWA** — Add a service worker for offline support
7. **RSS Feed** — Generate an RSS feed from published blog posts
8. **Social Sharing** — Open Graph meta tags for each post
9. **Gallery Captions** — Inline edit captions from the admin panel
10. **Bucket List** — Section for places you want to visit (not yet visited)

---

## 🐛 Troubleshooting

**CORS error in browser:**
→ Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL exactly (no trailing slash)

**Images not uploading:**
→ Check Cloudinary credentials in `.env`. Try logging the error in `config/cloudinary.js`.

**MongoDB connection timeout:**
→ Check Network Access in Atlas — add `0.0.0.0/0` temporarily.
→ Verify password in URI (special characters need URL encoding).

**Admin route redirect loop:**
→ Clear `localStorage` in browser DevTools → Application → Clear all.

**Render cold start delay:**
→ Use a free uptime monitor (UptimeRobot) to ping `/health` every 14 min.
