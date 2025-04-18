
import { Subject } from '@/types';

// Mock data - in a real app, this could come from an API
export const subjects: Subject[] = [
  {
    id: 'csharp',
    title: 'C# Basics',
    description: 'Learn C# fundamentals, syntax, and object-oriented programming concepts.',
    icon: 'Code',
    playlistId: 'PLdo4fOcmZ0oVxKLQCHpiUWun7vlJJvUiN', // Sample playlist ID, replace with your actual playlist ID
    progress: 0,
    resources: [
      {
        id: 'csharp-1',
        title: 'C# Language Fundamentals',
        description: 'PDF covering the basics of C# language syntax.',
        url: '/resources/csharp-fundamentals.pdf',
        type: 'pdf'
      },
      {
        id: 'csharp-2',
        title: 'OOP in C# Cheat Sheet',
        description: 'Quick reference for OOP principles in C#.',
        url: '/resources/oop-csharp.pdf',
        type: 'pdf'
      }
    ]
  },
  {
    id: 'aspnet',
    title: 'ASP.NET Core',
    description: 'Build modern, cloud-based, internet-connected applications with ASP.NET Core.',
    icon: 'Globe',
    playlistId: 'PLdo4fOcmZ0oW8nviYduHq7bmKode-p8Wy', // Sample playlist ID, replace with your actual playlist ID
    progress: 0,
    resources: [
      {
        id: 'aspnet-1',
        title: 'ASP.NET Core Architecture',
        description: 'PDF explaining ASP.NET Core architecture and components.',
        url: '/resources/aspnet-architecture.pdf',
        type: 'pdf'
      },
      {
        id: 'aspnet-2',
        title: 'Sample API Project',
        description: 'Working code sample for RESTful API in ASP.NET Core.',
        url: 'https://github.com/dotnet/AspNetCore.Docs/tree/main/aspnetcore/tutorials/first-web-api/samples',
        type: 'link'
      }
    ]
  },
  {
    id: 'blazor',
    title: 'Blazor',
    description: 'Build interactive web UIs using C# instead of JavaScript with Blazor.',
    icon: 'Layout',
    playlistId: 'PLdo4fOcmZ0oUP_ibrodtTK7bF_OgP-XD_', // Sample playlist ID, replace with your actual playlist ID
    progress: 0,
    resources: [
      {
        id: 'blazor-1',
        title: 'Blazor Component Model',
        description: 'Deep dive into the Blazor component model.',
        url: '/resources/blazor-components.pdf',
        type: 'pdf'
      }
    ]
  },
  {
    id: 'entity-framework',
    title: 'Entity Framework',
    description: 'Master database access with Entity Framework Core ORM.',
    icon: 'Database',
    playlistId: 'PLdo4fOcmZ0oX7uTkjYwvCJDG2qhcSzwZ6', // Sample playlist ID, replace with your actual playlist ID
    progress: 0,
    resources: [
      {
        id: 'ef-1',
        title: 'EF Core Migrations',
        description: 'Guide to working with EF Core migrations.',
        url: '/resources/ef-migrations.pdf',
        type: 'pdf'
      },
      {
        id: 'ef-2',
        title: 'Sample Repository Pattern',
        description: 'Code sample implementing the repository pattern with EF Core.',
        url: 'https://github.com/dotnet/EntityFramework.Docs/tree/main/samples/core/Querying',
        type: 'link'
      }
    ]
  },
  {
    id: 'maui',
    title: '.NET MAUI',
    description: 'Build cross-platform mobile and desktop apps with .NET MAUI.',
    icon: 'Server',
    playlistId: 'PLdo4fOcmZ0oUBH_LISM8AkF-OH2lxN3K5', // Sample playlist ID, replace with your actual playlist ID
    progress: 0,
    resources: [
      {
        id: 'maui-1',
        title: 'MAUI UI Controls',
        description: 'Complete reference of MAUI UI controls and their properties.',
        url: '/resources/maui-controls.pdf',
        type: 'pdf'
      }
    ]
  }
];

export const getSubjectById = (id: string): Subject | undefined => {
  return subjects.find(subject => subject.id === id);
};
