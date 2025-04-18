
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, FileText, Download, ExternalLink, Code, BookOpen } from 'lucide-react';
import { subjects } from '@/data/subjectsData';
import { Resource } from '@/types';

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Collect all resources from all subjects
  const allResources = subjects.flatMap(subject => 
    (subject.resources || []).map(resource => ({
      ...resource,
      subjectTitle: subject.title,
      subjectId: subject.id
    }))
  );
  
  // Filter resources based on search
  const filteredResources = allResources.filter(resource => 
    searchQuery === '' || 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.subjectTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group resources by type
  const pdfResources = filteredResources.filter(r => r.type === 'pdf');
  const linkResources = filteredResources.filter(r => r.type === 'link');
  const codeResources = filteredResources.filter(r => r.type === 'code');
  
  // Resource card component
  const ResourceCard = ({ resource }: { resource: Resource & { subjectTitle: string, subjectId: string }}) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{resource.title}</CardTitle>
          {resource.type === 'pdf' && <FileText className="h-5 w-5 text-muted-foreground" />}
          {resource.type === 'link' && <ExternalLink className="h-5 w-5 text-muted-foreground" />}
          {resource.type === 'code' && <Code className="h-5 w-5 text-muted-foreground" />}
        </div>
        <p className="text-xs text-muted-foreground">From: {resource.subjectTitle}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{resource.description}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full gap-1.5" 
          asChild
        >
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            {resource.type === 'pdf' ? (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            ) : resource.type === 'link' ? (
              <>
                <ExternalLink className="h-4 w-4" />
                Open Link
              </>
            ) : (
              <>
                <Code className="h-4 w-4" />
                View Code
              </>
            )}
          </a>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted-foreground">
          Download materials, code samples, and useful links for your learning.
        </p>
      </div>

      {/* Search section */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search resources..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Resource tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="pdfs">PDFs</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="code">Code Samples</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {filteredResources.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <BookOpen className="mb-2 h-8 w-8 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No resources found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or check back later for more resources.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pdfs" className="mt-6">
          {pdfResources.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pdfResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No PDF resources found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or check back later for PDF resources.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="links" className="mt-6">
          {linkResources.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {linkResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <ExternalLink className="mb-2 h-8 w-8 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No link resources found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or check back later for link resources.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="code" className="mt-6">
          {codeResources.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {codeResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <Code className="mb-2 h-8 w-8 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No code samples found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or check back later for code samples.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
