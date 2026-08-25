-- Sabi MVP Database Schema
-- Locked Architecture: Sales Memory & Revenue Recovery Engine

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT,
    currency TEXT DEFAULT 'NGN' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Deals Table (The Core Revenue Engine)
CREATE TABLE IF NOT EXISTS public.deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    product_name TEXT NOT NULL,
    amount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL CHECK (amount >= 0),
    currency TEXT DEFAULT 'NGN' NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('open', 'won', 'lost')) DEFAULT 'open',
    customer_constraint TEXT,
    captured_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_vendor_contact_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_customer_response_at TIMESTAMPTZ,
    follow_up_due_at TIMESTAMPTZ NOT NULL,
    won_at TIMESTAMPTZ,
    lost_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Activities Table (Minimal Audit Trail for Core Loop)
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('captured', 'followup_copied', 'followup_sent', 'won', 'lost')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for lightning-fast queries on Today Queue
CREATE INDEX IF NOT EXISTS idx_deals_user_status_due ON public.deals(user_id, status, follow_up_due_at);
CREATE INDEX IF NOT EXISTS idx_activities_user_deal ON public.activities(user_id, deal_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- 1. Profiles RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Deals RLS Policies
CREATE POLICY "Users can view own deals" ON public.deals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deals" ON public.deals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deals" ON public.deals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own deals" ON public.deals
    FOR DELETE USING (auth.uid() = user_id);

-- 3. Activities RLS Policies
CREATE POLICY "Users can view own activities" ON public.activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON public.activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

