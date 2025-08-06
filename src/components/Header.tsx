import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, Briefcase } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut, loading } = useAuth();
  const [userRole, setUserRole] = useState<'customer' | 'freelancer' | 'admin' | null>(null);

  useEffect(() => {
    if (user) {
      checkUserRole(user.id);
    } else {
      setUserRole(null);
    }
  }, [user, isAdmin]);

  const checkUserRole = async (userId: string) => {
    try {
      if (isAdmin) {
        setUserRole('admin');
        return;
      }

      // Check if user is freelancer
      const { data: freelancer } = await supabase
        .from('freelancers')
        .select('user_id')
        .eq('user_id', userId)
        .single();

      if (freelancer) {
        setUserRole('freelancer');
        return;
      }

      // Default to customer
      setUserRole('customer');
    } catch (error) {
      console.error('Role check error:', error);
      setUserRole('customer'); // Default fallback
    }
  };

  const getActiveClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive 
      ? 'text-[#58C0D7] font-semibold' 
      : 'text-[rgba(40,40,40,1)] font-normal';
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserRole(null);
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getDashboardRoute = () => {
    switch (userRole) {
      case 'admin':
        return '/admin';
      case 'freelancer':
        return '/freelancer';
      case 'customer':
      default:
        return '/customer';
    }
  };

  const getRoleDisplayName = () => {
    switch (userRole) {
      case 'admin':
        return 'Admin Panel';
      case 'freelancer':
        return 'Freelancer Hub';
      case 'customer':
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white flex w-full items-center gap-[40px_100px] text-base justify-between flex-wrap px-[120px] max-md:max-w-full max-md:px-5">
      <img
        src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/11d27c766350de61f072c43b85f52036de041534?placeholderIfAbsent=true"
        alt="Simorgh Service Group Logo"
        className="aspect-[1.5] object-contain w-[120px] self-stretch shrink-0 my-auto"
      />
      
      <nav className="bg-[rgba(134,134,134,0.1)] self-stretch flex min-w-60 items-center gap-2 text-[rgba(40,40,40,1)] font-normal flex-wrap my-auto rounded-[48px] max-md:max-w-full">
        <Link
          to="/"
          className={`self-stretch flex min-h-12 items-center gap-2 whitespace-nowrap justify-center my-auto px-4 py-[13px] ${getActiveClass('/')}`}
        >
          Home
        </Link>
        <Link
          to="/service-booking"
          className={`self-stretch flex min-h-12 items-center gap-2 whitespace-nowrap justify-center my-auto px-4 py-[13px] ${getActiveClass('/service-booking')}`}
        >
          Services
        </Link>
        <Link
          to="/membership"
          className={`self-stretch flex min-h-12 items-center gap-2 whitespace-nowrap justify-center my-auto px-4 py-[13px] ${getActiveClass('/membership')}`}
        >
          Pricing
        </Link>
        {[
          { name: 'About us', href: '#about' },
          { name: 'Contact us', href: '#contact' }
        ].map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="self-stretch flex min-h-12 items-center gap-2 whitespace-nowrap justify-center my-auto px-4 py-[13px] text-[rgba(40,40,40,1)] font-normal hover:text-[#58C0D7] transition-colors"
          >
            {item.name}
          </a>
        ))}
      </nav>

      <div className="self-stretch flex items-center gap-2 font-semibold whitespace-nowrap my-auto">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-20 h-12 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-24 h-12 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[rgba(40,40,40,1)] mr-2">
              Welcome, {user.email?.split('@')[0]}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(getDashboardRoute())}
              className="text-[#58C0D7] border-[#58C0D7] hover:bg-[#58C0D7] hover:text-white"
            >
              {userRole === 'freelancer' ? (
                <Briefcase className="h-4 w-4 mr-1" />
              ) : userRole === 'admin' ? (
                <Settings className="h-4 w-4 mr-1" />
              ) : (
                <User className="h-4 w-4 mr-1" />
              )}
              {getRoleDisplayName()}
            </Button>

            {/* Additional admin button for non-admin users who might have admin access */}
            {isAdmin && userRole !== 'admin' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="text-[#666] border-[#666] hover:bg-[#666] hover:text-white"
              >
                <Settings className="h-4 w-4 mr-1" />
                Admin
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link 
              to="/auth" 
              className="justify-center items-center rounded border self-stretch flex min-h-12 gap-2 text-[#58C0D7] w-[97px] my-auto px-4 py-[13px] border-solid border-[#58C0D7] hover:bg-[#58C0D7] hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/auth" 
              className="justify-center items-center rounded self-stretch flex min-h-12 gap-2 text-white w-[127px] bg-[#58C0D7] my-auto px-4 py-[13px] hover:bg-[#4aa8c0] transition-colors"
            >
              Register
            </Link>
            <Link 
              to="/freelancer-signup" 
              className="justify-center items-center rounded border self-stretch flex min-h-12 gap-2 text-[#666] w-[140px] my-auto px-4 py-[13px] border-solid border-[#666] hover:bg-[#666] hover:text-white transition-colors"
            >
              Join as Cleaner
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
