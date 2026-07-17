import React, { useState } from "react";
import { AppLayout } from "./AppLayout";
import { HRContent } from "./HRContent";

interface HRProps {
  onLogout: () => void;
}

export const HR: React.FC<HRProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <AppLayout 
      onLogout={onLogout}
      currentPage={activeTab}
      onNavigate={setActiveTab}
    >
      <HRContent activeTab={activeTab} onTabChange={setActiveTab} />
    </AppLayout>
  );
};
