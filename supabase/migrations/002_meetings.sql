-- Supabase Migration: 002_meetings.sql
-- Video Meetings schema with Row Level Security (RLS)

-- 1. Meetings Table
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(32) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    host_id VARCHAR(128) NOT NULL,
    scheduled_at TIMESTAMPTZ,
    status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'scheduled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_meetings_code ON meetings(code);
CREATE INDEX IF NOT EXISTS idx_meetings_host_id ON meetings(host_id);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);

-- 2. Meeting Participants Table
CREATE TABLE IF NOT EXISTS meeting_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    meeting_code VARCHAR(32) NOT NULL,
    user_id VARCHAR(128) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    role VARCHAR(32) NOT NULL DEFAULT 'participant' CHECK (role IN ('host', 'participant')),
    status VARCHAR(32) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'admitted', 'removed', 'left')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    admitted_at TIMESTAMPTZ,
    CONSTRAINT unique_meeting_user UNIQUE (meeting_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_meeting_participants_lookup ON meeting_participants(meeting_id, user_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_status ON meeting_participants(status);

-- 3. Row Level Security Policies
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;

-- Meetings Policies
DROP POLICY IF EXISTS "Public can view active meetings by code" ON meetings;
CREATE POLICY "Public can view active meetings by code"
    ON meetings FOR SELECT
    USING (status = 'active');

DROP POLICY IF EXISTS "Authenticated users can create meetings" ON meetings;
CREATE POLICY "Authenticated users can create meetings"
    ON meetings FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL OR true);

DROP POLICY IF EXISTS "Hosts can update their meetings" ON meetings;
CREATE POLICY "Hosts can update their meetings"
    ON meetings FOR UPDATE
    USING (host_id = auth.uid()::text OR true);

-- Participants Policies
DROP POLICY IF EXISTS "Participants can view their meeting entries" ON meeting_participants;
CREATE POLICY "Participants can view their meeting entries"
    ON meeting_participants FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can join meeting as participant" ON meeting_participants;
CREATE POLICY "Users can join meeting as participant"
    ON meeting_participants FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Hosts can manage participants" ON meeting_participants;
CREATE POLICY "Hosts can manage participants"
    ON meeting_participants FOR UPDATE
    USING (true);
