/* src/app/context/JourneyContext.tsx */

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from "react";
import { ALL_STEPS, STEP_COMPONENTS, makeJourneyStepId } from "./stepDefinitions";
import type { Step, UserType, JourneyType } from "./stepDefinitions";
import { useJourneyConfig } from "./JourneyConfigContext";
import {
  type LoanJourneyResumeBundle,
  loanJourneyBundleKey,
  salaryJourneyBundleKey,
} from "@/lib/employeeJourneyHub";


// --- 1. Types ---
export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "agent" | "user";
  content: string;
  timestamp: string;
}

interface JourneyState {
  userType: UserType;
  journeyType: JourneyType | null;
  currentStepIndex: number;
  journeySteps: Step[];
  CurrentStepComponent: React.ComponentType;
  currentBranchComponent: React.ComponentType | null;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepId: string) => void;
  setUserType: (type: UserType) => void;
  setJourneyType: (type: JourneyType) => void;
  setNomineeEnabled: (enabled: boolean) => void;
  switchToPhysicalKycFlow: () => void;
  switchToDigitalKycFlow: () => void;
  bottomBarContent: React.ReactNode | null;
  setBottomBarContent: (content: React.ReactNode | null) => void;
  resetJourney: () => void;
  notifications: Notification[];
  addNotification: (title: string, body: string) => void;
  clearNotifications: () => void;
  formData: Record<string, any>;
  prefilledData: Record<string, any>;
  baselineData: Record<string, any>;
  changedFields: string[];
  updateFormData: (data: Record<string, any>) => void;
  isResumeFlow: boolean;
  resumeTargetStepIndex: number | null;
  chatMessages: ChatMessage[];
  sendMessage: (content: string) => void;
  showDashboard: boolean;
  setShowDashboard: (show: boolean) => void;
  error: { title: string; message: string; module?: string } | null;
  setError: (error: { title: string; message: string; module?: string } | null) => void;
  startJourney: (
    type: JourneyType,
    prefilledData?: Record<string, any>,
    startStepId?: string,
    loanResumeBundle?: LoanJourneyResumeBundle | null
  ) => void;
  showModeSelection: boolean;
  pendingInviteData: { journeyType: JourneyType; prefilledData: Record<string, any> } | null;
  prepareForModeSelection: (journeyType: JourneyType, prefilledData: Record<string, any>) => void;
  selectJourneyMode: (mode: "conversational" | "form") => void;
}

