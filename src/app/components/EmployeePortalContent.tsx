"use client";

import React from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { PiggyBank, Car, Bell, FileText, X, GraduationCap } from "lucide-react";
import ProductMarketplaceDashboard from "@/app/components/shared/ProductMarketplaceDashboard";
import SmartDocumentCollectorModal from "@/app/components/shared/SmartDocumentCollectorModal";
import FinAgent from "@/app/components/finagent/FinAgent";
import { cn } from "@/lib/utils";
import { getCurrentEmployeeIdFromJourney, getBreOffersForEmployee, getNudge, clearNudge, getEmployeeOfferNotification, clearEmployeeOfferNotification, getRmNudgeEventsForEmployee, markRmNudgeEventRead, formatRmNudgeDisplayDate, type EmployeeOfferProfile, type NudgePayload, type RmNudgeEvent } from "@/lib/hrmsSync";
import { resolveRmNudgeResumeKind } from "@/lib/rmNudgeResume";
import {
    type EmployeeHubJourneyRecord,
    getCompletedHubRecords,
    getInProgressHubRecords,
    isSalaryHubJourneyRecord,
} from "@/lib/employeeJourneyHub";

type EmpPageKey = "dashboard" | "finagent" | "orders";

interface EmployeePortalContentProps {
    activePage: EmpPageKey;
    onNavigate: (page: EmpPageKey) => void;
    /** When in employee portal, which employee is "logged in" (from dropdown). */
    currentEmployeeId?: string | null;
    /** Full employee for offer computation (salary, grade) and nudge resume. */
    currentEmployee?: EmployeeOfferProfile & { id: string; name?: string; email?: string; phone?: string; journey?: string } | null;
    /** Called when employee clicks Resume/Update docs from nudge notification. */
    onResumeFromNudge?: (emp: EmployeeOfferProfile & { id: string; name?: string; email?: string; phone?: string; journey?: string }, startStepId?: string | null) => void;
    /** Called to start a fresh salary account journey for this employee (from employee portal). */
    onStartSalaryJourney?: () => void;
    /** Continue a journey row from My Journey Status (salary or loan). */
    onContinueHubJourney?: (record: EmployeeHubJourneyRecord) => void;
}

