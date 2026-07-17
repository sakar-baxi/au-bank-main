"use client";

import React from "react";
import { Bot, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function JourneyTypeBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
      {label}
    </span>
  );
}

export function AgentBanner({
  children,
  variant = "info",
  className,
}: {
  children: React.ReactNode;
  variant?: "info" | "success";
  className?: string;
}) {
  const isSuccess = variant === "success";
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl px-4 py-3 text-sm leading-relaxed",
        isSuccess
          ? "bg-emerald-50 border border-emerald-100 text-emerald-900"
          : "bg-[color-mix(in_srgb,var(--primary-bank)_10%,white)] border border-[color-mix(in_srgb,var(--primary-bank)_22%,white)] text-slate-800",
        className
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
          isSuccess ? "bg-emerald-100 text-emerald-700" : "text-white"
        )}
        style={!isSuccess ? { backgroundColor: "var(--primary-bank, #42265e)" } : undefined}
      >
        {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <p className="pt-1 font-medium">{children}</p>
    </div>
  );
}
