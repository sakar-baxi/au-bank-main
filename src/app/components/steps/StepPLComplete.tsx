"use client";

import React from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Check, ArrowRight, ShieldCheck, Mail, Smartphone, Wallet, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function StepPLComplete() {
  const { formData, nextStep } = useJourney();

  return (
    <div className="w-full min-h-full flex flex-col bg-slate-50 pb-10">
      {/* Full Width Hero Header */}
      <div className="w-full bg-[#EE1B24] text-white pt-16 pb-20 px-6 sm:px-12 relative overflow-hidden">
         {/* Decorative Background Patterns */}
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/10 rounded-full -ml-20 -mb-20 blur-2xl" />
         <div className="absolute top-20 left-[20%] w-32 h-1 bg-white/20 rotate-[-20deg] blur-[1px]" />
         
         <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex-1 text-center md:text-left"
            >
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-[#EE1B24] shadow-xl shadow-black/10 mb-6">
                 <Check className="w-8 h-8 stroke-[3]" />
               </div>
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                 Application <br className="hidden md:block" /> Successfully Submitted!
               </h1>
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
                 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                 <span className="text-sm font-bold tracking-widest uppercase">Ref ID: PL06422058</span>
               </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full md:w-auto bg-white/10 p-6 rounded-3xl border border-white/20 backdrop-blur-sm shadow-xl flex flex-col sm:flex-row items-center gap-6"
            >
               <div className="text-center sm:text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Requested Amount</p>
                  <p className="text-3xl font-black tracking-tighter">₹{formData.loanAmount ? parseInt(formData.loanAmount).toLocaleString() : "10,00,000"}</p>
               </div>
               <div className="hidden sm:block w-px h-12 bg-white/20" />
               <div className="text-center sm:text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Tenure</p>
                  <p className="text-3xl font-black tracking-tighter">{formData.loanTenure || "36"} <span className="text-base font-bold text-white/60">Mo</span></p>
               </div>
            </motion.div>
         </div>
      </div>

      {/* Main Content Area - Wide & Informative */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 -mt-10 relative z-20 space-y-6">
         <div className="grid grid-cols-1 [.desktop-view_&]:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Status Card */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-200"
            >
               <div className="flex items-start gap-3 mb-5 sm:mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                     <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Current Status</p>
                     <h3 className="text-lg font-black text-slate-900 leading-tight">Pre-approved <br className="hidden sm:block"/><span className="text-emerald-600 sm:block inline mt-1"> Under Final Review</span></h3>
                  </div>
               </div>
               
               <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                     <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                     <p className="text-xs font-bold text-slate-600">Identity and KYC digitally verified via Aadhaar.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                     <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                     <p className="text-xs font-bold text-slate-600">Employment details confirmed with HRMS system.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                     <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                     </div>
                     <p className="text-xs font-bold text-slate-600">Final internal credit policy check in progress.</p>
                  </div>
               </div>
            </motion.div>

         </div>

         {/* Call to Action Footer */}
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 flex flex-col [.desktop-view_&]:flex-row items-center justify-between gap-4"
         >
            <div className="flex items-center gap-3 text-center [.desktop-view_&]:text-left">
               <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 hidden sm:flex">
                  <Mail className="w-5 h-5 text-blue-600" />
               </div>
               <div>
                  <p className="text-sm font-black text-slate-900">Need to update something?</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Our support team is available 24/7 to assist you.</p>
               </div>
            </div>

            <button
               onClick={nextStep}
               className="w-full md:w-auto h-12 px-6 bg-[#EE1B24] hover:bg-[#D61820] text-white font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#EE1B24]/20 active:scale-[0.98] text-xs [.desktop-view_&]:text-sm [.desktop-view_&]:h-14 [.desktop-view_&]:px-8"
            >
               Complete Digital Address Verification
               <ArrowRight className="w-4 h-4" />
            </button>
         </motion.div>
      </div>
    </div>
  );
}
