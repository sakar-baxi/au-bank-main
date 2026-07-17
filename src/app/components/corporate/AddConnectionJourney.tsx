"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { 
    Link2, 
    ChevronDown, 
    Search, 
    Info, 
    Plus, 
    ArrowLeft, 
    ArrowRight,
    Globe,
    CheckCircle2,
    RefreshCcw,
    Database,
    Webhook,
    Lock,
    Upload,
    FileText,
    Server,
    Check,
    ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

const DATA_MODEL_SECTION_ORDER = ["Salary Details", "Personal Information", "Employment Details"] as const;

const SALARY_DETAIL_FIELDS_LIST = [
    "Basic",
    "House Rent Allowance",
    "Special Allowance",
    "Medical Allowance",
    "Dearness Allowance",
    "Flexi Basket Allowance",
    "Travel Allowance",
    "Other Allowance",
    "Gratuity",
    "Gross Pay",
    "Net Pay",
    "Fixed Pay",
    "PF Deductions",
    "ESI",
    "Miscellaneous Deduction",
    "Labour Welfare Fund",
    "Professional Tax",
    "NPS",
    "Joining Bonus",
    "Miscellaneous Bonus",
    "Performance Bonus",
    "Referal Bonus",
    "Relocation Bonus",
    "Retention Bonus",
    "Employee contribution %",
    "Employer contribution %",
    "Employee contribution till date",
    "Employer contribution till date",
    "Tax Regime",
    "Raw",
] as const;

const PERSONAL_INFO_FIELDS_LIST = [
    "Name",
    "Work Email",
    "Employee ID",
    "Date of Birth",
    "Gender",
    "Marital Status",
    "Blood Group",
    "Personal Email",
    "Phone Number",
    "Emergency Contact",
    "Present Address",
    "Permanent Address",
    "Nationality",
    "Aadhar Number",
    "PAN Number",
    "Passport Details",
] as const;

const PERSONAL_MANDATORY_FIELDS = new Set<string>(["Name", "Work Email", "Employee ID"]);

function getOptionalFieldsForDataSection(cat: string): string[] {
    switch (cat) {
        case "Salary Details":
            return [...SALARY_DETAIL_FIELDS_LIST];
        case "Personal Information":
            return PERSONAL_INFO_FIELDS_LIST.filter((f) => !PERSONAL_MANDATORY_FIELDS.has(f));
        default:
            return [];
    }
}

function getDataSectionTriState(cat: string, selectedFields: Record<string, boolean>): "all" | "some" | "none" {
    const optional = getOptionalFieldsForDataSection(cat);
    if (optional.length === 0) return "none";
    let selectedCount = 0;
    for (const f of optional) {
        if (selectedFields[f]) selectedCount++;
    }
    if (selectedCount === 0) return "none";
    if (selectedCount === optional.length) return "all";
    return "some";
}

export type ConnectionFlowCompletionPayload = {
    corporate: string;
    hrms: string | null;
    transferMethod: "hrms" | "csv" | "sftp";
    mode: "invite" | "setup";
};

interface AddConnectionJourneyProps {
    onComplete: (data: ConnectionFlowCompletionPayload) => void;
    onCancel: () => void;
    onAddNewCorporate: () => void;
    corporateOptions: ReadonlyArray<{ name: string; referenceId?: string }>;
    hrmsIntegrations: Array<{ name: string; type: string }>;
}

type Step = 
    | "selection" 
    | "transfer_method" 
    | "hrms_selection" 
    | "hrms_config" 
    | "connecting" 
    | "data_model" 
    | "success";

