import React, { useState } from "react";
import { AppLayout } from "./AppLayout";
import { PageTransition } from "./PageTransition";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OrdersProps {
  onLogout: () => void;
  onNavigate?: (page: 'dashboard' | 'orders' | 'agent') => void;
}

export const Orders: React.FC<OrdersProps> = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'applications'>('active');

  // Active products user has
  const activeProducts = [
    {
      id: 1,
      type: 'Credit Card',
      name: '811 Super Credit Card',
      icon: '💳',
      activatedDate: '12 Aug 2024',
      details: [
        { label: 'Card Number', value: '**** **** **** 4567' },
        { label: 'Credit Limit', value: '₹5,00,000' },
        { label: 'Outstanding', value: '₹32,450' },
        { label: 'Available Limit', value: '₹4,67,550' },
      ],
      actions: ['View Statement', 'Pay Bill', 'Manage Card']
    },
    {
      id: 2,
      type: 'Insurance',
      name: 'Kotak 811 Health',
      icon: '🏥',
      activatedDate: '28 Sep 2024',
      details: [
        { label: 'Policy Number', value: 'TRV2024092801' },
        { label: 'Coverage', value: '₹10,00,000' },
        { label: 'Valid Until', value: '28 Oct 2024' },
        { label: 'Type', value: 'Health & Accident' },
      ],
      actions: ['Download Policy', 'Claim Status', 'Extend Coverage']
    },
    {
      id: 3,
      type: 'Wealth',
      name: 'Kotak Wealth Advisory',
      icon: '💎',
      activatedDate: '01 Apr 2024',
      details: [
        { label: 'Ref Number', value: 'FD240401789' },
        { label: 'Portfolio', value: '₹1,50,000' },
        { label: 'Returns', value: '12.5% p.a.' },
        { label: 'Goal', value: 'Retirement' },
      ],
      actions: ['View Portfolio', 'Invest More', 'Advisory Call']
    }
  ];

  // Applications in progress
  const applications = [
    {
      id: 1,
      type: 'Personal Loan',
      name: 'Kotak 811 Personal Loan Application',
      icon: '💰',
      appliedDate: '15 Sep 2024',
      status: 'Under Review',
      statusColor: 'bg-yellow-100 text-yellow-700',
      progress: 60,
      timeline: [
        { step: 'Application Submitted', completed: true, date: '15 Sep' },
        { step: 'Document Verification', completed: true, date: '16 Sep' },
        { step: 'Credit Assessment', completed: false, date: 'In Progress' },
        { step: 'Final Approval', completed: false, date: 'Pending' },
      ],
      nextAction: 'Upload salary slips for last 3 months'
    },
    {
      id: 2,
      type: 'Health Insurance',
      name: 'Family Health Cover',
      icon: '🏥',
      appliedDate: '10 Sep 2024',
      status: 'Approved',
      statusColor: 'bg-green-100 text-green-700',
      progress: 100,
      timeline: [
        { step: 'Application Submitted', completed: true, date: '10 Sep' },
        { step: 'Medical Assessment', completed: true, date: '12 Sep' },
        { step: 'Underwriting', completed: true, date: '18 Sep' },
        { step: 'Policy Issued', completed: true, date: '20 Sep' },
      ],
      nextAction: 'Download policy document & make first premium payment'
    },
    {
      id: 3,
      type: 'Car Loan',
      name: '₹8L Car Loan Pre-approval',
      icon: '🚗',
      appliedDate: '05 Sep 2024',
      status: 'Rejected',
      statusColor: 'bg-red-100 text-red-700',
      progress: 40,
      timeline: [
        { step: 'Application Submitted', completed: true, date: '05 Sep' },
        { step: 'Eligibility Check', completed: true, date: '06 Sep' },
        { step: 'Income Verification', completed: false, date: 'Failed' },
      ],
      nextAction: 'Reapply after 3 months or increase down payment',
      rejectionReason: 'Current EMI obligations exceed 40% of income'
    }
  ];

  return (
    <AppLayout 
      onLogout={onLogout} 
      currentPage="orders"
      onNavigate={onNavigate}
    >
      <PageTransition pageKey="orders">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your active products and application status</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'active'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Active Products ({activeProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'applications'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Applications ({applications.length})
          </button>
        </div>

        {/* Active Products Tab */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {activeProducts.map((product) => (
              <Card key={product.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-5xl">{product.icon}</div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30">
                          Active
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{product.type}</p>
                      <p className="text-xs text-gray-500 mt-1">Activated on {product.activatedDate}</p>
                    </div>
                  </div>
                </div>

                {/* Product Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {product.details.map((detail, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{detail.label}</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{detail.value}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {product.actions.map((action, idx) => (
                    <Button key={idx} variant={idx === 0 ? 'default' : 'outline'} size="sm">
                      {action}
                    </Button>
                  ))}
                </div>
              </Card>
            ))}

            {activeProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-600 dark:text-gray-400">No active products yet</p>
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <Card key={app.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">{app.icon}</div>
                    <div>
                      <div className="flex items-center space-x-2 mb-0.5">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{app.name}</h3>
                        <Badge className={`px-2 py-0.5 text-xs ${app.statusColor}`}>
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{app.type}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Applied on {app.appliedDate}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Application Progress</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{app.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        app.status === 'Approved' ? 'bg-green-500' :
                        app.status === 'Rejected' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${app.progress}%` }}
                    />
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Application Timeline</h4>
                  <div className="space-y-2">
                    {app.timeline.map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5">
                        <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}>
                          {step.completed && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs ${step.completed ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500'}`}>
                            {step.step}
                          </p>
                          <p className="text-xs text-gray-500">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Action / Rejection Reason */}
                {app.nextAction && (
                  <div className={`rounded-lg p-3 ${
                    app.status === 'Rejected' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                    app.status === 'Approved' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                    'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  }`}>
                    <p className="text-xs font-semibold mb-1">
                      {app.status === 'Rejected' ? '❌ Rejection Reason:' :
                       app.status === 'Approved' ? '✅ Next Steps:' :
                       '⏳ Action Required:'}
                    </p>
                    {app.rejectionReason && (
                      <p className="text-xs text-red-700 dark:text-red-400 mb-2">{app.rejectionReason}</p>
                    )}
                    <p className="text-xs text-gray-700 dark:text-gray-300">{app.nextAction}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {app.status === 'Under Review' && (
                    <>
                      <Button size="sm">Upload Documents</Button>
                      <Button variant="outline" size="sm">Track Status</Button>
                    </>
                  )}
                  {app.status === 'Approved' && (
                    <>
                      <Button size="sm">Complete Application</Button>
                      <Button variant="outline" size="sm">Download Approval</Button>
                    </>
                  )}
                  {app.status === 'Rejected' && (
                    <>
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Reapply</Button>
                    </>
                  )}
                </div>
              </Card>
            ))}

            {applications.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-600 dark:text-gray-400">No applications in progress</p>
              </div>
            )}
          </div>
        )}
        </div>
      </PageTransition>
    </AppLayout>
  );
};