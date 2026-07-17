"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AgentLayout from "@/app/components/layout/AgentLayout";
import JourneyStepWrapper from "@/app/components/JourneyStepWrapper";
import { STEP_COMPONENTS } from "@/app/context/stepDefinitions";
import { useJourney } from "@/app/context/JourneyContext";
import StepError from "@/app/components/steps/StepError";
import { AnimatePresence } from "framer-motion";
import type { JourneyType } from "@/app/context/stepDefinitions";
import { readLoanResumeBundle } from "@/lib/employeeJourneyHub";
import {
  consumePendingInviteFromLocalStorage,
  readStashedInvite,
} from "@/lib/pendingInvite";

const PL_LIKE_INVITE_IDS = ["personal-loan", "auto-loan", "education-loan"] as const;
const SALARY_INVITE_IDS = ["ntb", "ntb-conversion", "etb-nk", "etb"] as const;

function isPlLikeInviteId(id: string): id is (typeof PL_LIKE_INVITE_IDS)[number] {
  return (PL_LIKE_INVITE_IDS as readonly string[]).includes(id);
}

function isSalaryInviteId(id: string): id is (typeof SALARY_INVITE_IDS)[number] {
  return (SALARY_INVITE_IDS as readonly string[]).includes(id);
}

function clearHdfcSessionStorage() {
  localStorage.removeItem("hdfcJourney_journeyType");
  localStorage.removeItem("hdfcJourney_stepIndex");
  localStorage.removeItem("hdfcJourney_journeySteps");
  localStorage.removeItem("hdfcJourney_formData");
  localStorage.removeItem("hdfcJourney_stepHistory");
  localStorage.removeItem("hdfcJourney_userType");
  localStorage.removeItem("hdfcJourney_prefilledData");
  localStorage.removeItem("hdfcJourney_baselineData");
  localStorage.removeItem("hdfcJourney_changedFields");
  localStorage.removeItem("hdfcJourney_branchStepId");
}

export default function JourneyInvitePage() {
  const router = useRouter();
  const params = useParams<{ inviteId: string }>();
  const inviteId = useMemo(() => params.inviteId, [params.inviteId]);

  const {
    journeySteps,
    currentStepIndex,
    currentBranchComponent,
    startJourney,
  } = useJourney();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<{ title: string; message: string } | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inviteId || startedRef.current) return;

    const isKnownJourneyUrl =
      isPlLikeInviteId(inviteId) ||
      isSalaryInviteId(inviteId) ||
      inviteId === "address-verification";

    // Clear stale session when opening an explicit journey URL so an old personal-loan
    // session cannot override a salary-account invite.
    if (isKnownJourneyUrl) {
      clearHdfcSessionStorage();
    }

    try {
      const raw = readStashedInvite();

      if (!raw) {
        if (isKnownJourneyUrl) {
          startedRef.current = true;
          startJourney(inviteId as JourneyType);
          setIsLoading(false);
          return;
        }
        setLoadError({
          title: "No invite data found",
          message: "Please go back to the dashboard and click Invite again.",
        });
        setIsLoading(false);
        return;
      }

      const invite = JSON.parse(raw) as {
        journeyType: JourneyType;
        employee?: { id: string; name: string; email: string; phone?: string };
        prefilledData?: Record<string, unknown>;
        startStepId?: string;
        resumeFromSavedBundle?: boolean;
      };

      consumePendingInviteFromLocalStorage();
      startedRef.current = true;

      // Prefer the journey type from the URL for salary / loan routes so a stale
      // pendingInvite (e.g. personal-loan) cannot hijack a salary invite tab.
      const journeyType: JourneyType = isSalaryInviteId(inviteId) || isPlLikeInviteId(inviteId)
        ? (inviteId as JourneyType)
        : invite.journeyType;

      const prefilledData = { ...(invite.prefilledData || {}) };
      // Always run the in-app salary account journey from RM Invite (no netbanking redirect).
      delete prefilledData.redirectToBankSite;

      const prefilled = invite.employee
        ? {
            employeeId: invite.employee.id,
            name: invite.employee.name,
            email: invite.employee.email,
            mobileNumber: invite.employee.phone,
            phone: invite.employee.phone,
            ...prefilledData,
          }
        : { ...prefilledData };

      const empId = typeof prefilled.employeeId === "string" ? prefilled.employeeId : undefined;
      const loanKinds: JourneyType[] = ["personal-loan", "auto-loan", "education-loan"];
      let loanBundle = null;
      if (
        invite.resumeFromSavedBundle &&
        empId &&
        loanKinds.includes(journeyType)
      ) {
        loanBundle = readLoanResumeBundle(
          empId,
          journeyType as "personal-loan" | "auto-loan" | "education-loan"
        );
      }

      startJourney(journeyType, prefilled, invite.startStepId, loanBundle);
    } catch {
      setLoadError({
        title: "Something went wrong",
        message: "Unable to start the journey. Please try again from the dashboard.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [inviteId, startJourney]);

  const BranchComponent = currentBranchComponent;

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <AgentLayout>
          <div className="w-full max-w-[1400px] mx-auto py-4 lg:py-8 px-2 sm:px-4">
            <StepError
              title={loadError.title}
              message={loadError.message}
              onBackToHome={() => router.push("/")}
            />
          </div>
        </AgentLayout>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <AgentLayout>
          <div className="w-full max-w-[1400px] mx-auto py-10 lg:py-16 px-2 sm:px-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-10 text-center">
              <p className="text-slate-600 font-semibold">Starting your journey…</p>
            </div>
          </div>
        </AgentLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <AgentLayout>
        <div className="w-full max-w-[1400px] mx-auto py-4 lg:py-8 px-2 sm:px-4">
          <AnimatePresence mode="wait">
            <JourneyStepWrapper
              key={BranchComponent ? "branch" : journeySteps[currentStepIndex]?.id || "current"}
            >
              {BranchComponent ? (
                <BranchComponent />
              ) : (
                journeySteps[currentStepIndex]
                  ? React.createElement(STEP_COMPONENTS[journeySteps[currentStepIndex].id])
                  : null
              )}
            </JourneyStepWrapper>
          </AnimatePresence>
        </div>
      </AgentLayout>
    </div>
  );
}