export function AddConnectionJourney({ onComplete, onCancel, onAddNewCorporate, corporateOptions, hrmsIntegrations }: AddConnectionJourneyProps) {
    const [step, setStep] = useState<Step>("selection");
    const [activeTab, setActiveTab] = useState<"invite" | "setup">("invite");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCorporate, setSelectedCorporate] = useState("");
    const [showCorporateDropdown, setShowCorporateDropdown] = useState(false);
    
    const [transferMethod, setTransferMethod] = useState<"hrms" | "csv" | "sftp">("hrms");
    const [hrmsSearch, setHrmsSearch] = useState("");
    const [selectedHrms, setSelectedHrms] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        referenceId: "",
        fullName: "",
        email: "",
        phone: "",
        sendInvite: false
    });

    const [configData, setConfigData] = useState({
        host: "",
        clientId: "",
        clientSecret: "",
        apiKey: "",
        confirmed: false,
        agreed: false
    });

    // Data Model State (Screenshot 2 style)
    // Data Model State
    const [expandedCategories, setExpandedCategories] = useState<string[]>(["Personal Information"]);
    const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({
        "Name": true,
        "Work Email": true,
        "Employee ID": true
    });

    const sectionParentInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    useLayoutEffect(() => {
        for (const cat of DATA_MODEL_SECTION_ORDER) {
            const el = sectionParentInputRefs.current[cat];
            if (!el) continue;
            el.indeterminate = getDataSectionTriState(cat, selectedFields) === "some";
        }
    }, [selectedFields]);

    const filteredCorporateOptions = corporateOptions.filter((o) =>
        o.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    useEffect(() => {
        if (!selectedCorporate) return;
        const opt = corporateOptions.find((o) => o.name === selectedCorporate);
        const ref = opt?.referenceId?.trim();
        setFormData((fd) => ({ ...fd, referenceId: ref ?? "" }));
    }, [selectedCorporate, corporateOptions]);

    const filteredHrms = hrmsIntegrations.filter(h => 
        h.name.toLowerCase().includes(hrmsSearch.toLowerCase())
    );

    useEffect(() => {
        if (step === "connecting") {
            const timer = setTimeout(() => {
                setStep("data_model");
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleNext = () => {
        if (step === "selection") {
            if (activeTab === "invite") setStep("success");
            else setStep("transfer_method");
        } else if (step === "transfer_method") {
            if (transferMethod === "hrms") setStep("hrms_selection");
            else setStep("success"); // Mock for CSV/SFTP
        } else if (step === "hrms_selection") {
            if (selectedHrms) setStep("hrms_config");
        } else if (step === "hrms_config") {
            setStep("connecting");
        } else if (step === "data_model") {
            setStep("success");
        } else if (step === "success") {
            const transferForPayload: "hrms" | "csv" | "sftp" = activeTab === "invite" ? "hrms" : transferMethod;
            onComplete({
                corporate: selectedCorporate,
                hrms: selectedHrms,
                transferMethod: transferForPayload,
                mode: activeTab,
            });
        }
    };

    const handleBack = () => {
        const flow: Step[] = ["selection", "transfer_method", "hrms_selection", "hrms_config", "data_model", "success"];
        const currentIndex = flow.indexOf(step);
        if (currentIndex > 0) {
            setStep(flow[currentIndex - 1]);
        } else {
            onCancel();
        }
    };

    const isNextDisabled = () => {
        if (step === "selection") return !selectedCorporate || !formData.email || !formData.fullName;
        if (step === "hrms_selection") return !selectedHrms;
        if (step === "hrms_config") return !configData.apiKey || !configData.clientId || !configData.confirmed || !configData.agreed;
        return false;
    };

    const toggleSectionExpanded = (cat: string) => {
        setExpandedCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
    };

    const toggleSectionParentCheckbox = (cat: string) => {
        const optional = getOptionalFieldsForDataSection(cat);
        if (optional.length === 0) return;
        const tri = getDataSectionTriState(cat, selectedFields);
        const turnOn = tri !== "all";
        setSelectedFields((prev) => {
            const next = { ...prev };
            for (const f of optional) {
                next[f] = turnOn;
            }
            return next;
        });
    };

    const toggleField = (field: string) => {
        setSelectedFields((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="flex flex-col h-full bg-[#FAFBFC]">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-8 px-1">
                <button onClick={onCancel} className="hover:text-dashboard-primary transition-colors">Dashboard</button>
                <span className="text-[#9CA3AF]">&rsaquo;</span>
                <span className={cn("transition-colors", step === "selection" ? "font-semibold text-[#111827]" : "hover:text-dashboard-primary")}>
                    {step === "selection" ? "Add New Connection" : <button onClick={() => setStep("selection")}>Add New Connection</button>}
                </span>
                {step !== "selection" && (
                    <>
                        <span className="text-[#9CA3AF]">&rsaquo;</span>
                        <span className="font-semibold text-[#111827]">
                            {step === "transfer_method" ? "Data Transfer Method" : 
                             step === "hrms_selection" ? "Select HRMS" : 
                             step === "hrms_config" || step === "connecting" ? "Configure" : 
                             step === "data_model" ? "Data Models" : "Invitation Sent"}
                        </span>
                    </>
                )}
            </div>

            <div className="max-w-5xl w-full mx-auto pb-10 flex-1 flex flex-col">
                <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col relative">
                    
                    {/* Connecting Overlay (Screenshot 3 style) */}
                    {step === "connecting" && (
                        <div className="absolute inset-0 z-50 bg-black/5 flex items-center justify-center p-6">
                            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center">
                                <h2 className="text-2xl font-bold text-[#111827] mb-8">Connecting {selectedHrms} With AU Bank</h2>
                                <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden relative">
                                    <div className="absolute inset-0 bg-dashboard-primary animate-progress-loading" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Header (Screenshot 1/4/5 style) */}
                    <div className={cn(
                        "px-8 py-6 border-b border-[#E5E7EB] flex items-center justify-between shrink-0",
                        step === "connecting" && "blur-sm"
                    )}>
                        <h1 className="text-xl font-bold text-[#111827]">
                            {step === "selection" ? "Add New Connection" : 
                             step === "transfer_method" ? "Data Transfer Method" :
                             step === "hrms_selection" ? "Select Your HRMS Platform" : 
                             step === "hrms_config" ? "Configure HRMS Connection" :
                             step === "data_model" ? "Configure Data Sync" :
                             "Success!"}
                        </h1>
                        {step === "selection" && (
                            <button 
                                onClick={onAddNewCorporate}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#3B82F6] text-[#3B82F6] text-sm font-semibold hover:bg-[#F0F7FF] transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add New Corporate
                            </button>
                        )}
                    </div>

                    <div className={cn("p-8 flex-1 overflow-y-auto", step === "connecting" && "blur-sm")}>
                        
                        {/* Step: Selection */}
                        {step === "selection" && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex p-1 bg-[#F3F4F6] rounded-xl w-fit mb-8">
                                    <button onClick={() => setActiveTab("invite")} className={cn("px-6 py-2 rounded-lg text-sm font-semibold transition-all", activeTab === "invite" ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#374151]")}>Invite Corporate</button>
                                    <button onClick={() => setActiveTab("setup")} className={cn("px-6 py-2 rounded-lg text-sm font-semibold transition-all", activeTab === "setup" ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#374151]")}>Set Up Myself</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="relative">
                                        <label className="block text-sm font-semibold text-[#374151] mb-2">Corporate Name *</label>
                                        <button onClick={() => setShowCorporateDropdown(!showCorporateDropdown)} className="w-full h-11 px-4 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl flex items-center justify-between text-sm text-[#111827]">
                                            <div className="flex items-center gap-2"><Plus className="w-4 h-4 text-[#9CA3AF]" /><span>{selectedCorporate || "Select corporate"}</span></div>
                                            <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                                        </button>
                                        {showCorporateDropdown && (
                                            <div className="absolute z-10 left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden">
                                                <div className="p-2 border-b border-[#E5E7EB]"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" /><input autoFocus placeholder="Search" value={searchQuery} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} className="w-full h-9 pl-9 pr-4 text-sm outline-none" /></div></div>
                                                <div className="max-h-60 overflow-y-auto">{filteredCorporateOptions.map((o) => (<button key={o.name} type="button" onClick={() => { setSelectedCorporate(o.name); setShowCorporateDropdown(false); }} className="w-full px-4 py-2.5 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors">{o.name}</button>))}</div>
                                            </div>
                                        )}
                                    </div>
                                    <div><label className="flex items-center gap-1 text-sm font-semibold text-[#374151] mb-2">Corporate Reference ID * <Info className="w-4 h-4 text-[#9CA3AF]" /></label>
                                        <div className="relative"><input type="text" placeholder="Enter reference ID" value={formData.referenceId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, referenceId: e.target.value})} className="w-full h-11 px-11 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/20 transition-all" /><div className="absolute left-4 top-1/2 -translate-y-1/2"><Plus className="w-4 h-4 text-[#9CA3AF]" /></div></div>
                                    </div>
                                    <div><label className="block text-sm font-semibold text-[#374151] mb-2">Full Name *</label>
                                        <div className="relative"><input type="text" placeholder="Enter full name" value={formData.fullName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, fullName: e.target.value})} className="w-full h-11 px-11 bg-white border border-[#E5E7EB] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/20 transition-all" /><div className="absolute left-4 top-1/2 -translate-y-1/2"><Plus className="w-4 h-4 text-[#9CA3AF]" /></div></div>
                                    </div>
                                    <div><label className="block text-sm font-semibold text-[#374151] mb-2">Email Address *</label>
                                        <div className="relative"><input type="email" placeholder="name@company.com" value={formData.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})} className="w-full h-11 px-11 bg-white border border-[#E5E7EB] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/20 transition-all" /><div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">@</div></div>
                                    </div>
                                    <div><label className="block text-sm font-semibold text-[#374151] mb-2">Phone Number</label>
                                        <div className="flex gap-2"><div className="flex items-center gap-2 px-3 h-11 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#374151] shrink-0"><Globe className="w-4 h-4 text-[#9CA3AF]" /><span>+91</span><ChevronDown className="w-3 h-3 text-[#6B7280]" /></div><input type="tel" placeholder="Enter mobile number" value={formData.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, phone: e.target.value})} className="flex-1 h-11 px-4 bg-white border border-[#E5E7EB] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/20 transition-all" /></div>
                                    </div>
                                    <div className="md:col-span-2 flex items-center gap-3 pt-2">
                                        <span className="text-sm text-[#374151]">Send invite email to corporate</span>
                                        <button onClick={() => setFormData({...formData, sendInvite: !formData.sendInvite})} className={cn("w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none", formData.sendInvite ? "bg-[#3B82F6]" : "bg-[#E5E7EB]")}><div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200", formData.sendInvite ? "left-6" : "left-1")} /></button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step: Data Transfer Method (Screenshot 5 style) */}
                        {step === "transfer_method" && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6 max-w-4xl mx-auto">
                                <button 
                                    onClick={() => setTransferMethod("hrms")}
                                    className={cn(
                                        "w-full p-6 border-2 rounded-2xl flex items-center gap-6 text-left transition-all",
                                        transferMethod === "hrms" ? "border-dashboard-primary bg-dashboard-primary/[0.03]" : "border-[#E5E7EB] bg-white hover:border-[#E5E7EB] hover:bg-[#F9FAFB]"
                                    )}
                                >
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", transferMethod === "hrms" ? "bg-dashboard-primary/10 text-dashboard-primary" : "bg-[#F3F4F6] text-[#6B7280]")}>
                                        <RefreshCcw className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-[#111827]">HRMS Integration</h3>
                                        <p className="text-sm text-[#6B7280] mt-1">Connect your HRMS for seamless, automated data transfer. Supports major platforms like SAP, Workday, BambooHR and more.</p>
                                    </div>
                                    <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center", transferMethod === "hrms" ? "border-dashboard-primary bg-dashboard-primary" : "border-[#E5E7EB]")}>
                                        {transferMethod === "hrms" && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                </button>

                                <button 
                                    onClick={() => setTransferMethod("csv")}
                                    className={cn(
                                        "w-full p-6 border-2 rounded-2xl flex items-center gap-6 text-left transition-all",
                                        transferMethod === "csv" ? "border-dashboard-primary bg-dashboard-primary/[0.03]" : "border-[#E5E7EB] bg-white hover:border-[#E5E7EB] hover:bg-[#F9FAFB]"
                                    )}
                                >
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", transferMethod === "csv" ? "bg-dashboard-primary/10 text-dashboard-primary" : "bg-[#F3F4F6] text-[#6B7280]")}>
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-[#111827]">Upload CSV</h3>
                                        <p className="text-sm text-[#6B7280] mt-1">Quickly upload your data using CSV files. Download our template, fill in your data, and upload, simple and fast.</p>
                                    </div>
                                    <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center", transferMethod === "csv" ? "border-dashboard-primary bg-dashboard-primary" : "border-[#E5E7EB]")}>
                                        {transferMethod === "csv" && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                </button>

                                <button 
                                    onClick={() => setTransferMethod("sftp")}
                                    className={cn(
                                        "w-full p-6 border-2 rounded-2xl flex items-center gap-6 text-left transition-all",
                                        transferMethod === "sftp" ? "border-dashboard-primary bg-dashboard-primary/[0.03]" : "border-[#E5E7EB] bg-white hover:border-[#E5E7EB] hover:bg-[#F9FAFB]"
                                    )}
                                >
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", transferMethod === "sftp" ? "bg-dashboard-primary/10 text-dashboard-primary" : "bg-[#F3F4F6] text-[#6B7280]")}>
                                        <Server className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-[#111827]">SFTP Transfer</h3>
                                        <p className="text-sm text-[#6B7280] mt-1">Upload files securely via SFTP for automated ingestion. Scheduled pickups and encrypted file transfer included.</p>
                                    </div>
                                    <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center", transferMethod === "sftp" ? "border-dashboard-primary bg-dashboard-primary" : "border-[#E5E7EB]")}>
                                        {transferMethod === "sftp" && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                </button>
                            </div>
                        )}

                        {/* Step: HRMS Selection (Screenshot 1 style) */}
                        {step === "hrms_selection" && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8 max-w-5xl mx-auto">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="relative flex-1 max-w-xl">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                                        <input 
                                            placeholder="Search HRMS"
                                            value={hrmsSearch}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHrmsSearch(e.target.value)}
                                            className="w-full h-11 pl-12 pr-4 bg-white border border-[#E5E7EB] rounded-xl text-sm outline-none shadow-sm"
                                        />
                                    </div>
                                    <div className="text-sm text-[#6B7280]">Can&apos;t find your HRMS? <button className="text-dashboard-primary font-bold hover:underline">click here</button></div>
                                </div>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {filteredHrms.slice(0, 24).map((h) => (
                                        <button 
                                            key={h.name}
                                            onClick={() => setSelectedHrms(h.name)}
                                            className={cn(
                                                "p-4 border rounded-2xl flex flex-col items-center justify-center text-center gap-4 transition-all h-36 relative group",
                                                selectedHrms === h.name ? "border-dashboard-primary bg-dashboard-primary/[0.03] shadow-md ring-2 ring-dashboard-primary/20" : "border-[#E5E7EB] bg-white hover:border-dashboard-primary/30"
                                            )}
                                        >
                                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full border-2 border-[#E5E7EB] flex items-center justify-center group-hover:border-dashboard-primary/30 transition-colors">
                                                {selectedHrms === h.name && <div className="w-2.5 h-2.5 rounded-full bg-dashboard-primary" />}
                                            </div>
                                            <div className="w-12 h-12 rounded-xl bg-white border border-[#F3F4F6] shadow-sm flex items-center justify-center p-2 shrink-0">
                                                <div className="w-full h-full rounded bg-slate-50 flex items-center justify-center text-[10px] font-bold text-[#9CA3AF] uppercase">
                                                    {h.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold text-[#111827] truncate w-full px-2">{h.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step: HRMS Config (Screenshot 4 style) */}
                        {step === "hrms_config" && (() => {
                            const getHelpDocUrl = (hrmsName: string | null) => {
                                if (!hrmsName) return null;
                                const lower = hrmsName.toLowerCase();
                                if (lower.includes("keka")) return "/docs/keka.pdf";
                                if (lower.includes("greythr")) return "/docs/greythr.pdf";
                                if (lower.includes("darwinbox")) return "/docs/darwinbox.pdf";
                                if (lower.includes("zoho")) return "/docs/zoho.pdf";
                                return null;
                            };
                            const helpDocUrl = getHelpDocUrl(selectedHrms);

                            return (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl mx-auto space-y-10 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex items-center gap-6 w-fit shadow-sm">
                                            <div className="w-16 h-16 rounded-xl bg-white border border-[#F3F4F6] shadow-sm flex items-center justify-center p-2 shrink-0">
                                                <div className="w-full h-full rounded bg-slate-50 flex items-center justify-center text-xs font-bold text-[#9CA3AF] uppercase">
                                                    {selectedHrms?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                            </div>
                                            <h2 className="text-xl font-bold text-[#111827]">{selectedHrms}</h2>
                                        </div>
                                        {helpDocUrl && (
                                            <a 
                                                href={helpDocUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-[#6B7280]"
                                            >
                                                Don&apos;t know your credentials? <span className="text-dashboard-primary font-bold hover:underline">Click here</span>
                                            </a>
                                        )}
                                    </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-[#374151] mb-2">HRMS host</label>
                                        <input 
                                            type="text"
                                            placeholder={`tartan.${selectedHrms?.toLowerCase().replace(/\s+/g, '')}.com`}
                                            value={configData.host}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfigData({...configData, host: e.target.value})}
                                            className="w-full h-12 px-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-dashboard-primary/10 transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-[#374151] mb-2">Client ID</label>
                                            <input 
                                                type="text"
                                                placeholder="Enter Client ID"
                                                value={configData.clientId}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfigData({...configData, clientId: e.target.value})}
                                                className="w-full h-12 px-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-dashboard-primary/10 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[#374151] mb-2">Client Secret</label>
                                            <input 
                                                type="password"
                                                placeholder="Enter Client Secret"
                                                value={configData.clientSecret}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfigData({...configData, clientSecret: e.target.value})}
                                                className="w-full h-12 px-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-dashboard-primary/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#374151] mb-2">API Key</label>
                                        <input 
                                            type="password"
                                            placeholder="Enter API Key"
                                            value={configData.apiKey}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfigData({...configData, apiKey: e.target.value})}
                                            className="w-full h-12 px-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-dashboard-primary/10 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center mt-0.5">
                                            <input 
                                                type="checkbox" 
                                                checked={configData.confirmed}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfigData({...configData, confirmed: e.target.checked})}
                                                className="sr-only"
                                            />
                                            <div className={cn("w-5 h-5 rounded border-2 transition-all", configData.confirmed ? "bg-dashboard-primary border-dashboard-primary" : "bg-white border-[#D1D5DB] group-hover:border-dashboard-primary/50")} />
                                            {configData.confirmed && <Check className="absolute w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <span className="text-sm text-[#6B7280]">I confirm that I have permission from {selectedCorporate} to complete this process on their behalf.</span>
                                    </label>
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center mt-0.5">
                                            <input 
                                                type="checkbox" 
                                                checked={configData.agreed}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfigData({...configData, agreed: e.target.checked})}
                                                className="sr-only"
                                            />
                                            <div className={cn("w-5 h-5 rounded border-2 transition-all", configData.agreed ? "bg-dashboard-primary border-dashboard-primary" : "bg-white border-[#D1D5DB] group-hover:border-dashboard-primary/50")} />
                                            {configData.agreed && <Check className="absolute w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <span className="text-sm text-[#6B7280]">By checking this box, you are agreeing to our <button className="text-dashboard-primary font-bold hover:underline">terms & conditions</button></span>
                                    </label>
                                </div>
                            </div>
                            );
                        })()}

                        {/* Step: Data Model Config (Screenshot 2 style) */}
                        {step === "data_model" && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-5xl mx-auto space-y-6">
                                <div className="p-4 bg-dashboard-primary/[0.03] border border-dashboard-primary/10 rounded-xl mb-8 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-dashboard-primary/10 text-dashboard-primary flex items-center justify-center shrink-0">
                                        <Info className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm text-[#374151]">Configure the data points you want to sync from <strong>{selectedHrms}</strong>. You can update these later in Data Models.</p>
                                </div>

                                {DATA_MODEL_SECTION_ORDER.map((cat) => {
                                    const tri = getDataSectionTriState(cat, selectedFields);
                                    const optionalFields = getOptionalFieldsForDataSection(cat);
                                    const hasOptionalFields = optionalFields.length > 0;
                                    const expanded = expandedCategories.includes(cat);
                                    const parentChecked = hasOptionalFields && tri === "all";
                                    return (
                                    <div key={cat} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
                                        <div className="px-6 py-4 bg-[#F9FAFB] flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-4 min-w-0 flex-1">
                                                <label
                                                    className={cn(
                                                        "relative inline-flex shrink-0 items-center justify-center rounded",
                                                        !hasOptionalFields ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                                                    )}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <input
                                                        ref={(el) => {
                                                            sectionParentInputRefs.current[cat] = el;
                                                        }}
                                                        type="checkbox"
                                                        className="sr-only"
                                                        checked={parentChecked}
                                                        disabled={!hasOptionalFields}
                                                        onChange={() => toggleSectionParentCheckbox(cat)}
                                                        aria-label={`Select all fields in ${cat}`}
                                                    />
                                                    <span
                                                        className={cn(
                                                            "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
                                                            tri === "all" && "border-dashboard-primary bg-dashboard-primary",
                                                            tri === "none" && "border-[#D1D5DB] bg-white",
                                                            tri === "some" && "border-dashboard-primary/50 bg-dashboard-primary/10",
                                                        )}
                                                        aria-hidden
                                                    >
                                                        {tri === "all" && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                                                        {tri === "some" && <span className="h-0.5 w-2.5 rounded-full bg-dashboard-primary" />}
                                                    </span>
                                                </label>
                                                <button type="button" className="min-w-0 flex-1 text-left" onClick={() => toggleSectionExpanded(cat)}>
                                                    <h3 className="font-bold text-[#111827]">{cat}</h3>
                                                    <p className="text-xs text-[#6B7280]">Configure {cat.toLowerCase()} sync fields</p>
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                className="shrink-0 rounded-lg p-1 text-[#6B7280] transition-colors hover:bg-[#E5E7EB]/60"
                                                aria-expanded={expanded}
                                                aria-label={expanded ? "Collapse section" : "Expand section"}
                                                onClick={() => toggleSectionExpanded(cat)}
                                            >
                                                {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {expanded && (
                                            <div className="border-t border-[#E5E7EB] p-8">
                                                {cat === "Salary Details" && (
                                                    <div className="space-y-6">
                                                        <div className="flex items-center gap-3 border-b border-[#F3F4F6] pb-4">
                                                            <span className="font-bold text-[#111827]">CTC</span>
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 md:grid-cols-4">
                                                            {SALARY_DETAIL_FIELDS_LIST.map((field) => (
                                                                <label key={field} className="group flex cursor-pointer items-center justify-between">
                                                                    <span className="text-sm text-[#374151] transition-colors group-hover:text-dashboard-primary">{field}</span>
                                                                    <div className="relative flex items-center justify-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="sr-only"
                                                                            checked={!!selectedFields[field]}
                                                                            onChange={() => toggleField(field)}
                                                                        />
                                                                        <div className={cn("w-5 h-5 rounded border-2 transition-all", selectedFields[field] ? "border-dashboard-primary/30 bg-dashboard-primary/10" : "border-[#E5E7EB] bg-white group-hover:border-dashboard-primary/30")} />
                                                                        {selectedFields[field] && <div className="absolute h-2 w-2 rounded-full bg-dashboard-primary" />}
                                                                    </div>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {cat === "Personal Information" && (
                                                    <div className="space-y-6">
                                                        <div className="flex items-center gap-3 border-b border-[#F3F4F6] pb-4">
                                                            <span className="font-bold text-[#111827]">Personal Info</span>
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 md:grid-cols-4">
                                                            {PERSONAL_INFO_FIELDS_LIST.map((field) => {
                                                                const isMandatory = PERSONAL_MANDATORY_FIELDS.has(field);
                                                                return (
                                                                    <label
                                                                        key={field}
                                                                        className={cn("group flex items-center justify-between", isMandatory ? "cursor-not-allowed opacity-80" : "cursor-pointer")}
                                                                    >
                                                                        <div className="flex flex-col">
                                                                            <span className={cn("text-sm text-[#374151] transition-colors", !isMandatory && "group-hover:text-dashboard-primary")}>{field}</span>
                                                                            {isMandatory && <span className="mt-0.5 text-[10px] font-medium text-dashboard-primary">Mandatory</span>}
                                                                        </div>
                                                                        <div className="relative flex items-center justify-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="sr-only"
                                                                                checked={!!selectedFields[field] || isMandatory}
                                                                                onChange={() => !isMandatory && toggleField(field)}
                                                                                disabled={isMandatory}
                                                                            />
                                                                            <div className={cn("w-5 h-5 rounded border-2 transition-all", (selectedFields[field] || isMandatory) ? "border-dashboard-primary/30 bg-dashboard-primary/10" : "border-[#E5E7EB] bg-white", !isMandatory && "group-hover:border-dashboard-primary/30")} />
                                                                            {(selectedFields[field] || isMandatory) && <div className="absolute h-2 w-2 rounded-full bg-dashboard-primary" />}
                                                                        </div>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                                {cat !== "Salary Details" && cat !== "Personal Information" && (
                                                    <div className="py-4 text-center text-sm text-[#6B7280]">
                                                        Additional fields for {cat} can be configured here.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    );
                                })}
                            </div>
                        )}

                        {step === "success" && (
                            <div className="flex flex-col items-center justify-center h-full text-center py-10 animate-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 rounded-full bg-[#ECFDF5] flex items-center justify-center mb-6 shadow-sm border border-[#D1FAE5]">
                                    <CheckCircle2 className="w-10 h-10 text-[#059669]" />
                                </div>
                                <h2 className="text-3xl font-bold text-[#111827] mb-3">
                                    {activeTab === "invite" ? "Invitation Sent!" : "Connection Established!"}
                                </h2>
                                <p className="text-[#6B7280] max-w-sm text-lg leading-relaxed">
                                    {activeTab === "invite" 
                                        ? `An invitation email has been sent to ${formData.fullName} at ${selectedCorporate}.`
                                        : `Your connection with ${selectedHrms} for ${selectedCorporate} is now live and syncing data.`}
                                </p>
                                
                                <div className="mt-12 p-8 bg-[#F9FAFB] rounded-3xl border border-[#E5E7EB] w-full max-w-lg shadow-sm">
                                    <h3 className="text-sm font-bold text-[#111827] mb-6 text-left uppercase tracking-widest">Next Recommended Steps</h3>
                                    <div className="space-y-6 text-left">
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center font-bold text-dashboard-primary shadow-sm">1</div>
                                            <div>
                                                <p className="text-sm font-bold text-[#111827]">Verify Initial Sync</p>
                                                <p className="text-xs text-[#6B7280] mt-0.5">Check the Diagnostics tab to monitor data flow.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center font-bold text-dashboard-primary shadow-sm">2</div>
                                            <div>
                                                <p className="text-sm font-bold text-[#111827]">Configure Webhooks</p>
                                                <p className="text-xs text-[#6B7280] mt-0.5">Set up real-time event notifications for new employees.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Actions (Screenshot 1 style) */}
                    <div className={cn(
                        "px-10 py-6 border-t border-[#E5E7EB] bg-white flex items-center justify-between shrink-0",
                        step === "connecting" && "blur-sm"
                    )}>
                        <button 
                            onClick={handleBack}
                            className="h-12 px-8 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        <button 
                            onClick={handleNext}
                            disabled={isNextDisabled()}
                            className={cn(
                                "h-12 px-10 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm",
                                isNextDisabled() ? "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed" : "bg-dashboard-primary text-white hover:opacity-90 active:scale-[0.98]"
                            )}
                        >
                            {step === "success" ? "Done" : step === "data_model" ? "Save & Next" : "Next"}
                            {step !== "success" && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes progress-loading {
                    0% { left: -100%; width: 100%; }
                    50% { left: 0%; width: 100%; }
                    100% { left: 100%; width: 100%; }
                }
                .animate-progress-loading {
                    animation: progress-loading 2s infinite ease-in-out;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D1D5DB;
                }
            `}</style>
        </div>
    );
}
