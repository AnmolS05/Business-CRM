-- Run this entirely in the Supabase SQL Editor

-- 1. Create Deals Table
CREATE TABLE IF NOT EXISTS public.deals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    phone_number TEXT,
    deal_value NUMERIC NOT NULL,
    stage TEXT DEFAULT 'New Lead',
    product_category TEXT,
    close_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Expenses Table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    expense_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    type TEXT CHECK (type IN ('Fixed', 'Variable')),
    date_logged DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Insert Deals Data
INSERT INTO public.deals (client_name, phone_number, deal_value, stage, product_category, close_date) VALUES
('Tata Digital Ltd', '919876543210', 2500000, 'Won', 'Software', '2026-05-15'),
('Reliance Retail', '919812345678', 1250000, 'Won', 'Software', '2026-06-10'),
('Infosys Tech Systems', '919711223344', 800000, 'Won', 'Consulting', '2026-07-02'),
('Mahindra Logistics', '919655443322', 450000, 'Proposal Sent', 'Software', '2026-08-20'),
('Adani Green Energy', '919544332211', 1800000, 'Contacted', 'AMC Services', '2026-09-01'),
('Zomato Merchant Ops', '919433221100', 250000, 'New Lead', 'Support', '2026-08-15'),
('Wipro Digital Services', '919322110099', 600000, 'Won', 'Support', '2026-04-18'),
('Apollo Healthcare', '919211009988', 350000, 'Lost', 'Hardware', '2026-03-30');

-- 4. Insert Expenses Data
INSERT INTO public.expenses (expense_name, amount, type, date_logged) VALUES
('Office Rent (Koramangala HQ)', 85000, 'Fixed', '2026-07-01'),
('AWS & Cloud Hosting', 28000, 'Fixed', '2026-07-05'),
('Engineering & Sales Payroll', 350000, 'Fixed', '2026-07-01'),
('Client Lunch with Tata Team', 12500, 'Variable', '2026-07-12'),
('Sales Flight to Mumbai', 24000, 'Variable', '2026-07-18'),
('SaaS Subscriptions & Tools', 15000, 'Fixed', '2026-07-10'),
('Google Ads & Lead Gen Campaign', 45000, 'Variable', '2026-07-22');
