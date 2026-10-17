import { Express, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SESSION_SECRET = process.env.SESSION_SECRET || process.env.JWT_SECRET || 'eduhub-secure-session-secret-2026';

// LiveKit credentials
const LIVEKIT_URL = process.env.LIVEKIT_URL;
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

export interface SessionUser {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  btId?: string;
  email?: string;
}

export interface Meeting {
  id: string;
  code: string;
  title: string;
  hostId: string;
  hostName: string;
  scheduledAt?: string | null;
  status: 'active' | 'ended' | 'scheduled';
  createdAt: string;
  endedAt?: string | null;
}

export interface MeetingParticipant {
  id: string;
  meetingId: string;
  meetingCode: string;
  userId: string;
  name: string;
  avatar?: string;
  role: 'host' | 'participant';
  status: 'waiting' | 'admitted' | 'removed' | 'left';
  joinedAt: string;
  admittedAt?: string | null;
}

// In-memory data store ensuring rapid state resolution
const meetingsDb = new Map<string, Meeting>(); // keyed by code
const participantsDb = new Map<string, MeetingParticipant[]>(); // keyed by code

// Helper: Parse and validate Supabase credentials gracefully
function resolveSupabaseConfig(rawUrl?: string, rawKey?: string): { url: string; key: string } | null {
  if (!rawUrl || !rawKey) return null;
  const trimmedUrl = rawUrl.trim();
  const trimmedKey = rawKey.trim();
  if (!trimmedUrl || !trimmedKey || trimmedUrl.includes('xxxxxxxx') || trimmedKey.includes('xxxxxxxx')) {
    return null;
  }

  let formattedUrl = trimmedUrl;
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    if (formattedUrl.includes('.')) {
      formattedUrl = 'https://' + formattedUrl;
    } else if (/^[a-zA-Z0-9_-]+$/.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}.supabase.co`;
    } else {
      return null;
    }
  }

  try {
    const parsed = new URL(formattedUrl);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return { url: formattedUrl, key: trimmedKey };
    }
  } catch {
    return null;
  }
  return null;
}

// Initialize Supabase client if valid config is provided
let supabase: SupabaseClient | null = null;
const supabaseConfig = resolveSupabaseConfig(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
);
if (supabaseConfig) {
  try {
    supabase = createClient(supabaseConfig.url, supabaseConfig.key, {
      auth: { persistSession: false },
    });
    console.log('Supabase client initialized for video meetings');
  } catch (err) {
    console.log('Supabase client unavailable, using in-memory store for meetings');
  }
} else {
  console.log('Using in-memory database store for video meetings');
}

// Generate code format: abc-defg-hij
export function generateMeetingCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const randStr = (len: number) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${randStr(3)}-${randStr(4)}-${randStr(3)}`;
}

// Helper: Extract session user from signed httpOnly cookie
export function getCookieUser(req: Request): SessionUser | null {
  const token = req.cookies?.session || req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, SESSION_SECRET) as SessionUser;
      if (decoded && decoded.id) {
        return decoded;
      }
    } catch {
      // invalid token
    }
  }

  // Check Bearer authorization header if passed
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice(7).trim();
    try {
      const decoded = jwt.verify(bearerToken, SESSION_SECRET) as SessionUser;
      if (decoded && decoded.id) {
        return decoded;
      }
    } catch {
      // invalid bearer token
    }
  }

  return null;
}

// Middleware: Require authenticated session cookie
function requireSession(req: Request, res: Response, next: NextFunction) {
  const user = getCookieUser(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Active session cookie required to access video meetings',
    });
  }
  (req as any).user = user;
  next();
}

