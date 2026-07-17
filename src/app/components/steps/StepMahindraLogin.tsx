"use client";

import React, { useState } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ShieldCheck, Lock, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { SbiSidebarSymbol } from "@/app/components/branding/SbiOfficialLogo";

export default function StepMahindraLogin() {
  const { formData, updateFormData, nextStep } = useJourney();
  const [employeeId, setEmployeeId] = useState(formData.employeeId || "EMP001234");
  const [mobileNumber, setMobileNumber] = useState(formData.mobileNumber || "9934090013");

  const handleSubmit = () => {
    updateFormData({ employeeId, mobileNumber });
    nextStep();
  };

  return (
    <div className="w-full min-h-full flex flex-col bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg [.desktop-view_&]:max-w-4xl mx-auto bg-white sm:rounded-3xl sm:shadow-sm sm:border border-slate-200 sm:mt-10 overflow-hidden flex flex-col [.desktop-view_&]:flex-row flex-1 sm:flex-none"
      >
        {/* Header - Light theme, responsive padding */}
        <div className="bg-slate-50 p-4 sm:p-6 [.desktop-view_&]:p-10 border-b [.desktop-view_&]:border-b-0 [.desktop-view_&]:border-r border-slate-200 flex flex-col items-center text-center shrink-0 [.desktop-view_&]:w-1/2 [.desktop-view_&]:justify-center relative">
          <div className="w-full h-28 sm:h-36 [.desktop-view_&]:absolute [.desktop-view_&]:inset-0 [.desktop-view_&]:h-full rounded-2xl [.desktop-view_&]:rounded-none overflow-hidden mb-4 [.desktop-view_&]:mb-0 relative">
             <img 
               src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1000" 
               alt="Secure Login" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t [.desktop-view_&]:bg-gradient-to-b from-white [.desktop-view_&]:from-black/60 via-white/50 [.desktop-view_&]:via-black/30 to-transparent" />
             <div className="absolute bottom-2 [.desktop-view_&]:bottom-auto [.desktop-view_&]:top-8 left-1/2 -translate-x-1/2 flex min-h-10 items-center justify-center gap-2 [.desktop-view_&]:min-h-16 px-2 [.desktop-view_&]:px-3">
               <SbiSidebarSymbol boxClassName="h-9 w-9 [.desktop-view_&]:h-11 [.desktop-view_&]:w-11" />
               <span className="whitespace-nowrap pr-1 text-xs font-bold text-slate-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] [.desktop-view_&]:text-sm [.desktop-view_&]:text-white [.desktop-view_&]:drop-shadow-md">AU Bank</span>
             </div>
          </div>
          
          <div className="relative z-10 [.desktop-view_&]:mt-auto [.desktop-view_&]:mb-8 [.desktop-view_&]:text-white">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 [.desktop-view_&]:bg-white/20 [.desktop-view_&]:backdrop-blur-sm rounded-full mb-1 [.desktop-view_&]:mb-3">
              <Sparkles className="w-2.5 h-2.5 text-[#EE1B24] [.desktop-view_&]:text-white" />
              <span className="text-[8px] [.desktop-view_&]:text-[10px] font-bold uppercase tracking-widest text-slate-600 [.desktop-view_&]:text-white">Employee Portal</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl [.desktop-view_&]:text-4xl font-black text-slate-900 [.desktop-view_&]:text-white mb-1 [.desktop-view_&]:mb-3">Unlock your offer now!</h1>
            <p className="text-[10px] sm:text-xs [.desktop-view_&]:text-sm text-slate-500 [.desktop-view_&]:text-white/80 font-medium px-4 [.desktop-view_&]:px-8">Enter credentials to access your offers.</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 p-4 sm:p-6 [.desktop-view_&]:p-10 flex flex-col justify-between [.desktop-view_&]:w-1/2 bg-white">
          <div className="space-y-3 [.desktop-view_&]:space-y-6 [.desktop-view_&]:mt-8">
            <div className="space-y-1 [.desktop-view_&]:space-y-2">
              <Label className="text-[9px] [.desktop-view_&]:text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Enter your SAP code</Label>
              <div className="relative">
                <User className="absolute left-3 [.desktop-view_&]:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 [.desktop-view_&]:w-5 [.desktop-view_&]:h-5 text-slate-400" />
                <Input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="Eg. 47029604"
                  className="h-10 sm:h-12 [.desktop-view_&]:h-14 pl-9 [.desktop-view_&]:pl-12 bg-slate-50 border-slate-200 rounded-lg [.desktop-view_&]:rounded-xl focus:bg-white focus:ring-2 focus:ring-[#EE1B24]/20 focus:border-[#EE1B24] transition-all font-bold text-slate-800 text-xs sm:text-sm [.desktop-view_&]:text-base"
                />
              </div>
            </div>

            <div className="space-y-1 [.desktop-view_&]:space-y-2">
              <Label className="text-[9px] [.desktop-view_&]:text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Let&apos;s start with your SAP-connected mobile number</Label>
              <div className="flex gap-2">
                <div className="h-10 sm:h-12 [.desktop-view_&]:h-14 px-2 [.desktop-view_&]:px-4 bg-slate-50 border border-slate-200 rounded-lg [.desktop-view_&]:rounded-xl flex items-center gap-1.5 [.desktop-view_&]:gap-2 shrink-0">
                  <img src="https://flagcdn.com/w20/in.png" alt="IN" className="w-4 [.desktop-view_&]:w-5 rounded-[2px]" />
                  <span className="font-bold text-slate-600 text-xs [.desktop-view_&]:text-base">+91</span>
                </div>
                <Input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="9876543212"
                  className="h-10 sm:h-12 [.desktop-view_&]:h-14 bg-slate-50 border-slate-200 rounded-lg [.desktop-view_&]:rounded-xl focus:bg-white focus:ring-2 focus:ring-[#EE1B24]/20 focus:border-[#EE1B24] transition-all font-bold text-slate-800 text-xs sm:text-sm [.desktop-view_&]:text-base"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 [.desktop-view_&]:pt-12 space-y-3 [.desktop-view_&]:space-y-5">
            <button
              onClick={handleSubmit}
              disabled={!employeeId || !mobileNumber}
              className="w-full h-12 [.desktop-view_&]:h-14 bg-[#EE1B24] hover:bg-[#D61820] disabled:bg-slate-200 disabled:text-slate-400 text-white font-black uppercase tracking-widest rounded-lg [.desktop-view_&]:rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#EE1B24]/20 active:scale-[0.98]"
            >
              Get OTP
              <ArrowRight className="w-4 h-4 [.desktop-view_&]:w-5 [.desktop-view_&]:h-5" />
            </button>

            <div className="flex items-center justify-center gap-4 [.desktop-view_&]:gap-6">
              <div className="flex items-center gap-1 [.desktop-view_&]:gap-2 text-slate-400">
                <Lock size={10} className="[.desktop-view_&]:w-3.5 [.desktop-view_&]:h-3.5" />
                <span className="text-[8px] [.desktop-view_&]:text-[10px] font-bold uppercase tracking-wider">Encrypted</span>
              </div>
              <div className="w-1 h-1 bg-slate-200 rounded-full" />
              <div className="flex items-center gap-1 [.desktop-view_&]:gap-2 text-slate-400">
                <ShieldCheck size={10} className="[.desktop-view_&]:w-3.5 [.desktop-view_&]:h-3.5" />
                <span className="text-[8px] [.desktop-view_&]:text-[10px] font-bold uppercase tracking-wider">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
