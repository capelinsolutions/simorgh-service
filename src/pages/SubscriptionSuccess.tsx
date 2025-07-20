import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Crown } from 'lucide-react';

const SubscriptionSuccess = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Welcome to Membership!</CardTitle>
          <CardDescription className="text-base">
            Your subscription is now active. Enjoy exclusive discounts and priority booking!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessionId && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Reference ID:</p>
              <p className="font-mono text-xs break-all">{sessionId}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <a href="/membership">
                <Crown className="w-4 h-4 mr-2" />
                View Membership
              </a>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <a href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;