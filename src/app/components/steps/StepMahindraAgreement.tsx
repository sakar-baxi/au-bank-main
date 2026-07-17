"use client";

import React, { useState } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { FileText } from "lucide-react";

export default function StepMahindraAgreement() {
  const { formData, nextStep } = useJourney();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="w-full min-h-full flex flex-col bg-[#F5F7F9]">
      <div className="flex-1 flex flex-col items-center">
        {/* Content */}
        <div className="w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Loan agreement</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-[340px]">
              Please check your loan agreement. You will be redirected to our partner, SignDesk for digital agreement to be signed via OTP.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-6 sm:py-10">
            <div className="relative group cursor-pointer">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 border-dashed border-red-200 flex flex-col items-center justify-center gap-3 bg-red-50/30 group-hover:bg-red-50/50 transition-all">
                <div className="w-12 h-16 sm:w-16 sm:h-20 bg-[#EE1B24]/10 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                   <FileText className="text-[#EE1B24] w-6 h-6 sm:w-8 sm:h-8" />
                   <div className="absolute bottom-1 w-full flex justify-center">
                      <svg className="w-5 h-2 sm:w-6 sm:h-3 text-[#EE1B24]/40" viewBox="0 0 40 20">
                         <path d="M0,10 Q10,0 20,10 T40,10" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                   </div>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-[#EE1B24] uppercase tracking-widest">View agreement</span>
              </div>
              <div className="absolute -inset-4 border border-red-100 rounded-full animate-pulse opacity-50" />
            </div>
          </div>

          <label className="flex items-start gap-3 sm:gap-4 bg-slate-100/50 p-4 sm:p-6 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all border border-slate-200/50">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 sm:w-6 sm:h-6 rounded-md border-slate-300 text-[#EE1B24] focus:ring-[#EE1B24]"
            />
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
              I confirm the authenticity and validity of the documents submitted to AU Bank. I agree that I have read and understood the above agreement.
            </span>
          </label>
        </div>

        {/* Sticky Footer */}
        <div className="mt-auto w-full bg-white px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between border-t border-slate-100 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount you will receive</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900">₹7,93,941</span>
          </div>
          <button
            onClick={nextStep}
            disabled={!agreed}
            className="h-12 sm:h-16 px-8 sm:px-12 bg-[#EE1B24] disabled:bg-slate-200 disabled:text-slate-400 hover:bg-[#D61820] text-white font-black uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#EE1B24]/30 active:scale-[0.98] text-[10px] sm:text-sm"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
