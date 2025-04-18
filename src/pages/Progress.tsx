
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getAllProgress, getLearningStats } from '@/services/progressService';
import { subjects } from '@/data/subjectsData';
import { Subject, UserProgress } from '@/types';
import {
  BarChart3,
  Clock,
  Calendar,
  ArrowUpRight,
  ChevronRight,
  Award
} from 'lucide-react';

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<Record<string, UserProgress>>({});
  const [subjectMap, setSubjectMap] = useState<Record<string, Subject>>({});
  const [stats, setStats] = useState({
    totalWatchTimeInMinutes: 0,
    completedVideos: 0,
    lastActivityDate: null as string | null,
  });

  useEffect(() => {
    // Get progress data
    const progress = getAllProgress();
    setProgressData(progress);

    // Create map of subjects for easy reference
    const subjectsMap = subjects.reduce((acc, subject) => {
      acc[subject.id] = subject;
      return acc;
    }, {} as Record<string, Subject>);
    setSubjectMap(subjectsMap);

    // Get learning stats
    const learningStats = getLearningStats();
    setStats(learningStats);
  }, []);

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate total hours spent learning
  const totalHours = stats.totalWatchTimeInMinutes / 60;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);

  // Sort subjects by most progress
  const sortedSubjects = Object.entries(progressData)
    .map(([subjectId, progress]) => ({
      ...progress,
      subject: subjectMap[subjectId],
      completionPercentage: progress.completedVideos.length / (subjectMap[subjectId]?.videos?.length || 1) * 100,
    }))
    .sort((a, b) => b.completionPercentage - a.completionPercentage);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey across all courses.
        </p>
      </div>

      {/* Overall stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Watch Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Videos Completed</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedVideos}</div>
            <p className="text-xs text-muted-foreground">
              Out of {subjects.reduce((total, subject) => total + (subject.videos?.length || 0), 0)} total videos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDate(stats.lastActivityDate)}</div>
            <p className="text-xs text-muted-foreground">
              Keep learning regularly!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress by subject */}
      <div>
        <h2 className="mb-4 text-xl font-semibold tracking-tight">Progress by Course</h2>
        <div className="space-y-4">
          {sortedSubjects.length > 0 ? (
            sortedSubjects.map((item) => (
              <Card key={item.subjectId}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{item.subject?.title}</h3>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={item.completionPercentage} 
                          className="h-2 w-40 sm:w-64" 
                        />
                        <span className="text-sm font-medium">
                          {Math.round(item.completionPercentage)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{Math.round(item.totalWatchTime / 60)} minutes</span>
                      </div>
                      <Button asChild size="sm" variant="outline" className="gap-1">
                        <Link to={`/subjects/${item.subjectId}`}>
                          Continue
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Award className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No progress yet</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  Start watching videos to track your progress.
                </p>
                <Button asChild>
                  <Link to="/courses">Browse courses</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Learning streaks - placeholder for gamification feature */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Learning Achievements</h2>
          <Button size="sm" variant="link" className="gap-1">
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Award className="h-12 w-12 text-primary/50" />
            <h3 className="mt-4 text-lg font-medium">Achievements Coming Soon</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete courses to earn badges and certificates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
