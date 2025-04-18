
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SubjectCard } from '@/components/Dashboard/SubjectCard';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { subjects } from '@/data/subjectsData';
import { getLearningStats, calculateSubjectCompletion } from '@/services/progressService';
import { getPlaylistVideos } from '@/services/youtubeService';

export default function Dashboard() {
  const [subjectsWithProgress, setSubjectsWithProgress] = useState(subjects);
  const [stats, setStats] = useState({
    totalWatchTimeInMinutes: 0,
    completedVideos: 0,
    lastActivityDate: null as string | null,
  });

  // Load progress and stats
  useEffect(() => {
    // Get learning stats
    const learningStats = getLearningStats();
    setStats(learningStats);

    // Calculate and update subject progress
    const updateSubjectsProgress = async () => {
      const updatedSubjects = await Promise.all(
        subjects.map(async (subject) => {
          try {
            // Get videos count for the subject to calculate progress
            const videos = await getPlaylistVideos(subject.playlistId);
            const progress = calculateSubjectCompletion(subject.id, videos.length);
            
            return {
              ...subject,
              videos,
              progress,
            };
          } catch (error) {
            console.error(`Error fetching videos for ${subject.title}:`, error);
            return subject;
          }
        })
      );

      setSubjectsWithProgress(updatedSubjects);
    };

    updateSubjectsProgress();
  }, []);

  // Format last activity date
  const formatLastActivity = (dateString: string | null) => {
    if (!dateString) return 'No activity yet';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format featured courses (top 2 courses with least progress)
  const featuredCourses = [...subjectsWithProgress]
    .sort((a, b) => (a.progress || 0) - (b.progress || 0))
    .slice(0, 2);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your progress and continue learning .NET development.
          </p>
        </div>
        <Button asChild>
          <Link to="/courses">View All Courses</Link>
        </Button>
      </div>

      {/* Stats section */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Watch Time"
          value={`${stats.totalWatchTimeInMinutes} min`}
          description="Total time spent learning"
          icon="clock"
        />
        <StatsCard
          title="Completed Videos"
          value={stats.completedVideos}
          description="Videos watched to completion"
          icon="video"
        />
        <StatsCard
          title="Last Activity"
          value={formatLastActivity(stats.lastActivityDate)}
          description="Last time you watched a video"
          icon="award"
        />
      </div>

      {/* Featured courses section */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Continue Learning</h2>
          <Button variant="link" asChild>
            <Link to="/courses">View all</Link>
          </Button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {featuredCourses.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </div>

      {/* All courses section */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">All Courses</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjectsWithProgress.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </div>
    </div>
  );
}
