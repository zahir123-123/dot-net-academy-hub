import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "./components/Layout/MainLayout";
import { SplashScreen } from "./components/SplashScreen";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Courses from "./pages/Courses";
import Progress from "./pages/Progress";
import Achievements from "./pages/Achievements";
import Resources from "./pages/Resources";
import SubjectDetail from "./pages/SubjectDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route 
              element={
                session ? (
                  <MainLayout />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/subjects/:subjectId" element={<SubjectDetail />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
