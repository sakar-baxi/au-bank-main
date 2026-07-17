"use client";

import React, { useState, useEffect } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { IndianRupee, Calendar, ArrowRight, Check, Calculator, Sparkles, Percent, Database, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StepMahindraLoanCustomization() {
  const { formData, nextStep, updateFormData } = useJourney();
  
  const [isFetching, setIsFetching] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState(1); // 1: HRMS/Bureau, 2: Compiling Offers

  const initialAmount = parseInt(formData.loanAmount || "1000000");
  const initialTenure = parseInt(formData.loanTenure || "36");
  
  const [loanAmount, setLoanAmount] = useState(initialAmount);
  const [loanTenure, setLoanTenure] = useState(initialTenure);
  const [isCalculated, setIsCalculated] = useState(false);

  const minAmount = 100000;
  const maxAmount = 1500000;
  const stepAmount = 50000;

  const tenureOptions = [12, 24, 36, 48, 60];
  const interestRate = 0.12;

  const calculateEMI = (amount: number, tenure: number) => {
    const monthlyRate = interestRate / 12;
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  };

  const currentEMI = calculateEMI(loanAmount, loanTenure);

  useEffect(() => {
    // Total duration ~4.5 seconds for the loader
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
      // Ensure data is prefilled if not already
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
  }, [loadingPhase, updateFormData, formData]);

  const handleProceed = () => {
    updateFormData({
      loanAmount: loanAmount.toString(),
      loanTenure: loanTenure.toString(),
      emi: currentEMI.toString(),
    });
    nextStep();
  };

  useEffect(() => {
    if (!isFetching) {
      setIsCalculated(true);
      const timer = setTimeout(() => setIsCalculated(false), 300);
      return () => clearTimeout(timer);
    }
  }, [loanAmount, loanTenure, isFetching]);

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
    <div className="w-full min-h-full flex flex-col bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl [.desktop-view_&]:max-w-5xl mx-auto bg-white sm:rounded-3xl sm:shadow-sm sm:border border-slate-200 sm:mt-10 overflow-hidden flex flex-col [.desktop-view_&]:flex-row flex-1 sm:flex-none"
      >
        {/* Left Side: Header & Controls */}
        <div className="flex-1 flex flex-col [.desktop-view_&]:w-1/2 [.desktop-view_&]:border-r border-slate-200 bg-white">
          <div className="bg-white px-5 pt-6 pb-3 [.desktop-view_&]:px-8 [.desktop-view_&]:pt-10 [.desktop-view_&]:pb-6 border-b border-slate-100 relative shrink-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 [.desktop-view_&]:px-3 [.desktop-view_&]:py-1 bg-[#EE1B24]/10 rounded-full mb-2 [.desktop-view_&]:mb-4">
              <Sparkles className="w-3.5 h-3.5 [.desktop-view_&]:w-4 [.desktop-view_&]:h-4 text-[#EE1B24]" />
              <span className="text-[9px] [.desktop-view_&]:text-[10px] font-bold uppercase tracking-widest text-[#EE1B24]">Personalized Offer</span>
            </div>
            <h1 className="text-xl sm:text-2xl [.desktop-view_&]:text-4xl font-black mb-1 [.desktop-view_&]:mb-3 text-slate-900 tracking-tight">Customize Loan</h1>
            <p className="text-xs [.desktop-view_&]:text-sm text-slate-500 font-medium">
              Adjust the slider to find your perfect plan.
            </p>
          </div>

          <div className="p-4 sm:p-6 [.desktop-view_&]:p-8 space-y-4 flex-1">
            <div className="space-y-4 [.desktop-view_&]:space-y-8">
              <div className="space-y-2 [.desktop-view_&]:space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5 [.desktop-view_&]:space-y-1">
                    <label className="text-[9px] [.desktop-view_&]:text-[11px] font-bold uppercase tracking-widest text-slate-500">Loan Amount</label>
                    <p className="text-2xl [.desktop-view_&]:text-4xl font-black text-slate-900">₹{loanAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] [.desktop-view_&]:text-[11px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 [.desktop-view_&]:px-3 [.desktop-view_&]:py-1.5 rounded">Limit: ₹15L</span>
                  </div>
                </div>
                
                <div className="relative pt-2 pb-1">
                  <input
                    type="range"
                    min={minAmount}
                    max={maxAmount}
                    step={stepAmount}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                    className="w-full h-1.5 [.desktop-view_&]:h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#EE1B24]"
                    style={{
                      background: `linear-gradient(to right, #EE1B24 0%, #EE1B24 ${( (loanAmount - minAmount) / (maxAmount - minAmount) ) * 100}%, #F1F5F9 ${( (loanAmount - minAmount) / (maxAmount - minAmount) ) * 100}%, #F1F5F9 100%)`
                    }}
                  />
                  <div className="flex justify-between mt-2 text-[9px] [.desktop-view_&]:text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    <span>₹1L</span>
                    <span>₹15L</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 [.desktop-view_&]:space-y-4">
                <label className="text-[9px] [.desktop-view_&]:text-[11px] font-bold uppercase tracking-widest text-slate-500">Repayment Period</label>
                <div className="grid grid-cols-5 gap-1.5 [.desktop-view_&]:gap-3">
                  {tenureOptions.map((months) => (
                    <button
                      key={months}
                      onClick={() => setLoanTenure(months)}
                      className={`h-10 [.desktop-view_&]:h-14 rounded-lg [.desktop-view_&]:rounded-xl border-2 font-black text-xs [.desktop-view_&]:text-sm transition-all flex flex-col items-center justify-center ${
                        loanTenure === months
                          ? "border-[#EE1B24] bg-[#EE1B24]/5 text-[#EE1B24]"
                          : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                      }`}
                    >
                      {months}
                      <span className="text-[7px] [.desktop-view_&]:text-[9px] uppercase tracking-tighter opacity-70">Mo</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Results & Action Area */}
        <div className="flex-1 p-4 sm:p-6 [.desktop-view_&]:p-8 flex flex-col [.desktop-view_&]:w-1/2 bg-slate-50 [.desktop-view_&]:bg-white justify-between border-t [.desktop-view_&]:border-t-0 border-slate-100">
          <div className="bg-slate-50 rounded-xl [.desktop-view_&]:rounded-2xl p-4 [.desktop-view_&]:p-6 border border-slate-200 [.desktop-view_&]:shadow-sm">
            <div className="flex items-center gap-2 mb-2 [.desktop-view_&]:mb-4">
              <Calculator size={12} className="text-slate-400 [.desktop-view_&]:w-5 [.desktop-view_&]:h-5" />
              <h3 className="text-[10px] [.desktop-view_&]:text-xs font-bold uppercase tracking-widest text-slate-600">Plan Summary</h3>
            </div>

            <div className="flex justify-between items-center py-1 [.desktop-view_&]:py-3 border-b border-slate-200">
              <span className="text-[10px] [.desktop-view_&]:text-xs font-bold text-slate-500">Interest Rate</span>
              <span className="text-xs [.desktop-view_&]:text-sm font-black text-slate-900">12% p.a.</span>
            </div>

            <div className="pt-2 [.desktop-view_&]:pt-4">
              <p className="text-[9px] [.desktop-view_&]:text-xs font-bold uppercase tracking-widest text-slate-500 mb-0.5 [.desktop-view_&]:mb-2">Monthly EMI</p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentEMI}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl sm:text-3xl [.desktop-view_&]:text-5xl font-black text-[#EE1B24]"
                >
                  ₹{currentEMI.toLocaleString()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="pt-4 [.desktop-view_&]:pt-12">
            <button
              onClick={handleProceed}
              className="w-full h-12 [.desktop-view_&]:h-16 bg-[#EE1B24] hover:bg-[#D61820] text-white font-black uppercase tracking-widest rounded-xl [.desktop-view_&]:rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#EE1B24]/20 active:scale-[0.98] [.desktop-view_&]:text-lg"
            >
              Confirm Plan
              <ArrowRight className="w-4 h-4 [.desktop-view_&]:w-5 [.desktop-view_&]:h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
