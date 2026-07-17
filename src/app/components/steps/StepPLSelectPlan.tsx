"use client";

import React, { useState, useEffect } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { CreditCard, PiggyBank, TrendingUp, Calendar, FileText, Sparkles, ChevronRight, Loader2 } from "lucide-react";

export default function StepPLSelectPlan() {
  const { nextStep, updateFormData } = useJourney();
  const [isComputing, setIsComputing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComputing(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const plans = [
    { amount: "₹5L", emi: "₹16,369/month", tenure: "36 months" },
    { amount: "₹10L", emi: "₹25,845/month", tenure: "48 months" },
    { amount: "₹15L", emi: "₹32,612/month", tenure: "60 months" },
  ];

  const handleSelectPlan = (plan: any) => {
    updateFormData({ selectedPlan: plan });
    nextStep();
  };

  if (isComputing) {
    return (
      <StepCard maxWidth="xl">
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-[#EE1B24] animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#EE1B24]" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-900">Computing Eligibility & Offers</h1>
            <p className="text-slate-500 mt-2">Please wait while we analyze your profile for the best rates.</p>
          </div>
        </div>
      </StepCard>
    );
  }

  return (
    <StepCard maxWidth="2xl" noPadding>
      <div className="bg-[#111827] text-white p-8 relative rounded-t-2xl">
        <div className="flex items-center gap-2 text-white/70 text-sm font-bold uppercase tracking-wider mb-2">
          <CreditCard className="w-4 h-4" /> Pre-Approved Personal Loan
        </div>
        <div className="text-4xl font-bold tracking-tight">₹15,00,000</div>
        <div className="absolute top-8 right-8">
          <Sparkles className="w-10 h-10 text-white/20" />
        </div>
      </div>

      <div className="p-4 bg-slate-50/80 grid grid-cols-1 md:grid-cols-2 gap-3 border-b border-slate-100">
        {[
          { label: "Loan Amount", value: "Up to ₹15L", icon: PiggyBank },
          { label: "Interest Rate", value: "10.99% p.a.", sub: "(indicative)", icon: TrendingUp },
          { label: "Tenure", value: "12–60 months", icon: Calendar },
          { label: "Processing Fee", value: "₹999", sub: "(Corporate offer)", icon: FileText },
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{item.label}</p>
              <p className="font-bold text-slate-900 text-base">{item.value} {item.sub && <span className="text-[10px] font-normal text-slate-400">{item.sub}</span>}</p>
            </div>
            <item.icon className="w-5 h-5 text-slate-300" />
          </div>
        ))}
      </div>

      <div className="p-8 space-y-6">
        <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-100 inline-flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Instant Disbursal Available</span>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Choose your loan plan:</p>
          <div className="grid gap-3">
            {plans.map((plan, i) => (
              <button 
                key={i} 
                onClick={() => handleSelectPlan(plan)} 
                className="w-full flex items-center justify-between p-5 rounded-2xl border border-slate-200 hover:border-[#EE1B24] hover:bg-red-50/30 transition-all text-left group active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-[#EE1B24]/10 transition-colors">
                    <FileText className="w-5 h-5 text-slate-500 group-hover:text-[#EE1B24]" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">{plan.amount}</p>
                    <p className="text-sm text-slate-500">for {plan.tenure}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-900 text-lg">{plan.emi}</span>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#EE1B24] transition-all group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </StepCard>
  );
}
