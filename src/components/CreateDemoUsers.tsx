import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DemoUser {
  role: string;
  email: string;
  password: string;
  user_id: string;
}

export const CreateDemoUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<DemoUser[]>([]);
  const [created, setCreated] = useState(false);

  const createDemoUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-demo-users');
      
      if (error) {
        toast.error('Failed to create demo users: ' + error.message);
        return;
      }

      if (data.success) {
        setUsers(data.users);
        setCreated(true);
        toast.success('Demo users created successfully!');
      } else {
        toast.error('Failed to create demo users: ' + data.error);
      }
    } catch (error) {
      toast.error('Error creating demo users');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'cleaner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'customer': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Demo User Creation
          </CardTitle>
          <CardDescription>
            Create test users for all roles (Customer, Cleaner, Admin) with pre-defined credentials for testing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!created ? (
            <Button 
              onClick={createDemoUsers} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Demo Users...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Create Demo Users
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Demo users created successfully!</span>
              </div>
              
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                {users.map((user) => (
                  <Card key={user.user_id} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg capitalize">
                          {user.role}
                        </CardTitle>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email:</label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 px-2 py-1 bg-gray-100 rounded text-sm">
                            {user.email}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(user.email)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-600">Password:</label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 px-2 py-1 bg-gray-100 rounded text-sm">
                            {user.password}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(user.password)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Testing Instructions:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use these credentials to test different user roles</li>
                  <li>• Customer can book services and manage their profile</li>
                  <li>• Cleaner can view assigned jobs and manage their freelancer profile</li>
                  <li>• Admin can access the admin dashboard and manage the platform</li>
                  <li>• All passwords are: <code className="bg-blue-100 px-1 rounded">demo123456</code></li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};