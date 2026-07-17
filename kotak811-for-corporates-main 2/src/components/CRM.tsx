import React, { useState } from "react";
import { AppLayout } from "./AppLayout";
import { CRMContent } from "./CRMContent";

interface CRMProps {
  onLogout: () => void;
}

export const CRM: React.FC<CRMProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>('corporates');

  return (
    <AppLayout 
      onLogout={onLogout}
      currentPage={activeTab}
      onNavigate={setActiveTab}
    >
      <CRMContent activeTab={activeTab} onTabChange={setActiveTab} />
    </AppLayout>
  );
};
