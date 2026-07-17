"use client";

import React from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function StepAVComplete() {
  const { formData } = useJourney();

  const applicationStatus = [
    { label: "Application Submitted", status: "completed", date: "Today" },
    { label: "Document Verification", status: "in_progress", date: "Pending" },
    { label: "Final Approval", status: "pending", date: "Pending" },
    { label: "Disbursal", status: "pending", date: "-" },
  ];

  const crossSellOffers = [
    { 
      title: "Vehicle Loan", 
      desc: "Drive home your dream car at 8.5% p.a.", 
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      title: "Fixed Deposits", 
      desc: "Grow your savings with up to 8.25% p.a.", 
      icon: CreditCard,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    }
  ];

  return (
    <div className="w-full min-h-full bg-white flex flex-col">
      {/* Header section with Success Icon */}
      <div className="w-full bg-slate-50/50 pt-12 pb-8 px-6 border-b border-slate-100 flex flex-col items-center text-center shrink-0">
        <div className="relative mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-100">
             <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 text-emerald-500 animate-pulse" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">Application Submitted!</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-[280px] mx-auto leading-relaxed">
          Your verification request has been successfully submitted for processing.
        </p>
      </div>

      {/* Main Content - Strictly Single Column on Mobile */}
      <div className="flex-1 flex flex-col p-6 sm:p-10 gap-10 max-w-2xl mx-auto w-full">
        
        {/* Tracker Section */}
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#EE1B24]" />
              Application Tracker
            </h3>
            <div className="px-2.5 py-1 bg-red-50 rounded-full border border-red-100/50 shrink-0">
              <span className="text-[9px] font-black text-[#EE1B24] tracking-wider">REF: MF-26753</span>
            </div>
          </div>
          
          <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {applicationStatus.map((step, i) => (
              <div key={i} className="relative flex items-start gap-4 pl-8">
                <div className={cn(
                  "absolute left-0 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10",
                  step.status === "completed" ? "bg-emerald-500" : 
                  step.status === "in_progress" ? "bg-[#EE1B24] animate-pulse" : "bg-slate-200"
                )}>
                  {step.status === "completed" && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-bold",
                    step.status === "completed" ? "text-slate-900" : 
                    step.status === "in_progress" ? "text-[#EE1B24]" : "text-slate-400"
                  )}>{step.label}</p>
                  <p className="text-[11px] text-slate-500">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Details Card */}
        <div className="w-full bg-slate-50 rounded-[2rem] p-6 border border-slate-100 space-y-5">
          <h3 className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Review Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight shrink-0">Loan Amount</span>
              <span className="text-[13px] font-black text-slate-900 text-right">₹{formData?.loanAmount || "10,00,000"}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight shrink-0">Tenure</span>
              <span className="text-[13px] font-black text-slate-900 text-right">{formData?.loanTenure || "36"} Months</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight shrink-0">Address Verified</span>
              <div className="flex items-center gap-1.5 text-emerald-600 font-black">
                 <CheckCircle2 className="w-3.5 h-3.5" />
                 <span className="text-[11px]">YES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="w-full space-y-4">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Recommended for you</p>
          <div className="flex flex-col gap-3">
            {crossSellOffers.map((offer, i) => (
              <button key={i} className="w-full group p-4 rounded-2xl border border-slate-100 bg-white hover:border-[#EE1B24] transition-all text-left flex items-center gap-4 shadow-sm hover:shadow-md">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", offer.bg, offer.color)}>
                  <offer.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 group-hover:text-[#EE1B24] transition-colors truncate">{offer.title}</p>
                  <p className="text-[11px] text-slate-500 leading-tight line-clamp-1">{offer.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#EE1B24] group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3 pt-4">
          <Button 
            className="w-full h-14 rounded-full bg-[#EE1B24] hover:bg-[#D61820] text-white font-black uppercase tracking-widest shadow-lg shadow-[#EE1B24]/20 active:scale-[0.98] flex items-center justify-center gap-2 text-[11px] sm:text-sm"
            onClick={() => window.location.href = "/"}
          >
            Apply for Other Loans <ArrowRight className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline"
            className="w-full h-12 rounded-full border-2 border-slate-100 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-50 text-[10px] sm:text-xs"
            onClick={() => window.location.href = "/"}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
