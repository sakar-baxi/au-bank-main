import React from "react";
import { Sidebar } from "./Sidebar";
import { useRole } from "@/contexts/RoleContext";

interface AppLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  currentPage?: string;
  onNavigate?: (page: any) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  onLogout, 
  currentPage,
  onNavigate 
}) => {
  const { currentRole } = useRole();
  
  // Mock user data - in real app, this would come from API/context
  const userData = {
    name: "Rahul Sharma",
    company: "Tech Corp India",
    employeeId: "EMP12345",
    salary: 850000,
    tenure: 3.5,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[hsl(var(--background))] via-white to-[hsl(var(--accent))]/20 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <Sidebar 
        user={userData} 
        onLogout={onLogout} 
        currentPage={currentPage}
        onNavigate={onNavigate}
        currentRole={currentRole}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

