"use client";

import React, { useState, useEffect } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { MapPin, Navigation, Loader2, Search, Check } from "lucide-react";

export default function StepAVVerifyingLocation() {
  const { formData, nextStep } = useJourney();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVerifying(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StepCard maxWidth="xl">
      <div className="flex flex-col items-center text-center space-y-8 py-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center border border-slate-100 shadow-xl">
             <MapPin className={`w-12 h-12 ${isVerifying ? "text-slate-300" : "text-[#EE1B24]"} transition-colors duration-500`} />
          </div>
          {isVerifying && (
            <div className="absolute inset-0 border-4 border-t-[#EE1B24] border-r-transparent border-b-transparent border-l-transparent rounded-[2.5rem] animate-spin" />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {isVerifying ? "Verifying Location" : "Location Verified"}
          </h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            {isVerifying ? "Matching your GPS coordinates with the target address..." : "Address and coordinates matched successfully"}
          </p>
        </div>

        <div className="w-full">
          <div className="p-6 rounded-[2rem] border border-slate-100 bg-[#F9FAFB] text-left space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {formData.addressType === "Office" ? "Office Address" : "Target Address"}
                </p>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                  {formData.addressType === "Office" ? "Mahindra Towers, Worli, Mumbai, Maharashtra - 400018" : "D-126 Main Street, Apartment 4B, Bengaluru, Karnataka - 560001"}
                </p>
              </div>
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Coordinates</p>
               <p className="text-xs font-mono font-bold text-slate-500">
                 28.458573, 77.077261
               </p>
             </div>
          </div>
        </div>

        <div className="w-full pt-4">
          <Button 
            disabled={isVerifying}
            onClick={nextStep}
            className="w-full h-14 rounded-2xl bg-[#EE1B24] hover:bg-[#D61820] text-white font-bold shadow-xl shadow-red-100 transition-all active:scale-[0.98] disabled:opacity-40"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Matching...
              </span>
            ) : "Continue"}
          </Button>
        </div>
      </div>
    </StepCard>
  );
}
