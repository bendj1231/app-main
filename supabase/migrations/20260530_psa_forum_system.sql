-- Migration: PSA Forum System
-- Date: May 30, 2026
-- Purpose: Discussion forum for pilotshortage.org with verified identity support

-- ============================================
-- 1. FORUM CATEGORIES
-- ============================================

CREATE TABLE IF NOT EXISTS forum_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'MessageCircle',
    color VARCHAR(7) DEFAULT '#1e3a5f',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    requires_verification BOOLEAN NOT NULL DEFAULT false, -- PSA Plus members only
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Seed categories based on your four-floor tower narrative
INSERT INTO forum_categories (slug, name, description, sort_order, color, requires_verification) VALUES
    ('floor-zero', 'Floor 0: The Graduation Trap', 'Fresh CPL holders (200 hours) navigating the $500K hour gap. Share your wait time, application ratios, flight school experiences.', 1, '#c41e3a', false),
    ('floor-one', 'Floor 1: The Instructor Ceiling', 'CFIs with 5,000-7,000 hours seeking corporate/private pathways. Visibility for experienced instructors.', 2, '#d97706', false),
    ('floor-two', 'Floor 2: The Recognition Gap', 'The collapse point. No published requirements. Share what airlines actually told you vs what they published.', 3, '#1e3a5f', true),
    ('floor-three', 'Floor 3: The Seniority Trap', '12+ year captains handcuffed by seniority. Portable recognition alternatives.', 4, '#065f46', true),
    ('batch-2015', 'Batch of 2015', 'Still waiting after 11 years? This is your space. Document the timeline.', 5, '#7c3aed', false),
    ('2013-law', 'The 2013 Law Impact', 'Discussion of the 1,500 hour rule, its intent vs consequence, advocacy for reform.', 6, '#dc2626', false),
    ('verified-stories', 'Verified Pilot Stories', 'Veremark-verified testimonies only. Badge-backed credibility.', 7, '#059669', true),
    ('airline-transparency', 'Airline Transparency Reports', 'Which airlines publish real requirements vs PR fluff. Pressure campaigns.', 8, '#2563eb', true),
    ('legal-help', 'Legal & Labor Resources', 'Contract review, training bond disputes, regulatory complaints.', 9, '#4b5563', false),
    ('general', 'General Discussion', 'Announcements, introductions, off-topic (keep it aviation).', 10, '#6b7280', false)
ON CONFLICT (slug) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_forum_categories_sort ON forum_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_forum_categories_active ON forum_categories(is_active) WHERE is_active = true;

-- ============================================
-- 2. FORUM TOPICS (Threads)
-- ============================================

CREATE TABLE IF NOT EXISTS forum_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Content
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL, -- URL-friendly title
    content TEXT NOT NULL,
    excerpt VARCHAR(300), -- Auto-generated or manual
    
    -- Verification badge (links to your existing system)
    is_verified_author BOOLEAN NOT NULL DEFAULT false, -- Set via trigger if author has verified profile
    verification_badge_level VARCHAR(20) CHECK (verification_badge_level IN ('none', 'psa_member', 'pilot_recognition', 'veremark_verified')),
    
    -- Identity protection (PSA specific)
    display_name VARCHAR(100), -- Override real name (e.g., "Captain Niraj", "Batch2015_Pilot")
    show_real_name BOOLEAN NOT NULL DEFAULT false, -- Only for verified stories
    
    -- Engagement
    view_count INTEGER NOT NULL DEFAULT 0,
    reply_count INTEGER NOT NULL DEFAULT 0,
    like_count INTEGER NOT NULL DEFAULT 0,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked', 'hidden', 'featured')),
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false, -- For homepage display
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_reply_at TIMESTAMP WITH TIME ZONE, -- For sorting by activity
    
    -- Moderation
    moderated_by UUID REFERENCES auth.users(id),
    moderated_at TIMESTAMP WITH TIME ZONE,
    moderation_note TEXT,
    
    -- Search
    search_vector tsvector
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_topics_category ON forum_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_topics_status ON forum_topics(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_topics_featured ON forum_topics(is_featured, created_at) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_topics_last_reply ON forum_topics(last_reply_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_topics_author ON forum_topics(author_id);
CREATE INDEX IF NOT EXISTS idx_topics_pinned ON forum_topics(category_id, is_pinned, created_at) WHERE is_pinned = true;

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_topics_search ON forum_topics USING GIN(search_vector);

-- ============================================
-- 3. FORUM POSTS (Replies)
-- ============================================

CREATE TABLE IF NOT EXISTS forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE, -- For nested replies
    
    -- Content
    content TEXT NOT NULL,
    
    -- Verification (inherits from topic author but can differ)
    is_verified_author BOOLEAN NOT NULL DEFAULT false,
    verification_badge_level VARCHAR(20) CHECK (verification_badge_level IN ('none', 'psa_member', 'pilot_recognition', 'veremark_verified')),
    
    -- Identity protection
    display_name VARCHAR(100),
    show_real_name BOOLEAN NOT NULL DEFAULT false,
    
    -- Engagement
    like_count INTEGER NOT NULL DEFAULT 0,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'deleted')),
    is_solution BOOLEAN NOT NULL DEFAULT false, -- Marked as "accepted answer"
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    edited_at TIMESTAMP WITH TIME ZONE,
    
    -- Moderation
    moderated_by UUID REFERENCES auth.users(id),
    moderated_at TIMESTAMP WITH TIME ZONE,
    moderation_note TEXT,
    
    -- Search
    search_vector tsvector
);

