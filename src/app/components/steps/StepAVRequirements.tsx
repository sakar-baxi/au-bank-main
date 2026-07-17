"use client";

import React from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { FileText, MapPin, Camera, Info, Check } from "lucide-react";

export default function StepAVRequirements() {
  const { nextStep } = useJourney();

  const requirements = [
    { icon: FileText, title: "Valid ID", desc: "PAN, Passport, Driving License, or Voter ID", color: "bg-red-50 text-red-500" },
    { icon: MapPin, title: "Address Proof", desc: "Aadhaar, Utility Bill, Rent Agreement (last 3 months)", color: "bg-blue-50 text-blue-500" },
    { icon: Camera, title: "Camera & Light", desc: "Ensure good lighting and stable internet connection", color: "bg-emerald-50 text-emerald-500" },
  ];

  return (
    <StepCard maxWidth="xl">
      <div className="space-y-8 py-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">What you need for verification</h1>
        </div>

        <div className="space-y-4">
          {requirements.map((req, i) => (
            <div key={i} className="flex items-start gap-5 p-6 rounded-[2rem] border border-slate-100 bg-[#F9FAFB] hover:bg-white hover:border-slate-200 transition-all">
              <div className={`w-12 h-12 rounded-2xl ${req.color} flex items-center justify-center shrink-0 shadow-sm`}>
                <req.icon className="w-6 h-6" />
              </div>
              <div className="pt-1">
                <p className="font-bold text-slate-900">{req.title}</p>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{req.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-medium pt-1">
            <span className="font-bold text-slate-700">Important:</span> Upload clear photos of original documents. Blurry or dark images can fail verification.
          </p>
        </div>

        <div className="pt-4">
          <Button 
            onClick={nextStep}
            className="w-full h-14 rounded-2xl bg-[#EE1B24] hover:bg-[#D61820] text-white font-bold shadow-xl shadow-red-100 transition-all active:scale-[0.98]"
          >
            Ready to Proceed
          </Button>
          <p className="text-center mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            By continuing, you agree to share data with AU Bank.
          </p>
        </div>
      </div>
    </StepCard>
  );
}
