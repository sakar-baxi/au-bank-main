"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, IdCard, Shield, Fingerprint, Calendar, User, MapPin, Phone, Mail, Building2, Video, Info, Percent, Receipt, Zap, Timer, Bell, CreditCard, Banknote, Check } from "lucide-react";

export interface FinAgentEmployee {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  employeeId?: string;
  pan?: string;
  aadhaar?: string;
  dob?: string;
  address?: string;
  salary?: number;
}

interface FinAgentProps {
  employee?: FinAgentEmployee | null;
}

interface Message {
  type: 'user' | 'agent' | 'thinking' | 'journey-step' | 'confirmation' | 'document' | 'success' | 'interactive' | 'info-card';
  text?: string;
  steps?: string[];
  data?: any;
  timestamp?: number;
  actions?: Array<{label: string, action: string, variant?: 'primary' | 'secondary' | 'ghost'}>;
}

interface JourneyTemplate {
  id: string;
  title: string;
  icon: string;
  description: string;
  keywords: string[];
  color: string;
}

export default function FinAgent({ employee }: FinAgentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeJourney, setActiveJourney] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typingText, setTypingText] = useState('');
  const [journeySteps, setJourneySteps] = useState<Array<{label: string, status: 'pending' | 'in-progress' | 'completed'}>>([]);
  const [mobileOTP, setMobileOTP] = useState('123456');
  const [aadhaarOTP, setAadhaarOTP] = useState('654321');
  const [cardActivationOTP, setCardActivationOTP] = useState('123456');
  const [currentStepStartedAt, setCurrentStepStartedAt] = useState<number | null>(null);
  const [selectedLoanOption, setSelectedLoanOption] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const userData = useMemo(() => ({
    name: employee?.name || "Rahul Sharma",
    company: employee?.companyName || "Tech Corp India",
    employeeId: employee?.employeeId || employee?.id || "EMP12345",
    salary: employee?.salary || 850000,
    tenure: 3.5,
    email: employee?.email || "rahul.sharma@techcorp.in",
    phone: employee?.phone || "+91 98765 43210",
    pan: employee?.pan || "ABCDE1234F",
    address: employee?.address || "123, MG Road, Bangalore - 560001",
    aadhaar: employee?.aadhaar || "XXXX XXXX 4567",
    dob: employee?.dob || "15/08/1992",
  }), [employee]);

  const journeyTemplates: JourneyTemplate[] = [
    {
      id: 'bank-account',
      title: 'Open Bank Account',
      icon: '🏦',
      description: 'Complete digital account opening',
      keywords: ['bank account', 'savings account', 'open account', 'new account', 'account opening', 'salary account'],
      color: 'from-primary to-primary/80'
    },
    {
      id: 'personal-loan',
      title: 'Apply for Loan',
      icon: '💸',
      description: 'Get instant pre-approval',
      keywords: ['loan', 'personal loan', 'borrow', 'credit', 'emi'],
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 'credit-card',
      title: 'Apply Credit Card',
      icon: '💳',
      description: 'Pre-approved cards available',
      keywords: ['credit card', 'card', 'rewards', 'cashback'],
      color: 'from-pink-500 to-rose-600'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = async (text: string, delay: number = 30) => {
    setTypingText('');
    for (let i = 0; i < text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, delay));
      setTypingText(text.slice(0, i + 1));
    }
    return text;
  };

  const addThinkingSteps = async (steps: string[]) => {
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setMessages(prev => {
        const filtered = prev.filter(m => m.type !== 'thinking');
        return [...filtered, { 
          type: 'thinking', 
          steps: steps.slice(0, i + 1),
          timestamp: Date.now()
        }];
      });
    }
  };

  // Presentation helpers: strip markdown bold and any emoji for a mature look
  const formatText = (s?: string) => {
    if (!s) return '';
    return s
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
      .replace(/^\s+/, '');
  };

  // Lightweight confetti effect plus gentle highlight for successes
  const triggerSuccessEffects = () => {
    const container = chatContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const count = 14;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.left = `${Math.random() * (rect.width - 8)}px`;
      el.style.top = `0px`;
      el.style.width = '5px';
      el.style.height = '5px';
      el.style.borderRadius = '2px';
      el.style.opacity = '0.9';
      el.style.background = ['#22c55e','#3b82f6','#f97316','#eab308','#a855f7'][Math.floor(Math.random()*5)];
      el.style.transform = `translate3d(0,0,0) rotate(${Math.random()*360}deg)`;
      el.style.transition = 'transform 800ms ease-out, opacity 900ms ease-out';
      (container as HTMLElement).appendChild(el);
      const dx = (Math.random() - 0.5) * 80;
      const dy = 120 + Math.random() * 120;
      requestAnimationFrame(() => {
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${Math.random()*720}deg)`;
        el.style.opacity = '0';
      });
      setTimeout(() => { el.remove(); }, 1000);
    }
  };

  const getHeaderIconByTitle = (title?: string) => {
    const t = (title || '').toLowerCase();
    if (t.includes('aadhaar') && t.includes('otp')) return <Fingerprint className="w-3.5 h-3.5 text-gray-500 mt-0.5" />;
    if (t.includes('otp')) return <Phone className="w-3.5 h-3.5 text-gray-500 mt-0.5" />;
    if (t.includes('account')) return <Building2 className="w-3.5 h-3.5 text-gray-500 mt-0.5" />;
    if (t.includes('video kyc')) return <Video className="w-3.5 h-3.5 text-gray-500 mt-0.5" />;
    return <Info className="w-3.5 h-3.5 text-gray-500 mt-0.5" />;
  };

  const getInteractiveHeaderIcon = (fields?: any[]) => {
    const labels = (fields || []).map((f: any) => (f?.label || '').toLowerCase()).join(' ');
    if (labels.includes('pan')) return <IdCard className="w-3.5 h-3.5 text-gray-500 mt-0.5" />;
    if (labels.includes('aadhaar')) return <Fingerprint className="w-3.5 h-3.5 text-gray-500 mt-0.5" />;
    if (labels.includes('mobile')) return <Phone className="w-3.5 h-3.5 text-gray-500 mt-0.5" />;
    return <Info className="w-3.5 h-3.5 text-gray-500 mt-0.5" />;
  };

  const renderFieldIcon = (label: string) => {
    const normalized = label.toLowerCase();
    if (normalized.includes('pan')) return <IdCard className="w-4 h-4 text-gray-500" />;
    if (normalized.includes('aadhaar')) return <Fingerprint className="w-4 h-4 text-gray-500" />;
    if (normalized.includes('date of birth') || normalized.includes('dob')) return <Calendar className="w-4 h-4 text-gray-500" />;
    if (normalized.includes('name')) return <User className="w-4 h-4 text-gray-500" />;
    if (normalized.includes('address')) return <MapPin className="w-4 h-4 text-gray-500" />;
    if (normalized.includes('mobile')) return <Phone className="w-4 h-4 text-gray-500" />;
    if (normalized.includes('email')) return <Mail className="w-4 h-4 text-gray-500" />;
    if (normalized.includes('account')) return <Building2 className="w-4 h-4 text-gray-500" />;
    if (normalized.includes('video kyc')) return <Video className="w-4 h-4 text-gray-500" />;
    return <Info className="w-4 h-4 text-gray-500" />;
  };

  const renderDetailIcon = (label: string) => {
    const normalized = (label || '').toLowerCase();
    if (normalized.includes('loan amount') || normalized.includes('amount')) return <Banknote className="w-4 h-4 text-gray-500" />;
    if (normalized.includes('interest') || normalized.includes('rate')) return <Percent className="w-4 h-4 text-gray-500" />;
    if (normalized.includes('tenure') || normalized.includes('duration')) return <Timer className="w-4 h-4 text-gray-500" />;
    if (normalized.includes('processing')) return <Receipt className="w-4 h-4 text-gray-500" />;
    if (normalized.includes('disbursal') || normalized.includes('instant')) return <Zap className="w-4 h-4 text-gray-500" />;
    if (normalized.includes('reminder')) return <Bell className="w-4 h-4 text-gray-500" />;
    if (normalized.includes('card')) return <CreditCard className="w-4 h-4 text-gray-500" />;
    return <Info className="w-4 h-4 text-gray-500" />;
  };


  const handlePersonalLoanJourney = async () => {
    setActiveJourney('personal-loan');
    setJourneySteps([
      { label: 'Verify Details', status: 'pending' },
      { label: 'Bureau Consent', status: 'pending' },
      { label: 'Eligibility & Offers', status: 'pending' },
      { label: 'Select Plan', status: 'pending' },
      { label: 'KYC Verification', status: 'pending' },
      { label: 'Disbursal Account', status: 'pending' },
      { label: 'eNACH Setup', status: 'pending' },
      { label: 'Application Submitted', status: 'pending' }
    ]);

    // Step 0: Show pre-filled details for user confirmation
    setJourneySteps(prev => prev.map((step, i) => i === 0 ? { ...step, status: 'in-progress' } : step));
    setCurrentStepStartedAt(Date.now());
    setSelectedLoanOption(null);

    setMessages(prev => [...prev, {
      type: 'agent',
      text: 'Before we proceed, please review and confirm your details.',
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 400));

    setMessages(prev => [...prev, {
      type: 'confirmation',
      data: {
        title: 'Confirm Applicant Details',
        fields: [
          { label: 'Full Name', value: userData.name, verified: true },
          { label: 'PAN Number', value: userData.pan, verified: true },
          { label: 'Date of Birth', value: userData.dob, verified: true },
          { label: 'Employment', value: userData.company, verified: true },
          { label: 'Annual Income', value: `₹${(userData.salary / 100000).toFixed(1)}L`, verified: true },
          { label: 'Email', value: userData.email, verified: true },
          { label: 'Mobile', value: userData.phone, verified: true },
        ],
        action: 'confirm-pl-applicant-details'
      },
      timestamp: Date.now()
    }]);
  };

  const handlePLConfirmApplicantDetails = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Applicant details confirmed ✓',
      timestamp: Date.now()
    }]);

    // Complete Step 0 (Verify Details) and start Step 1 (Bureau Consent)
    setJourneySteps(prev => prev.map((step, i) => i === 0 ? ({ ...step, status: 'completed' }) : step));
    setJourneySteps(prev => prev.map((step, i) => i === 1 ? ({ ...step, status: 'in-progress' }) : step));

    await new Promise(resolve => setTimeout(resolve, 300));

    setMessages(prev => [...prev, {
      type: 'info-card',
      data: {
        icon: '🔎',
        title: 'Consent for Credit Bureau Check',
        subtitle: 'We will fetch your credit information to determine eligibility & rate',
        items: [
          { label: 'Purpose', value: 'Personal loan eligibility, limit & pricing' },
          { label: 'Impact on score', value: 'Soft check now, hard pull on final submit' }
        ]
      },
      actions: [
        { label: 'I Consent', action: 'consent-pl-bureau-pull', variant: 'primary' }
      ],
      timestamp: Date.now()
    }]);
  };

  const handlePLConsentBureauPull = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'I consent to credit bureau check ✓',
      timestamp: Date.now()
    }]);
    
    setIsThinking(true);
    await addThinkingSteps([
      '📡 Fetching bureau report...',
      '📊 Computing eligibility & limit...',
      '✅ Offers ready'
    ]);

    await new Promise(resolve => setTimeout(resolve, 800));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    // Complete Step 1 and start Step 2 (Eligibility & Offers)
    setJourneySteps(prev => prev.map((step, i) => i === 1 ? ({ ...step, status: 'completed' }) : step));
    setJourneySteps(prev => prev.map((step, i) => i === 2 ? ({ ...step, status: 'in-progress' }) : step));

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "You're pre-approved! Choose your loan plan:",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 400));

    setMessages(prev => [...prev, {
      type: 'journey-step',
      data: {
        title: 'Pre-Approved Personal Loan',
        highlight: '₹15,00,000',
        details: [
          { icon: '💰', label: 'Loan Amount', value: 'Up to ₹15L' },
          { icon: '📊', label: 'Interest Rate', value: '10.99% p.a. (indicative)' },
          { icon: '📅', label: 'Tenure', value: '12-60 months' },
          { icon: '💳', label: 'Processing Fee', value: '₹999 (Corporate offer)' },
          { icon: '⚡', label: 'Disbursal', value: 'Instant Disbursal' }
        ],
        options: [
          { label: '₹5L for 36 months', emi: '₹16,369/month' },
          { label: '₹10L for 48 months', emi: '₹25,845/month' },
          { label: '₹15L for 60 months', emi: '₹32,612/month' }
        ],
        action: 'select-loan'
      },
      timestamp: Date.now()
    }]);

    // Move to 'Select Plan' step
    setJourneySteps(prev => prev.map((step, i) => i === 2 ? ({ ...step, status: 'completed' }) : step));
    setJourneySteps(prev => prev.map((step, i) => i === 3 ? ({ ...step, status: 'in-progress' }) : step));
  };

  const handleVerifyAadhaarOTPLoan = async () => {
    const otpValue = aadhaarOTP || '654321';
    setMessages(prev => [...prev, {
      type: 'user',
      text: `${otpValue}`,
      timestamp: Date.now()
    }]);
    setAadhaarOTP('');

    // Complete KYC step and move to disbursal account
    setJourneySteps(prev => prev.map((step, i) => i === 4 ? ({ ...step, status: 'completed' }) : step));
    setJourneySteps(prev => prev.map((step, i) => i === 5 ? ({ ...step, status: 'in-progress' }) : step));

    await new Promise(resolve => setTimeout(resolve, 300));

    setMessages(prev => [...prev, {
      type: 'agent',
      text: 'KYC verified successfully. Confirm your disbursal account:',
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 300));

    setMessages(prev => [...prev, {
      type: 'interactive',
      text: `Your salary account is pre-verified for instant disbursal:`,
      data: {
        fields: [
          { label: 'Account', value: 'AU Bank Salary Account (pre-verified)', verified: true },
          { label: 'IFSC', value: 'AUBL0000001', verified: true }
        ]
      },
      actions: [
        { label: 'Use this account for disbursal', action: 'confirm-pl-disbursal-account', variant: 'primary' }
      ],
      timestamp: Date.now()
    }]);
  };

  const handleConfirmPLDisbursalAccount = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Use this account for disbursal ✓',
      timestamp: Date.now()
    }]);

    // Complete Step 5 and start Step 6 (eNACH)
    setJourneySteps(prev => prev.map((step, i) => i === 5 ? ({ ...step, status: 'completed' }) : step));
    setJourneySteps(prev => prev.map((step, i) => i === 6 ? ({ ...step, status: 'in-progress' }) : step));

    await new Promise(resolve => setTimeout(resolve, 300));

    setMessages(prev => [...prev, {
      type: 'info-card',
      data: {
        icon: '🔁',
        title: 'Set up eNACH (Auto-debit for EMI)',
        subtitle: 'Avoid missed EMIs by setting up auto-debit mandate',
        items: [
          { label: 'Recommended', value: 'AU Bank Salary Account eNACH' },
          { label: 'Alternative', value: 'UPI eMandate' }
        ]
      },
      actions: [
        { label: 'Use Salary Account eNACH', action: 'setup-pl-enach-account', variant: 'secondary' },
        { label: 'Use UPI eMandate', action: 'setup-pl-enach-upi', variant: 'ghost' }
      ],
      timestamp: Date.now()
    }]);
  };

  const handleSetupPLEnach = async (method: 'account' | 'upi') => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: method === 'account' ? 'Use Salary Account eNACH' : 'Use UPI eMandate',
      timestamp: Date.now()
    }]);

    setIsThinking(true);
    await addThinkingSteps([
      '🔐 Setting up eNACH mandate...',
      '✅ Mandate verified',
      '⚙️ Linking payment method...'
    ]);

    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    // Complete Step 6 and start Step 7 (Submit)
    setJourneySteps(prev => prev.map((step, i) => i === 6 ? ({ ...step, status: 'completed' }) : step));
    setJourneySteps(prev => prev.map((step, i) => i === 7 ? ({ ...step, status: 'in-progress' }) : step));

    setMessages(prev => [...prev, {
      type: 'confirmation',
      data: {
        title: 'Submit Personal Loan Application',
        fields: [
          { label: 'Selected Plan', value: selectedLoanOption || '—', verified: true },
          { label: 'eNACH Method', value: method === 'account' ? 'Salary Account eNACH' : 'UPI eMandate', verified: true },
          { label: 'Disbursal Account', value: 'AU Bank Salary Account', verified: true }
        ],
        action: 'confirm-pl-submit'
      },
      timestamp: Date.now()
    }]);
  };

  const handleConfirmPLSubmit = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Application submitted with e-sign ✓',
      timestamp: Date.now()
    }]);

    setIsThinking(true);
    await addThinkingSteps([
      '📋 Processing loan application...',
      '✅ Credit rule checks passed',
      '📨 Application submitted'
    ]);

    await new Promise(resolve => setTimeout(resolve, 1200));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    // Complete final step
    setJourneySteps(prev => prev.map((step, i) => i === 7 ? ({ ...step, status: 'completed' }) : step));
    setActiveJourney(null);

    setMessages(prev => [...prev, {
      type: 'success',
      data: {
        title: '🎉 Personal Loan Application Submitted!',
        applicationNumber: 'PL' + Date.now().toString().slice(-8),
        details: [
          'Status: Pre-approved - Under final review',
          'Expected approval: Same day',
          'Disbursal: Within 24 hours post-approval'
        ],
        nextSteps: [
          'Approval notification via SMS/email',
          'e-agreement to be shared for e-sign',
          'Funds credited to your chosen account'
        ]
      },
      timestamp: Date.now()
    }]);
  };

  const handleSelectLoan = async (option: string) => {
    setSelectedLoanOption(option);
    setMessages(prev => [...prev, {
      type: 'user',
      text: `Selected: ${option}`,
      timestamp: Date.now()
    }]);

    // Complete Step 3 (Select Plan) and start Step 4 (KYC)
    setJourneySteps(prev => prev.map((step, i) => i === 3 ? ({ ...step, status: 'completed' }) : step));
    setJourneySteps(prev => prev.map((step, i) => i === 4 ? ({ ...step, status: 'in-progress' }) : step));

    await new Promise(resolve => setTimeout(resolve, 300));

    // Conditional KYC: if full KYC exists, skip to disbursal account
    const kycStatus: 'full' | 'partial' | 'none' = 'partial';
    if ((kycStatus as string) === 'full') {
      setMessages(prev => [...prev, {
        type: 'agent',
        text: "Your KYC is already complete. Let's confirm your disbursal account.",
        timestamp: Date.now()
      }]);

      await new Promise(resolve => setTimeout(resolve, 300));
      // Move to disbursal account step
      setJourneySteps(prev => prev.map((step, i) => i === 4 ? ({ ...step, status: 'completed' }) : step));
      setJourneySteps(prev => prev.map((step, i) => i === 5 ? ({ ...step, status: 'in-progress' }) : step));

      setMessages(prev => [...prev, {
        type: 'interactive',
        text: 'Confirm your disbursal account:',
        data: {
          fields: [
            { label: 'Account', value: 'AU Bank Salary Account (pre-verified)', verified: true },
            { label: 'IFSC', value: 'AUBL0000001', verified: true }
          ]
        },
        actions: [
          { label: 'Use this account for disbursal', action: 'confirm-pl-disbursal-account', variant: 'primary' }
        ],
        timestamp: Date.now()
      }]);
    } else {
      setMessages(prev => [...prev, {
        type: 'agent',
        text: "I'll complete a quick e-KYC via Aadhaar OTP to proceed.",
        timestamp: Date.now()
      }]);

      await new Promise(resolve => setTimeout(resolve, 300));

      setMessages(prev => [...prev, {
        type: 'info-card',
        data: {
          title: 'Aadhaar e-KYC',
          subtitle: 'Enter the 6-digit OTP sent to your Aadhaar-linked mobile',
          input: {
            type: 'otp',
            placeholder: 'Enter 6-digit OTP',
            id: 'pl-aadhaar-otp'
          }
        },
        actions: [
          { label: 'Verify OTP', action: 'verify-pl-aadhaar-otp', variant: 'primary' }
        ],
        timestamp: Date.now()
      }]);
    }
  };

  const handleTaxPlanningJourney = async () => {
    setActiveJourney('tax-planning');
    
    setIsThinking(true);
    await addThinkingSteps([
      '📊 Analyzing tax profile...',
      '💰 Calculating savings...',
      '✨ Plan ready!'
    ]);

    await new Promise(resolve => setTimeout(resolve, 800));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "Your personalized tax-saving plan:",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 500));

    setMessages(prev => [...prev, {
      type: 'journey-step',
      data: {
        title: 'Tax Optimization Plan',
        highlight: 'Save ₹1,56,000 in taxes',
        sections: [
          {
            name: 'Section 80C - ₹1,50,000',
            items: [
              { name: 'ELSS Mutual Funds', amount: '₹1,00,000', returns: '12-15% potential' },
              { name: 'PPF', amount: '₹30,000', returns: '7.1% assured' },
              { name: 'Life Insurance', amount: '₹20,000', returns: 'Protection' }
            ]
          },
          {
            name: 'Section 80D - ₹25,000',
            items: [
              { name: 'Health Insurance (Self)', amount: '₹15,000', returns: 'Coverage ₹5L' },
              { name: 'Health Insurance (Parents)', amount: '₹10,000', returns: 'Coverage ₹3L' }
            ]
          },
          {
            name: 'Section 80CCD(1B) - ₹50,000',
            items: [
              { name: 'NPS Investment', amount: '₹50,000', returns: '10-12% potential' }
            ]
          }
        ],
        summary: {
          totalInvestment: '₹2,25,000',
          taxSaved: '₹67,500',
          additionalReturns: '₹88,500 (estimated)'
        },
        action: 'start-investments'
      },
      timestamp: Date.now()
    }]);
  };

  const handleStartTaxInvestments = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Start Tax-Saving Investments ✓',
      timestamp: Date.now()
    }]);

    setIsThinking(true);
    await addThinkingSteps([
      '📋 Setting up investments...',
      '✅ Accounts configured',
      '📊 Processing...'
    ]);

    await new Promise(resolve => setTimeout(resolve, 800));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    setMessages(prev => [...prev, {
      type: 'success',
      data: {
        title: 'Tax-Saving Plan Activated!',
        applicationNumber: 'TAX' + Date.now().toString().slice(-8),
        details: [
          'ELSS SIP: ₹10k/month',
          'PPF: ₹30k invested',
          'Health Insurance: ₹18k/year',
          'Tax Saved: ₹67,500 annually'
        ],
        nextSteps: [
          'Track via Employee Connect Pro app',
          'Auto 80C certificate at year-end',
          'Annual rebalancing scheduled'
        ]
      },
      timestamp: Date.now()
    }]);

    setActiveJourney(null);
  };

  const handleInvestmentJourney = async () => {
    setActiveJourney('investment');
    
    setIsThinking(true);
    await addThinkingSteps([
      '📊 Analyzing goals...',
      '🎯 Building portfolio...',
      '✨ Ready!'
    ]);

    await new Promise(resolve => setTimeout(resolve, 800));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "Here's your personalized investment portfolio:",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 500));

    setMessages(prev => [...prev, {
      type: 'journey-step',
      data: {
        title: 'Smart Investment Portfolio',
        highlight: '₹25,000/month SIP',
        allocation: [
          { category: 'Large Cap Equity', percentage: 40, amount: '₹10,000', risk: 'Medium', returns: '12-14%' },
          { category: 'Mid/Small Cap Equity', percentage: 30, amount: '₹7,500', risk: 'High', returns: '15-18%' },
          { category: 'Debt Funds', percentage: 20, amount: '₹5,000', risk: 'Low', returns: '7-9%' },
          { category: 'Gold ETF', percentage: 10, amount: '₹2,500', risk: 'Medium', returns: '8-10%' }
        ],
        projections: [
          { year: 1, amount: '₹3.2L', returns: '₹14K' },
          { year: 3, amount: '₹10.8L', returns: '₹72K' },
          { year: 5, amount: '₹20.2L', returns: '₹2.2L' },
          { year: 10, amount: '₹58.4L', returns: '₹28.4L' }
        ],
        action: 'start-sip'
      },
      timestamp: Date.now()
    }]);
  };

  const handleStartSIP = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Start SIP Investment ✓',
      timestamp: Date.now()
    }]);

    setIsThinking(true);
    await addThinkingSteps([
      '📋 Setting up SIP...',
      '✅ Auto-debit configured',
      '📊 Complete!'
    ]);

    await new Promise(resolve => setTimeout(resolve, 800));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    setMessages(prev => [...prev, {
      type: 'success',
      data: {
        title: 'SIP Investment Started!',
        applicationNumber: 'SIP' + Date.now().toString().slice(-8),
        details: [
          'Monthly: ₹25,000 (Diversified)',
          'First debit: 1st of next month',
          'Auto-rebalancing enabled',
          'Tax optimization active'
        ],
        nextSteps: [
          'Track via Employee Connect Pro app',
          'Monthly SMS confirmations',
          'Auto annual portfolio review'
        ]
      },
      timestamp: Date.now()
    }]);

    setActiveJourney(null);
  };

  const handleInsuranceJourney = async () => {
    setActiveJourney('insurance');
    
    setIsThinking(true);
    await addThinkingSteps([
      '🛡️ Assessing insurance needs...',
      '📊 Calculating coverage...',
      '✨ Plan ready!'
    ]);

    await new Promise(resolve => setTimeout(resolve, 800));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "Your insurance protection plan:",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 500));

    setMessages(prev => [...prev, {
      type: 'journey-step',
      data: {
        title: 'Complete Insurance Protection',
        highlight: 'Coverage worth ₹1.5 Cr',
        sections: [
          {
            name: 'Term Life Insurance - ₹1 Cr Coverage',
            items: [
              { name: 'Annual Premium', amount: '₹12,000', returns: 'Save ₹3,000' },
              { name: 'Coverage Period', amount: '30 years', returns: 'Till age 60' },
              { name: 'Special Features', amount: 'Accidental death benefit', returns: '2x payout' }
            ]
          },
          {
            name: 'Health Insurance - Family Floater ₹10L',
            items: [
              { name: 'Annual Premium', amount: '₹18,000', returns: 'Corporate discount' },
              { name: 'Coverage', amount: 'Self + Spouse + 2 Kids', returns: '₹10L floater' },
              { name: 'Benefits', amount: 'Cashless in 6000+ hospitals', returns: 'No waiting period' }
            ]
          },
          {
            name: 'Critical Illness Cover - ₹50L',
            items: [
              { name: 'Annual Premium', amount: '₹8,000', returns: 'Lump sum payout' },
              { name: 'Coverage', amount: '36 critical illnesses', returns: 'Instant payout' },
              { name: 'Add-on', amount: 'Cancer care benefit', returns: '₹25L extra' }
            ]
          }
        ],
        summary: {
          totalInvestment: '₹38,000/year',
          taxSaved: '₹11,400 under 80D',
          additionalReturns: 'Complete family protection'
        },
        action: 'purchase-insurance'
      },
      timestamp: Date.now()
    }]);
  };

  const handlePurchaseInsurance = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Purchase Insurance Package ✓',
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 500));

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "Provide your health details:",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 500));

    setMessages(prev => [...prev, {
      type: 'confirmation',
      data: {
        title: 'Health & Medical History',
        fields: [
          { label: 'Height', value: '175 cm', verified: false },
          { label: 'Weight', value: '75 kg', verified: false },
          { label: 'Blood Pressure', value: 'Normal', verified: false },
          { label: 'Diabetes', value: 'No', verified: true },
          { label: 'Smoking', value: 'No', verified: true },
          { label: 'Pre-existing Conditions', value: 'None declared', verified: true },
        ],
        action: 'confirm-health'
      },
      timestamp: Date.now()
    }]);
  };

  const handleConfirmHealth = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Health details confirmed ✓',
      timestamp: Date.now()
    }]);

    setIsThinking(true);
    await addThinkingSteps([
      '📋 Processing application...',
      '✅ Health verified',
      '🎯 Issuing policies...'
    ]);

    await new Promise(resolve => setTimeout(resolve, 800));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    setMessages(prev => [...prev, {
      type: 'success',
      data: {
        title: 'Insurance Policies Issued!',
        applicationNumber: 'INS' + Date.now().toString().slice(-8),
        details: [
          'Term Life: ₹1 Cr coverage',
          'Health: ₹10L family floater',
          'Critical Illness: ₹50L',
          'Premium: ₹38k/year (auto-debit)'
        ],
        nextSteps: [
          'Cards arrive in 7 days',
          'Policy docs sent to email',
          'Update nominees in app'
        ]
      },
      timestamp: Date.now()
    }]);

    setActiveJourney(null);
  };

  const handleCreditCardJourney = async () => {
    setActiveJourney('credit-card');
    setJourneySteps([
      { label: 'Verify Details', status: 'pending' },
      { label: 'Bureau Consent', status: 'pending' },
      { label: 'Eligibility & Offers', status: 'pending' },
      { label: 'Select Card', status: 'pending' },
      { label: 'KYC Verification', status: 'pending' },
      { label: 'Delivery Address', status: 'pending' },
      { label: 'Setup Autopay', status: 'pending' },
      { label: 'Application Submitted', status: 'pending' }
    ]);

    // Step 1: Show pre-filled details for user confirmation
    setJourneySteps(prev => prev.map((step, i) => i === 0 ? { ...step, status: 'in-progress' } : step));
    setCurrentStepStartedAt(Date.now());

    setMessages(prev => [...prev, {
      type: 'agent',
      text: 'I have your details from your profile. Please review and confirm before we proceed.',
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 400));

    setMessages(prev => [...prev, {
      type: 'confirmation',
      data: {
        title: 'Confirm Applicant Details',
        fields: [
          { label: 'Full Name', value: userData.name, verified: true },
          { label: 'PAN Number', value: userData.pan, verified: true },
          { label: 'Date of Birth', value: userData.dob, verified: true },
          { label: 'Employment', value: userData.company, verified: true },
          { label: 'Annual Income', value: `₹${(userData.salary / 100000).toFixed(1)}L`, verified: true },
          { label: 'Email', value: userData.email, verified: true },
          { label: 'Mobile', value: userData.phone, verified: true },
        ],
        action: 'confirm-applicant-details'
      },
      timestamp: Date.now()
    }]);
  };

  const handleSelectCard = async (option: string) => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: `Selected: ${option}`,
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 500));

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "Verify application details:",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 500));

    setMessages(prev => [...prev, {
      type: 'confirmation',
      data: {
        title: 'Confirm Application Details',
        fields: [
          { label: 'Full Name', value: userData.name, verified: true },
          { label: 'PAN Number', value: userData.pan, verified: true },
          { label: 'Annual Income', value: `₹${(userData.salary / 100000).toFixed(1)}L`, verified: true },
          { label: 'Employment', value: userData.company, verified: true },
          { label: 'Email', value: userData.email, verified: true },
          { label: 'Mobile', value: userData.phone, verified: true },
        ],
        action: 'confirm-card-details'
      },
      timestamp: Date.now()
    }]);
  };

  const handleConfirmCardDetails = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Application details confirmed ✓',
      timestamp: Date.now()
    }]);

    setIsThinking(true);
    await addThinkingSteps([
      '💳 Processing application...',
      '✅ Credit check done',
      '📋 Submitting...'
    ]);

    await new Promise(resolve => setTimeout(resolve, 800));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    setMessages(prev => [...prev, {
      type: 'success',
      data: {
        title: 'Application Submitted Successfully!',
        applicationNumber: 'CC' + Date.now().toString().slice(-8),
        details: [
          'Status: Under Review',
          'Card: AU Bank Royale Signature',
          'Limit: ₹10L (subject to approval)',
          'Approval: 3-5 business days'
        ],
        nextSteps: [
          'Credit check in progress',
          'Updates via SMS & email',
          'Virtual card on approval, physical in 7-10 days'
        ]
      },
      timestamp: Date.now()
    }]);

    setActiveJourney(null);
    // Keep journey steps visible to show completed progress
  };

  const handleBankAccountJourney = async () => {
    setActiveJourney('bank-account');
    setJourneySteps([
      { label: 'Mobile Verification', status: 'pending' },
      { label: 'PAN Verification', status: 'pending' },
      { label: 'Aadhaar eKYC', status: 'pending' },
      { label: 'Video KYC Scheduling', status: 'pending' },
      { label: 'Account Setup', status: 'pending' },
      { label: 'Account Activation', status: 'pending' }
    ]);

    // Step 1: Mobile Number Verification
    setJourneySteps(prev => prev.map((step, i) => i === 0 ? {...step, status: 'in-progress'} : step));
    setCurrentStepStartedAt(Date.now());
    
    setIsThinking(true);
    await addThinkingSteps([
      '📱 Verifying mobile number...',
      '✅ Number linked to profile'
    ]);

    await new Promise(resolve => setTimeout(resolve, 800));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    setMessages(prev => [...prev, {
      type: 'agent',
      text: `Verifying your mobile number ${userData.phone}. Sending code...`,
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 600));

    setMessages(prev => [...prev, {
      type: 'info-card',
      data: {
        title: 'OTP sent to your mobile',
        subtitle: `Enter the 6-digit code sent to ${userData.phone}`,
        input: {
          type: 'otp',
          placeholder: 'Enter 6-digit OTP',
          id: 'mobile-otp'
        }
      },
      actions: [
        { label: 'Verify OTP', action: 'verify-mobile-otp', variant: 'primary' }
      ],
      timestamp: Date.now()
    }]);
  };

  const handleVerifyMobileOTP = async () => {
    const otpValue = mobileOTP || '123456';
    setMessages(prev => [...prev, {
      type: 'user',
      text: `${otpValue}`,
      timestamp: Date.now()
    }]);
    setMobileOTP('');

    setJourneySteps(prev => prev.map((step, i) => i === 0 ? {...step, status: 'completed'} : step));
    triggerSuccessEffects();
    
    await new Promise(resolve => setTimeout(resolve, 400));

    setMessages(prev => [...prev, {
      type: 'agent',
      text: 'Mobile verified successfully! Next, let\'s verify your PAN.',
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Step 2: PAN Verification
    setJourneySteps(prev => prev.map((step, i) => i === 1 ? ({ ...step, status: 'in-progress' }) : step));
    setCurrentStepStartedAt(Date.now());

    await new Promise(resolve => setTimeout(resolve, 300));

    setMessages(prev => [...prev, {
      type: 'interactive',
      text: `Please confirm your PAN details:`,
      data: {
        fields: [
          { label: 'PAN Number', value: userData.pan, verified: true },
          { label: 'Name', value: userData.name, verified: true }
        ]
      },
      actions: [
        { label: 'Verify PAN', action: 'verify-pan', variant: 'primary' }
      ],
      timestamp: Date.now()
    }]);
  };

  const handleVerifyPan = async () => {
    setIsThinking(true);
    await addThinkingSteps([
      'Validating PAN with NSDL...',
      'PAN linked to your profile confirmed'
    ]);

    await new Promise(resolve => setTimeout(resolve, 800));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    // Complete PAN step
    setJourneySteps(prev => prev.map((step, i) => i === 1 ? ({ ...step, status: 'completed' }) : step));

    // Start Aadhaar eKYC step
    setJourneySteps(prev => prev.map((step, i) => i === 2 ? ({ ...step, status: 'in-progress' }) : step));
    setCurrentStepStartedAt(Date.now());

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "PAN verified. Now let's complete Aadhaar eKYC.",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 400));

    setMessages(prev => {
      const exists = prev.some(m => m.type === 'interactive' && m.text === `I've pre-filled your details from our records. Please verify:`);
      if (exists) return prev;
      return [...prev, {
        type: 'interactive',
        text: `I've pre-filled your details from our records. Please verify:`,
        data: {
          fields: [
            { label: 'Aadhaar Number', value: userData.aadhaar, editable: true },
            { label: 'Date of Birth', value: userData.dob, verified: true },
            { label: 'Name as per Aadhaar', value: userData.name, verified: true }
          ]
        },
        actions: [
          { label: 'Start Aadhaar eKYC', action: 'verify-pan-aadhaar', variant: 'primary' }
        ],
        timestamp: Date.now()
      }];
    });
  };

  const handleVerifyPanAadhaar = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Confirmed',
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 400));

    setIsThinking(true);
    await addThinkingSteps([
      '🔐 Connecting to UIDAI...',
      '📋 Initiating Aadhaar eKYC...',
      '📱 Sending OTP to Aadhaar-linked mobile...'
    ]);

    await new Promise(resolve => setTimeout(resolve, 1500));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "Perfect! I'm sending an OTP to your Aadhaar-linked mobile number for eKYC verification.",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 700));

    setMessages(prev => [...prev, {
      type: 'info-card',
      data: {
        title: 'OTP sent to Aadhaar-linked number',
        subtitle: `Enter the 6-digit code sent to XXXXXX4210`,
        input: {
          type: 'otp',
          placeholder: 'Enter 6-digit OTP',
          id: 'aadhaar-otp'
        }
      },
      actions: [
        { label: 'Verify OTP', action: 'verify-aadhaar-otp', variant: 'primary' }
      ],
      timestamp: Date.now()
    }]);
  };


  const handleVerifyAadhaarOTP = async () => {
    const otpValue = aadhaarOTP || '654321';
    setMessages(prev => [...prev, {
      type: 'user',
      text: `${otpValue}`,
      timestamp: Date.now()
    }]);
    setAadhaarOTP('');

    setIsThinking(true);
    await addThinkingSteps([
      '🔐 Validating Aadhaar OTP...',
      '✅ e-KYC data retrieved successfully',
      '📋 Address and identity confirmed'
    ]);

    await new Promise(resolve => setTimeout(resolve, 1500));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);
    setJourneySteps(prev => prev.map((step, i) => i === 2 ? {...step, status: 'completed'} : step));
    triggerSuccessEffects();

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "Excellent! Your Aadhaar eKYC is complete. Here's what we verified:",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 600));

    setMessages(prev => [...prev, {
      type: 'interactive',
      text: `Address from Aadhaar:\n${userData.address}`,
      data: {
        fields: [
          { label: 'Name', value: userData.name, verified: true },
          { label: 'Date of Birth', value: userData.dob, verified: true },
          { label: 'Address', value: userData.address, verified: true },
          { label: 'Aadhaar', value: userData.aadhaar, verified: true }
        ]
      },
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 800));

    // Step 3: Video KYC Scheduling
    setJourneySteps(prev => prev.map((step, i) => i === 3 ? {...step, status: 'in-progress'} : step));
    setCurrentStepStartedAt(Date.now());

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "Now, let's schedule your Video KYC to upgrade to a full-access account. This is a quick 5-7 minute video call.",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 700));

    setMessages(prev => [...prev, {
      type: 'info-card',
      data: {
        icon: '📹',
        title: 'Video KYC Scheduling',
        subtitle: 'Required for full account access & higher limits',
        items: [
          { label: 'Duration', value: '5-7 minutes', icon: '⏱️' },
          { label: 'Documents needed', value: 'PAN & Aadhaar', icon: '📄' },
          { label: 'Process', value: 'Live signature + Liveness check', icon: '✍️' },
          { label: 'Security', value: 'Encrypted & Recorded', icon: '🔒' }
        ]
      },
      actions: [
        { label: '📅 Today 2:00 PM', action: 'schedule-vkyc-slot1', variant: 'primary' },
        { label: '📅 Today 4:00 PM', action: 'schedule-vkyc-slot2', variant: 'secondary' },
        { label: 'Choose Another Time', action: 'schedule-vkyc-later', variant: 'ghost' }
      ],
      timestamp: Date.now()
    }]);
  };

  const handleScheduleVKYC = async (slot: string) => {
    const slotLabel = slot === 'schedule-vkyc-slot1' ? 'Today 2:00 PM' : 
                      slot === 'schedule-vkyc-slot2' ? 'Today 4:00 PM' : 'Later';
    
    setMessages(prev => [...prev, {
      type: 'user',
      text: `${slotLabel}`,
      timestamp: Date.now()
    }]);

    setJourneySteps(prev => prev.map((step, i) => i === 3 ? {...step, status: 'completed'} : step));
    triggerSuccessEffects();

    await new Promise(resolve => setTimeout(resolve, 400));

    setMessages(prev => [...prev, {
      type: 'agent',
      text: `Perfect! Video KYC scheduled for ${slotLabel}. You'll get a reminder 15 minutes before.`,
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 600));

    setMessages(prev => [...prev, {
      type: 'info-card',
      data: {
        icon: '✅',
        title: 'Video KYC Confirmed',
        subtitle: `Scheduled for ${slotLabel}`,
        items: [
          { label: 'Reminder', value: '15 mins before via SMS', icon: '📱' },
          { label: 'Duration', value: '5-7 minutes', icon: '⏱️' }
        ]
      },
      actions: [
        { label: '📅 Add to Calendar', action: 'add-calendar', variant: 'secondary' }
      ],
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 700));

    // Step 4: Account Setup Summary
    setJourneySteps(prev => prev.map((step, i) => i === 4 ? {...step, status: 'in-progress'} : step));
    setCurrentStepStartedAt(Date.now());

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "Great! Let me show you a summary of your account details before we proceed:",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 500));

    setMessages(prev => [...prev, {
      type: 'info-card',
      data: {
        icon: '📋',
        title: 'Account Setup Summary',
        subtitle: 'Please review your information',
        items: [
          { label: 'Full Name', value: userData.name, icon: '👤' },
          { label: 'PAN Number', value: userData.pan, icon: '🆔' },
          { label: 'Aadhaar', value: userData.aadhaar, icon: '🔐' },
          { label: 'Date of Birth', value: userData.dob, icon: '📅' },
          { label: 'Mobile Number', value: userData.phone, icon: '📱' },
          { label: 'Email', value: userData.email, icon: '📧' },
          { label: 'Delivery Address', value: userData.address, icon: '📍' },
          { label: 'Account Type', value: 'Savings Account', icon: '🏦' },
          { label: 'Video KYC', value: slotLabel, icon: '📹' }
        ]
      },
      actions: [
        { label: 'Confirm & Create Account', action: 'confirm-preferences', variant: 'primary' }
      ],
      timestamp: Date.now()
    }]);
  };

  const handleConfirmPreferences = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Confirmed',
      timestamp: Date.now()
    }]);

    setJourneySteps(prev => prev.map((step, i) => i === 4 ? {...step, status: 'completed'} : step));
    triggerSuccessEffects();

    await new Promise(resolve => setTimeout(resolve, 400));

    // Step 5: Account Activation
    setJourneySteps(prev => prev.map((step, i) => i === 5 ? {...step, status: 'in-progress'} : step));
    setCurrentStepStartedAt(Date.now());

    setIsThinking(true);
    await addThinkingSteps([
      '🏦 Creating your AU Bank account...',
      '💳 Generating virtual debit card...',
      '🔐 Setting up UPI...',
      '✉️ Preparing account details...',
      '✅ Account activated successfully!'
    ]);

    await new Promise(resolve => setTimeout(resolve, 2500));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    setJourneySteps(prev => prev.map((step, i) => i === 5 ? {...step, status: 'completed'} : step));
    triggerSuccessEffects();

    const accountNumber = '50100' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    const virtualCardNumber = '4532' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    
    setMessages(prev => [...prev, {
      type: 'success',
      data: {
        title: '🎉 Your AU Bank Account is Live!',
        accountNumber: accountNumber,
        details: [
          `Account Number: ${accountNumber}`,
          'IFSC Code: AUBL0000001',
          'Branch: MG Road, Bangalore',
          'Account Type: Savings Account',
          `Virtual Card: ${virtualCardNumber.slice(0, 4)} XXXX XXXX ${virtualCardNumber.slice(-4)}`,
          `UPI ID: ${userData.name.split(' ')[0].toLowerCase()}@aubank`,
          'Min Balance: ₹10,000 (MAB)',
          'Welcome Bonus: ₹500 on first txn'
        ],
        nextSteps: [
          '📹 Video KYC scheduled - Complete for full access',
          '💳 Physical debit card arriving in 7-10 days',
          '📱 Virtual card active - Use now!',
          '💰 Start transacting via UPI, IMPS, NEFT'
        ]
      },
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 800));

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "🎊 Congratulations! Your account is ready. Here's what you can do next:",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 600));

    // Primary Action: Make it Salary Account
    setMessages(prev => [...prev, {
      type: 'info-card',
      data: {
        icon: '💼',
        title: 'Upgrade to Salary Account',
        subtitle: 'Get premium benefits with zero balance requirement',
        items: [
          { label: 'Min Balance', value: '₹0 (No MAB)', icon: '💰' },
          { label: 'Free Transactions', value: 'Unlimited', icon: '🔄' },
          { label: 'Premium Benefits', value: 'Higher limits & rewards', icon: '⭐' },
          { label: 'Setup Time', value: 'Instant with HR approval', icon: '⚡' }
        ]
      },
      actions: [
        { label: '💼 Request HR to Make This Salary Account', action: 'request-salary-account', variant: 'primary' }
      ],
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 600));

    // Pre-approved Credit Card Offers
    setMessages(prev => [...prev, {
      type: 'info-card',
      data: {
        icon: '💳',
        title: 'Pre-Approved Credit Card Offers',
        subtitle: 'Exclusive offers for new account holders',
        items: []
      },
      actions: [
        { label: '💳 View Credit Card Offers', action: 'view-credit-offers', variant: 'primary' }
      ],
      timestamp: Date.now()
    }]);
    setActiveJourney(null);
    // Keep journey steps visible to show completed progress
  };

  const handleEmailAccountDetails = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Email me the details 📧',
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 400));

    setIsThinking(true);
    await addThinkingSteps([
      '📧 Composing email with account details...',
      '✅ Email sent successfully!'
    ]);

    await new Promise(resolve => setTimeout(resolve, 1200));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    setMessages(prev => [...prev, {
      type: 'agent',
      text: `Account details sent to ${userData.email}.`,
      timestamp: Date.now()
    }]);
  };

  const handleActivateVirtualCard = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Activate virtual card 💳',
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 400));

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "Let's activate your virtual debit card. For security, I need to verify a few details first.",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 600));

    const virtualCardNumber = '4532' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');

    setMessages(prev => [...prev, {
      type: 'interactive',
      text: `Your virtual card has been generated. Please verify the last 4 digits:`,
      data: {
        fields: [
          { label: 'Card Number', value: `${virtualCardNumber.slice(0, 4)} XXXX XXXX ${virtualCardNumber.slice(-4)}`, icon: '💳', verified: true },
          { label: 'Card Type', value: 'AU Bank Visa Debit', icon: '💎', verified: true },
          { label: 'Valid Until', value: '12/2028', icon: '📅', verified: true },
          { label: 'Last 4 Digits', value: virtualCardNumber.slice(-4), icon: '🔢', verified: true }
        ]
      },
      actions: [
        { label: 'Verify & Continue', action: 'verify-card-details', variant: 'primary' }
      ],
      timestamp: Date.now()
    }]);
  };

  const handleVerifyCardDetails = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Card verified ✓',
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 400));

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "Great! Now let's set up your card security. I'll send an OTP to your registered mobile.",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 600));

    setMessages(prev => [...prev, {
      type: 'info-card',
      data: {
        title: 'Card activation OTP',
        subtitle: `Enter the 6-digit code sent to ${userData.phone}`,
        input: {
          type: 'otp',
          placeholder: 'Enter 6-digit OTP',
          id: 'card-activation-otp'
        }
      },
      actions: [
        { label: 'Verify OTP & Continue', action: 'verify-card-otp', variant: 'primary' }
      ],
      timestamp: Date.now()
    }]);
  };

  const handleVerifyCardOTP = async () => {
    const otpValue = cardActivationOTP || '123456';
    setMessages(prev => [...prev, {
      type: 'user',
      text: `${otpValue} ✓`,
      timestamp: Date.now()
    }]);
    setCardActivationOTP('');

    await new Promise(resolve => setTimeout(resolve, 400));

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "Perfect! Now set transaction limits for your virtual card:",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 500));

    setMessages(prev => [...prev, {
      type: 'interactive',
      text: `You can customize these limits anytime in the app:`,
      data: {
        fields: [
          { label: 'Daily Online Limit', value: '₹50,000', icon: '🌐', editable: true },
          { label: 'Per Transaction Limit', value: '₹25,000', icon: '💰', editable: true },
          { label: 'International Usage', value: 'Disabled (Enable in app)', icon: '🌍', verified: true },
          { label: 'Contactless Payment', value: 'Enabled', icon: '📲', verified: true }
        ]
      },
      actions: [
        { label: 'Accept & Activate Card', action: 'finalize-card-activation', variant: 'primary' }
      ],
      timestamp: Date.now()
    }]);
  };

  const handleFinalizeCardActivation = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Limits confirmed ✓',
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 400));

    setIsThinking(true);
    await addThinkingSteps([
      '💳 Activating your virtual debit card...',
      '🔐 Setting up security protocols...',
      '⚙️ Configuring transaction limits...',
      '✅ Card activated successfully!'
    ]);

    await new Promise(resolve => setTimeout(resolve, 2000));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "🎉 Your virtual debit card is now active and ready for online transactions!",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 600));

    const virtualCardNumber = '4532' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');

    setMessages(prev => [...prev, {
      type: 'info-card',
      data: {
        icon: '💳',
        title: 'Virtual Card Active',
        subtitle: 'Use for online payments immediately',
        items: [
          { label: 'Card Number', value: `${virtualCardNumber.slice(0, 4)} XXXX XXXX ${virtualCardNumber.slice(-4)}`, icon: '💳' },
          { label: 'Card Type', value: 'Visa Debit', icon: '💎' },
          { label: 'Valid Until', value: '12/2028', icon: '📅' },
          { label: 'CVV', value: 'View in app', icon: '🔒' },
          { label: 'Daily Limit', value: '₹50,000', icon: '💰' },
          { label: 'Status', value: 'Active ✓', icon: '✅' }
        ]
      },
      actions: [
        { label: '📱 View Full Card Details', action: 'view-card-app', variant: 'primary' },
        { label: '⚙️ Manage Card Settings', action: 'manage-card', variant: 'secondary' }
      ],
      timestamp: Date.now()
    }]);
  };

  const handleRequestSalaryAccount = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Request HR to make this salary account 💼',
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 400));

    setIsThinking(true);
    await addThinkingSteps([
      '📧 Sending request to HR department...',
      '✅ Request submitted successfully'
    ]);

    await new Promise(resolve => setTimeout(resolve, 1200));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    setMessages(prev => [...prev, {
      type: 'success',
      data: {
        title: '✅ Salary Account Request Sent',
        applicationNumber: 'SAL' + Date.now().toString().slice(-8),
        details: [
          `Request sent to: ${userData.company} HR`,
          'Status: Pending approval',
          'Expected time: 24-48 hours',
          'Notification: Via email & SMS'
        ],
        nextSteps: [
          'HR will review your request',
          'Approval notification via email',
          'Account upgraded automatically',
          'Benefits active immediately'
        ]
      },
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 600));

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "Great! I've sent the request to your HR department. Once approved, your account will be upgraded to a salary account with premium benefits including zero balance requirement and unlimited free transactions.",
      timestamp: Date.now()
    }]);
  };

  const handleViewCreditOffers = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'View credit card offers 💳',
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 400));

    setIsThinking(true);
    await addThinkingSteps([
      '💳 Fetching pre-approved offers...',
      '📊 Analyzing your profile...',
      '✨ Offers ready!'
    ]);

    await new Promise(resolve => setTimeout(resolve, 1200));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "Excellent! Based on your profile, you're pre-approved for these premium credit cards:",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 600));

    setMessages(prev => [...prev, {
      type: 'journey-step',
      data: {
        title: 'Pre-Approved Credit Cards',
        highlight: 'Special offers for new customers',
        cardOptions: [
          {
            name: 'AU Bank Super Credit Card',
            limit: '₹5L limit',
            fee: '₹500/year (1st year free)',
            benefits: [
              '5% cashback on Amazon, Flipkart',
              '2.5% cashback on all other spends',
              '500 reward points on joining',
              'Fuel surcharge waiver',
              'Complimentary airport lounge access (2/year)'
            ]
          },
          {
            name: 'AU Bank Royale Signature Credit Card',
            limit: '₹8L limit',
            fee: '₹1,500/year (waived on ₹2L spends)',
            benefits: [
              '4 reward points per ₹150 spent',
              'Unlimited domestic lounge access',
              'International lounge access (4/year)',
              'Complimentary movie tickets (1/month)',
              '₹2,500 welcome voucher'
            ]
          },
          {
            name: 'AU Bank White Reserve Credit Card',
            limit: '₹10L limit',
            fee: '₹5,000/year (Super premium)',
            benefits: [
              '10X rewards on travel & dining',
              'Unlimited lounge access worldwide',
              'Concierge service 24/7',
              'Golf privileges at 100+ courses',
              '₹5,000 Taj voucher on joining'
            ]
          }
        ],
        action: 'select-credit-card-offer'
      },
      timestamp: Date.now()
    }]);
  };

  const handleSelectCreditCardOffer = async (cardName: string) => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: `Apply for ${cardName}`,
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Complete 'Select Card' step and start KYC step
    setJourneySteps(prev => prev.map((step, i) => i === 3 ? ({ ...step, status: 'completed' }) : step));
    setJourneySteps(prev => prev.map((step, i) => i === 4 ? ({ ...step, status: 'in-progress' }) : step));

    // If KYC is not full, perform quick e-KYC via Aadhaar OTP; else skip to address
    const kycStatus: 'full' | 'partial' | 'none' = 'partial';

    if ((kycStatus as string) === 'full') {
    setMessages(prev => [...prev, {
      type: 'agent',
        text: "Your KYC is already complete. We can skip to delivery address confirmation.",
      timestamp: Date.now()
    }]);

      await new Promise(resolve => setTimeout(resolve, 400));
      // Move directly to address step
      setJourneySteps(prev => prev.map((step, i) => i === 4 ? ({ ...step, status: 'completed' }) : step));
      setJourneySteps(prev => prev.map((step, i) => i === 5 ? ({ ...step, status: 'in-progress' }) : step));

      setMessages(prev => [...prev, {
        type: 'interactive',
        text: `Please confirm your card delivery address:`,
        data: {
          fields: [
            { label: 'Delivery Address', value: userData.address, editable: true },
            { label: 'Contact Number', value: userData.phone, verified: true },
          ]
        },
        actions: [
          { label: 'Confirm delivery address', action: 'confirm-delivery-address', variant: 'primary' }
        ],
        timestamp: Date.now()
      }]);
    } else {
      setMessages(prev => [...prev, {
        type: 'agent',
        text: "I'll complete a quick e-KYC via Aadhaar OTP to proceed.",
        timestamp: Date.now()
      }]);

      await new Promise(resolve => setTimeout(resolve, 400));

      setMessages(prev => [...prev, {
        type: 'info-card',
        data: {
          title: 'Aadhaar e-KYC',
          subtitle: 'Enter the 6-digit OTP sent to your Aadhaar-linked mobile',
          input: {
            type: 'otp',
            placeholder: 'Enter 6-digit OTP',
            id: 'cc-aadhaar-otp'
          }
        },
        actions: [
          { label: 'Verify OTP', action: 'verify-cc-aadhaar-otp', variant: 'primary' }
        ],
        timestamp: Date.now()
      }]);
    }
  };

  const handleVerifyAadhaarOTPCredit = async () => {
    const otpValue = aadhaarOTP || '654321';
    setMessages(prev => [...prev, {
      type: 'user',
      text: `${otpValue}`,
      timestamp: Date.now()
    }]);
    setAadhaarOTP('');

    // Complete KYC step and move to delivery address
    setJourneySteps(prev => prev.map((step, i) => i === 4 ? ({ ...step, status: 'completed' }) : step));
    setJourneySteps(prev => prev.map((step, i) => i === 5 ? ({ ...step, status: 'in-progress' }) : step));

    await new Promise(resolve => setTimeout(resolve, 300));

    setMessages(prev => [...prev, {
      type: 'agent',
      text: 'KYC verified successfully. Please confirm your delivery address:',
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 300));

    setMessages(prev => [...prev, {
      type: 'interactive',
      text: `We've pre-filled your address from your profile. You can edit it anytime in the app:`,
      data: {
        fields: [
          { label: 'Delivery Address', value: userData.address, editable: true },
          { label: 'Contact Number', value: userData.phone, verified: true },
        ]
      },
      actions: [
        { label: 'Confirm delivery address', action: 'confirm-delivery-address', variant: 'primary' }
      ],
      timestamp: Date.now()
    }]);
  };

  const handleConfirmApplicantDetails = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Applicant details confirmed ✓',
      timestamp: Date.now()
    }]);

    // Complete Step 0 (Verify Details) and start Step 1 (Bureau Consent)
    setJourneySteps(prev => prev.map((step, i) => i === 0 ? ({ ...step, status: 'completed' }) : step));
    setJourneySteps(prev => prev.map((step, i) => i === 1 ? ({ ...step, status: 'in-progress' }) : step));

    await new Promise(resolve => setTimeout(resolve, 300));

    setMessages(prev => [...prev, {
      type: 'info-card',
      data: {
        icon: '🔎',
        title: 'Consent for Credit Bureau Check',
        subtitle: 'We will fetch your credit information from CIBIL/Experian to determine eligibility',
        items: [
          { label: 'Purpose', value: 'Credit card eligibility & limit assessment' },
          { label: 'Impact on score', value: 'Soft check for pre-approval, hard pull on final submission' },
          { label: 'Data usage', value: 'Used only for this application' }
        ]
      },
      actions: [
        { label: 'I Consent', action: 'consent-bureau-pull', variant: 'primary' }
      ],
      timestamp: Date.now()
    }]);
  };

  const handleConsentBureauPull = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'I consent to credit bureau check ✓',
      timestamp: Date.now()
    }]);

    setIsThinking(true);
    await addThinkingSteps([
      '📡 Fetching bureau report...',
      '📊 Computing eligibility & pre-approved limit...',
      '✅ Eligibility ready'
    ]);

    await new Promise(resolve => setTimeout(resolve, 800));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    // Complete Step 1 and start Step 2 (Eligibility & Offers)
    setJourneySteps(prev => prev.map((step, i) => i === 1 ? ({ ...step, status: 'completed' }) : step));
    setJourneySteps(prev => prev.map((step, i) => i === 2 ? ({ ...step, status: 'in-progress' }) : step));

    setMessages(prev => [...prev, {
      type: 'agent',
      text: "You're pre-approved! Here are your best-matched cards:",
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 400));

    setMessages(prev => [...prev, {
      type: 'journey-step',
      data: {
        title: 'Pre-Approved Credit Cards',
        highlight: 'Special offers for you',
        cardOptions: [
          {
            name: 'AU Bank Super Credit Card',
            limit: '₹5L limit',
            fee: '₹500/year (1st year free)',
            benefits: [
              '5% cashback on Amazon, Flipkart',
              '2.5% cashback on all other spends',
              '500 reward points on joining',
              'Fuel surcharge waiver',
              'Complimentary airport lounge access (2/year)'
            ]
          },
          {
            name: 'AU Bank Royale Signature Credit Card',
            limit: '₹8L limit',
            fee: '₹1,500/year (waived on ₹2L spends)',
            benefits: [
              '4 reward points per ₹150 spent',
              'Unlimited domestic lounge access',
              'International lounge access (4/year)',
              'Complimentary movie tickets (1/month)',
              '₹2,500 welcome voucher'
            ]
          },
          {
            name: 'AU Bank White Reserve Credit Card',
            limit: '₹10L limit',
            fee: '₹5,000/year (Super premium)',
            benefits: [
              '10X rewards on travel & dining',
              'Unlimited lounge access worldwide',
              'Concierge service 24/7',
              'Golf privileges at 100+ courses',
              '₹5,000 Taj voucher on joining'
            ]
          }
        ],
        action: 'select-credit-card-offer'
      },
      timestamp: Date.now()
    }]);

    // Move to 'Select Card' step status (user will pick one)
    setJourneySteps(prev => prev.map((step, i) => i === 2 ? ({ ...step, status: 'completed' }) : step));
    setJourneySteps(prev => prev.map((step, i) => i === 3 ? ({ ...step, status: 'in-progress' }) : step));
  };

  const handleConfirmDeliveryAddress = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Address confirmed ✓',
      timestamp: Date.now()
    }]);

    // Complete Step 5 (Delivery Address) and start Step 6 (Autopay)
    setJourneySteps(prev => prev.map((step, i) => i === 5 ? ({ ...step, status: 'completed' }) : step));
    setJourneySteps(prev => prev.map((step, i) => i === 6 ? ({ ...step, status: 'in-progress' }) : step));

    await new Promise(resolve => setTimeout(resolve, 400));

    setMessages(prev => [...prev, {
      type: 'info-card',
      data: {
        icon: '🔁',
        title: 'Set up Autopay for monthly bill',
        subtitle: 'Avoid late fees by auto-debiting your credit card bill every month',
        items: [
          { label: 'Recommended', value: 'AU Bank Salary Account Autopay' },
          { label: 'Alternative', value: 'UPI Autopay (e-mandate)' }
        ]
      },
      actions: [
        { label: 'Use AU Bank Salary Account', action: 'setup-autopay-salary-account', variant: 'secondary' },
        { label: 'Use UPI Autopay', action: 'setup-autopay-upi', variant: 'ghost' }
      ],
      timestamp: Date.now()
    }]);
  };

  const handleSetupAutopay = async (method: 'salary-account' | 'upi') => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: method === 'salary-account' ? 'Use AU Bank Salary Account for autopay' : 'Use UPI Autopay',
      timestamp: Date.now()
    }]);

    setIsThinking(true);
    await addThinkingSteps([
      '🔐 Setting up autopay mandate...',
      '✅ Mandate verified',
      '⚙️ Linking payment method...'
    ]);

    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    // Complete Step 6 (Autopay) and start Step 7 (Submit)
    setJourneySteps(prev => prev.map((step, i) => i === 6 ? ({ ...step, status: 'completed' }) : step));
    setJourneySteps(prev => prev.map((step, i) => i === 7 ? ({ ...step, status: 'in-progress' }) : step));

    setMessages(prev => [...prev, {
      type: 'agent',
      text: 'Autopay is linked. Ready to submit your application:',
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 400));

    setMessages(prev => [...prev, {
      type: 'confirmation',
      data: {
        title: 'Submit Credit Card Application',
        fields: [
          { label: 'Autopay Method', value: method === 'salary-account' ? 'AU Bank Salary Account' : 'UPI Autopay', verified: true },
          { label: 'Statement Preference', value: 'Email', verified: true },
          { label: 'Delivery Address', value: userData.address, verified: true },
        ],
        action: 'confirm-credit-card-application'
      },
      timestamp: Date.now()
    }]);
  };

  const handleConfirmCreditCardApplication = async () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Application details confirmed ✓',
      timestamp: Date.now()
    }]);

    setIsThinking(true);
    await addThinkingSteps([
      '💳 Processing credit card application...',
      '✅ Credit check completed',
      '📋 Application submitted'
    ]);

    await new Promise(resolve => setTimeout(resolve, 1500));
    setMessages(prev => prev.filter(m => m.type !== 'thinking'));
    setIsThinking(false);

    // Complete final step (Application Submitted)
    setJourneySteps(prev => prev.map((step, i) => i === 7 ? ({ ...step, status: 'completed' }) : step));
    setActiveJourney(null);

    setMessages(prev => [...prev, {
      type: 'success',
      data: {
        title: '🎉 Credit Card Application Submitted!',
        applicationNumber: 'CC' + Date.now().toString().slice(-8),
        details: [
          'Status: Pre-approved - Under final review',
          'Expected approval: 2-3 business days',
          'Card delivery: 5-7 days post approval',
          'Virtual card on approval'
        ],
        nextSteps: [
          'Instant approval notification via SMS',
          'Virtual card available immediately',
          'Physical card delivered to registered address',
          'Activate via mobile app or SMS'
        ]
      },
      timestamp: Date.now()
    }]);
  };

  const detectJourney = (query: string): JourneyTemplate | null => {
    const lowerQuery = query.toLowerCase();
    return journeyTemplates.find(template => 
      template.keywords.some(keyword => lowerQuery.includes(keyword))
    ) || null;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isThinking) return;
    
    const userMessage = inputValue.trim();
    setInputValue('');
    
    setMessages(prev => [...prev, {
      type: 'user',
      text: userMessage,
      timestamp: Date.now()
    }]);

    // Detect journey
    const journey = detectJourney(userMessage);
    
    if (journey) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      switch (journey.id) {
        case 'bank-account':
          await handleBankAccountJourney();
          break;
        case 'personal-loan':
          await handlePersonalLoanJourney();
          break;
        case 'credit-card':
          await handleCreditCardJourney();
          break;
        default:
          // Generic response
          setIsThinking(true);
          await addThinkingSteps([
            '🔍 Understanding your query...',
            '📊 Analyzing your profile...',
            '💡 Searching knowledge base...',
            '✨ Preparing answer...'
          ]);
          
          await new Promise(resolve => setTimeout(resolve, 500));
          setMessages(prev => prev.filter(m => m.type !== 'thinking'));
          setIsThinking(false);
          
          setMessages(prev => [...prev, {
            type: 'agent',
            text: `I can help you with ${journey.title}! This is a great financial decision. Would you like me to guide you through the complete process?`,
            timestamp: Date.now()
          }]);
      }
    } else {
      // Generic helpful response
      setIsThinking(true);
      await addThinkingSteps([
        '🔍 Understanding your question...',
        '📊 Analyzing your financial profile...',
        '💡 Searching knowledge base...',
        '✨ Preparing personalized answer...'
      ]);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessages(prev => prev.filter(m => m.type !== 'thinking'));
      setIsThinking(false);
      
      setMessages(prev => [...prev, {
        type: 'agent',
        text: "I'm your AI financial agent, ready to help with various banking and financial services. I can assist you with:\n\n• Opening bank accounts (Savings & Salary)\n• Loan applications\n• Credit card applications\n• Tax planning & optimization\n• Investment portfolio creation\n• Insurance recommendations\n\nWhat would you like to explore today?",
        timestamp: Date.now()
      }]);
    }
  };

  const handleQuickAction = async (template: JourneyTemplate) => {
    // Directly trigger the journey without showing the opening message
    setMessages(prev => [...prev, {
      type: 'user',
      text: template.title,
      timestamp: Date.now()
    }]);

    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Directly call the appropriate journey handler
    switch (template.id) {
      case 'bank-account':
        await handleBankAccountJourney();
        break;
      case 'personal-loan':
        await handlePersonalLoanJourney();
        break;
      case 'credit-card':
        await handleCreditCardJourney();
        break;
    }
  };

  return (
    <div className="flex-1 h-full min-h-0 flex flex-col">
          <div className="max-w-[1800px] mx-auto h-full min-h-0 flex gap-4 w-full">
            {/* Main Chat Area */}
            <div className="flex-1 flex min-h-0">
              <Card className="flex-1 flex min-h-0 flex-col rounded-lg shadow-sm bg-white dark:bg-gray-800 overflow-hidden">

              {/* Messages Area */}
              <div ref={chatContainerRef} className="relative flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-2xl px-6">
                      <div className="flex flex-col items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-dashboard-primary/10 flex items-center justify-center mb-2">
                          <Bot className="w-6 h-6 text-dashboard-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                          FinAgent
                        </h3>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Hi {userData.name.split(' ')[0]}, ask about accounts, loans, or cards.</p>
                      </div>
                      <div className="flex flex-col items-stretch gap-2 max-w-2xl mx-auto">
                        {journeyTemplates.map((template) => (
                          <motion.button
                            key={template.id}
                            onClick={() => handleQuickAction(template)}
                            disabled={isThinking}
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                            className="group flex w-full items-center gap-2 rounded-full border border-dashboard-primary bg-dashboard-primary px-4 py-2.5 text-sm text-white disabled:opacity-50 hover:bg-dashboard-primary-dark hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dashboard-primary"
                          >
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/15 text-white flex-shrink-0">
                              {template.id === 'bank-account' && <Building2 className="w-3.5 h-3.5" />}
                              {template.id === 'personal-loan' && <Banknote className="w-3.5 h-3.5" />}
                              {template.id === 'credit-card' && <CreditCard className="w-3.5 h-3.5" />}
                            </span>
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="font-semibold text-white whitespace-nowrap">{template.title}</span>
                              <span className="text-white/40">•</span>
                              <span className="text-xs text-white/85 truncate whitespace-nowrap max-w-[220px] sm:max-w-[260px] md:max-w-[300px]">
                                {template.description}
                              </span>
                            </div>
                            {template.id === 'bank-account' && (
                              <span className="ml-1.5 text-[10px] font-semibold text-white bg-white/20 rounded-full px-1.5 py-0.5 whitespace-nowrap">
                                in 5 minutes
                              </span>
                            )}
                            <svg className="w-3 h-3 text-white opacity-70 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`animate-fadeIn ${currentStepStartedAt && msg.timestamp && msg.timestamp < currentStepStartedAt ? 'opacity-60' : ''}`}>
                        {msg.type === 'user' && (
                          <div className="flex justify-end">
                            <div className="max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-md bg-dashboard-primary text-white">
                              <p className="leading-relaxed">{msg.text}</p>
                            </div>
                          </div>
                        )}

                        {msg.type === 'thinking' && msg.steps && (
                          <div className="flex justify-start">
                            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-dashboard-primary/5 to-dashboard-primary/10 dark:from-dashboard-primary/20 dark:to-dashboard-primary/40 rounded-full px-4 py-2 shadow-sm ring-1 ring-dashboard-primary/40 dark:ring-dashboard-primary/40">
                              <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-dashboard-primary rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-dashboard-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-1.5 h-1.5 bg-dashboard-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-xs font-medium text-dashboard-primary">{formatText(msg.steps[msg.steps.length - 1])}</span>
                            </div>
                          </div>
                        )}

                        {msg.type === 'agent' && (
                          <div className="flex justify-start">
                            <div className="max-w-[75%] bg-[#F0EBF4] rounded-2xl px-4 py-2.5 shadow-sm ring-1 ring-[#42265e]/15">
                              <div className="flex items-start space-x-2">
                                <div className="w-6 h-6 bg-[#42265e] rounded-md flex items-center justify-center flex-shrink-0">
                                  <Bot className="w-3.5 h-3.5 text-white" />
                                </div>
                                <p className="text-sm text-[#111827] leading-relaxed whitespace-pre-line pt-0.5">{formatText(msg.text)}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {msg.type === 'interactive' && (
                          <div className="flex justify-start">
                            <div className="max-w-[85%] w-full">
                              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                                {msg.text && (
                                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                                    <div className="flex items-start space-x-2">
                                      {getInteractiveHeaderIcon(msg.data?.fields)}
                                      <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-line">{formatText(msg.text)}</p>
                                    </div>
                                  </div>
                                )}
                                {msg.data?.fields && (
                                  <div className="p-3 space-y-2">
                                    {msg.data.fields.map((field: any, i: number) => (
                                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="flex items-center space-x-2 flex-1">
                                          {renderFieldIcon(field.label)}
                                          <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{field.label}</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{field.value}</p>
                                          </div>
                                        </div>
                                        {field.verified && (
                                          <Badge className="bg-dashboard-primary/10 text-dashboard-primary dark:bg-dashboard-primary/20 dark:text-dashboard-primary">✓</Badge>
                                        )}
                                        {field.editable && (
                                          <button className="text-xs text-dashboard-primary dark:text-blue-400 hover:underline">Edit</button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {msg.actions && msg.actions.length > 0 && (
                                  <div className="p-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                                    {msg.actions.map((action: any, i: number) => (
                                      <Button 
                                        key={i}
                                        onClick={() => {
                                          if (action.action === 'verify-mobile-otp') handleVerifyMobileOTP();
                                          else if (action.action === 'verify-pan') handleVerifyPan();
                                          else if (action.action === 'verify-pan-aadhaar') handleVerifyPanAadhaar();
                                          else if (action.action === 'verify-aadhaar-otp') handleVerifyAadhaarOTP();
                                          else if (action.action === 'confirm-preferences') handleConfirmPreferences();
                                          else if (action.action === 'verify-card-details') handleVerifyCardDetails();
                                          else if (action.action === 'verify-card-otp') handleVerifyCardOTP();
                                          else if (action.action === 'finalize-card-activation') handleFinalizeCardActivation();
                                          else if (action.action === 'confirm-delivery-address') handleConfirmDeliveryAddress();
                                          else if (action.action === 'consent-bureau-pull') handleConsentBureauPull();
                                          else if (action.action === 'consent-pl-bureau-pull') handlePLConsentBureauPull();
                                          else if (action.action === 'confirm-pl-disbursal-account') handleConfirmPLDisbursalAccount();
                                        }}
                                        variant={action.variant === 'ghost' ? 'outline' : 'default'}
                                        className={`flex-1 text-xs h-8 ${
                                          action.variant === 'ghost'
                                            ? 'border-dashboard-primary/30 text-[#42265e] bg-white hover:bg-[#F0EBF4]'
                                            : 'bg-[#42265e] hover:bg-[#2e1a42] text-white'
                                        }`}
                                      >
                                        {formatText(action.label)}
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {msg.type === 'info-card' && (
                          <div className="flex justify-start">
                            <div className="max-w-[85%] w-full">
                              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                                <div className="p-3">
                                  <div className="flex items-start space-x-2 mb-2">
                                    {getHeaderIconByTitle(msg.data?.title)}
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-xs text-gray-900 dark:text-white">{msg.data?.title}</h4>
                                      {msg.data?.subtitle && (
                                        <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">{msg.data.subtitle}</p>
                                      )}
                                    </div>
                                  </div>
                                  {msg.data?.items && msg.data.items.length > 0 && (
                                    <div className="space-y-2 mb-2">
                                      {msg.data.items.map((item: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                                          <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                                          <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {msg.data?.input && (
                                    <div className="mb-3">
                                      <Input
                                        type={msg.data.input.type === 'otp' ? 'text' : msg.data.input.type}
                                        placeholder={msg.data.input.placeholder}
                                        value={
                                          msg.data.input.id === 'mobile-otp' ? mobileOTP :
                                          msg.data.input.id === 'aadhaar-otp' ? aadhaarOTP :
                                          msg.data.input.id === 'cc-aadhaar-otp' ? aadhaarOTP :
                                          msg.data.input.id === 'pl-aadhaar-otp' ? aadhaarOTP :
                                          msg.data.input.id === 'card-activation-otp' ? cardActivationOTP : ''
                                        }
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (msg.data.input.id === 'mobile-otp') {
                                            if (/^\d{0,6}$/.test(value)) setMobileOTP(value);
                                          } else if (msg.data.input.id === 'aadhaar-otp') {
                                            if (/^\d{0,6}$/.test(value)) setAadhaarOTP(value);
                                          } else if (msg.data.input.id === 'cc-aadhaar-otp') {
                                            if (/^\d{0,6}$/.test(value)) setAadhaarOTP(value);
                                          } else if (msg.data.input.id === 'pl-aadhaar-otp') {
                                            if (/^\d{0,6}$/.test(value)) setAadhaarOTP(value);
                                          } else if (msg.data.input.id === 'card-activation-otp') {
                                            if (/^\d{0,6}$/.test(value)) setCardActivationOTP(value);
                                          }
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            if (msg.data.input.id === 'mobile-otp') {
                                              handleVerifyMobileOTP();
                                            } else if (msg.data.input.id === 'aadhaar-otp') {
                                              handleVerifyAadhaarOTP();
                                            } else if (msg.data.input.id === 'cc-aadhaar-otp') {
                                              handleVerifyAadhaarOTPCredit();
                                            } else if (msg.data.input.id === 'pl-aadhaar-otp') {
                                              handleVerifyAadhaarOTPLoan();
                                            } else if (msg.data.input.id === 'card-activation-otp') {
                                              handleVerifyCardOTP();
                                            }
                                          }
                                        }}
                                        maxLength={msg.data.input.maxLength || (msg.data.input.type === 'otp' ? 6 : undefined)}
                                        className="text-center text-lg tracking-widest font-mono text-[#111827] focus-visible:ring-[#42265e]/20 focus-visible:border-[#42265e]"
                                        autoFocus
                                      />
                                    </div>
                                  )}
                                </div>
                                {msg.actions && msg.actions.length > 0 && (
                                  <div className="p-2 bg-white/50 dark:bg-gray-800/50 border-t border-dashboard-primary/20 dark:border-blue-800 flex flex-wrap gap-2">
                                    {msg.actions.map((action: any, i: number) => (
                                      <Button 
                                        key={i}
                                        onClick={() => {
                                          if (action.action === 'verify-mobile-otp') handleVerifyMobileOTP();
                                          else if (action.action === 'verify-aadhaar-otp') handleVerifyAadhaarOTP();
                                          else if (action.action === 'schedule-vkyc-slot1') handleScheduleVKYC('schedule-vkyc-slot1');
                                          else if (action.action === 'schedule-vkyc-slot2') handleScheduleVKYC('schedule-vkyc-slot2');
                                          else if (action.action === 'schedule-vkyc-later') handleScheduleVKYC('schedule-vkyc-later');
                                          else if (action.action === 'confirm-preferences') handleConfirmPreferences();
                                          else if (action.action === 'email-details') handleEmailAccountDetails();
                                          else if (action.action === 'activate-vcard') handleActivateVirtualCard();
                                          else if (action.action === 'verify-card-details') handleVerifyCardDetails();
                                          else if (action.action === 'verify-card-otp') handleVerifyCardOTP();
                                          else if (action.action === 'finalize-card-activation') handleFinalizeCardActivation();
                                          else if (action.action === 'request-salary-account') handleRequestSalaryAccount();
                                          else if (action.action === 'view-credit-offers') handleViewCreditOffers();
                                          else if (action.action === 'setup-autopay-salary-account') handleSetupAutopay('salary-account');
                                          else if (action.action === 'setup-autopay-upi') handleSetupAutopay('upi');
                                          else if (action.action === 'verify-cc-aadhaar-otp') handleVerifyAadhaarOTPCredit();
                                          else if (action.action === 'consent-bureau-pull') handleConsentBureauPull();
                                          else if (action.action === 'verify-pl-aadhaar-otp') handleVerifyAadhaarOTPLoan();
                                          else if (action.action === 'consent-pl-bureau-pull') handlePLConsentBureauPull();
                                          else if (action.action === 'setup-pl-enach-account') handleSetupPLEnach('account');
                                          else if (action.action === 'setup-pl-enach-upi') handleSetupPLEnach('upi');
                                        }}
                                        variant={action.variant === 'ghost' ? 'outline' : 'default'}
                                        className={`flex-1 text-xs h-8 ${
                                          action.variant === 'ghost'
                                            ? 'border-dashboard-primary/30 text-[#42265e] bg-white hover:bg-[#F0EBF4]'
                                            : 'bg-[#42265e] hover:bg-[#2e1a42] text-white'
                                        }`}
                                      >
                                        {formatText(action.label)}
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {msg.type === 'confirmation' && msg.data && (
                          <div className="flex justify-start">
                            <div className="max-w-[85%] w-full">
                              <Card className="border border-dashboard-primary/20 dark:border-gray-700 shadow-sm overflow-hidden rounded-lg">
                                <div className="bg-dashboard-primary p-4">
                                  <h4 className="font-semibold text-sm text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {msg.data.title}
                                  </h4>
                                </div>
                                <div className="p-4 space-y-2">
                                  {msg.data.fields.map((field: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between py-2 px-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                      <div className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 w-28">{field.label}</span>
                                        <span className="text-xs font-medium text-gray-900 dark:text-white">{field.value}</span>
                                      </div>
                                      {field.verified ? (
                                        <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] h-5">
                                          <svg className="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                          </svg>
                                          Verified
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px] h-5">
                                          Pending
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t">
                                  <Button 
                                    onClick={() => {
                                      if (msg.data.action === 'confirm-health') {
                                        handleConfirmHealth();
                                      } else if (msg.data.action === 'confirm-card-details') {
                                        handleConfirmCardDetails();
                                      } else if (msg.data.action === 'confirm-applicant-details') {
                                        handleConfirmApplicantDetails();
                                      } else if (msg.data.action === 'confirm-pl-applicant-details') {
                                        handlePLConfirmApplicantDetails();
                                      } else if (msg.data.action === 'confirm-credit-card-application') {
                                        handleConfirmCreditCardApplication();
                                      } else if (msg.data.action === 'confirm-pl-submit') {
                                        handleConfirmPLSubmit();
                                      } else if (msg.data.action === 'verify-mobile-otp') {
                                        handleVerifyMobileOTP();
                                      } else if (msg.data.action === 'verify-pan-aadhaar') {
                                        handleVerifyPanAadhaar();
                                      } else if (msg.data.action === 'verify-aadhaar-otp') {
                                        handleVerifyAadhaarOTP();
                                      } else if (msg.data.action === 'confirm-preferences') {
                                        handleConfirmPreferences();
                                      }
                                    }}
                                    className="w-full h-9 text-sm bg-[#42265e] hover:bg-[#2e1a42] text-white"
                                    variant="default"
                                  >
                                    Confirm & Continue →
                                  </Button>
                                </div>
                              </Card>
                            </div>
                          </div>
                        )}


                        {msg.type === 'journey-step' && msg.data && (
                          <div className="flex justify-start">
                            <div className="max-w-[85%] w-full">
                              <Card className="border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden rounded-lg">
                                <div className="bg-dashboard-primary p-4">
                                  <div className="flex items-center space-x-2">
                                    {msg.data.cardOptions ? (
                                      <CreditCard className="w-4 h-4 text-white" />
                                    ) : (
                                      <Banknote className="w-4 h-4 text-white" />
                                    )}
                                    <h4 className="font-semibold text-sm text-white">{msg.data.title}</h4>
                                  </div>
                                  {msg.data.highlight && (
                                    <div className="text-2xl font-bold text-white mt-1">{msg.data.highlight}</div>
                                  )}
                                </div>
                                <div className="p-4">
                                  {msg.data.details && (
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                      {msg.data.details.map((detail: any, i: number) => (
                                        <div key={i} className="flex items-start space-x-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                          {renderDetailIcon(detail.label)}
                                          <div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{detail.label}</p>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{detail.value}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {msg.data.options && (
                                    <div className="space-y-2 mb-4">
                                      <p className="text-xs font-semibold text-gray-600 mb-2">Choose your plan:</p>
                                      {msg.data.options.map((option: any, i: number) => (
                                        <button
                                          key={i}
                                          onClick={() => {
                                            if (msg.data.action === 'select-loan') {
                                              handleSelectLoan(option.label);
                                            }
                                          }}
                                          className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 rounded-lg transition-all hover:shadow-sm group"
                                        >
                                          <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                                            <Banknote className="w-4 h-4 text-gray-500" />
                                            <span>{option.label}</span>
                                          </span>
                                          <div className="flex items-center space-x-2">
                                            <Timer className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{option.emi}</span>
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  {msg.data.cardOptions && (
                                    <div className="space-y-3 mb-4">
                                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Choose your card:</p>
                                      {msg.data.cardOptions.map((card: any, i: number) => (
                                        <button
                                          key={i}
                                          onClick={() => {
                                            if (msg.data.action === 'select-credit-card-offer') {
                                              handleSelectCreditCardOffer(card.name);
                                            } else {
                                              handleSelectCard(card.name);
                                            }
                                          }}
                                          className="w-full text-left p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 border-2 border-gray-200 dark:border-gray-700 hover:border-dashboard-primary/40 dark:hover:border-blue-500 rounded-xl transition-all hover:shadow-lg group"
                                        >
                                          <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                              <div className="h-8 w-8 rounded-md bg-dashboard-primary flex items-center justify-center text-white">
                                                <CreditCard className="w-4 h-4" />
                                              </div>
                                            <div>
                                              <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{card.name}</h5>
                                              <p className="text-xs text-gray-600 dark:text-gray-400">{card.limit} • {card.fee}</p>
                                              </div>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-dashboard-primary dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                          </div>
                                          <div className="space-y-1">
                                            {card.benefits.map((benefit: string, j: number) => (
                                              <div key={j} className="flex items-start space-x-2">
                                                <Check className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-xs text-gray-700 dark:text-gray-300">{benefit}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  {msg.data.sections && (
                                    <div className="space-y-4">
                                      {msg.data.sections.map((section: any, i: number) => (
                                        <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                                          <h5 className="font-semibold text-sm text-green-800 mb-3">{section.name}</h5>
                                          <div className="space-y-2">
                                            {section.items.map((item: any, j: number) => (
                                              <div key={j} className="flex items-center justify-between text-xs">
                                                <span className="text-gray-700">{item.name}</span>
                                                <div className="flex items-center space-x-2">
                                                  <span className="font-semibold text-gray-900">{item.amount}</span>
                                                  <span className="text-gray-500">• {item.returns}</span>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                      
                                      {msg.data.summary && (
                                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg p-4 mt-4">
                                          <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                              <p className="text-xs opacity-90">Investment</p>
                                              <p className="text-lg font-bold">{msg.data.summary.totalInvestment}</p>
                                            </div>
                                            <div>
                                              <p className="text-xs opacity-90">Tax Saved</p>
                                              <p className="text-lg font-bold">{msg.data.summary.taxSaved}</p>
                                            </div>
                                            <div>
                                              <p className="text-xs opacity-90">Returns</p>
                                              <p className="text-lg font-bold">{msg.data.summary.additionalReturns}</p>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {msg.data.action === 'start-investments' && (
                                        <div className="mt-4">
                                          <Button 
                                            onClick={handleStartTaxInvestments}
                                            className="w-full bg-[#42265e] hover:bg-[#2e1a42] text-white"
                                            variant="default"
                                          >
                                            Start Tax-Saving Investments
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                          </Button>
                                        </div>
                                      )}

                                      {msg.data.action === 'purchase-insurance' && (
                                        <div className="mt-4">
                                          <Button 
                                            onClick={handlePurchaseInsurance}
                                            className="w-full bg-[#42265e] hover:bg-[#2e1a42] text-white"
                                            variant="default"
                                          >
                                            Purchase Insurance Package
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {msg.data.allocation && (
                                    <div className="space-y-3">
                                      {msg.data.allocation.map((item: any, i: number) => (
                                        <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white">
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-gray-900">{item.category}</span>
                                            <span className="text-sm font-bold text-dashboard-primary">{item.amount}</span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                            <span>Risk: {item.risk}</span>
                                            <span>Returns: {item.returns}</span>
                                          </div>
                                          <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                              className="bg-gradient-to-r from-dashboard-primary to-[#2e1a42] h-2 rounded-full transition-all duration-1000"
                                              style={{ width: `${item.percentage}%` }}
                                            ></div>
                                          </div>
                                        </div>
                                      ))}
                                      
                                      {msg.data.projections && (
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 mt-4">
                                          <h5 className="font-semibold text-sm text-purple-900 mb-3">Wealth Projection</h5>
                                          <div className="grid grid-cols-2 gap-3">
                                            {msg.data.projections.map((proj: any, i: number) => (
                                              <div key={i} className="text-center p-2 bg-white rounded-lg">
                                                <p className="text-xs text-gray-600">Year {proj.year}</p>
                                                <p className="text-lg font-bold text-purple-700">{proj.amount}</p>
                                                <p className="text-xs text-green-600">+{proj.returns}</p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {msg.data.action === 'start-sip' && (
                                        <div className="mt-4">
                                          <Button 
                                            onClick={handleStartSIP}
                                            className="w-full bg-[#42265e] hover:bg-[#2e1a42] text-white"
                                            variant="default"
                                          >
                                            Start SIP Investment
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </Card>
                            </div>
                          </div>
                        )}

                        {msg.type === 'success' && msg.data && (
                          <div className="flex justify-start">
                            <div className="max-w-[80%] w-full">
                              <Card className="border border-green-200 dark:border-green-800 shadow-sm overflow-hidden animate-scaleIn rounded-lg">
                                <div className="bg-dashboard-primary p-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-base text-white">{formatText(msg.data.title)}</h4>
                                      {msg.data.applicationNumber && (
                                        <p className="text-xs text-white/90 mt-0.5">
                                          Ref: <span className="font-mono font-semibold">{msg.data.applicationNumber}</span>
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="p-4">
                                  {msg.data.details && msg.data.details.length > 0 && (
                                    <div className="grid grid-cols-1 gap-2 mb-3">
                                      {msg.data.details.slice(0, 4).map((detail: string, i: number) => (
                                        <div key={i} className="flex items-start space-x-2 text-xs">
                                          <span className="text-dashboard-primary mt-0.5">•</span>
                                          <span className="text-gray-700 dark:text-gray-300">{formatText(detail)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {msg.data.nextSteps && msg.data.nextSteps.length > 0 && (
                                    <div className="bg-[#F0EBF4] dark:bg-gray-700 rounded-lg p-3 border border-dashboard-primary/20 dark:border-gray-600">
                                      <p className="text-xs font-semibold text-[#2e1a42] dark:text-blue-100 mb-2">What's Next?</p>
                                      <div className="space-y-1.5">
                                        {msg.data.nextSteps.slice(0, 3).map((step: string, i: number) => (
                                          <div key={i} className="flex items-start space-x-2 text-xs">
                                            <span className="text-dashboard-primary dark:text-blue-400 font-bold mt-0.5">{i + 1}.</span>
                                            <span className="text-gray-700 dark:text-gray-300">{formatText(step)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </Card>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                {/* Quick Replies removed per UX preference; inline actions remain in messages */}
                <div className="flex items-center space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask me anything..."
                    className="flex-1 text-sm h-10"
                    disabled={isThinking}
                  />
                  <Button 
                    id="send-btn"
                    onClick={handleSend} 
                    disabled={!inputValue.trim() || isThinking}
                    className="h-10 px-4 bg-dashboard-primary hover:bg-dashboard-primary-dark text-white"
                  >
                    {isThinking ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

              {/* Right Sidebar - Task Progress (Conditional) */}
              {(messages.length > 0 || activeJourney || journeySteps.length > 0) && (
                <div className="w-80 h-full bg-gradient-to-b from-white to-[#F0EBF4] dark:from-gray-900 dark:to-gray-800 overflow-y-auto rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 sticky top-0 z-10 bg-dashboard-primary text-white shadow">
                    <h3 className="font-semibold text-sm text-white flex items-center">
                      <svg className="w-5 h-5 mr-2 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Task Progress
                    </h3>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Active Journey Indicator */}
                    {activeJourney && (
                      <Card className="p-4 bg-[#42265e] border-0 shadow-sm rounded-lg animate-fadeIn">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white/80 mb-1">In Progress</p>
                            <p className="text-sm font-semibold text-white leading-snug">
                              {journeyTemplates.find(t => t.id === activeJourney)?.title || 'Processing...'}
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}

                {/* Detailed Journey Steps */}
                {journeySteps.length > 0 && (
                  <Card className="p-4 bg-white ring-1 ring-gray-200 rounded-lg shadow-sm">
                    <h4 className="text-xs font-semibold text-[#111827] mb-3">Step-by-Step Progress</h4>
                    <div className="space-y-3">
                      {journeySteps.map((step, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {step.status === 'completed' ? (
                              <div className="w-5 h-5 bg-[#42265e] rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : step.status === 'in-progress' ? (
                              <div className="w-5 h-5 bg-[#c84417] rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              </div>
                            ) : (
                              <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold ${
                              step.status === 'completed' ? 'text-[#42265e]' :
                              step.status === 'in-progress' ? 'text-[#111827]' :
                              'text-gray-500'
                            }`}>
                              {step.label}
                            </p>
                            <p className={`text-xs mt-0.5 ${
                              step.status === 'completed' ? 'text-[#42265e]/70' :
                              step.status === 'in-progress' ? 'text-[#c84417]' :
                              'text-gray-400'
                            }`}>
                              {step.status === 'completed' ? '✓ Done' : 
                               step.status === 'in-progress' ? 'In Progress...' : 
                               'Pending'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Completed Tasks from Messages */}
                {messages.filter(m => m.type === 'success').map((msg, idx) => (
                  <Card key={idx} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 ring-1 ring-green-200/60 dark:ring-green-800/60 rounded-lg animate-fadeIn">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-dashboard-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-green-900 dark:text-green-100 mb-1">Completed</p>
                        <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                          {msg.data?.title?.replace(/[🎉✅]/g, '').trim() || 'Task Completed'}
                        </p>
                        {msg.data?.accountNumber && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-mono">
                            {msg.data.accountNumber}
                          </p>
                        )}
                        {msg.data?.applicationNumber && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-mono">
                            {msg.data.applicationNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }

          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }

          .animate-scaleIn {
            animation: scaleIn 0.4s ease-out;
          }
        `}</style>
    </div>
  );
}
