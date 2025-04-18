
import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';
import { useNavigate } from 'react-router-dom';
import { updateVideoProgress } from '@/services/progressService';
import { getVideoById } from '@/services/youtubeService';
import { Video } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Play, 
  Pause, 
  Maximize, 
  Minimize,
  Download
} from 'lucide-react';

interface VideoPlayerProps {
  subjectId: string;
  videoId: string;
  onComplete?: () => void;
}

export function VideoPlayer({ subjectId, videoId, onComplete }: VideoPlayerProps) {
  const [video, setVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [lastSavedProgress, setLastSavedProgress] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load video details
  useEffect(() => {
    const fetchVideo = async () => {
      const videoData = await getVideoById(videoId);
      if (videoData) {
        setVideo(videoData);
      }
    };
    fetchVideo();
  }, [videoId]);

  // Handle progress updates (save every 10 seconds)
  useEffect(() => {
    if (played > 0 && played - lastSavedProgress > 0.1) {
      // Save progress to localStorage
      const watchTimeInSeconds = Math.round(played * duration);
      updateVideoProgress(subjectId, videoId, watchTimeInSeconds);
      setLastSavedProgress(played);
    }
  }, [played, lastSavedProgress, duration, subjectId, videoId]);

  // Handle full screen toggle
  const toggleFullScreen = () => {
    if (!playerContainerRef.current) return;

    if (!isFullScreen) {
      if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  // Handle video end
  const handleVideoEnd = () => {
    // Mark video as completed
    updateVideoProgress(subjectId, videoId, duration);
    
    // Notify parent component
    if (onComplete) {
      onComplete();
    }
  };

  // Handle player progress
  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setPlayed(state.played);
  };

  // Format duration from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        {video?.title && (
          <h2 className="text-xl font-semibold">{video.title}</h2>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div 
            ref={playerContainerRef} 
            className="relative aspect-video w-full overflow-hidden rounded-md"
          >
            <ReactPlayer
              ref={playerRef}
              url={`https://www.youtube.com/watch?v=${videoId}`}
              width="100%"
              height="100%"
              playing={isPlaying}
              controls={true}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleVideoEnd}
              onDuration={setDuration}
              onProgress={handleProgress}
              config={{
                playerVars: { 
                  showinfo: 0, 
                  rel: 0,
                  modestbranding: 1
                }
              }}
            />
            
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={toggleFullScreen}
              >
                {isFullScreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {video && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{video.title}</h3>
            {video.duration && (
              <span className="text-sm text-muted-foreground">
                Duration: {video.duration}
              </span>
            )}
          </div>
          <p className="text-muted-foreground">{video.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Progress: {Math.round(played * 100)}%
              </span>
              <div className="h-2 w-36 rounded-full bg-secondary">
                <div 
                  className="h-full rounded-full bg-primary" 
                  style={{ width: `${played * 100}%` }}
                />
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              Resources
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
