"use client";

import React from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { ArrowRight, Smartphone, HelpCircle, User, Globe, ShieldCheck, Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { SbiSidebarSymbol } from "@/app/components/branding/SbiOfficialLogo";

export default function StepMahindraLanding() {
  const { nextStep } = useJourney();

  return (
    <div className="w-full bg-slate-50 font-sans overflow-x-hidden min-h-full flex flex-col">
      {/* Top Header - Hidden on small mobile to save space */}
      <div className="hidden sm:flex w-full bg-white text-slate-600 py-2 px-4 md:px-6 justify-end items-center gap-6 text-xs font-medium border-b border-slate-200">
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#EE1B24] transition-colors">
          <Smartphone size={14} />
          Download App
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#EE1B24] transition-colors">
          <HelpCircle size={14} />
          Grievance & Support
        </div>
      </div>

      {/* Main Navigation */}
      <header className="w-full bg-white text-slate-900 py-3 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SbiSidebarSymbol boxClassName="h-9 w-9 md:h-10 md:w-10" priority />
          <span className="font-bold text-slate-900 text-base md:text-lg tracking-tight">AU Bank</span>
        </div>

        <button 
          onClick={nextStep}
          className="flex items-center gap-2 bg-[#EE1B24] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-[#D61820] transition-all shadow-md"
        >
          <User size={16} />
          <span className="hidden sm:inline">Employee Login</span>
          <span className="inline sm:hidden">Login</span>
        </button>
      </header>

      {/* Hero Section - Optimized to fit screen height */}
      <section className="relative w-full flex-1 flex flex-col lg:flex-row items-center overflow-hidden bg-white">
        {/* Mobile/App Hero Image - Top aligned on mobile, right aligned on desktop */}
        <div className="w-full lg:w-[55%] h-[40vh] lg:h-full relative order-1 lg:order-2">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=2000" 
            alt="Professional reviewing finances" 
            className="w-full h-full object-cover object-top lg:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent lg:hidden" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent hidden lg:block" />
        </div>

        {/* Content - Bottom aligned on mobile, left aligned on desktop */}
        <div className="relative z-20 w-full lg:w-[45%] px-6 sm:px-10 lg:px-16 flex flex-col justify-center order-2 lg:order-1 -mt-10 lg:mt-0 lg:h-full pb-8 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/90 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none p-6 lg:p-0 rounded-3xl shadow-xl lg:shadow-none border border-slate-100 lg:border-none relative z-30"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EE1B24]/10 rounded-full mb-3 md:mb-5">
              <span className="w-2 h-2 rounded-full bg-[#EE1B24] animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#EE1B24]">Exclusive Employee Offer</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.1] mb-3 text-slate-900 tracking-tight">
              Instant Personal Loans <br />
              <span className="text-[#EE1B24]">Made Simple</span>
            </h1>
            
            <p className="text-sm md:text-base text-slate-600 font-medium mb-6 max-w-md leading-relaxed">
              Achieve your dreams with pre-approved offers, zero paperwork, and instant disbursal directly to your salary account.
            </p>
            
            <button 
              onClick={nextStep}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#EE1B24] text-white px-8 py-4 rounded-xl text-sm md:text-base font-black uppercase tracking-widest hover:bg-[#D61820] transition-all shadow-lg shadow-[#EE1B24]/30 active:scale-[0.98]"
            >
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </button>
            
            {/* Quick Badges below button to save space instead of a full section */}
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-100 hidden sm:flex">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock size={16} className="text-[#EE1B24]" />
                <span className="text-xs font-bold uppercase tracking-widest">Instant</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <FileText size={16} className="text-[#EE1B24]" />
                <span className="text-xs font-bold uppercase tracking-widest">No Paperwork</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
