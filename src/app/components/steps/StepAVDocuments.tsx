"use client";

import React from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { FileText, MapPin, Camera, Info, Search, ArrowRight, UserCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StepAVAddressProof() {
  const { formData, nextStep } = useJourney();
  return (
    <StepCard maxWidth="xl">
      <div className="flex flex-col items-center text-center space-y-8 py-4">
        <div className="w-24 h-24 rounded-[2.5rem] bg-red-50 flex items-center justify-center border-4 border-white shadow-xl shadow-red-100/50">
          <MapPin className="w-12 h-12 text-[#EE1B24]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {formData.addressType === "Office" ? "Office Address Proof" : "Address Proof"}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Capture your {formData.addressType === "Office" ? "office" : ""} address proof document (Dated within last 3 months)
          </p>
        </div>
        <div className="w-full space-y-2 text-left">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Select Proof Type</p>
           <Select>
              <SelectTrigger className="h-14 bg-[#F9FAFB] border-slate-100 rounded-2xl">
                <SelectValue placeholder="Select proof type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                <SelectItem value="voter">Voter ID</SelectItem>
                <SelectItem value="utility">Electricity/Water Bill</SelectItem>
                <SelectItem value="rent">Rent Agreement</SelectItem>
                <SelectItem value="office_id">Office ID Card</SelectItem>
              </SelectContent>
           </Select>
        </div>
        <Button onClick={nextStep} className="w-full h-14 rounded-2xl bg-[#EE1B24]/40 hover:bg-[#EE1B24] text-white font-bold transition-all">
          Capture Address Proof
        </Button>
      </div>
    </StepCard>
  );
}

export function StepAVIdVerification() {
  const { nextStep } = useJourney();
  return (
    <StepCard maxWidth="xl">
      <div className="flex flex-col items-center text-center space-y-8 py-4">
        <div className="w-24 h-24 rounded-[2.5rem] bg-[#111827] flex items-center justify-center rotate-6 shadow-2xl">
          <FileText className="w-12 h-12 text-white -rotate-6" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ID Verification</h1>
          <p className="text-sm text-slate-500 font-medium">Please capture a clear photo of your government-issued ID</p>
        </div>
        <div className="w-full space-y-2 text-left">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Select ID Type</p>
           <Select>
              <SelectTrigger className="h-14 bg-[#F9FAFB] border-slate-100 rounded-2xl">
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pan">PAN Card</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="license">Driving License</SelectItem>
                <SelectItem value="office_id">Office ID Card</SelectItem>
              </SelectContent>
           </Select>
        </div>
        <Button onClick={nextStep} className="w-full h-14 rounded-2xl bg-[#EE1B24]/40 hover:bg-[#EE1B24] text-white font-bold transition-all">
          Capture ID Document
        </Button>
      </div>
    </StepCard>
  );
}

export function StepAVFaceVerification() {
  const { nextStep } = useJourney();
  return (
    <StepCard maxWidth="xl">
      <div className="flex flex-col items-center text-center space-y-8 py-4">
        <div className="w-24 h-24 rounded-[2.5rem] bg-red-50 flex items-center justify-center border-4 border-white shadow-xl shadow-red-100/50">
          <UserCheck className="w-12 h-12 text-[#EE1B24]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Face Verification</h1>
          <p className="text-sm text-slate-500 font-medium">Take a selfie to match with your ID document</p>
        </div>
        <div className="w-full text-left bg-[#F9FAFB] rounded-[2rem] border border-slate-100 p-6 space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guidelines</p>
          <ul className="space-y-2 text-xs text-slate-500 font-medium">
            <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#EE1B24]" /> Look directly at the camera</li>
            <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#EE1B24]" /> Remove glasses if possible</li>
            <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#EE1B24]" /> Ensure good lighting on face</li>
            <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#EE1B24]" /> Keep neutral expression</li>
          </ul>
        </div>
        <Button onClick={nextStep} className="w-full h-14 rounded-2xl bg-[#EE1B24] hover:bg-[#D61820] text-white font-bold shadow-xl shadow-red-100 transition-all active:scale-[0.98]">
          Capture Photo
        </Button>
      </div>
    </StepCard>
  );
}
