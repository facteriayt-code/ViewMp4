
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface StreamingSource {
  source_id: number;
  name: string;
  type: string;
  region?: string;
  web_url: string;
  format?: string;
  price?: number | null;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  genre: string;
  year: number;
  rating: string;
  views: number;
  isUserUploaded?: boolean;
  uploaderId?: string;
  uploaderName?: string;
  watchmodeId?: number;
  backdrop?: string;
  trailer?: string;
  userRating?: number;
  criticScore?: number;
  streamingSources?: StreamingSource[];
  initialSeason?: number;
  initialEpisode?: number;
  isTv?: boolean;
  tmdbId?: number;
  imdbId?: string;
  rank?: number;
  poster?: string;
  weeksInTop10?: number;
}

export interface UserUpload {
  title: string;
  video: File | null;
  thumbnail: File | null;
  description: string;
}

export interface ContinueWatchingItem {
  movie: Movie;
  progress: number;
  currentTimeSeconds?: number;
  durationSeconds?: number;
  lastWatchedAt: number;
  season?: number;
  episode?: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userEmail?: string;
  text: string;
  createdAt: number;
  expiresAt: number;
}
