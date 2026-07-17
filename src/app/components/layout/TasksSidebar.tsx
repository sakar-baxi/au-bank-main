"use client";

import React from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { cn } from "@/lib/utils";
import { Check, ClipboardList } from "lucide-react";

/**
 * Right-rail Tasks panel for salary journeys that match the SBI/AU reference screenshots
 * (Income & Declarations → Verification → Success).
 */
export default function TasksSidebar() {
  const { journeySteps, currentStepIndex, journeyType } = useJourney();

  if (journeySteps.length === 0) return null;

  const isComplete = Boolean(
    journeySteps[currentStepIndex]?.id?.endsWith(":complete")
  );
  const currentTitle = journeySteps[currentStepIndex]?.title || "";

  const journeyLabel =
    journeyType === "etb-nk"
      ? "ETB with KYC"
      : journeyType === "etb"
        ? "ETB Auto Conversion"
        : journeyType === "ntb" || journeyType === "ntb-conversion"
          ? "NTB"
          : "Salary account";

  return (
    <aside className="w-[280px] xl:w-[300px] flex-shrink-0 hidden lg:flex flex-col rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 h-fit sticky top-4">
      <div
        className="px-4 py-3 flex items-center gap-2 text-white"
        style={{ backgroundColor: "var(--primary-bank, #42265e)" }}
      >
        <ClipboardList className="w-4 h-4 opacity-90" />
        <h2 className="text-sm font-bold tracking-wide">Tasks</h2>
      </div>

      <div className="px-4 pt-4 pb-2">
        {isComplete ? (
          <p className="text-sm font-bold text-slate-900 leading-snug">
            <span className="uppercase text-[11px] tracking-wider text-slate-500 block mb-1">
              Completed
            </span>
            {journeyLabel} journey is complete.
          </p>
        ) : (
          <p className="text-sm font-bold text-slate-900 leading-snug">
            <span className="uppercase text-[11px] tracking-wider text-slate-500 block mb-1">
              In progress
            </span>
            {currentTitle}
          </p>
        )}
      </div>

      <div className="px-3 pb-4 space-y-1">
        {journeySteps.map((step, index) => {
          const isDone = index < currentStepIndex || (isComplete && index <= currentStepIndex);
          const isNow = !isComplete && index === currentStepIndex;

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-3 rounded-xl px-3 py-2.5",
                isNow && "bg-[color-mix(in_srgb,var(--primary-bank)_8%,white)]"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2",
                  isDone && "border-transparent text-white",
                  isNow && "border-[var(--primary-bank)] bg-white",
                  !isDone && !isNow && "border-slate-200 bg-white"
                )}
                style={isDone ? { backgroundColor: "var(--primary-bank, #42265e)" } : undefined}
              >
                {isDone ? (
                  <Check className="w-3 h-3" strokeWidth={3} />
                ) : isNow ? (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "var(--primary-bank, #42265e)" }}
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-semibold truncate",
                    isDone && "text-slate-800",
                    isNow && "text-slate-900",
                    !isDone && !isNow && "text-slate-400"
                  )}
                >
                  {step.title}
                </p>
                <p
                  className={cn(
                    "text-[11px] font-semibold mt-0.5",
                    isDone && "text-emerald-600",
                    isNow && "text-[var(--primary-bank)]",
                    !isDone && !isNow && "text-slate-300"
                  )}
                >
                  {isDone ? "Done" : isNow ? "Now" : "—"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
