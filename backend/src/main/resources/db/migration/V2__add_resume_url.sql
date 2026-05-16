-- V2: Restructure tables to match Java entity mappings

-- ── 1. Drop tables that conflict with our simplified entity model ──
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS recruiter_profiles CASCADE;
DROP TABLE IF EXISTS candidate_profiles CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS job_categories CASCADE;
DROP TABLE IF EXISTS email_verifications CASCADE;

-- ── 2. Add profile columns directly to users table ──
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS skills TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS github_url VARCHAR(500);

-- ── 3. Recreate jobs table referencing users directly ──
CREATE TABLE jobs (
                      id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                      recruiter_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                      title              VARCHAR(255) NOT NULL,
                      slug               VARCHAR(300) UNIQUE NOT NULL,
                      description        TEXT NOT NULL,
                      requirements       TEXT,
                      skills_required    TEXT[],
                      job_type           VARCHAR(50) CHECK (job_type IN ('FULL_TIME','PART_TIME','CONTRACT','INTERNSHIP','FREELANCE','REMOTE')),
                      experience_min     INT DEFAULT 0,
                      experience_max     INT,
                      salary_min         NUMERIC(12,2),
                      salary_max         NUMERIC(12,2),
                      location           VARCHAR(255),
                      is_remote          BOOLEAN DEFAULT FALSE,
                      status             VARCHAR(30) DEFAULT 'ACTIVE'
                          CHECK (status IN ('PENDING','ACTIVE','CLOSED','REJECTED','EXPIRED')),
                      moderation_note    TEXT,
                      views_count        INT DEFAULT 0,
                      applications_count INT DEFAULT 0,
                      expires_at         TIMESTAMPTZ,
                      created_at         TIMESTAMPTZ DEFAULT NOW(),
                      updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. Recreate applications table referencing users directly ──
CREATE TABLE applications (
                              id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              job_id       UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
                              candidate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                              cover_letter TEXT,
                              resume_url   VARCHAR(500),
                              match_score  INT DEFAULT 0,
                              status       VARCHAR(30) DEFAULT 'APPLIED'
                                  CHECK (status IN ('APPLIED','REVIEWED','SHORTLISTED','INTERVIEW','OFFERED','REJECTED','WITHDRAWN')),
                              note         TEXT,
                              applied_at   TIMESTAMPTZ DEFAULT NOW(),
                              updated_at   TIMESTAMPTZ DEFAULT NOW(),
                              UNIQUE(job_id, candidate_id)
);