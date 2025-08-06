import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';

const AuthPage = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on user role if already authenticated
    if (user) {
      checkUserRoleAndRedirect(user.id);
    }
  }, [user, navigate, isAdmin]);

  const checkUserRoleAndRedirect = async (userId: string) => {
    try {
      // Check if user is admin
      if (isAdmin) {
        navigate('/admin');
        return;
      }

      // Check if user is freelancer
      const { data: freelancer } = await supabase
        .from('freelancers')
        .select('user_id')
        .eq('user_id', userId)
        .single();

      if (freelancer) {
        navigate('/freelancer');
        return;
      }

      // Default to customer dashboard
      navigate('/customer');
    } catch (error) {
      console.error('Role check error:', error);
      navigate('/customer'); // Default fallback
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        toast({
          title: "Account exists",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } else {
      // Create customer profile immediately if user is created
      if (data.user) {
        const { error: profileError } = await supabase
          .from('customer_profiles')
          .insert({
            user_id: data.user.id,
            first_name: '',
            last_name: '',
            status: 'active'
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      toast({
        title: "Account created successfully!",
        description: "Please check your email for verification link.",
      });
    }
    setLoading(false);
  };

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    }
    setLoading(false);
  };

  // Show loading while checking auth state
  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Redirecting to your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Header />
      <div className="flex items-center justify-center p-4 pt-20">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#58C0D7] to-[#4aa8c0] rounded-full flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome to Simorgh</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your account or create a new one to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <AuthForm 
                  type="signin" 
                  onSubmit={handleSignIn} 
                  loading={loading}
                />
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button 
                      onClick={() => {
                        const signupTrigger = document.querySelector('[value="signup"]') as HTMLElement;
                        signupTrigger?.click();
                      }}
                      className="text-[#58C0D7] hover:underline font-medium"
                    >
                      Sign up here
                    </button>
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <AuthForm 
                  type="signup" 
                  onSubmit={handleSignUp} 
                  loading={loading}
                />
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button 
                      onClick={() => {
                        const signinTrigger = document.querySelector('[value="signin"]') as HTMLElement;
                        signinTrigger?.click();
                      }}
                      className="text-[#58C0D7] hover:underline font-medium"
                    >
                      Sign in here
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    Want to join as a cleaner?{' '}
                    <a 
                      href="/freelancer-signup" 
                      className="text-[#58C0D7] hover:underline font-medium"
                    >
                      Apply here
                    </a>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface AuthFormProps {
  type: 'signin' | 'signup';
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onSubmit(email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="h-12 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {type === 'signup' && (
          <p className="text-xs text-gray-500">
            Password must be at least 6 characters long
          </p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 bg-gradient-to-r from-[#58C0D7] to-[#4aa8c0] hover:from-[#4aa8c0] to-[#3a96b3] text-white font-medium" 
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {type === 'signin' ? 'Signing in...' : 'Creating account...'}
          </div>
        ) : (
          type === 'signin' ? 'Sign In' : 'Create Account'
        )}
      </Button>
    </form>
  );
};

export default AuthPage;