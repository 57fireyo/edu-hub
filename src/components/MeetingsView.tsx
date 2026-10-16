import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  MessageSquare,
  Users,
  Copy,
  Check,
  Shield,
  ShieldAlert,
  Clock,
  Sparkles,
  AlertTriangle,
  Send,
  X,
  ChevronRight,
  Maximize2,
  Minimize2,
  UserCheck,
  UserX,
  RefreshCw,
  Info,
} from 'lucide-react';
import {
  LiveKitRoom,
  useTracks,
  useParticipants,
  useChat,
  RoomAudioRenderer,
  ConnectionQualityIndicator,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';

interface MeetingsViewProps {
  initialCode?: string | null;
}

interface MeetingMeta {
  id: string;
  code: string;
  title: string;
  hostId: string;
  hostName: string;
  scheduledAt?: string | null;
  status: 'active' | 'ended' | 'scheduled';
  createdAt: string;
}

interface ParticipantData {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  role: 'host' | 'participant';
  status: 'waiting' | 'admitted' | 'removed' | 'left';
  joinedAt: string;
}

interface ChatMsg {
  id: string;
  senderName: string;
  senderId: string;
  message: string;
  timestamp: string;
}

export const MeetingsView: React.FC<MeetingsViewProps> = ({ initialCode }) => {
  const { user } = useAuth();
  const { setActiveTab } = useApp();

  // Mode: 'lobby' | 'prejoin' | 'waiting' | 'room'
  const [viewMode, setViewMode] = useState<'lobby' | 'prejoin' | 'waiting' | 'room'>('lobby');
  const [meetingCode, setMeetingCode] = useState<string>(initialCode || '');
  const [meetingTitle, setMeetingTitle] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [currentMeeting, setCurrentMeeting] = useState<MeetingMeta | null>(null);

  // Pre-join & Device state
  const [camEnabled, setCamEnabled] = useState<boolean>(true);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  // LiveKit connection & Token
  const [livekitToken, setLivekitToken] = useState<string | null>(null);
  const [livekitUrl, setLivekitUrl] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  const [configNotice, setConfigNotice] = useState<string | null>(null);

  // Status & Participants
  const [isHost, setIsHost] = useState<boolean>(false);
  const [allParticipants, setAllParticipants] = useState<ParticipantData[]>([]);
  const [waitingParticipants, setWaitingParticipants] = useState<ParticipantData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // UI state inside the room
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isSharingScreen, setIsSharingScreen] = useState<boolean>(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [meetingDuration, setMeetingDuration] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Confirmation dialogs
  const [confirmEndOpen, setConfirmEndOpen] = useState<boolean>(false);
  const [confirmRemoveTarget, setConfirmRemoveTarget] = useState<ParticipantData | null>(null);

  // Ensure user session cookie is synchronized with backend
  useEffect(() => {
    if (user?.id) {
      fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: user.id,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          btId: user.btId,
          email: user.email,
        }),
      }).catch(console.warn);
    }
  }, [user]);

  // Check if initialCode was passed via props or URL
  useEffect(() => {
    if (initialCode) {
      setMeetingCode(initialCode);
      setViewMode('prejoin');
    } else {
      const match = window.location.pathname.match(/^\/meet\/([a-zA-Z0-9-]+)/);
      if (match && match[1]) {
        setMeetingCode(match[1]);
        setViewMode('prejoin');
      }
    }
  }, [initialCode]);

  // Meeting duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (viewMode === 'room') {
      timer = setInterval(() => {
        setMeetingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setMeetingDuration(0);
    }
    return () => clearInterval(timer);
  }, [viewMode]);

  // Local camera preview in Prejoin mode
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (viewMode === 'prejoin') {
      navigator.mediaDevices
        ?.getUserMedia({
          video: camEnabled,
          audio: micEnabled,
        })
        .then((s) => {
          stream = s;
          setLocalStream(s);
          setPermissionError(null);
          if (previewVideoRef.current) {
            previewVideoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera/Mic access note:', err);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setPermissionError(
              'Camera or microphone access was blocked by your browser. Please allow device permissions in your browser address bar to participate with audio and video.'
            );
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            setPermissionError('No camera or microphone hardware found on this system. You can still join as an attendee.');
          } else {
            setPermissionError(`Media device status: ${err.message || 'Unable to access media devices'}`);
          }
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [viewMode, camEnabled, micEnabled]);

  // Waiting room polling: checks admission status
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (viewMode === 'waiting' && meetingCode) {
      const checkStatus = async () => {
        try {
          const res = await fetch(`/api/meetings/${meetingCode}`, { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            if (data.userParticipant?.status === 'admitted') {
              // Admitted by host! Transition to room
              enterRoomWithToken(meetingCode);
            } else if (data.userParticipant?.status === 'removed') {
              setErrorMsg('The meeting host declined or removed your admission request.');
              setViewMode('lobby');
            }
          }
        } catch (e) {
          console.warn('Waiting room poll error:', e);
        }
      };

      pollInterval = setInterval(checkStatus, 2500);
      checkStatus();
    }

    return () => clearInterval(pollInterval);
  }, [viewMode, meetingCode]);

  // Host polling: checks for participants waiting to be admitted
  useEffect(() => {
    let hostPoll: NodeJS.Timeout;

    if (viewMode === 'room' && isHost && meetingCode) {
      const fetchParticipants = async () => {
        try {
          const res = await fetch(`/api/meetings/${meetingCode}`, { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            setAllParticipants(data.participants || []);
            const waiting = (data.participants || []).filter((p: ParticipantData) => p.status === 'waiting');
            setWaitingParticipants(waiting);
          }
        } catch (e) {
          console.warn('Host poll error:', e);
        }
      };

      hostPoll = setInterval(fetchParticipants, 3000);
      fetchParticipants();
    }

    return () => clearInterval(hostPoll);
  }, [viewMode, isHost, meetingCode]);

  // Create a new meeting
  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim()) {
      setErrorMsg('Please specify a title for the meeting');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: meetingTitle.trim(),
          scheduledTime: scheduledTime || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create meeting');
      }

      setMeetingCode(data.code);
      setCurrentMeeting(data);
      setIsHost(true);
      setViewMode('prejoin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to initiate video room');
    } finally {
      setIsLoading(false);
    }
  };

  // Join meeting handler from Pre-join
  const handleJoinFromPrejoin = async () => {
    if (!meetingCode.trim()) {
      setErrorMsg('Invalid meeting code');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const cleanCode = meetingCode.trim().toLowerCase();

    try {
      // 1. Join request
      const joinRes = await fetch(`/api/meetings/${cleanCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const joinData = await joinRes.json();

      if (!joinRes.ok) {
        throw new Error(joinData.error || 'Unable to join meeting');
      }

      setCurrentMeeting(joinData.meeting);
      setIsHost(joinData.isHost);

      if (joinData.status === 'admitted') {
        // Host or already admitted -> acquire token
        await enterRoomWithToken(cleanCode);
      } else {
        // Participant goes to waiting room
        setViewMode('waiting');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect to meeting room');
    } finally {
      setIsLoading(false);
    }
  };

  // Acquire LiveKit Token & Enter Room
  const enterRoomWithToken = async (code: string) => {
    setIsLoading(true);
    try {
      const tokenRes = await fetch(`/api/meetings/${code}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const tokenData = await tokenRes.json();

      if (tokenRes.status === 503) {
        // Video is not configured yet
        setIsConfigured(false);
        setConfigNotice(tokenData.message || 'Video credentials (LIVEKIT_URL, LIVEKIT_API_KEY) are not set on server.');
        setLivekitToken(null);
        setViewMode('room');
      } else if (!tokenRes.ok) {
        throw new Error(tokenData.error || 'Failed to authorize video token');
      } else {
        setIsConfigured(true);
        setLivekitToken(tokenData.token);
        setLivekitUrl(tokenData.url);
        setViewMode('room');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error initializing video session');
      setViewMode('lobby');
    } finally {
      setIsLoading(false);
    }
  };

  // Host: Admit participant
  const handleAdmit = async (targetUserId: string) => {
    try {
      const res = await fetch(`/api/meetings/${meetingCode}/admit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: targetUserId }),
      });
      if (res.ok) {
        setWaitingParticipants((prev) => prev.filter((p) => p.userId !== targetUserId));
      }
    } catch (e) {
      console.warn('Admit error:', e);
    }
  };

  // Host: Admit All
  const handleAdmitAll = async () => {
    for (const p of waitingParticipants) {
      await handleAdmit(p.userId);
    }
  };

  // Host: Remove participant
  const handleRemove = async (targetUserId: string) => {
    try {
      const res = await fetch(`/api/meetings/${meetingCode}/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: targetUserId }),
      });
      if (res.ok) {
        setAllParticipants((prev) => prev.filter((p) => p.userId !== targetUserId));
        setConfirmRemoveTarget(null);
      }
    } catch (e) {
      console.warn('Remove error:', e);
    }
  };

  // Host: End Meeting for all
  const handleEndMeeting = async () => {
    try {
      await fetch(`/api/meetings/${meetingCode}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      handleLeaveRoom();
    } catch (e) {
      console.warn('End meeting error:', e);
      handleLeaveRoom();
    }
  };

  // Leave Room
  const handleLeaveRoom = () => {
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
    }
    setViewMode('lobby');
    setLivekitToken(null);
    setCurrentMeeting(null);
    setMeetingCode('');
    setIsSharingScreen(false);
    setConfirmEndOpen(false);
  };

  // Screen share toggle
  const handleToggleScreenShare = async () => {
    if (isSharingScreen) {
      if (screenStream) {
        screenStream.getTracks().forEach((t) => t.stop());
        setScreenStream(null);
      }
      setIsSharingScreen(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(stream);
        setIsSharingScreen(true);
        stream.getVideoTracks()[0].onended = () => {
          setIsSharingScreen(false);
          setScreenStream(null);
        };
      } catch (err) {
        console.warn('Screen share canceled or denied:', err);
      }
    }
  };

  // Send in-meeting chat message
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMsg = {
      id: `msg_${Date.now()}`,
      senderName: user.name,
      senderId: user.id,
      message: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  // Copy meeting link
  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/meet/${meetingCode}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  // Format seconds to mm:ss
  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ----------------------------------------------------
  // 1. LOBBY VIEW
  // ----------------------------------------------------
  if (viewMode === 'lobby') {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                <Video className="w-3.5 h-3.5" />
                <span>Managed WebRTC Video Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                JDCOEM Video Meetings
              </h1>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                Host instant project meetings, live code syncs, mentor office hours, and collaborative study groups with crystal-clear audio, camera grid, and screen sharing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/60 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Host Waiting Room & RLS Security</span>
              </div>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Meeting Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Start or Schedule a Meeting
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Generate a protected room code. As host, you admit participants and control session media.
                </p>
              </div>

              <form onSubmit={handleCreateMeeting} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Meeting Title
                  </label>
                  <input
                    type="text"
                    required
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="e.g. Distributed Systems Lab Review"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Optional Scheduled Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Create & Launch Meeting</span>
                </button>
              </form>
            </div>
          </div>

          {/* Join with Code Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Join with Code or Link
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter an existing meeting code (e.g. <code>abc-defg-hij</code>) or paste the full meeting link.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Meeting Code or Link
                  </label>
                  <input
                    type="text"
                    value={meetingCode}
                    onChange={(e) => {
                      const val = e.target.value;
                      const match = val.match(/meet\/([a-zA-Z0-9-]+)/);
                      setMeetingCode(match ? match[1] : val);
                    }}
                    placeholder="abc-defg-hij"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Protected Admission</span>
                  </div>
                  <p>
                    Joining via link places you into the host waiting room. You will be automatically connected once the host approves.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (meetingCode.trim()) {
                      setViewMode('prejoin');
                    } else {
                      setErrorMsg('Please enter a valid meeting code');
                    }
                  }}
                  disabled={!meetingCode.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <span>Continue to Pre-join Preview</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. PRE-JOIN PREVIEW VIEW
  // ----------------------------------------------------
  if (viewMode === 'prejoin') {
    return (
      <div className="max-w-3xl mx-auto py-4 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setViewMode('lobby')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
          >
            ← Back to Meetings Lobby
          </button>
          <div className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Code: {meetingCode}
          </div>
        </div>

        {permissionError && (
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800 text-amber-200 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Camera / Microphone Notice</span>
            </div>
            <p>{permissionError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Video Preview Box (2 cols) */}
          <div className="md:col-span-2 relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
            {camEnabled && !permissionError ? (
              <video
                ref={previewVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-500">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full border-2 border-indigo-500/50 object-cover"
                />
                <span className="text-sm font-semibold text-slate-300">{user.name}</span>
                <span className="text-xs text-slate-500">Camera is off</span>
              </div>
            )}

            {/* In-preview Floating Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 shadow-xl">
              <button
                type="button"
                onClick={() => setMicEnabled(!micEnabled)}
                className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                  micEnabled ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 text-white'
                }`}
                title={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
              >
                {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setCamEnabled(!camEnabled)}
                className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                  camEnabled ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 text-white'
                }`}
                title={camEnabled ? 'Turn camera off' : 'Turn camera on'}
              >
                {camEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Join Info Panel (1 col) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
                Ready to Join
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {currentMeeting?.title || 'Meeting Session'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Joining as: <strong className="text-slate-800 dark:text-slate-200">{user.name}</strong> ({user.role})
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Microphone</span>
                <span className={micEnabled ? 'text-emerald-500 font-semibold' : 'text-red-500'}>
                  {micEnabled ? 'Active' : 'Muted'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Camera</span>
                <span className={camEnabled ? 'text-emerald-500 font-semibold' : 'text-slate-400'}>
                  {camEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleJoinFromPrejoin}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Video className="w-4 h-4" />
              )}
              <span>{isHost ? 'Launch Meeting as Host' : 'Ask to Join Meeting'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. WAITING ROOM VIEW (Participant waiting for host)
  // ----------------------------------------------------
  if (viewMode === 'waiting') {
    return (
      <div className="max-w-md mx-auto py-12 px-6 text-center space-y-6">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-indigo-600/20 text-indigo-500 animate-ping absolute" />
          <div className="w-20 h-20 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center relative">
            <Clock className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Waiting for Host to Admit You
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You've arrived at <strong>{currentMeeting?.title || 'the meeting'}</strong>.
            The host ({currentMeeting?.hostName || 'Organizer'}) has been notified and will let you in shortly.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 space-y-1">
          <div className="font-semibold text-slate-700 dark:text-slate-300">Room Code</div>
          <div className="font-mono text-sm text-indigo-500 font-bold">{meetingCode}</div>
        </div>

        <button
          onClick={handleLeaveRoom}
          className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
        >
          Cancel & Return to Lobby
        </button>
      </div>
    );
  }

  // ----------------------------------------------------
  // 4. ACTIVE MEETING ROOM (Dark UI Surface)
  // ----------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col select-none overflow-hidden font-sans">
      {/* Top Header Bar */}
      <header className="h-14 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">
              {currentMeeting?.title || 'JDCOEM Video Conference'}
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-[11px] font-mono text-slate-300">
            <span>{meetingCode}</span>
            <button
              onClick={handleCopyLink}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
              title="Copy meeting link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isHost && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950">
              HOST
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formatDuration(meetingDuration)}</span>
          </div>

          {/* Waiting Room Badge for Host */}
          {isHost && waitingParticipants.length > 0 && (
            <button
              onClick={() => setIsParticipantsOpen(true)}
              className="flex items-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer animate-bounce"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{waitingParticipants.length} Waiting</span>
            </button>
          )}

          <button
            onClick={() => setConfirmEndOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            {isHost ? 'End Meeting' : 'Leave'}
          </button>
        </div>
      </header>

      {/* Video Environment Configuration Notice Banner (if LiveKit credentials missing) */}
      {!isConfigured && (
        <div className="bg-amber-950/80 border-b border-amber-800/80 text-amber-200 text-xs px-4 py-2.5 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Video Server Notice:</strong> {configNotice || 'LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET not set.'} Room is running in local multi-participant preview mode.
            </span>
          </div>
          <span className="text-[10px] font-mono bg-amber-900/60 px-2 py-0.5 rounded text-amber-300">
            503 Server Fallback Active
          </span>
        </div>
      )}

      {/* Main Grid & Sidebars Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Central Video Grid */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center items-center overflow-y-auto">
          {/* If LiveKit Token & URL are configured, render LiveKit Room wrapper */}
          {isConfigured && livekitToken && livekitUrl ? (
            <LiveKitRoom
              serverUrl={livekitUrl}
              token={livekitToken}
              connect={true}
              video={camEnabled}
              audio={micEnabled}
              data-lk-theme="default"
              className="w-full h-full flex flex-col"
              onDisconnected={handleLeaveRoom}
            >
              <RoomAudioRenderer />
              <LiveKitParticipantGrid
                user={user}
                camEnabled={camEnabled}
                micEnabled={micEnabled}
                isSharingScreen={isSharingScreen}
                screenStream={screenStream}
              />
            </LiveKitRoom>
          ) : (
            // Native Multi-Participant Grid Layout (when LiveKit credentials are not yet populated)
            <div className="w-full h-full max-w-6xl flex flex-col justify-center items-center">
              {isSharingScreen && screenStream ? (
                // Screen Sharing Focus Layout
                <div className="w-full h-full flex flex-col lg:flex-row gap-3">
                  <div className="flex-1 bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center relative">
                    <video
                      autoPlay
                      playsInline
                      ref={(el) => {
                        if (el && screenStream) el.srcObject = screenStream;
                      }}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-3 left-3 bg-indigo-600/80 backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold text-white flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5" />
                      <span>{user.name} is presenting</span>
                    </div>
                  </div>

                  {/* Thumbnail strip on side */}
                  <div className="lg:w-64 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto shrink-0">
                    <LocalParticipantTile
                      name={`${user.name} (You)`}
                      avatar={user.avatar}
                      camEnabled={camEnabled}
                      micEnabled={micEnabled}
                      localStream={localStream}
                      role={isHost ? 'host' : 'participant'}
                    />
                  </div>
                </div>
              ) : (
                // Responsive Participant Tiles Grid
                <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[75vh]">
                  {/* Local User Tile */}
                  <LocalParticipantTile
                    name={`${user.name} (You)`}
                    avatar={user.avatar}
                    camEnabled={camEnabled}
                    micEnabled={micEnabled}
                    localStream={localStream}
                    role={isHost ? 'host' : 'participant'}
                  />

                  {/* Other connected participants */}
                  {allParticipants
                    .filter((p) => p.userId !== user.id && p.status === 'admitted')
                    .map((p) => (
                      <div
                        key={p.id}
                        className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center shadow-lg group aspect-video sm:aspect-auto"
                      >
                        <img
                          src={p.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                          alt={p.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-indigo-500/40 object-cover"
                        />
                        <span className="text-xs sm:text-sm font-bold text-white mt-2">{p.name}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{p.role}</span>

                        <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 text-white">
                          <span>{p.name}</span>
                          {p.role === 'host' && (
                            <span className="text-[9px] font-black px-1 rounded bg-amber-400 text-slate-950">
                              HOST
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
                          <span className="p-1 rounded bg-slate-950/80 text-emerald-400">
                            <Mic className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Drawer: In-Meeting Chat */}
        {isChatOpen && (
          <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full z-30 shadow-2xl">
            <div className="h-12 px-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>In-Meeting Chat</span>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
              {chatMessages.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <span>No messages yet. Send a note to participants in this meeting.</span>
                </div>
              ) : (
                chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-2.5 rounded-xl text-xs ${
                      m.senderId === user.id
                        ? 'bg-indigo-600/30 border border-indigo-500/40 ml-4'
                        : 'bg-slate-800 border border-slate-700/60 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-bold text-slate-200">{m.senderName}</span>
                      <span>{m.timestamp}</span>
                    </div>
                    <p className="text-slate-100 break-words">{m.message}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message meeting..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </aside>
        )}

        {/* Right Drawer: Participants & Host Waiting Room */}
        {isParticipantsOpen && (
          <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full z-30 shadow-2xl">
            <div className="h-12 px-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Participants</span>
              </div>
              <button
                onClick={() => setIsParticipantsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-3.5 overflow-y-auto space-y-4">
              {/* Host Waiting Room Queue */}
              {isHost && waitingParticipants.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/70 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                    <span>Waiting Room ({waitingParticipants.length})</span>
                    <button
                      onClick={handleAdmitAll}
                      className="text-[10px] text-amber-200 bg-amber-700/60 hover:bg-amber-600 px-2 py-0.5 rounded transition-colors cursor-pointer font-semibold"
                    >
                      Admit All
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {waitingParticipants.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs"
                      >
                        <div className="truncate max-w-[120px]">
                          <span className="font-semibold text-white">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleAdmit(p.userId)}
                            className="p-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                            title="Admit to meeting"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemove(p.userId)}
                            className="p-1 rounded bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
                            title="Decline request"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* In-Room Participants List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  In this Meeting
                </span>

                {/* You */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                    <div className="truncate">
                      <span className="text-xs font-bold text-white truncate block">{user.name} (You)</span>
                      <span className="text-[10px] text-indigo-400">{isHost ? 'Host' : user.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    {micEnabled ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-red-400" />}
                    {camEnabled ? <Video className="w-3.5 h-3.5 text-emerald-400" /> : <VideoOff className="w-3.5 h-3.5 text-slate-500" />}
                  </div>
                </div>

                {/* Other admitted participants */}
                {allParticipants
                  .filter((p) => p.userId !== user.id && p.status === 'admitted')
                  .map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-800"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={p.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                          alt={p.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div className="truncate">
                          <span className="text-xs font-semibold text-white truncate block">{p.name}</span>
                          <span className="text-[10px] text-slate-400 capitalize">{p.role}</span>
                        </div>
                      </div>

                      {/* Host control: Remove button */}
                      {isHost && (
                        <button
                          onClick={() => setConfirmRemoveTarget(p)}
                          className="text-[10px] text-red-400 hover:text-red-300 px-2 py-0.5 rounded hover:bg-red-950/60 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Meeting Controls Bar */}
      <footer className="h-20 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between z-20">
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Encrypted Session</span>
        </div>

        {/* Center Media Controls */}
        <div className="flex items-center gap-3 mx-auto">
          {/* Mic */}
          <button
            onClick={() => setMicEnabled(!micEnabled)}
            className={`p-3.5 rounded-full font-bold transition-all cursor-pointer shadow-lg ${
              micEnabled
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}
          >
            {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera */}
          <button
            onClick={() => setCamEnabled(!camEnabled)}
            className={`p-3.5 rounded-full font-bold transition-all cursor-pointer shadow-lg ${
              camEnabled
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={camEnabled ? 'Turn Video Off' : 'Turn Video On'}
          >
            {camEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={handleToggleScreenShare}
            className={`p-3.5 rounded-full font-bold transition-all cursor-pointer shadow-lg ${
              isSharingScreen
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={isSharingScreen ? 'Stop Screen Share' : 'Share Screen'}
          >
            {isSharingScreen ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => {
              setIsChatOpen(!isChatOpen);
              if (isParticipantsOpen) setIsParticipantsOpen(false);
            }}
            className={`p-3.5 rounded-full font-bold transition-all cursor-pointer shadow-lg relative ${
              isChatOpen ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="In-meeting Chat"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Participants Toggle */}
          <button
            onClick={() => {
              setIsParticipantsOpen(!isParticipantsOpen);
              if (isChatOpen) setIsChatOpen(false);
            }}
            className={`p-3.5 rounded-full font-bold transition-all cursor-pointer shadow-lg relative ${
              isParticipantsOpen ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Participants List"
          >
            <Users className="w-5 h-5" />
            {isHost && waitingParticipants.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                {waitingParticipants.length}
              </span>
            )}
          </button>

          {/* Leave / End Call */}
          <button
            onClick={() => setConfirmEndOpen(true)}
            className="p-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold transition-all cursor-pointer shadow-lg ml-2"
            title={isHost ? 'End Meeting for All' : 'Leave Meeting'}
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>

        <div className="hidden sm:block">
          <button
            onClick={handleCopyLink}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Invite Link'}</span>
          </button>
        </div>
      </footer>

      {/* Confirm End / Leave Modal */}
      {confirmEndOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">
                {isHost ? 'End Meeting for All?' : 'Leave Meeting?'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isHost
                ? 'As host, ending this meeting will disconnect all active participants and close the WebRTC room.'
                : 'Are you sure you want to disconnect from this video conference? You can rejoin anytime using the room link.'}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setConfirmEndOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              {isHost ? (
                <button
                  onClick={handleEndMeeting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shadow-md"
                >
                  End for All
                </button>
              ) : (
                <button
                  onClick={handleLeaveRoom}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shadow-md"
                >
                  Leave Meeting
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Remove Participant Modal */}
      {confirmRemoveTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <UserX className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">
                Remove {confirmRemoveTarget.name}?
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This participant will be immediately ejected from the meeting and won't be able to re-enter without host approval.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setConfirmRemoveTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemove(confirmRemoveTarget.userId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shadow-md"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// Subcomponent: Local User Video Tile
// ----------------------------------------------------
interface LocalParticipantTileProps {
  name: string;
  avatar: string;
  camEnabled: boolean;
  micEnabled: boolean;
  localStream: MediaStream | null;
  role: 'host' | 'participant';
}

const LocalParticipantTile: React.FC<LocalParticipantTileProps> = ({
  name,
  avatar,
  camEnabled,
  micEnabled,
  localStream,
  role,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && localStream && camEnabled) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream, camEnabled]);

  return (
    <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-lg group aspect-video sm:aspect-auto h-full min-h-[220px]">
      {camEnabled && localStream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1]"
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <img
            src={avatar}
            alt={name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-indigo-500/50 object-cover"
          />
          <span className="text-xs sm:text-sm font-bold text-white">{name}</span>
          <span className="text-[10px] text-slate-500">Camera Off</span>
        </div>
      )}

      {/* Name tag */}
      <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 text-white">
        <span>{name}</span>
        {role === 'host' && (
          <span className="text-[9px] font-black px-1 rounded bg-amber-400 text-slate-950">
            HOST
          </span>
        )}
      </div>

      {/* Mic status badge */}
      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
        <span className={`p-1 rounded bg-slate-950/80 ${micEnabled ? 'text-emerald-400' : 'text-red-400'}`}>
          {micEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
        </span>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Subcomponent: LiveKit Participant Grid
// ----------------------------------------------------
interface LiveKitParticipantGridProps {
  user: any;
  camEnabled: boolean;
  micEnabled: boolean;
  isSharingScreen: boolean;
  screenStream: MediaStream | null;
}

const LiveKitParticipantGrid: React.FC<LiveKitParticipantGridProps> = ({
  user,
  camEnabled,
  micEnabled,
  isSharingScreen,
  screenStream,
}) => {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  const participants = useParticipants();

  return (
    <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {tracks.map((trackRef) => (
        <div
          key={trackRef.participant.identity + '_' + trackRef.source}
          className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-lg"
        >
          {trackRef.publication?.isMuted || !trackRef.publication?.isSubscribed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center font-bold text-lg text-white">
                {trackRef.participant.name?.slice(0, 2).toUpperCase() || 'U'}
              </div>
              <span className="text-xs font-bold text-white">{trackRef.participant.name}</span>
            </div>
          ) : (
            <div className="w-full h-full relative">
              <video
                ref={(el) => {
                  if (el && trackRef.publication?.track) {
                    trackRef.publication.track.attach(el);
                  }
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white">
            <span>{trackRef.participant.name || trackRef.participant.identity}</span>
          </div>

          <div className="absolute bottom-2.5 right-2.5">
            <ConnectionQualityIndicator participant={trackRef.participant} />
          </div>
        </div>
      ))}
    </div>
  );
};
