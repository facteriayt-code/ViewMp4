
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
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
}

export interface UserUpload {
  title: string;
  video: File | null;
  thumbnail: File | null;
  description: string;
}