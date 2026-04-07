# Vibe Coding Platform - Analytics Website

A fully functional website with real-time visitor analytics built with Next.js 16, React 19, and Supabase.

## Features

- **Real-time Analytics Tracking** - Automatically tracks every page view with visitor details
- **Device & Browser Detection** - Captures device type, browser, and OS information
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
- **Authentication**: Supabase Auth (ready for expansion)
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

- **Home Page** (`/`) - Landing page with feature overview
- **Analytics Dashboard** (`/analytics`) - View all visitor analytics

The analytics are automatically tracked on every page visit. Just navigate around and watch the data appear in real-time!

## Database Schema

The `page_views` table stores:
- `id` - Unique identifier
- `path` - Page path visited
- `referrer` - Referrer URL
- `user_agent` - Browser user agent
- `device_type` - Mobile, Tablet, or Desktop
- `browser` - Chrome, Safari, Firefox, etc.
- `os` - Operating system
- `created_at` - Timestamp of visit

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and set up the build
4. Add your Supabase environment variables in Vercel project settings
5. Deploy!

Your site will be automatically published and live.

## Project Status

✅ Complete and ready for production deployment
