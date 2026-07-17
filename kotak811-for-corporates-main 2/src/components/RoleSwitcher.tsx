import React from 'react';
import { useRole, UserRole } from '@/contexts/RoleContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const roleConfig = {
  employee: {
    label: 'Employee',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: 'from-blue-500 to-blue-600',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    darkBgColor: 'dark:bg-blue-900/20',
    description: 'Access your personal dashboard',
  },
  hr: {
    label: 'HR',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: 'from-purple-500 to-purple-600',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    darkBgColor: 'dark:bg-purple-900/20',
    description: 'Manage employees & benefits',
  },
  crm: {
    label: 'RM',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-emerald-500 to-emerald-600',
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    darkBgColor: 'dark:bg-emerald-900/20',
    description: 'Relationship manager tools',
  },
};

export const RoleSwitcher: React.FC = () => {
  const { currentRole, setCurrentRole } = useRole();
  const currentConfig = roleConfig[currentRole];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${currentConfig.color}`}></div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{currentConfig.label} Portal</span>
            </div>
            <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Switch Portal</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-1">
          {(Object.keys(roleConfig) as UserRole[]).map((role) => {
            const config = roleConfig[role];
            const isActive = currentRole === role;
            
            return (
              <DropdownMenuItem
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`cursor-pointer rounded-md mb-0.5 ${isActive ? config.bgColor + ' ' + config.darkBgColor : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
              >
                <div className="flex items-center justify-between w-full py-1.5 px-1">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${config.color} flex items-center justify-center text-white`}>
                      {config.icon}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isActive ? config.textColor : 'text-gray-900 dark:text-white'}`}>
                        {config.label} Portal
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{config.description}</p>
                    </div>
                  </div>
                  {isActive && (
                    <svg className={`w-4 h-4 ${config.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

