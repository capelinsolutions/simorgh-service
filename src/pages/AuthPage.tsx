import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CreateDemoUsers } from '@/components/CreateDemoUsers';
import { Loader2, Eye, EyeOff, UserPlus, LogIn, Users, Briefcase, Shield, ChevronRight } from 'lucide-react';

const AuthPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'customer' | 'cleaner' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if user is authenticated and auth is not loading
    if (user && !authLoading) {
      console.log('User authenticated, checking role for redirect...', { user: user.id, isAdmin });
      
      // Add a small delay to ensure admin status is loaded
      const timeoutId = setTimeout(() => {
        checkUserRoleAndRedirect(user.id);
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [user, authLoading, isAdmin, navigate]);

  const checkUserRoleAndRedirect = async (userId: string) => {
    try {
      console.log('Checking user role and redirecting...', { userId, isAdmin });
      
      // Check if user is admin first (isAdmin should be ready by now)
      if (isAdmin) {
        console.log('User is admin, redirecting to /admin');
        navigate('/admin', { replace: true });
        return;
      }

      // Check if user is freelancer
      console.log('Checking if user is freelancer...');
      const { data: freelancer, error } = await supabase
        .from('freelancers')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors

      if (error) {
        console.error('Error checking freelancer status:', error);
      }

      if (freelancer) {
        console.log('User is freelancer, redirecting to /freelancer');
        navigate('/freelancer', { replace: true });
        return;
      }

      // Default to customer dashboard
      console.log('User is customer, redirecting to /customer');
      navigate('/customer', { replace: true });
    } catch (error) {
      console.error('Role check error:', error);
      navigate('/customer', { replace: true }); // Default fallback
    }
  };

  const handleCustomerSignUp = async (email: string, password: string) => {
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          role: 'customer'
        }
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

  const handleCleanerSignUp = async (email: string, password: string) => {
    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/freelancer-signup`,
        data: {
          role: 'cleaner'
        }
      }
    });

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email and complete your cleaner application.",
      });
      // Redirect to cleaner application form
      setTimeout(() => {
        navigate('/freelancer-signup');
      }, 2000);
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
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading authentication...</span>
        </div>
      </div>
    );
  }

  // If user is authenticated, immediately redirect without showing loading screen
  if (user) {
    // Trigger redirect in useEffect, but don't show loading screen here
    // Instead, return null or redirect immediately
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
                {!selectedRole ? (
                  <RoleSelection onRoleSelect={setSelectedRole} />
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => setSelectedRole(null)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        ← Back to role selection
                      </button>
                    </div>
                    <AuthForm 
                      type="signup" 
                      role={selectedRole}
                      onSubmit={selectedRole === 'customer' ? handleCustomerSignUp : handleCleanerSignUp} 
                      loading={loading}
                    />
                  </>
                )}
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button 
                      onClick={() => {
                        const signinTrigger = document.querySelector('[value="signin"]') as HTMLElement;
                        signinTrigger?.click();
                        setSelectedRole(null);
                      }}
                      className="text-[#58C0D7] hover:underline font-medium"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Demo Users Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <CreateDemoUsers />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface RoleSelectionProps {
  onRoleSelect: (role: 'customer' | 'cleaner') => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Account Type</h3>
        <p className="text-sm text-gray-600">Select how you'd like to use Simorgh</p>
      </div>
      
      <div className="space-y-3">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-[#58C0D7]"
          onClick={() => onRoleSelect('customer')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Customer</h4>
                  <p className="text-sm text-gray-600">Book cleaning services</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-[#58C0D7]"
          onClick={() => onRoleSelect('cleaner')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Cleaner</h4>
                  <p className="text-sm text-gray-600">Provide cleaning services</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Admin Access</span>
        </div>
        <p className="text-xs text-gray-600">
          Admin accounts are invitation-only. Contact support if you need administrative access.
        </p>
      </div>
    </div>
  );
};

interface AuthFormProps {
  type: 'signin' | 'signup';
  role?: 'customer' | 'cleaner';
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, role, onSubmit, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onSubmit(email, password);
    }
  };

  const getRoleDisplay = () => {
    if (type === 'signin' || !role) return '';
    return role === 'customer' ? 'Customer' : 'Cleaner';
  };

  const getSubmitText = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {type === 'signin' ? 'Signing in...' : `Creating ${getRoleDisplay()} account...`}
        </div>
      );
    }
    return type === 'signin' ? 'Sign In' : `Create ${getRoleDisplay()} Account`;
  };

  return (
    <div className="space-y-4">
      {type === 'signup' && role && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <Badge variant="outline" className="text-[#58C0D7] border-[#58C0D7]">
            {getRoleDisplay()}
          </Badge>
          <span className="text-sm text-gray-600">Account Type</span>
        </div>
      )}
      
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
          {getSubmitText()}
        </Button>
      </form>
    </div>
  );
};

export default AuthPage;