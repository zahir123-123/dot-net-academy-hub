
// Types for the application

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string;
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  icon: string;
  playlistId: string;
  videos?: Video[];
  resources?: Resource[];
  progress?: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'pdf' | 'link' | 'code';
}

export interface UserProgress {
  userId: string;
  subjectId: string;
  completedVideos: string[];
  totalWatchTime: number;
  lastWatched: string;
}
