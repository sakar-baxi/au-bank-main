"use client";

import React from "react";
import {
    Link2,
    PieChart,
    Building2,
    Webhook,
    Search,
    Download,
    Filter,
    RefreshCcw,
    ArrowLeft,
    CheckCircle2,
    Check,
    Clock,
    X,
    Users,
    XCircle,
    Rocket,
    Infinity,
    Plus,
    Send,
    Pencil,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronsUpDown,
    Package,
    HelpCircle,
    ShieldCheck,
    PiggyBank,
    BarChart3,
    TrendingUp,
    Tractor,
    Truck,
    Car,
    Home,
    FileText,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DATA_MODELS_RESPONSE } from "@/lib/dataModelsConfig";
import {
    StatCard,
    HeaderCell,
    getJourneyCategory,
    getStatusBadge,
    employeeEligibleForRmNudge,
} from "./DashboardShared";
import ProductMarketplaceDashboard from "./shared/ProductMarketplaceDashboard";
import { usePortal } from "@/app/context/PortalContext";
import { getSyncTimestamp, getTriggers, getSyncedEmployees, getPendingUpdates, clearPendingUpdates, setEmployeeOfferNotification, getLatestRmNudgeForEmployee, type RmNudgeMode } from "@/lib/hrmsSync";
import RmEmployeeNudgeMenu from "@/app/components/rm/RmEmployeeNudgeMenu";
import { SbiSidebarSymbol } from "@/app/components/branding/SbiOfficialLogo";

const ITEMS_PER_PAGE = 10;
const CONNECTIONS_PER_PAGE = 10;

/** Personal loan journey step order for funnel and smart document collector (MMFSL). */
const PERSONAL_LOAN_STEP_ORDER = [
    "personal-loan:verifyDetails",
    "personal-loan:bureauConsent",
    "personal-loan:selectPlan",
    "personal-loan:kycVerification",
    "personal-loan:disbursalAccount",
    "personal-loan:enachSetup",
    "personal-loan:submitApplication",
    "personal-loan:complete",
] as const;
const PERSONAL_LOAN_STEP_LABELS: Record<string, string> = {
    "personal-loan:verifyDetails": "Verify details",
    "personal-loan:bureauConsent": "Bureau consent",
    "personal-loan:selectPlan": "Select plan",
    "personal-loan:kycVerification": "KYC verification",
    "personal-loan:disbursalAccount": "Disbursal account",
    "personal-loan:enachSetup": "eNACH setup",
    "personal-loan:submitApplication": "Submit application",
    "personal-loan:complete": "Complete",
};

const maskName = (name: string) => {
    if (!name) return "***";
    const parts = name.split(" ");
    return parts.map(p => p[0] + "***").join(" ");
};

type DataModelField = { display_name: string; is_checked?: boolean };
type DataModelCategory = Record<string, DataModelField>;
type DataModelsData = Record<string, DataModelCategory>;

export type PageKey = "dashboard" | "connections" | "reporting" | "corporates" | "integrations" | "data-models" | "webhooks" | "diagnostics" | "rm-employees" | "rm-products" | "rm-analytics" | "hr-overview" | "hr-employees";
export type TabKey = "directory" | "accountOpened" | "analytics";

// Minimal interface - accepts any Employee-like object
export interface Employee {
    id: string;
    name: string;
    phone: string;
    email: string;
    journey: string;
    companyName?: string;
}

export interface JourneyStatus {
    status?: "in_progress" | "completed";
    currentStepTitle?: string;
}

export interface DashboardPageContentProps<TEmployee extends Employee = Employee, TStatus extends JourneyStatus = JourneyStatus> {
    activePage: PageKey;
    activeTab: TabKey;
    setActiveTab: (t: TabKey) => void;
    selectedCorporate: string | null;
    setSelectedCorporate: (c: string | null) => void;
    employees: TEmployee[];
    employeeStatuses: Record<string, TStatus>;
    invitedEmployeeIds: Record<string, boolean>;
    filterEmployees: (list: TEmployee[]) => TEmployee[];
    refreshStatuses: () => void;
    handleInvite: (emp: TEmployee) => void;
    handleRefreshInvites: () => void;
    searchQuery: string;
    setSearchQuery: (s: string) => void;
    directoryPage: number;
    setDirectoryPage: (n: number) => void;
    accountOpenedPage: number;
    setAccountOpenedPage: (n: number) => void;
    setSelectedEmployee: (e: TEmployee | null) => void;
    corporates: readonly string[];
    corporatesTableData: Array<{ corporateName: string; categories: string; connections: string; status: string; contactName: string; dateAdded: string; corpCategory?: string; kybStatus?: string }>;
    connections: Array<{ id: string; corporate: string; dateOfConnection: string; integration: string; csm: string; lastSynced: string; syncFreq: string; status: string; stepsStatus: string }>;
    hrmsIntegrations: Array<{ name: string; type: string }>;
    diagnostics: Array<{ corporate: string; connectionType: string; dataPosting: string; dataReceiving: string; authStatus: string }>;
    portalMode?: "hr" | "rm" | "employee";
    onAddNewCorporate?: () => void;
    onAddNewConnection?: () => void;
    onNavigate?: (page: PageKey) => void;
    onHrSyncNow?: () => void;
    lastHrSyncAt?: string | null;
    /** FTNR case management: retrigger journey from where employee left off */
    onRetriggerJourney?: (emp: TEmployee) => void;
    /** Productized RM nudge: WhatsApp / SMS / Email (+ in-app notification for employee). */
    onSendRmNudge?: (emp: TEmployee, mode: RmNudgeMode) => void;
    sendingRmNudgeEmployeeId?: string | null;
    rmNudgeSendingMode?: RmNudgeMode | null;
}

