
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Code,
  Server,
  Database,
  Layout,
  Globe,
  ChevronRight,
  X,
  Home,
  Book,
  BarChart,
  Award,
  FileText
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const subjects = [
    { id: "csharp", name: "C# Basics", icon: Code, path: "/subjects/csharp" },
    { id: "aspnet", name: "ASP.NET Core", icon: Globe, path: "/subjects/aspnet" },
    { id: "blazor", name: "Blazor", icon: Layout, path: "/subjects/blazor" },
    { id: "ef", name: "Entity Framework", icon: Database, path: "/subjects/entity-framework" },
    { id: "maui", name: ".NET MAUI", icon: Server, path: "/subjects/maui" },
  ];

  const mainLinks = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "My Courses", icon: Book, path: "/courses" },
    { name: "My Progress", icon: BarChart, path: "/progress" },
    { name: "Achievements", icon: Award, path: "/achievements" },
    { name: "Resources", icon: FileText, path: "/resources" },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r bg-background transition-transform duration-300 md:z-0 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Book className="h-4 w-4 text-white" />
          </div>
          <span>.NET Academy</span>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={closeSidebar}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-4">
          <div className="mb-6">
            <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight">Main</h2>
            <nav className="grid gap-1">
              {mainLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      isActive ? "bg-accent text-accent-foreground" : "transparent"
                    )
                  }
                  onClick={() => closeSidebar()}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="mb-4">
            <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight">Learning Paths</h2>
            <nav className="grid gap-1">
              {subjects.map((subject) => (
                <NavLink
                  key={subject.id}
                  to={subject.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      isActive ? "bg-accent text-accent-foreground" : "transparent"
                    )
                  }
                  onClick={() => closeSidebar()}
                >
                  <div className="flex items-center gap-3">
                    <subject.icon className="h-4 w-4" />
                    {subject.name}
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