CREATE INDEX IF NOT EXISTS idx_posts_topic ON forum_posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_parent ON forum_posts(parent_post_id) WHERE parent_post_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_posts_status ON forum_posts(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_posts_search ON forum_posts USING GIN(search_vector);

-- ============================================
-- 4. FORUM REACTIONS (Likes/Support)
-- ============================================

CREATE TABLE IF NOT EXISTS forum_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('topic', 'post')), -- polymorphic
    target_id UUID NOT NULL, -- either topic_id or post_id
    reaction_type VARCHAR(20) NOT NULL DEFAULT 'support' CHECK (reaction_type IN ('support', 'insightful', 'same-here', 'verified')), -- PSA-specific reactions
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id, target_type, target_id, reaction_type)
);

CREATE INDEX IF NOT EXISTS idx_reactions_target ON forum_reactions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON forum_reactions(user_id);

-- ============================================
-- 5. FORUM VIEWS (Analytics)
-- ============================================

CREATE TABLE IF NOT EXISTS forum_topic_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES auth.users(id), -- NULL for anonymous
    viewer_ip INET, -- For anon tracking
    viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_topic_views_topic ON forum_topic_views(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_views_time ON forum_topic_views(viewed_at);

-- ============================================
-- 6. FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_forum_categories_updated_at BEFORE UPDATE ON forum_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_topics_updated_at BEFORE UPDATE ON forum_topics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate search vectors
CREATE OR REPLACE FUNCTION forum_topics_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER forum_topics_search_update BEFORE INSERT OR UPDATE ON forum_topics
    FOR EACH ROW EXECUTE FUNCTION forum_topics_search_vector_update();

CREATE OR REPLACE FUNCTION forum_posts_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', COALESCE(NEW.content, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER forum_posts_search_update BEFORE INSERT OR UPDATE ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION forum_posts_search_vector_update();

-- Update topic reply count on post insert
CREATE OR REPLACE FUNCTION update_topic_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'active' THEN
        UPDATE forum_topics 
        SET reply_count = reply_count + 1,
            last_reply_at = NEW.created_at
        WHERE id = NEW.topic_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER forum_posts_reply_count AFTER INSERT ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_topic_reply_count();

-- Update like counts via reaction table
CREATE OR REPLACE FUNCTION update_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.target_type = 'topic' THEN
            UPDATE forum_topics SET like_count = like_count + 1 WHERE id = NEW.target_id;
        ELSIF NEW.target_type = 'post' THEN
            UPDATE forum_posts SET like_count = like_count + 1 WHERE id = NEW.target_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.target_type = 'topic' THEN
            UPDATE forum_topics SET like_count = like_count - 1 WHERE id = OLD.target_id;
        ELSIF OLD.target_type = 'post' THEN
            UPDATE forum_posts SET like_count = like_count - 1 WHERE id = OLD.target_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER forum_reactions_count AFTER INSERT OR DELETE ON forum_reactions
    FOR EACH ROW EXECUTE FUNCTION update_reaction_counts();

-- Set verification badge based on profile
CREATE OR REPLACE FUNCTION set_forum_verification_badge()
RETURNS TRIGGER AS $$
DECLARE
    v_is_verified BOOLEAN;
    v_has_recognition BOOLEAN;
BEGIN
    -- Check if user has verified profile
    SELECT verified_account, account_tier = 'recognition_plus' OR account_tier = 'enterprise'
    INTO v_is_verified, v_has_recognition
    FROM profiles
    WHERE id = NEW.author_id;
    
    IF v_is_verified AND v_has_recognition THEN
        NEW.is_verified_author := true;
        NEW.verification_badge_level := 'veremark_verified';
    ELSIF v_is_verified THEN
        NEW.is_verified_author := true;
        NEW.verification_badge_level := 'pilot_recognition';
    ELSE
        NEW.verification_badge_level := 'psa_member';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER forum_topics_verification BEFORE INSERT ON forum_topics
    FOR EACH ROW EXECUTE FUNCTION set_forum_verification_badge();

CREATE TRIGGER forum_posts_verification BEFORE INSERT ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION set_forum_verification_badge();

-- ============================================
-- 7. ROW LEVEL SECURITY
-- ============================================

-- Forum Categories (readable by all, editable by admins)
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories readable by all" ON forum_categories
    FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Categories editable by admins" ON forum_categories
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Forum Topics
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Topics readable by all" ON forum_topics
    FOR SELECT TO anon, authenticated 
    USING (status IN ('active', 'featured') OR (status = 'locked' AND is_pinned = true));

CREATE POLICY "Verified categories require auth" ON forum_topics
    FOR SELECT TO anon
    USING (
        NOT EXISTS (
            SELECT 1 FROM forum_categories c 
            WHERE c.id = category_id AND c.requires_verification = true
        )
    );

CREATE POLICY "Authors can edit own topics" ON forum_topics
    FOR UPDATE TO authenticated
    USING (author_id = auth.uid())
    WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can delete own topics" ON forum_topics
    FOR DELETE TO authenticated
    USING (author_id = auth.uid() AND reply_count = 0);

CREATE POLICY "Admins can moderate" ON forum_topics
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'super_admin')));

