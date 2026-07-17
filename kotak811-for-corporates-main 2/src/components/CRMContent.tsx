import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageTransition } from "./PageTransition";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CorporateOnboardAgent } from "./CorporateOnboardAgent";

interface CRMContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const CRMContent: React.FC<CRMContentProps> = ({ activeTab, onTabChange }) => {
  const [selectedCorporate, setSelectedCorporate] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [analyticsQuery, setAnalyticsQuery] = useState("");
  const [analyticsResult, setAnalyticsResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [corporatesView, setCorporatesView] = useState<'grid' | 'list'>('list');
  const [employeeFilters, setEmployeeFilters] = useState({
    search: '',
    corporate: '',
    department: '',
    minSalary: '',
    maxSalary: '',
  });
  const [corporateFilters, setCorporateFilters] = useState({
    search: '',
    industry: '',
    location: '',
  });
  const [corporateDetailTab, setCorporateDetailTab] = useState<'employees' | 'products'>('employees');
  const [activatedProductsByCorp, setActivatedProductsByCorp] = useState<Record<string, Set<string>>>({});

  // Mock Data
  const corporates = [
    { id: 'CORP001', name: 'Tech Corp India', industry: 'Technology', employees: 15, activeProducts: 58, productPenetration: 78, location: 'Bangalore', since: '2019', topProducts: ['Credit Cards', 'Personal Loans', 'Insurance'] },
    { id: 'CORP002', name: 'Global Finance Ltd', industry: 'Finance', employees: 12, activeProducts: 42, productPenetration: 62, location: 'Mumbai', since: '2020', topProducts: ['Home Loans', 'Credit Cards', 'Investment'] },
    { id: 'CORP003', name: 'HealthCare Plus', industry: 'Healthcare', employees: 10, activeProducts: 35, productPenetration: 67, location: 'Delhi', since: '2021', topProducts: ['Insurance', 'Personal Loans', 'Credit Cards'] },
    { id: 'CORP004', name: 'EduTech Solutions', industry: 'Education', employees: 8, activeProducts: 28, productPenetration: 69, location: 'Pune', since: '2022', topProducts: ['Credit Cards', 'FDs', 'Insurance'] },
  ];

  // Expanded employees list with realistic Indian names
  const baseEmployees = [
    { corpId: 'CORP001', corpName: 'Tech Corp India', name: 'Rahul Sharma', designation: 'Senior Engineer', department: 'Engineering', salary: 850000, tenure: 3.5, creditScore: 78, products: 3, lastActive: '2 hours ago' },
    { corpId: 'CORP001', corpName: 'Tech Corp India', name: 'Priya Mehta', designation: 'Marketing Manager', department: 'Marketing', salary: 650000, tenure: 2.1, creditScore: 72, products: 2, lastActive: '1 day ago' },
    { corpId: 'CORP001', corpName: 'Tech Corp India', name: 'Amit Kumar', designation: 'Sales Lead', department: 'Sales', salary: 720000, tenure: 4.2, creditScore: 81, products: 4, lastActive: '3 hours ago' },
    { corpId: 'CORP001', corpName: 'Tech Corp India', name: 'Sneha Patel', designation: 'Product Manager', department: 'Product', salary: 780000, tenure: 2.8, creditScore: 75, products: 3, lastActive: '5 hours ago' },
    { corpId: 'CORP001', corpName: 'Tech Corp India', name: 'Vikram Singh', designation: 'DevOps Engineer', department: 'Engineering', salary: 920000, tenure: 4.1, creditScore: 82, products: 4, lastActive: '1 hour ago' },
    { corpId: 'CORP001', corpName: 'Tech Corp India', name: 'Ananya Reddy', designation: 'UI/UX Designer', department: 'Design', salary: 680000, tenure: 1.9, creditScore: 70, products: 2, lastActive: '3 hours ago' },
    { corpId: 'CORP001', corpName: 'Tech Corp India', name: 'Arjun Desai', designation: 'Data Scientist', department: 'Engineering', salary: 950000, tenure: 3.2, creditScore: 79, products: 3, lastActive: '4 hours ago' },
    { corpId: 'CORP001', corpName: 'Tech Corp India', name: 'Kavya Nair', designation: 'HR Manager', department: 'HR', salary: 720000, tenure: 5.1, creditScore: 80, products: 3, lastActive: '2 days ago' },
    { corpId: 'CORP001', corpName: 'Tech Corp India', name: 'Rohan Gupta', designation: 'Business Analyst', department: 'Operations', salary: 690000, tenure: 2.5, creditScore: 74, products: 2, lastActive: '6 hours ago' },
    { corpId: 'CORP001', corpName: 'Tech Corp India', name: 'Ishita Joshi', designation: 'Content Writer', department: 'Marketing', salary: 520000, tenure: 1.2, creditScore: 68, products: 1, lastActive: '1 day ago' },
    { corpId: 'CORP001', corpName: 'Tech Corp India', name: 'Karan Malhotra', designation: 'Finance Manager', department: 'Finance', salary: 890000, tenure: 6.3, creditScore: 84, products: 5, lastActive: '3 hours ago' },
    { corpId: 'CORP001', corpName: 'Tech Corp India', name: 'Neha Kapoor', designation: 'QA Engineer', department: 'Engineering', salary: 620000, tenure: 2.0, creditScore: 71, products: 2, lastActive: '8 hours ago' },
    { corpId: 'CORP001', corpName: 'Tech Corp India', name: 'Aditya Rao', designation: 'Operations Manager', department: 'Operations', salary: 810000, tenure: 4.7, creditScore: 77, products: 4, lastActive: '2 hours ago' },
    { corpId: 'CORP001', corpName: 'Tech Corp India', name: 'Pooja Iyer', designation: 'Sales Executive', department: 'Sales', salary: 580000, tenure: 1.8, creditScore: 69, products: 2, lastActive: '1 day ago' },
    { corpId: 'CORP001', corpName: 'Tech Corp India', name: 'Siddharth Verma', designation: 'Tech Lead', department: 'Engineering', salary: 1100000, tenure: 5.5, creditScore: 85, products: 5, lastActive: '30 mins ago' },
    
    { corpId: 'CORP002', corpName: 'Global Finance Ltd', name: 'Deepak Chopra', designation: 'Investment Banker', department: 'Finance', salary: 1200000, tenure: 7.2, creditScore: 88, products: 6, lastActive: '1 hour ago' },
    { corpId: 'CORP002', corpName: 'Global Finance Ltd', name: 'Ritika Bansal', designation: 'Financial Analyst', department: 'Finance', salary: 750000, tenure: 3.1, creditScore: 76, products: 3, lastActive: '4 hours ago' },
    { corpId: 'CORP002', corpName: 'Global Finance Ltd', name: 'Manish Agarwal', designation: 'Risk Manager', department: 'Risk', salary: 980000, tenure: 5.8, creditScore: 83, products: 4, lastActive: '2 hours ago' },
    { corpId: 'CORP002', corpName: 'Global Finance Ltd', name: 'Shruti Mishra', designation: 'Compliance Officer', department: 'Legal', salary: 820000, tenure: 4.3, creditScore: 78, products: 3, lastActive: '5 hours ago' },
    { corpId: 'CORP002', corpName: 'Global Finance Ltd', name: 'Varun Saxena', designation: 'Portfolio Manager', department: 'Finance', salary: 1050000, tenure: 6.1, creditScore: 82, products: 5, lastActive: '3 hours ago' },
    { corpId: 'CORP002', corpName: 'Global Finance Ltd', name: 'Megha Sinha', designation: 'Wealth Advisor', department: 'Finance', salary: 870000, tenure: 3.9, creditScore: 77, products: 4, lastActive: '1 day ago' },
    { corpId: 'CORP002', corpName: 'Global Finance Ltd', name: 'Nikhil Bhatt', designation: 'Credit Analyst', department: 'Finance', salary: 710000, tenure: 2.7, creditScore: 73, products: 3, lastActive: '6 hours ago' },
    { corpId: 'CORP002', corpName: 'Global Finance Ltd', name: 'Anjali Pillai', designation: 'Operations Head', department: 'Operations', salary: 950000, tenure: 5.4, creditScore: 80, products: 4, lastActive: '2 hours ago' },
    { corpId: 'CORP002', corpName: 'Global Finance Ltd', name: 'Rajesh Kulkarni', designation: 'Branch Manager', department: 'Operations', salary: 890000, tenure: 8.1, creditScore: 86, products: 5, lastActive: '4 hours ago' },
    { corpId: 'CORP002', corpName: 'Global Finance Ltd', name: 'Tanya Khanna', designation: 'Marketing Head', department: 'Marketing', salary: 920000, tenure: 4.6, creditScore: 79, products: 4, lastActive: '1 day ago' },
    { corpId: 'CORP002', corpName: 'Global Finance Ltd', name: 'Abhishek Pandey', designation: 'IT Manager', department: 'IT', salary: 840000, tenure: 3.8, creditScore: 75, products: 3, lastActive: '7 hours ago' },
    { corpId: 'CORP002', corpName: 'Global Finance Ltd', name: 'Divya Menon', designation: 'Customer Service Lead', department: 'Operations', salary: 650000, tenure: 2.9, creditScore: 72, products: 2, lastActive: '5 hours ago' },

    { corpId: 'CORP003', corpName: 'HealthCare Plus', name: 'Dr. Suresh Raman', designation: 'Chief Medical Officer', department: 'Medical', salary: 1400000, tenure: 9.2, creditScore: 90, products: 6, lastActive: '2 hours ago' },
    { corpId: 'CORP003', corpName: 'HealthCare Plus', name: 'Nisha Ghosh', designation: 'Hospital Administrator', department: 'Administration', salary: 880000, tenure: 5.7, creditScore: 81, products: 4, lastActive: '3 hours ago' },
    { corpId: 'CORP003', corpName: 'HealthCare Plus', name: 'Akash Bose', designation: 'Pharmacist', department: 'Pharmacy', salary: 620000, tenure: 3.4, creditScore: 74, products: 3, lastActive: '1 day ago' },
    { corpId: 'CORP003', corpName: 'HealthCare Plus', name: 'Simran Kaur', designation: 'Nursing Supervisor', department: 'Nursing', salary: 580000, tenure: 4.8, creditScore: 76, products: 3, lastActive: '6 hours ago' },
    { corpId: 'CORP003', corpName: 'HealthCare Plus', name: 'Ravi Krishnan', designation: 'Lab Technician', department: 'Laboratory', salary: 480000, tenure: 2.3, creditScore: 70, products: 2, lastActive: '8 hours ago' },
    { corpId: 'CORP003', corpName: 'HealthCare Plus', name: 'Pallavi Thakur', designation: 'Radiologist', department: 'Radiology', salary: 1100000, tenure: 6.9, creditScore: 84, products: 5, lastActive: '2 hours ago' },
    { corpId: 'CORP003', corpName: 'HealthCare Plus', name: 'Gaurav Dutta', designation: 'Physiotherapist', department: 'Therapy', salary: 550000, tenure: 2.1, creditScore: 71, products: 2, lastActive: '1 day ago' },
    { corpId: 'CORP003', corpName: 'HealthCare Plus', name: 'Aarti Bhatia', designation: 'Dietician', department: 'Nutrition', salary: 520000, tenure: 1.9, creditScore: 68, products: 2, lastActive: '12 hours ago' },
    { corpId: 'CORP003', corpName: 'HealthCare Plus', name: 'Sunil Naidu', designation: 'Security Manager', department: 'Security', salary: 490000, tenure: 3.7, creditScore: 72, products: 2, lastActive: '4 hours ago' },
    { corpId: 'CORP003', corpName: 'HealthCare Plus', name: 'Preeti Rawat', designation: 'HR Executive', department: 'HR', salary: 560000, tenure: 2.6, creditScore: 70, products: 2, lastActive: '1 day ago' },

    { corpId: 'CORP004', corpName: 'EduTech Solutions', name: 'Sandeep Tripathi', designation: 'Product Head', department: 'Product', salary: 950000, tenure: 4.5, creditScore: 79, products: 4, lastActive: '3 hours ago' },
    { corpId: 'CORP004', corpName: 'EduTech Solutions', name: 'Lakshmi Subramaniam', designation: 'Content Developer', department: 'Content', salary: 620000, tenure: 2.8, creditScore: 73, products: 3, lastActive: '5 hours ago' },
    { corpId: 'CORP004', corpName: 'EduTech Solutions', name: 'Harsh Malik', designation: 'Software Engineer', department: 'Engineering', salary: 780000, tenure: 3.1, creditScore: 75, products: 3, lastActive: '2 hours ago' },
    { corpId: 'CORP004', corpName: 'EduTech Solutions', name: 'Ritu Sharma', designation: 'Sales Manager', department: 'Sales', salary: 720000, tenure: 4.0, creditScore: 77, products: 3, lastActive: '1 day ago' },
    { corpId: 'CORP004', corpName: 'EduTech Solutions', name: 'Mohit Chauhan', designation: 'Customer Success Lead', department: 'Support', salary: 680000, tenure: 2.4, creditScore: 72, products: 3, lastActive: '6 hours ago' },
    { corpId: 'CORP004', corpName: 'EduTech Solutions', name: 'Tanvi Jain', designation: 'Marketing Manager', department: 'Marketing', salary: 710000, tenure: 3.3, creditScore: 74, products: 3, lastActive: '4 hours ago' },
    { corpId: 'CORP004', corpName: 'EduTech Solutions', name: 'Sanjay Varma', designation: 'Finance Head', department: 'Finance', salary: 920000, tenure: 5.2, creditScore: 80, products: 4, lastActive: '2 hours ago' },
    { corpId: 'CORP004', corpName: 'EduTech Solutions', name: 'Prerna Mishra', designation: 'UI Designer', department: 'Design', salary: 650000, tenure: 2.0, creditScore: 71, products: 2, lastActive: '8 hours ago' },
  ];

  // Repeat the employees to show a long list (70+ employees)
  const banks = ['Kotak811', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank'];
  const baseWithSalaryAccounts = baseEmployees.map((emp, idx) => ({
    ...emp,
    salaryAccountBank: banks[idx % banks.length],
  }));
  const allEmployees = [
    ...baseWithSalaryAccounts.map((emp, idx) => ({ ...emp, id: `EMP${String(idx + 1).padStart(3, '0')}` })),
    ...baseWithSalaryAccounts.map((emp, idx) => ({ ...emp, id: `EMP${String(idx + 46).padStart(3, '0')}` })),
  ];

  const employeeDetails: Record<string, any> = {
    'EMP001': {
      products: [
        { id: 'P1', name: 'Platinum Credit Card', type: 'Credit Card', status: 'Active', detail: '₹5L limit', since: 'Jan 2023' },
        { id: 'P2', name: 'Personal Loan', type: 'Loan', status: 'Active', detail: '₹8L • ₹18,450/mo', since: 'Mar 2023' },
        { id: 'P3', name: 'Health Insurance', type: 'Insurance', status: 'Active', detail: '₹10L coverage', since: 'Jan 2022' },
      ],
      applications: [
        { id: 'A1', product: 'Home Loan', amount: '₹35L', appliedOn: '2 days ago', status: 'Under Review', stage: 'Document Verification' },
        { id: 'A2', product: 'Investment Plan', amount: '₹2L', appliedOn: '1 week ago', status: 'Approved', stage: 'Completed' },
      ],
      approvals: [
        { id: 'AP1', product: 'Platinum Credit Card', date: 'Jan 15, 2023', decision: 'Approved', detail: '₹5L limit' },
        { id: 'AP2', product: 'Personal Loan', date: 'Mar 10, 2023', decision: 'Approved', detail: '₹8L' },
        { id: 'AP3', product: 'Gold Credit Card', date: 'Dec 20, 2022', decision: 'Rejected', detail: 'Credit score below threshold' },
      ],
    },
  };

  const [productRules, setProductRules] = useState<Array<{
    id: string;
    name: string;
    type: string;
    tier: string;
    icon: string;
    gradient: string;
    eligible: number;
    approvalRate: number;
    criteria: string[];
    benefits: string[];
  }>>([
    { 
      id: 'R1',
      name: 'Kotak 811 Salary Account',
      type: 'Account',
      tier: 'Salary Program',
      icon: '🏦',
      gradient: 'from-primary to-primary/80',
      eligible: 1247,
      approvalRate: 96, 
      criteria: ['Corporate employee', 'Salary credit via Kotak 811', 'KYC completed'], 
      benefits: ['Zero-balance salary account', 'Virtual debit card & UPI', 'Exclusive corporate offers'] 
    },
    { 
      id: 'R2',
      name: 'Kotak 811 Personal Loan',
      type: 'Loan',
      tier: 'Preferred',
      icon: '💰',
      gradient: 'from-green-500 to-emerald-600',
      eligible: 892,
      approvalRate: 87,
      criteria: ['Active Kotak 811 salary account', 'Salary ≥ ₹3L', 'Credit Score ≥ 650'],
      benefits: ['Preferential interest rates', 'Quick, paperless journey', 'Tenure 12–60 months'] 
    },
    { 
      id: 'R3',
      name: '811 Super Credit Card',
      type: 'Credit Card',
      tier: 'Corporate Program',
      icon: '💳',
      gradient: 'from-yellow-500 to-orange-500',
      eligible: 567,
      approvalRate: 92,
      criteria: ['Salary ≥ ₹5L', 'Kotak 811 salary credit', 'Minimum 6 months vintage'],
      benefits: ['Cashback & travel rewards', 'Simplified KYC for employees', 'Auto-debit from salary account'] 
    },
    { 
      id: 'R4',
      name: 'Kotak 811 Health',
      type: 'Insurance',
      tier: 'Benefits',
      icon: '🛡️',
      gradient: 'from-primary to-primary/80',
      eligible: 420,
      approvalRate: 90,
      criteria: ['Eligible for allowances', 'Corporate approval', 'Active employment'],
      benefits: ['Health and accident cover', 'Linked to Kotak accounts', 'Real-time tracking for employees'] 
    },
  ]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState({ name: '', type: 'Credit Card', tier: 'Standard', criteria: '', benefits: '' });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ criteria: string[]; benefits: string[] }>({ criteria: [], benefits: [] });
  const [statusByEmpId, setStatusByEmpId] = useState<Record<string, string>>({});
  const generateSignupLink = (empId: string) => `https://kotak811.com/salary-account?emp=${empId}`;
  const markStatus = (empId: string, status: string) => {
    setStatusByEmpId(prev => ({ ...prev, [empId]: status }));
  };
  const handleInviteSMS = (emp: any) => {
    markStatus(emp.id, 'Invite Sent');
  };
  const handleInviteEmail = (emp: any) => {
    markStatus(emp.id, 'Invite Sent');
  };
  const handleCopyLink = async (emp: any) => {
    const link = generateSignupLink(emp.id);
    try {
      await navigator.clipboard.writeText(link);
      markStatus(emp.id, 'Link Copied');
    } catch {
      markStatus(emp.id, 'Link Ready');
    }
  };
  const handleScheduleKYC = (emp: any) => {
    markStatus(emp.id, 'KYC Scheduled');
  };

  const handleAnalyticsQuery = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const query = analyticsQuery.toLowerCase();
    
    // Credit card applications - weekly
    if (query.includes('credit card') && (query.includes('week') || query.includes('this week'))) {
      setAnalyticsResult({
        query: analyticsQuery,
        summary: '127 credit card applications submitted this week',
        metrics: [
          { label: 'Total Submitted', value: '127' },
          { label: 'Approved', value: '108', percentage: 85 },
          { label: 'Under Review', value: '14', percentage: 11 },
          { label: 'Rejected', value: '5', percentage: 4 },
        ],
        topCorporate: 'Tech Corp India (54 applications)',
        recommendation: 'Strong week for credit card applications. Tech Corp India leads with 54 applications. Approval rate is healthy at 85%. Consider promoting premium cards to high-earning employees in Global Finance Ltd.'
      });
    } 
    // Loan approval rates across corporates
    else if (query.includes('loan') && query.includes('approval') && query.includes('corporate')) {
      setAnalyticsResult({
        query: analyticsQuery,
        summary: 'Loan approval rates vary by corporate segment',
        metrics: [
          { label: 'Tech Corp India', value: '89%', percentage: 89 },
          { label: 'Global Finance Ltd', value: '92%', percentage: 92 },
          { label: 'HealthCare Plus', value: '87%', percentage: 87 },
          { label: 'EduTech Solutions', value: '84%', percentage: 84 },
        ],
        topCorporate: 'Global Finance Ltd (92% approval rate)',
        recommendation: 'Global Finance Ltd has the highest approval rate at 92% due to higher average salaries and credit scores. EduTech Solutions at 84% needs attention - consider revising eligibility criteria or providing financial literacy programs.'
      });
    }
    // Portfolio growth trends - quarterly
    else if (query.includes('portfolio') && query.includes('growth') && (query.includes('quarter') || query.includes('last quarter'))) {
      setAnalyticsResult({
        query: analyticsQuery,
        summary: 'Strong portfolio growth of 18% in Q3 2024',
        metrics: [
          { label: 'New Products Sold', value: '1,247' },
          { label: 'Revenue Growth', value: '+18%', percentage: 118 },
          { label: 'Customer Satisfaction', value: '4.6/5', percentage: 92 },
          { label: 'Portfolio Value', value: '₹42.8Cr' },
        ],
        topCorporate: 'Tech Corp India (₹18.2Cr contribution)',
        recommendation: 'Exceptional quarter with 18% growth. Tech Corp leads with ₹18.2Cr contribution. Personal loans and credit cards drove 65% of new sales. Focus on insurance and investment products for Q4 to diversify portfolio mix.'
      });
    }
    // Default fallback for other queries
    else if (query.includes('card') || query.includes('credit')) {
      setAnalyticsResult({
        query: analyticsQuery,
        summary: '386 total credit card applications this month',
        metrics: [
          { label: 'Total Apps', value: '386' },
          { label: 'Approved', value: '329', percentage: 85 },
          { label: 'Rejected', value: '57', percentage: 15 },
        ],
        topCorporate: 'Tech Corp India (164 applications)',
        recommendation: 'Strong month for credit card acquisitions. 85% approval rate is above industry average. Focus on converting rejected applications through financial counseling or alternative products.'
      });
    } else if (query.includes('loan')) {
      setAnalyticsResult({
        query: analyticsQuery,
        summary: '234 loan applications this month',
        metrics: [
          { label: 'Total Apps', value: '234' },
          { label: 'Approved', value: '204', percentage: 87 },
          { label: 'Rejected', value: '30', percentage: 13 },
        ],
        topCorporate: 'Global Finance Ltd (98 applications)',
        recommendation: 'Personal loans dominate at 56% of all applications. Average loan amount increased 12% to ₹8.4L. Consider promoting home loans to eligible high-income employees.'
      });
    } else {
      setAnalyticsResult({
        query: analyticsQuery,
        summary: 'Overall Portfolio Performance',
        metrics: [
          { label: 'Total Corporates', value: '4' },
          { label: 'Total Employees', value: allEmployees.length.toString() },
          { label: 'Active Products', value: corporates.reduce((sum, c) => sum + c.activeProducts, 0).toString() },
          { label: 'Avg Penetration', value: Math.round(corporates.reduce((sum, c) => sum + c.productPenetration, 0) / corporates.length) + '%' },
        ],
        topCorporate: 'Tech Corp India (highest product penetration at 78%)',
        recommendation: 'Portfolio health is strong with ' + Math.round(corporates.reduce((sum, c) => sum + c.productPenetration, 0) / corporates.length) + '% average product penetration. Consider expanding partnerships with 2-3 new corporates in the IT and healthcare sectors for Q1 2025.'
      });
    }
    
    setIsAnalyzing(false);
  };

  const selectedEmp = allEmployees.find(e => e.id === selectedEmployee);
  const empDetails = selectedEmployee ? employeeDetails[selectedEmployee] : null;
  const industries = Array.from(new Set(corporates.map(c => c.industry))).sort();
  const locations = Array.from(new Set(corporates.map(c => c.location))).sort();
  const filteredCorporates = corporates.filter((c) => {
    const matchesSearch = !corporateFilters.search ||
      c.name.toLowerCase().includes(corporateFilters.search.toLowerCase()) ||
      c.id.toLowerCase().includes(corporateFilters.search.toLowerCase());
    const matchesIndustry = !corporateFilters.industry || c.industry === corporateFilters.industry;
    const matchesLocation = !corporateFilters.location || c.location === corporateFilters.location;
    return matchesSearch && matchesIndustry && matchesLocation;
  });
  const currentCorp = corporates.find(c => c.id === selectedCorporate);

  // Dedicated full-height layout for AI-style corporate onboarding
  if (activeTab === 'onboard') {
    return (
      <PageTransition pageKey={activeTab}>
        <div className="h-full px-4 sm:px-6 lg:px-8 py-4">
          <CorporateOnboardAgent />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition pageKey={activeTab}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard view removed for RM portal */}

      {/* Corporates Tab */}
      {activeTab === 'corporates' && (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 dark:from-gray-800 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 p-6">
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Kotak811 for Corporates</h2>
                  <p className="text-gray-600 dark:text-gray-400">{corporates.length} active corporate partnerships</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/80 dark:bg-gray-900/60 border-gray-200 dark:border-gray-700 text-xs shadow-sm hover:bg-white dark:hover:bg-gray-900"
                  onClick={() => onTabChange('onboard')}
                >
                  <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20h4v-8H4v8zm6 0h4V4h-4v16zm6 0h4v-5h-4v5z" />
                  </svg>
                  New corporate
                </Button>
              </div>

              {/* Stats Section - Inside the gradient card */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Corporates</p>
                    <div className="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{corporates.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active partnerships</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Employees</p>
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{allEmployees.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Across all corporates</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Active Products</p>
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{corporates.reduce((sum, c) => sum + c.activeProducts, 0)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Products in use</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Avg Penetration</p>
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {Math.round(corporates.reduce((sum, c) => sum + c.productPenetration, 0) / corporates.length)}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Product adoption</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters + View Toggle Section */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Corporates</h3>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setCorporatesView('grid')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  corporatesView === 'grid'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setCorporatesView('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  corporatesView === 'list'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-2">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Search</label>
                <Input
                  placeholder="Company name or ID..."
                  value={corporateFilters.search}
                  onChange={(e) => setCorporateFilters({ ...corporateFilters, search: e.target.value })}
                  className="h-9"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Industry</label>
                <select
                  value={corporateFilters.industry}
                  onChange={(e) => setCorporateFilters({ ...corporateFilters, industry: e.target.value })}
                  className="w-full h-9 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">All Industries</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Location</label>
                <select
                  value={corporateFilters.location}
                  onChange={(e) => setCorporateFilters({ ...corporateFilters, location: e.target.value })}
                  className="w-full h-9 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">All Locations</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                {(corporateFilters.search || corporateFilters.industry || corporateFilters.location) && (
                  <Button 
                    variant="outline"
                    onClick={() => setCorporateFilters({ search: '', industry: '', location: '' })}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Grid View */}
          {corporatesView === 'grid' && (
            <div className="grid md:grid-cols-2 gap-4">
            {filteredCorporates.map((corp) => (
              <Card key={corp.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{corp.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{corp.industry} • {corp.location}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Client since {corp.since}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30">Active</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Employees</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{corp.employees}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Products</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{corp.activeProducts}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Adoption</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{corp.productPenetration}%</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Popular Products:</p>
                  <div className="flex flex-wrap gap-2">
                    {corp.topProducts.map((product, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-700 dark:text-gray-300">
                        {product}
                      </span>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    setSelectedCorporate(corp.id);
                    setCorporateDetailTab('employees');
                    onTabChange('corporate');
                  }}
                >
                  Open Corporate
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Card>
            ))}
            </div>
          )}

          {/* List View */
          }
          {corporatesView === 'list' && (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Industry</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employees</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Adoption</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Since</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredCorporates.map((corp) => (
                      <tr key={corp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                              {corp.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{corp.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{corp.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary rounded-full">
                            {corp.industry}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{corp.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                          {allEmployees.filter(e => e.corpId === corp.id).length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">{corp.activeProducts}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white mr-2">{corp.productPenetration}%</span>
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${corp.productPenetration}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{corp.since}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedCorporate(corp.id);
                              setCorporateDetailTab('employees');
                              onTabChange('corporate');
                            }}
                          >
                            Open
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Employees Tab */}
      {activeTab === 'employees' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Employees</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {allEmployees.filter(emp => {
                  const matchesSearch = !employeeFilters.search || 
                    emp.name.toLowerCase().includes(employeeFilters.search.toLowerCase()) ||
                    emp.designation.toLowerCase().includes(employeeFilters.search.toLowerCase());
                  const matchesCorp = !employeeFilters.corporate || emp.corpId === employeeFilters.corporate;
                  const matchesDept = !employeeFilters.department || emp.department === employeeFilters.department;
                  const matchesMinSalary = !employeeFilters.minSalary || emp.salary >= parseInt(employeeFilters.minSalary);
                  const matchesMaxSalary = !employeeFilters.maxSalary || emp.salary <= parseInt(employeeFilters.maxSalary);
                  return matchesSearch && matchesCorp && matchesDept && matchesMinSalary && matchesMaxSalary;
                }).length} employees found
              </p>
            </div>
            <Button onClick={() => setEmployeeFilters({ search: '', corporate: '', department: '', minSalary: '', maxSalary: '' })}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear Filters
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="grid grid-cols-5 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Search</label>
                <Input
                  placeholder="Name or designation..."
                  value={employeeFilters.search}
                  onChange={(e) => setEmployeeFilters({ ...employeeFilters, search: e.target.value })}
                  className="h-9"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Corporate</label>
                <select
                  value={employeeFilters.corporate}
                  onChange={(e) => setEmployeeFilters({ ...employeeFilters, corporate: e.target.value })}
                  className="w-full h-9 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">All Corporates</option>
                  {corporates.map(corp => (
                    <option key={corp.id} value={corp.id}>{corp.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Department</label>
                <select
                  value={employeeFilters.department}
                  onChange={(e) => setEmployeeFilters({ ...employeeFilters, department: e.target.value })}
                  className="w-full h-9 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">All Departments</option>
                  {Array.from(new Set(allEmployees.map(e => e.department))).sort().map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Min Salary (₹)</label>
                <Input
                  type="number"
                  placeholder="Min..."
                  value={employeeFilters.minSalary}
                  onChange={(e) => setEmployeeFilters({ ...employeeFilters, minSalary: e.target.value })}
                  className="h-9"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Max Salary (₹)</label>
                <Input
                  type="number"
                  placeholder="Max..."
                  value={employeeFilters.maxSalary}
                  onChange={(e) => setEmployeeFilters({ ...employeeFilters, maxSalary: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>
          </Card>

          {/* Employees Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Corporate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tenure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Salary Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Active</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {allEmployees
                    .filter(emp => {
                      const matchesSearch = !employeeFilters.search || 
                        emp.name.toLowerCase().includes(employeeFilters.search.toLowerCase()) ||
                        emp.designation.toLowerCase().includes(employeeFilters.search.toLowerCase());
                      const matchesCorp = !employeeFilters.corporate || emp.corpId === employeeFilters.corporate;
                      const matchesDept = !employeeFilters.department || emp.department === employeeFilters.department;
                      const matchesMinSalary = !employeeFilters.minSalary || emp.salary >= parseInt(employeeFilters.minSalary);
                      const matchesMaxSalary = !employeeFilters.maxSalary || emp.salary <= parseInt(employeeFilters.maxSalary);
                      return matchesSearch && matchesCorp && matchesDept && matchesMinSalary && matchesMaxSalary;
                    })
                    .map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                              {emp.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{emp.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{emp.designation}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{emp.corpName}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{emp.corpId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full">
                            {emp.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                          ₹{(emp.salary / 100000).toFixed(1)}L
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {emp.tenure} yrs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${emp.salaryAccountBank === 'Kotak811' ? 'text-green-700 dark:text-green-400 font-semibold' : 'text-gray-900 dark:text-white'}`}>
                              {emp.salaryAccountBank}
                            </span>
                            {emp.salaryAccountBank === 'Kotak811' ? null : statusByEmpId[emp.id] ? (
                              <Badge className="bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-700 opacity-80 text-[10px] font-medium">
                                {statusByEmpId[emp.id]}
                              </Badge>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    Initiate
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  <DropdownMenuItem onClick={() => handleInviteSMS(emp)}>Send SMS invite</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleInviteEmail(emp)}>Send Email invite</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleCopyLink(emp)}>Copy signup link</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleScheduleKYC(emp)}>Schedule onsite KYC</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
                            {emp.products}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {emp.lastActive}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Corporate Detail Tab */}
      {activeTab === 'corporate' && selectedCorporate && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
          <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{currentCorp?.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{currentCorp?.industry} • {currentCorp?.location} • Since {currentCorp?.since}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => { onTabChange('corporates'); setSelectedCorporate(null); }}>Back to Corporates</Button>
            </div>
          </div>

          {/* Subtabs */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
            <button
              onClick={() => setCorporateDetailTab('employees')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                corporateDetailTab === 'employees'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Employees
            </button>
            <button
              onClick={() => setCorporateDetailTab('products')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                corporateDetailTab === 'products'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Products
            </button>
          </div>

          {/* Employees list for corporate */}
          {corporateDetailTab === 'employees' && (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Salary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tenure</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Salary Account</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {allEmployees
                      .filter(emp => emp.corpId === selectedCorporate)
                      .map((emp) => (
                        <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                {emp.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{emp.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{emp.designation}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full">
                              {emp.department}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                            ₹{(emp.salary / 100000).toFixed(1)}L
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {emp.tenure} yrs
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                            <span className={`text-sm ${emp.salaryAccountBank === 'Kotak811' ? 'text-green-700 dark:text-green-400 font-semibold' : 'text-gray-900 dark:text-white'}`}>
                                {emp.salaryAccountBank}
                              </span>
                            {emp.salaryAccountBank === 'Kotak811' ? null : statusByEmpId[emp.id] ? (
                                <Badge className="bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-700 opacity-80 text-[10px] font-medium">
                                  {statusByEmpId[emp.id]}
                                </Badge>
                              ) : (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      Initiate
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => handleInviteSMS(emp)}>Send SMS invite</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleInviteEmail(emp)}>Send Email invite</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCopyLink(emp)}>Copy signup link</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleScheduleKYC(emp)}>Schedule onsite KYC</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
                              {emp.products}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {emp.lastActive}
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Products for corporate */}
          {corporateDetailTab === 'products' && (
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Products</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Manage activated products and eligibility criteria</p>
                </div>
              </div>

              <div className="space-y-4">
                {productRules.map((rule) => {
                  const activeSet = activatedProductsByCorp[selectedCorporate] || new Set<string>();
                  const isActive = activeSet.has(rule.id);
                  return (
                    <Card key={rule.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{rule.icon}</div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{rule.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{rule.type} • {rule.tier} Tier</p>
                          </div>
                        </div>
                        <label className="inline-flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => {
                              const current = activatedProductsByCorp[selectedCorporate] || new Set<string>();
                              const next = new Set(current);
                              if (next.has(rule.id)) next.delete(rule.id); else next.add(rule.id);
                              setActivatedProductsByCorp({ ...activatedProductsByCorp, [selectedCorporate]: next });
                            }}
                          />
                          <span>{isActive ? 'Activated' : 'Inactive'}</span>
                        </label>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Eligibility Requirements</h4>
                          <div className="space-y-2">
                            {rule.criteria.map((c, idx) => (
                              <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span>{c}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Product Benefits</h4>
                          <div className="space-y-2">
                            {rule.benefits.map((b, idx) => (
                              <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                <span>{b}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Actions</h4>
                          <div className="space-x-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => onTabChange('products')}
                            >
                              Edit Eligibility
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{productRules.length} products with eligibility criteria</p>
            </div>
            <Button onClick={() => setIsAddingProduct((v) => !v)}>{isAddingProduct ? 'Close' : 'Add Product'}</Button>
          </div>

          {isAddingProduct && (
            <Card className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Name</label>
                  <Input value={newProductForm.name} onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })} placeholder="e.g., Platinum Credit Card" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Type</label>
                  <select
                    value={newProductForm.type}
                    onChange={(e) => setNewProductForm({ ...newProductForm, type: e.target.value })}
                    className="w-full h-9 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option>Credit Card</option>
                    <option>Loan</option>
                    <option>Insurance</option>
                    <option>Investment</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Tier</label>
                  <select
                    value={newProductForm.tier}
                    onChange={(e) => setNewProductForm({ ...newProductForm, tier: e.target.value })}
                    className="w-full h-9 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option>Standard</option>
                    <option>Gold</option>
                    <option>Platinum</option>
                    <option>Premium</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => {
                      if (!newProductForm.name.trim()) return;
                      const nextId = `R${productRules.length + 1}`;
                      const newRule = {
                        id: nextId,
                        name: newProductForm.name.trim(),
                        type: newProductForm.type,
                        tier: newProductForm.tier,
                        icon: newProductForm.type === 'Loan' ? '💰' : newProductForm.type === 'Insurance' ? '🛡️' : '💳',
                        gradient: 'from-gray-500 to-gray-600',
                        eligible: 0,
                        approvalRate: 0,
                        criteria: newProductForm.criteria.split('\n').filter(Boolean),
                        benefits: newProductForm.benefits.split('\n').filter(Boolean),
                      };
                      setProductRules((prev) => [...prev, newRule]);
                      setNewProductForm({ name: '', type: 'Credit Card', tier: 'Standard', criteria: '', benefits: '' });
                      setIsAddingProduct(false);
                    }}
                  >
                    Save Product
                  </Button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Eligibility Criteria (one per line)</label>
                  <textarea
                    className="w-full h-24 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={newProductForm.criteria}
                    onChange={(e) => setNewProductForm({ ...newProductForm, criteria: e.target.value })}
                    placeholder={"e.g.\nSalary ≥ ₹5L\nCredit Score ≥ 700"}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Benefits (one per line)</label>
                  <textarea
                    className="w-full h-24 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={newProductForm.benefits}
                    onChange={(e) => setNewProductForm({ ...newProductForm, benefits: e.target.value })}
                    placeholder={"e.g.\n2% cashback\nTravel insurance"}
                  />
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-4">
            {productRules.map((rule) => (
              <Card key={rule.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{rule.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{rule.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{rule.type} • {rule.tier} Tier</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30">Active</Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Eligibility Requirements</h4>
                    <div className="space-y-2">
                      {rule.criteria.map((c, idx) => (
                        <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Product Benefits</h4>
                    <div className="space-y-2">
                      {rule.benefits.map((b, idx) => (
                        <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Actions</h4>
                    {editingProductId === rule.id ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">Eligibility Criteria</label>
                          <div className="space-y-2">
                            {editForm.criteria.map((c, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Input
                                  value={c}
                                  onChange={(e) => {
                                    const next = [...editForm.criteria];
                                    next[idx] = e.target.value;
                                    setEditForm({ ...editForm, criteria: next });
                                  }}
                                  placeholder="e.g., Salary ≥ ₹5L"
                                  className="h-9 flex-1"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const next = editForm.criteria.filter((_, i) => i !== idx);
                                    setEditForm({ ...editForm, criteria: next });
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditForm({ ...editForm, criteria: [...editForm.criteria, ''] })}
                            >
                              Add Criterion
                            </Button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">Benefits</label>
                          <div className="space-y-2">
                            {editForm.benefits.map((b, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Input
                                  value={b}
                                  onChange={(e) => {
                                    const next = [...editForm.benefits];
                                    next[idx] = e.target.value;
                                    setEditForm({ ...editForm, benefits: next });
                                  }}
                                  placeholder="e.g., 2% cashback"
                                  className="h-9 flex-1"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const next = editForm.benefits.filter((_, i) => i !== idx);
                                    setEditForm({ ...editForm, benefits: next });
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditForm({ ...editForm, benefits: [...editForm.benefits, ''] })}
                            >
                              Add Benefit
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setProductRules((prev) => prev.map((r) => r.id === rule.id ? {
                                ...r,
                                criteria: editForm.criteria.filter(Boolean),
                                benefits: editForm.benefits.filter(Boolean),
                              } : r));
                              setEditingProductId(null);
                            }}
                          >
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingProductId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Eligible Employees</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{rule.eligible}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Approval Rate</p>
                        <div className="flex items-baseline space-x-2">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{rule.approvalRate}%</p>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${rule.approvalRate}%` }} />
                        </div>
                      </div>
                        <div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingProductId(rule.id);
                              setEditForm({
                                criteria: [...rule.criteria],
                                benefits: [...rule.benefits],
                              });
                            }}
                          >
                            Edit Eligibility
                          </Button>
                    </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 p-8">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">AI Analytics 🤖</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">Ask any question about your portfolio and get instant insights</p>
            </div>
          </div>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <Input
                  placeholder="e.g., How many credit card applications this week?"
                  value={analyticsQuery}
                  onChange={(e) => setAnalyticsQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && analyticsQuery && handleAnalyticsQuery()}
                  className="text-base h-12 mb-3"
                />
                <div className="flex flex-wrap gap-2">
                  {[
                    'How many credit card applications were submitted this week?',
                    'What are the loan approval rates across all corporates?',
                    'Show me the portfolio growth trends for the last quarter'
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setAnalyticsQuery(q)}
                      className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              <Button 
                onClick={handleAnalyticsQuery}
                disabled={!analyticsQuery || isAnalyzing}
                size="lg"
                className="h-12"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </Card>

          {/* Loading State */}
          {isAnalyzing && (
            <Card className="p-12">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Analyzing your data...</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Processing query across portfolio</p>
              </div>
            </Card>
          )}

          {/* Results */}
          {!isAnalyzing && analyticsResult && (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Query: {analyticsResult.query}</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{analyticsResult.summary}</h3>
                </div>
                <Button variant="outline" size="sm" onClick={() => setAnalyticsResult(null)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {analyticsResult.metrics.map((metric: any, idx: number) => (
                  <div key={idx} className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                    {metric.percentage !== undefined && (
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{ width: `${metric.percentage}%` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-primary/5 dark:bg-gray-900 rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">🏆 Top Performer:</p>
                <p className="text-gray-700 dark:text-gray-300">{analyticsResult.topCorporate}</p>
              </div>

              <div className="bg-purple-50 dark:bg-gray-900 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">💡 Recommendation:</p>
                <p className="text-gray-700 dark:text-gray-300">{analyticsResult.recommendation}</p>
              </div>
            </Card>
          )}
        </div>
      )}
      </div>
    </PageTransition>
  );
};

