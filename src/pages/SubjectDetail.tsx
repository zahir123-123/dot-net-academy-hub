
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSubjectById } from '@/data/subjectsData';
import { getPlaylistVideos } from '@/services/youtubeService';
import { getSubjectProgress, calculateSubjectCompletion } from '@/services/progressService';
import { Video, Subject, UserProgress } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Play, CheckCircle, Clock } from 'lucide-react';
import { VideoPlayer } from '@/components/VideoPlayer/VideoPlayer';

export default function SubjectDetail() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('videos');

  // Load subject data
  useEffect(() => {
    if (!subjectId) return;

    const currentSubject = getSubjectById(subjectId);
    if (currentSubject) {
      setSubject(currentSubject);

      // Load progress data
      const progressData = getSubjectProgress(subjectId);
      setProgress(progressData);

      // Fetch videos from playlist
      const fetchVideos = async () => {
        try {
          const videosList = await getPlaylistVideos(currentSubject.playlistId);
          setVideos(videosList);
          
          // Select first video initially if none selected
          if (videosList.length > 0 && !selectedVideoId) {
            setSelectedVideoId(videosList[0].id);
          }
        } catch (error) {
          console.error('Error fetching videos:', error);
        }
      };

      fetchVideos();
    }
  }, [subjectId]);

  // Handle completion percentage
  const completionPercentage = 
    progress && videos.length > 0
      ? calculateSubjectCompletion(subjectId || '', videos.length)
      : 0;

  // Check if a video is completed
  const isVideoCompleted = (videoId: string) => {
    return progress?.completedVideos.includes(videoId) || false;
  };

  // Format video duration from ISO 8601 format
  const formatDuration = (duration: string | undefined) => {
    if (!duration) return 'Unknown';
    
    // Simple conversion from ISO 8601 duration format
    // This is a simplified version and might not handle all cases
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;
    
    const hours = match[1] ? `${match[1]}:` : '';
    const minutes = match[2] ? `${match[2]}:` : '0:';
    const seconds = match[3] ? `${match[3].padStart(2, '0')}` : '00';
    
    return `${hours}${minutes}${seconds}`;
  };

  // Handle video selection
  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId);
    // Switch to video tab if not already active
    if (activeTab !== 'videos') {
      setActiveTab('videos');
    }
  };

  if (!subject) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{subject.title}</h1>
        <p className="text-muted-foreground">{subject.description}</p>
      </div>

      {/* Progress information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Progress value={completionPercentage} className="h-2 w-40" />
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
              <span>
                {progress?.completedVideos.length || 0} of {videos.length} videos completed
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content tabs: Videos and Resources */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        {/* Videos tab */}
        <TabsContent value="videos" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Video player column */}
            <div className="md:col-span-2">
              {selectedVideoId && (
                <VideoPlayer 
                  subjectId={subjectId || ''} 
                  videoId={selectedVideoId} 
                />
              )}
            </div>
            
            {/* Video list column */}
            <div>
              <h3 className="mb-2 text-lg font-medium">Lessons</h3>
              <div className="space-y-2">
                {videos.map((video) => (
                  <Card 
                    key={video.id}
                    className={`cursor-pointer transition-colors ${
                      selectedVideoId === video.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-muted'
                    }`}
                    onClick={() => handleVideoSelect(video.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="relative h-16 w-28 flex-none overflow-hidden rounded-sm">
                          {isVideoCompleted(video.id) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                              <CheckCircle className="h-6 w-6 text-primary" />
                            </div>
                          )}
                          {video.thumbnail && (
                            <img 
                              src={video.thumbnail} 
                              alt={video.title} 
                              className="h-full w-full object-cover"
                            />
                          )}
                          <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-xs text-white">
                            {formatDuration(video.duration)}
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <h4 className="line-clamp-2 text-sm font-medium">{video.title}</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {isVideoCompleted(video.id) ? 'Completed' : 'Not completed'}
                            </span>
                            {selectedVideoId === video.id ? (
                              <span className="text-xs font-medium text-primary">Now Playing</span>
                            ) : (
                              <Play className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Resources tab */}
        <TabsContent value="resources">
          {subject.resources && subject.resources.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subject.resources.map((resource) => (
                <Card key={resource.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-4 w-4" />
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="mb-4 text-sm text-muted-foreground">{resource.description}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full gap-1.5" 
                      asChild
                    >
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No resources available</h3>
              <p className="text-sm text-muted-foreground">
                Resources for this subject will be added soon.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
