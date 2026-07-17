import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleSwitcher } from "./RoleSwitcher";
import { UserRole } from "@/contexts/RoleContext";

interface SidebarProps {
  user: {
    name: string;
    company: string;
    employeeId: string;
  };
  onLogout: () => void;
  currentPage?: string;
  onNavigate?: (page: any) => void;
  currentRole?: UserRole;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  showPulse?: boolean;
  badge?: string | number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  onLogout, 
  currentPage = 'dashboard',
  onNavigate,
  currentRole = 'employee'
}) => {
  // Define navigation items based on role
  const getNavigationItems = (): NavigationItem[] => {
    switch (currentRole) {
      case 'employee':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            ),
          },
          {
            id: 'agent',
            label: 'FinAgent',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ),
            showPulse: true,
          },
          {
            id: 'orders',
            label: 'My Orders',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            ),
          },
        ];
      case 'hr':
        return [
          {
            id: 'overview',
            label: 'Overview',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            ),
          },
          {
            id: 'employees',
            label: 'Employees',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            ),
          },
          {
            id: 'benefits',
            label: 'Benefits',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            ),
          },
        ];
      case 'crm':
        return [
          {
            id: 'corporates',
            label: 'Corporates',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            ),
          },
          {
            id: 'onboard',
            label: 'New Corporate',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20h4v-8H4v8zm6 0h4V4h-4v16zm6 0h4v-5h-4v5z" />
              </svg>
            ),
          },
          {
            id: 'employees',
            label: 'Employees',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ),
          },
          {
            id: 'products',
            label: 'Products',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            ),
          },
          {
            id: 'analytics',
            label: 'Analytics',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            ),
          },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen sticky top-0">
      {/* Unified Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {/* Role Switcher at Top */}
        <div className="mb-4">
          <RoleSwitcher />
        </div>
        
        {/* Platform Brand */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="relative">
            {/* Logo - single accent color #ff0049 */}
            <div className="w-9 h-9 bg-[#ff0049] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#ff0049]/40 transition-all duration-300 group-hover:shadow-[#ff0049]/60 group-hover:scale-105">
              <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            {/* Animated ring on hover */}
            <div className="absolute inset-0 rounded-xl border-2 border-[#ff0049]/0 group-hover:border-[#ff0049]/30 transition-all duration-300 group-hover:scale-110"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xs font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight transition-all duration-300">
              {currentRole === 'crm' ? 'Kotak811 for Corporates' : 'Kotak811 for enterprises'}
            </h1>
            {currentRole !== 'crm' && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5 transition-colors duration-200 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                {user.company}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      {onNavigate && (
        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/[0.08] text-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {/* Icon */}
                <div className={`transition-colors duration-200 ${
                  isActive ? 'text-primary' : ''
                }`}>
                  {item.icon}
                </div>
                
                {/* Label */}
                <span className={`flex-1 text-left ${isActive ? 'font-medium' : ''}`}>
                  {item.label}
                </span>
                
                {/* Pulse indicator */}
                {item.showPulse && isActive && (
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="absolute w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                  </span>
                )}
                
                {/* Badge */}
                {item.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}

      {/* Bottom Section: Notifications & User */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        {/* Notifications */}
        <button className="group w-full flex items-center space-x-3 px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-100/50 hover:to-transparent dark:hover:from-gray-700/50 relative overflow-hidden">
          <div className="relative z-10">
            <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 flex">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            </span>
          </div>
          <span className="relative z-10 text-sm transition-all duration-200 group-hover:translate-x-0.5">Notifications</span>
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-gradient-to-r hover:from-gray-100/50 hover:to-transparent dark:hover:from-gray-700/50 rounded-xl transition-all duration-200 relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-9 h-9 bg-gradient-to-br from-[hsl(var(--primary))] to-[#1b34c9] rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-lg shadow-primary/20 transition-all duration-200 group-hover:scale-110 group-hover:shadow-primary/30">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                {/* Status indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
              <div className="relative z-10 flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate transition-all duration-200 group-hover:translate-x-0.5">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.employeeId}</p>
              </div>
              <svg className="relative z-10 w-4 h-4 text-gray-400 transition-all duration-200 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.employeeId}</p>
                <p className="text-xs text-muted-foreground">{user.company}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};
