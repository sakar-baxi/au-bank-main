"use client";

import React from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { Building2, CheckCircle2, XCircle, Calendar, ArrowRight } from "lucide-react";

export default function StepAVStatus() {
  const { nextStep } = useJourney();

  return (
    <StepCard maxWidth="xl">
      <div className="flex flex-col items-center text-center space-y-8 py-4">
        <div className="w-24 h-24 rounded-[2.5rem] bg-red-50 flex items-center justify-center border-4 border-white shadow-xl shadow-red-100/50">
          <Building2 className="w-12 h-12 text-[#EE1B24]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Verify your Address</h1>
          <p className="text-sm text-slate-500 font-medium">Select current state of your verification:</p>
        </div>

        <div className="w-full space-y-3 pt-4">
          <button 
            onClick={nextStep}
            className="w-full flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-[#F9FAFB] hover:border-[#EE1B24] hover:bg-red-50/30 transition-all group active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-100 group-hover:border-emerald-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="font-bold text-slate-700 text-sm">Start Verification</span>
            <ArrowRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-[#EE1B24] transition-all" />
          </button>

          <button className="w-full flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-[#F9FAFB] hover:border-red-200 transition-all group opacity-70">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-100">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <span className="font-bold text-slate-500 text-sm">Decline Verification</span>
          </button>

          <button className="w-full flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-[#F9FAFB] hover:border-blue-200 transition-all group opacity-70">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-100">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <span className="font-bold text-slate-500 text-sm">Schedule Verification</span>
          </button>
        </div>
      </div>
    </StepCard>
  );
}
