import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ServiceBooking from "./pages/ServiceBooking";
import MembershipPlans from "./pages/MembershipPlans";
import PaymentSuccess from "./pages/PaymentSuccess";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import FreelancerProfile from "./pages/FreelancerProfile";
import CustomerDashboard from "./pages/CustomerDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/service-booking" element={<ServiceBooking />} />
          <Route path="/membership" element={<MembershipPlans />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/subscription-success" element={<SubscriptionSuccess />} />
          <Route path="/freelancer-profile" element={<FreelancerProfile />} />
          <Route path="/customer/*" element={<CustomerDashboard />} />
          <Route path="/freelancer/*" element={<FreelancerDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
