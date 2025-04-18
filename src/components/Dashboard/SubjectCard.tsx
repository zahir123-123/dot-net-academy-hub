
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Subject } from '@/types';
import { Code, Database, Globe, Layout, Server, ChevronRight } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  'Code': Code,
  'Globe': Globe,
  'Layout': Layout,
  'Database': Database,
  'Server': Server
};

interface SubjectCardProps {
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const Icon = iconMap[subject.icon] || Code;
  
  return (
    <Card className="overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-lg">{subject.title}</CardTitle>
          </div>
          {subject.progress !== undefined && (
            <span className="text-sm font-medium text-muted-foreground">
              {subject.progress}% Complete
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{subject.description}</p>
        
        {subject.progress !== undefined && (
          <div className="mt-4">
            <Progress value={subject.progress} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex w-full items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {subject.videos?.length || 0} lessons
          </span>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link to={`/subjects/${subject.id}`}>
              Continue Learning
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
