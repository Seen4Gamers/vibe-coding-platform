# Vibe Coding Platform - Analytics Website with Today's Offers

A fully functional website with real-time visitor analytics and product offer management built with Next.js 16, React 19, and Supabase.

## Features

- **Real-time Analytics Tracking** - Automatically tracks every page view with visitor details
- **Device & Browser Detection** - Captures device type, browser, and OS information
- **Today's Offer Section** - Display limited-time product offers with a 24-hour countdown timer
- **Admin Panel** - Manage offers and adjust countdown timer (password-protected)
  - Add, edit, and delete products
  - Change timer duration (1-168 hours)
  - Secure admin authentication
- **Analytics Dashboard** - Beautiful dashboard showing:
  - Total page views and unique pages
  - Today's visitor count
  - Device breakdown (Mobile, Tablet, Desktop)
  - Browser breakdown
  - Recent visitors table with timestamps
- **Fully Published** - Ready to deploy to Vercel

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Supabase PostgreSQL
- **Authentication**: Password-protected admin panel
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (environment variables must be set)

### Installation

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Ensure your `.env.local` has the Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
ADMIN_PASSWORD=your_admin_password
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
```

3. Create the analytics table by running the migration:
```bash
# The database migration creates the page_views table automatically
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **Home Page** (`/`) - Landing page with Today's Offer section and feature overview
- **Admin Panel** (`/admin`) - Manage products and timer settings (password: set in env vars)
- **Analytics Dashboard** (`/analytics`) - View all visitor analytics

### Admin Features

1. **Add Products to Today's Offer**:
   - Navigate to `/admin`
   - Enter admin password
   - Fill in product details (title, description, price, image URL)
   - Click "Add Offer"

2. **Edit or Delete Products**:
   - Click "Edit" to modify a product
   - Click "Delete" to remove it

3. **Change Timer Duration**:
   - In the Timer Settings section
   - Select new duration (1-168 hours)
   - Click "Update Timer"

### Analytics

The analytics are automatically tracked on every page visit. Just navigate around and watch the data appear in real-time!

## Database Schema

### page_views table
- `id` - Unique identifier
- `path` - Page path visited
- `referrer` - Referrer URL
- `user_agent` - Browser user agent
- `device_type` - Mobile, Tablet, or Desktop
- `browser` - Chrome, Safari, Firefox, etc.
- `os` - Operating system
- `created_at` - Timestamp of visit

### daily_offers table
- `id` - Unique identifier
- `title` - Product title
- `description` - Product description
- `price` - Product price
- `image_url` - Product image URL
- `created_at` - When offer was created

### offer_settings table
- `id` - Unique identifier
- `timer_end_time` - When the current 24-hour offer expires
- `created_at` - When settings were created

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and set up the build
4. Add your environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD` (your admin password)
   - `NEXT_PUBLIC_ADMIN_PASSWORD` (same as ADMIN_PASSWORD)
5. Deploy!

Your site will be automatically published and live.

## Project Status

✅ Complete with analytics and offer management - ready for production deployment