-- Forum Posts
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts readable by all" ON forum_posts
    FOR SELECT TO anon, authenticated USING (status = 'active');

CREATE POLICY "Authors can edit own posts" ON forum_posts
    FOR UPDATE TO authenticated
    USING (author_id = auth.uid())
    WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can delete own posts" ON forum_posts
    FOR DELETE TO authenticated
    USING (author_id = auth.uid());

CREATE POLICY "Admins can moderate posts" ON forum_posts
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'super_admin')));

-- Reactions
ALTER TABLE forum_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reactions" ON forum_reactions
    FOR ALL TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Reactions readable by all" ON forum_reactions
    FOR SELECT TO anon, authenticated USING (true);

-- ============================================
-- 8. HELPER FUNCTIONS FOR API
-- ============================================

-- Get topics with author info
CREATE OR REPLACE FUNCTION get_forum_topics(
    p_category_id UUID DEFAULT NULL,
    p_status VARCHAR DEFAULT 'active',
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
    id UUID,
    title VARCHAR,
    slug VARCHAR,
    excerpt VARCHAR,
    content TEXT,
    author_id UUID,
    author_name VARCHAR,
    display_name VARCHAR,
    is_verified_author BOOLEAN,
    verification_badge_level VARCHAR,
    category_id UUID,
    category_name VARCHAR,
    category_slug VARCHAR,
    view_count INTEGER,
    reply_count INTEGER,
    like_count INTEGER,
    is_pinned BOOLEAN,
    is_featured BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    last_reply_at TIMESTAMP WITH TIME ZONE
) LANGUAGE sql SECURITY DEFINER AS $$
    SELECT 
        t.id,
        t.title,
        t.slug,
        t.excerpt,
        t.content,
        t.author_id,
        p.full_name as author_name,
        COALESCE(t.display_name, p.full_name) as display_name,
        t.is_verified_author,
        t.verification_badge_level,
        t.category_id,
        c.name as category_name,
        c.slug as category_slug,
        t.view_count,
        t.reply_count,
        t.like_count,
        t.is_pinned,
        t.is_featured,
        t.created_at,
        t.last_reply_at
    FROM forum_topics t
    JOIN profiles p ON p.id = t.author_id
    JOIN forum_categories c ON c.id = t.category_id
    WHERE (p_category_id IS NULL OR t.category_id = p_category_id)
      AND t.status = p_status
    ORDER BY t.is_pinned DESC, t.last_reply_at DESC NULLS LAST, t.created_at DESC
    LIMIT p_limit OFFSET p_offset;
$$;

-- Search forum content
CREATE OR REPLACE FUNCTION search_forum(p_query TEXT, p_limit INTEGER DEFAULT 20)
RETURNS TABLE(
    id UUID,
    type TEXT, -- 'topic' or 'post'
    title TEXT,
    content TEXT,
    rank real
) LANGUAGE sql SECURITY DEFINER AS $$
    SELECT 
        t.id,
        'topic'::TEXT as type,
        t.title::TEXT,
        LEFT(t.content, 200)::TEXT as content,
        ts_rank(t.search_vector, websearch_to_tsquery('english', p_query)) as rank
    FROM forum_topics t
    WHERE t.search_vector @@ websearch_to_tsquery('english', p_query)
      AND t.status = 'active'
    
    UNION ALL
    
    SELECT 
        p.id,
        'post'::TEXT as type,
        ('Reply to: ' || t.title)::TEXT as title,
        LEFT(p.content, 200)::TEXT as content,
        ts_rank(p.search_vector, websearch_to_tsquery('english', p_query)) as rank
    FROM forum_posts p
    JOIN forum_topics t ON t.id = p.topic_id
    WHERE p.search_vector @@ websearch_to_tsquery('english', p_query)
      AND p.status = 'active'
      AND t.status = 'active'
    
    ORDER BY rank DESC
    LIMIT p_limit;
$$;

-- ============================================
-- 9. COMMENTS
-- ============================================

COMMENT ON TABLE forum_topics IS 'Discussion threads on pilotshortage.org. Supports identity protection for verified pilot stories.';
COMMENT ON TABLE forum_posts IS 'Replies to forum topics. Nested reply support via parent_post_id.';
COMMENT ON TABLE forum_categories IS 'Topic categories aligned with the four-floor tower narrative.';
COMMENT ON COLUMN forum_topics.verification_badge_level IS 'none=unverified psa_member=joined only pilot_recognition=verified profile veremark_verified=full verification chain';
COMMENT ON COLUMN forum_topics.display_name IS 'Override for identity protection. Used for "Captain Niraj" or "Batch2015_Pilot" style anonymity.';
