"use client";

import React, { useEffect, useState } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Building2, Briefcase, IndianRupee, CheckCircle, ArrowRight, TrendingUp, Database, ShieldCheck, User, Landmark, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StepMahindraHRMS() {
  const { nextStep, formData, updateFormData } = useJourney();
  const [isFetching, setIsFetching] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState(1); // 1: HRMS/Bureau, 2: Compiling Offers

  useEffect(() => {
    // Total duration ~4-5 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 2;
        if (next >= 50 && loadingPhase === 1) {
          setLoadingPhase(2);
        }
        return next;
      });
    }, 80);

    const timer = setTimeout(() => {
      updateFormData({
        employeeId: formData.employeeId || "EMP001234",
        companyName: formData.companyName || "Mahindra & Mahindra Ltd",
        department: formData.department || "Engineering",
        monthlySalary: formData.monthlySalary || "₹85,000",
        annualIncome: formData.annualIncome || "₹10,20,000",
        salaryAccount: formData.salaryAccount || "XXXXXXXX1234",
      });
      setIsFetching(false);
    }, 4500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [loadingPhase, updateFormData, formData.employeeId, formData.companyName, formData.department, formData.monthlySalary, formData.annualIncome, formData.salaryAccount]);

  if (isFetching) {
    return (
      <div className="w-full min-h-full flex flex-col items-center justify-center p-6 bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="relative w-28 h-28 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="50"
                fill="none"
                stroke="#F1F5F9"
                strokeWidth="8"
              />
              <motion.circle
                cx="56"
                cy="56"
                r="50"
                fill="none"
                stroke="#EE1B24"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 314" }}
                animate={{ strokeDasharray: `${(progress / 100) * 314} 314` }}
                transition={{ duration: 0.1 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {loadingPhase === 1 ? (
                  <motion.div
                    key="phase1"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                  >
                    <Database className="w-10 h-10 text-[#EE1B24]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="phase2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                  >
                    <Sparkles className="w-10 h-10 text-[#EE1B24]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="min-h-[80px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {loadingPhase === 1 ? (
                <motion.div
                  key="text1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Verifying Employment</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                    Pulling data from HRMS &<br/>running a Bureau check
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="text2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Personalizing Offer</h2>
                  <p className="text-xs text-[#EE1B24] font-black uppercase tracking-widest leading-relaxed">
                    Compiling best offers for you
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-10 space-y-3">
             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">
                <span>Progress</span>
                <span className="text-slate-900">{progress}%</span>
             </div>
             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                <motion.div 
                   className="h-full bg-slate-900 rounded-full"
                   animate={{ width: `${progress}%` }}
                />
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full flex flex-col bg-slate-50 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl [.desktop-view_&]:max-w-5xl mx-auto bg-white sm:rounded-[2.5rem] sm:shadow-xl sm:shadow-slate-200/50 sm:border border-slate-100 sm:mt-10 overflow-hidden flex flex-col [.desktop-view_&]:flex-row flex-1 sm:flex-none"
      >
        {/* Left Side: Header & Job Details */}
        <div className="flex-1 flex flex-col [.desktop-view_&]:w-1/2 [.desktop-view_&]:border-r border-slate-100 bg-white">
          <div className="bg-white px-6 pt-8 pb-4 [.desktop-view_&]:px-10 [.desktop-view_&]:pt-12 [.desktop-view_&]:pb-8 border-b border-slate-50 shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full mb-4 border border-emerald-100">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Sync Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl [.desktop-view_&]:text-4xl font-black mb-2 text-slate-900 tracking-tight leading-tight">Employment Profile</h1>
            <p className="text-sm text-slate-500 font-medium">
              Details verified via HRMS. This pre-approves your loan application.
            </p>
          </div>

          <div className="p-6 [.desktop-view_&]:p-10 space-y-6 flex-1">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">Job Details</h2>
              </div>

              <div className="grid gap-3">
                {[
                  { label: "SAP Code", value: formData.employeeId, icon: <User size={14} /> },
                  { label: "Company", value: formData.companyName, icon: <Building2 size={14} /> },
                  { label: "Department", value: formData.department, icon: <Database size={14} /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-slate-200 transition-all">
                    <div className="flex items-center gap-3 text-slate-500">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#EE1B24] transition-colors">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Income Overview & Action Area */}
        <div className="flex-1 p-6 [.desktop-view_&]:p-10 flex flex-col [.desktop-view_&]:w-1/2 bg-white justify-between border-t [.desktop-view_&]:border-t-0 border-slate-50">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <IndianRupee className="w-5 h-5 text-slate-600" />
              </div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">Income Overview</h2>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#EE1B24] rounded-full -mr-16 -mt-16 blur-[60px] opacity-20" />
              
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Monthly Salary</p>
                    <p className="text-3xl font-black tracking-tight">{formData.monthlySalary}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                    <TrendingUp className="text-emerald-400" size={20} />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-white/10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Salary Account</p>
                    <p className="text-sm font-bold font-mono tracking-wider">{formData.salaryAccount}</p>
                  </div>
                  <Landmark className="text-white/30" size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10">
            <button
              onClick={nextStep}
              className="w-full h-16 bg-[#EE1B24] hover:bg-[#D61820] text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#EE1B24]/20 active:scale-[0.98] text-sm"
            >
              Continue to Offer
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Secured with 256-bit encryption
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
