/**
 * YouTube Utility functions and component for Video Lectures in Resources
 */
import React from 'react';

/**
 * Extracts the 11-character YouTube video ID from various YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - Raw 11-char ID
 */
export function getYouTubeVideoId(url?: string, defaultId: string = '09_LlHjoEiY'): string {
  if (!url || typeof url !== 'string') return defaultId;
  const trimmed = url.trim();

  // If already exactly 11-character alphanumeric/dash/underscore string
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})(?:[&?#]|$)/);
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }

  // Handle youtube.com/embed/VIDEO_ID or youtube.com/shorts/VIDEO_ID
  const embedMatch = trimmed.match(/youtube\.com\/(?:embed|shorts|v)\/([a-zA-Z0-9_-]{11})(?:[&?#]|$)/);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  // Handle youtube.com/watch?v=VIDEO_ID or youtube.com/watch?...&v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})(?:[&?#]|$)/);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  return defaultId;
}

export function getYouTubeWatchUrl(videoIdOrUrl?: string): string {
  const id = getYouTubeVideoId(videoIdOrUrl);
  return `https://www.youtube.com/watch?v=${id}`;
}

export function getYouTubeEmbedUrl(videoIdOrUrl?: string): string {
  const id = getYouTubeVideoId(videoIdOrUrl);
  return `https://www.youtube.com/embed/${id}`;
}

interface YouTubeLecturePlayerProps {
  videoUrl?: string;
  title?: string;
  className?: string;
  showDirectLink?: boolean;
  onLinkClick?: () => void;
}

/**
 * Renders the YouTube video lecture embed and YouTube direct watch link
 */
export const YouTubeLecturePlayer: React.FC<YouTubeLecturePlayerProps> = ({
  videoUrl,
  title = 'YouTube video player',
  className = '',
  showDirectLink = true,
  onLinkClick,
}) => {
  const videoId = getYouTubeVideoId(videoUrl);
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className={`space-y-2 ${className}`}>
      {showDirectLink && (
        <div>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline inline-flex items-center gap-1.5 text-xs font-semibold"
            onClick={(e) => {
              if (onLinkClick) {
                onLinkClick();
              }
            }}
          >
            Watch Video on YouTube
          </a>
        </div>
      )}

      <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-lg bg-black border border-slate-200 dark:border-slate-800 shadow-sm">
        <iframe
          className="w-full h-full"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};
