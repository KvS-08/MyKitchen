import React from 'react';
import { Bell, HelpCircle } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { useSidebarStore } from '../../stores/sidebarStore';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { collapsed } = useSidebarStore();
  
  return (
    <header className={`
      fixed top-0 right-0 z-10 h-16 flex items-center justify-between px-4 border-b bg-white
      border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-all md:hidden block
      ${collapsed ? 'left-16' : 'left-64'}
    `}>
      <h2 className="text-xl font-semibold">
        {user?.business?.name || 'RestaurantOS'}
      </h2>
      
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <ThemeToggle />
        
        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
          <HelpCircle className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-2">
          <Avatar 
            src={user?.avatar_url} 
            alt={user?.full_name || 'User'} 
            fallback={user?.full_name || 'User'} 
          />
          
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.full_name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.role === 'master' ? 'Master User' : 
               user?.role === 'admin' ? 'Administrador' : 
               user?.role === 'cashier' ? 'Cajero' : 'Cocinero'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};