export default function EmployeePortalContent({ activePage, onNavigate, currentEmployeeId, currentEmployee, onResumeFromNudge, onStartSalaryJourney, onContinueHubJourney }: EmployeePortalContentProps) {
    const { formData } = useJourney();
    const userName = formData?.name?.split?.(" ")[0] || "Rahul";
    const [showTerms, setShowTerms] = React.useState(false);
    const [showPrivacy, setShowPrivacy] = React.useState(false);
    const [isCollectorOpen, setIsCollectorOpen] = React.useState(false);

    const employeeIdForDashboard = currentEmployeeId ?? getCurrentEmployeeIdFromJourney();
    const [nudge, setNudge] = React.useState<NudgePayload | null>(() => (employeeIdForDashboard ? getNudge(employeeIdForDashboard) : null));
    const [offerNotification, setOfferNotification] = React.useState<{ message: string; at: string } | null>(() => (employeeIdForDashboard ? getEmployeeOfferNotification(employeeIdForDashboard) : null));
    React.useEffect(() => {
        setNudge(employeeIdForDashboard ? getNudge(employeeIdForDashboard) : null);
    }, [employeeIdForDashboard]);
    React.useEffect(() => {
        setOfferNotification(employeeIdForDashboard ? getEmployeeOfferNotification(employeeIdForDashboard) : null);
    }, [employeeIdForDashboard]);
    const [rmNudgeUiTick, setRmNudgeUiTick] = React.useState(0);
    React.useEffect(() => {
        const bump = () => setRmNudgeUiTick((t) => t + 1);
        window.addEventListener("mmfsl-rm-nudge-updated", bump);
        return () => window.removeEventListener("mmfsl-rm-nudge-updated", bump);
    }, []);

    // Application / journey hub status (salary + loan journeys)
    const [appStatus, setAppStatus] = React.useState<"none" | "in_progress" | "completed">("none");
    const refreshHubDerivedStatus = React.useCallback(() => {
        try {
            if (!employeeIdForDashboard) {
                setAppStatus("none");
                return;
            }
            const prog = getInProgressHubRecords(employeeIdForDashboard);
            const done = getCompletedHubRecords(employeeIdForDashboard);
            if (prog.length) setAppStatus("in_progress");
            else if (done.length) setAppStatus("completed");
            else setAppStatus("none");
        } catch {
            setAppStatus("none");
        }
    }, [employeeIdForDashboard]);

    React.useEffect(() => {
        refreshHubDerivedStatus();
        const onStorage = (e: StorageEvent) => {
            const k = e.key || "";
            if (
                k.startsWith("loanJourneyBundle_") ||
                k.startsWith("salaryJourneyBundle_") ||
                k.startsWith("employeeJourneyStatus_") ||
                k === "mmfsl_rm_nudge_events"
            ) {
                refreshHubDerivedStatus();
                if (k === "mmfsl_rm_nudge_events") setRmNudgeUiTick((t) => t + 1);
            }
        };
        window.addEventListener("storage", onStorage);
        const onVis = () => {
            if (document.visibilityState === "visible") refreshHubDerivedStatus();
        };
        document.addEventListener("visibilitychange", onVis);
        return () => {
            window.removeEventListener("storage", onStorage);
            document.removeEventListener("visibilitychange", onVis);
        };
    }, [refreshHubDerivedStatus]);

    const inProgressSalaryRecords = !employeeIdForDashboard
        ? []
        : getInProgressHubRecords(employeeIdForDashboard).filter(isSalaryHubJourneyRecord);

    const rmNudgeEvents = React.useMemo(() => {
        void rmNudgeUiTick;
        if (!employeeIdForDashboard) return [];
        return getRmNudgeEventsForEmployee(employeeIdForDashboard).filter((e) => e.source === "RM_NUDGE");
    }, [employeeIdForDashboard, rmNudgeUiTick]);

    const unreadRmNudgeEvents = React.useMemo(() => rmNudgeEvents.filter((e) => !e.read), [rmNudgeEvents]);

    const handleResumeRmNudge = React.useCallback(
        (ev: RmNudgeEvent) => {
            markRmNudgeEventRead(ev.id);
            const kind = resolveRmNudgeResumeKind(ev.journeyCategory);
            if (kind === "my_journey_status") {
                onNavigate("orders");
                return;
            }
            const salaryRecs = employeeIdForDashboard
                ? getInProgressHubRecords(employeeIdForDashboard).filter(isSalaryHubJourneyRecord)
                : [];
            if (salaryRecs.length > 0 && onContinueHubJourney) {
                onContinueHubJourney(salaryRecs[0]);
                return;
            }
            if (currentEmployee && onResumeFromNudge) {
                onResumeFromNudge(currentEmployee, ev.resumeStartStepId ?? null);
            }
        },
        [currentEmployee, employeeIdForDashboard, onContinueHubJourney, onNavigate, onResumeFromNudge],
    );

    /**
     * Smart handler for "Open Salary Account":
     * - If employee has an in-progress salary application → resume that journey.
     * - Otherwise → start a fresh salary account journey mapped to this employee's journey category.
     */
    const handleOpenSalaryAccount = React.useCallback(() => {
        const empId = employeeIdForDashboard;
        const salaryRec = empId
            ? getInProgressHubRecords(empId).find(isSalaryHubJourneyRecord)
            : undefined;
        if (salaryRec && onContinueHubJourney) {
            onContinueHubJourney(salaryRec);
        } else if (onStartSalaryJourney) {
            onStartSalaryJourney();
        }
    }, [employeeIdForDashboard, onContinueHubJourney, onStartSalaryJourney]);

    if (activePage === "dashboard") {
        const employeeId = employeeIdForDashboard;
        const breOffers = employeeId ? getBreOffersForEmployee(employeeId, currentEmployee ?? undefined) : null;
        const hasOffers = breOffers && breOffers.topUpEligible;

        return (
            <div className="space-y-6">
                {offerNotification && employeeId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => { clearEmployeeOfferNotification(employeeId); setOfferNotification(null); }}>
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                                <h3 className="text-lg font-bold text-[#111827]">Offers updated</h3>
                                <button type="button" onClick={() => { clearEmployeeOfferNotification(employeeId); setOfferNotification(null); }} className="p-1 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6]"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="px-6 py-4 space-y-3">
                                <p className="text-sm text-[#6B7280]">{offerNotification.message}</p>
                                {breOffers && breOffers.topUpEligible && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {breOffers.topUpAmount && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-100 text-emerald-800">Top-up up to ₹{(breOffers.topUpAmount / 100000).toFixed(1)}L</span>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-end">
                                <button type="button" onClick={() => { clearEmployeeOfferNotification(employeeId); setOfferNotification(null); }} className="h-10 px-4 rounded-lg text-sm font-semibold text-white bg-dashboard-primary hover:opacity-90">
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {unreadRmNudgeEvents.length > 0 && employeeId && (
                    <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center gap-2">
                            <Bell className="w-4 h-4 text-dashboard-primary" />
                            <h3 className="text-sm font-bold text-[#111827]">Notifications</h3>
                            <span className="text-xs text-[#6B7280] ml-auto">{unreadRmNudgeEvents.length} unread</span>
                        </div>
                        <ul className="divide-y divide-[#E5E7EB]">
                            {unreadRmNudgeEvents.map((ev) => (
                                <li key={ev.id} className={cn("p-4 sm:p-5", !ev.read && "bg-[#F0F7FF]/60")}>
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={cn(
                                                "w-2 h-2 rounded-full mt-1.5 shrink-0",
                                                ev.read ? "bg-transparent" : "bg-dashboard-primary",
                                            )}
                                            aria-hidden
                                        />
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="text-sm font-semibold text-[#111827]">{ev.notificationTitle}</h4>
                                                {!ev.read && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-dashboard-primary text-white">New</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-[#374151] leading-relaxed">{ev.message}</p>
                                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-[#6B7280]">
                                                <div><span className="font-medium text-[#9CA3AF]">Ref:</span> {ev.referenceId}</div>
                                                <div><span className="font-medium text-[#9CA3AF]">Journey:</span> {ev.journeyCategory}</div>
                                                <div><span className="font-medium text-[#9CA3AF]">Channel:</span> {ev.mode}</div>
                                                <div><span className="font-medium text-[#9CA3AF]">Sent:</span> {formatRmNudgeDisplayDate(ev.createdAt)}</div>
                                                <div className="sm:col-span-2"><span className="font-medium text-[#9CA3AF]">Source:</span> RM nudge</div>
                                            </dl>
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleResumeRmNudge(ev)}
                                                    className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold bg-dashboard-primary text-white hover:opacity-90"
                                                >
                                                    Resume Journey
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        markRmNudgeEventRead(ev.id);
                                                        setRmNudgeUiTick((t) => t + 1);
                                                    }}
                                                    className="inline-flex items-center gap-2 h-9 px-3 rounded-lg text-sm text-[#6B7280] hover:bg-[#F3F4F6]"
                                                >
                                                    Mark as read
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {unreadRmNudgeEvents.length === 0 && nudge && currentEmployee && onResumeFromNudge && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                <Bell className="w-5 h-5 text-amber-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-amber-900">Reminder from your RM</h3>
                                <p className="text-sm text-amber-800 mt-0.5">{nudge.message ?? "Your RM has asked you to complete your application and submit any pending documents."}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={() => onResumeFromNudge(currentEmployee, nudge.startStepId)}
                                        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold bg-dashboard-primary text-white hover:opacity-90"
                                    >
                                        Resume journey
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onResumeFromNudge(currentEmployee, "personal-loan:documentCollection")}
                                        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold border border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Update documents
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { if (employeeId) clearNudge(employeeId); setNudge(null); }}
                                        className="inline-flex items-center gap-2 h-9 px-3 rounded-lg text-sm text-amber-700 hover:bg-amber-100"
                                    >
                                        <X className="w-4 h-4" />
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {inProgressSalaryRecords.length > 0 && currentEmployee && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm mb-6">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                <PiggyBank className="w-5 h-5 text-amber-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-amber-900">Incomplete Application</h3>
                                        <p className="text-sm text-amber-800 mt-0.5">You have a salary account application in progress.</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const rec = inProgressSalaryRecords[0];
                                            if (rec && onContinueHubJourney) onContinueHubJourney(rec);
                                            else if (onResumeFromNudge) onResumeFromNudge(currentEmployee, null);
                                        }}
                                        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold bg-dashboard-primary text-white hover:opacity-90"
                                    >
                                        Resume journey
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsCollectorOpen(true)}
                                        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold border border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Smart document collector
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <ProductMarketplaceDashboard
                    showHero
                    userName={userName}
                    onViewAllOffers={() => onNavigate("orders")}
                    onOpenSalaryAccount={handleOpenSalaryAccount}
                />

                {/* Footer with legal links */}
                <div className="pt-12 pb-6 border-t border-[#E5E7EB] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[#6B7280]">© 2026 AU Bank. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <button onClick={() => setShowTerms(true)} className="text-xs text-[#6B7280] hover:text-dashboard-primary transition-colors">Terms & Conditions</button>
                        <button onClick={() => setShowPrivacy(true)} className="text-xs text-[#6B7280] hover:text-dashboard-primary transition-colors">Privacy Policy</button>
                    </div>
                </div>

                {showTerms && <LegalModal title="Terms & Conditions" content={MFIN_TNC} onClose={() => setShowTerms(false)} />}
                {showPrivacy && <LegalModal title="Privacy Policy" content={MFIN_PP} onClose={() => setShowPrivacy(false)} />}
                <SmartDocumentCollectorModal isOpen={isCollectorOpen} onClose={() => setIsCollectorOpen(false)} />
            </div>
        );
    }

    if (activePage === "finagent") {
        return (
            <div className="h-full min-h-0 flex flex-col -mx-2 -my-2">
                <FinAgent
                    employee={
                        currentEmployee
                            ? {
                                  id: currentEmployee.id,
                                  name: currentEmployee.name,
                                  email: currentEmployee.email,
                                  phone: currentEmployee.phone,
                                  companyName: (currentEmployee as { companyName?: string }).companyName,
                                  salary: Number((currentEmployee as { salary?: number; income?: string }).salary ?? (currentEmployee as { income?: string }).income) || undefined,
                              }
                            : null
                    }
                />
            </div>
        );
    }

    if (activePage === "orders") {
        const empId = employeeIdForDashboard;
        const inProgress = empId ? getInProgressHubRecords(empId) : [];
        const completed = empId ? getCompletedHubRecords(empId) : [];

        const journeyIcon = (rec: EmployeeHubJourneyRecord) => {
            if (rec.routeJourneyType === "auto-loan") return Car;
            if (rec.routeJourneyType === "education-loan") return GraduationCap;
            if (rec.routeJourneyType === "personal-loan") return PiggyBank;
            return PiggyBank;
        };

        return (
            <div className="max-w-2xl">
                <h1 className="text-2xl font-bold text-[#111827]">My Journey Status</h1>
                <p className="text-sm text-[#6B7280] mt-1 mb-6">Track your applications and journey progress</p>
                <div className="rounded-xl border border-[#E8EAED] bg-white p-8 space-y-4">
                    {inProgress.length === 0 && completed.length === 0 && (
                        <p className="text-[#6B7280] text-center py-8">
                            No applications yet. Explore{" "}
                            <button type="button" onClick={() => onNavigate("finagent")} className="text-dashboard-primary font-semibold hover:underline">
                                FinAgent
                            </button>
                            {" "}to start a journey, or open a salary account from the dashboard.
                        </p>
                    )}
                    {inProgress.map((rec) => {
                        const Icon = journeyIcon(rec);
                        return (
                            <div key={rec.journeyId} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
                                <Icon className="w-10 h-10 text-amber-600 shrink-0 self-center sm:self-auto" />
                                <div className="flex-1 min-w-0 text-center sm:text-left">
                                    <p className="font-semibold text-[#111827]">{rec.journeyName} — In progress</p>
                                    <p className="text-sm text-[#6B7280]">Complete your application</p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsCollectorOpen(true)}
                                        className="h-9 px-4 border border-amber-300 bg-white text-amber-900 text-sm font-semibold rounded-lg hover:bg-amber-100"
                                    >
                                        Smart document collector
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (onContinueHubJourney) onContinueHubJourney(rec);
                                        }}
                                        className="h-9 px-4 bg-dashboard-primary text-white text-sm font-semibold rounded-lg"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {completed.map((rec) => {
                        const Icon = journeyIcon(rec);
                        return (
                            <div key={`done-${rec.journeyId}`} className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                <Icon className="w-10 h-10 text-emerald-600 shrink-0" />
                                <div>
                                    <p className="font-semibold text-[#111827]">{rec.journeyName} — Submitted</p>
                                    <p className="text-sm text-[#6B7280]">We will get in touch shortly</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <>
            {showTerms && <LegalModal title="Terms & Conditions" content={MFIN_TNC} onClose={() => setShowTerms(false)} />}
            {showPrivacy && <LegalModal title="Privacy Policy" content={MFIN_PP} onClose={() => setShowPrivacy(false)} />}
        </>
    );
}

function LegalModal({ title, content, onClose }: { title: string; content: string; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
                    <h3 className="text-lg font-bold text-[#111827]">{title}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-xl text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-[#374151]">
                        {content}
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-end bg-[#F9FAFB]">
                    <button type="button" onClick={onClose} className="h-10 px-6 rounded-xl text-sm font-bold text-white bg-dashboard-primary hover:opacity-90 shadow-lg shadow-dashboard-primary/20 transition-all">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

const MFIN_TNC = `Legal Notice
VISITORS TO THIS WEB SITE ARE BOUND BY THE FOLLOWING TERMS AND CONDITIONS. (‘TERMS’) PLEASE READ THIS DOCUMENT CAREFULLY BEFORE CONTINUING TO USE THIS SITE. IF YOU DO NOT AGREE WITH ANY OF THESE TERMS, PLEASE DO NOT USE THIS SITE. IF YOU HAVE ANY QUERIES ABOUT THESE TERMS, PLEASE CONTACT YOUR AU BANK RELATIONSHIP MANAGER OR VISIT WWW.AUBANK.IN

Disclaimer of Warranties, Inaccuracies or Errors | AU Bank Disclaimer | Availability | Third Party Interaction and Links to Third Party Sites | Copyrights | Trademarks | General Terms and Conditions | Applicable Law and Jurisdiction

Although AU Bank tries to ensure that all information and recommendations, whether in relation to the products, services, offerings or otherwise (hereinafter ‘Information’) provided as part of this website is correct at the time of its inclusion on the web site, AU Bank does not guarantee the accuracy of the Information. AU Bank makes no representations or warranties as to the completeness or accuracy of the Information.

THIS WEBSITE IS PROVIDED TO YOU ON AN “AS IS” AND “WHERE-IS” BASIS, WITHOUT ANY WARRANTY. AU BANK MAKES NO REPRESENTATIONS OR WARRANTIES, EITHER EXPRESSED, IMPLIED, STATUTORY OR OTHERWISE OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT OF THIRD PARTY RIGHTS.

Copyrights
This web site contains material, including text, graphics and sound, which is protected by copyright and/or other intellectual property rights. All copyright and other intellectual property rights in this material are either owned by AU Bank or have been licensed to AU Bank by the owner(s) of those rights.

You may:
• use and display the materials only on your personal computer only for personal use.
• print copies of the information on this site for your personal use.

Trademarks
The AU Bank name, marks, and all products and logos denoted with TM are trademarks or registered trademarks of AU Bank or its affiliates.

General Terms and Conditions
AU Bank does not routinely monitor your postings to the web site but reserves the right to do so. AU Bank reserves the right to terminate access to this web site at any time and without notice.

Applicable Law and Jurisdiction
These terms and conditions are governed by and to be interpreted in accordance with laws of India. Any dispute shall be submitted to the jurisdiction of the courts located at Mumbai, India.`;

const MFIN_PP = `Objective:
AU Bank may collect and store information about you when you visit our site, use our services, or view our online advertisements. The information which AU Bank collects and store during normal use of the site is used to monitor use of the site and to help further development of our products and services.

Scope:
This policy applies to information collected by AU Bank through its websites.

Collected Information:
AU Bank may collect personal information that you submit to us through the Services, which include:
• Name;
• Home address;
• Email address;
• Telephone number;
• Date of birth;
• Financial information such as income, assets and investment background;
• Documents that you provide to us to verify your identity.

Use of collected Personal Information:
AU Bank may use the personal information that is collected from you to provide requested products and services and for our internal business purposes, including responding to your requests, processing transactions, and providing transaction-related services.

How We Share Personal Information:
We may share personal information with organizations or individuals that perform functions on our behalf. We may also share personal information in response to a court order or as otherwise required by law.

Personal Information Protection:
AU Bank use commercially reasonable security measures (including physical, electronic and procedural measures) to help safeguard personal information against loss, misuse, damage or modification and unauthorized access or disclosure.

Privacy Policy Changes:
We reserve the right to change or update this policy at any time by placing a prominent notice on our site.`;
