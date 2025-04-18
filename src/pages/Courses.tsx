
import { useState, useEffect } from 'react';
import { SubjectCard } from '@/components/Dashboard/SubjectCard';
import { subjects } from '@/data/subjectsData';
import { calculateSubjectCompletion } from '@/services/progressService';
import { getPlaylistVideos } from '@/services/youtubeService';
import { Subject } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Filter } from 'lucide-react';

export default function Courses() {
  const [subjectsWithProgress, setSubjectsWithProgress] = useState<Subject[]>(subjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>(subjects);

  // Load progress data
  useEffect(() => {
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
      setFilteredSubjects(updatedSubjects);
    };

    updateSubjectsProgress();
  }, []);

  // Filter subjects based on search query
  useEffect(() => {
    const filterSubjects = () => {
      if (!searchQuery.trim()) {
        setFilteredSubjects(subjectsWithProgress);
        return;
      }

      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = subjectsWithProgress.filter(
        (subject) =>
          subject.title.toLowerCase().includes(lowerCaseQuery) ||
          subject.description.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredSubjects(filtered);
    };

    filterSubjects();
  }, [searchQuery, subjectsWithProgress]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <p className="text-muted-foreground">
          Browse all available .NET learning paths.
        </p>
      </div>

      {/* Search and filter section */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Course categories */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="not-started">Not Started</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {filteredSubjects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSubjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <Filter className="mb-2 h-8 w-8 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No courses found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-6">
          {filteredSubjects.filter(s => (s.progress || 0) > 0 && (s.progress || 0) < 100).length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSubjects
                .filter(s => (s.progress || 0) > 0 && (s.progress || 0) < 100)
                .map((subject) => (
                  <SubjectCard key={subject.id} subject={subject} />
                ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <Filter className="mb-2 h-8 w-8 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No courses in progress</h3>
              <p className="text-sm text-muted-foreground">
                Start watching videos to see courses here.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {filteredSubjects.filter(s => (s.progress || 0) === 100).length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSubjects
                .filter(s => (s.progress || 0) === 100)
                .map((subject) => (
                  <SubjectCard key={subject.id} subject={subject} />
                ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <Filter className="mb-2 h-8 w-8 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No completed courses</h3>
              <p className="text-sm text-muted-foreground">
                Complete all videos in a course to see it here.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="not-started" className="mt-6">
          {filteredSubjects.filter(s => (s.progress || 0) === 0).length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSubjects
                .filter(s => (s.progress || 0) === 0)
                .map((subject) => (
                  <SubjectCard key={subject.id} subject={subject} />
                ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <Filter className="mb-2 h-8 w-8 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">All courses started</h3>
              <p className="text-sm text-muted-foreground">
                You've started watching videos in all available courses.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
