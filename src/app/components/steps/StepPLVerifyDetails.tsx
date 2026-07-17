"use client";

import React from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, ArrowRight, Check, Globe, Briefcase, PenTool } from "lucide-react";
import { motion } from "framer-motion";

export default function StepPLVerifyDetails() {
  const { formData, nextStep, updateFormData } = useJourney();

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="w-full min-h-full flex flex-col bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl [.desktop-view_&]:max-w-5xl mx-auto bg-white sm:rounded-3xl sm:shadow-sm sm:border border-slate-200 sm:mt-10 overflow-hidden flex flex-col [.desktop-view_&]:flex-row flex-1 sm:flex-none"
      >
        {/* Left Side: Mobile Header / Desktop Image */}
        <div className="bg-slate-50 p-4 sm:p-6 [.desktop-view_&]:p-10 border-b [.desktop-view_&]:border-b-0 [.desktop-view_&]:border-r border-slate-200 flex flex-col items-center text-center shrink-0 [.desktop-view_&]:w-1/2 [.desktop-view_&]:justify-center relative">
          <div className="hidden [.desktop-view_&]:block w-full h-full absolute inset-0">
             <img 
               src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000" 
               alt="Verify Details" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
             <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
               <PenTool className="w-8 h-8 text-[#EE1B24]" />
             </div>
          </div>
          
          <div className="relative z-10 [.desktop-view_&]:mt-auto [.desktop-view_&]:mb-8 [.desktop-view_&]:text-white flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 [.desktop-view_&]:px-3 [.desktop-view_&]:py-1 bg-[#EE1B24]/10 [.desktop-view_&]:bg-white/20 [.desktop-view_&]:backdrop-blur-sm rounded-full mb-2 [.desktop-view_&]:mb-4">
              <PenTool className="w-3.5 h-3.5 [.desktop-view_&]:hidden text-[#EE1B24]" />
              <span className="text-[9px] [.desktop-view_&]:text-[10px] font-bold uppercase tracking-widest text-[#EE1B24] [.desktop-view_&]:text-white">Information Review</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl [.desktop-view_&]:text-4xl font-black mb-1 [.desktop-view_&]:mb-3 text-slate-900 [.desktop-view_&]:text-white tracking-tight">Final Details</h1>
            <p className="text-xs [.desktop-view_&]:text-sm text-slate-500 [.desktop-view_&]:text-white/80 font-medium">
              Verify your contact and identity details.
            </p>
          </div>
        </div>

        {/* Right Side: Form & Action Area */}
        <div className="flex-1 p-4 sm:p-6 [.desktop-view_&]:p-10 flex flex-col [.desktop-view_&]:w-1/2 bg-white justify-between">
          <div className="space-y-4 [.desktop-view_&]:space-y-8">
            
            {/* Identity Section */}
            <section className="space-y-2 [.desktop-view_&]:space-y-4">
              <div className="flex items-center gap-1.5 [.desktop-view_&]:gap-2 px-1">
                <User className="text-slate-400 [.desktop-view_&]:w-5 [.desktop-view_&]:h-5" size={14} />
                <h2 className="text-[10px] [.desktop-view_&]:text-xs font-bold text-slate-900 uppercase tracking-widest">Identity Details</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-2 [.desktop-view_&]:gap-4">
                <div className="space-y-1 [.desktop-view_&]:space-y-2">
                  <Label className="text-[8px] [.desktop-view_&]:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</Label>
                  <Input 
                    defaultValue={formData.firstName || "Rahul"}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="h-10 [.desktop-view_&]:h-14 bg-slate-50 border-slate-200 rounded-lg [.desktop-view_&]:rounded-xl focus:bg-white focus:ring-2 focus:ring-[#EE1B24]/20 focus:border-[#EE1B24] transition-all font-bold text-slate-800 text-xs [.desktop-view_&]:text-base"
                  />
                </div>
                <div className="space-y-1 [.desktop-view_&]:space-y-2">
                  <Label className="text-[8px] [.desktop-view_&]:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</Label>
                  <Input 
                    defaultValue={formData.lastName || "Sharma"}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="h-10 [.desktop-view_&]:h-14 bg-slate-50 border-slate-200 rounded-lg [.desktop-view_&]:rounded-xl focus:bg-white focus:ring-2 focus:ring-[#EE1B24]/20 focus:border-[#EE1B24] transition-all font-bold text-slate-800 text-xs [.desktop-view_&]:text-base"
                  />
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="space-y-2 [.desktop-view_&]:space-y-4">
              <div className="flex items-center gap-1.5 [.desktop-view_&]:gap-2 px-1">
                <Globe className="text-slate-400 [.desktop-view_&]:w-5 [.desktop-view_&]:h-5" size={14} />
                <h2 className="text-[10px] [.desktop-view_&]:text-xs font-bold text-slate-900 uppercase tracking-widest">Contact & Location</h2>
              </div>

              <div className="space-y-2 [.desktop-view_&]:space-y-4">
                <div className="space-y-1 [.desktop-view_&]:space-y-2">
                  <Label className="text-[8px] [.desktop-view_&]:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</Label>
                  <Input 
                    defaultValue={formData.email || "rahul.sharma@techcorp.in"}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-10 [.desktop-view_&]:h-14 bg-slate-50 border-slate-200 rounded-lg [.desktop-view_&]:rounded-xl focus:bg-white focus:ring-2 focus:ring-[#EE1B24]/20 focus:border-[#EE1B24] transition-all font-bold text-slate-800 text-xs [.desktop-view_&]:text-base"
                  />
                </div>
                <div className="space-y-1 [.desktop-view_&]:space-y-2">
                  <Label className="text-[8px] [.desktop-view_&]:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">State</Label>
                  <Select defaultValue={formData.state || "delhi"} onValueChange={(val) => handleInputChange("state", val)}>
                    <SelectTrigger className="h-10 [.desktop-view_&]:h-14 bg-slate-50 border-slate-200 rounded-lg [.desktop-view_&]:rounded-xl focus:bg-white focus:ring-2 focus:ring-[#EE1B24]/20 focus:border-[#EE1B24] transition-all font-bold text-slate-800 text-xs [.desktop-view_&]:text-base">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delhi">Delhi (NCR)</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>
          </div>

          {/* Side Action Panel / Footer */}
          <div className="pt-4 [.desktop-view_&]:pt-12 space-y-3 [.desktop-view_&]:space-y-6">
             <div className="bg-slate-50 [.desktop-view_&]:bg-slate-50/50 rounded-lg [.desktop-view_&]:rounded-xl p-2.5 [.desktop-view_&]:p-5 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 [.desktop-view_&]:gap-3">
                   <div className="w-4 h-4 [.desktop-view_&]:w-6 [.desktop-view_&]:h-6 rounded [.desktop-view_&]:rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
                      <Check size={10} className="text-emerald-600 stroke-[3] [.desktop-view_&]:w-3.5 [.desktop-view_&]:h-3.5" />
                   </div>
                   <p className="text-[8px] [.desktop-view_&]:text-[10px] font-bold text-slate-600 uppercase tracking-widest">Data Verified & Synced</p>
                </div>
             </div>

             <button
               onClick={nextStep}
               className="w-full h-12 [.desktop-view_&]:h-16 bg-[#EE1B24] hover:bg-[#D61820] text-white font-black uppercase tracking-widest rounded-lg [.desktop-view_&]:rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#EE1B24]/20 active:scale-[0.98] [.desktop-view_&]:text-lg"
             >
               Submit Journey
               <ArrowRight className="w-4 h-4 [.desktop-view_&]:w-5 [.desktop-view_&]:h-5" />
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
