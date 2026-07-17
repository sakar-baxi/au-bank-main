"use client";

import React, { useState } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { Info, Building2, CheckCircle2, ArrowRight, ExternalLink, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StepPLDisbursalAccount() {
  const { nextStep } = useJourney();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <StepCard maxWidth="xl">
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          <Info className="w-3.5 h-3.5" /> Disbursal Account
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Where should we send the funds?</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Your AU Bank Salary Account is pre-verified for instant disbursal within minutes.
          </p>
        </div>

        <div className="p-6 rounded-[2rem] border-2 border-[#EE1B24] bg-red-50/30 relative overflow-hidden group shadow-lg shadow-red-100/20">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-red-100 shadow-sm transition-transform group-hover:scale-105">
              <Building2 className="w-9 h-9 text-[#EE1B24]/40" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] text-[#EE1B24] font-bold uppercase tracking-widest bg-white px-2 py-0.5 rounded-full border border-red-100">
                  Pre-Verified
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <p className="font-bold text-slate-900 text-lg truncate">AU Bank Salary Account</p>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-0.5">Account No.</span>
                  <p className="text-xs font-bold text-slate-700 font-mono">XXXX XXXX 1234</p>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-0.5">IFSC Code</span>
                  <p className="text-xs font-bold text-slate-700 uppercase font-mono">MAHF0000001</p>
                </div>
              </div>
            </div>
            <div className="shrink-0 bg-[#EE1B24] p-1.5 rounded-full shadow-lg shadow-red-200">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
          
          {/* Decorative watermark */}
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12 pointer-events-none">
            <Building2 className="w-32 h-32 text-[#EE1B24]" />
          </div>
        </div>

        <div className="pt-2">
          <Button 
            onClick={nextStep} 
            className="w-full bg-[#111827] hover:bg-[#1f2937] text-white h-14 text-lg font-bold rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-slate-200"
          >
            Use this account for disbursal
          </Button>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full mt-6 py-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-[0.15em] hover:text-[#EE1B24] transition-colors group"
          >
            <div className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-[#EE1B24]">
              <Plus className="w-3 h-3" />
            </div>
            Add a different bank account
          </button>
        </div>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-8 bg-[#111827] text-white">
            <DialogTitle className="text-2xl font-bold">Add Bank Account</DialogTitle>
            <DialogDescription className="text-slate-400">
              Funds will be sent to this account after verification.
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Account Number</Label>
              <Input placeholder="Enter your account number" className="h-12 rounded-xl border-slate-200 focus:ring-[#EE1B24] focus:border-[#EE1B24]" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">IFSC Code</Label>
              <Input placeholder="Enter 11-digit IFSC" className="h-12 rounded-xl border-slate-200 focus:ring-[#EE1B24] focus:border-[#EE1B24]" />
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#EE1B24] mt-0.5" />
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Note: Verification may take up to 24 hours for non-AU Bank accounts.
              </p>
            </div>
          </div>
          <DialogFooter className="p-8 pt-0">
            <Button className="w-full h-12 bg-[#EE1B24] hover:bg-[#D61820] text-white font-bold rounded-xl shadow-lg shadow-red-100">
              Verify & Add Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StepCard>
  );
}