export function DashboardPageContent<TEmployee extends Employee = Employee, TStatus extends JourneyStatus = JourneyStatus>(props: DashboardPageContentProps<TEmployee, TStatus>) {
    const {
        activePage,
        activeTab,
        setActiveTab,
        selectedCorporate,
        setSelectedCorporate,
        employees,
        employeeStatuses,
        invitedEmployeeIds,
        filterEmployees,
        refreshStatuses,
        handleInvite,
        handleRefreshInvites,
        searchQuery,
        setSearchQuery,
        directoryPage,
        setDirectoryPage,
        accountOpenedPage,
        setAccountOpenedPage,
        setSelectedEmployee,
        corporates,
        corporatesTableData,
        connections,
        hrmsIntegrations,
        diagnostics,
        portalMode = "hr",
        onAddNewCorporate,
        onAddNewConnection,
        onNavigate,
        onHrSyncNow,
        lastHrSyncAt,
        onRetriggerJourney,
        onSendRmNudge,
        sendingRmNudgeEmployeeId,
        rmNudgeSendingMode,
    } = props;

    const [rmNudgeListTick, setRmNudgeListTick] = React.useState(0);
    React.useEffect(() => {
        const bump = () => setRmNudgeListTick((t) => t + 1);
        window.addEventListener("mmfsl-rm-nudge-updated", bump);
        return () => window.removeEventListener("mmfsl-rm-nudge-updated", bump);
    }, []);

    const [connectionsPage, setConnectionsPage] = React.useState(1);
    const connectionsTotalPages = Math.ceil(connections.length / CONNECTIONS_PER_PAGE);
    const paginatedConnections = connections.slice((connectionsPage - 1) * CONNECTIONS_PER_PAGE, connectionsPage * CONNECTIONS_PER_PAGE);

    const [corporatesSearch, setCorporatesSearch] = React.useState("");
    const [corporatesPage, setCorporatesPage] = React.useState(1);
    const filteredCorporates = corporatesSearch.trim()
        ? corporatesTableData.filter((c) => c.corporateName.toLowerCase().includes(corporatesSearch.toLowerCase()))
        : corporatesTableData;
    const corporatesTotalPages = Math.max(1, Math.ceil(filteredCorporates.length / 10));
    const paginatedCorporates = filteredCorporates.slice((corporatesPage - 1) * 10, corporatesPage * 10);

    const [diagPage, setDiagPage] = React.useState(1);
    const diagPerPage = 10;
    const diagTotalPages = Math.ceil(diagnostics.length / diagPerPage);
    const paginatedDiag = diagnostics.slice((diagPage - 1) * diagPerPage, diagPage * diagPerPage);

    const [dataModelState, setDataModelState] = React.useState(() => {
        type FieldDef = { display_name: string; is_checked?: boolean };
        type InnerMap = Record<string, FieldDef>;
        type DataModels = { data: Record<string, InnerMap> };
        const d = (DATA_MODELS_RESPONSE as unknown as DataModels).data;
        const state: Record<string, Record<string, boolean>> = {};
        for (const [cat, fields] of Object.entries(d)) {
            if (cat === "configuration" || typeof fields !== "object") continue;
            state[cat] = {};
            for (const [key, val] of Object.entries(fields)) {
                if (val && typeof val === "object" && "is_checked" in val) {
                    (state[cat] as Record<string, boolean>)[key] = (val as { is_checked?: boolean }).is_checked ?? false;
                }
            }
        }
        return state;
    });
    const dataModelsData: DataModelsData = (DATA_MODELS_RESPONSE as unknown as { data: DataModelsData }).data;

    const [webhookEndpoint, setWebhookEndpoint] = React.useState("play.svix.com/in/e_FiJHkybMzmuaaieoRZ07aQ3CAod/");
    const [webhookEvents, setWebhookEvents] = React.useState<Record<string, boolean>>({ "Sync process started": true, "New employee added": true });
    const [hrDeptFilter, setHrDeptFilter] = React.useState("All Departments");
    const [hrStatusFilter, setHrStatusFilter] = React.useState("All Status");
    const [hrScoreFilter, setHrScoreFilter] = React.useState("All Scores");
    const [hrSearch, setHrSearch] = React.useState("");
    const [corporateServicesDropdownOpen, setCorporateServicesDropdownOpen] = React.useState(false);
    const [corporateBenefitToggles, setCorporateBenefitToggles] = React.useState<Record<string, Record<number, boolean>>>(() => {
        if (typeof window === "undefined") return {};
        try {
            const raw = localStorage.getItem("hdfc_corporate_benefit_toggles");
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    });

    // HR Manage employees: tabs, shared state, selection, modals
    const [hrEmployeesMainTab, setHrEmployeesMainTab] = React.useState<"directory" | "updates" | "manage" | "mmfsl-loans">("directory");
    const [manageSubTab, setManageSubTab] = React.useState<"shared" | "unshared">("unshared");
    const [sharedEmployeeIds, setSharedEmployeeIds] = React.useState<Record<string, boolean>>(() => {
        if (typeof window === "undefined") return {};
        try {
            const raw = localStorage.getItem("hdfc_hr_shared_employee_ids");
            return raw ? JSON.parse(raw) : {};
        } catch { return {}; }
    });
    const [selectedForShare, setSelectedForShare] = React.useState<Record<string, boolean>>({});
    const [showColumnFilterModal, setShowColumnFilterModal] = React.useState(false);
    const [showShareConfirmModal, setShowShareConfirmModal] = React.useState(false);
    const [visibleOptionalColumns, setVisibleOptionalColumns] = React.useState<string[]>([]);
    const [manageSearchQuery, setManageSearchQuery] = React.useState("");
    const [managePage, setManagePage] = React.useState(1);
    const [columnFilterSearch, setColumnFilterSearch] = React.useState("");
    const [hrmsSearch, setHrmsSearch] = React.useState("");
    const [showHrmsRequestModal, setShowHrmsRequestModal] = React.useState(false);
    const [hrmsRequestName, setHrmsRequestName] = React.useState("");
    const [hrmsRequestUrl, setHrmsRequestUrl] = React.useState("");
    const [hrmsRequestMessage, setHrmsRequestMessage] = React.useState("");
    const [rmTenureFilter, setRmTenureFilter] = React.useState<string>("");
    const [rmAgeFilter, setRmAgeFilter] = React.useState<string>("");
    const [rmGradeFilter, setRmGradeFilter] = React.useState<string>("");
    const [rmIncomeFilter, setRmIncomeFilter] = React.useState<string>("");
    const [rmDeptFilter, setRmDeptFilter] = React.useState<string>("");
    const [selectedEmployeeForUpdates, setSelectedEmployeeForUpdates] = React.useState<TEmployee | null>(null);

    const { portalMode: portalModeFromContext } = usePortal();
    /** RM employee directory features must not depend on a stale `portalMode` prop alone. */
    const isRmEmployeeDirectory = portalModeFromContext === "rm" || portalMode === "rm";

    const [mmfslSearch, setMmfslSearch] = React.useState("");
    const [mmfslProductFilter, setMmfslProductFilter] = React.useState("All Products");
    const [mmfslDisbursalFilter, setMmfslDisbursalFilter] = React.useState("All Status");

    const applyRmFilters = React.useCallback((list: TEmployee[]) => {
        let out = list;
        if (rmTenureFilter) {
            const now = new Date();
            out = out.filter((e) => {
                const doj = (e as Record<string, unknown>).dateOfJoining as string | undefined;
                if (!doj) return true;
                const [y, m] = doj.split("-").map(Number);
                const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
                if (rmTenureFilter === "<12") return months < 12;
                if (rmTenureFilter === "12-24") return months >= 12 && months <= 24;
                if (rmTenureFilter === ">24") return months > 24;
                return true;
            });
        }
        if (rmAgeFilter) {
            out = out.filter((e) => {
                const dob = (e as Record<string, unknown>).dob as string | undefined;
                if (!dob) return true;
                const birthYear = parseInt(dob.slice(0, 4), 10);
                const age = new Date().getFullYear() - birthYear;
                if (rmAgeFilter === "25-35") return age >= 25 && age <= 35;
                if (rmAgeFilter === "35-45") return age >= 35 && age <= 45;
                if (rmAgeFilter === ">45") return age > 45;
                return true;
            });
        }
        if (rmGradeFilter) out = out.filter((e) => ((e as Record<string, unknown>).grade as string) === rmGradeFilter || !(e as Record<string, unknown>).grade);
        if (rmIncomeFilter) out = out.filter((e) => ((e as Record<string, unknown>).income as string) === rmIncomeFilter || !(e as Record<string, unknown>).income);
        if (rmDeptFilter) out = out.filter((e) => ((e as Record<string, unknown>).department as string) === rmDeptFilter || !(e as Record<string, unknown>).department);
        return out;
    }, [rmTenureFilter, rmAgeFilter, rmGradeFilter, rmIncomeFilter, rmDeptFilter]);

    const employeesForCorporateView = React.useMemo(() => {
        if (!selectedCorporate) return employees;
        const matched = employees.filter((e) => (e.companyName || "Chola Business Services") === selectedCorporate);
        if (matched.length > 0) return matched;
        if (portalMode === "hr") return matched;
        return employees.map((e) => ({ ...e, companyName: selectedCorporate }));
    }, [selectedCorporate, employees, portalMode]);

    const allFiltered = filterEmployees(employees);
    const completedEmployees = filterEmployees(employees.filter((e) => employeeStatuses[e.id]?.status === "completed"));
    const corpEmployees = selectedCorporate ? filterEmployees(employeesForCorporateView) : [];
    const corpCompleted = selectedCorporate ? filterEmployees(employeesForCorporateView.filter((e) => employeeStatuses[e.id]?.status === "completed")) : [];
    const baseList = activeTab === "accountOpened" ? (selectedCorporate ? corpCompleted : completedEmployees) : activeTab === "analytics" ? (selectedCorporate ? corpEmployees : allFiltered) : (selectedCorporate ? corpEmployees : allFiltered);
    const currentList = isRmEmployeeDirectory && (rmTenureFilter || rmAgeFilter || rmGradeFilter || rmIncomeFilter || rmDeptFilter) ? applyRmFilters(baseList) : baseList;
    const analyticsList = selectedCorporate ? corpEmployees : allFiltered;
    const currentPage = activeTab === "accountOpened" ? accountOpenedPage : directoryPage;
    const setCurrentPage = activeTab === "accountOpened" ? setAccountOpenedPage : setDirectoryPage;
    const totalPages = Math.max(1, Math.ceil(currentList.length / ITEMS_PER_PAGE));
    const paginatedList = currentList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    React.useEffect(() => {
        try {
            localStorage.setItem("hdfc_hr_shared_employee_ids", JSON.stringify(sharedEmployeeIds));
        } catch {
            // ignore
        }
    }, [sharedEmployeeIds]);

    React.useEffect(() => {
        try {
            localStorage.setItem("hdfc_corporate_benefit_toggles", JSON.stringify(corporateBenefitToggles));
        } catch {
            // ignore
        }
    }, [corporateBenefitToggles]);

    // ─── HR Portal Overview: redesigned for product enablement ──
    if (activePage === "hr-overview") {
        const products = [
            { id: 0, name: "Corporate Salary Package", icon: FileText, desc: "Specialized salary accounts for corporate employees", category: "Corporate Banking" },
            { id: 1, name: "AU 0101", icon: Car, desc: "Banking, shopping, and investment services in one app", category: "Digital Banking" },
            { id: 2, name: "Home Loans", icon: Home, desc: "Housing finance solutions for customers", category: "Loans" },
            { id: 3, name: "Cash Management Products", icon: Building2, desc: "AU Business solutions for bulk and vendor payments", category: "Corporate Banking" },
            { id: 4, name: "Fixed Deposits", icon: PiggyBank, desc: "High-yield investment options", category: "Investment" },
        ];

        return (
            <div className="space-y-8">
                {/* HR Hero Banner */}
                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative min-h-[300px] flex items-center" style={{ background: "linear-gradient(135deg, #42265e 0%, #2e1a42 45%, #2a183c 100%)" }}>
                    <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <circle cx="100" cy="0" r="80" fill="white" />
                        </svg>
                    </div>
                    <div className="relative z-10 px-10 py-12 flex flex-col md:flex-row items-center justify-between w-full gap-8">
                        <div className="max-w-xl space-y-4 text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">
                                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                                HR Admin Console
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                                Empower Your <span className="text-white/90 italic">Workforce</span>
                            </h1>
                            <p className="text-white/80 text-lg leading-relaxed">
                                Curate exclusive banking benefits for your employees. Enable pre-approved salary accounts and investment products with a single click.
                            </p>
                        </div>
                        <div className="hidden lg:block shrink-0">
                            <div className="w-48 h-48 bg-white/10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm">
                                <ShieldCheck className="w-24 h-24 text-white/40" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Enablement Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <h2 className="text-2xl font-bold text-slate-900">Benefit Offerings</h2>
                            <p className="text-sm text-slate-500">Enable or disable banking products for your organization&apos;s employees</p>
                        </div>
                        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-100">
                            <CheckCircle2 className="w-4 h-4" />
                            Active for 1,240 Employees
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((p) => {
                            const isEnabled = corporateBenefitToggles["HR_PORTAL"]?.[p.id] ?? true;
                            return (
                                <div key={p.id} className={cn(
                                    "bg-white border rounded-[2rem] p-8 transition-all relative group overflow-hidden text-left",
                                    isEnabled ? "border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/80" : "border-slate-100 opacity-60 grayscale"
                                )}>
                                    {isEnabled && (
                                        <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
                                    )}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                                            isEnabled ? "bg-dashboard-primary-light text-dashboard-primary group-hover:scale-110" : "bg-slate-50 text-slate-400"
                                        )}>
                                            <p.icon className="w-7 h-7" />
                                        </div>
                                        <button
                                            onClick={() => {
                                                setCorporateBenefitToggles((prev) => {
                                                    const existing = prev["HR_PORTAL"] || {};
                                                    return { ...prev, ["HR_PORTAL"]: { ...existing, [p.id]: !isEnabled } };
                                                });
                                            }}
                                            className={cn(
                                                "w-12 h-6 rounded-full transition-all flex items-center px-1",
                                                isEnabled ? "bg-emerald-500 justify-end shadow-inner" : "bg-slate-200 justify-start"
                                            )}
                                        >
                                            <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.category}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <span className={cn(
                                            "text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest",
                                            isEnabled ? "text-emerald-600 bg-emerald-50" : "text-slate-400 bg-slate-50"
                                        )}>
                                            {isEnabled ? "Enabled" : "Disabled"}
                                        </span>
                                        {isEnabled && (
                                            <div className="flex items-center -space-x-2">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                                                ))}
                                                <span className="text-[10px] font-bold text-slate-400 ml-3">85+ applied</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    if (activePage === "hr-employees") {
        const hrEmployees = employees;
        const getFinScore = (emp: Employee) => (emp.id.charCodeAt(emp.id.length - 1) + emp.id.charCodeAt(emp.id.length - 2)) % 40 + 55;
        const getProducts = (emp: Employee) => (emp.id.charCodeAt(emp.id.length - 1) % 5) + 1;
        const getSalaryDisplay = (emp: TEmployee) => {
            const hash = emp.id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
            const sal = 400000 + (hash % 2600000);
            return `₹${(sal / 100000).toFixed(1)}L`;
        };
        const getTenure = (emp: TEmployee) => {
            const hash = emp.id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
            const years = (hash % 12) + 1;
            const months = hash % 12;
            return `${years}y ${months}m`;
        };
        const getBand = (emp: TEmployee) => {
            const bands = ["M1", "M2", "M3", "M4", "M5", "E1", "E2", "E3"];
            const hash = emp.id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
            return bands[hash % bands.length];
        };
        const getCorporateAccountStatus = (empId: string) => {
            const status = employeeStatuses[empId]?.status;
            const invited = !!invitedEmployeeIds[empId];
            if (status === "completed") return { label: "Opened", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" };
            if (status === "in_progress" || invited) return { label: "In Process", className: "bg-amber-50 text-amber-700 border border-amber-200" };
            return { label: "Not Started", className: "bg-slate-50 text-slate-600 border border-slate-200" };
        };
        const filteredHr = hrSearch.trim()
            ? hrEmployees.filter((e) => {
                const displayName = (employeeStatuses[e.id] as { name?: string })?.name || e.name || "";
                return displayName.toLowerCase().includes(hrSearch.toLowerCase()) || e.id.toLowerCase().includes(hrSearch.toLowerCase()) || ((e as { department?: string }).department || "").toLowerCase().includes(hrSearch.toLowerCase());
            })
            : hrEmployees;

        // Manage employees: shared vs unshared lists
        const sharedList = hrEmployees.filter((e) => sharedEmployeeIds[e.id]);
        const unsharedList = hrEmployees.filter((e) => !sharedEmployeeIds[e.id]);
        const manageList = manageSubTab === "shared" ? sharedList : unsharedList;
        const manageFiltered = manageSearchQuery.trim()
            ? manageList.filter((e) => (e.name || "").toLowerCase().includes(manageSearchQuery.toLowerCase()) || e.id.toLowerCase().includes(manageSearchQuery.toLowerCase()) || (e.email || "").toLowerCase().includes(manageSearchQuery.toLowerCase()))
            : manageList;
        const manageTotalPages = Math.max(1, Math.ceil(manageFiltered.length / ITEMS_PER_PAGE));
        const managePaginated = manageFiltered.slice((managePage - 1) * ITEMS_PER_PAGE, managePage * ITEMS_PER_PAGE);
        const selectedCount = Object.keys(selectedForShare).filter((id) => selectedForShare[id]).length;

        const optionalColumnDefs = [
            { key: "employmentStatus", label: "Employment Status" },
            { key: "gender", label: "Gender" },
            { key: "department", label: "Department" },
            { key: "employmentType", label: "Employment Type" },
            { key: "grossPay", label: "Gross Pay" },
            { key: "groupName", label: "Group Name" },
            { key: "designation", label: "Designation" },
            { key: "grade", label: "Grade" },
            { key: "costCenter", label: "Cost Center" },
            { key: "nationality", label: "Nationality" },
        ];
        const filteredColumnDefs = columnFilterSearch.trim()
            ? optionalColumnDefs.filter((c) => c.label.toLowerCase().includes(columnFilterSearch.toLowerCase()))
            : optionalColumnDefs;

        const getEmpOptionalValue = (emp: TEmployee, key: string) => {
            const e = emp as Record<string, unknown>;
            if (key === "grossPay") return e.income != null && e.income ? `₹${(Number(e.income) / 100000).toFixed(1)}L` : "N/A";
            if (key === "groupName") return e.group != null && String(e.group).trim() ? String(e.group) : "N/A";
            const v = e[key];
            return v != null && String(v).trim() ? String(v) : "N/A";
        };

        return (
            <>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[#111827]">HR Portal</h1>
                        <p className="text-sm text-[#6B7280] mt-0.5">Manage employee benefits and financial products</p>
                    </div>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> HRMS Connected
                    </span>
                </div>

                {/* Main tabs: Employee Directory | Updates | Manage employees */}
                <div className="flex gap-6 border-b border-[#E5E7EB] mb-4">
                    <button
                        type="button"
                        onClick={() => setHrEmployeesMainTab("directory")}
                        className={cn("pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors", hrEmployeesMainTab === "directory" ? "border-dashboard-primary text-dashboard-primary" : "border-transparent text-[#6B7280] hover:text-[#111827]")}
                    >
                        Employee Directory <span className="ml-2 text-xs font-normal text-[#9CA3AF]">({hrEmployees.length})</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setHrEmployeesMainTab("updates")}
                        className={cn("pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors", hrEmployeesMainTab === "updates" ? "border-dashboard-primary text-dashboard-primary" : "border-transparent text-[#6B7280] hover:text-[#111827]")}
                    >
                        Updates <span className="ml-2 text-xs font-normal text-[#9CA3AF]">(0)</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setHrEmployeesMainTab("manage")}
                        className={cn("pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors", hrEmployeesMainTab === "manage" ? "border-dashboard-primary text-dashboard-primary" : "border-transparent text-[#6B7280] hover:text-[#111827]")}
                    >
                        Manage employees
                    </button>
                    <button
                        type="button"
                        onClick={() => setHrEmployeesMainTab("mmfsl-loans")}
                        className={cn("pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors", hrEmployeesMainTab === "mmfsl-loans" ? "border-dashboard-primary text-dashboard-primary" : "border-transparent text-[#6B7280] hover:text-[#111827]")}
                    >
                        AU Bank Account Penetration
                    </button>
                </div>

                {hrEmployeesMainTab === "directory" && (() => {
                    const syncedEmployees = getSyncedEmployees();
                    const getSalaryDisplay = (emp: TEmployee) => {
                        const s = syncedEmployees[emp.id];
                        if (s) return `₹${(s.salary / 100000).toFixed(1)}L`;
                        const inc = (emp as { income?: string }).income;
                        return inc ? `₹${(parseInt(inc, 10) / 100000).toFixed(1)}L` : "—";
                    };
                    const getDeptDisplay = (emp: TEmployee) => syncedEmployees[emp.id]?.department ?? (emp as { department?: string }).department ?? "—";
                    const getBandDesignation = (emp: TEmployee) => {
                        const s = syncedEmployees[emp.id];
                        if (s) return `${s.band} · ${s.designation}`;
                        return "—";
                    };
                    return (
                    <>
                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <div className="flex-1 flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 h-10">
                                <Search className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                                <input type="text" placeholder="Search employees by name, ID, or department..." value={hrSearch} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHrSearch(e.target.value)} className="ml-2 text-sm outline-none w-full bg-transparent" />
                            </div>
                            <button type="button" onClick={() => { onHrSyncNow?.(); refreshStatuses(); }} className="h-10 px-4 border border-[#E5E7EB] bg-white text-[#374151] font-medium text-sm rounded-lg flex items-center gap-2 shrink-0 hover:bg-[#F9FAFB]"><RefreshCcw className="w-4 h-4" /> Sync now</button>
                        </div>
                        <div className="flex flex-wrap gap-3 mb-4">
                            <select value={hrDeptFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setHrDeptFilter(e.target.value)} className="h-10 px-4 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#374151]">
                                <option>All Departments</option>
                            </select>
                            <select value={hrStatusFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setHrStatusFilter(e.target.value)} className="h-10 px-4 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#374151]">
                                <option>All Status</option>
                            </select>
                            <select value={hrScoreFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setHrScoreFilter(e.target.value)} className="h-10 px-4 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#374151]">
                                <option>All Scores</option>
                            </select>
                        </div>
                        <p className="text-sm text-[#9CA3AF] mb-3">Last synced: {(lastHrSyncAt || getSyncTimestamp()) ? new Date(lastHrSyncAt || getSyncTimestamp() || "").toLocaleString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never"}</p>
                        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0">
                            <div className="overflow-x-auto overflow-y-auto max-h-[70vh] min-h-0">
                                <table className="w-full text-sm border-collapse min-w-[900px]">
                                    <thead className="bg-[#F9FAFB] sticky top-0 z-10"><tr className="border-b border-[#E5E7EB]">
                                        <HeaderCell label="Employee" /><HeaderCell label="Department" /><HeaderCell label="Salary" /><HeaderCell label="Band" /><HeaderCell label="Tenure" /><HeaderCell label="Fin. Score" /><HeaderCell label="Products" /><HeaderCell label="Corporate Account" /><th className="px-5 py-4 text-left font-semibold text-[#374151] text-xs uppercase tracking-wide">Actions</th>
                                    </tr></thead>
                                    <tbody className="divide-y divide-[#E5E7EB]">
                                        {filteredHr.map((emp) => {
                                            const score = getFinScore(emp);
                                            const scoreColor = score >= 75 ? "bg-emerald-50 text-emerald-700" : score >= 60 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700";
                                            const corpStatus = getCorporateAccountStatus(emp.id);
                                            const displayName = (employeeStatuses[emp.id] as { name?: string })?.name || emp.name;
                                            return (
                                                <tr key={emp.id} className="hover:bg-[#F9FAFB]">
                                                    <td className="px-5 py-4"><div><button onClick={() => setSelectedEmployee(emp)} className="text-dashboard-primary font-semibold hover:underline text-left">{displayName}</button><p className="text-xs text-[#9CA3AF]">{emp.id}</p></div></td>
                                                    <td className="px-5 py-4">{getDeptDisplay(emp)}</td>
                                                    <td className="px-5 py-4">{getSalaryDisplay(emp)}</td>
                                                    <td className="px-5 py-4 text-[#6B7280]">{getBand(emp)}</td>
                                                    <td className="px-5 py-4">{getTenure(emp)}</td>
                                                    <td className="px-5 py-4"><span className={cn("px-2 py-1 rounded-full text-xs font-semibold", scoreColor)}>{score}</span></td>
                                                    <td className="px-5 py-4">{getProducts(emp)}</td>
                                                    <td className="px-5 py-4"><span className={cn("px-2 py-1 rounded-full text-xs font-semibold", corpStatus.className)}>{corpStatus.label}</span></td>
                                                    <td className="px-5 py-4"><button onClick={() => setSelectedEmployee(emp)} className="text-dashboard-primary font-medium hover:underline">View</button></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {(() => {
                            const synced = getSyncedEmployees();
                            const completedWithTriggers = hrEmployees.filter((e) => employeeStatuses[e.id]?.status === "completed").filter((e) => getTriggers(e.id).length > 0);
                            if (completedWithTriggers.length === 0) return null;
                            return (
                                <div className="mt-6 bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                                    <div className="px-5 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                                        <h2 className="text-sm font-semibold text-[#111827]">Employment & income triggers (feedback from AU Bank CRM)</h2>
                                        <p className="text-xs text-[#6B7280] mt-0.5">Change in employment triggers: function, status, salary, NACH (termination/resignation), account eligibility rules applied</p>
                                    </div>
                                    <div className="divide-y divide-[#E5E7EB]">
                                        {completedWithTriggers.map((emp) => {
                                            const triggers = getTriggers(emp.id);
                                            const syncedData = synced[emp.id];
                                            const name = (employeeStatuses[emp.id] as { name?: string })?.name || emp.name;
                                            return (
                                                <div key={emp.id} className="px-5 py-4">
                                                    <div className="flex items-center justify-between gap-4 flex-wrap">
                                                        <div>
                                                            <button type="button" onClick={() => setSelectedEmployee(emp)} className="text-dashboard-primary font-semibold hover:underline text-left">{name}</button>
                                                            <p className="text-xs text-[#9CA3AF]">{emp.id}</p>
                                                            {syncedData && (
                                                                <p className="text-xs text-[#6B7280] mt-1">Salary: ₹{(syncedData.salary / 100000).toFixed(1)}L · Band: {syncedData.band} · {syncedData.designation} · {syncedData.employmentStatus}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <ul className="mt-2 space-y-1">
                                                        {triggers.map((t, i) => (
                                                            <li key={i} className="flex items-center gap-2 text-sm">
                                                                <span className={cn("px-2 py-0.5 rounded text-xs font-medium", t.type.startsWith("NACH") ? "bg-amber-50 text-amber-800" : "bg-blue-50 text-blue-800")}>{t.label}</span>
                                                                <span className="text-[#6B7280]">{t.description}</span>
                                                                <span className="text-[#9CA3AF] text-xs">{t.date ? new Date(t.date).toLocaleDateString("en-IN") : ""}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}
                    </>
                    );
                })()}

                {hrEmployeesMainTab === "updates" && (
                    <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-12 text-center">
                        <p className="text-[#6B7280] text-sm">No updates.</p>
                    </div>
                )}

                {hrEmployeesMainTab === "mmfsl-loans" && (() => {
                    // MMFSL product penetration: loan details from HRMS + feedback from MMFSL LMS
                    const offered = hrEmployees.filter((e) => invitedEmployeeIds[e.id]);
                    const accepted = hrEmployees.filter((e) => {
                        const s = employeeStatuses[e.id]?.status;
                        return s === "in_progress" || s === "completed";
                    });
                    const disbursed = hrEmployees.filter((e) => employeeStatuses[e.id]?.status === "completed");

                    const rawLoanRows = [
                        { id: "EMP1024", name: "Amit Sharma", income: "1800000" },
                        { id: "EMP1025", name: "Priya Patel", income: "2400000" },
                        { id: "EMP1026", name: "Vikram Singh", income: "1500000" },
                        { id: "EMP1027", name: "Sonia Verma", income: "900000" },
                        { id: "EMP1028", name: "Rajesh Kumar", income: "1200000" },
                        { id: "EMP1029", name: "Ananya Iyer", income: "2100000" },
                        { id: "EMP1030", name: "Rahul Gupta", income: "1400000" },
                        { id: "EMP1031", name: "Megha Rao", income: "2800000" },
                        { id: "EMP1032", name: "Karan Johar", income: "1600000" },
                        { id: "EMP1033", name: "Simran Kaur", income: "1100000" },
                        { id: "EMP1034", name: "Deepak Chawla", income: "1900000" },
                        { id: "EMP1035", name: "Nisha Reddy", income: "2300000" },
                        { id: "EMP1036", name: "Aditya Mehra", income: "1750000" },
                        { id: "EMP1037", name: "Kavita Joshi", income: "1320000" },
                        { id: "EMP1038", name: "Arjun Kapoor", income: "2150000" },
                        { id: "EMP1039", name: "Pooja Hegde", income: "1680000" },
                        { id: "EMP1040", name: "Rohan Das", income: "1450000" },
                        { id: "EMP1041", name: "Sneha Patil", income: "1920000" },
                        { id: "EMP1042", name: "Varun Dhawan", income: "2550000" },
                        { id: "EMP1043", name: "Isha Ambani", income: "3000000" },
                        { id: "EMP1044", name: "Manish Malhotra", income: "2200000" },
                        { id: "EMP1045", name: "Kiara Advani", income: "1850000" },
                        { id: "EMP1046", name: "Siddharth Malhotra", income: "2100000" },
                        { id: "EMP1047", name: "Alia Bhatt", income: "2750000" },
                        { id: "EMP1048", name: "Ranbir Kapoor", income: "2900000" },
                        { id: "EMP1049", name: "Katrina Kaif", income: "2600000" },
                        { id: "EMP1050", name: "Vicky Kaushal", income: "2450000" },
                        { id: "EMP1051", name: "Ayushmann Khurrana", income: "2300000" },
                        { id: "EMP1052", name: "Bhumi Pednekar", income: "1980000" },
                        { id: "EMP1053", name: "Rajkummar Rao", income: "2100000" },
                    ] as any[];

                    const getMockLoanForMMFSL = (emp: TEmployee): { product: "PL" | "LAP" | "Car Loan" | "Home Loan"; amount: number; rate: number; tenureMonths: number; disbursalStatus: "Disbursed" | "Accepted" | "Offered" } => {
                        const hash = emp.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
                        const incomeNum = parseInt((emp as any).income || "1200000", 10);
                        const plAmount = Math.min(incomeNum * 2, 1500000);
                        
                        const productPool: ("PL" | "LAP" | "Car Loan" | "Home Loan")[] = ["PL", "LAP", "Car Loan", "Home Loan"];
                        const product = productPool[hash % 4];
                        
                        const amount = product === "LAP" ? Math.round(plAmount * 1.8) : 
                                      product === "Home Loan" ? Math.round(plAmount * 2.5) :
                                      product === "Car Loan" ? Math.round(plAmount * 0.8) : plAmount;
                        
                        const rate = product === "Home Loan" ? 8.5 + (hash % 20) / 10 :
                                    product === "Car Loan" ? 9.2 + (hash % 25) / 10 :
                                    10.5 + (hash % 30) / 10;
                                    
                        const tenure = product === "Home Loan" ? 120 + (hash % 120) :
                                      product === "Car Loan" ? 36 + (hash % 48) :
                                      24 + (hash % 36);

                        // Hardcode status distribution for a total of 30 rows
                        // 6 Disbursed, 14 Accepted, 10 Offered = 30 total
                        const index = rawLoanRows.findIndex(r => r.id === emp.id);
                        let disbursalStatus: "Disbursed" | "Accepted" | "Offered" = "Offered";
                        if (index < 6) disbursalStatus = "Disbursed";
                        else if (index < 20) disbursalStatus = "Accepted";
                        
                        return { product, amount, rate, tenureMonths: tenure, disbursalStatus };
                    };

                    const loanRows = rawLoanRows.filter(emp => {
                        const loan = getMockLoanForMMFSL(emp);
                        const matchesSearch = emp.name.toLowerCase().includes(mmfslSearch.toLowerCase()) || emp.id.toLowerCase().includes(mmfslSearch.toLowerCase());
                        const matchesProduct = mmfslProductFilter === "All Products" || loan.product === mmfslProductFilter;
                        const matchesDisbursal = mmfslDisbursalFilter === "All Status" || loan.disbursalStatus === mmfslDisbursalFilter;
                        return matchesSearch && matchesProduct && matchesDisbursal;
                    });

                    const statsOffered = 30;
                    const statsAccepted = 14;
                    const statsDisbursed = 6;
                    
                    const totalDisbursedAmount = rawLoanRows.slice(0, 6).reduce((sum, e) => sum + getMockLoanForMMFSL(e).amount, 0);
                    
                    const avgRate = 10.2;
                    // Penetration based on Offered / Total Corporate Size (155)
                    const penetration = ((statsOffered / 155) * 100).toFixed(1);

                    return (
                        <>
                            <p className="text-sm text-[#6B7280] mb-4">
                                Data synced from AU Bank CRM. Last updated: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })} (feedback loop from AU Bank CRM)
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
                                    <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Invited</p>
                                    <p className="text-2xl font-bold text-[#111827] mt-1">{statsOffered}</p>
                                    <p className="text-xs text-[#9CA3AF] mt-0.5">Employees invited</p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
                                    <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">In Progress</p>
                                    <p className="text-2xl font-bold text-[#111827] mt-1">{statsAccepted}</p>
                                    <p className="text-xs text-[#9CA3AF] mt-0.5">Application in process</p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
                                    <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Accounts Opened</p>
                                    <p className="text-2xl font-bold text-emerald-600 mt-1">{statsDisbursed}</p>
                                    <p className="text-xs text-[#9CA3AF] mt-0.5">Salary accounts opened</p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
                                    <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Total Balance</p>
                                    <p className="text-xl font-bold text-[#111827] mt-1">₹{(totalDisbursedAmount / 100000).toFixed(1)}L</p>
                                    <p className="text-xs text-[#9CA3AF] mt-0.5">Across all accounts</p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
                                    <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Avg rate</p>
                                    <p className="text-2xl font-bold text-[#111827] mt-1">{avgRate}%</p>
                                    <p className="text-xs text-[#9CA3AF] mt-0.5">Weighted avg interest</p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
                                    <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Penetration</p>
                                    <p className="text-2xl font-bold text-dashboard-primary mt-1">{penetration}%</p>
                                    <p className="text-xs text-[#9CA3AF] mt-0.5">Of corporate base (155)</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <div className="flex-1 flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 h-10">
                                    <Search className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                                    <input type="text" placeholder="Search by name or ID..." value={mmfslSearch} onChange={(e) => setMmfslSearch(e.target.value)} className="ml-2 text-sm outline-none w-full bg-transparent" />
                                </div>
                                <div className="flex gap-3">
                                    <select value={mmfslProductFilter} onChange={(e) => setMmfslProductFilter(e.target.value)} className="h-10 px-4 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#374151]">
                                        <option>All Products</option>
                                        <option>PL</option>
                                        <option>LAP</option>
                                        <option>Car Loan</option>
                                        <option>Home Loan</option>
                                    </select>
                                    <select value={mmfslDisbursalFilter} onChange={(e) => setMmfslDisbursalFilter(e.target.value)} className="h-10 px-4 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#374151]">
                                        <option>All Status</option>
                                        <option>Offered</option>
                                        <option>Accepted</option>
                                        <option>Disbursed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0">
                                <div className="px-5 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                                    <h2 className="text-sm font-semibold text-[#111827]">Account details (AU Bank product penetration)</h2>
                                    <p className="text-xs text-[#6B7280] mt-0.5">Employees with salary accounts — Savings, Current, Fixed Deposit, Recurring Deposit</p>
                                </div>
                                <div className="overflow-x-auto overflow-y-auto max-h-[70vh] min-h-0">
                                    <table className="w-full text-sm border-collapse min-w-[800px]">
                                        <thead className="bg-[#F9FAFB] sticky top-0 z-10">
                                            <tr className="border-b border-[#E5E7EB]">
                                                <HeaderCell label="Employee" />
                                                <HeaderCell label="Product" />
                                                <HeaderCell label="Amount" />
                                                <HeaderCell label="Rate" />
                                                <HeaderCell label="Tenure" />
                                                <HeaderCell label="Disbursal" />
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E5E7EB]">
                                            {loanRows.length === 0 ? (
                                                <tr><td colSpan={6} className="px-5 py-12 text-center text-[#6B7280]">No account records match your filters.</td></tr>
                                            ) : loanRows.map((emp) => {
                                                const loan = getMockLoanForMMFSL(emp);
                                                const name = (employeeStatuses[emp.id] as { name?: string })?.name || emp.name;
                                                return (
                                                    <tr key={emp.id} className="hover:bg-[#F9FAFB]">
                                                        <td className="px-5 py-4"><div><button type="button" onClick={() => setSelectedEmployee(emp)} className="text-dashboard-primary font-semibold hover:underline text-left">{name}</button><p className="text-xs text-[#9CA3AF]">{emp.id}</p></div></td>
                                                        <td className="px-5 py-4">
                                                            <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", 
                                                                loan.product === "LAP" ? "bg-violet-50 text-violet-700 border border-violet-200" : 
                                                                loan.product === "Home Loan" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                                                loan.product === "Car Loan" ? "bg-orange-50 text-orange-700 border border-orange-200" :
                                                                "bg-blue-50 text-blue-700 border border-blue-200")}>
                                                                {loan.product}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4 font-medium">₹{(loan.amount / 100000).toFixed(2)}L</td>
                                                        <td className="px-5 py-4">{loan.rate.toFixed(1)}%</td>
                                                        <td className="px-5 py-4">{loan.tenureMonths} mo</td>
                                                        <td className="px-5 py-4"><span className={cn("px-2 py-1 rounded-full text-xs font-semibold", loan.disbursalStatus === "Disbursed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : loan.disbursalStatus === "Accepted" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-slate-50 text-slate-600 border border-slate-200")}>{loan.disbursalStatus}</span></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    );
                })()}

                {hrEmployeesMainTab === "manage" && (
                    <>
                        <div className="flex gap-4 border-b border-[#E5E7EB] mb-4">
                            <button type="button" onClick={() => { setManageSubTab("shared"); setManagePage(1); setSelectedForShare({}); }} className={cn("pb-3 text-sm font-semibold border-b-2 -mb-px", manageSubTab === "shared" ? "border-dashboard-primary text-dashboard-primary" : "border-transparent text-[#6B7280]")}>
                                Shared employees <span className="ml-2 text-xs font-normal text-[#9CA3AF]">({sharedList.length})</span>
                            </button>
                            <button type="button" onClick={() => { setManageSubTab("unshared"); setManagePage(1); setSelectedForShare({}); }} className={cn("pb-3 text-sm font-semibold border-b-2 -mb-px", manageSubTab === "unshared" ? "border-dashboard-primary text-dashboard-primary" : "border-transparent text-[#6B7280]")}>
                                Unshared employees <span className="ml-2 text-xs font-normal text-[#9CA3AF]">({unsharedList.length})</span>
                            </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <div className="flex-1 min-w-[200px] flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 h-10">
                                <Search className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                                <input type="text" placeholder="Search 'Employee name'" value={manageSearchQuery} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setManageSearchQuery(e.target.value); setManagePage(1); }} className="ml-2 text-sm outline-none w-full bg-transparent" />
                            </div>
                            <button type="button" onClick={() => setShowColumnFilterModal(true)} className="h-10 px-4 border border-[#E5E7EB] bg-white text-[#374151] font-medium text-sm rounded-lg flex items-center gap-2 shrink-0 hover:bg-[#F9FAFB]">
                                <Pencil className="w-4 h-4" /> Add columns and filter
                            </button>
                            <button
                                type="button"
                                disabled={manageSubTab !== "unshared" || selectedCount === 0}
                                onClick={() => setShowShareConfirmModal(true)}
                                className="h-10 px-4 bg-[#2563EB] text-white font-medium text-sm rounded-lg flex items-center gap-2 shrink-0 hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Check className="w-4 h-4" /> Share data
                            </button>
                        </div>
                        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0">
                            <div className="overflow-x-auto overflow-y-auto max-h-[70vh] min-h-0">
                                <table className="w-full text-sm border-collapse min-w-[700px]">
                                    <thead className="bg-[#F9FAFB] sticky top-0 z-10">
                                        <tr className="border-b border-[#E5E7EB]">
                                            <th className="px-5 py-4 text-left font-semibold text-[#374151] text-xs uppercase tracking-wide w-12">
                                                {manageSubTab === "unshared" && (
                                                    <>
                                                        <input
                                                            type="checkbox"
                                                            checked={managePaginated.length > 0 && managePaginated.every((e) => selectedForShare[e.id])}
                                                            onChange={(e) => {
                                                                if (e.target.checked) setSelectedForShare((prev) => { const next = { ...prev }; managePaginated.forEach((emp) => { next[emp.id] = true; }); return next; });
                                                                else setSelectedForShare((prev) => { const next = { ...prev }; managePaginated.forEach((emp) => { delete next[emp.id]; }); return next; });
                                                            }}
                                                            className="rounded border-[#E5E7EB]"
                                                        />
                                                        <span className="ml-2 text-[#9CA3AF] font-normal">{selectedCount} selected</span>
                                                    </>
                                                )}
                                            </th>
                                            <HeaderCell label="Employee Name" />
                                            <HeaderCell label="Employee ID" />
                                            <HeaderCell label="Email ID" />
                                            <HeaderCell label="Phone number" />
                                            {visibleOptionalColumns.map((key) => {
                                                const def = optionalColumnDefs.find((d) => d.key === key);
                                                return def ? <HeaderCell key={key} label={def.label} /> : null;
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E5E7EB]">
                                        {managePaginated.length === 0 ? (
                                            <tr><td colSpan={4 + visibleOptionalColumns.length + 1} className="px-5 py-12 text-center text-[#6B7280] text-sm">No employees found.</td></tr>
                                        ) : managePaginated.map((emp) => (
                                            <tr key={emp.id} className="hover:bg-[#F9FAFB]">
                                                <td className="px-5 py-4 w-12">
                                                    {manageSubTab === "unshared" && (
                                                        <input
                                                            type="checkbox"
                                                            checked={!!selectedForShare[emp.id]}
                                                            onChange={() => setSelectedForShare((prev) => ({ ...prev, [emp.id]: !prev[emp.id] }))}
                                                            className="rounded border-[#E5E7EB]"
                                                        />
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 font-medium text-[#111827]">{emp.name}</td>
                                                <td className="px-5 py-4 text-[#6B7280]">{emp.id}</td>
                                                <td className="px-5 py-4 text-[#6B7280]">{emp.email || "N/A"}</td>
                                                <td className="px-5 py-4 text-[#6B7280]">{emp.phone || "N/A"}</td>
                                                {visibleOptionalColumns.map((key) => (
                                                    <td key={key} className="px-5 py-4 text-[#6B7280]">{getEmpOptionalValue(emp, key)}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-center">
                                <div className="flex gap-3">
                                    <button disabled={managePage <= 1} onClick={() => setManagePage((p) => p - 1)} className={cn("px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm flex items-center gap-1", managePage <= 1 ? "text-[#9CA3AF] cursor-not-allowed bg-white" : "bg-white text-[#374151] hover:bg-[#F9FAFB]")}><ChevronLeft className="w-4 h-4" /> Previous</button>
                                    {Array.from({ length: Math.min(5, manageTotalPages) }, (_, i) => i + 1).map((n) => (
                                        <button key={n} type="button" onClick={() => setManagePage(n)} className={cn("px-3 py-1.5 rounded-lg text-sm", managePage === n ? "bg-dashboard-primary text-white border border-dashboard-primary" : "bg-white text-[#374151] border border-[#E5E7EB] hover:bg-[#F9FAFB]")}>{n}</button>
                                    ))}
                                    {manageTotalPages > 6 && <span className="px-1 text-[#6B7280]">...</span>}
                                    {manageTotalPages > 6 && <button type="button" onClick={() => setManagePage(manageTotalPages)} className={cn("px-3 py-1.5 rounded-lg text-sm", managePage === manageTotalPages ? "bg-dashboard-primary text-white" : "bg-white text-[#374151] border border-[#E5E7EB]")}>{manageTotalPages}</button>}
                                    <button disabled={managePage >= manageTotalPages} onClick={() => setManagePage((p) => p + 1)} className={cn("px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm flex items-center gap-1", managePage >= manageTotalPages ? "text-[#9CA3AF] cursor-not-allowed bg-white" : "bg-white text-[#374151] hover:bg-[#F9FAFB]")}>Next <ChevronRight className="w-4 h-4" /></button>
                                </div>
                                <div className="text-sm text-[#6B7280]">Page {managePage} of {manageTotalPages} <span className="ml-2 text-[#9CA3AF]">({manageFiltered.length} employees)</span></div>
                            </div>
                        </div>
                    </>
                )}

                {/* Modal: Add Columns to Filter Employees */}
                {showColumnFilterModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowColumnFilterModal(false)}>
                        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                                <h2 className="text-lg font-bold text-[#111827]">Add Columns to Filter Employees</h2>
                                <button type="button" onClick={() => setShowColumnFilterModal(false)} className="p-2 text-[#6B7280] hover:text-[#111827]"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="px-6 py-3 border-b border-[#E5E7EB]">
                                <div className="flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 h-10">
                                    <Search className="w-4 h-4 text-[#9CA3AF]" />
                                    <input type="text" placeholder="Search column name" value={columnFilterSearch} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColumnFilterSearch(e.target.value)} className="ml-2 text-sm outline-none w-full bg-transparent" />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                <div className="grid grid-cols-3 gap-2">
                                    {filteredColumnDefs.map((col) => (
                                        <label key={col.key} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={visibleOptionalColumns.includes(col.key)}
                                                onChange={() => setVisibleOptionalColumns((prev) => prev.includes(col.key) ? prev.filter((k) => k !== col.key) : [...prev, col.key])}
                                                className="rounded border-[#E5E7EB]"
                                            />
                                            <span className="text-sm text-[#374151]">{col.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end px-6 py-4 border-t border-[#E5E7EB]">
                                <button type="button" onClick={() => setShowColumnFilterModal(false)} className="h-10 px-5 bg-[#7C3AED] text-white font-medium text-sm rounded-lg flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Update
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal: Share new employees' data confirmation */}
                {showShareConfirmModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowShareConfirmModal(false)}>
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#E0E7FF] flex items-center justify-center shrink-0">
                                    <HelpCircle className="w-5 h-5 text-[#4F46E5]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#111827]">Share new employees&apos; data</h2>
                                    <p className="text-sm text-[#6B7280] mt-2">Are you sure you want to share the selected employees&apos; data?</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowShareConfirmModal(false)} className="h-10 px-4 border border-[#E5E7EB] bg-white text-[#374151] font-medium text-sm rounded-lg hover:bg-[#F9FAFB]">
                                    Leave
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSharedEmployeeIds((prev) => {
                                            const next = { ...prev };
                                            Object.keys(selectedForShare).forEach((id) => { if (selectedForShare[id]) next[id] = true; });
                                            return next;
                                        });
                                        setSelectedForShare({});
                                        setShowShareConfirmModal(false);
                                    }}
                                    className="h-10 px-4 bg-[#2563EB] text-white font-medium text-sm rounded-lg hover:bg-[#1D4ED8]"
                                >
                                    Yes, share
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    const employeeDirectoryTable = (
        <>
            {(portalMode === "rm") && (
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-xs font-semibold text-[#6B7280] uppercase">Filters:</span>
                    <select value={rmTenureFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setRmTenureFilter(e.target.value); setDirectoryPage(1); setAccountOpenedPage(1); }} className="h-9 px-3 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#374151]">
                        <option value="">Tenure</option>
                        <option value="<12">&lt;12 months</option>
                        <option value="12-24">12-24 months</option>
                        <option value=">24">&gt;24 months</option>
                    </select>
                    <select value={rmAgeFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setRmAgeFilter(e.target.value); setDirectoryPage(1); setAccountOpenedPage(1); }} className="h-9 px-3 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#374151]">
                        <option value="">Age group</option>
                        <option value="25-35">25-35</option>
                        <option value="35-45">35-45</option>
                        <option value=">45">&gt;45</option>
                    </select>
                    <select value={rmGradeFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setRmGradeFilter(e.target.value); setDirectoryPage(1); setAccountOpenedPage(1); }} className="h-9 px-3 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#374151]">
                        <option value="">Grade</option>
                        {Array.from(new Set(employees.map((e) => (e as Record<string, unknown>).grade as string).filter(Boolean))).sort().map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <select value={rmIncomeFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setRmIncomeFilter(e.target.value); setDirectoryPage(1); setAccountOpenedPage(1); }} className="h-9 px-3 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#374151]">
                        <option value="">Income band</option>
                        {Array.from(new Set(employees.map((e) => (e as Record<string, unknown>).income as string).filter(Boolean))).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).map((i) => <option key={i} value={i}>₹{(parseInt(i, 10) / 100000).toFixed(0)}L+</option>)}
                    </select>
                    <select value={rmDeptFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setRmDeptFilter(e.target.value); setDirectoryPage(1); setAccountOpenedPage(1); }} className="h-9 px-3 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#374151]">
                        <option value="">Department</option>
                        {Array.from(new Set(employees.map((e) => (e as Record<string, unknown>).department as string).filter(Boolean))).sort().map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {(rmTenureFilter || rmAgeFilter || rmGradeFilter || rmIncomeFilter || rmDeptFilter) && (
                        <button type="button" onClick={() => { setRmTenureFilter(""); setRmAgeFilter(""); setRmGradeFilter(""); setRmIncomeFilter(""); setRmDeptFilter(""); setDirectoryPage(1); setAccountOpenedPage(1); }} className="text-sm text-dashboard-primary font-medium hover:underline">Clear filters</button>
                    )}
                </div>
            )}
            <div className="flex gap-6 border-b border-[#E5E7EB] mb-4">
                <button type="button" onClick={() => { setActiveTab("directory"); setDirectoryPage(1); setSearchQuery(""); }}
                    className={cn("pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors", activeTab === "directory" ? "border-dashboard-primary text-dashboard-primary" : "border-transparent text-[#6B7280] hover:text-[#111827]")}>
                    Employee Directory <span className="ml-2 text-xs font-normal text-[#9CA3AF]">({selectedCorporate ? corpEmployees.length : allFiltered.length})</span>
                </button>
                <button type="button" onClick={() => { setActiveTab("accountOpened"); setAccountOpenedPage(1); setSearchQuery(""); }}
                    className={cn("pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors", activeTab === "accountOpened" ? "border-dashboard-primary text-dashboard-primary" : "border-transparent text-[#6B7280] hover:text-[#111827]")}>
                    Accounts Opened <span className="ml-2 text-xs font-normal text-[#9CA3AF]">({selectedCorporate ? corpCompleted.length : completedEmployees.length})</span>
                </button>
                {portalMode === "rm" && (
                    <button type="button" onClick={() => setActiveTab("analytics")}
                        className={cn("pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors flex items-center gap-1.5", activeTab === "analytics" ? "border-dashboard-primary text-dashboard-primary" : "border-transparent text-[#6B7280] hover:text-[#111827]")}>
                        <BarChart3 className="w-4 h-4" /> Analytics
                    </button>
                )}
            </div>
            <div className="flex-1 flex flex-col min-h-0">
                <h2 className="text-base font-bold text-[#111827] mb-4">{activeTab === "accountOpened" ? "Accounts Opened" : activeTab === "analytics" ? "Salary account analytics" : "Employee Directory"} <span className="ml-2 text-sm font-normal text-[#6B7280]">({activeTab === "analytics" ? analyticsList.length : currentList.length} employee{(activeTab === "analytics" ? analyticsList.length : currentList.length) !== 1 ? "s" : ""})</span></h2>
                {activeTab === "analytics" ? (() => {
                    const list = analyticsList;
                    const getAge = (e: TEmployee) => {
                        const dob = (e as Record<string, unknown>).dob as string | undefined;
                        if (!dob) return null;
                        return new Date().getFullYear() - parseInt(dob.slice(0, 4), 10);
                    };
                    const ageBrackets = [
                        { label: "25–30", min: 25, max: 30 },
                        { label: "31–35", min: 31, max: 35 },
                        { label: "36–40", min: 36, max: 40 },
                        { label: "41–45", min: 41, max: 45 },
                        { label: "46–50", min: 46, max: 50 },
                        { label: "50+", min: 51, max: 99 },
                    ];
                    const ageDistribution = ageBrackets.map((b) => ({
                        ...b,
                        count: list.filter((e) => { const a = getAge(e); return a != null && a >= b.min && a <= b.max; }).length,
                    }));
                    const departments = Array.from(new Set(list.map((e) => (e as Record<string, unknown>).department as string).filter(Boolean))).sort();
                    const deptAgeSplit = departments.map((dept) => {
                        const inDept = list.filter((e) => ((e as Record<string, unknown>).department as string) === dept);
                        const ages = inDept.map((e) => getAge(e)).filter((a): a is number => a != null);
                        const avgAge = ages.length ? Math.round(ages.reduce((s, a) => s + a, 0) / ages.length) : 0;
                        const byBracket = ageBrackets.map((b) => inDept.filter((e) => { const a = getAge(e); return a != null && a >= b.min && a <= b.max; }).length);
                        return { dept, avgAge, byBracket, total: inDept.length };
                    });
                    const incomeBands = ["800000", "1200000", "1500000", "1800000", "2200000", "2600000", "3000000"];
                    const salarySplit = incomeBands.map((inc) => ({
                        label: `₹${(parseInt(inc, 10) / 100000).toFixed(0)}L`,
                        count: list.filter((e) => ((e as Record<string, unknown>).income as string) === inc).length,
                    }));
                    const completedCount = list.filter((e) => employeeStatuses[e.id]?.status === "completed").length;
                    const inProgressCount = list.filter((e) => employeeStatuses[e.id]?.status === "in_progress").length;
                    const invitedCount = list.filter((e) => invitedEmployeeIds[e.id] && employeeStatuses[e.id]?.status !== "in_progress" && employeeStatuses[e.id]?.status !== "completed").length;

                    const completionRate = list.length ? Math.round((completedCount / list.length) * 100) : 0;
                    const getTenureMonths = (e: TEmployee) => {
                        const doj = (e as Record<string, unknown>).dateOfJoining as string | undefined;
                        if (!doj) return 0;
                        const [y, m] = doj.split("-").map(Number);
                        const now = new Date();
                        return (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
                    };
                    const stableShare = list.length ? Math.round((list.filter((e) => getTenureMonths(e) >= 24).length / list.length) * 100) : 0;
                    const avgSalaryL = list.length
                        ? (list.reduce((s, e) => s + parseInt(String((e as Record<string, unknown>).income || 0), 10), 0) / list.length / 100000).toFixed(1)
                        : "0";

                    /** Salary-account onboarding fit from HRMS profile only (tenure, salary vs cohort, age, grade). */
                    type FitSegment = "high_fit" | "standard_fit" | "needs_follow_up";
                    const getSalaryAccountFitSegment = (e: TEmployee): FitSegment => {
                        const tenureMonths = getTenureMonths(e);
                        const salary = parseInt(String((e as Record<string, unknown>).income || 0), 10) || 0;
                        const medianSalary = list.length
                            ? list.reduce((s, emp) => s + parseInt(String((emp as Record<string, unknown>).income || 0), 10), 0) / list.length
                            : 0;
                        const age = getAge(e);
                        const grade = (e as Record<string, unknown>).grade as string | undefined;
                        const gradeBand = grade ? parseInt(String(grade).replace(/\D/g, ""), 10) : NaN;
                        if (tenureMonths < 12 || salary === 0) return "needs_follow_up";
                        const salaryOk = medianSalary > 0 ? salary >= medianSalary * 0.85 : true;
                        const tenureOk = tenureMonths >= 24;
                        const ageOk = age != null && age >= 25 && age <= 55;
                        const seniorGrade = !Number.isNaN(gradeBand) && gradeBand >= 5;
                        if (tenureOk && salaryOk && ageOk) return "high_fit";
                        if (seniorGrade && tenureMonths >= 18 && salaryOk) return "high_fit";
                        if (tenureMonths >= 12 && salaryOk) return "standard_fit";
                        return "needs_follow_up";
                    };

                    const fitLabels: Record<FitSegment, string> = {
                        high_fit: "High-fit",
                        standard_fit: "Standard-fit",
                        needs_follow_up: "Needs follow-up",
                    };
                    const fitDistribution = (["high_fit", "standard_fit", "needs_follow_up"] as const).map((seg) => ({
                        key: seg,
                        label: fitLabels[seg],
                        count: list.filter((e) => getSalaryAccountFitSegment(e) === seg).length,
                    }));

                    const countHighFit = fitDistribution.find((f) => f.key === "high_fit")?.count ?? 0;
                    const countStandardFit = fitDistribution.find((f) => f.key === "standard_fit")?.count ?? 0;
                    const countNeedsFollowUp = fitDistribution.find((f) => f.key === "needs_follow_up")?.count ?? 0;
                    const activationReadyCount = countHighFit + countStandardFit;
                    const eligibleForInviteCount = Math.max(0, list.length - completedCount);
                    const yetToInviteCount = Math.max(0, list.length - completedCount - inProgressCount - invitedCount);

                    return (
                        <div className="space-y-6 flex-1 overflow-y-auto">
                            <p className="text-sm text-[#6B7280]">Banking engagement metrics to track salary account activation, employee onboarding progress, and corporate adoption across synced employees. Data is segmented by salary range, tenure, grade, age group, and department. Based on {list.length} employee{list.length !== 1 ? "s" : ""}.</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-2">
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm border-t-4 border-t-emerald-500">
                                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Accounts Opened</p>
                                    <p className="text-2xl font-bold text-emerald-600 mt-1">{completedCount}</p>
                                    <p className="text-[10px] text-[#9CA3AF] mt-1">Journey completed</p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm border-t-4 border-t-dashboard-primary">
                                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">In-progress</p>
                                    <p className="text-2xl font-bold text-dashboard-primary mt-1">{inProgressCount}</p>
                                    <p className="text-[10px] text-[#9CA3AF] mt-1">Applications started</p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm border-t-4 border-t-amber-400">
                                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Invited</p>
                                    <p className="text-2xl font-bold text-amber-600 mt-1">{invitedCount}</p>
                                    <p className="text-[10px] text-[#9CA3AF] mt-1">Awaiting response</p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm border-t-4 border-t-blue-500">
                                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Yet to invite</p>
                                    <p className="text-2xl font-bold text-blue-600 mt-1">{yetToInviteCount}</p>
                                    <p className="text-[10px] text-[#9CA3AF] mt-1">Eligible for outreach</p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm border-t-4 border-t-slate-400">
                                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Synced cohort</p>
                                    <p className="text-2xl font-bold text-slate-700 mt-1">{list.length}</p>
                                    <p className="text-[10px] text-[#9CA3AF] mt-1">Employees in view</p>
                                </div>
                            </div>

                            {/* Salary account activation potential */}
                            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm border-l-4 border-l-dashboard-primary">
                                <h3 className="text-base font-semibold text-[#111827] mb-1 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-dashboard-primary" /> Salary Account Activation Potential
                                </h3>
                                <p className="text-xs text-[#6B7280] mb-4">Estimated salary account activation opportunity from eligible employees. Segmented by salary range, tenure, grade, age group, and department.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                    <div className="bg-[#F9FAFB] rounded-lg p-4">
                                        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Employees</p>
                                        <p className="text-2xl font-bold text-[#111827] mt-0.5">{list.length.toLocaleString()}</p>
                                        <p className="text-xs text-[#6B7280] mt-0.5">Eligible pool</p>
                                    </div>
                                    <div className="bg-[#F9FAFB] rounded-lg p-4">
                                        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Total activation opportunity</p>
                                        <p className="text-2xl font-bold text-dashboard-primary mt-0.5">{activationReadyCount.toLocaleString()}</p>
                                        <p className="text-xs text-[#6B7280] mt-0.5">High-fit + standard-fit employees</p>
                                    </div>
                                    <div className="bg-[#F9FAFB] rounded-lg p-4">
                                        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Avg. salary / employee</p>
                                        <p className="text-2xl font-bold text-[#111827] mt-0.5">₹{avgSalaryL}L</p>
                                        <p className="text-xs text-[#6B7280] mt-0.5">Salary account based</p>
                                    </div>
                                    <div className="bg-[#F9FAFB] rounded-lg p-4">
                                        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Priority segment</p>
                                        <p className="text-2xl font-bold text-emerald-700 mt-0.5">{countHighFit} ({list.length ? Math.round((countHighFit / list.length) * 100) : 0}%)</p>
                                        <p className="text-xs text-[#6B7280] mt-0.5">High salary account fit</p>
                                    </div>
                                </div>
                                <div className="border-t border-[#E5E7EB] pt-4">
                                    <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Salary account fit segmentation</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                                            <span className="text-sm font-medium text-emerald-800">High-fit employees</span>
                                            <span className="text-sm font-semibold text-emerald-900">{countHighFit}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-100">
                                            <span className="text-sm font-medium text-amber-800">Standard-fit employees</span>
                                            <span className="text-sm font-semibold text-amber-900">{countStandardFit}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 border border-slate-200">
                                            <span className="text-sm font-medium text-slate-700">Needs follow-up</span>
                                            <span className="text-sm font-semibold text-slate-800">{countNeedsFollowUp}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 text-[#6B7280] text-xs font-semibold uppercase tracking-wider"><TrendingUp className="w-4 h-4" /> Activation rate</div>
                                    <p className="text-2xl font-bold text-[#111827] mt-1">{completionRate}%</p>
                                    <p className="text-xs text-[#6B7280] mt-0.5">Employees with completed account opening</p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 text-[#6B7280] text-xs font-semibold uppercase tracking-wider">Eligible employees</div>
                                    <p className="text-2xl font-bold text-[#111827] mt-1">{eligibleForInviteCount}</p>
                                    <p className="text-xs text-[#6B7280] mt-0.5">Ready for salary account invite</p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 text-[#6B7280] text-xs font-semibold uppercase tracking-wider">Stable tenure</div>
                                    <p className="text-2xl font-bold text-[#111827] mt-1">{stableShare}%</p>
                                    <p className="text-xs text-[#6B7280] mt-0.5">Employees with 2+ years tenure</p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 text-[#6B7280] text-xs font-semibold uppercase tracking-wider">Avg. salary</div>
                                    <p className="text-2xl font-bold text-[#111827] mt-1">₹{avgSalaryL}L</p>
                                    <p className="text-xs text-[#6B7280] mt-0.5">Annual salary of eligible pool</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                                    <h3 className="text-sm font-semibold text-[#111827] mb-4">Age brackets (25–30 years &amp; above)</h3>
                                    <div className="space-y-3">
                                        {ageDistribution.map(({ label, count }) => {
                                            const pct = list.length ? Math.round((count / list.length) * 100) : 0;
                                            return (
                                                <div key={label} className="flex items-center gap-3">
                                                    <span className="text-sm font-medium text-[#374151] w-14">{label}</span>
                                                    <div className="flex-1 h-6 bg-[#F3F4F6] rounded-full overflow-hidden">
                                                        <div className="h-full bg-dashboard-primary rounded-full transition-all" style={{ width: `${Math.max(4, pct)}%` }} />
                                                    </div>
                                                    <span className="text-sm text-[#6B7280] w-16 text-right">{count} ({pct}%)</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                                    <h3 className="text-sm font-semibold text-[#111827] mb-4">Salary account fit distribution</h3>
                                    <div className="space-y-3">
                                        {fitDistribution.map(({ key, label, count }) => {
                                            const pct = list.length ? Math.round((count / list.length) * 100) : 0;
                                            return (
                                                <div key={key} className="flex items-center gap-3">
                                                    <span className="text-sm font-medium text-[#374151] min-w-[140px]">{label}</span>
                                                    <div className="flex-1 h-6 bg-[#F3F4F6] rounded-full overflow-hidden">
                                                        <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${Math.max(4, pct)}%` }} />
                                                    </div>
                                                    <span className="text-sm text-[#6B7280] w-16 text-right">{count} ({pct}%)</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm overflow-hidden">
                                    <h3 className="text-sm font-semibold text-[#111827] mb-4">Department-wise age split</h3>
                                    <div className="overflow-x-auto overflow-y-auto max-h-[50vh] min-h-0">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-[#E5E7EB]">
                                                    <th className="text-left py-2 font-semibold text-[#374151]">Department</th>
                                                    {ageBrackets.map((b) => <th key={b.label} className="text-right py-2 font-semibold text-[#374151] w-12">{b.label}</th>)}
                                                    <th className="text-right py-2 font-semibold text-[#374151]">Avg age</th>
                                                    <th className="text-right py-2 font-semibold text-[#374151]">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#E5E7EB]">
                                                {deptAgeSplit.map((row) => (
                                                    <tr key={row.dept}>
                                                        <td className="py-2 text-[#111827]">{row.dept}</td>
                                                        {row.byBracket.map((c, i) => <td key={i} className="text-right py-2 text-[#6B7280]">{c}</td>)}
                                                        <td className="text-right py-2 font-medium text-[#111827]">{row.avgAge}</td>
                                                        <td className="text-right py-2 font-medium text-[#111827]">{row.total}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                                    <h3 className="text-sm font-semibold text-[#111827] mb-4">Salary-wise split</h3>
                                    <div className="space-y-3">
                                        {salarySplit.map(({ label, count }) => {
                                            const pct = list.length ? Math.round((count / list.length) * 100) : 0;
                                            return (
                                                <div key={label} className="flex items-center gap-3">
                                                    <span className="text-sm font-medium text-[#374151] min-w-[100px]">{label}</span>
                                                    <div className="flex-1 h-6 bg-[#F3F4F6] rounded-full overflow-hidden">
                                                        <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${Math.max(4, pct)}%` }} />
                                                    </div>
                                                    <span className="text-sm text-[#6B7280] w-16 text-right">{count} ({pct}%)</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                                <h3 className="text-sm font-semibold text-[#111827] mb-3">Salary account activation summary</h3>
                                <ul className="text-sm text-[#6B7280] space-y-1 list-disc list-inside">
                                    <li>Eligible pool: {list.length} employees synced for salary account onboarding</li>
                                    <li>Accounts opened: {completedCount} employees have completed the journey</li>
                                    <li>In-progress: {inProgressCount} employees have started the journey</li>
                                    <li>Invited: {invitedCount} employees are awaiting response</li>
                                    <li>Yet to be invited: {yetToInviteCount} employees are eligible for outreach</li>
                                    <li>Priority segment: {countHighFit} employees show high salary account activation fit</li>
                                </ul>
                            </div>

                                <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                                    <div className="px-5 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                                        <h2 className="text-sm font-semibold text-[#111827]">Engagement Overview</h2>
                                        <p className="text-xs text-[#6B7280] mt-0.5">High-level insights into salary account onboarding progress and employee activation.</p>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-sm text-[#6B7280]">Select an employee from the directory to view detailed salary account journey progress and activation insights.</p>
                                    </div>
                                </div>
                        </div>
                    );
                })() : (
                <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center px-5 py-4 border-b border-[#E5E7EB]">
                        <div className="flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 h-10 w-80 focus-within:ring-2 focus-within:ring-dashboard-primary/20 focus-within:border-dashboard-primary transition-all">
                            <Search className="w-4 h-4 text-[#9CA3AF]" />
                            <input type="text" placeholder="Search by name, ID, email or phone..." value={searchQuery} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="ml-2 text-sm outline-none w-full bg-transparent" />
                            {searchQuery && <button onClick={() => setSearchQuery("")} className="text-[#9CA3AF] hover:text-[#374151]"><X className="w-4 h-4" /></button>}
                        </div>
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={handleRefreshInvites} className="h-10 px-4 border border-[#E5E7EB] bg-white text-[#374151] font-medium text-sm rounded-lg hover:bg-[#F9FAFB] transition-colors flex items-center gap-2"><RefreshCcw className="w-4 h-4" /> Refresh all</button>
                            <button className="h-10 px-4 bg-dashboard-primary text-white font-medium text-sm rounded-lg hover:bg-dashboard-primary-dark transition-colors flex items-center gap-2 shadow-sm"><Download className="w-4 h-4" /> Download CSV</button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0 max-h-[70vh]">
                        <table className="w-full text-sm border-separate border-spacing-0 min-w-[1040px]">
                            <thead className="bg-[#F9FAFB]">
                                <tr>
                                    <HeaderCell label="Employee name" stickyTopRow /><HeaderCell label="Phone number" stickyTopRow /><HeaderCell label="Official Email ID" className="w-[180px]" stickyTopRow /><HeaderCell label="Journey Category" stickyTopRow /><HeaderCell label="Journey Status" hasFilter className="w-[160px]" stickyTopRow /><HeaderCell label="Reference ID" className="w-[55px] px-3" stickyTopRow />
                                    {portalMode === "rm" && <HeaderCell label="Updates" className="w-[90px]" stickyTopRow />}
                                    <HeaderCell label="Actions" subtitle="Refresh now · Nudge · Invite" stickyTopRow stickyRight />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E7EB]">
                                {paginatedList.length === 0 ? (
                                    <tr><td colSpan={portalMode === "rm" ? 8 : 7} className="px-5 py-12 text-center text-[#6B7280] text-sm">{activeTab === "accountOpened" ? "No employees have completed their journey yet." : "No employees match your search."}</td></tr>
                                ) : paginatedList.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-[#F9FAFB] transition-colors group">
                                        <td className="px-5 py-4"><button onClick={() => setSelectedEmployee(emp)} className="text-dashboard-primary font-semibold hover:underline cursor-pointer text-left">{emp.name}</button></td>
                                        <td className="px-5 py-4 text-[#6B7280]">{emp.phone}</td>
                                        <td className="px-5 py-4 text-[#6B7280] w-[180px]"><span className="block max-w-[160px] truncate" title={emp.email}>{emp.email}</span></td>
                                        <td className="px-5 py-4">{(() => { const m = getJourneyCategory(emp.journey); return <span className={cn("px-2 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap", m.className)}>{m.label}</span>; })()}</td>
                                        <td className="px-5 py-4 w-[160px]">{(() => { const b = getStatusBadge(emp.id, !!invitedEmployeeIds[emp.id], employeeStatuses); return <span className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap", b.className)}>{b.label === "Completed" && <CheckCircle2 className="w-3 h-3" />}{b.label !== "Not Started" && b.label !== "Invited" && b.label !== "Completed" && <Clock className="w-3 h-3" />}{b.label}</span>; })()}</td>
                                        <td className="px-3 py-4 text-[#9CA3AF] w-[55px]">{emp.id.split("-")[1] || "—"}</td>
                                        {portalMode === "rm" && (
                                            <td className="px-3 py-4">
                                                {getPendingUpdates(emp.id) ? (
                                                    <button type="button" onClick={() => setSelectedEmployeeForUpdates(emp)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200">
                                                        Updates
                                                    </button>
                                                ) : (
                                                    <span className="text-[#9CA3AF] text-xs">—</span>
                                                )}
                                            </td>
                                        )}
                                        <td
                                            className={cn(
                                                "px-4 py-4 text-right align-middle sticky right-0 z-20 border-l border-[#E5E7EB] bg-white min-w-[300px] shadow-[-12px_0_20px_-12px_rgba(0,0,0,0.1)]",
                                                "group-hover:bg-[#F9FAFB]",
                                            )}
                                        >
                                            <div className="flex items-center justify-end gap-2 flex-nowrap">
                                                <button type="button" onClick={refreshStatuses} className="text-dashboard-primary font-medium text-xs cursor-pointer hover:underline shrink-0 whitespace-nowrap px-0.5">Refresh now</button>
                                                {isRmEmployeeDirectory &&
                                                    employeeEligibleForRmNudge(emp.id, !!invitedEmployeeIds[emp.id], employeeStatuses) && (
                                                        <RmEmployeeNudgeMenu
                                                            lastNudge={(() => { void rmNudgeListTick; return getLatestRmNudgeForEmployee(emp.id); })()}
                                                            sending={sendingRmNudgeEmployeeId === emp.id}
                                                            sendingMode={sendingRmNudgeEmployeeId === emp.id ? (rmNudgeSendingMode ?? null) : null}
                                                            onSend={(mode) => {
                                                                if (onSendRmNudge) onSendRmNudge(emp, mode);
                                                            }}
                                                        />
                                                    )}
                                                <button onClick={() => handleInvite(emp)} disabled={!!invitedEmployeeIds[emp.id] || employeeStatuses[emp.id]?.status === "completed"} className={cn("h-8 px-4 border border-[#E5E7EB] rounded-full text-xs font-semibold transition-all shrink-0 whitespace-nowrap", invitedEmployeeIds[emp.id] || employeeStatuses[emp.id]?.status === "completed" ? "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed" : "bg-white text-[#374151] hover:bg-dashboard-primary hover:text-white hover:border-dashboard-primary")}>{employeeStatuses[emp.id]?.status === "completed" ? "Completed" : invitedEmployeeIds[emp.id] ? "Invited" : "Invite"}</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-center">
                        <div className="flex gap-3">
                            <button disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)} className={cn("px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm flex items-center gap-1", currentPage <= 1 ? "text-[#9CA3AF] cursor-not-allowed bg-white" : "bg-white text-[#374151] hover:bg-[#F9FAFB] cursor-pointer")}><ChevronLeft className="w-4 h-4" /> Previous</button>
                            <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)} className={cn("px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm flex items-center gap-1", currentPage >= totalPages ? "text-[#9CA3AF] cursor-not-allowed bg-white" : "bg-white text-[#374151] hover:bg-[#F9FAFB] cursor-pointer")}>Next <ChevronRight className="w-4 h-4" /></button>
                        </div>
                        <div className="text-sm text-[#6B7280]">Page {currentPage} of {totalPages} <span className="ml-2 text-[#9CA3AF]">({currentList.length} employee{currentList.length !== 1 ? "s" : ""})</span></div>
                    </div>
                </div>
                )}
            </div>
            {portalMode === "rm" && selectedEmployeeForUpdates && (() => {
                const pending = getPendingUpdates(selectedEmployeeForUpdates.id);
                if (!pending) return null;
                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedEmployeeForUpdates(null)}>
                        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                                <h3 className="text-lg font-bold text-[#111827]">HRMS updates – {(selectedEmployeeForUpdates as { name?: string }).name ?? selectedEmployeeForUpdates.id}</h3>
                                <button type="button" onClick={() => setSelectedEmployeeForUpdates(null)} className="p-1 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6]"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="px-6 py-4 space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-[#374151] mb-2">Changes in employee info</h4>
                                    <ul className="list-disc list-inside text-sm text-[#6B7280] space-y-1">
                                        {pending.changes.map((c, i) => <li key={i}>{c}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-[#374151] mb-2">Profile updates</h4>
                                    <div className="text-sm text-[#6B7280] space-y-1">
                                        {pending.profileBefore && (
                                            <p><span className="font-medium text-[#374151]">Before:</span> Salary ₹{pending.profileBefore.salary != null ? (pending.profileBefore.salary / 100000).toFixed(1) : "—"}L, {pending.profileBefore.band ?? "—"}, {pending.profileBefore.designation ?? "—"}, {pending.profileBefore.employmentStatus ?? "—"}</p>
                                        )}
                                        <p><span className="font-medium text-[#374151]">After:</span> Salary ₹{(pending.profileAfter.salary / 100000).toFixed(1)}L, {pending.profileAfter.band}, {pending.profileAfter.designation}, {pending.profileAfter.employmentStatus}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-[#374151] mb-2">Offers (eligible now)</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {pending.offersAfter.topUpEligible && pending.offersAfter.topUpAmount && (
                                            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800">Top-up up to ₹{(pending.offersAfter.topUpAmount / 100000).toFixed(1)}L</span>
                                        )}
                                        {!pending.offersAfter.topUpEligible && (
                                            <span className="text-sm text-[#6B7280]">No new product offers</span>
                                        )}
                                    </div>
                                    {pending.offersAfter.updatedTerms && <p className="text-xs text-[#6B7280] mt-1">{pending.offersAfter.updatedTerms}</p>}
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-end gap-3">
                                <button type="button" onClick={() => setSelectedEmployeeForUpdates(null)} className="h-10 px-4 border border-[#E5E7EB] rounded-lg text-sm font-semibold text-[#374151] bg-white hover:bg-[#F9FAFB]">
                                    Close
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmployeeOfferNotification(selectedEmployeeForUpdates.id);
                                        clearPendingUpdates(selectedEmployeeForUpdates.id);
                                        setSelectedEmployeeForUpdates(null);
                                    }}
                                    className="h-10 px-4 rounded-lg text-sm font-semibold text-white bg-dashboard-primary hover:opacity-90"
                                >
                                    Trigger offers
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </>
    );

    if (activePage === "dashboard") {
        // RM Portal: hero, quick actions, and global analytics across all employees and product offerings
        if (portalMode === "rm") {
            const totalEmployees = employees.length;
            const personalLoanCompleted = employees.filter((e) => employeeStatuses[e.id]?.status === "completed").length;
            const personalLoanInProgress = employees.filter((e) => employeeStatuses[e.id]?.status === "in_progress").length;
            const personalLoanInvited = employees.filter(
                (e) => invitedEmployeeIds[e.id] && employeeStatuses[e.id]?.status !== "in_progress" && employeeStatuses[e.id]?.status !== "completed"
            ).length;
            const personalLoanNotStarted = totalEmployees - personalLoanCompleted - personalLoanInProgress - personalLoanInvited;
            const personalLoanUtilization = totalEmployees > 0 ? Math.round((personalLoanCompleted / totalEmployees) * 100) : 0;

            // AU banking product offerings for salary account portal
            const productOfferings = [
                { name: "Corporate Salary Package", category: "Corporate Banking", eligible: totalEmployees, applied: personalLoanInProgress + personalLoanInvited, completed: personalLoanCompleted, utilization: personalLoanUtilization },
                { name: "Savings Account", category: "Deposits", eligible: totalEmployees, applied: 0, completed: 0, utilization: 0 },
                { name: "Fixed Deposit", category: "Deposits", eligible: totalEmployees, applied: 0, completed: 0, utilization: 0 },
                { name: "Home Loans", category: "Loans", eligible: totalEmployees, applied: 0, completed: 0, utilization: 0 },
                { name: "AU 0101", category: "Digital Banking", eligible: totalEmployees, applied: 0, completed: 0, utilization: 0 },
            ];

            return (
                <>
                    <div className="mb-8 rounded-2xl overflow-hidden shadow-lg" style={{ background: "linear-gradient(135deg, #42265e 0%, #2e1a42 60%, #2a183c 100%)" }}>
                        <div className="px-8 py-8 md:py-10 flex flex-col sm:flex-row sm:items-center gap-5 md:gap-8">
                            <SbiSidebarSymbol priority boxClassName="w-14 h-14 md:w-16 md:h-16 shrink-0 drop-shadow-md" />
                            <div className="min-w-0">
                                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">AU Bank – Corporate Salary Banking</h1>
                                <p className="text-sm md:text-base text-white/90 mt-1 max-w-xl">Manage corporates and salary account opening journeys: NTB, ETB with KYC, ETB Auto Conversion.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8 mb-10">
                        <div className="flex-1">
                            <h2 className="text-base font-bold text-[#111827] mb-6">Quick actions to get started!</h2>
                            <div className="flex flex-wrap gap-6">
                                <QuickActionItem 
                                    icon={Link2} 
                                    label="Add New Connection" 
                                    onClick={onAddNewConnection}
                                    bgColor="bg-[#3B82F6]"
                                    iconColor="text-white"
                                />
                                <QuickActionItem 
                                    icon={Building2} 
                                    label="Add New Corporate" 
                                    onClick={onAddNewCorporate}
                                    bgColor="bg-[#FFF1F2]"
                                    iconColor="text-[#E11D48]"
                                />
                                <QuickActionItem 
                                    icon={PieChart} 
                                    label="Create New Report" 
                                    onClick={() => onNavigate?.("reporting")}
                                    bgColor="bg-[#F5F3FF]"
                                    iconColor="text-[#7C3AED]"
                                />
                                <QuickActionItem 
                                    icon={Webhook} 
                                    label="Configure Webhook" 
                                    onClick={() => onNavigate?.("webhooks")}
                                    bgColor="bg-[#ECFDF5]"
                                    iconColor="text-[#059669]"
                                />
                            </div>
                        </div>

                        <div className="w-full lg:w-80 shrink-0">
                            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm relative overflow-hidden h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-bold text-[#111827]">Reporting</h3>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF1F2] text-[#E11D48]">
                                        <span className="w-1 h-1 rounded-full bg-[#E11D48] mr-1"></span>
                                        New Feature
                                    </span>
                                </div>
                                <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
                                    Check out our new reporting section for easy tracking and real-time insights!
                                </p>
                                <button 
                                    onClick={() => onNavigate?.("reporting")}
                                    className="w-full h-11 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                >
                                    Check Reporting <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mb-8">
                        <h2 className="text-base font-bold text-[#111827] mb-5">Account Opening Overview</h2>
                        <p className="text-sm text-[#6B7280] mb-5">Aggregate metrics across all employees and salary account opening journeys.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                            <StatCard label="Total employees" value={totalEmployees + 1240} subtitle="Across all corporates" icon={<Users className="w-6 h-6" />} color="blue" />
                            <StatCard label="Accounts Opened" value={personalLoanCompleted + 482 + 312 + 156} subtitle="All banking products" icon={<CheckCircle2 className="w-6 h-6" />} color="green" />
                            <StatCard label="In Progress" value={personalLoanInProgress + 124 + 85 + 42} subtitle="Applications started" icon={<Clock className="w-6 h-6" />} color="orange" />
                            <StatCard label="Account Invites" value={personalLoanInvited + 850} subtitle="Awaiting response" icon={<Send className="w-6 h-6" />} color="yellow" />
                            <StatCard label="Not Started" value={personalLoanNotStarted + 1200} subtitle="Eligible pool" icon={<Users className="w-6 h-6" />} color="grey" />
                        </div>
                        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0">
                            <h3 className="text-sm font-semibold text-[#111827] px-5 py-4 border-b border-[#E5E7EB]">Metrics by banking product</h3>
                            <div className="overflow-x-auto overflow-y-auto max-h-[50vh] min-h-0">
                                <table className="w-full text-sm border-collapse min-w-[640px]">
                                    <thead className="bg-[#F9FAFB] sticky top-0 z-10">
                                        <tr className="border-b border-[#E5E7EB]">
                                            <th className="px-5 py-3 text-left font-semibold text-[#374151] text-xs uppercase tracking-wide">Product</th>
                                            <th className="px-5 py-3 text-left font-semibold text-[#374151] text-xs uppercase tracking-wide">Category</th>
                                            <th className="px-5 py-3 text-right font-semibold text-[#374151] text-xs uppercase tracking-wide">Eligible</th>
                                            <th className="px-5 py-3 text-right font-semibold text-[#374151] text-xs uppercase tracking-wide">Applied</th>
                                            <th className="px-5 py-3 text-right font-semibold text-[#374151] text-xs uppercase tracking-wide">Completed</th>
                                            <th className="px-5 py-3 text-right font-semibold text-[#374151] text-xs uppercase tracking-wide">Utilization %</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E5E7EB]">
                                        {[
                                            { name: "Corporate Salary Package", category: "Corporate Banking", eligible: totalEmployees + 1240, applied: personalLoanInProgress + personalLoanInvited + 124, completed: personalLoanCompleted + 482 },
                                            { name: "Savings Account", category: "Deposits", eligible: totalEmployees + 1240, applied: 85, completed: 312 },
                                            { name: "Home Loans", category: "Loans", eligible: totalEmployees + 1240, applied: 42, completed: 156 },
                                            { name: "AU 0101", category: "Digital Banking", eligible: totalEmployees + 1240, applied: 28, completed: 94 },
                                            { name: "Cash Management Products", category: "Corporate Banking", eligible: totalEmployees + 1240, applied: 15, completed: 68 },
                                        ].map((p) => {
                                            const util = Math.round((p.completed / p.eligible) * 100);
                                            return (
                                                <tr key={p.name} className="hover:bg-[#F9FAFB]">
                                                    <td className="px-5 py-3 font-medium text-[#111827]">{p.name}</td>
                                                    <td className="px-5 py-3 text-[#6B7280]">{p.category}</td>
                                                    <td className="px-5 py-3 text-right text-[#111827]">{p.eligible.toLocaleString()}</td>
                                                    <td className="px-5 py-3 text-right text-[#111827]">{p.applied.toLocaleString()}</td>
                                                    <td className="px-5 py-3 text-right text-[#111827]">{p.completed.toLocaleString()}</td>
                                                    <td className="px-5 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${util}%` }} />
                                                            </div>
                                                            <span className={cn("font-medium min-w-[30px]", util > 0 ? "text-emerald-600" : "text-[#6B7280]")}>{util}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
        // Super-admin / other: full dashboard with quick actions and analytics
        const quickActions = [
            { label: "Add New Connection", icon: Link2, bg: "bg-[#E6F2FF]", iconColor: "text-[#0066CC]", onClick: () => onNavigate?.("connections") },
            { label: "Add New Corporate", icon: Building2, bg: "bg-[#FFEDD5]", iconColor: "text-[#EA580C]", onClick: () => onNavigate?.("corporates") },
            { label: "Create New Report", icon: PieChart, bg: "bg-[#EDE9FE]", iconColor: "text-[#7C3AED]", onClick: () => onNavigate?.("reporting") },
            { label: "Configure Webhook", icon: Webhook, bg: "bg-[#D1FAE5]", iconColor: "text-[#059669]", onClick: () => onNavigate?.("webhooks") },
        ];
        return (
            <>
                <div className="mb-10 rounded-2xl overflow-hidden shadow-lg" style={{ background: "linear-gradient(135deg, #42265e 0%, #2e1a42 60%, #2a183c 100%)" }}>
                    <div className="px-8 py-8 md:py-10 flex flex-col sm:flex-row sm:items-center gap-5 md:gap-8">
                        <SbiSidebarSymbol priority boxClassName="w-14 h-14 md:w-16 md:h-16 shrink-0 drop-shadow-md" />
                        <div className="min-w-0">
                            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">AU Bank – Salary Account Portal</h1>
                            <p className="text-sm md:text-base text-white/90 mt-1 max-w-xl">Quick actions, analytics and insights for corporate salary account management.</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
                    <div className="lg:col-span-7">
                        <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-5">Quick actions to get started</h2>
                        <div className="flex flex-wrap gap-5">
                            {quickActions.map(({ label, icon: Icon, bg, iconColor, onClick }) => (
                                <button key={label} type="button" onClick={onClick} className={`flex-shrink-0 w-24 h-24 rounded-2xl ${bg} ${iconColor} flex flex-col items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-sm`}>
                                    <Icon className="w-7 h-7" />
                                    <span className="text-[10px] font-semibold text-center px-1 leading-tight max-w-[70px]">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-5">
                        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm h-full hover:shadow-md transition-shadow">
                            <h2 className="text-base font-bold text-[#111827] flex items-center gap-2 flex-wrap">
                                <span>Reporting</span>
                                <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-semibold">New</span>
                            </h2>
                            <p className="text-sm text-[#6B7280] mt-3">Check out our new reporting section for easy tracking and real-time insights!</p>
                            <button type="button" className="mt-4 h-10 px-5 bg-dashboard-primary text-white font-semibold text-sm rounded-lg hover:bg-dashboard-primary-dark transition-colors inline-flex items-center gap-2">
                                Check Reporting →
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mb-10">
                    <h2 className="text-base font-bold text-[#111827] mb-5">Connection Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <StatCard label="Active" value={58} subtitle="Live connections" icon={<Link2 className="w-6 h-6" />} color="blue" />
                        <StatCard label="Pending" value={80} subtitle="Awaiting setup" icon={<Clock className="w-6 h-6" />} color="orange" />
                        <StatCard label="Terminated" value={13} subtitle="Ended" icon={<XCircle className="w-6 h-6" />} color="red" />
                    </div>
                </div>
                <div>
                    <h2 className="text-base font-bold text-[#111827] mb-5">User Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <StatCard label="Total Users" value={7} subtitle="All accounts" icon={<Users className="w-6 h-6" />} color="blue" />
                        <StatCard label="Active Users" value={6} subtitle="Currently active" icon={<RefreshCcw className="w-6 h-6" />} color="green" />
                        <StatCard label="Pending Users" value={0} subtitle="Invited" icon={<Clock className="w-6 h-6" />} color="yellow" />
                        <StatCard label="Disabled Users" value={1} subtitle="Inactive" icon={<XCircle className="w-6 h-6" />} color="purple" />
                    </div>
                </div>
            </>
        );
    }

    if (activePage === "connections") {
        const activeConn = connections.filter((c) => c.status === "Active").length;
        const pendingConn = connections.filter((c) => c.status === "Pending").length;
        const termConn = connections.filter((c) => c.status === "Terminated").length;
        return (
            <>
                <p className="text-sm text-[#9CA3AF] mb-1">Dashboard</p>
                <div className="mb-6"><h1 className="text-2xl font-bold text-[#111827]">Connections</h1><p className="text-sm text-[#6B7280] mt-0.5">Hypersync console enables effortless, real-time standardized client data retrieval</p></div>
                <div className="grid grid-cols-3 gap-4 mb-6"><StatCard label="Active" value={activeConn} icon={<Rocket className="w-5 h-5" />} color="blue" /><StatCard label="Pending" value={pendingConn} icon={<Clock className="w-5 h-5" />} color="yellow" /><StatCard label="Terminated" value={termConn} icon={<XCircle className="w-5 h-5" />} color="red" /></div>
                <div className="flex gap-3 mb-4">
                    <div className="flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 h-10 w-80"><Search className="w-4 h-4 text-[#9CA3AF]" /><input type="text" placeholder="Search corporate..." className="ml-2 text-sm outline-none w-full bg-transparent" /></div>
                    <button className="h-10 px-4 border border-[#E5E7EB] bg-white text-[#374151] font-medium text-sm rounded-lg flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</button>
                    <button className="h-10 px-4 bg-dashboard-primary text-white font-medium text-sm rounded-lg flex items-center gap-2"><Rocket className="w-4 h-4" /> Add New Connection</button>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0"><p className="px-5 py-3 text-sm text-[#6B7280] flex-shrink-0">{connections.length} connections found</p>
                    <div className="overflow-x-auto overflow-y-auto max-h-[70vh] min-h-0"><table className="w-full text-sm border-collapse min-w-[1000px]"><thead className="bg-[#F9FAFB] sticky top-0 z-10"><tr className="border-b border-[#E5E7EB]"><HeaderCell label="Corporate" /><HeaderCell label="Connection ID" /><HeaderCell label="Date Of Connection" /><HeaderCell label="Integration" /><HeaderCell label="CSM" /><HeaderCell label="Last Synced" /><HeaderCell label="Sync Frequency" /><HeaderCell label="Status" /><HeaderCell label="Steps Status" /><th className="px-5 py-4">Action</th></tr></thead><tbody className="divide-y divide-[#E5E7EB]">{paginatedConnections.map((c) => (<tr key={c.id} className="hover:bg-[#F9FAFB]"><td className="px-5 py-4">{c.corporate}</td><td className="px-5 py-4 text-[#6B7280] font-mono text-xs">{c.id}</td><td className="px-5 py-4">{c.dateOfConnection}</td><td className="px-5 py-4">{c.integration}</td><td className="px-5 py-4">{c.csm}</td><td className="px-5 py-4">{c.lastSynced}</td><td className="px-5 py-4">{c.syncFreq}</td><td className="px-5 py-4"><span className={cn("px-2 py-1 rounded-full text-xs", c.status === "Active" ? "bg-blue-50 text-blue-700" : c.status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700")}>{c.status}</span></td><td className="px-5 py-4 text-[#6B7280]">{c.stepsStatus}</td><td className="px-5 py-4"><button className="text-dashboard-primary hover:underline">Complete journey</button> <button className="p-1">⋮</button></td></tr>))}</tbody></table></div>
                    <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-end items-center gap-2"><button disabled={connectionsPage <= 1} onClick={() => setConnectionsPage((p) => p - 1)} className="px-3 py-1.5 border rounded-lg disabled:opacity-50">‹</button>{[1, 2, 3, 4].slice(0, connectionsTotalPages).map((n) => (<button key={n} onClick={() => setConnectionsPage(n)} className={cn("px-3 py-1.5 border rounded-lg", connectionsPage === n ? "bg-dashboard-primary text-white border-dashboard-primary" : "")}>{n}</button>))}<span className="text-sm text-[#6B7280] ml-2">... {connectionsTotalPages}</span><button disabled={connectionsPage >= connectionsTotalPages} onClick={() => setConnectionsPage((p) => p + 1)} className="px-3 py-1.5 border rounded-lg disabled:opacity-50">›</button></div>
                </div>
            </>
        );
    }

    if (activePage === "rm-employees") {
        return (
            <>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#111827]">Employees</h1>
                    <p className="text-sm text-[#6B7280] mt-0.5">All employees across your corporates</p>
                </div>
                {employeeDirectoryTable}
            </>
        );
    }

    if (activePage === "rm-products") {
        const products = [
            { name: "Corporate Salary Packages", desc: "Specialized salary accounts for corporate employees", icon: Building2, category: "Corporate Banking" },
            { name: "Savings Accounts", desc: "Regular, basic, and digital savings accounts via AU 0101", icon: PiggyBank, category: "Deposits" },
            { name: "Current Accounts", desc: "Business and individual current account solutions", icon: Building2, category: "Deposits" },
            { name: "Fixed Deposits", desc: "e-TDR/e-STDR fixed deposit solutions", icon: FileText, category: "Deposits" },
            { name: "Home Loans", desc: "Housing finance solutions for customers", icon: Home, category: "Loans" },
            { name: "Personal Loans", desc: "Personal finance solutions for eligible customers", icon: FileText, category: "Loans" },
            { name: "Car Loans", desc: "Vehicle finance for new and used cars", icon: Car, category: "Loans" },
            { name: "AU 0101", desc: "Banking, shopping, and investment services in one app", icon: Sparkles, category: "Digital Banking" },
            { name: "Cash Management Products", desc: "AU Business solutions for bulk and vendor payments", icon: Building2, category: "Corporate Banking" },
        ];

        const corpMeta = selectedCorporate ? corporatesTableData.find(c => c.corporateName === selectedCorporate) : null;
        const employeeCount = 1200; // Mock count
        const corpCategory = corpMeta?.corpCategory || "CAT A";

        return (
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-[#111827]">Banking Services</h1>
                        <p className="text-sm text-[#6B7280] mt-0.5">Manage and configure AU Bank banking and salary account services for corporates</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select 
                            value={selectedCorporate || ""} 
                            onChange={(e) => setSelectedCorporate(e.target.value || null)}
                            className="h-10 px-4 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-dashboard-primary/20"
                        >
                            <option value="">Select Corporate...</option>
                            {corporatesTableData.map(c => (
                                <option key={c.corporateName} value={c.corporateName}>{c.corporateName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedCorporate && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-amber-900">Smart Recommendations for {selectedCorporate}</h3>
                            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                                Based on {selectedCorporate}&apos;s <strong>{corpCategory}</strong> status and <strong>{employeeCount}</strong> employees, we recommend enabling 
                                <span className="font-semibold"> Corporate Salary Packages, AU 0101, and Home Loans</span> as primary offerings. 
                                Cash Management Products are highly relevant for the business segment.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {products.map((p) => {
                        const isEnabled = selectedCorporate ? (corporateBenefitToggles[selectedCorporate]?.[products.indexOf(p)] ?? true) : true;
                        return (
                            <div key={p.name} className={cn(
                                "bg-white border rounded-2xl p-6 transition-all group",
                                isEnabled ? "border-[#E5E7EB] shadow-sm hover:shadow-md" : "border-slate-100 opacity-60 grayscale"
                            )}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                        isEnabled ? "bg-blue-50 text-blue-700 group-hover:bg-dashboard-primary group-hover:text-white" : "bg-slate-50 text-slate-400"
                                    )}>
                                        <p.icon className="w-6 h-6" />
                                    </div>
                                    {selectedCorporate && (
                                        <button
                                            onClick={() => {
                                                setCorporateBenefitToggles((prev) => {
                                                    const existing = prev[selectedCorporate] || {};
                                                    const idx = products.indexOf(p);
                                                    return { ...prev, [selectedCorporate]: { ...existing, [idx]: !isEnabled } };
                                                });
                                            }}
                                            className={cn(
                                                "w-10 h-5 rounded-full transition-colors flex items-center px-0.5",
                                                isEnabled ? "bg-emerald-500 justify-end" : "bg-slate-300 justify-start"
                                            )}
                                        >
                                            <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                                        </button>
                                    )}
                                </div>
                                <h3 className="font-bold text-[#111827] text-lg">{p.name}</h3>
                                <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">{p.desc}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] bg-slate-50 px-2 py-1 rounded">
                                        {p.category}
                                    </span>
                                    {isEnabled && (
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">ACTIVE</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (activePage === "rm-analytics") {
        const activeConn = connections.filter((c) => c.status === "Active").length;
        const pendingConn = connections.filter((c) => c.status === "Pending").length;
        return (
            <>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#111827]">Analytics</h1>
                    <p className="text-sm text-[#6B7280] mt-0.5">Connection and onboarding insights</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <StatCard label="Active Connections" value={activeConn} icon={<Rocket className="w-5 h-5" />} color="blue" />
                    <StatCard label="Pending" value={pendingConn} icon={<Clock className="w-5 h-5" />} color="yellow" />
                    <StatCard label="Corporates Onboarded" value={corporatesTableData.length} icon={<Building2 className="w-5 h-5" />} color="green" />
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm">
                    <h3 className="font-semibold text-[#111827] mb-4">Connection trends</h3>
                    <div className="h-48 flex items-center justify-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                        <p className="text-sm text-[#6B7280]">Chart placeholder — integrate with your analytics API</p>
                    </div>
                </div>
            </>
        );
    }

    if (activePage === "reporting") {
        return (<><div className="mb-6"><h1 className="text-2xl font-bold text-[#111827]">Reports</h1><p className="text-sm text-[#6B7280] mt-0.5">Create and manage reports to visualize your data.</p></div><div className="flex gap-6 border-b border-[#E5E7EB] mb-4"><button className="pb-3 text-sm font-semibold border-b-2 border-dashboard-primary text-dashboard-primary -mb-px">All Reports (0)</button><button className="pb-3 text-sm font-semibold border-b-2 border-transparent text-[#6B7280] -mb-px">Execution History (0)</button></div><div className="flex justify-between mb-6"><div className="flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 h-10 w-80"><Search className="w-4 h-4 text-[#9CA3AF]" /><input placeholder="Search by report name." className="ml-2 text-sm outline-none w-full bg-transparent" /></div><button className="h-10 px-4 bg-dashboard-primary text-white font-medium text-sm rounded-lg flex items-center gap-2"><Plus className="w-4 h-4" /> Create report</button></div><div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm flex-1 flex flex-col items-center justify-center min-h-[400px] py-16"><div className="w-20 h-20 rounded-xl bg-blue-50 flex items-center justify-center mb-4"><PieChart className="w-10 h-10 text-dashboard-primary" /></div><h3 className="text-lg font-bold text-[#111827] mb-2">No reports found.</h3><p className="text-sm text-[#6B7280] mb-4">Get started by creating your first report.</p><button className="h-10 px-4 bg-dashboard-primary text-white font-medium text-sm rounded-lg flex items-center gap-2"><Plus className="w-4 h-4" /> Create report</button></div></>);
    }

    if (activePage === "corporates") {
            if (selectedCorporate) {
            const corpMeta = corporatesTableData.find((c) => c.corporateName === selectedCorporate);
            const corpCategory = corpMeta?.corpCategory || "CAT A";
            // AU banking services for corporate salary account portal
            const corpBenefitsBase = [
                { name: "Corporate Salary Package", category: "Corporate Banking", pct: 72, count: 899 },
                { name: "Savings Account", category: "Deposits", pct: 55, count: 686 },
                { name: "AU 0101", category: "Digital Banking", pct: 48, count: 599 },
                { name: "Home Loans", category: "Loans", pct: 35, count: 437 },
                { name: "Cash Management Products", category: "Corporate Banking", pct: 32, count: 399 },
            ];
            const corpBenefits = corpBenefitsBase.map((b) => {
                let enabled = true;
                if (corpCategory === "CAT C") {
                    // CAT C: restrict to Salary Package and Savings Account only
                    enabled = b.name === "Corporate Salary Package" || b.name === "Savings Account";
                }
                return { ...b, enabled };
            });
            const corpKey = selectedCorporate;
            const corpToggles: Record<number, boolean> = (() => {
                const def = Object.fromEntries(corpBenefits.map((b, i) => [i, b.enabled])) as Record<number, boolean>;
                const overrides = corporateBenefitToggles[corpKey] || {};
                return { ...def, ...overrides };
            })();

            return (
                <>
                    <div className="mb-6">
                        <button
                            onClick={() => setSelectedCorporate(null)}
                            className="flex items-center gap-2 text-sm text-dashboard-primary font-medium hover:underline"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Corporates
                        </button>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-[#111827] mb-1">{selectedCorporate}</h1>
                            <p className="text-sm text-[#6B7280]">
                                Configure services and view the employee directory for this corporate.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {corpMeta && (
                                <>
                                    {corpMeta.corpCategory && (
                                        <span
                                            className={cn(
                                                "px-2 py-1 rounded-full text-xs font-semibold",
                                                corpMeta.corpCategory === "CAT A"
                                                    ? "bg-dashboard-primary-light text-dashboard-primary"
                                                    : corpMeta.corpCategory === "CAT B"
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "bg-slate-100 text-slate-600"
                                            )}
                                        >
                                            Category: {corpMeta.corpCategory}
                                        </span>
                                    )}
                                    {corpMeta.kybStatus && (
                                        <span
                                            className={cn(
                                                "px-2 py-1 rounded-full text-xs font-medium",
                                                corpMeta.kybStatus === "Verified"
                                                    ? "bg-[#ECFDF5] text-[#059669]"
                                                    : corpMeta.kybStatus === "In Review"
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "bg-slate-100 text-slate-600"
                                            )}
                                        >
                                            KYB: {corpMeta.kybStatus}
                                        </span>
                                    )}
                                </>
                            )}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setCorporateServicesDropdownOpen((o) => !o)}
                                    className={cn(
                                        "flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm font-medium transition-colors",
                                        corporateServicesDropdownOpen
                                            ? "border-dashboard-primary bg-dashboard-primary-light text-dashboard-primary"
                                            : "border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F9FAFB]"
                                    )}
                                >
                                    Banking services ({corpBenefits.length})
                                    <ChevronDown className={cn("w-4 h-4 transition-transform", corporateServicesDropdownOpen && "rotate-180")} />
                                </button>
                                {corporateServicesDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" aria-hidden onClick={() => setCorporateServicesDropdownOpen(false)} />
                                        <div className="absolute right-0 top-full mt-1 z-20 w-[360px] max-h-[80vh] overflow-auto bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-2">
                                            <div className="px-3 pb-2 border-b border-[#E5E7EB] mb-2">
                                                <h3 className="text-sm font-semibold text-[#111827]">Banking services for this corporate</h3>
                                                <p className="text-xs text-[#6B7280] mt-0.5">AU Bank banking services. Enable or disable by category.</p>
                                            </div>
                                            <div className="space-y-0">
                                                {corpBenefits.map((b, i) => (
                                                    <div key={b.name} className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-[#F9FAFB]">
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-medium text-[#111827] truncate">{b.name}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-[#F3F4F6] text-[#6B7280]">{b.category}</span>
                                                                <span className="text-xs text-[#9CA3AF]">{b.pct}% · {b.count} eligible</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setCorporateBenefitToggles((prev) => {
                                                                    const existing = prev[corpKey] || {};
                                                                    const current = corpToggles[i] ?? b.enabled;
                                                                    return {
                                                                        ...prev,
                                                                        [corpKey]: { ...existing, [i]: !current },
                                                                    };
                                                                });
                                                            }}
                                                            className={cn(
                                                                "w-10 h-5 rounded-full transition-colors shrink-0 flex items-center",
                                                                (corpToggles[i] ?? b.enabled) ? "bg-dashboard-primary justify-end" : "bg-[#E5E7EB] justify-start"
                                                            )}
                                                        >
                                                            <span className="w-4 h-4 rounded-full bg-white shadow-sm mx-0.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-[#111827] mb-3">Employees</h2>
                        {employeeDirectoryTable}
                    </div>
                </>
            );
        }
        return (
            <>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#111827]">Corporates</h1>
                    <p className="text-sm text-[#6B7280] mt-0.5">Manage all corporate entities and their integrations</p>
                </div>
                <div className="flex gap-3 mb-4">
                    <div className="flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 h-10 w-80">
                        <Search className="w-4 h-4 text-[#9CA3AF]" />
                        <input type="text" placeholder="Search corporates..." value={corporatesSearch} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCorporatesSearch(e.target.value); setCorporatesPage(1); }} className="ml-2 text-sm outline-none w-full bg-transparent" />
                    </div>
                    <button type="button" className="h-10 px-4 border border-[#E5E7EB] bg-white text-[#374151] font-medium text-sm rounded-lg flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filters
                    </button>
                    {portalMode !== "hr" && onAddNewCorporate && (
                        <button type="button" onClick={onAddNewCorporate} className="h-10 px-4 bg-dashboard-primary text-white font-medium text-sm rounded-lg flex items-center gap-2 ml-auto">
                            <Plus className="w-4 h-4" /> Add New Corporate
                        </button>
                    )}
                </div>
                <p className="text-sm text-[#6B7280] mb-3">{filteredCorporates.length} corporates found</p>
                <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0">
                    <div className="overflow-x-auto overflow-y-auto max-h-[70vh] min-h-0">
                        <table className="w-full text-sm border-collapse min-w-[900px]">
                            <thead className="bg-[#F9FAFB] sticky top-0 z-10">
                                <tr className="border-b border-[#E5E7EB]">
                                    <th className="px-5 py-4 text-left font-semibold text-[#374151] text-xs uppercase tracking-wide">Corporate Name</th>
                                    <th className="px-5 py-4 text-left font-semibold text-[#374151] text-xs uppercase tracking-wide">Categories</th>
                                    <th className="px-5 py-4 text-left font-semibold text-[#374151] text-xs uppercase tracking-wide">Connections</th>
                                    <th className="px-5 py-4 text-left font-semibold text-[#374151] text-xs uppercase tracking-wide">Category</th>
                                    <th className="px-5 py-4 text-left font-semibold text-[#374151] text-xs uppercase tracking-wide">KYB Status</th>
                                    <th className="px-5 py-4 text-left font-semibold text-[#374151] text-xs uppercase tracking-wide">Status</th>
                                    <th className="px-5 py-4 text-left font-semibold text-[#374151] text-xs uppercase tracking-wide">Contact Name</th>
                                    <th className="px-5 py-4 text-left font-semibold text-[#374151] text-xs uppercase tracking-wide">
                                        <span className="flex items-center gap-1">Date Added <ChevronsUpDown className="w-4 h-4" /></span>
                                    </th>
                                    <th className="px-5 py-4 text-left font-semibold text-[#374151] text-xs uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E7EB]">
                                {paginatedCorporates.map((row, idx) => {
                                    const initials = row.corporateName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                                    const colorIdx = (corporatesPage - 1) * 10 + idx;
                                    const avatarBg = ["bg-[#E6F2FF]", "bg-[#D1FAE5]", "bg-[#EDE9FE]", "bg-[#FFEDD5]", "bg-[#FEE2E2]"][colorIdx % 5];
                                    const avatarColor = ["text-[#0066CC]", "text-[#059669]", "text-[#7C3AED]", "text-[#EA580C]", "text-[#DC2626]"][colorIdx % 5];
                                    return (
                                    <tr key={`corporate-${colorIdx}`} className="hover:bg-[#F9FAFB] transition-colors">
                                        <td className="px-5 py-4">
                                            <button type="button" onClick={() => setSelectedCorporate(row.corporateName)} className="flex items-center gap-3 text-left group">
                                                <span className={cn("w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0", avatarBg, avatarColor)}>{initials}</span>
                                                <span className="text-dashboard-primary font-semibold group-hover:underline">{row.corporateName}</span>
                                            </button>
                                        </td>
                                        <td className="px-5 py-4">
                                            {row.categories ? (
                                                <span className={cn("px-2 py-1 rounded-full text-xs font-medium", row.categories.includes("HRIS") ? "bg-[#E6F2FF] text-[#0066CC]" : row.categories.includes("Payroll") ? "bg-[#EDE9FE] text-[#7C3AED]" : "bg-[#D1FAE5] text-[#059669]")}>{row.categories}</span>
                                            ) : (
                                                <span className="text-[#9CA3AF]">-</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            {row.connections ? (
                                                <span className="px-2 py-1 rounded-full text-xs bg-[#F3F4F6] text-[#6B7280]">{row.connections}</span>
                                            ) : (
                                                <span className="text-[#9CA3AF]">-</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            {row.corpCategory ? (
                                                <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", row.corpCategory === "CAT A" ? "bg-dashboard-primary-light text-dashboard-primary" : row.corpCategory === "CAT B" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600")}>{row.corpCategory}</span>
                                            ) : (
                                                <span className="text-[#9CA3AF]">-</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            {row.kybStatus ? (
                                                <span className={cn("px-2 py-1 rounded-full text-xs font-medium", row.kybStatus === "Verified" ? "bg-[#ECFDF5] text-[#059669]" : row.kybStatus === "In Review" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600")}>{row.kybStatus}</span>
                                            ) : (
                                                <span className="text-[#9CA3AF]">-</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={cn("px-2 py-1 rounded-full text-xs font-medium", row.status === "Active" ? "bg-[#ECFDF5] text-[#059669]" : "bg-[#F3F4F6] text-[#6B7280]")}>{row.status}</span>
                                        </td>
                                        <td className="px-5 py-4 text-[#6B7280]">{row.contactName || "-"}</td>
                                        <td className="px-5 py-4 text-[#6B7280]">{row.dateAdded}</td>
                                        <td className="px-5 py-4">
                                            <button type="button" className="h-8 px-3 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] text-xs font-medium transition-colors">Open</button>
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-center">
                        <div className="text-sm text-[#6B7280]">Page {corporatesPage} of {corporatesTotalPages}</div>
                        <div className="flex items-center gap-1">
                            <button disabled={corporatesPage <= 1} onClick={() => setCorporatesPage((p) => p - 1)} className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg disabled:opacity-50 hover:bg-white">‹</button>
                            {[1, 2, 3, 4].filter((n) => n <= corporatesTotalPages).map((n) => (
                                <button key={n} onClick={() => setCorporatesPage(n)} className={cn("px-3 py-1.5 border rounded-lg min-w-[36px]", corporatesPage === n ? "bg-dashboard-primary text-white border-dashboard-primary" : "border-[#E5E7EB] hover:bg-white")}>{n}</button>
                            ))}
                            {corporatesTotalPages > 4 && <span className="px-1 text-[#6B7280]">...</span>}
                            {corporatesTotalPages > 4 && <button onClick={() => setCorporatesPage(corporatesTotalPages)} className={cn("px-3 py-1.5 border rounded-lg min-w-[36px]", corporatesPage === corporatesTotalPages ? "bg-dashboard-primary text-white border-dashboard-primary" : "border-[#E5E7EB] hover:bg-white")}>{corporatesTotalPages}</button>}
                            <button disabled={corporatesPage >= corporatesTotalPages} onClick={() => setCorporatesPage((p) => p + 1)} className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg disabled:opacity-50 hover:bg-white">›</button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (activePage === "integrations") {
        const filteredHrms = hrmsSearch.trim()
            ? hrmsIntegrations.filter((h) => h.name.toLowerCase().includes(hrmsSearch.toLowerCase()))
            : hrmsIntegrations;
            
        return (
            <div className="flex flex-col h-full -m-6 md:-m-10">
                {/* Header Section */}
                <div className="px-6 md:px-10 py-6 border-b border-[#E5E7EB] bg-white shrink-0">
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold text-[#111827]">Integrations</h1>
                    </div>
                    <p className="text-sm text-[#6B7280] mt-4">Explore the hrms integrations available <span className="font-bold">on our</span> platform.</p>
                </div>

                <div className="flex flex-1 min-h-0">
                    {/* Sidebar */}
                    <div className="w-64 border-r border-[#E5E7EB] bg-white shrink-0 p-6">
                        <h2 className="text-sm font-semibold text-[#111827] mb-6">Integration categories</h2>
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#F3F4F6] rounded-xl text-left">
                            <RefreshCcw className="w-5 h-5 text-[#111827]" />
                            <span className="text-sm font-semibold text-[#111827]">HRMS</span>
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 bg-[#F9FAFB] p-6 md:p-10 overflow-y-auto">
                        <div className="max-w-6xl mx-auto">
                            {/* Search bar */}
                            <div className="relative mb-10 max-w-lg">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={hrmsSearch}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHrmsSearch(e.target.value)}
                                    className="w-full h-12 pl-12 pr-4 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-dashboard-primary/20 transition-all shadow-sm"
                                />
                            </div>

                            {/* Integrations Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredHrms.map((h) => (
                                    <div key={h.name} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group cursor-pointer">
                                        <div className="w-14 h-14 rounded-xl bg-white border border-[#F3F4F6] shadow-sm flex items-center justify-center p-2 shrink-0 group-hover:border-dashboard-primary/20 transition-colors">
                                            {/* Mock logo */}
                                            <div className="w-full h-full rounded bg-slate-50 flex items-center justify-center text-[10px] font-bold text-[#9CA3AF] text-center leading-tight uppercase px-1">
                                                {h.name.split(' ').map(n => n[0]).join('').slice(0, 3)}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-bold text-[#111827] truncate mb-0.5">{h.name}</h3>
                                            <div className="flex items-center gap-1.5">
                                                <span className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    h.type === "Automated" ? "bg-[#059669]" : "bg-[#D97706]"
                                                )} />
                                                <span className={cn(
                                                    "text-xs font-bold",
                                                    h.type === "Automated" ? "text-[#059669]" : "text-[#D97706]"
                                                )}>
                                                    {h.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredHrms.length === 0 && (
                                <div className="text-center py-20">
                                    <p className="text-[#6B7280]">No integrations found matching &quot;{hrmsSearch}&quot;</p>
                                    <button
                                        onClick={() => setShowHrmsRequestModal(true)}
                                        className="mt-4 text-dashboard-primary font-semibold hover:underline"
                                    >
                                        Request this integration
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {showHrmsRequestModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowHrmsRequestModal(false)}>
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-xl font-bold text-[#111827] mb-2">Request new integration</h2>
                            <p className="text-sm text-[#6B7280] mb-6">Specify the HRMS you use and our team will integrate it!</p>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-[#374151] mb-2">Please specify the name of HRMS you use *</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter HRMS name" 
                                        value={hrmsRequestName} 
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHrmsRequestName(e.target.value)} 
                                        className="w-full h-11 border border-[#E5E7EB] rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-dashboard-primary/20 transition-all" 
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setShowHrmsRequestModal(false)} className="flex-1 h-11 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors">Cancel</button>
                                    <button 
                                        disabled={!hrmsRequestName.trim()}
                                        className="flex-1 h-11 rounded-xl bg-dashboard-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (activePage === "data-models") {
        const categories: { key: string; label: string; desc?: string }[] = [
            { key: "basic_info_fields", label: "Mandatory data points", desc: "Employee basic info includes all the data points that are mandatory" },
            { key: "detail_info_fields", label: "Employee Detailed Info", desc: "Comprehensive employee profile comprising details such as full name, work email, employment status, date of birth, date of joining, etc" },
            { key: "bank_details_fields", label: "Bank Details", desc: "Employee's bank account details" },
            { key: "dependent_details_fields", label: "Dependent Details", desc: "Family member's data for an employee" },
            { key: "salary_details_fields", label: "Salary Details", desc: "Employee's salary details" },
            { key: "ctc_details_fields", label: "CTC Details", desc: "Cost to company breakdown" },
            { key: "salary_monthly_details_fields", label: "Salary Monthly Details", desc: "Monthly salary breakdown" },
        ];
        return (
            <>
                <div className="mb-6"><h1 className="text-2xl font-bold text-[#111827]">Data Models</h1><p className="text-sm text-[#6B7280] mt-0.5">Customise data models as per your requirement</p></div>
                <div className="space-y-6">
                    {categories.map(({ key, label, desc }) => {
                        const fields = dataModelsData[key] as Record<string, { display_name: string; is_checked?: boolean }> | undefined;
                        if (!fields) return null;
                        const isBasic = key === "basic_info_fields";
                        return (
                            <div key={key} className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
                                    <h2 className="font-semibold text-[#111827]">{isBasic ? "*" : ""}{label}{isBasic && <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">Required</span>}</h2>
                                    {isBasic && <button className="text-sm text-dashboard-primary font-medium border border-dashboard-primary px-3 py-1.5 rounded-lg">Customize required fields</button>}
                                </div>
                                <div className="p-6">
                                    {desc && <p className="text-sm text-[#6B7280] mb-4">{desc}</p>}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {Object.entries(fields).map(([fk, fv]) => {
                                            if (typeof fv !== "object" || !fv?.display_name) return null;
                                            const checked = (dataModelState[key] as Record<string, boolean>)?.[fk] ?? (fv as { is_checked?: boolean }).is_checked ?? false;
                                            return (
                                                <label key={fk} className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" checked={checked} onChange={() => setDataModelState((s) => ({ ...s, [key]: { ...(s[key] || {}), [fk]: !checked } }))} className="rounded border-[#E5E7EB]" />
                                                    <span className="text-sm font-medium text-[#111827]">{fv.display_name}{isBasic && " *"}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-6 flex justify-end"><button className="h-10 px-6 bg-dashboard-primary text-white font-medium text-sm rounded-lg">Save changes</button></div>
            </>
        );
    }

    if (activePage === "webhooks") {
        return (
            <>
                <div className="mb-6 flex justify-between items-start"><div><h1 className="text-2xl font-bold text-[#111827]">Webhooks</h1><p className="text-sm text-[#6B7280] mt-0.5">Manage webhooks for real-time updates and seamless integrations</p></div><div className="flex gap-2"><button className="h-10 px-4 border border-dashboard-primary text-dashboard-primary font-medium rounded-lg">Edit</button><button className="h-10 px-4 bg-dashboard-primary text-white font-medium rounded-lg">Save webhook</button></div></div>
                <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-bold text-[#111827] mb-4">Configure webhook</h2>
                    <div className="mb-4"><label className="block text-sm font-medium text-[#374151] mb-2">Webhook endpoint</label><div className="flex gap-2"><span className="flex items-center px-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-l-lg text-sm text-[#6B7280]">https://</span><input type="text" value={webhookEndpoint} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebhookEndpoint(e.target.value)} className="flex-1 border border-[#E5E7EB] rounded-r-lg px-3 py-2 text-sm" /><button className="h-10 px-4 text-dashboard-primary font-medium flex items-center gap-2"><Send className="w-4 h-4" /> Send test request</button></div></div>
                    <div className="mb-4"><label className="block text-sm font-medium text-[#374151] mb-2">Headers</label><p className="text-sm text-[#6B7280] mb-2">Specify for what kind of events this webhook should be Triggered or <a href="#" className="text-dashboard-primary hover:underline">learn more about webhook</a>.</p><table className="w-full text-sm border border-[#E5E7EB] rounded-lg overflow-hidden"><thead><tr className="bg-[#F9FAFB]"><th className="px-4 py-3 text-left font-semibold">Key</th><th className="px-4 py-3 text-left font-semibold">Value</th></tr></thead><tbody><tr><td className="px-4 py-3 border-t border-[#E5E7EB]">tartan-signature</td><td className="px-4 py-3 border-t border-[#E5E7EB] text-[#6B7280]">Your API should verify incoming POST requests with this signature for authenticity. For more info check <a href="#" className="text-dashboard-primary">webhook doc.</a></td></tr></tbody></table><button className="mt-2 text-sm text-dashboard-primary font-medium flex items-center gap-1"><Plus className="w-4 h-4" /> Add more headers</button></div>
                    <div><label className="block text-sm font-medium text-[#374151] mb-2">Emit webhook for</label><div className="space-y-2">{[{ name: "Sync process started", desc: "When initial employee data sync process begins." }, { name: "New employee added", desc: "When new employee record has been added during the sync." }].map((ev) => (<div key={ev.name} className="flex items-start gap-3 p-4 border border-[#E5E7EB] rounded-lg"><input type="checkbox" checked={webhookEvents[ev.name] ?? false} onChange={() => setWebhookEvents((s) => ({ ...s, [ev.name]: !(s[ev.name] ?? false) }))} className="mt-1" /><div className="flex-1"><div className="font-medium text-[#111827]">{ev.name}</div><div className="text-sm text-[#6B7280]">{ev.desc}</div></div></div>))}</div></div>
                </div>
            </>
        );
    }

    if (activePage === "diagnostics") {
        return (
            <>
                <div className="mb-6"><h1 className="text-2xl font-bold text-[#111827]">Diagnostics</h1><p className="text-sm text-[#6B7280] mt-0.5">Monitor data flow and system status across all corporate connections</p></div>
                <div className="mb-4 flex justify-between items-center"><div><h2 className="text-base font-bold text-[#111827]">Corporate connections overview</h2><p className="text-sm text-[#6B7280]">Showing connection status and data flow metrics</p></div><button className="h-10 px-4 border border-[#E5E7EB] bg-white text-[#374151] font-medium text-sm rounded-lg flex items-center gap-2">Select date</button></div>
                <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0"><div className="overflow-x-auto overflow-y-auto max-h-[70vh] min-h-0"><table className="w-full text-sm border-collapse min-w-[800px]"><thead className="bg-[#F9FAFB] sticky top-0 z-10"><tr className="border-b border-[#E5E7EB]"><HeaderCell label="Corporate Name" /><HeaderCell label="Connection Type" /><HeaderCell label="Data Posting Status" /><HeaderCell label="Data Receiving Status" /><HeaderCell label="Authentication Status" /><th className="px-5 py-4">View Received Data</th></tr></thead><tbody className="divide-y divide-[#E5E7EB]">{paginatedDiag.map((d, i) => (<tr key={i} className="hover:bg-[#F9FAFB]"><td className="px-5 py-4">{d.corporate}</td><td className="px-5 py-4"><span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">HRMS</span></td><td className={cn("px-5 py-4 font-medium", d.dataPosting === "Failed" ? "text-red-600" : d.dataPosting === "Success" ? "text-green-600" : "text-[#6B7280]")}>{d.dataPosting}</td><td className={cn("px-5 py-4 font-medium", d.dataReceiving === "Failed" ? "text-red-600" : d.dataReceiving === "Success" ? "text-green-600" : "text-[#6B7280]")}>{d.dataReceiving}</td><td className={cn("px-5 py-4 font-medium", d.authStatus === "Invalid" ? "text-red-600" : d.authStatus === "Valid" ? "text-green-600" : "text-[#6B7280]")}>{d.authStatus}</td><td className="px-5 py-4"><button className="text-dashboard-primary hover:underline">View</button></td></tr>))}</tbody></table></div>
                    <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-end items-center gap-2"><button disabled={diagPage <= 1} onClick={() => setDiagPage((p) => p - 1)} className="px-3 py-1.5 border rounded-lg disabled:opacity-50">‹</button><span className="text-sm text-[#6B7280]">Page {diagPage} of {diagTotalPages}</span><button disabled={diagPage >= diagTotalPages} onClick={() => setDiagPage((p) => p + 1)} className="px-3 py-1.5 border rounded-lg disabled:opacity-50">›</button></div>
                </div>
            </>
        );
    }

    return null;
}

function QuickActionItem({ icon: Icon, label, onClick, bgColor, iconColor }: { 
    icon: any; 
    label: string; 
    onClick?: () => void; 
    bgColor: string; 
    iconColor: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-col items-center gap-3 w-32 group"
        >
            <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-md",
                bgColor
            )}>
                <Icon className={cn("w-7 h-7", iconColor)} />
            </div>
            <span className="text-xs font-semibold text-[#374151] text-center group-hover:text-dashboard-primary transition-colors">
                {label}
            </span>
        </button>
    );
}

