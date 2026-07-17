"use client";

import React, { useState } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { ArrowRight, ShieldCheck, CheckCircle2, Lock, Smartphone, ScrollText, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function StepMahindraTncSelection() {
  const { formData, nextStep, updateFormData } = useJourney();
  const [otp, setOtp] = useState((formData.otp || "123456").split(""));
  const [checkboxes, setCheckboxes] = useState({
    employerConsent: formData.employerConsent || false,
    languageConsent: formData.languageConsent || false,
    notPEP: formData.notPEP || false,
    incomeConsent: formData.incomeConsent || false,
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCheckboxChange = (key: keyof typeof checkboxes) => {
    setCheckboxes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleVerify = () => {
    updateFormData({ otp: otp.join(""), ...checkboxes });
    nextStep();
  };

  const allChecked = Object.values(checkboxes).every((v: boolean) => v);
  const otpComplete = otp.every((v: string) => v.length === 1);

  return (
    <div className="w-full min-h-full flex flex-col bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl [.desktop-view_&]:max-w-5xl mx-auto bg-white sm:rounded-3xl sm:shadow-sm sm:border border-slate-200 sm:mt-10 overflow-hidden flex flex-col [.desktop-view_&]:flex-row flex-1 sm:flex-none"
      >
        {/* Left Side: Mobile Header / Desktop Image */}
        <div className="bg-slate-50 p-4 sm:p-6 [.desktop-view_&]:p-10 border-b [.desktop-view_&]:border-b-0 [.desktop-view_&]:border-r border-slate-200 flex flex-col items-center text-center shrink-0 [.desktop-view_&]:w-1/2 [.desktop-view_&]:justify-center relative">
          <div className="hidden [.desktop-view_&]:block w-full h-full absolute inset-0">
             <img 
               src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000" 
               alt="Terms and Security" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
             <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
               <ShieldCheck className="w-8 h-8 text-[#EE1B24]" />
             </div>
          </div>
          
          <div className="relative z-10 [.desktop-view_&]:mt-auto [.desktop-view_&]:mb-8 [.desktop-view_&]:text-white flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 [.desktop-view_&]:px-3 [.desktop-view_&]:py-1 bg-[#EE1B24]/10 [.desktop-view_&]:bg-white/20 [.desktop-view_&]:backdrop-blur-sm rounded-full mb-2 [.desktop-view_&]:mb-4">
              <ShieldCheck className="w-3.5 h-3.5 [.desktop-view_&]:hidden text-[#EE1B24]" />
              <span className="text-[9px] [.desktop-view_&]:text-[10px] font-bold uppercase tracking-widest text-[#EE1B24] [.desktop-view_&]:text-white">Security Verification</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl [.desktop-view_&]:text-4xl font-black mb-1 [.desktop-view_&]:mb-3 text-slate-900 [.desktop-view_&]:text-white tracking-tight">Enter OTP</h1>
            <p className="text-xs [.desktop-view_&]:text-sm text-slate-500 [.desktop-view_&]:text-white/80 font-medium">
              Please verify your number and provide consent.
            </p>
          </div>
        </div>

        {/* Right Side: Form & Action Area */}
        <div className="flex-1 p-4 sm:p-6 [.desktop-view_&]:p-10 flex flex-col [.desktop-view_&]:w-1/2 bg-white justify-between">
          <div className="space-y-4 [.desktop-view_&]:space-y-8">
            {/* OTP Section */}
            <section className="space-y-3 [.desktop-view_&]:space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 [.desktop-view_&]:w-10 [.desktop-view_&]:h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4 [.desktop-view_&]:w-5 [.desktop-view_&]:h-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-sm [.desktop-view_&]:text-base font-bold text-slate-900">Mobile OTP</h2>
                  <p className="text-[10px] [.desktop-view_&]:text-xs font-medium text-slate-500">Sent to +91 ******0013</p>
                </div>
              </div>

              <div className="space-y-3 [.desktop-view_&]:space-y-4 bg-slate-50 p-3 [.desktop-view_&]:p-5 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-center">
                   <span className="text-[9px] [.desktop-view_&]:text-[11px] font-bold uppercase tracking-widest text-slate-500">Enter Code</span>
                   <button className="text-[9px] [.desktop-view_&]:text-[11px] font-bold text-[#EE1B24] uppercase tracking-widest hover:underline transition-all">Resend Code</button>
                 </div>
                 
                 <div className="flex justify-between gap-1.5 sm:gap-2 [.desktop-view_&]:gap-4">
                  {otp.map((digit: string, index: number) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-full h-10 sm:h-12 [.desktop-view_&]:h-14 text-center text-lg [.desktop-view_&]:text-xl font-black bg-white border border-slate-200 rounded-lg focus:bg-white focus:border-[#EE1B24] focus:ring-2 focus:ring-[#EE1B24]/20 transition-all text-slate-800 shadow-sm"
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Consents Section */}
            <section className="space-y-3 [.desktop-view_&]:space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 [.desktop-view_&]:w-10 [.desktop-view_&]:h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <ScrollText className="w-4 h-4 [.desktop-view_&]:w-5 [.desktop-view_&]:h-5 text-slate-600" />
                </div>
                <h2 className="text-sm [.desktop-view_&]:text-base font-bold text-slate-900">Legal Consents</h2>
              </div>

              <div className="grid gap-2 sm:grid-cols-1 [.desktop-view_&]:gap-3">
                {[
                  { key: "employerConsent", text: "By entering the OTP I allow my employer to share my salary, salary account as well as my PII (Personal Identifiable Information) details with AU Bank" },
                  { key: "languageConsent", text: "I understand English and my preferred language for Personal Loan application is English. I accept and agree to the Privacy Policy consent form and terms of use." },
                  { key: "notPEP", text: "I am not a politically exposed person (i)" },
                  { key: "incomeConsent", text: "My yearly household income is more than Rs. 3 lakhs" }
                ].map((consent) => (
                  <label 
                    key={consent.key}
                    className={`relative group cursor-pointer flex items-center gap-2 p-2.5 [.desktop-view_&]:p-3 rounded-lg border transition-all ${
                      checkboxes[consent.key as keyof typeof checkboxes] 
                        ? "border-[#EE1B24] bg-[#EE1B24]/5" 
                        : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    <div className="shrink-0">
                      <div className={`w-4 h-4 [.desktop-view_&]:w-5 [.desktop-view_&]:h-5 rounded-md border flex items-center justify-center transition-all ${
                        checkboxes[consent.key as keyof typeof checkboxes] 
                          ? "bg-[#EE1B24] border-[#EE1B24]" 
                          : "bg-white border-slate-300 group-hover:border-slate-400"
                      }`}>
                        {checkboxes[consent.key as keyof typeof checkboxes] && <Check size={10} className="text-white stroke-[3] [.desktop-view_&]:w-3.5 [.desktop-view_&]:h-3.5" />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={checkboxes[consent.key as keyof typeof checkboxes]}
                        onChange={() => handleCheckboxChange(consent.key as keyof typeof checkboxes)}
                      />
                    </div>
                    <span className={`text-[10px] sm:text-xs [.desktop-view_&]:text-sm font-bold leading-tight transition-colors ${
                      checkboxes[consent.key as keyof typeof checkboxes] ? "text-slate-900" : "text-slate-600"
                    }`}>
                      {consent.text}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Action Area */}
          <div className="pt-4 [.desktop-view_&]:pt-12">
            <button
              onClick={handleVerify}
              disabled={!otpComplete || !allChecked}
              className="w-full h-12 [.desktop-view_&]:h-16 bg-[#EE1B24] hover:bg-[#D61820] disabled:bg-slate-200 disabled:text-slate-400 text-white font-black uppercase tracking-widest rounded-xl [.desktop-view_&]:rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#EE1B24]/20 active:scale-[0.98] [.desktop-view_&]:text-lg"
            >
              Verify
              <ArrowRight className="w-4 h-4 [.desktop-view_&]:w-5 [.desktop-view_&]:h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
