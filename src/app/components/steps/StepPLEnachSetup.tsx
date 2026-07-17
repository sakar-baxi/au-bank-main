"use client";

import React, { useState } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { Info, ShieldCheck, CreditCard, ArrowRight, Loader2 } from "lucide-react";

export default function StepPLEnachSetup() {
  const { nextStep, updateFormData } = useJourney();
  const [isLinking, setIsLinking] = useState(false);

  const handleSetup = (method: string) => {
    setIsLinking(true);
    updateFormData({ enachMethod: method });
    setTimeout(() => {
      setIsLinking(false);
      nextStep();
    }, 2500);
  };

  return (
    <StepCard maxWidth="xl">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
          <Info className="w-4 h-4" /> eNACH Auto-Pay Setup
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900">Set up Auto-debit for EMI</h1>
          <p className="text-sm text-slate-600 mt-1">Authorize AU Bank to deduct EMI automatically from your account to avoid late fees.</p>
        </div>

        {isLinking ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="flex items-center gap-2 text-[#EE1B24] font-bold animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin" /> Linking payment method...
            </div>
            <p className="text-sm text-slate-500">Redirecting to secure gateway</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Recommended</span>
                <span className="text-sm font-bold text-slate-900">Salary Account eNACH</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-500 font-medium">Alternative</span>
                <span className="text-sm font-bold text-slate-900">UPI eMandate</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button 
                onClick={() => handleSetup("Salary Account")} 
                variant="outline"
                className="h-14 rounded-xl border-slate-200 text-slate-900 font-bold hover:bg-slate-50 hover:border-[#EE1B24] transition-all text-xs"
              >
                Use Salary Account eNACH
              </Button>
              <Button 
                onClick={() => handleSetup("UPI eMandate")} 
                variant="outline"
                className="h-14 rounded-xl border-slate-200 text-slate-900 font-bold hover:bg-slate-50 hover:border-[#EE1B24] transition-all text-xs"
              >
                Use UPI eMandate
              </Button>
            </div>
          </>
        )}

        <div className="flex items-center justify-center gap-2 bg-slate-50 py-3 rounded-xl border border-slate-100">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">NPCI Secure Auto-Pay Gateway</span>
        </div>
      </div>
    </StepCard>
  );
}
