
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showRegistrationAlert, setShowRegistrationAlert] = useState(false);
  
  // Fixed password - stored exactly as is without any escaping
  const fixedPassword = 'L&c"XfeM{.,^x*t';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Show alert that registration is closed
        setShowRegistrationAlert(true);
        setIsLoading(false);
        return;
      } else {
        // Login with fixed password
        if (password !== fixedPassword) {
          throw new Error('Invalid password. Please try again.');
        }
        
        // Use the exact fixed password directly for authentication
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: fixedPassword,
        });
        
        if (error) throw error;
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-dotnet-800 via-dotnet-600 to-dotnet-400 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isSignUp ? 'Sign up to get started' : 'Sign in to continue learning'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isSignUp && (
              <p className="text-xs text-gray-500 mt-1">Use the provided password to log in</p>
            )}
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-dotnet-600 hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>

      {/* Registration Closed Alert Dialog */}
      <AlertDialog open={showRegistrationAlert} onOpenChange={setShowRegistrationAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registration Closed</AlertDialogTitle>
            <AlertDialogDescription>
              We're not accepting new registrations at this time. Please check back later or contact the administrator for access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setShowRegistrationAlert(false);
              setIsSignUp(false);
            }}>
              Go back to login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
