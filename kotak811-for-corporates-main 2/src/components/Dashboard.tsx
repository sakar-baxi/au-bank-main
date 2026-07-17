import React, { useState } from "react";
import { AIHeroSection } from "./dashboard/AIHeroSection";
import { PreApprovedOffers } from "./dashboard/PreApprovedOffers";
import { ProductMarketplace } from "./dashboard/ProductMarketplace";
import { AppLayout } from "./AppLayout";
import { PageTransition } from "./PageTransition";

interface DashboardProps {
  onLogout: () => void;
  onNavigate?: (page: 'dashboard' | 'orders' | 'agent') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, onNavigate }) => {
  const [chatExpanded, setChatExpanded] = useState(false);

  // Mock user data - in real app, this would come from API
  const userData = {
    name: "Rahul Sharma",
    company: "Tech Corp India",
    employeeId: "EMP12345",
    salary: 850000,
    tenure: 3.5, // years
  };

  return (
    <AppLayout 
      onLogout={onLogout} 
      currentPage="dashboard"
      onNavigate={onNavigate}
    >
      <PageTransition pageKey="dashboard">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* AI Hero Section */}
            <AIHeroSection 
              userName={userData.name}
              onOpenChat={() => setChatExpanded(true)}
              onNavigate={onNavigate}
            />

            {/* Overview: stack Pre-approved Offers */}
            <div className="space-y-6">
              <section>
                <PreApprovedOffers />
              </section>
            </div>

            {/* Product Marketplace */}
            <section>
              <ProductMarketplace />
            </section>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
};
