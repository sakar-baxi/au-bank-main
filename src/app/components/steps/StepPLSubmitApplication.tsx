"use client";

import React, { useState } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { CheckCircle2, ArrowRight, Loader2, Check } from "lucide-react";

export default function StepPLSubmitApplication() {
  const { formData, nextStep } = useJourney();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      nextStep();
    }, 3000);
  };

  const summary = [
    { label: "Selected Plan", value: formData.selectedPlan ? `${formData.selectedPlan.amount} for ${formData.selectedPlan.tenure}` : "₹10L for 48 months" },
    { label: "eNACH Method", value: formData.enachMethod || "UPI eMandate" },
    { label: "Disbursal Account", value: "AU Bank Salary Account" },
  ];

  return (
    <StepCard maxWidth="2xl" noPadding>
      <div className="bg-[#111827] text-white px-6 py-4 font-semibold flex items-center gap-2 rounded-t-2xl">
        <CheckCircle2 className="w-5 h-5 text-white" />
        Submit Personal Loan Application
      </div>
      <div className="p-8 space-y-6">
        <div className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          {summary.map((row, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-200/50 last:border-0">
              <span className="text-sm text-slate-500 font-medium">{row.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-900">{row.value}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100">
                  <Check className="w-3 h-3" /> VERIFIED
                </span>
              </div>
            </div>
          ))}
        </div>

        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="flex items-center gap-2 text-[#EE1B24] font-bold animate-pulse text-lg">
              <Loader2 className="w-6 h-6 animate-spin" /> Application submitted
            </div>
            <p className="text-sm text-slate-500">Completing digital e-sign process...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 text-center px-8">By clicking "Confirm & Continue", you agree to the Terms & Conditions and authorize AU Bank to process your application.</p>
            <Button 
              onClick={handleSubmit} 
              className="w-full bg-[#EE1B24] hover:bg-[#D61820] text-white h-14 text-lg font-bold rounded-xl shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
            >
              Confirm & Continue →
            </Button>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
            ))}
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined by 10k+ professionals today</p>
        </div>
      </div>
    </StepCard>
  );
}
