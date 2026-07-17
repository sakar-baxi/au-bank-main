"use client";

import React, { useState, useEffect } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { MapPin, Navigation, Loader2, ShieldCheck, Check } from "lucide-react";

export default function StepAVLocationAccess() {
  const { formData, nextStep } = useJourney();
  const [isAccessing, setIsAccessing] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  const handleAccess = () => {
    setIsAccessing(true);
    // Simulate location access
    setTimeout(() => {
      setIsAccessing(false);
      setHasAccess(true);
    }, 2000);
  };

  return (
    <StepCard maxWidth="xl">
      <div className="flex flex-col items-center text-center space-y-8 py-4">
        <div className="w-24 h-24 rounded-[2.5rem] bg-red-50 flex items-center justify-center border-4 border-white shadow-xl shadow-red-100/50">
          <Navigation className="w-12 h-12 text-[#EE1B24]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Location Access</h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
            We need to verify your current location matches the {formData.addressType === "Office" ? "office address" : "address you want to verify"}
          </p>
        </div>

        <div className="w-full space-y-4">
          <div className={`p-6 rounded-[2rem] border-2 transition-all duration-500 ${hasAccess ? "border-emerald-100 bg-emerald-50/50" : "border-slate-100 bg-[#F9FAFB]"}`}>
            <div className="flex flex-col items-center gap-4">
               {hasAccess ? (
                 <>
                   <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-100">
                     <Check className="w-6 h-6 text-white" />
                   </div>
                   <p className="font-bold text-emerald-700">Location accessed !!</p>
                 </>
               ) : (
                 <>
                   <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                     <ShieldCheck className="w-6 h-6 text-[#EE1B24]" />
                   </div>
                   <div className="text-center">
                     <p className="font-bold text-slate-900">GPS Location Required</p>
                     <p className="text-xs text-slate-500 mt-1">Please enable location services for accurate verification</p>
                   </div>
                 </>
               )}
            </div>
          </div>
        </div>

        <div className="w-full pt-4">
          {hasAccess ? (
            <Button 
              onClick={nextStep}
              className="w-full h-14 rounded-2xl bg-[#111827] hover:bg-slate-800 text-white font-bold shadow-xl transition-all active:scale-[0.98]"
            >
              Capture Location
            </Button>
          ) : (
            <Button 
              onClick={handleAccess}
              disabled={isAccessing}
              className="w-full h-14 rounded-2xl bg-[#EE1B24] hover:bg-[#D61820] text-white font-bold shadow-xl shadow-red-100 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isAccessing ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Allow Access"}
            </Button>
          )}
        </div>
      </div>
    </StepCard>
  );
}
