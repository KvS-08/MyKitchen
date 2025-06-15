import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LogOut,
  Building2,
  ChefHat
} from 'lucide-react';
import { MdDashboardCustomize } from 'react-icons/md';
import { TbCashRegister } from 'react-icons/tb';
import { IoWallet, IoSettingsSharp } from 'react-icons/io5';
import { FaBoxesPacking, FaChartColumn } from 'react-icons/fa6';
import { BsFillMenuButtonWideFill } from 'react-icons/bs';
import { useAuth } from '../../hooks/useAuth';
import { useSidebarStore } from '../../stores/sidebarStore';



const NavItem = ({ 
  to, 
  icon: Icon, 
  label, 
  end = false 
}: { 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  end?: boolean;
}) => {
  const { collapsed } = useSidebarStore(() => ({ collapsed: false }));
  
  return (
    <NavLink 
      to={to} 
      end={end}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-3 rounded-md text-base transition-colors
        ${isActive 
          ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200' 
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }
      `}
    >
      <Icon className="h-6 w-6 flex-shrink-0" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { collapsed } = useSidebarStore(() => ({ collapsed: false }));
  
  const isMaster = user?.role === 'master';
  const isAdmin = user?.role === 'admin' || isMaster;
  const isChef = user?.role === 'chef' || isAdmin;
  const isCashier = user?.role === 'cashier' || isAdmin;

  return (
    <aside className={`
      fixed left-0 top-0 z-20 h-full bg-white border-r border-gray-200 transition-all
      dark:bg-gray-900 dark:border-gray-800 
      w-48 hidden md:block
    `}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              {user?.business?.logo_url ? (
                <img 
                  src={user.business.logo_url} 
                  alt="Logo del negocio" 
                  className="h-8 w-8 object-cover rounded-md"
                />
              ) : (
                <ChefHat className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              )}
              <h1 className="text-lg font-bold text-primary-600 dark:text-primary-400 truncate">
                {user?.business?.name || 'RestaurantOS'}
              </h1>
            </div>
          )}
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          <NavItem to="/" icon={MdDashboardCustomize} label="Dashboard" end />
                   {(isAdmin || isCashier) && (
            <>
              <NavItem to="/pos" icon={TbCashRegister} label="POS" />
              <NavItem to="/accounts" icon={IoWallet} label="Cuentas" />
            </>
          )}
          
          {isChef && (
            <NavItem to="/kitchen" icon={ChefHat} label="Cocina" />
          )}
          
          {isAdmin && (
            <>
              <NavItem to="/menu" icon={BsFillMenuButtonWideFill} label="Menú" />

              <NavItem to="/inventory" icon={FaBoxesPacking} label="Inventario" />
              <NavItem to="/reports" icon={FaChartColumn} label="Reportes" />

              <NavItem to="/settings" icon={IoSettingsSharp} label="Opciones" />
            </>
          )}
          
          {isMaster && (
            <NavItem to="/businesses" icon={Building2} label="Negocios" />
          )}
        </nav>
        
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={signOut}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};