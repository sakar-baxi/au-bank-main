"use client";

import React from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { Camera, Home, Info, Sparkles, MapPin, Building, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StepAVCapturePhoto() {
  const { formData, nextStep } = useJourney();
  const [photoStep, setPhotoStep] = React.useState(0);

  const isOffice = formData.addressType === "Office";

  const steps = [
    {
      title: isOffice ? "Capture Office Exterior" : "Capture Exterior",
      subtitle: isOffice 
        ? "Take a photo of your office building from outside including the main entrance or signage."
        : "Take a photo of your house/building from outside including the front gate to verify exterior layout.",
      icon: Home
    },
    {
      title: isOffice ? "Capture Office Interior" : "Capture Interior",
      subtitle: isOffice
        ? "Take a photo of your workspace or office reception area to verify employment occupancy."
        : "Take a photo of your living room or entrance area from inside to verify residential occupancy.",
      icon: Building
    },
    {
      title: "Capture Landmark",
      subtitle: "Take a photo of a nearby landmark or street sign to confirm your physical location.",
      icon: MapPin
    }
  ];

  const current = steps[photoStep] || steps[0];
  const Icon = current.icon;

  const handleCapture = () => {
    if (photoStep < steps.length - 1) {
      setPhotoStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      nextStep();
    }
  };

  return (
    <StepCard maxWidth="xl">
      <div className="flex flex-col items-center text-center space-y-8 py-4">
        {/* Progress Dots */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div key={i} className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              i === photoStep ? "w-6 bg-[#EE1B24]" : "bg-slate-200"
            )} />
          ))}
        </div>

        <div className="w-24 h-24 rounded-[2.5rem] bg-red-50 flex items-center justify-center border-4 border-white shadow-xl shadow-red-100/50">
          <Icon className="w-12 h-12 text-[#EE1B24]" />
        </div>

        <div className="space-y-2 px-4">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{current.title}</h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            {current.subtitle}
          </p>
        </div>

        <div className="w-full text-left bg-[#F9FAFB] rounded-[2rem] border border-slate-100 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#EE1B24]" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Photo Guidelines ({photoStep + 1}/{steps.length})</p>
          </div>
          <ul className="space-y-3">
            {[
              "Ensure good lightning",
              "Keep the camera steady",
              "Make sure text is clearly readable"
            ].map((guideline, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-200 shrink-0" />
                <span className="text-xs font-medium text-slate-600">{guideline}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full pt-4">
          <Button 
            onClick={handleCapture}
            className="w-full h-14 rounded-2xl bg-[#EE1B24] hover:bg-[#D61820] text-white font-bold shadow-xl shadow-red-100 transition-all active:scale-[0.98]"
          >
            <Camera className="w-5 h-5 mr-2" /> 
            {photoStep < steps.length - 1 ? "Capture & Next" : "Complete Photo Capture"}
          </Button>
          <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Step {photoStep + 1} of {steps.length}
          </p>
        </div>
      </div>
    </StepCard>
  );
}
