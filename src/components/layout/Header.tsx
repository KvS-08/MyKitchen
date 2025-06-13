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
      fixed top-0 right-0 z-10 h-16 flex items-center justify-end px-4 border-b bg-white
      border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-all md:hidden
      ${collapsed ? 'left-16' : 'md:left-48 left-0'}
    `}>

      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        
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