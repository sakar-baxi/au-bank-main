import type { Step } from "@/app/context/stepDefinitions";
import type { JourneyType } from "@/app/context/stepDefinitions";

/** Canonical hub labels aligned with product requirements */
export type HubJourneyKind =
  | "PERSONAL_LOAN"
  | "AUTO_LOAN"
  | "EDUCATION_LOAN"
  | "SALARY_ACCOUNT_NTB"
  | "SALARY_ACCOUNT_ETB_WITH_KYC"
  | "SALARY_ACCOUNT_ETB_AUTO_CONV";

export type HubApplicationStatus = "in_progress" | "completed";

export interface EmployeeHubJourneyRecord {
  journeyId: string;
  hubKind: HubJourneyKind;
  /** Route `journeyType` used by JourneyContext / resume */
  routeJourneyType: JourneyType;
  journeyName: string;
  status: HubApplicationStatus;
  currentStepId?: string;
  currentStepIndex?: number;
  resumeRoute: "/journey/resume" | "/";
  employeeId: string;
  lastUpdated?: string;
  /** Loan journeys persist a full bundle key for restoration */
  loanBundleStorageKey?: string;
}

export interface LoanJourneyResumeBundle {
  journeyType: JourneyType;
  status: HubApplicationStatus;
  currentStepIndex: number;
  currentStepId: string;
  journeySteps: Step[];
  formData: Record<string, unknown>;
  branchStepId: string | null;
  stepHistory: number[];
  lastUpdated: string;
}

const LOAN_ROUTE_TYPES = ["personal-loan", "auto-loan", "education-loan"] as const;
export type LoanJourneyRouteType = (typeof LOAN_ROUTE_TYPES)[number];

export function isLoanJourneyRouteType(t: string): t is LoanJourneyRouteType {
  return (LOAN_ROUTE_TYPES as readonly string[]).includes(t);
}

export function salaryJourneyBundleKey(employeeId: string): string {
  return `salaryJourneyBundle_${employeeId}`;
}

export function loanJourneyBundleKey(employeeId: string, loanType: LoanJourneyRouteType): string {
  return `loanJourneyBundle_${employeeId}_${loanType}`;
}

export function mapRouteJourneyTypeToHubKind(jt: string): HubJourneyKind | null {
  switch (jt) {
    case "ntb":
    case "ntb-conversion":
      return "SALARY_ACCOUNT_NTB";
    case "etb-nk":
      return "SALARY_ACCOUNT_ETB_WITH_KYC";
    case "etb":
      return "SALARY_ACCOUNT_ETB_AUTO_CONV";
    case "personal-loan":
      return "PERSONAL_LOAN";
    case "auto-loan":
      return "AUTO_LOAN";
    case "education-loan":
      return "EDUCATION_LOAN";
    default:
      return null;
  }
}

export function hubDisplayName(kind: HubJourneyKind): string {
  switch (kind) {
    case "PERSONAL_LOAN":
      return "Personal Loan";
    case "AUTO_LOAN":
      return "Auto Loan";
    case "EDUCATION_LOAN":
      return "Education Loan";
    case "SALARY_ACCOUNT_NTB":
      return "Salary Account Opening (NTB)";
    case "SALARY_ACCOUNT_ETB_WITH_KYC":
      return "Salary Account — ETB with KYC";
    case "SALARY_ACCOUNT_ETB_AUTO_CONV":
      return "Salary Account — ETB Auto Conv";
    default:
      return "Application";
  }
}

function stableJourneyId(employeeId: string, kind: HubJourneyKind): string {
  return `${kind}:${employeeId}`;
}

function parseBundle<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** In-progress salary step snapshot (minimal + steps for forward-compat). */
export interface SalaryJourneyBundle {
  journeyType: JourneyType;
  status: HubApplicationStatus;
  currentStepId: string;
  currentStepIndex: number;
  lastUpdated: string;
}

/**
 * Merge in-progress (and optionally completed) hub records for one employee.
 * Dedupes by hubKind so the same journey is never listed twice.
 */
