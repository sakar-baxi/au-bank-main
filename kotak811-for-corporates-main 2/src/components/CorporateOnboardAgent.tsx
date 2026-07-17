import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Building2, Check, Send } from "lucide-react";

type MessageType = "user" | "agent" | "thinking" | "interactive" | "info-card" | "success";

interface Message {
  type: MessageType;
  text?: string;
  data?: any;
  steps?: string[];
  actions?: Array<{ label: string; action: string; variant?: "primary" | "secondary" | "ghost" }>;
  timestamp?: number;
}

type StepStatus = "pending" | "in-progress" | "completed";

interface JourneyStep {
  label: string;
  status: StepStatus;
}

export const CorporateOnboardAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [activeJourney, setActiveJourney] = useState<string | null>(null);
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([]);
  const [currentStepStartedAt, setCurrentStepStartedAt] = useState<number | null>(null);

  const [corpDetails, setCorpDetails] = useState({
    companyName: "",
    pocName: "",
    pocEmail: "",
    gst: "",
    cin: "",
  });

  const [selectedConnectionMode, setSelectedConnectionMode] = useState<"self" | "invite-hr" | null>("self");
  const [dataSource, setDataSource] = useState<"HRMS" | "SFTP" | "Push API" | "CSV" | null>("HRMS");
  const [selectedHRMS, setSelectedHRMS] = useState<string>("Keka");
  const [hrmsCreds, setHrmsCreds] = useState({
    host: "",
    username: "",
    password: "",
  });

  const [mappingState, setMappingState] = useState({
    mandatory: {
      name: true,
      empId: true,
      phone: true,
      aadhaar: true,
      bankName: true,
      ifsc: true,
      companyName: true,
      accountNumber: true,
      uan: true,
      designation: true,
    },
    company: {
      registeredName: false,
      pan: false,
      address: false,
      gst: false,
      companyEmail: false,
      din: false,
      cin: false,
      companyPhone: false,
    },
    employee: {
      employeeId: true,
      department: true,
      workEmail: true,
      employeeNumber: false,
      firstName: true,
      lastName: true,
      groups: false,
      preferredName: false,
      personalEmail: false,
      displayFullName: false,
    },
  });
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatText = (s?: string) => {
    if (!s) return "";
    return s.replace(/\*\*(.*?)\*\*/g, "$1").trim();
  };

  const triggerSuccessEffects = () => {
    const container = chatContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const count = 14;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.left = `${Math.random() * (rect.width - 8)}px`;
      el.style.top = `0px`;
      el.style.width = "5px";
      el.style.height = "5px";
      el.style.borderRadius = "2px";
      el.style.opacity = "0.9";
      el.style.background = ["#22c55e", "#3b82f6", "#f97316", "#eab308", "#a855f7"][Math.floor(Math.random() * 5)];
      el.style.transform = `translate3d(0,0,0) rotate(${Math.random() * 360}deg)`;
      el.style.transition = "transform 800ms ease-out, opacity 900ms ease-out";
      (container as HTMLElement).appendChild(el);
      const dx = (Math.random() - 0.5) * 80;
      const dy = 120 + Math.random() * 120;
      requestAnimationFrame(() => {
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${Math.random() * 720}deg)`;
        el.style.opacity = "0";
      });
      setTimeout(() => {
        el.remove();
      }, 1000);
    }
  };

  const addThinkingSteps = async (steps: string[]) => {
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.type !== "thinking");
        return [
          ...filtered,
          {
            type: "thinking",
            steps: steps.slice(0, i + 1),
            timestamp: Date.now(),
          },
        ];
      });
    }
  };

  const startOnboarding = async () => {
    setActiveJourney("corporate-onboarding");
    setJourneySteps([
      { label: "Corporate Details", status: "in-progress" },
      { label: "KYB Verification", status: "pending" },
      { label: "Connection Setup", status: "pending" },
      { label: "Data Source", status: "pending" },
      { label: "HRMS Selection", status: "pending" },
      { label: "HRMS Credentials", status: "pending" },
      { label: "Data Mapping", status: "pending" },
      { label: "Connection Active", status: "pending" },
    ]);
    setCurrentStepStartedAt(Date.now());

    setMessages((prev) => [
      ...prev,
      {
        type: "agent",
        text: "Let’s onboard a new corporate. We’ll capture basic details, run KYB checks, and connect their HRMS for data sync.",
        timestamp: Date.now(),
      },
    ]);

    await new Promise((resolve) => setTimeout(resolve, 400));

    setMessages((prev) => [
      ...prev,
      {
        type: "interactive",
        text: "Corporate details",
        data: {
          formId: "corp-details",
        },
        actions: [{ label: "Save & continue", action: "confirm-corp-details", variant: "primary" }],
        timestamp: Date.now(),
      },
    ]);
  };

  const handleConfirmCorporateDetails = async () => {
    if (
      !corpDetails.companyName.trim() ||
      !corpDetails.pocName.trim() ||
      !corpDetails.pocEmail.trim()
    ) {
      setMessages((prev) => [
        ...prev,
        {
          type: "agent",
          text: "Add company name, contact name, and email to move ahead.",
          timestamp: Date.now(),
        },
      ]);
      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: "Corporate details confirmed ✓",
        timestamp: Date.now(),
      },
    ]);

    setJourneySteps((prev) =>
      prev.map((step, idx) =>
        idx === 0 ? { ...step, status: "completed" } : idx === 1 ? { ...step, status: "in-progress" } : step
      )
    );
    setCurrentStepStartedAt(Date.now());

    setIsThinking(true);
    await addThinkingSteps([
      "Validating GST & CIN with registries...",
      "Checking corporate structure & status...",
      "Completing KYB checks...",
    ]);

    await new Promise((resolve) => setTimeout(resolve, 700));
    setMessages((prev) => prev.filter((m) => m.type !== "thinking"));
    setIsThinking(false);
    triggerSuccessEffects();

    setMessages((prev) => [
      ...prev,
      {
        type: "info-card",
        data: {
          title: "KYB verification complete",
          subtitle: "We’ve verified the business and compliance status.",
          items: [
            { label: "Status", value: "Verified" },
            { label: "Business registration", value: "Matches GST/CIN" },
            { label: "Corporate structure", value: "Validated" },
            { label: "Tax checks", value: "No issues detected" },
          ],
        },
        actions: [{ label: "Review verified details", action: "continue-from-kyb", variant: "primary" }],
        timestamp: Date.now(),
      },
    ]);
  };

  const handleContinueFromKYB = async () => {
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: "Review KYB‑verified details",
        timestamp: Date.now(),
      },
    ]);

    setJourneySteps((prev) =>
      prev.map((step, idx) =>
        idx === 1 ? { ...step, status: "completed" } : idx === 2 ? { ...step, status: "in-progress" } : step
      )
    );
    setCurrentStepStartedAt(Date.now());

    setMessages((prev) => [
      ...prev,
      {
        type: "interactive",
        text: "Verified corporate profile",
        data: {
          formId: "verified-details",
        },
        actions: [{ label: "Continue to connection setup", action: "connection-self", variant: "primary" }],
        timestamp: Date.now(),
      },
    ]);
  };

  const handleConnectionSelf = async () => {
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: "Set up HRMS connection",
        timestamp: Date.now(),
      },
    ]);

    setJourneySteps((prev) =>
      prev.map((step, idx) =>
        idx === 2 ? { ...step, status: "completed" } : idx === 3 ? { ...step, status: "in-progress" } : step
      )
    );
    setCurrentStepStartedAt(Date.now());

    setMessages((prev) => [
      ...prev,
      {
        type: "interactive",
        text: "Connection setup",
        data: {
          formId: "connection-mode",
        },
        actions: [{ label: "Continue with self setup", action: "choose-hrms", variant: "primary" }],
        timestamp: Date.now(),
      },
    ]);
  };

  const handleChooseHRMS = async () => {
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: "Use HRMS as data source",
        timestamp: Date.now(),
      },
    ]);

    setJourneySteps((prev) =>
      prev.map((step, idx) =>
        idx === 3 ? { ...step, status: "completed" } : idx === 4 ? { ...step, status: "in-progress" } : step
      )
    );
    setCurrentStepStartedAt(Date.now());

    setMessages((prev) => [
      ...prev,
      {
        type: "interactive",
        text: "Data source",
        data: {
          formId: "data-source",
        },
        actions: [{ label: "Continue with HRMS", action: "select-keka", variant: "primary" }],
        timestamp: Date.now(),
      },
    ]);
  };

  const handleSelectKeka = async () => {
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: `HRMS provider selected: ${selectedHRMS}`,
        timestamp: Date.now(),
      },
    ]);

    setJourneySteps((prev) =>
      prev.map((step, idx) =>
        idx === 4 ? { ...step, status: "completed" } : idx === 5 ? { ...step, status: "in-progress" } : step
      )
    );
    setCurrentStepStartedAt(Date.now());

    setMessages((prev) => [
      ...prev,
      {
        type: "interactive",
        text: "HRMS provider",
        data: {
          formId: "hrms-select",
        },
        actions: [{ label: "Confirm provider", action: "show-hrms-creds", variant: "primary" }],
        timestamp: Date.now(),
      },
    ]);
  };

  const handleShowHRMSCredsForm = async () => {
    setMessages((prev) => [
      ...prev,
      {
        type: "interactive",
        text: `${selectedHRMS} connection`,
        data: {
          formId: "hrms-creds",
        },
        actions: [{ label: "Connect HRMS", action: "connect-hrms", variant: "primary" }],
        timestamp: Date.now(),
      },
    ]);
  };

  const handleSubmitHRMSCreds = async () => {
    if (!hrmsCreds.host.trim() || !hrmsCreds.username.trim() || !hrmsCreds.password.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          type: "agent",
          text: "Add host URL, username, and password to connect your HRMS.",
          timestamp: Date.now(),
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: "Connect HRMS",
        timestamp: Date.now(),
      },
    ]);

    setJourneySteps((prev) =>
      prev.map((step, idx) =>
        idx === 5 ? { ...step, status: "completed" } : idx === 6 ? { ...step, status: "in-progress" } : step
      )
    );
    setCurrentStepStartedAt(Date.now());

    setIsThinking(true);
    await addThinkingSteps([
      "Encrypting credentials...",
      "Establishing secure connection with Keka...",
      "Fetching available data fields...",
    ]);

    await new Promise((resolve) => setTimeout(resolve, 800));
    setMessages((prev) => prev.filter((m) => m.type !== "thinking"));
    setIsThinking(false);
    triggerSuccessEffects();

    setMessages((prev) => [
      ...prev,
      {
        type: "interactive",
        text: "Data mapping",
        data: {
          formId: "mapping",
        },
        actions: [{ label: "Configure & continue", action: "open-mapping-modal", variant: "primary" }],
        timestamp: Date.now(),
      },
    ]);
  };

  const handleConfirmMapping = async () => {
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: "Confirm field mapping",
        timestamp: Date.now(),
      },
    ]);

    setJourneySteps((prev) =>
      prev.map((step, idx) =>
        idx === 6 ? { ...step, status: "completed" } : idx === 7 ? { ...step, status: "in-progress" } : step
      )
    );
    setCurrentStepStartedAt(Date.now());

    setIsThinking(true);
    await addThinkingSteps([
      "Activating HRMS connection...",
      "Starting initial employee data sync...",
    ]);

    await new Promise((resolve) => setTimeout(resolve, 900));
    setMessages((prev) => prev.filter((m) => m.type !== "thinking"));
    setIsThinking(false);
    triggerSuccessEffects();

    setJourneySteps((prev) =>
      prev.map((step, idx) => (idx === 7 ? { ...step, status: "completed" } : step))
    );
    setActiveJourney(null);

    setMessages((prev) => [
      ...prev,
      {
        type: "success",
        data: {
          title: "Connection Successful",
          details: [
            `HRMS connection established with ${selectedHRMS}.`,
            `Data sync is now active for ${corpDetails.companyName || "the new corporate"}.`,
            "Mandatory employee and company fields are mapped.",
          ],
          nextSteps: [
            "Monitor first sync in analytics.",
            "Configure product eligibility for this corporate.",
            "Invite employees to activate salary accounts.",
          ],
        },
        timestamp: Date.now(),
      },
    ]);
  };

  const handleAction = async (action: string) => {
    if (isThinking && action !== "start-onboarding") return;

    switch (action) {
      case "start-onboarding":
        await startOnboarding();
        break;
      case "confirm-corp-details":
        await handleConfirmCorporateDetails();
        break;
      case "continue-from-kyb":
        await handleContinueFromKYB();
        break;
      case "connection-self":
        await handleConnectionSelf();
        break;
      case "choose-hrms":
        await handleChooseHRMS();
        break;
      case "select-keka":
        await handleSelectKeka();
        break;
      case "show-hrms-creds":
        await handleShowHRMSCredsForm();
        break;
      case "connect-hrms":
        await handleSubmitHRMSCreds();
        break;
      case "open-mapping-modal":
        setIsMappingModalOpen(true);
        break;
      case "confirm-mapping":
        await handleConfirmMapping();
        break;
      default:
        break;
    }
  };

  const handleSend = () => {
    if (!inputValue.trim() || isThinking) return;
    const text = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text,
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="flex-1 h-full relative">
      <div className="max-w-[1800px] mx-auto h-full min-h-0 flex gap-4">
        {/* Main Chat Area */}
        <div className="flex-1 flex min-h-0">
          <Card className="flex-1 flex min-h-0 flex-col rounded-lg shadow-sm bg-white dark:bg-gray-800 overflow-hidden">
            {/* Messages Area */}
            <div ref={chatContainerRef} className="relative flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-2xl px-6">
                      <div className="flex flex-col items-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Bot className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                        Corporate Onboarding
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Guided flow to onboard a new corporate and connect their HRMS.
                      </p>
                    </div>
                    <div className="flex flex-col items-stretch gap-3 max-w-md mx-auto">
                      <motion.button
                        onClick={() => handleAction("start-onboarding")}
                        disabled={isThinking}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 420, damping: 28 }}
                        className="group w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm disabled:opacity-50 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 text-left"
                      >
                        <div className="flex items-start gap-3">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                            <Building2 className="w-4 h-4" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                Start new corporate
                              </span>
                              <span className="text-[10px] font-semibold text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300 rounded-full px-1.5 py-0.5 whitespace-nowrap">
                                AI assisted
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                              Capture details, verify KYB, and connect HRMS in one guided flow.
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`animate-fadeIn ${
                        currentStepStartedAt && msg.timestamp && msg.timestamp < currentStepStartedAt
                          ? "opacity-60"
                          : ""
                      }`}
                    >
                      {msg.type === "user" && (
                        <div className="flex justify-end">
                          <div className="max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-md bg-gradient-to-tr from-[hsl(var(--primary))] to-blue-600 text-white">
                            <p className="leading-relaxed">{msg.text}</p>
                          </div>
                        </div>
                      )}

                      {msg.type === "thinking" && msg.steps && (
                        <div className="flex justify-start">
                          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full px-4 py-2 shadow-sm ring-1 ring-blue-100/60 dark:ring-blue-800/40">
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                              <div
                                className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              />
                              <div
                                className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              />
                            </div>
                            <span className="text-xs font-medium text-primary">
                              {formatText(msg.steps[msg.steps.length - 1])}
                            </span>
                          </div>
                        </div>
                      )}

                      {msg.type === "agent" && (
                        <div className="flex justify-start">
                          <div className="max-w-[75%] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 rounded-2xl px-4 py-2.5 shadow-md ring-1 ring-blue-100/60 dark:ring-gray-700/60">
                            <div className="flex items-start space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-[hsl(var(--primary))] to-blue-700 rounded-md flex items-center justify-center flex-shrink-0">
                                <Bot className="w-3.5 h-3.5 text-white" />
                              </div>
                              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line pt-0.5">
                                {formatText(msg.text)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {msg.type === "interactive" && (
                        <div className="flex justify-start">
                          <div className="max-w-[85%] w-full">
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                              {msg.text && (
                                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                                  <div className="flex items-center justify-between">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        // Secret auto-fill for demo purposes
                                        if (msg.data?.formId === "corp-details") {
                                          setCorpDetails({
                                            companyName: "Acme Technologies Pvt Ltd",
                                            pocName: "Ananya Sharma",
                                            pocEmail: "ananya.sharma@acmetech.in",
                                            gst: "29ABCDE1234F1Z5",
                                            cin: "U12345KA2019PTC123456",
                                          });
                                        } else if (msg.data?.formId === "hrms-select") {
                                          setSelectedHRMS("Keka");
                                        } else if (msg.data?.formId === "hrms-creds") {
                                          setHrmsCreds({
                                            host: "https://acme.keka.com",
                                            username: "integration@acmetech.in",
                                            password: "Demo@1234",
                                          });
                                        }
                                      }}
                                      className="flex flex-col text-left focus:outline-none"
                                    >
                                      <span className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                                        Step
                                      </span>
                                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                                        {formatText(msg.text)}
                                      </p>
                                    </button>
                                  </div>
                                </div>
                              )}
                              {msg.data?.formId === "corp-details" && (
                                <div className="p-3 space-y-3">
                                  <div className="grid md:grid-cols-2 gap-3">
                                    <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Company Name</p>
                                      <Input
                                        value={corpDetails.companyName}
                                        onChange={(e) =>
                                          setCorpDetails((prev) => ({ ...prev, companyName: e.target.value }))
                                        }
                                        placeholder="e.g., Acme Technologies Pvt Ltd"
                                        className="h-9 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        Point of Contact Name
                                      </p>
                                      <Input
                                        value={corpDetails.pocName}
                                        onChange={(e) =>
                                          setCorpDetails((prev) => ({ ...prev, pocName: e.target.value }))
                                        }
                                        placeholder="e.g., Ananya Sharma"
                                        className="h-9 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        Point of Contact Email
                                      </p>
                                      <Input
                                        type="email"
                                        value={corpDetails.pocEmail}
                                        onChange={(e) =>
                                          setCorpDetails((prev) => ({ ...prev, pocEmail: e.target.value }))
                                        }
                                        placeholder="name@company.com"
                                        className="h-9 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">GST Number</p>
                                      <Input
                                        value={corpDetails.gst}
                                        onChange={(e) =>
                                          setCorpDetails((prev) => ({ ...prev, gst: e.target.value }))
                                        }
                                        placeholder="e.g., 29ABCDE1234F1Z5"
                                        className="h-9 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">CIN Number</p>
                                      <Input
                                        value={corpDetails.cin}
                                        onChange={(e) =>
                                          setCorpDetails((prev) => ({ ...prev, cin: e.target.value }))
                                        }
                                        placeholder="e.g., U12345KA2019PTC123456"
                                        className="h-9 text-sm"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {msg.data?.formId === "verified-details" && (
                                <div className="p-3 space-y-2">
                                  <div className="grid sm:grid-cols-2 gap-2">
                                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400">Company Name</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                          {corpDetails.companyName || "—"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400">GST Number</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                          {corpDetails.gst || "—"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400">CIN Number</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                          {corpDetails.cin || "—"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400">Point of Contact</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                          {corpDetails.pocName || "—"}
                                          {corpDetails.pocEmail ? ` • ${corpDetails.pocEmail}` : ""}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {msg.data?.formId === "hrms-select" && (
                                <div className="p-3 space-y-2">
                                  <select
                                    className="w-full h-9 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    value={selectedHRMS}
                                    onChange={(e) => setSelectedHRMS(e.target.value)}
                                  >
                                    {[
                                      "Zoho People",
                                      "Keka",
                                      "Darwinbox",
                                      "GreytHR",
                                      "SAP",
                                      "HR One",
                                      "Deel",
                                      "Oyster",
                                      "Pocket HRMS",
                                      "Peoplestrong",
                                      "ZingHR",
                                      "BambooHR",
                                      "SumHR",
                                      "Gusto",
                                      "Paycor",
                                    ].map((provider) => (
                                      <option key={provider} value={provider}>
                                        {provider}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {msg.data?.formId === "connection-mode" && (
                                <div className="p-3 space-y-3">
                                  <div className="space-y-2">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedConnectionMode("self")}
                                      className={`w-full flex items-start justify-between rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                                        selectedConnectionMode === "self"
                                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60"
                                      }`}
                                    >
                                      <div className="flex items-start gap-2">
                                        <span
                                          className={`mt-0.5 h-3.5 w-3.5 rounded-full border ${
                                            selectedConnectionMode === "self"
                                              ? "border-blue-500 bg-blue-500"
                                              : "border-gray-300 bg-white dark:bg-gray-900"
                                          }`}
                                        ></span>
                                        <div>
                                          <p className="font-semibold text-gray-900 dark:text-white text-xs">
                                            Set up on behalf of HR
                                          </p>
                                          <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                                            Use HR credentials now and configure data sync for the corporate.
                                          </p>
                                        </div>
                                      </div>
                                    </button>
                                    <div className="w-full flex items-start justify-between rounded-lg border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40 px-3 py-2 text-left text-xs opacity-60 cursor-not-allowed">
                                      <div className="flex items-start gap-2">
                                        <span className="mt-0.5 h-3.5 w-3.5 rounded-full border border-gray-300 bg-gray-100 dark:bg-gray-800"></span>
                                        <div>
                                          <p className="font-semibold text-gray-700 dark:text-gray-300 text-xs">
                                            Invite HR (coming soon)
                                          </p>
                                          <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                                            Send an invite so HR can complete setup later. Available in production.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {msg.data?.formId === "data-source" && (
                                <div className="p-3 space-y-3">
                                  <div className="space-y-2">
                                    <button
                                      type="button"
                                      onClick={() => setDataSource("HRMS")}
                                      className={`w-full flex items-start justify-between rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                                        dataSource === "HRMS"
                                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60"
                                      }`}
                                    >
                                      <div>
                                        <p className="font-semibold text-gray-900 dark:text-white text-xs">
                                          HRMS integration
                                          <span className="ml-1 text-[10px] text-green-600 dark:text-green-400">
                                            • Recommended
                                          </span>
                                        </p>
                                        <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                                          Direct, automated sync from the HR system.
                                        </p>
                                      </div>
                                    </button>
                                    <div className="w-full rounded-lg border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40 px-3 py-2 text-left text-[11px] text-gray-600 dark:text-gray-400">
                                      <p className="font-semibold text-gray-700 dark:text-gray-300 text-xs mb-1">
                                        Other methods (prototype only)
                                      </p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {["SFTP", "Push API", "CSV upload"].map((label) => (
                                          <span
                                            key={label}
                                            className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px]"
                                          >
                                            {label}
                                          </span>
                                        ))}
                                      </div>
                                      <p className="mt-1 text-[10px]">
                                        These will be enabled for bulk and event-based integrations in production.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {msg.data?.formId === "hrms-creds" && (
                                <div className="p-3 space-y-3">
                                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                    Enter your {selectedHRMS} credentials (encrypted, used only for sync).
                                  </p>
                                  <div className="space-y-2">
                                    <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Host URL</p>
                                      <Input
                                        value={hrmsCreds.host}
                                        onChange={(e) =>
                                          setHrmsCreds((prev) => ({ ...prev, host: e.target.value }))
                                        }
                                        placeholder="https://yourcompany.hrms.com"
                                        className="h-9 text-sm"
                                      />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-2">
                                      <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Username</p>
                                        <Input
                                          value={hrmsCreds.username}
                                          onChange={(e) =>
                                            setHrmsCreds((prev) => ({ ...prev, username: e.target.value }))
                                          }
                                          placeholder="integration@company.com"
                                          className="h-9 text-sm"
                                        />
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Password</p>
                                        <Input
                                          type="password"
                                          value={hrmsCreds.password}
                                          onChange={(e) =>
                                            setHrmsCreds((prev) => ({ ...prev, password: e.target.value }))
                                          }
                                          placeholder="••••••••"
                                          className="h-9 text-sm"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {msg.data?.formId === "mapping" && (
                                <div className="p-3 space-y-2">
                                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 rounded-lg px-3 py-2">
                                    <div className="space-y-0.5">
                                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                                        Current mapping summary
                                      </p>
                                      <p className="text-[11px] text-gray-600 dark:text-gray-400">
                                        Mandatory:{" "}
                                        {
                                          Object.values(mappingState.mandatory).filter(Boolean)
                                            .length
                                        }{" "}
                                        • Company:{" "}
                                        {Object.values(mappingState.company).filter(Boolean).length} •
                                        Employee:{" "}
                                        {Object.values(mappingState.employee).filter(Boolean).length}
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-[11px] h-8 px-2"
                                      onClick={() => setIsMappingModalOpen(true)}
                                    >
                                      Configure fields
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {!msg.data?.formId && msg.data?.fields && (
                                <div className="p-3">
                                  <div className="grid sm:grid-cols-2 gap-2">
                                    {msg.data.fields.map((field: any, i: number) => (
                                      <div
                                        key={i}
                                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                      >
                                        <div className="flex-1 min-w-0">
                                          <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                            {field.label}
                                          </p>
                                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {field.value}
                                          </p>
                                        </div>
                                        {field.required && (
                                          <Badge className="bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700 text-[10px]">
                                            Required
                                          </Badge>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {msg.actions && msg.actions.length > 0 && (
                                <div className="p-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                                  {msg.actions.map((action, i) => (
                                    <Button
                                      key={i}
                                      onClick={() => handleAction(action.action)}
                                      variant={action.variant === "ghost" ? "outline" : "secondary"}
                                      className="flex-1 text-xs h-8"
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

                      {msg.type === "info-card" && (
                        <div className="flex justify-start">
                          <div className="max-w-[85%] w-full">
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                              <div className="p-3">
                                <div className="flex items-start space-x-2 mb-2">
                                  <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center">
                                    <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-300" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-xs text-gray-900 dark:text-white">
                                      {msg.data?.title}
                                    </h4>
                                    {msg.data?.subtitle && (
                                      <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                                        {msg.data.subtitle}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {msg.data?.items && msg.data.items.length > 0 && (
                                  <div className="space-y-2 mb-1">
                                    {msg.data.items.map((item: any, i: number) => (
                                      <div
                                        key={i}
                                        className="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2"
                                      >
                                        <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                          {item.value}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {msg.actions && msg.actions.length > 0 && (
                                <div className="p-2 bg-white/50 dark:bg-gray-800/50 border-t border-blue-200 dark:border-blue-800 flex flex-wrap gap-2">
                                  {msg.actions.map((action, i) => (
                                    <Button
                                      key={i}
                                      onClick={() => handleAction(action.action)}
                                      variant={action.variant === "ghost" ? "outline" : "secondary"}
                                      className="flex-1 text-xs h-8"
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

                      {msg.type === "success" && msg.data && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] w-full">
                            <Card className="border border-green-200 dark:border-green-800 shadow-sm overflow-hidden animate-scaleIn rounded-lg">
                              <div className="bg-green-600 p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Check className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-base text-white">
                                      {formatText(msg.data.title)}
                                    </h4>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4">
                                {msg.data.details && msg.data.details.length > 0 && (
                                  <div className="grid grid-cols-1 gap-2 mb-3">
                                    {msg.data.details.map((detail: string, i: number) => (
                                      <div key={i} className="flex items-start space-x-2 text-xs">
                                        <span className="text-green-600 mt-0.5">•</span>
                                        <span className="text-gray-700 dark:text-gray-300">
                                          {formatText(detail)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {msg.data.nextSteps && msg.data.nextSteps.length > 0 && (
                                  <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-3 border border-blue-200 dark:border-gray-600">
                                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                      Next actions
                                    </p>
                                    <div className="space-y-1.5">
                                      {msg.data.nextSteps.map((step: string, i: number) => (
                                        <div key={i} className="flex items-start space-x-2 text-xs">
                                          <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                                            {i + 1}.
                                          </span>
                                          <span className="text-gray-700 dark:text-gray-300">
                                            {formatText(step)}
                                          </span>
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
              <div className="flex items-center space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask or type notes while onboarding..."
                  className="flex-1 text-sm h-10"
                  disabled={isThinking}
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isThinking}
                  className="h-10 px-4"
                >
                  {isThinking ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar - Task Progress */}
        {(messages.length > 0 || activeJourney || journeySteps.length > 0) && (
          <div className="w-80 h-full bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 sticky top-0 z-10 bg-gradient-to-r from-[hsl(var(--primary))] to-blue-600 text-white shadow">
              <h3 className="font-semibold text-sm text-white flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-white/80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                Onboarding Progress
              </h3>
            </div>

            <div className="p-4 space-y-4">
              {activeJourney && (
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 ring-1 ring-blue-100/60 dark:ring-blue-800/60 rounded-lg animate-fadeIn">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">In Progress</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                        Corporate onboarding & HRMS connection
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {journeySteps.length > 0 && (
                <Card className="p-4 bg-white/70 dark:bg-gray-800/60 ring-1 ring-gray-200/60 dark:ring-gray-700/60 rounded-lg backdrop-blur-sm">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Step-by-step progress
                  </h4>
                  <div className="space-y-3">
                    {journeySteps.map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {step.status === "completed" ? (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          ) : step.status === "in-progress" ? (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-medium ${
                              step.status === "completed"
                                ? "text-green-700 dark:text-green-400"
                                : step.status === "in-progress"
                                ? "text-blue-700 dark:text-blue-400"
                                : "text-gray-500 dark:text-gray-500"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {step.status === "completed"
                              ? "Done"
                              : step.status === "in-progress"
                              ? "In progress..."
                              : "Pending"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {messages
                .filter((m) => m.type === "success")
                .map((msg, idx) => (
                  <Card
                    key={idx}
                    className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 ring-1 ring-green-200/60 dark:ring-green-800/60 rounded-lg animate-fadeIn"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-green-900 dark:text-green-100 mb-1">
                          Completed
                        </p>
                        <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                          {msg.data?.title || "Connection successful"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Mapping Modal */}
      {isMappingModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl max-h-[80vh] bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Configure data mapping
              </h4>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-[11px]"
                onClick={() => setIsMappingModalOpen(false)}
              >
                Close
              </Button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Mandatory data points
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
                  Core fields required for salary account journeys.
                </p>
                <div className="space-y-1">
                  {[
                    ["name", "Name"],
                    ["empId", "Employment ID"],
                    ["phone", "Phone No."],
                    ["aadhaar", "Aadhaar"],
                    ["bankName", "Bank Name"],
                    ["ifsc", "IFSC Code"],
                    ["companyName", "Company Name"],
                    ["accountNumber", "Account Number"],
                    ["uan", "UAN"],
                    ["designation", "Designation"],
                  ].map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-800/60 rounded-md px-2 py-1"
                    >
                      <span className="text-gray-700 dark:text-gray-200">{label}</span>
                      <input
                        type="checkbox"
                        checked={mappingState.mandatory[key as keyof typeof mappingState.mandatory]}
                        onChange={(e) =>
                          setMappingState((prev) => ({
                            ...prev,
                            mandatory: {
                              ...prev.mandatory,
                              [key]: e.target.checked,
                            },
                          }))
                        }
                        className="h-3.5 w-3.5"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Company details
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
                  Additional KYC and contact information.
                </p>
                <div className="space-y-1">
                  {[
                    ["registeredName", "Registered Name"],
                    ["pan", "PAN"],
                    ["address", "Registered Address"],
                    ["gst", "GST"],
                    ["companyEmail", "Company Email"],
                    ["din", "DIN"],
                    ["cin", "CIN"],
                    ["companyPhone", "Company Phone"],
                  ].map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-800/60 rounded-md px-2 py-1"
                    >
                      <span className="text-gray-700 dark:text-gray-200">{label}</span>
                      <input
                        type="checkbox"
                        checked={mappingState.company[key as keyof typeof mappingState.company]}
                        onChange={(e) =>
                          setMappingState((prev) => ({
                            ...prev,
                            company: {
                              ...prev.company,
                              [key]: e.target.checked,
                            },
                          }))
                        }
                        className="h-3.5 w-3.5"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Employee details
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                  Choose fields for personalization and risk decisions.
                </p>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {[
                    ["employeeId", "Employee ID"],
                    ["department", "Department"],
                    ["workEmail", "Work Email"],
                    ["employeeNumber", "Employee number"],
                    ["firstName", "First Name"],
                    ["lastName", "Last Name"],
                    ["groups", "Groups"],
                    ["preferredName", "Preferred name"],
                    ["displayFullName", "Display full name"],
                    ["personalEmail", "Personal email"],
                  ].map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-800/60 rounded-md px-2 py-1"
                    >
                      <span className="text-gray-700 dark:text-gray-200">{label}</span>
                      <input
                        type="checkbox"
                        checked={mappingState.employee[key as keyof typeof mappingState.employee]}
                        onChange={(e) =>
                          setMappingState((prev) => ({
                            ...prev,
                            employee: {
                              ...prev.employee,
                              [key]: e.target.checked,
                            },
                          }))
                        }
                        className="h-3.5 w-3.5"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => setIsMappingModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => {
                  setIsMappingModalOpen(false);
                  handleConfirmMapping();
                }}
              >
                Save & continue
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
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

          .animate-scaleIn {
            animation: scaleIn 0.4s ease-out;
          }
        `}
      </style>
    </div>
  );
};


