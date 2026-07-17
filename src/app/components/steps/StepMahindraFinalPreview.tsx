"use client";

import React, { useState } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { ChevronDown, Check } from "lucide-react";

export default function StepMahindraFinalPreview() {
  const { formData, nextStep } = useJourney();
  const [agreed, setAgreed] = useState(false);

  const accordions = [
    { title: "Disbursed amount & charges" },
    { title: "Flexible repayment details" },
    { title: "Regular repayment details" },
    { title: "Personal details" },
  ];

  return (
    <div className="w-full min-h-full flex flex-col bg-[#F5F7F9]">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="space-y-1 mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Review your application</h1>
        </div>

        {/* Black Card */}
        <div className="bg-[#1A1A1A] rounded-[2rem] p-6 sm:p-8 text-white space-y-6 mb-6">
            <div>
                <p className="text-[10px] sm:text-xs font-bold text-white/60 mb-1">Approved amount</p>
                <p className="text-2xl sm:text-3xl font-black">₹ 7,95,371</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-white/60 mb-0.5 uppercase tracking-wider">Flexible tenure</p>
                    <p className="text-xs sm:text-sm font-black">12 months</p>
                </div>
                <div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-white/60 mb-0.5 uppercase tracking-wider">Remaining tenure</p>
                    <p className="text-xs sm:text-sm font-black">48 months</p>
                </div>
            </div>

            <div className="pt-4 border-t border-white/10">
                <p className="text-[9px] sm:text-[10px] font-bold text-white/60 uppercase tracking-widest leading-relaxed">
                    Annual rate of interest: <span className="text-white">12.00%</span>
                </p>
            </div>
        </div>

        {/* Accordions */}
        <div className="space-y-3 mb-8">
            {accordions.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 flex items-center justify-between shadow-sm">
                    <span className="text-xs sm:text-sm font-black text-slate-800">{item.title}</span>
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                </div>
            ))}
        </div>

        {/* Consent */}
        <label className="flex items-start gap-3 sm:gap-4 cursor-pointer group px-1">
            <div className="mt-1 relative shrink-0">
                <input 
                    type="checkbox" 
                    className="peer sr-only"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                />
                <div className="w-5 h-5 rounded border-2 border-slate-200 bg-white peer-checked:bg-slate-800 peer-checked:border-slate-800 transition-all flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white stroke-[4]" />
                </div>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                I confirm that the information furnished by me in this application is accurate.
            </span>
        </label>
      </div>

      {/* Footer */}
      <div className="mt-auto bg-white px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between border-t border-slate-100 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] shrink-0">
        <div className="flex flex-col">
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount to receive</span>
          <span className="text-lg sm:text-xl font-black text-slate-900">₹7,93,941</span>
        </div>
        <button
          onClick={nextStep}
          disabled={!agreed}
          className="h-12 sm:h-14 px-8 sm:px-10 bg-[#EE1B24] hover:bg-[#D61820] disabled:bg-slate-200 text-white font-black uppercase tracking-widest rounded-full transition-all flex items-center justify-center shadow-lg shadow-[#EE1B24]/30 active:scale-[0.98] text-[10px] sm:text-sm"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
