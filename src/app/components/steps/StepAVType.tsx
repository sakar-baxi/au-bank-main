"use client";

import React from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { Home, Briefcase, Building, ArrowRight } from "lucide-react";

export default function StepAVType() {
  const { nextStep, updateFormData } = useJourney();

  const handleSelect = (type: string) => {
    updateFormData({ addressType: type });
    nextStep();
  };

  return (
    <StepCard maxWidth="xl">
      <div className="flex flex-col items-center text-center space-y-8 py-4">
        <div className="w-24 h-24 rounded-[2.5rem] bg-[#111827] flex items-center justify-center rotate-6 shadow-2xl">
          <Building className="w-12 h-12 text-white -rotate-6" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Select Address type</h1>
          <p className="text-sm text-slate-500 font-medium">Choose the type of address to verify:</p>
        </div>

        <div className="w-full space-y-4 pt-4">
          <button 
            onClick={() => handleSelect("Residential")}
            className="w-full group flex items-center gap-5 p-6 rounded-[2rem] border-2 border-slate-100 bg-white hover:border-[#EE1B24] hover:bg-red-50/30 transition-all active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-[#EE1B24]/10 transition-colors">
              <Home className="w-7 h-7 text-slate-400 group-hover:text-[#EE1B24]" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-900 text-lg">Residential Address</p>
              <p className="text-[10px] font-bold text-[#EE1B24] uppercase tracking-widest mt-0.5">Your primary home</p>
            </div>
            <ArrowRight className="w-5 h-5 ml-auto text-slate-200 group-hover:text-[#EE1B24] group-hover:translate-x-1 transition-all" />
          </button>

          <button 
            onClick={() => handleSelect("Office")}
            className="w-full group flex items-center gap-5 p-6 rounded-[2rem] border-2 border-slate-100 bg-white hover:border-[#EE1B24] hover:bg-red-50/30 transition-all active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-[#EE1B24]/10 transition-colors">
              <Briefcase className="w-7 h-7 text-slate-400 group-hover:text-[#EE1B24]" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-900 text-lg">Office Address</p>
              <p className="text-[10px] font-bold text-[#EE1B24] uppercase tracking-widest mt-0.5">Your workplace</p>
            </div>
            <ArrowRight className="w-5 h-5 ml-auto text-slate-200 group-hover:text-[#EE1B24] group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        <p className="text-[10px] font-bold text-[#EE1B24] uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">
          Kindly be physically available at the selected address
        </p>
      </div>
    </StepCard>
  );
}
