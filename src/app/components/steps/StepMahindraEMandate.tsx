"use client";

import React from "react";
import { useJourney } from "@/app/context/JourneyContext";

export default function StepMahindraEMandate() {
  const { formData, nextStep } = useJourney();

  return (
    <div className="w-full min-h-full flex flex-col bg-[#F5F7F9]">
      <div className="flex-1 flex flex-col items-center">
        {/* Content */}
        <div className="w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Automate your EMIs</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-[320px]">
              Please confirm your bank details. We will validate these for your loan disbursal and set up your EMI repayment.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6 sm:space-y-8">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-black text-slate-900">Account details</h2>
            </div>
            
            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-1">
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account number</p>
                <p className="text-base sm:text-lg font-black text-slate-900 truncate">{formData.bankAccountNumber || "12340000123"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{formData.bankBranch || "Shahpura Branch"}</p>
                  <p className="text-xs sm:text-sm font-black text-slate-700 truncate">{formData.bankName || "AU Bank"}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">IFSC</p>
                  <p className="text-xs sm:text-sm font-black text-slate-700 truncate">{formData.bankIfscCode || "AUBL00081"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="mt-auto w-full bg-white px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between border-t border-slate-100 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount you will receive</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900">₹7,93,941</span>
          </div>
          <button
            onClick={nextStep}
            className="h-12 sm:h-16 px-8 sm:px-12 bg-[#EE1B24] hover:bg-[#D61820] text-white font-black uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#EE1B24]/30 active:scale-[0.98] text-[10px] sm:text-sm"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
