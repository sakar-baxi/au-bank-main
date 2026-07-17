"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, ExternalLink, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface LegalConsentProps {
  id: string;
  label: React.ReactNode | string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  title: string;
  content: string;
}

export default function LegalConsent({
  id,
  label,
  checked,
  onCheckedChange,
  title,
  content,
}: LegalConsentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-start space-x-3 group py-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(val) => onCheckedChange(!!val)}
          className="mt-1 h-5 w-5 rounded-md border-2 border-[#EE1B24]/20 data-[state=checked]:bg-[#EE1B24] data-[state=checked]:border-[#EE1B24] transition-all duration-300"
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor={id}
            className="text-sm font-medium text-slate-700 cursor-pointer select-none"
          >
            {label}
          </Label>
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="text-[10px] font-bold text-[#EE1B24] uppercase tracking-widest hover:underline text-left flex items-center gap-1"
          >
            Read Document <ExternalLink className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
          <DialogHeader className="p-8 bg-[#111827] text-white shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-6 h-6 text-[#EE1B24]" />
              <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            </div>
            <DialogDescription className="text-slate-400 font-medium">
              Please review the document carefully.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-8 prose prose-slate max-w-none prose-sm prose-headings:text-[#111827] prose-strong:text-[#111827] prose-p:text-slate-600 prose-p:leading-relaxed">
            <div className="whitespace-pre-wrap font-sans text-sm">
              {content}
            </div>
          </div>

          <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
            <Button 
              onClick={() => {
                onCheckedChange(true);
                setIsDialogOpen(false);
              }}
              className="w-full bg-[#EE1B24] hover:bg-[#D61820] text-white h-12 font-bold rounded-xl"
            >
              I Accept & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
