"use client";

import React, { useEffect, useState } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Clock } from "lucide-react";

export default function StepMahindraVKYC() {
  const { nextStep } = useJourney();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          nextStep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [nextStep]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-slate-100">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            <span className="text-[#C41E3A] font-bold">Eligibility</span>
            <span className="text-[#C41E3A] font-bold">KYC</span>
            <span>Review</span>
            <span>Mandate</span>
            <span>Agreement</span>
          </div>
          <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#C41E3A] rounded-full w-2/5" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-[#C41E3A] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Clock className="w-10 h-10 text-[#C41E3A]" />
          </div>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mt-8 text-center">Video KYC in Progress</h1>
        <p className="text-slate-500 mt-2 text-center max-w-xs">
          Please wait while we connect you with our verification agent...
        </p>
        <p className="text-sm text-slate-400 mt-4">Starting in {countdown}...</p>
      </div>
    </div>
  );
}