// --- 2. Journey Logic ---
const getInitialStepsForJourney = (
  journeyType: JourneyType,
  journeyConfig?: {
    showPreApprovedOffersBeforeVideoKyc?: boolean;
    journeyStepOrder?: Record<string, string[]>;
  } | null
): Step[] => {
  let stepIds: string[] = [];

  switch (journeyType) {
    // ── Salary Account Opening journeys ───────────────────────────────────
    case "ntb":
      stepIds = [
        makeJourneyStepId("ntb", "welcome"),
        makeJourneyStepId("ntb", "kycChoice"),
        makeJourneyStepId("ntb", "ekycHandler"),
        makeJourneyStepId("ntb", "profileDetails"),
        makeJourneyStepId("ntb", "incomeAndNominee"),
        makeJourneyStepId("ntb", "reviewApplication"),
        makeJourneyStepId("ntb", "videoKyc"),
        makeJourneyStepId("ntb", "complete"),
      ];
      break;
    case "ntb-conversion":
      stepIds = [
        makeJourneyStepId("ntb-conversion", "welcome"),
        makeJourneyStepId("ntb-conversion", "kycChoice"),
        makeJourneyStepId("ntb-conversion", "profileDetails"),
        makeJourneyStepId("ntb-conversion", "incomeAndNominee"),
        makeJourneyStepId("ntb-conversion", "reviewApplication"),
        makeJourneyStepId("ntb-conversion", "complete"),
      ];
      break;
    case "etb-nk":
      stepIds = [
        makeJourneyStepId("etb-nk", "welcome"),
        makeJourneyStepId("etb-nk", "ekycHandler"),
        makeJourneyStepId("etb-nk", "kycChoice"),
        makeJourneyStepId("etb-nk", "etbIncomeDeclarations"),
        makeJourneyStepId("etb-nk", "conversionVerification"),
        makeJourneyStepId("etb-nk", "complete"),
      ];
      break;
    case "etb":
      stepIds = [
        makeJourneyStepId("etb", "welcome"),
        makeJourneyStepId("etb", "autoConversion"),
        makeJourneyStepId("etb", "etbIncomeDeclarations"),
        makeJourneyStepId("etb", "conversionVerification"),
        makeJourneyStepId("etb", "complete"),
      ];
      break;
    // ── Personal Loan + modular loan placeholders (same step structure) ───
    case "personal-loan":
    case "auto-loan":
    case "education-loan":
      stepIds = [
        makeJourneyStepId(journeyType, "mahindraLogin"),
        makeJourneyStepId(journeyType, "mahindraTncSelection"),
        makeJourneyStepId(journeyType, "mahindraLoanCustomization"),
        makeJourneyStepId(journeyType, "mahindraDigitalKyc"),
        makeJourneyStepId(journeyType, "mahindraEMandate"),
        makeJourneyStepId(journeyType, "mahindraFinalPreview"),
        makeJourneyStepId(journeyType, "mahindraAgreement"),
        makeJourneyStepId(journeyType, "complete"),
        // DAV steps follow if needed, but usually we want to finish PL first
        makeJourneyStepId(journeyType, "avConsent"),
        makeJourneyStepId(journeyType, "avWelcome"),
        makeJourneyStepId(journeyType, "avStatus"),
        makeJourneyStepId(journeyType, "avType"),
        makeJourneyStepId(journeyType, "avRequirements"),
        makeJourneyStepId(journeyType, "avLocationAccess"),
        makeJourneyStepId(journeyType, "avVerifyingLocation"),
        makeJourneyStepId(journeyType, "avCaptureExterior"),
        makeJourneyStepId(journeyType, "avAddressProof"),
        makeJourneyStepId(journeyType, "avIdVerification"),
        makeJourneyStepId(journeyType, "avFaceVerification"),
        makeJourneyStepId(journeyType, "avComplete"),
      ];
      break;
    case "address-verification":
      stepIds = [
        makeJourneyStepId("address-verification", "avConsent"),
        makeJourneyStepId("address-verification", "avWelcome"),
        makeJourneyStepId("address-verification", "avStatus"),
        makeJourneyStepId("address-verification", "avType"),
        makeJourneyStepId("address-verification", "avRequirements"),
        makeJourneyStepId("address-verification", "avLocationAccess"),
        makeJourneyStepId("address-verification", "avVerifyingLocation"),
        makeJourneyStepId("address-verification", "avCaptureExterior"),
        makeJourneyStepId("address-verification", "avCaptureInterior1"),
        makeJourneyStepId("address-verification", "avCaptureInterior2"),
        makeJourneyStepId("address-verification", "avAdditionalPhoto"),
        makeJourneyStepId("address-verification", "avAddressProof"),
        makeJourneyStepId("address-verification", "avIdVerification"),
        makeJourneyStepId("address-verification", "avFaceVerification"),
        makeJourneyStepId("address-verification", "avComplete"),
      ];
      break;
    default:
      // Default to personal-loan if anything else is requested
      stepIds = [
        makeJourneyStepId("personal-loan", "verifyDetails"),
        makeJourneyStepId("personal-loan", "bureauConsent"),
        makeJourneyStepId("personal-loan", "selectPlan"),
        makeJourneyStepId("personal-loan", "kycVerification"),
        makeJourneyStepId("personal-loan", "disbursalAccount"),
        makeJourneyStepId("personal-loan", "enachSetup"),
        makeJourneyStepId("personal-loan", "submitApplication"),
        makeJourneyStepId("personal-loan", "complete"),
      ];
      break;
  }

  return stepIds.map(id => ALL_STEPS[id]).filter(Boolean);
};

const getInitialStepsForUserType = (userType: UserType, journeyConfig?: { showPreApprovedOffersBeforeVideoKyc?: boolean } | null): Step[] => {
  return getInitialStepsForJourney("ntb", journeyConfig);
};

// --- 3. Context & Provider ---
const JourneyContext = createContext<JourneyState | undefined>(undefined);

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const LOCAL_STORAGE_PREFIX = "hdfcJourney_";

