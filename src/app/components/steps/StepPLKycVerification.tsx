"use client";

import React, { useState } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { Info, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function StepPLKycVerification() {
  const { nextStep } = useJourney();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    if (otp.length !== 6) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      nextStep();
    }, 2000);
  };

  return (
    <StepCard maxWidth="xl">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
          <Info className="w-4 h-4" /> Aadhaar e-KYC Verification
        </div>
        
        <div>
          <h1 className="text-xl font-bold text-slate-900">Secure KYC via Aadhaar</h1>
          <p className="text-sm text-slate-600 mt-1">We've sent a 6-digit code to your Aadhaar-linked mobile number ******3210.</p>
        </div>

        <div className="flex justify-center gap-2 py-4">
          <Input 
            type="text" 
            placeholder="Enter 6-digit OTP" 
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="h-14 text-center text-2xl font-bold tracking-[0.5em] border-slate-200 rounded-xl focus:border-[#EE1B24] focus:ring-1 focus:ring-[#EE1B24] outline-none"
            maxLength={6}
          />
        </div>

        <div className="pt-4">
          <Button 
            onClick={handleVerify} 
            disabled={otp.length !== 6 || isVerifying}
            className="w-full bg-[#EE1B24] hover:bg-[#D61820] text-white h-12 text-lg font-bold rounded-xl shadow-lg shadow-red-100 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
              </span>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-slate-500">Didn't receive the OTP? <button className="text-[#EE1B24] font-bold hover:underline">Resend OTP</button></p>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">256-bit SSL Secured Connection</span>
          </div>
        </div>
      </div>
    </StepCard>
  );
}
