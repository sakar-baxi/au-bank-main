"use client";

import { useJourney } from "@/app/context/JourneyContext";
import { STEP_COMPONENTS } from "@/app/context/stepDefinitions";
import JourneyStepWrapper from "@/app/components/JourneyStepWrapper";
import Dashboard from "@/app/components/Dashboard";
import AgentLayout from "@/app/components/layout/AgentLayout";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, Suspense } from "react";
import {
  consumePendingInviteFromLocalStorage,
  readStashedInvite,
} from "@/lib/pendingInvite";

function HomeContent() {
  const {
    journeySteps,
    currentStepIndex,
    currentBranchComponent,
    showDashboard,
    isResumeFlow,
    resumeTargetStepIndex,
    startJourney,
  } = useJourney();

  const bootedRef = useRef(false);

  // If this tab was opened via Invite on "/", read the pending invite and start the journey.
  // Prefer /journey/{type} from RM Invite; this remains a fallback.
  useEffect(() => {
    if (bootedRef.current) return;
    try {
      const raw = typeof window !== "undefined" ? readStashedInvite() : null;
      if (!raw) return;
      consumePendingInviteFromLocalStorage();
      bootedRef.current = true;
      const parsed = JSON.parse(raw);
      const { journeyType, prefilledData, employee } = parsed;
      const merged = {
        ...(prefilledData || {}),
      };
      delete (merged as { redirectToBankSite?: boolean }).redirectToBankSite;
      const withEmployee = employee
        ? { ...(employee || {}), ...merged, employeeId: employee.id || merged.employeeId }
        : merged;
      if (journeyType) startJourney(journeyType, withEmployee);
    } catch { /* ignore */ }
  }, [startJourney]);

  const BranchComponent = currentBranchComponent;

  const showResumeScreen = !showDashboard && !BranchComponent && isResumeFlow &&
    currentStepIndex === 0 && resumeTargetStepIndex !== null && resumeTargetStepIndex > 0;

  const StepComponent = showResumeScreen
    ? STEP_COMPONENTS.resume
    : journeySteps[currentStepIndex]
      ? STEP_COMPONENTS[journeySteps[currentStepIndex].id]
      : null;

  if (showDashboard) {
    return <Dashboard />;
  }

  // Avoid blank screen: if no step to show, show dashboard link or loading
  const hasContent = BranchComponent || StepComponent;
  if (!hasContent && journeySteps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Loading…</p>
          <a href="/" className="text-dashboard-primary font-medium hover:underline">Go to Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <AgentLayout>
        <div className="w-full max-w-[1400px] mx-auto py-4 lg:py-8 px-2 sm:px-4">
          <AnimatePresence mode="wait">
            <JourneyStepWrapper key={BranchComponent ? "branch" : showResumeScreen ? "resume" : journeySteps[currentStepIndex]?.id || "current"}>
              {BranchComponent ? (
                <BranchComponent />
              ) : StepComponent ? (
                React.createElement(StepComponent)
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-slate-600">Loading step…</p>
                </div>
              )}
            </JourneyStepWrapper>
          </AnimatePresence>
        </div>
      </AgentLayout>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
          <div className="w-12 h-12 border-4 border-dashboard-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
