
import { UserProgress } from '@/types';

// In a real app, this would be stored in a database
// For this demo, we'll use localStorage
const PROGRESS_KEY = 'dotnet_academy_progress';

// Initialize with empty progress data
const getInitialProgress = (): Record<string, UserProgress> => {
  const storedProgress = localStorage.getItem(PROGRESS_KEY);
  return storedProgress ? JSON.parse(storedProgress) : {};
};

// Get progress for a specific subject
export const getSubjectProgress = (subjectId: string): UserProgress | null => {
  const allProgress = getInitialProgress();
  return allProgress[subjectId] || null;
};

// Get all user progress
export const getAllProgress = (): Record<string, UserProgress> => {
  return getInitialProgress();
};

// Update progress when a video is watched
export const updateVideoProgress = (
  subjectId: string, 
  videoId: string, 
  watchTimeInSeconds: number
): void => {
  const allProgress = getInitialProgress();
  const now = new Date().toISOString();
  
  // Get or create subject progress
  const currentProgress = allProgress[subjectId] || {
    userId: 'current-user', // In a real app, this would be the actual user ID
    subjectId,
    completedVideos: [],
    totalWatchTime: 0,
    lastWatched: now
  };
  
  // Update fields
  if (!currentProgress.completedVideos.includes(videoId)) {
    currentProgress.completedVideos.push(videoId);
  }
  
  currentProgress.totalWatchTime += watchTimeInSeconds;
  currentProgress.lastWatched = now;
  
  // Save back to storage
  allProgress[subjectId] = currentProgress;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
};

// Calculate completion percentage for a subject
export const calculateSubjectCompletion = (
  subjectId: string,
  totalVideosInSubject: number
): number => {
  if (totalVideosInSubject === 0) return 0;
  
  const progress = getSubjectProgress(subjectId);
  if (!progress) return 0;
  
  return Math.round((progress.completedVideos.length / totalVideosInSubject) * 100);
};

// Get total learning stats
export const getLearningStats = (): {
  totalWatchTimeInMinutes: number;
  completedVideos: number;
  lastActivityDate: string | null;
} => {
  const allProgress = getInitialProgress();
  let totalWatchTime = 0;
  let completedVideos = 0;
  let lastActivity: string | null = null;
  
  Object.values(allProgress).forEach(progress => {
    totalWatchTime += progress.totalWatchTime;
    completedVideos += progress.completedVideos.length;
    
    if (!lastActivity || new Date(progress.lastWatched) > new Date(lastActivity)) {
      lastActivity = progress.lastWatched;
    }
  });
  
  return {
    totalWatchTimeInMinutes: Math.round(totalWatchTime / 60),
    completedVideos,
    lastActivityDate: lastActivity
  };
};
