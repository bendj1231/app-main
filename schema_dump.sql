-- Supabase Schema Migration
-- Old project: gkbhgrozrzhalnjherfu (Sydney)
-- New project: upaainmhcqlghtsfmtrc (Singapore)
-- Generated: 2026-06-16

CREATE TABLE IF NOT EXISTS "public"."achievements" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "title" text NOT NULL, "description" text, "category" text NOT NULL, "achievement_date" timestamptz NOT NULL, "issuing_organization" text, "certificate_url" text, "is_public" boolean DEFAULT false, "metadata" jsonb DEFAULT '{}'::jsonb, "created_at" timestamptz NOT NULL DEFAULT now());

CREATE TABLE IF NOT EXISTS "public"."ai_usage_log" ("id" bigint NOT NULL, "user_id" uuid NOT NULL, "date" date NOT NULL DEFAULT CURRENT_DATE, "created_at" timestamptz NOT NULL DEFAULT now());

CREATE TABLE IF NOT EXISTS "public"."aircraft_categories" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "category_key" text NOT NULL, "category_label" text NOT NULL, "category_color" text NOT NULL, "subcategory_key" text, "subcategory_label" text, "subcategory_color" text, "display_order" integer DEFAULT 0, "created_at" timestamptz DEFAULT now(), "updated_at" timestamptz DEFAULT now());

CREATE TABLE IF NOT EXISTS "public"."aircraft_metrics" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "aircraft_id" text NOT NULL, "orders" integer, "delivered" integer, "operator_count" integer, "pilot_count" integer, "lifecycle_stage" text, "demand_level" text, "career_score" integer, "updated_at" timestamptz DEFAULT now());

CREATE TABLE IF NOT EXISTS "public"."aircraft_type_ratings" ("id" text NOT NULL, "manufacturer_id" text NOT NULL, "model" text NOT NULL, "category" text NOT NULL, "subcategory" text, "image" text NOT NULL, "sketchfab_id" text, "description" text NOT NULL, "why_choose_rating" text, "demand_level" text, "conditionally_new" text, "lifecycle_stage" text, "order_backlog" jsonb, "operator_count" integer, "total_deliveries" integer, "steep_approach_certified" boolean DEFAULT false, "engine_type" text, "range_versatility" text, "cabin_features" text[], "news" jsonb, "career_score" integer, "pilot_count" integer, "first_flight" integer NOT NULL, "specifications" jsonb NOT NULL, "training_requirements" jsonb NOT NULL, "training_curriculum" jsonb, "simulator_details" jsonb, "instructor_qualifications" jsonb, "certification" jsonb, "success_stories" jsonb, "faq" jsonb, "career_info" jsonb, "created_at" timestamptz DEFAULT now(), "updated_at" timestamptz DEFAULT now(), "hiring_requirements" jsonb, "compensation_data" jsonb, "comparison_data" jsonb, "show_career_outlook" boolean DEFAULT false, "extended_info_content" jsonb);

