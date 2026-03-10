-- Migration script for AI Matching fields
-- Run this before deploying to production

-- Add new columns to applicants table for AI matching
ALTER TABLE applicants 
ADD COLUMN IF NOT EXISTS profile_id BIGINT NULL,
ADD COLUMN IF NOT EXISTS skills TEXT NULL;

-- Add index for profile_id for better query performance
CREATE INDEX IF NOT EXISTS idx_applicant_profile ON applicants(profile_id);

-- Note: matching_results table should already exist from entity definition
-- If not, Hibernate will create it with ddl-auto=update
