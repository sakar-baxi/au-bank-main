"use client";

import React from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { User, Home, MapPin, ClipboardCheck, ArrowRight, UserCheck } from "lucide-react";

export default function StepAVWelcome() {
  const { nextStep, formData } = useJourney();

  return (
    <StepCard maxWidth="xl">
      <div className="flex flex-col items-center text-center space-y-8 py-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-[2rem] bg-[#111827] flex items-center justify-center rotate-3 shadow-2xl">
             <UserCheck className="w-12 h-12 text-white -rotate-3" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#EE1B24] border-4 border-white flex items-center justify-center shadow-lg">
             <MapPin className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome, {formData.firstName || "Rahul"}</h1>
          <p className="text-slate-500 font-medium max-w-xs mx-auto">
            <span className="font-bold text-slate-800">AU Bank</span> has invited you to verify your Address
          </p>
        </div>

        <div className="w-full space-y-4 pt-4">
          <button 
            onClick={nextStep}
            className="w-full group p-6 rounded-[2rem] border-2 border-slate-100 bg-white hover:border-[#EE1B24] hover:bg-red-50/30 transition-all text-left flex items-center gap-5 active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-[#EE1B24]/10 transition-colors">
              <User className="w-6 h-6 text-slate-400 group-hover:text-[#EE1B24]" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">Self FI Verification</p>
              <p className="text-[10px] font-bold text-[#EE1B24] uppercase tracking-widest mt-0.5">Start the Self FI process</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#EE1B24] group-hover:translate-x-1 transition-all" />
          </button>

          <div className="w-full p-6 rounded-[2rem] border-2 border-slate-50 bg-slate-50/50 text-left flex items-center gap-5 opacity-60 cursor-not-allowed">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0">
              <Home className="w-6 h-6 text-slate-300" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-400">Physical Verification</p>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">To be completed by the ABCD Team</p>
            </div>
            <Lock className="w-4 h-4 text-slate-200" />
          </div>
        </div>
      </div>
    </StepCard>
  );
}

function Lock(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    )
}
