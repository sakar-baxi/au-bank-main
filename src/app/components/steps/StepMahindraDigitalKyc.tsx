"use client";

import React from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function StepMahindraDigitalKyc() {
  const { formData, nextStep } = useJourney();

  const kycFields = [
    { label: "Full Name", value: formData.name || "Saurabh Vitthal Gadge" },
    { label: "PAN Number", value: formData.panNumber || "ABCDE1234F" },
    { label: "Date of Birth", value: formData.dob || "22 Jan 1996" },
    { label: "Employment", value: formData.companyName || "Mahindra & Mahindra Ltd" },
    { label: "Annual Income", value: formData.annualIncome || "₹10,20,000" },
    { label: "Email", value: formData.email || "saurabh.gadge@mahindra.com" },
    { label: "Mobile", value: formData.mobileNumber || "+91 99340 90013" },
  ];

  const profilePhoto = "/saurabh.png";

  return (
    <div className="w-full min-h-full flex flex-col bg-[#F5F7F9]">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="space-y-1 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Verify your KYC details</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Please review your KYC details.</p>
        </div>

        {/* Digital Aadhaar KYC Box (DigiLocker Interface) */}
        <div className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
          {/* DigiLocker Logo row */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aadhaar Data Verified</span>
             </div>
             <img 
               src="/digilocker.png" 
               alt="DigiLocker" 
               className="h-6 sm:h-10 w-auto object-contain" 
             />
          </div>

          <div className="flex items-start gap-4 sm:gap-5 mb-6">
            <div className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden border border-slate-100 shrink-0 bg-slate-50">
              <Image 
                src={profilePhoto} 
                alt="Profile" 
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 py-0.5 sm:py-1">
              <h2 className="text-sm sm:text-base font-black text-slate-900 mb-3 sm:mb-4 leading-tight uppercase truncate sm:whitespace-normal">
                {formData.name || "Saurabh Vitthal Gadge"}
              </h2>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-tight">DOB:</span>
                  <span className="font-black text-slate-800 uppercase tracking-tight">{formData.dob || "22 Jan 1996"}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-tight">Gender:</span>
                  <span className="font-black text-slate-800 uppercase tracking-tight">{formData.gender || "Male"}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-tight">Father:</span>
                  <span className="font-black text-slate-800 uppercase tracking-tight truncate ml-2">{formData.fatherName || "Vitthal"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 sm:pt-6 border-t border-slate-50">
             <div className="space-y-3">
                <div className="flex items-center justify-between">
                   <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Address:</p>
                   <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shrink-0">
                      <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-wider">Source: UIDAI</span>
                    </div>
                </div>
                <p className="text-[10px] sm:text-xs font-black text-slate-800 leading-relaxed uppercase">
                  {formData.currentAddress || "Vikhroli(W) Trimurti Chawl,\nSuryanagar Mumbai Maharashtra\n400083"}
                </p>
             </div>
          </div>
        </div>

        {/* Previous Fields List */}
        <div className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-sm border border-slate-100 divide-y divide-slate-50">
           <h3 className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Other Details</h3>
          {kycFields.map((field, idx) => (
            <div key={idx} className="py-3 sm:py-4 flex items-center justify-between px-1 sm:px-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-tight">{field.label}</span>
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-4 overflow-hidden">
                <span className="text-[11px] sm:text-[12px] font-black text-slate-800 truncate max-w-[120px] sm:max-w-none">{field.value}</span>
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full shrink-0">
                  <CheckCircle2 className="w-2 sm:w-2.5 h-2 sm:h-2.5" />
                  <span className="text-[6px] sm:text-[7px] font-bold uppercase tracking-wider">Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto bg-white px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between border-t border-slate-100 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] shrink-0">
        <div className="flex flex-col">
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount to receive</span>
          <span className="text-lg sm:text-xl font-black text-slate-900">₹7,93,941</span>
        </div>
        <button
          onClick={nextStep}
          className="h-12 sm:h-14 px-8 sm:px-10 bg-[#EE1B24] hover:bg-[#D61820] text-white font-black uppercase tracking-widest rounded-full transition-all flex items-center justify-center shadow-lg shadow-[#EE1B24]/30 active:scale-[0.98] text-[10px] sm:text-sm"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
