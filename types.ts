
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role?: 'admin' | 'user'; // Distinguish between viewer and content manager
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
  isUserUploaded?: boolean;
  uploaderId?: string;
  uploaderName?: string;
  isFeatured?: boolean; // Admin can set a movie as featured
}

export interface UserUpload {
  title: string;
  video: File | null;
  thumbnail: File | null;
  description: string;
}
