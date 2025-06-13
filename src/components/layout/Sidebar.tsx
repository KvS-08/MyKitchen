import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Clipboard, 
  ChefHat, 
  Menu, 
  PackageOpen, 
  BarChart3, 
  ClipboardList,
  Settings,
  Building2, 
  LogOut,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
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
  const { collapsed } = useSidebarStore();
  
  return (
    <NavLink 
      to={to} 
      end={end}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
        ${isActive 
          ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200' 
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }
      `}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { collapsed, toggleSidebar } = useSidebarStore();
  
  const isMaster = user?.role === 'master';
  const isAdmin = user?.role === 'admin' || isMaster;
  const isChef = user?.role === 'chef' || isAdmin;
  const isCashier = user?.role === 'cashier' || isAdmin;

  return (
    <aside className={`
      fixed left-0 top-0 z-20 h-full bg-white border-r border-gray-200 transition-all
      dark:bg-gray-900 dark:border-gray-800 
      ${collapsed ? 'w-16' : 'w-64'}
    `}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          {!collapsed && (
            <h1 className="text-lg font-bold text-primary-600 dark:text-primary-400">
              RestaurantOS
            </h1>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" end />
          
          {(isAdmin || isCashier) && (
            <>
              <NavItem to="/pos" icon={ShoppingCart} label="POS" />
              <NavItem to="/accounts" icon={Clipboard} label="Cuentas" />
            </>
          )}
          
          {isChef && (
            <NavItem to="/kitchen" icon={ChefHat} label="Cocina" />
          )}
          
          {isAdmin && (
            <>
              <NavItem to="/menu" icon={Menu} label="Menú" />
              <NavItem to="/inventory" icon={PackageOpen} label="Inventario" />
              <NavItem to="/reports" icon={BarChart3} label="Reportes" />
              <NavItem to="/orders" icon={ClipboardList} label="Órdenes" />
              <NavItem to="/settings" icon={Settings} label="Opciones" />
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