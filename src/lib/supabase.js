import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/*
=====================================================================
SUPABASE SCHEMA — run this SQL in your Supabase SQL editor
=====================================================================

create extension if not exists "pgcrypto";

create table organisations (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  created_at   timestamptz default now(),

  -- Branding
  name         text not null,
  logo_url     text,
  brand_colour text default '#AC3897',

  -- Signature defaults
  website_display  text,
  website_url      text,
  linkedin_url     text,
  youtube_url      text,
  tagline          text default 'Change the world faster',
  referral_text    text default 'Know a charity or social impact organisation that needs better tools? Referrals mean a lot to us - if someone you know could benefit, I''d love an introduction.',
  referral_link    text default 'Connect us here →',
  referral_href    text,
  banner_headline  text,
  banner_sub       text default 'Track outcomes · measure change · demonstrate the difference you make',
  banner_cta       text default 'Find out more →',
  banner_href      text,
  tedx_label       text default 'Watch our founder''s TEDx Talk',
  tedx_href        text,

  -- Admin passcode (plain text, low-stakes protection)
  passcode     text
);

-- Allow public read (team members load org config without login)
alter table organisations enable row level security;

create policy "Public can read organisations"
  on organisations for select
  using (true);

create policy "Anyone can insert organisations"
  on organisations for insert
  with check (true);

create policy "Passcode-holders can update"
  on organisations for update
  using (true);

-- Storage bucket for logos
-- In Supabase dashboard: Storage → New bucket → name: "logos" → Public: true
=====================================================================
*/
