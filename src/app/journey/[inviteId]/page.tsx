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

const PL_LIKE_INVITE_IDS = ["personal-loan", "auto-loan", "education-loan"] as const;

function clearHdfcSessionStorage() {
  localStorage.removeItem("hdfcJourney_journeyType");
  localStorage.removeItem("hdfcJourney_stepIndex");
  localStorage.removeItem("hdfcJourney_journeySteps");
  localStorage.removeItem("hdfcJourney_formData");
  localStorage.removeItem("hdfcJourney_stepHistory");
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
    journeyType,
  } = useJourney();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<{ title: string; message: string } | null>(null);
  const [redirectToBankSite, setRedirectToBankSite] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inviteId || startedRef.current) return;

    // Force clear any stale journey state if we're explicitly on the personal-loan or address-verification URL
    if (PL_LIKE_INVITE_IDS.includes(inviteId as (typeof PL_LIKE_INVITE_IDS)[number]) || inviteId === "address-verification") {
      clearHdfcSessionStorage();
    }

    try {
      const raw = localStorage.getItem("pendingInvite");
      
      if (!raw) {
        if (PL_LIKE_INVITE_IDS.includes(inviteId as (typeof PL_LIKE_INVITE_IDS)[number]) || inviteId === "address-verification") {
          startedRef.current = true;
          // IMPORTANT: explicitly pass the type to startJourney
          const type = inviteId as JourneyType;
          startJourney(type);
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

      localStorage.removeItem("pendingInvite");
      startedRef.current = true;

      // ETB-NK netbanking variant: show AU redirect page instead of running journey steps
      if (invite.prefilledData?.redirectToBankSite) {
        setRedirectToBankSite(true);
        setIsLoading(false);
        return;
      }

      const prefilled = invite.employee
        ? {
            employeeId: invite.employee.id,
            name: invite.employee.name,
            email: invite.employee.email,
            mobileNumber: invite.employee.phone,
            phone: invite.employee.phone,
            ...(invite.prefilledData || {}),
          }
        : { ...(invite.prefilledData || {}) };

      const empId = typeof prefilled.employeeId === "string" ? prefilled.employeeId : undefined;
      const loanKinds: JourneyType[] = ["personal-loan", "auto-loan", "education-loan"];
      let loanBundle = null;
      if (
        invite.resumeFromSavedBundle &&
        empId &&
        loanKinds.includes(invite.journeyType)
      ) {
        loanBundle = readLoanResumeBundle(
          empId,
          invite.journeyType as "personal-loan" | "auto-loan" | "education-loan"
        );
      }

      startJourney(invite.journeyType, prefilled, invite.startStepId, loanBundle);
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

  if (redirectToBankSite) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-slate-600">Redirecting to AU Bank&apos;s site</p>
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
