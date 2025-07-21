import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Briefcase, 
  History, 
  User, 
  Bell, 
  DollarSign,
  Settings 
} from 'lucide-react';

const FreelancerSidebar = () => (
  <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
    <div className="p-6">
      <h2 className="text-lg font-semibold">Cleaner Portal</h2>
    </div>
    <nav className="mt-6">
      <NavLink 
        to="/freelancer" 
        end 
        className={({ isActive }) => 
          `flex items-center px-6 py-3 text-sm font-medium ${
            isActive ? 'bg-primary text-primary-foreground' : 'text-gray-600 hover:bg-gray-50'
          }`
        }
      >
        <Briefcase className="h-4 w-4 mr-3" />
        Active Jobs
      </NavLink>
      <NavLink 
        to="/freelancer/history" 
        className={({ isActive }) => 
          `flex items-center px-6 py-3 text-sm font-medium ${
            isActive ? 'bg-primary text-primary-foreground' : 'text-gray-600 hover:bg-gray-50'
          }`
        }
      >
        <History className="h-4 w-4 mr-3" />
        Job History & Earnings
      </NavLink>
      <NavLink 
        to="/freelancer/profile" 
        className={({ isActive }) => 
          `flex items-center px-6 py-3 text-sm font-medium ${
            isActive ? 'bg-primary text-primary-foreground' : 'text-gray-600 hover:bg-gray-50'
          }`
        }
      >
        <User className="h-4 w-4 mr-3" />
        Profile & Settings
      </NavLink>
      <NavLink 
        to="/freelancer/notifications" 
        className={({ isActive }) => 
          `flex items-center px-6 py-3 text-sm font-medium ${
            isActive ? 'bg-primary text-primary-foreground' : 'text-gray-600 hover:bg-gray-50'
          }`
        }
      >
        <Bell className="h-4 w-4 mr-3" />
        Notifications
      </NavLink>
    </nav>
  </div>
);

export default FreelancerSidebar;