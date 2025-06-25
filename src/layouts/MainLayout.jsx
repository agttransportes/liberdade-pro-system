import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  LayoutDashboard, 
  Car, 
  DollarSign, 
  Wallet, 
  CreditCard, 
  Target, 
  Settings, 
  LogOut,
  Menu,
  X,
  User,
  Bell,
  Search
} from 'lucide-react';
import '../App.css';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
      badge: null
    },
    {
      id: 'vehicles',
      label: 'Veículos',
      icon: Car,
      path: '/vehicles',
      badge: '12'
    },
    {
      id: 'rental-transactions',
      label: 'Locações',
      icon: DollarSign,
      path: '/rental-transactions',
      badge: null
    },
    {
      id: 'personal-transactions',
      label: 'Pessoal',
      icon: Wallet,
      path: '/personal-transactions',
      badge: null
    },
    {
      id: 'debts',
      label: 'Dívidas',
      icon: CreditCard,
      path: '/debts',
      badge: '3'
    },
    {
      id: 'goals',
      label: 'Metas',
      icon: Target,
      path: '/goals',
      badge: null
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      path: '/settings',
      badge: null
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 liberdade-sidebar transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 liberdade-sidebar-header">
          <h1 className="text-xl font-bold text-white">Liberdade Pro</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-white/20"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 liberdade-gradient rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'email@exemplo.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={isActivePath(item.path) ? "default" : "ghost"}
                className={`w-full justify-start transition-all duration-200 ${
                  isActivePath(item.path) 
                    ? 'liberdade-gradient text-white hover:opacity-90' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white shadow-sm border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Liberdade Pro</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between h-16 px-6 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {menuItems.find(item => isActivePath(item.path))?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 liberdade-gradient rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;

