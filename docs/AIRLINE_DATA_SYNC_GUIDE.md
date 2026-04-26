# Airline Data Sync Guide

This guide explains how to keep the Supabase `airlines` table in sync with the static data in `PortalAirlineExpectationsPage.tsx`.

## Purpose

- The app uses static data from `PortalAirlineExpectationsPage.tsx` (no appearance changes)
- The Supabase `airlines` table serves as a safeguard/backup
- When you update the static data, you should sync it to the database

## Current State

- App: Uses static `AIRLINES` constant in `PortalAirlineExpectationsPage.tsx`
- Database: `airlines` table with 71 rows
- Status: Not automatically synced (manual sync required)

## How to Sync

### Option 1: Manual SQL Updates (Recommended for small changes)

When you update a few airlines in the static file, run individual UPDATE statements:

```sql
UPDATE public.airlines 
SET 
  salary_range = '$100,000 – $265,000 USD/Year (Total Package)',
  flight_hours = '1,000 hrs (FO) / 6,000 hrs (DEC)',
  tags = ARRAY['5-Star Airline', 'Tax-Free', 'Worldwide Routes'],
  image = 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/qatar-airways.jpg',
  card_image = 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Qatar_Airways_Logo.png',
  description = 'Updated description here...',
  fleet = 'Boeing 777, 787, Airbus A350, A380',
  updated_at = NOW()
WHERE id = 'qatar';
```

### Option 2: Bulk Sync Using INSERT ... ON CONFLICT

For larger updates, use the INSERT ... ON CONFLICT approach:

```sql
INSERT INTO public.airlines (id, name, location, salary_range, flight_hours, tags, image, card_image, description, fleet, region, created_at, updated_at)
VALUES
  ('qatar', 'Qatar Airways', 'Qatar', '$100,000 – $265,000', '1,000 hrs', ARRAY['5-Star Airline'], 'image-url', 'card-image-url', 'description', 'fleet', 'Middle East', NOW(), NOW()),
  ('emirates', 'Emirates', 'UAE', '$130,000 - $280,000', '4,000+ hrs', ARRAY['5-Star Airline'], 'image-url', 'card-image-url', 'description', 'fleet', 'Middle East', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  location = EXCLUDED.location,
  salary_range = EXCLUDED.salary_range,
  flight_hours = EXCLUDED.flight_hours,
  tags = EXCLUDED.tags,
  image = EXCLUDED.image,
  card_image = EXCLUDED.card_image,
  description = EXCLUDED.description,
  fleet = EXCLUDED.fleet,
  region = EXCLUDED.region,
  updated_at = NOW();
```

### Option 3: Using the Supabase MCP Tool

Use the Supabase MCP tool in Cascade to execute SQL statements directly:

1. Call `mcp0_execute_sql` with your project ID: `gkbhgrozrzhalnjherfu`
2. Provide the SQL query to update the airline data
3. This is the fastest method for quick updates

## When to Sync

Sync the database when you:
- Add new airlines to the static file
- Update airline information (salary, fleet, requirements, etc.)
- Change airline descriptions or tags
- Update images or card images

## Important Notes

- **App appearance never changes** - the app continues using static data
- Database is purely for safeguard/backup purposes
- No automatic sync - manual sync required
- Sync frequency: Whenever you update the static data

## Database Schema Reference

The `airlines` table has these columns:
- `id` (text, primary key)
- `name` (text)
- `location` (text)
- `salary_range` (text, nullable)
- `flight_hours` (text, nullable)
- `tags` (text[], nullable)
- `image` (text, nullable)
- `card_image` (text, nullable)
- `description` (text, nullable)
- `fleet` (text, nullable)
- `region` (text)
- `expectations` (jsonb, nullable)
- `future_fleet_plans` (jsonb, nullable)
- `aircraft_demand` (jsonb, nullable)
- `pilot_requirements` (jsonb, nullable)
- `detailed_info` (jsonb, nullable)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## Example: Syncing a Single Airline

```sql
-- Update Qatar Airways with new salary information
UPDATE public.airlines 
SET 
  salary_range = '$105,000 – $270,000 USD/Year (Total Package)',  -- Updated salary
  updated_at = NOW()
WHERE id = 'qatar';
```

## Example: Adding a New Airline

```sql
-- Add a new airline
INSERT INTO public.airlines (id, name, location, salary_range, flight_hours, tags, image, card_image, description, fleet, region, created_at, updated_at)
VALUES (
  'new-airline',
  'New Airline Name',
  'Country',
  '$80,000 - $120,000',
  '2,000+ hrs',
  ARRAY['Tag1', 'Tag2'],
  'image-url',
  'card-image-url',
  'Description here',
  'Fleet information',
  'Region',
  NOW(),
  NOW()
);
```

## Quick Reference

- **Project ID**: `gkbhgrozrzhalnjherfu`
- **Table**: `public.airlines`
- **Static File**: `portal/pages/PortalAirlineExpectationsPage.tsx`
- **Sync Method**: Manual SQL updates via Supabase MCP or SQL Editor
