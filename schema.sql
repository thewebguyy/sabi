-- Create the tables as specified in the schema.

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone TEXT UNIQUE NOT NULL,
    business_name TEXT,
    currency TEXT DEFAULT 'NGN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    whatsapp_connected BOOLEAN DEFAULT false,
    plan TEXT DEFAULT 'free', -- 'free' | 'grind' | 'sabi_pro'
    has_seeded BOOLEAN DEFAULT false,
    notification_preferences JSONB DEFAULT '{"summary": true, "ghosting": true, "payments": true}'::jsonb
);

-- 1.1 OTP Codes Table (for persistent across instances)
CREATE TABLE IF NOT EXISTS public.otp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_otp_phone ON public.otp_codes(phone);

-- 2. Contacts Table
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    whatsapp_id TEXT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    trust_score INT DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Deals Table
CREATE TABLE IF NOT EXISTS public.deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL, -- AI-extracted item name
    amount NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'NGN',
    status TEXT DEFAULT 'inquiry', -- 'inquiry' | 'pending' | 'waiting_payment' | 'paid' | 'ghosted'
    summary TEXT, -- AI-generated 1-line summary of the chat
    customer_constraint TEXT, -- e.g. "needs it by Friday"
    ai_suggested_reply TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Reminders Table
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    trigger_time TIMESTAMP WITH TIME ZONE NOT NULL,
    message TEXT NOT NULL,
    is_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC NOT NULL,
    proof_image_url TEXT,
    verified_status TEXT DEFAULT 'pending', -- 'pending' | 'verified' | 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
    deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    direction TEXT NOT NULL, -- 'inbound' | 'outbound'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) on all tables.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Allow access to own records)
-- No public access policies for otp_codes, server uses service role.
CREATE POLICY "Users can only see their own data" ON public.users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Contacts can only see their own user's data" ON public.contacts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Deals can only see their own user's data" ON public.deals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Reminders can only see their own user's data" ON public.reminders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Payments can only see their own user's data" ON public.payments FOR ALL USING (auth.uid() = (SELECT user_id FROM deals WHERE id = deal_id));
CREATE POLICY "Messages can only see their own user's data" ON public.chat_messages FOR ALL USING (auth.uid() = user_id);
