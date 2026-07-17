"use client";

import React from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { ShieldCheck, ArrowRight, Lock } from "lucide-react";

export default function StepAVConsent() {
  const { nextStep } = useJourney();

  return (
    <StepCard maxWidth="xl">
      <div className="flex flex-col items-center text-center space-y-8 py-4">
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center border-4 border-white shadow-xl shadow-red-100/50">
          <ShieldCheck className="w-12 h-12 text-[#EE1B24]" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Share your data</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed px-4">
            I consent to sharing my data with <span className="font-bold text-slate-700">AU Bank</span> for the purpose of verification. I understand that my data will be protected and will be securely shared.
          </p>
        </div>

        <div className="bg-red-50/50 px-4 py-1.5 rounded-full border border-red-100">
           <p className="text-[10px] font-bold text-[#EE1B24] uppercase tracking-widest">Link is valid till 7:30 PM 28th October 2026</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full pt-4">
          <Button 
            variant="outline"
            className="h-14 rounded-2xl border-slate-200 text-slate-500 font-bold hover:bg-slate-50"
            onClick={() => window.location.href = "/"}
          >
            I Decline
          </Button>
          <Button 
            className="h-14 rounded-2xl bg-[#EE1B24] hover:bg-[#D61820] text-white font-bold shadow-xl shadow-red-100 transition-all active:scale-[0.98]"
            onClick={nextStep}
          >
            I Agree
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 opacity-40">
           <Lock className="w-3 h-3" />
           <span className="text-[10px] font-bold uppercase tracking-widest">End-to-end encrypted</span>
        </div>
      </div>
    </StepCard>
  );
}
