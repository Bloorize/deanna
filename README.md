# Deanna Support App

A dedicated display application to support a family member with dementia. The app features a high-contrast, always-on display view for the iPad and a remote admin interface for family members to update the message and their status.

## Features
- **Display View**: Simple, large text readout. Auto-updates in real-time.
- **Admin View**: Rich text editor (Bold, Large Text, Lists) and Quick Presets.
- **Family Status**: A floating board showing the status of family members (e.g., Happy, Sleeping).
- **Authentication**: Secure login via Clerk.
- **Real-time**: Powered by Supabase.

## Tech Stack
- React + Vite
- Supabase (Database & Realtime)
- Clerk (Authentication)
- Tailwind / Vanilla CSS

## Setup Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/Bloorize/deanna
   cd deanna
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   ```

4. **Run**
   ```bash
   npm run dev
   ```

## Deployment

**Live URL (GitHub Pages):** https://bloorize.github.io/deanna/

The easiest way to deploy this app is with Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FBloorize%2Fdeanna&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY,VITE_CLERK_PUBLISHABLE_KEY)

1. Click the button above.
2. Link your GitHub account.
3. Enter the Environment Variables (Copy them from your `.env.local`).
4. Click **Deploy**.