export function getHubJourneyRecordsForEmployee(
  employeeId: string,
  options?: { includeCompleted?: boolean }
): EmployeeHubJourneyRecord[] {
  const includeCompleted = options?.includeCompleted ?? true;
  const seen = new Set<HubJourneyKind>();
  const out: EmployeeHubJourneyRecord[] = [];

  const tryAdd = (rec: EmployeeHubJourneyRecord | null) => {
    if (!rec) return;
    const active = rec.status === "in_progress" || (includeCompleted && rec.status === "completed");
    if (!active) return;
    if (seen.has(rec.hubKind)) return;
    seen.add(rec.hubKind);
    out.push(rec);
  };

  const salRaw = localStorage.getItem(salaryJourneyBundleKey(employeeId));
  const sal = parseBundle<SalaryJourneyBundle>(salRaw);
  if (sal?.journeyType) {
    const kind = mapRouteJourneyTypeToHubKind(sal.journeyType);
    if (
      kind === "SALARY_ACCOUNT_NTB" ||
      kind === "SALARY_ACCOUNT_ETB_WITH_KYC" ||
      kind === "SALARY_ACCOUNT_ETB_AUTO_CONV"
    ) {
      tryAdd({
        journeyId: stableJourneyId(employeeId, kind),
        hubKind: kind,
        routeJourneyType: sal.journeyType,
        journeyName: hubDisplayName(kind),
        status: sal.status,
        currentStepId: sal.currentStepId,
        currentStepIndex: sal.currentStepIndex,
        resumeRoute: "/journey/resume",
        employeeId,
        lastUpdated: sal.lastUpdated,
      });
    }
  }

  for (const lt of LOAN_ROUTE_TYPES) {
    const b = parseBundle<LoanJourneyResumeBundle>(localStorage.getItem(loanJourneyBundleKey(employeeId, lt)));
    if (!b || b.journeyType !== lt) continue;
    const kind = mapRouteJourneyTypeToHubKind(lt);
    if (!kind) continue;
    tryAdd({
      journeyId: stableJourneyId(employeeId, kind),
      hubKind: kind,
      routeJourneyType: lt,
      journeyName: hubDisplayName(kind),
      status: b.status,
      currentStepId: b.currentStepId,
      currentStepIndex: b.currentStepIndex,
      resumeRoute: "/journey/resume",
      employeeId,
      lastUpdated: b.lastUpdated,
      loanBundleStorageKey: loanJourneyBundleKey(employeeId, lt),
    });
  }

  // Legacy fallback: single employeeJourneyStatus blob (last active journey)
  const legacyRaw = localStorage.getItem(`employeeJourneyStatus_${employeeId}`);
  const legacy = parseBundle<{
    status?: string;
    journeyType?: string;
    currentStepId?: string;
    currentStepIndex?: number;
    lastUpdated?: string;
  }>(legacyRaw);

  if (legacy?.status === "in_progress" || (includeCompleted && legacy?.status === "completed")) {
    const jt = legacy.journeyType as JourneyType | undefined;
    if (jt) {
      const kind = mapRouteJourneyTypeToHubKind(jt);
      if (kind && !seen.has(kind)) {
        const st = legacy.status === "completed" ? "completed" : "in_progress";
        tryAdd({
          journeyId: stableJourneyId(employeeId, kind),
          hubKind: kind,
          routeJourneyType: jt,
          journeyName: hubDisplayName(kind),
          status: st,
          currentStepId: legacy.currentStepId,
          currentStepIndex: legacy.currentStepIndex,
          resumeRoute: "/journey/resume",
          employeeId,
          lastUpdated: legacy.lastUpdated,
          loanBundleStorageKey: isLoanJourneyRouteType(jt) ? loanJourneyBundleKey(employeeId, jt) : undefined,
        });
      }
    }
  }

  return out;
}

export function getInProgressHubRecords(employeeId: string): EmployeeHubJourneyRecord[] {
  return getHubJourneyRecordsForEmployee(employeeId, { includeCompleted: false }).filter((r) => r.status === "in_progress");
}

export function getCompletedHubRecords(employeeId: string): EmployeeHubJourneyRecord[] {
  return getHubJourneyRecordsForEmployee(employeeId, { includeCompleted: true }).filter((r) => r.status === "completed");
}

export function readLoanResumeBundle(employeeId: string, loanType: LoanJourneyRouteType): LoanJourneyResumeBundle | null {
  const b = parseBundle<LoanJourneyResumeBundle>(localStorage.getItem(loanJourneyBundleKey(employeeId, loanType)));
  if (!b || b.status !== "in_progress") return null;
  if (b.journeyType !== loanType) return null;
  return b;
}

/**
 * Open a loan journey from the employee portal: resumes when an in-progress bundle exists.
 */
export function openEmployeeLoanJourneyInNewTab(
  loanType: LoanJourneyRouteType,
  prefilled?: Record<string, unknown> & {
    employeeId?: string;
    name?: string;
    email?: string;
    phone?: string;
    mobileNumber?: string;
  }
) {
    const empId = prefilled?.employeeId;
    const bundle = empId ? readLoanResumeBundle(empId, loanType) : null;
    const resumeFromSavedBundle = !!bundle;

    const inviteData: Record<string, unknown> = {
      journeyType: loanType,
      employee: empId
        ? {
            id: empId,
            name: prefilled?.name,
            email: prefilled?.email,
            phone: prefilled?.phone ?? prefilled?.mobileNumber,
          }
        : undefined,
      prefilledData: prefilled || {},
      resumeFromSavedBundle,
      startStepId: bundle?.currentStepId,
    };

    try {
      localStorage.setItem("pendingInvite", JSON.stringify(inviteData));
      try {
        sessionStorage.setItem("activeSalaryInvite", JSON.stringify(inviteData));
      } catch {
        /* ignore */
      }
      window.open(`/journey/${loanType}`, "_blank");
    } catch {
      window.open(`/journey/${loanType}`, "_blank");
    }
}

/** Delete in-progress bundle so the next start is fresh (FinAgent explicit restart — use sparingly). */
export function clearLoanJourneyBundle(employeeId: string, loanType: LoanJourneyRouteType) {
  try {
    localStorage.removeItem(loanJourneyBundleKey(employeeId, loanType));
  } catch {
    /* ignore */
  }
}

export function employeeHasAnyInProgressJourney(employeeId: string): boolean {
  return getInProgressHubRecords(employeeId).length > 0;
}

export function isSalaryHubJourneyRecord(r: EmployeeHubJourneyRecord): boolean {
  return (
    r.hubKind === "SALARY_ACCOUNT_NTB" ||
    r.hubKind === "SALARY_ACCOUNT_ETB_WITH_KYC" ||
    r.hubKind === "SALARY_ACCOUNT_ETB_AUTO_CONV"
  );
}
