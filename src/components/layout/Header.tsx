import React from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { useSidebarStore } from '../../stores/sidebarStore';
import { Link } from 'react-router-dom';
import { MdDashboardCustomize } from 'react-icons/md';
import { TbCashRegister } from 'react-icons/tb';
import { IoWallet } from 'react-icons/io5';
import { ChefHat } from 'lucide-react';
import { BsFillMenuButtonWideFill } from 'react-icons/bs';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { collapsed } = useSidebarStore();
  
  return (
    <header className={`
      fixed top-0 right-0 z-10 h-16 flex items-center justify-between px-4 border-b bg-white
      border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-all md:hidden
      ${collapsed ? 'left-16' : 'md:left-48 left-0'}
    `}>
      <div className="flex items-center gap-4">
        <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
          <MdDashboardCustomize className="h-6 w-6" />
        </Link>
        <Link to="/pos" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
          <TbCashRegister className="h-6 w-6" />
        </Link>
        <Link to="/accounts" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
          <IoWallet className="h-6 w-6" />
        </Link>
        <Link to="/kitchen" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
          <ChefHat className="h-6 w-6" />
        </Link>
        <Link to="/menu" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
          <BsFillMenuButtonWideFill className="h-6 w-6" />
        </Link>
      </div>

      
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