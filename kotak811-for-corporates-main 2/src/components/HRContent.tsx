import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageTransition } from "./PageTransition";
import { TrendingUp, Users, CreditCard, Building2, BarChart3, RefreshCw } from "lucide-react";

interface HRContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface DataPoint {
  id: string;
  label: string;
  description: string;
  category: 'basic' | 'financial' | 'performance';
  required: boolean;
  enabled: boolean;
}

export const HRContent: React.FC<HRContentProps> = ({ activeTab, onTabChange }) => {
  const [showSetup, setShowSetup] = useState(false);
  const [syncStep, setSyncStep] = useState<'provider' | 'credentials' | 'datapoints' | 'connecting' | 'success'>('provider');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [credentials, setCredentials] = useState({ apiKey: 'sk_live_abc123xyz789demo', domain: 'demo-company.hrms.com' });
  const [isSetupComplete, setIsSetupComplete] = useState(() => {
    return localStorage.getItem('hrms_setup_complete') === 'true';
  });
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showEmployeeDetail, setShowEmployeeDetail] = useState(false);
  const [isSyncingEmployees, setIsSyncingEmployees] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(() => new Date().toLocaleString('en-IN'));
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { id: 'name', label: 'Employee Name', description: 'Full name of the employee', category: 'basic', required: true, enabled: true },
    { id: 'email', label: 'Email Address', description: 'Work email address', category: 'basic', required: true, enabled: true },
    { id: 'empId', label: 'Employee ID', description: 'Unique employee identifier', category: 'basic', required: true, enabled: true },
    { id: 'department', label: 'Department', description: 'Employee department/team', category: 'basic', required: true, enabled: true },
    { id: 'salary', label: 'Salary Information', description: 'Current compensation details', category: 'financial', required: false, enabled: true },
    { id: 'tenure', label: 'Tenure', description: 'Years of service', category: 'basic', required: false, enabled: true },
    { id: 'performance', label: 'Performance Rating', description: 'Latest performance score', category: 'performance', required: false, enabled: false },
    { id: 'bonus', label: 'Bonus/Incentive', description: 'Variable pay information', category: 'financial', required: false, enabled: false },
  ]);

  // Ensure switching back to Employees tab shows the list, not the detail page
  useEffect(() => {
    if (activeTab === 'employees') {
      setShowEmployeeDetail(false);
      setSelectedEmployee(null);
    }
  }, [activeTab]);

  // Mock HR data - only shown when setup is complete
  const stats = {
    totalEmployees: 1247,
    activeProducts: 3891,
    avgFinScore: 76,
    monthlyDisbursals: '₹2.3Cr',
    adoptionRate: 68,
    monthlyGrowth: 12,
    activeLoans: 562,
    totalDisbursed: '₹45.8Cr'
  };

  // Generate 1247 employees with realistic data including all details
  const generateEmployees = () => {
    const baseNames = [
      'Rahul Sharma', 'Priya Mehta', 'Amit Kumar', 'Sneha Patel', 'Vikram Singh',
      'Anita Desai', 'Rohan Gupta', 'Kavya Reddy', 'Arjun Nair', 'Divya Iyer',
      'Sanjay Malhotra', 'Neha Kapoor', 'Aditya Chopra', 'Pooja Verma', 'Karan Joshi',
      'Simran Kaur', 'Ravi Prasad', 'Anjali Bhatt', 'Nikhil Agarwal', 'Swati Menon',
      'Harsh Patel', 'Megha Deshmukh', 'Varun Sinha', 'Ritika Saxena', 'Gaurav Rao',
      'Tanya Shah', 'Akash Pillai', 'Isha Thakur', 'Manish Kulkarni', 'Shruti Bose',
      'Arun Reddy', 'Preeti Singh', 'Kiran Kumar', 'Lakshmi Nair', 'Rajesh Patel'
    ];
    
    const departments = ['Engineering', 'Marketing', 'Sales', 'Operations', 'HR', 'Finance', 'Product', 'Design', 'Customer Success', 'IT', 'Legal', 'Administration'];
    const locations = ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'];
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    const employees = [];
    
    for (let i = 0; i < 1247; i++) {
      const baseName = baseNames[i % baseNames.length];
      const name = i >= baseNames.length ? `${baseName.split(' ')[0]} ${baseName.split(' ')[1]} ${Math.floor(i / baseNames.length) + 1}` : baseName;
      const empId = `EMP${(12345 + i).toString().padStart(5, '0')}`;
      const department = departments[i % departments.length];
      const salary = Math.floor(Math.random() * 700000) + 400000; // 4L to 11L
      const tenure = Math.round((Math.random() * 9 + 0.5) * 10) / 10; // 0.5 to 9.5 years
      const score = Math.floor(Math.random() * 40) + 55; // 55 to 95
      const products = Math.floor(Math.random() * 5) + 1; // 1 to 5 products
      const joiningDate = new Date(2015 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      
      const activeProductsList = [
        products >= 1 ? 'Kotak 811 Salary Account' : null,
        products >= 2 ? 'Kotak 811 Debit Card' : null,
        products >= 3 ? 'Kotak 811 Personal Loan' : null,
        products >= 4 ? '811 Super Credit Card' : null,
        products >= 5 ? 'Kotak 811 Health' : null,
      ].filter(Boolean);
      
      employees.push({
        id: empId,
        name,
        department,
        salary,
        tenure,
        score,
        products,
        status: 'active',
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@democorp.com`,
        phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        joiningDate: joiningDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
        reportingManager: baseNames[Math.floor(Math.random() * baseNames.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        emergencyContact: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
        activeProducts: activeProductsList,
        totalDisbursed: `₹${(Math.random() * 15 + 2).toFixed(1)}L`,
        lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
      });
    }
    
    return employees;
  };

  const [employees, setEmployees] = useState<any[]>(() => generateEmployees());

  const [benefits, setBenefits] = useState([
    {
      id: 1,
      name: 'Kotak 811 Salary Account',
      description: 'Zero-balance digital salary account with full mobile banking.',
      category: 'Accounts',
      enabled: true,
      eligibility: 'Kotak 811 salary credit for 3 months',
      utilizationRate: 62,
      totalUsers: 780
    },
    {
      id: 2,
      name: 'Kotak 811 Personal Loan',
      description: 'Instant, paperless personal loan for salaried employees.',
      category: 'Loans',
      enabled: true,
      eligibility: 'Active Kotak 811 salary account',
      utilizationRate: 45,
      totalUsers: 562
    },
    {
      id: 3,
      name: '811 Super Credit Card',
      description: 'Lifetime-free secured credit card to build credit.',
      category: 'Cards',
      enabled: true,
      eligibility: 'Kotak 811 salary credit and minimum vintage',
      utilizationRate: 68,
      totalUsers: 847
    },
    {
      id: 4,
      name: 'Kotak 811 Health',
      description: 'Health and accident cover linked to Kotak accounts.',
      category: 'Benefits',
      enabled: true,
      eligibility: 'All full-time employees',
      utilizationRate: 89,
      totalUsers: 1109
    },
    {
      id: 5,
      name: 'Kotak Wealth Advisory',
      description: 'Investment plans, SIPs, and goal-based advisory.',
      category: 'Wealth',
      enabled: true,
      eligibility: 'Employees eligible for reimbursements',
      utilizationRate: 34,
      totalUsers: 424
    },
    {
      id: 6,
      name: 'Kotak 811 Debit Card',
      description: 'Virtual + physical card for daily spends.',
      category: 'Cards',
      enabled: false,
      eligibility: 'All employees',
      utilizationRate: 0,
      totalUsers: 0
    },
  ]);

  const hrmsProviders = [
    { id: 'workday', name: 'Workday', icon: '💼', popular: true },
    { id: 'bamboohr', name: 'BambooHR', icon: '🎋', popular: true },
    { id: 'sap', name: 'SAP SuccessFactors', icon: '🏢', popular: true },
    { id: 'adp', name: 'ADP Workforce', icon: '📊', popular: false },
    { id: 'oracle', name: 'Oracle HCM', icon: '☁️', popular: false },
    { id: 'zoho', name: 'Zoho People', icon: '👥', popular: false },
  ];

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
  };

  const handleContinueToCredentials = () => {
    if (selectedProvider) {
      setSyncStep('credentials');
    }
  };

  const handleContinueToDataPoints = () => {
    if (credentials.apiKey && credentials.domain) {
      setSyncStep('datapoints');
    }
  };

  const toggleDataPoint = (id: string) => {
    setDataPoints(prev => prev.map(dp => 
      dp.id === id && !dp.required ? { ...dp, enabled: !dp.enabled } : dp
    ));
  };

  const handleConnect = async () => {
    setSyncStep('connecting');
    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 3000));
    setSyncStep('success');
    localStorage.setItem('hrms_setup_complete', 'true');
    localStorage.setItem('hrms_provider', selectedProvider);
    localStorage.setItem('hrms_datapoints', JSON.stringify(dataPoints));
    setTimeout(() => {
      setIsSetupComplete(true);
      setShowSetup(false);
      setSyncStep('provider');
      setSelectedProvider('');
      setCredentials({ apiKey: '', domain: '' });
      // Navigate to overview after setup completion
      onTabChange('overview');
    }, 2500);
  };

  const startSetup = () => {
    setShowSetup(true);
    setSyncStep('provider');
  };

  const toggleBenefit = (benefitId: number) => {
    setBenefits(prev => prev.map(benefit => 
      benefit.id === benefitId ? { ...benefit, enabled: !benefit.enabled } : benefit
    ));
  };

  const handleViewEmployee = (emp: any) => {
    setSelectedEmployee(emp);
    setShowEmployeeDetail(true);
  };

  return (
    <PageTransition pageKey={activeTab}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Show HRMS Setup Flow if not completed and user started setup */}
      {!isSetupComplete && showSetup ? (
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--primary))] to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to HR Portal</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Let's connect your HRMS to get started</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              <div className={`flex items-center ${syncStep === 'provider' ? 'text-primary' : syncStep !== 'provider' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs ${
                  syncStep === 'provider' ? 'bg-primary text-white' : 
                  syncStep !== 'provider' ? 'bg-green-600 text-white' : 
                  'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {syncStep !== 'provider' ? '✓' : '1'}
                </div>
                <span className="ml-1.5 text-xs font-medium hidden sm:inline">Provider</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className={`flex items-center ${syncStep === 'credentials' ? 'text-primary' : ['datapoints', 'connecting', 'success'].includes(syncStep) ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs ${
                  syncStep === 'credentials' ? 'bg-primary text-white' : 
                  ['datapoints', 'connecting', 'success'].includes(syncStep) ? 'bg-green-600 text-white' : 
                  'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {['datapoints', 'connecting', 'success'].includes(syncStep) ? '✓' : '2'}
                </div>
                <span className="ml-1.5 text-xs font-medium hidden sm:inline">Credentials</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className={`flex items-center ${syncStep === 'datapoints' ? 'text-primary' : ['connecting', 'success'].includes(syncStep) ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs ${
                  syncStep === 'datapoints' ? 'bg-primary text-white' : 
                  ['connecting', 'success'].includes(syncStep) ? 'bg-green-600 text-white' : 
                  'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {['connecting', 'success'].includes(syncStep) ? '✓' : '3'}
                </div>
                <span className="ml-1.5 text-xs font-medium hidden sm:inline">Data Points</span>
              </div>
            </div>
          </div>

          {/* Setup Content Card */}
          <Card className="p-6">
            {/* Step 1: Choose Provider */}
            {syncStep === 'provider' && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Select Your HRMS Provider
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose your HR management system to connect
                  </p>
                </div>
                
                <div className="mb-5">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">Popular Providers</h4>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {hrmsProviders.filter(p => p.popular).map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => handleProviderSelect(provider.id)}
                        className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                          selectedProvider === provider.id
                            ? 'border-primary bg-blue-50 dark:bg-blue-900/20 shadow-md'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="text-2xl mb-1">{provider.icon}</div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-white">{provider.name}</div>
                      </button>
                    ))}
                  </div>
                  
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">Other Providers</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {hrmsProviders.filter(p => !p.popular).map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => handleProviderSelect(provider.id)}
                        className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                          selectedProvider === provider.id
                            ? 'border-primary bg-blue-50 dark:bg-blue-900/20 shadow-md'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="text-2xl mb-1">{provider.icon}</div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-white">{provider.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={handleContinueToCredentials} 
                  disabled={!selectedProvider}
                  className="w-full h-10 text-sm font-semibold"
                >
                  Continue
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </>
            )}

            {/* Step 2: Enter Credentials */}
            {syncStep === 'credentials' && (
              <>
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Connect to {hrmsProviders.find(p => p.id === selectedProvider)?.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enter your API credentials to establish connection
                  </p>
                </div>

                <div className="space-y-4 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                      Company Domain
                    </label>
                    <Input
                      type="text"
                      placeholder="yourcompany.workday.com"
                      value={credentials.domain}
                      onChange={(e) => setCredentials({ ...credentials, domain: e.target.value })}
                      className="h-10"
                    />
                    <p className="text-xs text-gray-500 mt-1">Your organization's HRMS domain</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                      API Key / Token
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter your API key"
                      value={credentials.apiKey}
                      onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
                      className="h-10"
                    />
                    <p className="text-xs text-gray-500 mt-1">Secure token for API access</p>
                  </div>

                  <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                      🔒 Your data is secure
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      All credentials are encrypted and stored securely.
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSyncStep('provider')} 
                    className="h-10 text-sm font-semibold px-4"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </Button>
                  <Button 
                    onClick={handleContinueToDataPoints} 
                    disabled={!credentials.apiKey || !credentials.domain}
                    className="flex-1 h-10 text-sm font-semibold"
                  >
                    Continue
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </div>
              </>
            )}

            {/* Step 3: Data Points Configuration */}
            {syncStep === 'datapoints' && (
              <>
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Configure Data Points
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select what employee data you want to sync and share
                  </p>
                </div>

                <div className="space-y-4 mb-5 max-h-[400px] overflow-y-auto pr-2">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <Users className="w-3 h-3 mr-1.5" />
                      Basic Information
                    </h4>
                    <div className="space-y-2">
                      {dataPoints.filter(dp => dp.category === 'basic').map((dp) => (
                        <div key={dp.id} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {dp.label}
                              {dp.required && <span className="ml-1.5 text-xs text-red-600">*Required</span>}
                            </p>
                            <p className="text-xs text-gray-500">{dp.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer ml-3">
                            <input
                              type="checkbox"
                              checked={dp.enabled}
                              disabled={dp.required}
                              onChange={() => toggleDataPoint(dp.id)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Data */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <CreditCard className="w-3 h-3 mr-1.5" />
                      Financial Information
                    </h4>
                    <div className="space-y-2">
                      {dataPoints.filter(dp => dp.category === 'financial').map((dp) => (
                        <div key={dp.id} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {dp.label}
                              {dp.required && <span className="ml-1.5 text-xs text-red-600">*Required</span>}
                            </p>
                            <p className="text-xs text-gray-500">{dp.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer ml-3">
                            <input
                              type="checkbox"
                              checked={dp.enabled}
                              disabled={dp.required}
                              onChange={() => toggleDataPoint(dp.id)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Data */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <BarChart3 className="w-3 h-3 mr-1.5" />
                      Performance & Other
                    </h4>
                    <div className="space-y-2">
                      {dataPoints.filter(dp => dp.category === 'performance').map((dp) => (
                        <div key={dp.id} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {dp.label}
                              {dp.required && <span className="ml-1.5 text-xs text-red-600">*Required</span>}
                            </p>
                            <p className="text-xs text-gray-500">{dp.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer ml-3">
                            <input
                              type="checkbox"
                              checked={dp.enabled}
                              disabled={dp.required}
                              onChange={() => toggleDataPoint(dp.id)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">Privacy & Security</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Required fields are necessary for core functionality. You can modify these settings later.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSyncStep('credentials')} 
                    className="h-10 text-sm font-semibold px-4"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </Button>
                  <Button 
                    onClick={handleConnect} 
                    className="flex-1 h-10 text-sm font-semibold"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Connect & Sync
                  </Button>
                </div>
              </>
            )}

            {/* Step 4: Connecting */}
            {syncStep === 'connecting' && (
              <div className="text-center py-8">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-blue-200 dark:border-gray-700 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 m-auto w-10 h-10 text-3xl flex items-center justify-center">
                    {hrmsProviders.find(p => p.id === selectedProvider)?.icon}
                  </div>
                </div>
                
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connecting to {hrmsProviders.find(p => p.id === selectedProvider)?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Please wait while we sync your employee data...</p>
                
                <div className="max-w-sm mx-auto space-y-3">
                  {[
                    { icon: '🔐', text: 'Authenticating credentials...', delay: 0 },
                    { icon: '👥', text: 'Fetching employee directory...', delay: 200 },
                    { icon: '💰', text: 'Syncing compensation data...', delay: 400 },
                  ].map((step, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center space-x-3 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
                    >
                      <div className="text-xl animate-pulse">{step.icon}</div>
                      <span className="text-gray-700 dark:text-gray-300">{step.text}</span>
                      <div className="ml-auto">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Success */}
            {syncStep === 'success' && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-5 animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Connected Successfully! 🎉
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Your {hrmsProviders.find(p => p.id === selectedProvider)?.name} data is now synced
                </p>

                <div className="max-w-md mx-auto bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Employees Synced</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">1,247</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Departments</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">12</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      ) : !isSetupComplete ? (
        /* Show empty states for each tab when HRMS not connected */
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                HRMS Not Connected
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {activeTab === 'overview' && 'Connect your HRMS to view analytics, track metrics, and manage your organization.'}
                {activeTab === 'employees' && 'Connect your HRMS to import and manage employee data.'}
                {activeTab === 'benefits' && 'Connect your HRMS to configure and manage employee benefits.'}
              </p>
              <Button onClick={startSetup} size="lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Connect HRMS
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        /* Show normal HR Portal content when setup is complete */
        <>
      {/* Header with Sync Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">HR Portal</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage employee benefits and financial products</p>
        </div>
        <div className="flex items-center space-x-4">
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              HRMS Connected
            </Badge>
        </div>
      </div>

       {/* Overview Tab */}
       {activeTab === 'overview' && (
         <div className="space-y-6">
           {/* First Row: 2 Top Cards + Product Adoption */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Top Cards - Takes 1 column */}
             <div className="flex flex-col gap-6">
               <Card className="p-6 flex-1">
                 <div className="flex items-center justify-between mb-2">
                   <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
                   <Users className="w-5 h-5 text-blue-600" />
                 </div>
                 <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalEmployees.toLocaleString()}</p>
                 <div className="flex items-center mt-2 text-xs text-green-600">
                   <TrendingUp className="w-3 h-3 mr-1" />
                   <span>+{stats.monthlyGrowth}% this month</span>
                 </div>
               </Card>

               <Card className="p-6 flex-1">
                 <div className="flex items-center justify-between mb-2">
                   <p className="text-sm text-gray-600 dark:text-gray-400">Active Products</p>
                   <CreditCard className="w-5 h-5 text-purple-600" />
                 </div>
                 <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeProducts.toLocaleString()}</p>
                 <p className="text-xs text-gray-500 mt-2">{stats.activeLoans} active loans</p>
               </Card>
             </div>

             {/* Product Adoption Chart - Takes 2 columns */}
             <Card className="p-6 lg:col-span-2">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Adoption Rate</h3>
                 <BarChart3 className="w-5 h-5 text-gray-400" />
               </div>
               <div className="space-y-4">
                 {[
                   { name: 'Kotak 811 Salary Account', value: 62, employees: 780, color: 'bg-blue-500' },
                   { name: '811 Super Credit Card', value: 68, employees: 847, color: 'bg-purple-500' },
                   { name: 'Kotak 811 Personal Loan', value: 45, employees: 562, color: 'bg-emerald-500' },
                   { name: 'Kotak 811 Health', value: 89, employees: 1109, color: 'bg-orange-500' },
                   { name: 'Kotak Wealth Advisory', value: 34, employees: 424, color: 'bg-pink-500' },
                 ].map((item, idx) => (
                   <div key={idx}>
                     <div className="flex items-center justify-between text-sm mb-2">
                       <span className="text-gray-900 dark:text-white font-medium">{item.name}</span>
                       <div className="flex items-center gap-2">
                         <span className="text-xs text-gray-500">{item.employees.toLocaleString()}</span>
                         <span className="text-gray-600 dark:text-gray-400 font-semibold min-w-[3rem] text-right">{item.value}%</span>
                       </div>
                     </div>
                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                       <div className={`${item.color} h-3 rounded-full transition-all duration-500`} style={{ width: `${item.value}%` }} />
                     </div>
                   </div>
                 ))}
               </div>
             </Card>
           </div>


            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
               {[
                 { action: '15 new employees onboarded', time: '2h ago', icon: Users },
                 { action: 'Kotak 811 salary account opened for Rajesh K.', time: '5h ago', icon: Building2 },
                 { action: 'Kotak Life benefit plan renewed for ACME Corp', time: '1d ago', icon: CreditCard },
                 { action: 'HRMS data synced successfully', time: '2d ago', icon: BarChart3 },
               ].map((activity, idx) => {
                 const Icon = activity.icon;
                 return (
                   <div key={idx} className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                       <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-sm text-gray-900 dark:text-white truncate">{activity.action}</p>
                       <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
          </div>
                 );
               })}
            </div>
          </Card>
        </div>
      )}

      {/* Employees Tab */}
      {activeTab === 'employees' && !showEmployeeDetail && (
        <div className="space-y-6">
          {/* Search & Filter */}
          <Card className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Search employees by name, ID, or department..."
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={async () => {
                    if (isSyncingEmployees) return;
                    setIsSyncingEmployees(true);
                    // Simulate a short sync delay and update timestamp
                    await new Promise(r => setTimeout(r, 1200));
                    setLastSyncedAt(new Date().toLocaleString('en-IN'));
                    setIsSyncingEmployees(false);
                  }}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isSyncingEmployees ? 'animate-spin' : ''}`} />
                  {isSyncingEmployees ? 'Syncing…' : 'Sync HRMS'}
                </Button>
              </div>
              
              {/* Visible Filters */}
              <div className="flex items-center gap-4 pt-2 border-t">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Department:</label>
                  <select 
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Customer Success">Customer Success</option>
                    <option value="IT">IT</option>
                    <option value="Legal">Legal</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Status:</label>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Score:</label>
                  <select 
                    value={scoreFilter}
                    onChange={(e) => setScoreFilter(e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Scores</option>
                    <option value="high">High (80+)</option>
                    <option value="medium">Medium (60-79)</option>
                    <option value="low">Low (&lt;60)</option>
                  </select>
                </div>

                {(departmentFilter !== 'all' || statusFilter !== 'all' || scoreFilter !== 'all') && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setDepartmentFilter('all');
                      setStatusFilter('all');
                      setScoreFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
            <div className="px-4 py-2 text-xs text-gray-500">
              Last synced: {lastSyncedAt}
            </div>
          </Card>

          {/* Employee Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tenure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fin. Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Products</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {employees
                    .filter(emp => {
                      if (departmentFilter !== 'all' && emp.department !== departmentFilter) return false;
                      if (statusFilter !== 'all' && emp.status !== statusFilter) return false;
                      if (scoreFilter === 'high' && emp.score < 80) return false;
                      if (scoreFilter === 'medium' && (emp.score < 60 || emp.score >= 80)) return false;
                      if (scoreFilter === 'low' && emp.score >= 60) return false;
                      return true;
                    })
                    .map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{emp.name}</p>
                          <p className="text-xs text-gray-500">{emp.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{emp.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">₹{(emp.salary / 100000).toFixed(1)}L</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{emp.tenure}y</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={emp.score >= 80 ? 'bg-green-100 text-green-700' : emp.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>
                          {emp.score}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{emp.products}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button variant="outline" size="sm" onClick={() => handleViewEmployee(emp)}>View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Benefits Tab */}
      {activeTab === 'benefits' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Benefits</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage financial products and benefits for your employees</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{benefit.name}</h3>
                      <Badge variant="secondary">{benefit.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{benefit.description}</p>
                    <p className="text-xs text-gray-500">Eligibility: {benefit.eligibility}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={benefit.enabled}
                      onChange={() => toggleBenefit(benefit.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {benefit.enabled && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Utilization Rate</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{benefit.utilizationRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${benefit.utilizationRate}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{benefit.totalUsers} employees using this benefit</p>
                  </div>
                )}

                {!benefit.enabled && (
                  <p className="text-sm text-gray-500 italic">This benefit is currently disabled for all employees</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
        </>
      )}
      </div>

      {/* Employee Detail Page */}
      {activeTab === 'employees' && showEmployeeDetail && selectedEmployee && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-8">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setShowEmployeeDetail(false)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Employees
            </Button>
            <div className="flex gap-3">
              <Button variant="outline">Edit Employee</Button>
              <Button variant="outline" className="text-red-600">Deactivate</Button>
            </div>
          </div>

          {/* Employee Header Card */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                  {selectedEmployee.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">{selectedEmployee.name}</h1>
                  <p className="text-gray-500 mt-1 text-sm sm:text-base truncate">{selectedEmployee.id} • {selectedEmployee.department}</p>
                  <div className="mt-2">
                    <Badge className="bg-green-100 text-green-700">Active Employee</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Employee Info */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">

              {/* Basic Information */}
              <Card className="p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium truncate">{selectedEmployee.email}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">Phone</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{selectedEmployee.phone}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">Department</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{selectedEmployee.department}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">Location</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{selectedEmployee.location}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">Joining Date</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{selectedEmployee.joiningDate}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">Tenure</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{selectedEmployee.tenure} years</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">Reporting Manager</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{selectedEmployee.reportingManager}</span>
                  </div>
                </div>
              </Card>

              {/* Financial Information */}
              <Card className="p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Financial Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">Annual Salary</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">₹{(selectedEmployee.salary / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">Financial Score</span>
                    <Badge className={selectedEmployee.score >= 80 ? 'bg-green-100 text-green-700' : selectedEmployee.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>
                      {selectedEmployee.score}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">Total Disbursed</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{selectedEmployee.totalDisbursed}</span>
                  </div>
                </div>
              </Card>

              {/* Active Products */}
              <Card className="p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Active Products ({selectedEmployee.products})</h3>
                <div className="space-y-2">
                  {selectedEmployee.activeProducts.map((product: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm text-gray-900 dark:text-white">{product}</span>
                      <Badge variant="secondary" className="text-xs">Active</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Emergency Contact */}
              <Card className="p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Emergency Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">Emergency Contact</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{selectedEmployee.emergencyContact}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">Blood Group</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{selectedEmployee.bloodGroup}</span>
                  </div>
                </div>
              </Card>

            </div>

            {/* Right Column - Quick Stats & Activity */}
            <div className="space-y-4 sm:space-y-6">
              {/* Quick Stats */}
              <Card className="p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Quick Stats</h3>
                <div className="space-y-5">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Financial Score</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${selectedEmployee.score >= 80 ? 'bg-green-500' : selectedEmployee.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${selectedEmployee.score}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white min-w-[2rem]">{selectedEmployee.score}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Active Products</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedEmployee.products}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Disbursed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedEmployee.totalDisbursed}</p>
                  </div>
                </div>
              </Card>

              {/* Activity */}
              <Card className="p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Activity</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Login</p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{selectedEmployee.lastLogin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tenure</p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{selectedEmployee.tenure} years</p>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full">Send Message</Button>
                <Button variant="outline" className="w-full">Download Report</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Removed Add Employee Modal per request */}
    </PageTransition>
  );
};