export function setupMeetingsRoutes(app: Express) {
  // Session synchronization endpoint: allows browser to establish signed httpOnly session cookie
  app.post('/api/auth/session', (req: Request, res: Response) => {
    const { id, name, role, avatar, btId, email } = req.body || {};
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Valid user id required' });
    }

    const user: SessionUser = {
      id,
      name: name || 'EduHub Scholar',
      role: role || 'student',
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      btId: btId || 'BT24CS001',
      email: email || '',
    };

    const token = jwt.sign(user, SESSION_SECRET, { expiresIn: '7d' });
    res.cookie('session', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      path: '/',
    });

    return res.json({ success: true, user });
  });

  // Current session query
  app.get('/api/auth/session', (req: Request, res: Response) => {
    const user = getCookieUser(req);
    if (!user) {
      return res.status(401).json({ success: false, error: 'No active session' });
    }
    return res.json({ success: true, user });
  });

  // Check Video Configuration Status
  app.get('/api/meetings/config', (req: Request, res: Response) => {
    const isConfigured = Boolean(LIVEKIT_URL && LIVEKIT_API_KEY && LIVEKIT_API_SECRET);
    res.json({
      configured: isConfigured,
      livekitUrl: LIVEKIT_URL ? 'configured' : undefined,
    });
  });

  // 1. POST /api/meetings: create a meeting
  app.post('/api/meetings', requireSession, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user as SessionUser;
      const { title, scheduledTime, scheduledAt } = req.body || {};

      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'Meeting title is required' });
      }

      const code = generateMeetingCode();
      const meetingId = `meet_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const createdAt = new Date().toISOString();

      const meeting: Meeting = {
        id: meetingId,
        code,
        title: title.trim(),
        hostId: user.id,
        hostName: user.name,
        scheduledAt: scheduledTime || scheduledAt || null,
        status: 'active',
        createdAt,
      };

      // Store in memory
      meetingsDb.set(code, meeting);

      // Create initial host participant (admitted immediately)
      const hostParticipant: MeetingParticipant = {
        id: `part_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        meetingId,
        meetingCode: code,
        userId: user.id,
        name: user.name,
        avatar: user.avatar,
        role: 'host',
        status: 'admitted',
        joinedAt: createdAt,
        admittedAt: createdAt,
      };
      participantsDb.set(code, [hostParticipant]);

      // Persist to Supabase if configured
      if (supabase) {
        try {
          await supabase.from('meetings').insert({
            id: meetingId,
            code,
            title: meeting.title,
            host_id: user.id,
            scheduled_at: meeting.scheduledAt,
            status: 'active',
            created_at: createdAt,
          });

          await supabase.from('meeting_participants').insert({
            id: hostParticipant.id,
            meeting_id: meetingId,
            meeting_code: code,
            user_id: user.id,
            name: user.name,
            avatar: user.avatar,
            role: 'host',
            status: 'admitted',
            joined_at: createdAt,
            admitted_at: createdAt,
          });
        } catch (dbErr) {
          console.warn('Supabase insertion error:', dbErr);
        }
      }

      return res.status(201).json({
        id: meetingId,
        code,
        link: `/meet/${code}`,
        title: meeting.title,
        hostId: meeting.hostId,
        hostName: meeting.hostName,
        status: meeting.status,
        createdAt: meeting.createdAt,
      });
    } catch (err: any) {
      console.error('Error creating meeting:', err);
      return res.status(500).json({ error: err.message || 'Failed to create meeting' });
    }
  });

  // GET /api/meetings/:code: get meeting details & participants
  app.get('/api/meetings/:code', requireSession, (req: Request, res: Response) => {
    const code = req.params.code.toLowerCase().trim();
    const meeting = meetingsDb.get(code);

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const participants = participantsDb.get(code) || [];
    const user = (req as any).user as SessionUser;
    const isHost = meeting.hostId === user.id;
    const userParticipant = participants.find((p) => p.userId === user.id);

    return res.json({
      meeting,
      isHost,
      userParticipant,
      participants: isHost
        ? participants // Host sees all participants including waiting & removed
        : participants.filter((p) => p.status === 'admitted'), // Guests see admitted participants
      waitingCount: participants.filter((p) => p.status === 'waiting').length,
    });
  });

  // 2. POST /api/meetings/:code/join: join meeting
  app.post('/api/meetings/:code/join', requireSession, async (req: Request, res: Response) => {
    try {
      const code = req.params.code.toLowerCase().trim();
      const user = (req as any).user as SessionUser;
      const meeting = meetingsDb.get(code);

      if (!meeting) {
        return res.status(404).json({ error: 'Meeting not found' });
      }

      if (meeting.status === 'ended') {
        return res.status(410).json({ error: 'This meeting has already ended by the host' });
      }

      const isHost = meeting.hostId === user.id;
      let participants = participantsDb.get(code) || [];
      let participant = participants.find((p) => p.userId === user.id);

      if (participant) {
        // If participant was previously removed, reject re-entry
        if (participant.status === 'removed' && !isHost) {
          return res.status(403).json({
            error: 'You have been removed from this meeting by the host and cannot rejoin.',
            status: 'removed',
          });
        }

        // Host is always admitted
        if (isHost && participant.status !== 'admitted') {
          participant.status = 'admitted';
          participant.admittedAt = new Date().toISOString();
        }
      } else {
        // New participant
        const initialStatus = isHost ? 'admitted' : 'waiting';
        const now = new Date().toISOString();
        participant = {
          id: `part_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          meetingId: meeting.id,
          meetingCode: code,
          userId: user.id,
          name: user.name,
          avatar: user.avatar,
          role: isHost ? 'host' : 'participant',
          status: initialStatus,
          joinedAt: now,
          admittedAt: isHost ? now : null,
        };
        participants.push(participant);
        participantsDb.set(code, participants);

        if (supabase) {
          try {
            await supabase.from('meeting_participants').upsert({
              id: participant.id,
              meeting_id: meeting.id,
              meeting_code: code,
              user_id: user.id,
              name: user.name,
              avatar: user.avatar,
              role: participant.role,
              status: participant.status,
              joined_at: participant.joinedAt,
              admitted_at: participant.admittedAt,
            });
          } catch (e) {
            console.warn('Supabase upsert participant error:', e);
          }
        }
      }

      return res.json({
        meeting,
        participant,
        isHost,
        status: participant.status,
      });
    } catch (err: any) {
      console.error('Error joining meeting:', err);
      return res.status(500).json({ error: err.message || 'Failed to join meeting' });
    }
  });

  // 3. POST /api/meetings/:code/admit: host only
  app.post('/api/meetings/:code/admit', requireSession, async (req: Request, res: Response) => {
    try {
      const code = req.params.code.toLowerCase().trim();
      const user = (req as any).user as SessionUser;
      const meeting = meetingsDb.get(code);

      if (!meeting) {
        return res.status(404).json({ error: 'Meeting not found' });
      }

      if (meeting.hostId !== user.id) {
        return res.status(403).json({ error: 'Forbidden: Only the meeting host can admit participants' });
      }

      const { userId, participantId } = req.body || {};
      if (!userId && !participantId) {
        return res.status(400).json({ error: 'userId or participantId is required' });
      }

      const participants = participantsDb.get(code) || [];
      const target = participants.find((p) => p.userId === userId || p.id === participantId);

      if (!target) {
        return res.status(404).json({ error: 'Participant not found' });
      }

      target.status = 'admitted';
      target.admittedAt = new Date().toISOString();

      if (supabase) {
        try {
          await supabase
            .from('meeting_participants')
            .update({ status: 'admitted', admitted_at: target.admittedAt })
            .eq('meeting_code', code)
            .eq('user_id', target.userId);
        } catch (e) {
          console.warn('Supabase update status error:', e);
        }
      }

      return res.json({ success: true, participant: target });
    } catch (err: any) {
      console.error('Error admitting participant:', err);
      return res.status(500).json({ error: err.message || 'Failed to admit participant' });
    }
  });

  // 4. POST /api/meetings/:code/remove: host only
  app.post('/api/meetings/:code/remove', requireSession, async (req: Request, res: Response) => {
    try {
      const code = req.params.code.toLowerCase().trim();
      const user = (req as any).user as SessionUser;
      const meeting = meetingsDb.get(code);

      if (!meeting) {
        return res.status(404).json({ error: 'Meeting not found' });
      }

      if (meeting.hostId !== user.id) {
        return res.status(403).json({ error: 'Forbidden: Only the meeting host can remove participants' });
      }

      const { userId, participantId } = req.body || {};
      if (!userId && !participantId) {
        return res.status(400).json({ error: 'userId or participantId is required' });
      }

      const participants = participantsDb.get(code) || [];
      const target = participants.find((p) => p.userId === userId || p.id === participantId);

      if (!target) {
        return res.status(404).json({ error: 'Participant not found' });
      }

      target.status = 'removed';

      // If LiveKit is configured, disconnect participant via RoomServiceClient
      if (LIVEKIT_URL && LIVEKIT_API_KEY && LIVEKIT_API_SECRET) {
        try {
          const roomService = new RoomServiceClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
          await roomService.removeParticipant(code, target.userId).catch(() => {});
        } catch (lkErr) {
          console.warn('LiveKit removeParticipant note:', lkErr);
        }
      }

      if (supabase) {
        try {
          await supabase
            .from('meeting_participants')
            .update({ status: 'removed' })
            .eq('meeting_code', code)
            .eq('user_id', target.userId);
        } catch (e) {
          console.warn('Supabase update status error:', e);
        }
      }

      return res.json({ success: true, message: 'Participant removed successfully' });
    } catch (err: any) {
      console.error('Error removing participant:', err);
      return res.status(500).json({ error: err.message || 'Failed to remove participant' });
    }
  });

  // 5. POST /api/meetings/:code/token: admitted participants only. Mint LiveKit access token
  app.post('/api/meetings/:code/token', requireSession, async (req: Request, res: Response) => {
    try {
      // Check LiveKit configuration
      if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
        return res.status(503).json({
          error: 'Video is not configured yet',
          message: 'LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET must be configured on the server.',
          configured: false,
        });
      }

      const code = req.params.code.toLowerCase().trim();
      const user = (req as any).user as SessionUser;
      const meeting = meetingsDb.get(code);

      if (!meeting) {
        return res.status(404).json({ error: 'Meeting not found' });
      }

      if (meeting.status === 'ended') {
        return res.status(410).json({ error: 'Meeting has ended' });
      }

      const participants = participantsDb.get(code) || [];
      const participant = participants.find((p) => p.userId === user.id);

      // Security check: Only admitted participants (or host) can get a token
      if (!participant || participant.status !== 'admitted') {
        return res.status(403).json({
          error: 'Forbidden: Participant must be admitted by the host before requesting a video token',
          status: participant ? participant.status : 'not_joined',
        });
      }

      // Mint a LiveKit access token with livekit-server-sdk
      // Identity is the user id, grants are limited to this room, expires in 2 hours
      const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity: user.id,
        name: user.name,
        ttl: '2h',
        metadata: JSON.stringify({
          avatar: user.avatar,
          role: participant.role,
        }),
      });

      at.addGrant({
        roomJoin: true,
        room: code,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      });

      const token = await at.toJwt();

      return res.json({
        token,
        url: LIVEKIT_URL,
        meeting: {
          id: meeting.id,
          code: meeting.code,
          title: meeting.title,
          hostId: meeting.hostId,
        },
        participant: {
          id: participant.id,
          userId: user.id,
          name: user.name,
          role: participant.role,
        },
      });
    } catch (err: any) {
      console.error('Error generating LiveKit token:', err);
      return res.status(500).json({ error: err.message || 'Failed to mint video token' });
    }
  });

  // 6. POST /api/meetings/:code/end: host only. Ends room with RoomService.deleteRoom
  app.post('/api/meetings/:code/end', requireSession, async (req: Request, res: Response) => {
    try {
      const code = req.params.code.toLowerCase().trim();
      const user = (req as any).user as SessionUser;
      const meeting = meetingsDb.get(code);

      if (!meeting) {
        return res.status(404).json({ error: 'Meeting not found' });
      }

      if (meeting.hostId !== user.id) {
        return res.status(403).json({ error: 'Forbidden: Only the meeting host can end the meeting' });
      }

      meeting.status = 'ended';
      meeting.endedAt = new Date().toISOString();

      // End room in LiveKit if configured
      if (LIVEKIT_URL && LIVEKIT_API_KEY && LIVEKIT_API_SECRET) {
        try {
          const roomService = new RoomServiceClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
          await roomService.deleteRoom(code).catch(() => {});
        } catch (lkErr) {
          console.warn('LiveKit deleteRoom note:', lkErr);
        }
      }

      if (supabase) {
        try {
          await supabase
            .from('meetings')
            .update({ status: 'ended', ended_at: meeting.endedAt })
            .eq('code', code);
        } catch (e) {
          console.warn('Supabase update meeting error:', e);
        }
      }

      return res.json({ success: true, message: 'Meeting ended successfully', meeting });
    } catch (err: any) {
      console.error('Error ending meeting:', err);
      return res.status(500).json({ error: err.message || 'Failed to end meeting' });
    }
  });
}
