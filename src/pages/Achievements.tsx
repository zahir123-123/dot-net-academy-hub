
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getLearningStats, getAllProgress } from '@/services/progressService';
import { subjects } from '@/data/subjectsData';
import { Badge } from '@/components/ui/badge';
import { Award, Clock, Video, BookOpen, Trophy, Lock, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AchievementType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  requiredValue: number;
  currentValue: number;
  isUnlocked: boolean;
  category: 'Course' | 'Watch' | 'Streak';
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<AchievementType[]>([]);
  
  useEffect(() => {
    // Get stats to calculate achievements
    const stats = getLearningStats();
    const progress = getAllProgress();

    // Calculate number of completed courses
    const completedCourses = subjects.filter(subject => {
      const subjectProgress = progress[subject.id];
      if (!subjectProgress) return false;
      
      const videosInSubject = subject.videos?.length || 0;
      if (videosInSubject === 0) return false;
      
      const completionPercentage = (subjectProgress.completedVideos.length / videosInSubject) * 100;
      return completionPercentage >= 100;
    }).length;

    // Calculate total watch time in hours
    const watchTimeHours = stats.totalWatchTimeInMinutes / 60;

    // Create achievements
    const achievementsList: AchievementType[] = [
      // Course completion achievements
      {
        id: 'course-1',
        title: 'First Steps',
        description: 'Complete your first course',
        icon: Award,
        requiredValue: 1,
        currentValue: completedCourses,
        isUnlocked: completedCourses >= 1,
        category: 'Course'
      },
      {
        id: 'course-2',
        title: 'Getting Serious',
        description: 'Complete 3 courses',
        icon: Award,
        requiredValue: 3,
        currentValue: completedCourses,
        isUnlocked: completedCourses >= 3,
        category: 'Course'
      },
      {
        id: 'course-3',
        title: '.NET Master',
        description: 'Complete all courses',
        icon: Trophy,
        requiredValue: subjects.length,
        currentValue: completedCourses,
        isUnlocked: completedCourses >= subjects.length,
        category: 'Course'
      },
      
      // Watch time achievements
      {
        id: 'watch-1',
        title: 'Curious Mind',
        description: 'Watch 1 hour of content',
        icon: Clock,
        requiredValue: 1,
        currentValue: watchTimeHours,
        isUnlocked: watchTimeHours >= 1,
        category: 'Watch'
      },
      {
        id: 'watch-2',
        title: 'Dedicated Learner',
        description: 'Watch 5 hours of content',
        icon: Clock,
        requiredValue: 5,
        currentValue: watchTimeHours,
        isUnlocked: watchTimeHours >= 5,
        category: 'Watch'
      },
      {
        id: 'watch-3',
        title: 'Deep Diver',
        description: 'Watch 10 hours of content',
        icon: Clock,
        requiredValue: 10,
        currentValue: watchTimeHours,
        isUnlocked: watchTimeHours >= 10,
        category: 'Watch'
      },
      
      // Video count achievements
      {
        id: 'video-1',
        title: 'Getting Started',
        description: 'Complete 5 videos',
        icon: Video,
        requiredValue: 5,
        currentValue: stats.completedVideos,
        isUnlocked: stats.completedVideos >= 5,
        category: 'Watch'
      },
      {
        id: 'video-2',
        title: 'Consistent Learner',
        description: 'Complete 25 videos',
        icon: Video,
        requiredValue: 25,
        currentValue: stats.completedVideos,
        isUnlocked: stats.completedVideos >= 25,
        category: 'Watch'
      },
      {
        id: 'video-3',
        title: 'Video Virtuoso',
        description: 'Complete 50 videos',
        icon: Star,
        requiredValue: 50,
        currentValue: stats.completedVideos,
        isUnlocked: stats.completedVideos >= 50,
        category: 'Watch'
      },
      
      // Streak achievements (placeholders for future implementation)
      {
        id: 'streak-1',
        title: 'Daily Learner',
        description: 'Learn for 3 days in a row',
        icon: BookOpen,
        requiredValue: 3,
        currentValue: 0,
        isUnlocked: false,
        category: 'Streak'
      },
      {
        id: 'streak-2',
        title: 'Weekly Warrior',
        description: 'Learn for 7 days in a row',
        icon: BookOpen,
        requiredValue: 7,
        currentValue: 0,
        isUnlocked: false,
        category: 'Streak'
      },
      {
        id: 'streak-3',
        title: 'Unstoppable',
        description: 'Learn for 30 days in a row',
        icon: Trophy,
        requiredValue: 30,
        currentValue: 0,
        isUnlocked: false,
        category: 'Streak'
      },
    ];

    setAchievements(achievementsList);
  }, []);

  // Filter achievements by category
  const courseAchievements = achievements.filter(a => a.category === 'Course');
  const watchAchievements = achievements.filter(a => a.category === 'Watch');
  const streakAchievements = achievements.filter(a => a.category === 'Streak');
  
  // Count unlocked achievements
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;

  // Achievement card component
  const AchievementCard = ({ achievement }: { achievement: AchievementType }) => (
    <Card className={`overflow-hidden transition-all ${achievement.isUnlocked ? 'border-primary/50' : 'opacity-75'}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{achievement.title}</CardTitle>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
            achievement.isUnlocked 
              ? 'bg-primary/20 text-primary' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {achievement.isUnlocked ? (
              <achievement.icon className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="mb-3 text-sm text-muted-foreground">{achievement.description}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">
              {achievement.currentValue} / {achievement.requiredValue}
            </span>
          </div>
          <Progress 
            value={Math.min((achievement.currentValue / achievement.requiredValue) * 100, 100)} 
            className="h-2" 
          />
        </div>
        {achievement.isUnlocked && (
          <Badge variant="outline" className="mt-3 bg-primary/10 text-primary">
            Unlocked
          </Badge>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground">
          Track your learning milestones and collect achievements.
        </p>
      </div>

      {/* Achievement summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Achievement Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Progress value={completionPercentage} className="h-2 w-40 sm:w-80" />
              <span className="text-sm font-medium">{Math.round(completionPercentage)}%</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>{unlockedCount} of {totalCount} unlocked</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement categories */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Achievements</TabsTrigger>
          <TabsTrigger value="courses">Course Completion</TabsTrigger>
          <TabsTrigger value="watch">Watch Time</TabsTrigger>
          <TabsTrigger value="streaks">Learning Streaks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="courses" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courseAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="watch" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {watchAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="streaks" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {streakAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
