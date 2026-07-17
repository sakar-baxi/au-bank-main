import { ALL_STEPS } from "@/app/context/stepDefinitions";
import type { JourneyType } from "@/app/context/stepDefinitions";
import { isLoanJourneyRouteType, salaryJourneyBundleKey } from "@/lib/employeeJourneyHub";

export const SALARY_JOURNEY_TYPES: JourneyType[] = ["ntb", "ntb-conversion", "etb-nk", "etb"];

const LOAN_STATUS_TITLES = new Set([
  "Select plan",
  "KYC verification",
  "KYC Verification",
  "Bureau consent",
  "Bureau Consent",
  "Verify details",
  "Verify Details",
  "Disbursal account",
  "Disbursal Account",
  "eNACH setup",
  "eNACH Setup",
  "Submit application",
  "Submit Application",
  "Loan Customization",
  "Automate EMIs",
  "Loan Agreement",
  "T&C Selection",
  "HRMS & Payroll",
]);

export function isSalaryJourneyType(t: string | undefined | null): boolean {
  return !!t && (SALARY_JOURNEY_TYPES as string[]).includes(t);
}

/** True when a stored directory status came from a personal/auto/education loan journey. */
export function isLoanDirectoryStatus(status: {
  journeyType?: string;
  currentStepId?: string;
  currentStepTitle?: string;
} | null | undefined): boolean {
  if (!status) return false;
  if (status.journeyType && isLoanJourneyRouteType(status.journeyType)) return true;
  const stepId = String(status.currentStepId || "");
  if (
    stepId.startsWith("personal-loan:") ||
    stepId.startsWith("auto-loan:") ||
    stepId.startsWith("education-loan:")
  ) {
    return true;
  }
  const title = String(status.currentStepTitle || "");
  if (LOAN_STATUS_TITLES.has(title)) return true;
  // Mahindra PL first step title collides with generic "Login" — only treat as loan with loan step id prefix (handled above)
  return false;
}

export function salaryStepTitleFromId(stepId: string | undefined): string | undefined {
  if (!stepId) return undefined;
  const step = ALL_STEPS[stepId];
  if (step?.title) {
    // Directory uses "Account Opened" for completed salary journeys
    if (stepId.endsWith(":complete")) return "Account Opened";
    return step.title;
  }
  const base = stepId.includes(":") ? stepId.split(":")[1] : stepId;
  if (base === "complete") return "Account Opened";
  return undefined;
}

/**
 * Resolve the status shown in RM Corporates → Employee Directory.
 * Prefers salary journey bundle / salary status; ignores personal-loan pollution.
 */
export function resolveSalaryDirectoryStatus(
  employeeId: string,
  rawStatus: Record<string, unknown> | null
): Record<string, unknown> | null {
  if (typeof window === "undefined") return rawStatus;

  let salaryBundle: {
    journeyType?: string;
    status?: string;
    currentStepId?: string;
    currentStepIndex?: number;
    lastUpdated?: string;
  } | null = null;
  try {
    const bundleRaw = localStorage.getItem(salaryJourneyBundleKey(employeeId));
    if (bundleRaw) salaryBundle = JSON.parse(bundleRaw);
  } catch {
    /* ignore */
  }

  if (salaryBundle?.status === "in_progress" || salaryBundle?.status === "completed") {
    const title =
      salaryStepTitleFromId(salaryBundle.currentStepId) ||
      (salaryBundle.status === "completed" ? "Account Opened" : "In Progress");
    return {
      ...(rawStatus && isSalaryJourneyType(String(rawStatus.journeyType || "")) ? rawStatus : {}),
      status: salaryBundle.status,
      currentStepId: salaryBundle.currentStepId,
      currentStepIndex: salaryBundle.currentStepIndex,
      currentStepTitle: title,
      journeyType: salaryBundle.journeyType,
      lastUpdated: salaryBundle.lastUpdated,
    };
  }

  if (!rawStatus) return null;
  if (isLoanDirectoryStatus(rawStatus as { journeyType?: string; currentStepId?: string; currentStepTitle?: string })) {
    return null;
  }
  if (rawStatus.journeyType && !isSalaryJourneyType(String(rawStatus.journeyType))) {
    return null;
  }

  // Normalize completed title for salary
  if (rawStatus.status === "completed") {
    return { ...rawStatus, currentStepTitle: "Account Opened" };
  }

  // Prefer canonical salary step titles from step id when present
  const stepId = typeof rawStatus.currentStepId === "string" ? rawStatus.currentStepId : undefined;
  const canonical = salaryStepTitleFromId(stepId);
  if (canonical) {
    return { ...rawStatus, currentStepTitle: canonical };
  }

  return rawStatus;
}

/** One-time cleanup: drop loan-polluted directory statuses from localStorage. */
export function purgeLoanStatusesFromDirectoryStorage(): number {
  if (typeof window === "undefined") return 0;
  let removed = 0;
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("employeeJourneyStatus_")) keys.push(key);
  }
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (isLoanDirectoryStatus(parsed)) {
        localStorage.removeItem(key);
        removed += 1;
      }
    } catch {
      /* ignore */
    }
  }
  return removed;
}
