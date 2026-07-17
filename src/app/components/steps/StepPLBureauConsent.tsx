"use client";

import React, { useState } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import StepCard from "@/app/components/layout/StepCard";
import { Info, ShieldCheck, Lock } from "lucide-react";
import LegalConsent from "@/app/components/shared/LegalConsent";

// Standard legal text content
const TNC_CONTENT = `VISITORS TO THIS WEB SITE ARE BOUND BY THE FOLLOWING TERMS AND CONDITIONS. (‘TERMS’) PLEASE READ THIS DOCUMENT CAREFULLY BEFORE CONTINUING TO USE THIS SITE. 

Disclaimer of Warranties, Inaccuracies or Errors
Although AU Bank tries to ensure that all information and recommendations provided as part of this website is correct at the time of its inclusion on the web site, AU Bank does not guarantee the accuracy of the Information. AU Bank makes no representations or warranties as to the completeness or accuracy of the Information.

Privacy Policy
Personal details provided to AU Bank through this web site will only be used in accordance with our privacy policy. Please read this carefully before going on. By providing your personal details to us you are consenting to its use in accordance with our privacy policy.

Applicable Law and Jurisdiction
These terms and conditions are governed by and to be interpreted in accordance with laws of India. You agree, in the event of any dispute arising in relation to these terms and conditions or any dispute arising in relation to the web site whether in contract or tort or otherwise, to submit to the jurisdiction of the courts located at Mumbai, India.`;

const PRIVACY_CONTENT = `Objective:
AU Bank may collect and store information about you when you visit our site, use our services, or view our online advertisements. 

Collected Information:
AU Bank may collect personal information that you submit to us through the Services, which include: Name, Home address, Email address, Telephone number, Date of birth, Job position, Occupation, Company.

Use of collected Personal Information:
AU Bank may use the personal information that is collected from you to provide requested products and services and for our internal business purposes, including responding to your requests for unique products and services.

Personal Information Protection:
AU Bank use commercially reasonable security measures (including physical, electronic and procedural measures) to help safeguard personal information against loss, misuse, damage or modification and unauthorized access or disclosure.`;

export default function StepPLBureauConsent() {
  const { nextStep } = useJourney();
  const [agreedTnc, setAgreedTnc] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  return (
    <StepCard maxWidth="xl">
      <div className="space-y-8">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
            <ShieldCheck className="w-8 h-8 text-[#EE1B24]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Credit Bureau Consent</h1>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              To provide you with the best loan offers, we need to fetch your credit profile from authorized bureaus.
            </p>
          </div>
        </div>

        <div className="grid gap-4 bg-slate-50/80 p-6 rounded-[2rem] border border-slate-100">
          <div className="flex justify-between items-center py-1">
            <span className="text-sm text-slate-500 font-medium">Purpose</span>
            <span className="text-sm font-bold text-slate-900">Eligibility & Pricing</span>
          </div>
          <div className="h-px bg-slate-200/50 w-full" />
          <div className="flex justify-between items-center py-1">
            <span className="text-sm text-slate-500 font-medium">Impact on Score</span>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-900 block">No Impact Now</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Soft pull for eligibility</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-100 pt-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Mandatory Consents</p>
          
          <LegalConsent
            id="tnc"
            label="I agree to the AU Bank Loan Terms and Conditions"
            checked={agreedTnc}
            onCheckedChange={setAgreedTnc}
            title="Terms and Conditions"
            content={TNC_CONTENT}
          />

          <LegalConsent
            id="privacy"
            label="I acknowledge the AU Bank Privacy Policy"
            checked={agreedPrivacy}
            onCheckedChange={setAgreedPrivacy}
            title="Privacy Policy"
            content={PRIVACY_CONTENT}
          />
        </div>

        <div className="pt-2">
          <Button 
            onClick={nextStep} 
            disabled={!agreedTnc || !agreedPrivacy}
            className="w-full bg-[#EE1B24] hover:bg-[#D61820] text-white h-14 text-lg font-bold rounded-2xl shadow-xl shadow-red-100 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            I Consent & Continue
          </Button>
          
          <div className="flex items-center justify-center gap-2 mt-6">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-bold">
              Secure 256-bit SSL Encrypted Connection
            </p>
          </div>
        </div>
      </div>
    </StepCard>
  );
}
