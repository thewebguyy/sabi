# Sabi — The WhatsApp CRM for serious vendors

Sabi is a mobile-first PWA (Progressive Web App) designed for African SME vendors, freelancers, and small businesses who close deals inside WhatsApp DMs. It helps you track leads, manage your sales pipeline, and never forget a follow-up.

## 🚀 Tech Stack

### Frontend
- **React 18 + Vite** (Fast development and HMR)
- **TailwindCSS** (Utility-first, high-end dark theme)
- **Framer Motion** (Subtle micro-animations)
- **Zustand** (Lightweight global state)
- **React Router v6** (Client-side routing)
- **Vite PWA Plugin** (Ready for offline and app-like experience)

### Backend
- **Node.js + Express.js**
- **Supabase** (Auth, PostgreSQL Database, Real-time)
- **OpenAI API** (GPT-4o-mini for deal extraction and sales insights)

## 🛠️ Setup Instructions

### 1. Database Setup (Supabase)
1. Create a new project on [Supabase.com](https://supabase.com).
2. Copy the contents of `schema.sql` (found in the root directory).
3. Paste and run the SQL in your Supabase SQL Editor to create the necessary tables and RLS policies.

### 2. Backend Setup
1. Navigate to the `server` directory.
2. Create a `.env` file based on `.env.example`.
3. Fill in your `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, and other keys.
4. Run `npm install`.
5. Start the server with `npm run dev`.

### 3. Frontend Setup
1. Navigate to the `client` directory.
2. Create a `.env` file based on `.env.example`.
3. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Run `npm install`.
5. Start the development server with `npm run dev`.

## 🤖 AI Features
- **Magic Extract**: Paste a WhatsApp chat into Sabi, and it will automatically identify the product, price, and customer intent using GPT-4o-mini.
- **Suggested Replies**: Get warm, Nigerian-tone WhatsApp replies pre-written for you based on the deal context.

## 🎨 Branding
- **Primary Color**: `#0A3828` (Deep Forest Green)
- **Accent Color**: `#25D366` (WhatsApp Green)
- **Dark Background**: `#0D0D0D`

---

Built with "Lagos hustle energy" for the vendors who know their business inside-out.
**"You sabi your business."**
