"use client";

import React from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StepAVResidentialInfo() {
  const { formData, nextStep } = useJourney();

  return (
    <StepCard maxWidth="xl">
      <div className="space-y-8 py-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {formData.addressType === "Office" ? "Office Address Information" : "Residential Information"}
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Note: All are mandatory</p>
        </div>

        <div className="space-y-5">
           <div className="space-y-2">
             <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {formData.addressType === "Office" ? "Office Landmark" : "Residential Landmark"}
             </Label>
             <Input placeholder={formData.addressType === "Office" ? "e.g. Near Trade Center" : "e.g. Near City Mall"} className="h-12 bg-[#F9FAFB] border-slate-100 rounded-xl" />
           </div>

           <div className="space-y-2">
             <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
               {formData.addressType === "Office" ? "Office Occupancy Status" : "Residence Status"}
             </Label>
             <Select>
               <SelectTrigger className="h-12 bg-[#F9FAFB] border-slate-100 rounded-xl">
                 <SelectValue placeholder="Select status" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="rented">Rented</SelectItem>
                 <SelectItem value="owned">Owned</SelectItem>
                 <SelectItem value="company">Company Provided</SelectItem>
               </SelectContent>
             </Select>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {formData.addressType === "Office" ? "Years at Office" : "Years of Residence"}
                </Label>
                <Input placeholder="Years" className="h-12 bg-[#F9FAFB] border-slate-100 rounded-xl" />
              </div>
              <div className="space-y-2 pt-6">
                <Input placeholder="Months" className="h-12 bg-[#F9FAFB] border-slate-100 rounded-xl" />
              </div>
           </div>

           <div className="space-y-2">
             <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
               {formData.addressType === "Office" ? "Type of Office" : "Type of Residence"}
             </Label>
             <Select>
               <SelectTrigger className="h-12 bg-[#F9FAFB] border-slate-100 rounded-xl">
                 <SelectValue placeholder="Select type" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="apartment">Apartment/Flat</SelectItem>
                 <SelectItem value="independent">Independent House</SelectItem>
                 <SelectItem value="villa">Villa</SelectItem>
               </SelectContent>
             </Select>
           </div>
        </div>

        <div className="pt-4">
          <Button 
            onClick={nextStep}
            className="w-full h-14 rounded-2xl bg-[#EE1B24] hover:bg-[#D61820] text-white font-bold shadow-xl shadow-red-100 transition-all active:scale-[0.98]"
          >
            Submit Information
          </Button>
        </div>
      </div>
    </StepCard>
  );
}
