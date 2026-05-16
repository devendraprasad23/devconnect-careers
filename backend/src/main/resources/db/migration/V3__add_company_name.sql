-- V3: Add company_name column to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);