CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
                       id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       email         VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255),
                       role          VARCHAR(20) NOT NULL CHECK (role IN ('CANDIDATE','RECRUITER','ADMIN')),
                       is_verified   BOOLEAN DEFAULT FALSE,
                       is_active     BOOLEAN DEFAULT TRUE,
                       oauth_provider VARCHAR(50),
                       oauth_id      VARCHAR(255),
                       created_at    TIMESTAMPTZ DEFAULT NOW(),
                       updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
                                id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                token_hash  VARCHAR(255) UNIQUE NOT NULL,
                                is_revoked  BOOLEAN DEFAULT FALSE,
                                expires_at  TIMESTAMPTZ NOT NULL,
                                created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email_verifications (
                                     id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                     user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                     otp_hash   VARCHAR(255) NOT NULL,
                                     expires_at TIMESTAMPTZ NOT NULL,
                                     used       BOOLEAN DEFAULT FALSE,
                                     created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE job_categories (
                                id   SERIAL PRIMARY KEY,
                                name VARCHAR(100) UNIQUE NOT NULL,
                                slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE companies (
                           id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           name         VARCHAR(255) NOT NULL,
                           domain       VARCHAR(255) UNIQUE NOT NULL,
                           logo_s3_key  VARCHAR(500),
                           website      VARCHAR(500),
                           description  TEXT,
                           is_verified  BOOLEAN DEFAULT FALSE,
                           created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE candidate_profiles (
                                    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                    user_id          UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                    full_name        VARCHAR(255) NOT NULL,
                                    phone            VARCHAR(20),
                                    headline         VARCHAR(500),
                                    summary          TEXT,
                                    skills           TEXT[],
                                    experience_years INT DEFAULT 0,
                                    location         VARCHAR(255),
                                    linkedin_url     VARCHAR(500),
                                    github_url       VARCHAR(500),
                                    portfolio_url    VARCHAR(500),
                                    resume_s3_key    VARCHAR(500),
                                    resume_filename  VARCHAR(255),
                                    completeness_pct INT DEFAULT 0,
                                    created_at       TIMESTAMPTZ DEFAULT NOW(),
                                    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recruiter_profiles (
                                    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                    user_id     UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                    full_name   VARCHAR(255) NOT NULL,
                                    company_id  UUID REFERENCES companies(id),
                                    designation VARCHAR(255),
                                    phone       VARCHAR(20),
                                    is_verified BOOLEAN DEFAULT FALSE,
                                    created_at  TIMESTAMPTZ DEFAULT NOW(),
                                    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE jobs (
                      id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                      recruiter_id       UUID NOT NULL REFERENCES recruiter_profiles(id),
                      company_id         UUID NOT NULL REFERENCES companies(id),
                      title              VARCHAR(255) NOT NULL,
                      slug               VARCHAR(300) UNIQUE NOT NULL,
                      description        TEXT NOT NULL,
                      requirements       TEXT,
                      skills_required    TEXT[],
                      category_id        INT REFERENCES job_categories(id),
                      job_type           VARCHAR(50) CHECK (job_type IN ('FULL_TIME','PART_TIME','CONTRACT','INTERNSHIP','REMOTE')),
                      experience_min     INT DEFAULT 0,
                      experience_max     INT,
                      salary_min         NUMERIC(12,2),
                      salary_max         NUMERIC(12,2),
                      location           VARCHAR(255),
                      is_remote          BOOLEAN DEFAULT FALSE,
                      status             VARCHAR(30) DEFAULT 'PENDING'
                          CHECK (status IN ('PENDING','ACTIVE','CLOSED','REJECTED','EXPIRED')),
                      moderation_note    TEXT,
                      views_count        INT DEFAULT 0,
                      applications_count INT DEFAULT 0,
                      expires_at         TIMESTAMPTZ,
                      created_at         TIMESTAMPTZ DEFAULT NOW(),
                      updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE applications (
                              id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              job_id       UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
                              candidate_id UUID NOT NULL REFERENCES candidate_profiles(id),
                              cover_letter TEXT,
                              match_score  NUMERIC(5,2),
                              status       VARCHAR(30) DEFAULT 'APPLIED'
                                  CHECK (status IN ('APPLIED','REVIEWED','SHORTLISTED','INTERVIEW','OFFERED','REJECTED','WITHDRAWN')),
                              status_note  TEXT,
                              applied_at   TIMESTAMPTZ DEFAULT NOW(),
                              updated_at   TIMESTAMPTZ DEFAULT NOW(),
                              UNIQUE(job_id, candidate_id)
);

CREATE TABLE saved_jobs (
                            candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
                            job_id       UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
                            saved_at     TIMESTAMPTZ DEFAULT NOW(),
                            PRIMARY KEY(candidate_id, job_id)
);

CREATE TABLE notifications (
                               id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                               type       VARCHAR(100) NOT NULL,
                               title      VARCHAR(255) NOT NULL,
                               message    TEXT NOT NULL,
                               data       JSONB,
                               is_read    BOOLEAN DEFAULT FALSE,
                               created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_log (
                           id          BIGSERIAL PRIMARY KEY,
                           user_id     UUID REFERENCES users(id),
                           action      VARCHAR(100) NOT NULL,
                           entity_type VARCHAR(100),
                           entity_id   UUID,
                           ip_address  INET,
                           user_agent  TEXT,
                           created_at  TIMESTAMPTZ DEFAULT NOW()
);