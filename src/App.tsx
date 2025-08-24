import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorBoundary from "@/components/ui/error-boundary";

// Lazy load pages for code splitting
const Index = React.lazy(() => import("./pages/Index"));
const AuthPage = React.lazy(() => import("./pages/AuthPage"));
const Services = React.lazy(() => import("./pages/Services"));
const ServiceDetail = React.lazy(() => import("./pages/ServiceDetail"));
const ServiceBooking = React.lazy(() => import("./pages/ServiceBooking"));
const MembershipPlans = React.lazy(() => import("./pages/MembershipPlans"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const SubscriptionSuccess = React.lazy(() => import("./pages/SubscriptionSuccess"));
const FreelancerProfile = React.lazy(() => import("./pages/FreelancerProfile"));
const FreelancerSignup = React.lazy(() => import("./pages/FreelancerSignup"));
const CustomerDashboard = React.lazy(() => import("./pages/CustomerDashboard"));
const FreelancerDashboard = React.lazy(() => import("./pages/FreelancerDashboard"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Configure QueryClient for optimal performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/services" element={<Services />} />
                <Route path="/service/:id" element={<ServiceDetail />} />
                <Route path="/service-booking" element={<ServiceBooking />} />
                <Route path="/membership" element={<MembershipPlans />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/subscription-success" element={<SubscriptionSuccess />} />
                <Route path="/freelancer-profile" element={<FreelancerProfile />} />
                <Route path="/freelancer-signup" element={<FreelancerSignup />} />
                <Route path="/customer/*" element={<CustomerDashboard />} />
                <Route path="/freelancer/*" element={<FreelancerDashboard />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