export const JourneyProvider = ({ children }: { children: ReactNode }) => {
  const { config: journeyConfig } = useJourneyConfig();
  const [userType, _setUserType] = useState<UserType>("ntb");
  const [journeyType, _setJourneyType] = useState<JourneyType | null>(null);
  const [currentStepIndex, _setCurrentStepIndex] = useState(0);
  const [journeySteps, _setJourneySteps] = useState<Step[]>([]);
  const [showDashboard, setShowDashboard] = useState(true);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [currentBranchComponent, _setCurrentBranchComponent] = useState<React.ComponentType | null>(null);
  const [bottomBarContent, setBottomBarContent] = useState<React.ReactNode | null>(null);
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [pendingInviteData, setPendingInviteData] = useState<{ journeyType: JourneyType; prefilledData: Record<string, any> } | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "initial",
      title: "AU Bank",
      body: "Welcome! Start your premium account journey now.",
      timestamp: "Just now"
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const sendMessage = useCallback((content: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);

    // Simple simulated agent response
    setTimeout(() => {
      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: `I've received your message: "${content}". How else can I help you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, agentMsg]);
    }, 1000);
  }, []);

  const addNotification = useCallback((title: string, body: string) => {
    const newNotif = {
      id: Date.now().toString(),
      title,
      body,
      timestamp: "Just now"
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const DEMO_FORM_DATA: Record<string, any> = {
    name: "Demo User",
    mobileNumber: "9934090013",
    dob: "1990-05-15",
    corporatePan: "",
    gstNumber: "",
    email: "demo@example.com",
    fatherName: "Demo Father",
    motherName: "Demo Mother",
    maritalStatus: "married",
    currentAddress: "123, Demo Street, Block C, New Delhi, Delhi 110016",
    permanentAddressLine1: "123, Demo Street",
    permanentAddressLine2: "Block C",
    permanentAddressCity: "New Delhi",
    permanentAddressState: "Delhi",
    permanentAddressPincode: "110016",
    sameAsPermanentAddress: true,
    incomeRange: "10-15L",
    usesPrimaryEmailForComms: true,
    communicationEmail: "",
    wantsNominee: false,
    nominees: [],
    isPep: false,
    isIndianNational: true,
    isTaxResidentIndiaOnly: true,
    ekycUidaiConsent: true,
    vkycConsent: false,
    vkycPresentInIndia: false,
    autoConvertConsent: null,
    autoConvertStatus: "idle",
    cif: "192837465",
    accountNumber: "XXXXXXXX1234",
    ifscCode: "IDFB0040101",
    branchName: "Mumbai Main",
    aadhaarNumber: "",
    // AU salary account fields
    employeeId: "EMP001234",
    companyName: "Corporate India Ltd",
    department: "Engineering",
    monthlySalary: "₹85,000",
    annualIncome: "₹10,20,000",
    salaryAccount: "XXXXXXXX1234",
    loanAmount: "1000000",
    loanTenure: "36",
    emi: "33200",
    otp: "123456",
    employerConsent: false,
    languageConsent: false,
    notPEP: false,
    incomeConsent: false,
  };

  const [formData, _setFormData] = useState<Record<string, any>>({});
  const [prefilledData, setPrefilledData] = useState<Record<string, any>>({});
  const [baselineData, setBaselineData] = useState<Record<string, any>>({});
  const [changedFields, setChangedFields] = useState<string[]>([]);

  const areValuesEqual = useCallback((a: any, b: any) => {
    if (typeof a === "object" || typeof b === "object") {
      try {
        return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
      } catch {
        return false;
      }
    }
    return a === b;
  }, []);

  const updateFormData = useCallback((newData: Record<string, any>) => {
    _setFormData(prev => {
      const updated = { ...prev, ...newData };
      setChangedFields(prevChanged => {
        const next = new Set(prevChanged);
        Object.keys(newData).forEach((key) => {
          if (areValuesEqual(updated[key], baselineData[key])) {
            next.delete(key);
          } else {
            next.add(key);
          }
        });
        const list = Array.from(next);
        if (typeof window !== 'undefined') {
          localStorage.setItem(`${LOCAL_STORAGE_PREFIX}changedFields`, JSON.stringify(list));
        }
        return list;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}formData`, JSON.stringify(updated));
      }
      return updated;
    });
  }, [areValuesEqual, baselineData]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isResumeFlow, setIsResumeFlow] = useState(false);
  const [resumeTargetStepIndex, setResumeTargetStepIndex] = useState<number | null>(null);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const [stepHistory, _setStepHistory] = useState<number[]>([]);

  const setStepHistory = useCallback(
    (updater: number[] | ((prev: number[]) => number[])) => {
      _setStepHistory((prev) => {
        const next = typeof updater === "function" ? (updater as (p: number[]) => number[])(prev) : updater;
        if (typeof window !== "undefined") {
          localStorage.setItem(`${LOCAL_STORAGE_PREFIX}stepHistory`, JSON.stringify(next));
        }
        return next;
      });
    },
    []
  );

  // --- State-setting functions ---
  const setJourneySteps = useCallback((steps: Step[]) => {
    _setJourneySteps(steps);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}journeySteps`, JSON.stringify(steps));
    }
  }, []);

  const setStepIndex = useCallback((index: number) => {
    _setCurrentStepIndex(index);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}stepIndex`, index.toString());
      // Also save with employeeId if we have one to support multi-user resume
      const empId = formData.employeeId;
      if (empId) {
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}stepIndex_${empId}`, index.toString());
      }
    }
  }, [formData.employeeId]);

  // --- THIS IS THE FIX ---
  // We MUST wrap the `component` in a function `() => component`
  // to prevent React from executing it.
  const setBranchComponent = useCallback((component: React.ComponentType | null) => {
    _setCurrentBranchComponent(() => component); // <-- THIS LINE IS THE FIX

    if (typeof window !== 'undefined') {
      const stepId = Object.keys(STEP_COMPONENTS).find(key => STEP_COMPONENTS[key] === component);
      if (stepId) {
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}branchStepId`, stepId);
      } else {
        localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}branchStepId`);
      }
    }
  }, []);

  // Nominee is captured inline within Personal Details (no separate step).
  const setNomineeEnabled = useCallback((enabled: boolean) => {
    updateFormData({ wantsNominee: enabled });
  }, [updateFormData]);

  const switchToPhysicalKycFlow = useCallback(() => {
    if (!journeyType) return;
    // Physical KYC ends the journey immediately on the KYC selection step.
    // We truncate the journey to the steps completed so far.
    const steps = ["welcome", "kycChoice", "physicalKyc"]
      .map((id) => makeJourneyStepId(journeyType, id))
      .map(id => ALL_STEPS[id])
      .filter(Boolean);
    setJourneySteps(steps);
    setStepIndex(Math.max(0, steps.length - 1));
    setStepHistory([]);
    setBranchComponent(null);
  }, [journeyType, setJourneySteps, setStepIndex, setStepHistory, setBranchComponent]);

  const switchToDigitalKycFlow = useCallback(() => {
    if (!journeyType) return;
    const base = getInitialStepsForJourney(journeyType, journeyConfig);
    setJourneySteps(base);
    // After KYC choice, proceed to next logical step (ekycHandler or profileDetails depending on journey)
    const kycIndex = base.findIndex(s => s.id === makeJourneyStepId(journeyType, "kycChoice"));
    setStepIndex(kycIndex !== -1 ? kycIndex + 1 : 0);
    setStepHistory([]);
    setBranchComponent(null);
  }, [journeyType, journeyConfig, setJourneySteps, setStepIndex, setStepHistory, setBranchComponent]);

  const setUserType = useCallback((type: UserType) => {
    _setUserType(type);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}userType`, type);
    }
    const newSteps = getInitialStepsForUserType(type, journeyConfig);
    setJourneySteps(newSteps);
    setStepIndex(0);
    setBranchComponent(null); // Reset branch
  }, [journeyConfig, setJourneySteps, setStepIndex, setBranchComponent]);

  const setJourneyType = useCallback((type: JourneyType) => {
    // Only update and reset if the journey type is actually changing
    // or if we haven't selected one yet.
    if (journeyType === type) {
      return;
    }

    _setJourneyType(type);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}journeyType`, type);
    }
    const newSteps = getInitialStepsForJourney(type, journeyConfig);
    setJourneySteps(newSteps);
    setStepIndex(0);
    setBranchComponent(null);
  }, [journeyType, journeyConfig, setJourneySteps, setStepIndex, setBranchComponent]);

  const resetJourney = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}userType`);
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}journeyType`);
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}stepIndex`);
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}journeySteps`);
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}branchStepId`);
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}formData`);
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}prefilledData`);
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}baselineData`);
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}changedFields`);
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}stepHistory`);
    }
    _setUserType("ntb");
    _setJourneyType("personal-loan");
    _setFormData({});
    setPrefilledData({});
    setBaselineData({});
    setChangedFields([]);
    _setStepHistory([]);
    const newSteps = getInitialStepsForJourney("personal-loan", journeyConfig);
    _setJourneySteps(newSteps);
    _setCurrentStepIndex(0);
    setBranchComponent(null); // Reset branch
    setBottomBarContent(null);
  }, [journeyConfig, setBranchComponent]);

  // --- Inactivity Timer Logic ---
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(resetJourney, INACTIVITY_TIMEOUT_MS);
  }, [resetJourney]);

  useEffect(() => {
    if (!isInitialized) return;
    const events = ["mousemove", "keydown", "click", "touchstart"];
    const handleActivity = () => resetInactivityTimer();
    events.forEach(event => window.addEventListener(event, handleActivity));
    resetInactivityTimer();
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [isInitialized, resetInactivityTimer]);

  // --- Session Resume Logic ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // If opened via RM Invite or specifically for personal-loan, do not restore any saved session; let page.tsx start the journey
        const pendingInvite = localStorage.getItem('pendingInvite');
        const plLikeMatch = window.location.pathname.match(/\/journey\/(personal-loan|auto-loan|education-loan)/);
        const plLikeType = (plLikeMatch?.[1] || "") as JourneyType | undefined;
        
        if (pendingInvite || plLikeType) {
          if (plLikeType && ["personal-loan", "auto-loan", "education-loan"].includes(plLikeType)) {
            _setJourneyType(plLikeType);
            _setJourneySteps(getInitialStepsForJourney(plLikeType, journeyConfig));
          }
          setIsInitialized(true);
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const isResumeUrl = params.get('resume') === 'true';
        if (isResumeUrl) setIsResumeFlow(true);

        const savedUserType = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}userType`) as UserType | null;
        const savedJourneyType = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}journeyType`) as JourneyType | null;
        const savedStepIndex = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}stepIndex`);
        const savedJourneySteps = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}journeySteps`);
        const savedBranchStepId = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}branchStepId`);
        const savedFormData = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}formData`);
        const savedPrefilledData = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}prefilledData`);
        const savedBaselineData = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}baselineData`);
        const savedChangedFields = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}changedFields`);
        const savedStepHistory = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}stepHistory`);

        if (savedUserType && savedStepIndex !== null && savedJourneySteps) {
          const rawSteps = JSON.parse(savedJourneySteps) as Step[];
          
          // CRITICAL: Check if we are explicitly on a specialized URL. 
          // If so, IGNORE the saved session and start fresh to avoid loading the "old" journey.
          const path = typeof window !== 'undefined' ? window.location.pathname : '';
          const plLikeFromPath = path.match(/\/journey\/(personal-loan|auto-loan|education-loan)/);
          const isPLLikeUrl = !!plLikeFromPath;
          const isAVUrl = path.includes('/journey/address-verification');
          
          if (isPLLikeUrl || isAVUrl) {
            const type = (plLikeFromPath?.[1] || "address-verification") as JourneyType;
            
            // If explicitly on AV URL, but we have saved PL data, we might be coming from a hard reload
            // but we want to ensure we stay on AV.
            _setJourneyType(type);
            _setJourneySteps(getInitialStepsForJourney(type, journeyConfig));
            
            // Only clear index if it's potentially from a different journey type
            if (savedJourneyType !== type) {
              _setCurrentStepIndex(0);
              if (typeof window !== 'undefined') {
                localStorage.setItem(`${LOCAL_STORAGE_PREFIX}stepIndex`, "0");
                localStorage.setItem(`${LOCAL_STORAGE_PREFIX}journeyType`, type);
              }
            }

            if (savedFormData) {
              const parsedForm = JSON.parse(savedFormData);
              _setFormData(parsedForm);
              setBaselineData(parsedForm);
            }
            
            setChangedFields([]);
            setIsInitialized(true);
            return;
          }

          // Migration: remove the old VCIP consent step if present.
          let parsedSteps = rawSteps.filter(
            (s) =>
              s?.id !== "kycDetails" &&
              s?.id !== "nomineeDetails" &&
              !String(s?.id || "").endsWith(":kycDetails") &&
              !String(s?.id || "").endsWith(":nomineeDetails")
          );
          const parsedIndex = parseInt(savedStepIndex, 10);

          if (parsedSteps.length > 0 && parsedIndex < parsedSteps.length) {
            _setUserType(savedUserType);
            if (savedJourneyType) _setJourneyType(savedJourneyType);

            // Migration: ensure ETB matches latest flow.
            let upgradedIndex: number | null = null;
            if (savedJourneyType === "etb") {
              const upgraded = getInitialStepsForJourney("etb", journeyConfig);
              const hasBase = (baseId: string) =>
                parsedSteps.some((step) => step?.id === baseId || String(step?.id || "").endsWith(`:${baseId}`));
              const needsUpgrade =
                !hasBase("conversionVerification") ||
                hasBase("reviewApplication") ||
                !hasBase("autoConversion") ||
                !hasBase("etbIncomeDeclarations");
              if (needsUpgrade) {
                const currentId = parsedSteps[parsedIndex]?.id;
                upgradedIndex = currentId ? upgraded.findIndex((step) => step.id === currentId) : -1;
                parsedSteps = upgraded;
              }
            }
            if (savedJourneyType === "etb-nk") {
              const upgraded = getInitialStepsForJourney("etb-nk", journeyConfig);
              const hasBase = (baseId: string) =>
                parsedSteps.some((step) => step?.id === baseId || String(step?.id || "").endsWith(`:${baseId}`));
              const needsUpgrade = !hasBase("etbIncomeDeclarations");
              if (needsUpgrade) {
                const currentId = parsedSteps[parsedIndex]?.id;
                upgradedIndex = currentId ? upgraded.findIndex((step) => step.id === currentId) : -1;
                parsedSteps = upgraded;
              }
            }
            _setJourneySteps(parsedSteps);
            // Keep localStorage in sync after migration.
            localStorage.setItem(`${LOCAL_STORAGE_PREFIX}journeySteps`, JSON.stringify(parsedSteps));
            if (savedFormData) {
              const parsedForm = JSON.parse(savedFormData);
              _setFormData(parsedForm);
              if (savedBaselineData) {
                setBaselineData(JSON.parse(savedBaselineData));
              } else {
                setBaselineData(parsedForm);
              }
            }
            if (savedPrefilledData) {
              setPrefilledData(JSON.parse(savedPrefilledData));
            } else {
              setPrefilledData({});
            }
            if (savedChangedFields) {
              setChangedFields(JSON.parse(savedChangedFields));
            } else {
              setChangedFields([]);
            }
            if (savedStepHistory) {
              const parsedHistory = JSON.parse(savedStepHistory);
              if (Array.isArray(parsedHistory)) {
                setStepHistory(parsedHistory.filter((idx) => Number.isInteger(idx) && idx >= 0 && idx < parsedSteps.length));
              } else {
                setStepHistory([]);
              }
            } else {
              setStepHistory([]);
            }

            // If it's a resume URL, we force them to verify OTP first (index 0)
            if (isResumeUrl) {
              setStepHistory([]);
              _setCurrentStepIndex(0);
              const targetIdx = typeof upgradedIndex === "number" && upgradedIndex >= 0 ? upgradedIndex : parsedIndex;
              setResumeTargetStepIndex(targetIdx > 0 ? targetIdx : null);
            } else {
              setResumeTargetStepIndex(null);
            }
            if (!isResumeUrl) {
            if (typeof upgradedIndex === "number" && upgradedIndex >= 0) {
              _setCurrentStepIndex(upgradedIndex);
            } else {
              _setCurrentStepIndex(Math.min(parsedIndex, Math.max(0, parsedSteps.length - 1)));
            }
            }

            if (savedBranchStepId && STEP_COMPONENTS[savedBranchStepId]) {
              setBranchComponent(STEP_COMPONENTS[savedBranchStepId]);
            }
          } else {
            resetJourney();
          }
        } else {
          // If no saved session, ensure we are in a clean Personal Loan state
          _setJourneyType("personal-loan");
          _setJourneySteps(getInitialStepsForJourney("personal-loan", journeyConfig));
          setPrefilledData({});
          setBaselineData({});
          setChangedFields([]);
        }
      } catch (error) {
        resetJourney();
      }
      setIsInitialized(true);
    }
  }, [journeyConfig, resetJourney, setBranchComponent]);

  // Prototype: always prefill with demo data when form is empty
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;
    _setFormData((prev) => {
      if (prev.mobileNumber || prev.email) return prev;
      return { ...DEMO_FORM_DATA, ...prev };
    });
  }, [isInitialized]);

  // --- Broadcast journey status per employee for dashboard tracking ---
  useEffect(() => {
    if (typeof window === "undefined" || !isInitialized || showDashboard) return;
    const empId = formData.employeeId;
    if (!empId || !journeyType) return;
    const currentStep = journeySteps[currentStepIndex];
    if (!currentStep) return;
    const isComplete = currentStep.id.endsWith(":complete");
    const lastUpdated = new Date().toISOString();
    const statusEntry: Record<string, any> = {
      status: isComplete ? "completed" : "in_progress",
      currentStepIndex,
      currentStepTitle: currentStep.title,
      currentStepId: currentStep.id,
      journeyType,
      lastUpdated,
      name: formData.name,
      email: formData.email,
      phone: formData.mobileNumber,
      dob: formData.dob,
      pan: formData.pan,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      currentAddress: formData.currentAddress,
      income: formData.income,
      maritalStatus: formData.maritalStatus,
    };
    if (isComplete) {
      statusEntry.bankName = "AU Bank";
      statusEntry.accountNumber = "1" + empId.replace(/\D/g, "").padStart(10, "0") + "82";
      statusEntry.ifscCode = "IDFB0040101";
    }
    localStorage.setItem(`employeeJourneyStatus_${empId}`, JSON.stringify(statusEntry));

    const salaryJourneys: JourneyType[] = ["ntb", "ntb-conversion", "etb-nk", "etb"];
    const loanJourneys = ["personal-loan", "auto-loan", "education-loan"] as const;

    if (salaryJourneys.includes(journeyType)) {
      localStorage.setItem(
        salaryJourneyBundleKey(empId),
        JSON.stringify({
          journeyType,
          status: statusEntry.status,
          currentStepId: currentStep.id,
          currentStepIndex,
          lastUpdated,
        })
      );
    }

    if ((loanJourneys as readonly string[]).includes(journeyType)) {
      const branchStepId = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}branchStepId`);
      const bundle: LoanJourneyResumeBundle = {
        journeyType,
        status: statusEntry.status,
        currentStepIndex,
        currentStepId: currentStep.id,
        journeySteps,
        formData: { ...formData },
        branchStepId,
        stepHistory,
        lastUpdated,
      };
      localStorage.setItem(
        loanJourneyBundleKey(empId, journeyType as (typeof loanJourneys)[number]),
        JSON.stringify(bundle)
      );
    }
  }, [currentStepIndex, journeySteps, formData, journeyType, isInitialized, showDashboard, stepHistory]);

  const startJourney = useCallback(
    (
      type: JourneyType,
      prefilled?: Record<string, any>,
      startStepId?: string,
      loanResumeBundle?: LoanJourneyResumeBundle | null
    ) => {
    const empId = prefilled?.employeeId || formData.employeeId;
    
    // Check for saved state for this specific employee before resetting
    let savedIndex = 0;
    if (typeof window !== 'undefined' && empId) {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}stepIndex_${empId}`);
      if (stored) savedIndex = parseInt(stored, 10);
    }

    // Force reset any saved state for specialized journeys to avoid "old journey" logic, 
    // BUT preserve the employee-specific index if we want to resume
    if (typeof window !== 'undefined' && !empId) {
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}userType`);
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}journeyType`);
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}stepIndex`);
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}journeySteps`);
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}branchStepId`);
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}stepHistory`);
    }

    setShowModeSelection(false);
    setPendingInviteData(null);
    setResumeTargetStepIndex(null);
    
    const validTypes: JourneyType[] = [
      "personal-loan",
      "auto-loan",
      "education-loan",
      "address-verification",
      "ntb", "ntb-conversion", "etb-nk", "etb",
    ];
    const finalType = validTypes.includes(type) ? type : "personal-loan";

    const isLoanLikeJourney = (t: JourneyType) =>
      t === "personal-loan" || t === "auto-loan" || t === "education-loan";

    if (
      loanResumeBundle &&
      loanResumeBundle.journeyType === finalType &&
      loanResumeBundle.journeySteps?.length &&
      isLoanLikeJourney(finalType)
    ) {
      _setJourneyType(finalType);
      setJourneySteps(loanResumeBundle.journeySteps);
      let resolvedIndex = startStepId
        ? loanResumeBundle.journeySteps.findIndex((step) => step.id === startStepId)
        : loanResumeBundle.currentStepIndex;
      if (resolvedIndex < 0) resolvedIndex = loanResumeBundle.currentStepIndex;
      resolvedIndex = Math.min(
        Math.max(0, resolvedIndex),
        Math.max(0, loanResumeBundle.journeySteps.length - 1)
      );
      _setCurrentStepIndex(resolvedIndex);
      const history = Array.isArray(loanResumeBundle.stepHistory)
        ? loanResumeBundle.stepHistory.filter(
            (idx) =>
              Number.isInteger(idx) &&
              idx >= 0 &&
              idx < loanResumeBundle.journeySteps.length
          )
        : [];
      setStepHistory(history);
      const safePrefilled = prefilled || {};
      const merged = {
        ...DEMO_FORM_DATA,
        ...formData,
        ...(loanResumeBundle.formData as Record<string, any>),
        ...safePrefilled,
      };
      _setFormData(merged);
      setBaselineData(merged);
      setChangedFields([]);
      setPrefilledData(safePrefilled);
      if (loanResumeBundle.branchStepId && STEP_COMPONENTS[loanResumeBundle.branchStepId]) {
        setBranchComponent(STEP_COMPONENTS[loanResumeBundle.branchStepId]);
      } else {
        setBranchComponent(null);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}journeyType`, finalType);
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}stepIndex`, String(resolvedIndex));
        if (empId) {
          localStorage.setItem(`${LOCAL_STORAGE_PREFIX}stepIndex_${empId}`, String(resolvedIndex));
        }
        localStorage.setItem(
          `${LOCAL_STORAGE_PREFIX}journeySteps`,
          JSON.stringify(loanResumeBundle.journeySteps)
        );
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}formData`, JSON.stringify(merged));
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}baselineData`, JSON.stringify(merged));
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}changedFields`, JSON.stringify([]));
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}prefilledData`, JSON.stringify(safePrefilled));
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}stepHistory`, JSON.stringify(history));
        if (loanResumeBundle.branchStepId) {
          localStorage.setItem(`${LOCAL_STORAGE_PREFIX}branchStepId`, loanResumeBundle.branchStepId);
        } else {
          localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}branchStepId`);
        }
      }
      setShowDashboard(false);
      setError(null);
      setBottomBarContent(null);
      return;
    }
    
    _setJourneyType(finalType);
    const newSteps = getInitialStepsForJourney(finalType, journeyConfig);
    setJourneySteps(newSteps);
    
    let startIndex = startStepId ? newSteps.findIndex((step) => step.id === startStepId) : -1;
    if (startIndex < 0 && savedIndex > 0) {
      startIndex = savedIndex;
    }
    
    _setCurrentStepIndex(startIndex >= 0 ? startIndex : 0);
    _setStepHistory([]);
    setBranchComponent(null);
    const safePrefilled = prefilled || {};
    const welcomeOnly = {
      ...(safePrefilled.name != null ? { name: safePrefilled.name } : {}),
      ...(safePrefilled.mobileNumber != null ? { mobileNumber: safePrefilled.mobileNumber } : {}),
      ...(safePrefilled.employeeId != null ? { employeeId: safePrefilled.employeeId } : {}),
    };
    const isSalaryJourney = ["ntb", "ntb-conversion", "etb-nk", "etb"].includes(finalType);
    const merged =
      isLoanLikeJourney(finalType) || finalType === "address-verification" || isSalaryJourney
        ? { ...DEMO_FORM_DATA, ...formData, ...safePrefilled }
        : { ...DEMO_FORM_DATA, ...formData, ...welcomeOnly };
    _setFormData(merged);
    setBaselineData(merged);
    setChangedFields([]);
    setPrefilledData(safePrefilled);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}journeyType`, finalType);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}stepIndex`, (startIndex >= 0 ? startIndex : 0).toString());
      if (empId) {
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}stepIndex_${empId}`, (startIndex >= 0 ? startIndex : 0).toString());
      }
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}formData`, JSON.stringify(merged));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}baselineData`, JSON.stringify(merged));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}changedFields`, JSON.stringify([]));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}prefilledData`, JSON.stringify(prefilled || {}));
    }
    setShowDashboard(false);
    setError(null);
    setBottomBarContent(null);
  },
  [formData, journeyConfig, setJourneySteps, setBranchComponent, setStepHistory]
  );

  // --- Navigation Functions ---
  const nextStep = useCallback(() => {
    setBranchComponent(null); // Go back to main flow
    setBottomBarContent(null);

    // Hardcoded logic: After Personal Loan Journey (last step), start DAV journey
    // (This is now handled by nextStep simply incrementing index if they are in the same array)
    
    // Check if we are in a resume flow at the first step
    const params = new URLSearchParams(window.location.search);
    const isResumeUrl = params.get('resume') === 'true';
    const savedStepIndex = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}stepIndex`);

    if (isResumeUrl && currentStepIndex === 0 && savedStepIndex) {
      const targetIndex = parseInt(savedStepIndex, 10);
      if (targetIndex > 0 && targetIndex < journeySteps.length) {
        setStepHistory([]);
        setStepIndex(targetIndex);
        // Clean URL
        const url = new URL(window.location.href);
        url.searchParams.delete('resume');
        window.history.replaceState({}, '', url);
        return;
      }
    }

    if (currentStepIndex < journeySteps.length - 1) {
      setStepHistory((prev) => [...prev, currentStepIndex]);
      setStepIndex(currentStepIndex + 1);
    }
  }, [currentStepIndex, journeySteps, journeyType, startJourney, formData, setBranchComponent, setStepHistory, setStepIndex]);

  const prepareForModeSelection = useCallback((journeyType: JourneyType, prefilledData: Record<string, any>) => {
    setShowModeSelection(true);
    setPendingInviteData({ journeyType, prefilledData });
    setShowDashboard(false);
  }, []);

  const selectJourneyMode = useCallback((mode: "conversational" | "form") => {
    if (!pendingInviteData) return;
    const type = mode === "conversational" ? "conversational" : (pendingInviteData.journeyType as any);
    startJourney(type, pendingInviteData.prefilledData);
  }, [pendingInviteData, startJourney]);

  const prevStep = useCallback(() => {
    setBranchComponent(null); // Go back to main flow
    setBottomBarContent(null);
    setStepHistory((prev) => {
      if (prev.length > 0) {
        const target = prev[prev.length - 1];
        setStepIndex(target);
        return prev.slice(0, -1);
      }
      if (currentStepIndex > 0) {
        setStepIndex(currentStepIndex - 1);
      }
      return prev;
    });
  }, [currentStepIndex, setBranchComponent, setStepHistory, setStepIndex]);

  const goToStep = useCallback((stepId: string) => {
    const newComponent = STEP_COMPONENTS[stepId];
    if (!newComponent) {
      console.error(`Step "${stepId}" not found!`);
      return;
    }

    const mainJourneyIndex = journeySteps.findIndex(s => s.id === stepId);
    if (mainJourneyIndex !== -1) {
      setBranchComponent(null);
      setStepHistory((prev) => [...prev, currentStepIndex]);
      setStepIndex(mainJourneyIndex);
    } else {
      setBranchComponent(newComponent);
    }
    setBottomBarContent(null);
  }, [currentStepIndex, journeySteps, setBranchComponent, setStepHistory, setStepIndex]);

  const CurrentStepComponent = journeySteps[currentStepIndex]
    ? STEP_COMPONENTS[journeySteps[currentStepIndex].id]
    : () => null;

  if (!isInitialized) return null;

  return (
    <JourneyContext.Provider
      value={{
        userType,
        journeyType,
        currentStepIndex,
        journeySteps,
        CurrentStepComponent,
        currentBranchComponent,
        nextStep,
        prevStep,
        goToStep,
        setUserType,
        setJourneyType,
        setNomineeEnabled,
        switchToPhysicalKycFlow,
        switchToDigitalKycFlow,
        bottomBarContent,
        setBottomBarContent,
        resetJourney,
        addNotification,
        clearNotifications,
        notifications,
        formData,
        prefilledData,
        baselineData,
        changedFields,
        updateFormData,
        isResumeFlow,
        resumeTargetStepIndex,
        chatMessages,
        sendMessage,
        showDashboard,
        setShowDashboard,
        error,
        setError,
        startJourney,
        showModeSelection,
        pendingInviteData,
        prepareForModeSelection,
        selectJourneyMode,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};

// --- 6. Hook ---
export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error("useJourney must be used within a JourneyProvider");
  }
  return context;
};