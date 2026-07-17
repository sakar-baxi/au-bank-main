"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bell, ChevronDown, Loader2, Mail, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RmNudgeEvent, RmNudgeMode } from "@/lib/hrmsSync";
import { formatRmNudgeDisplayDate, formatRmNudgeRelative } from "@/lib/hrmsSync";

const CHANNELS: { mode: RmNudgeMode; label: string; icon: React.ReactNode; hoverClass: string }[] = [
  {
    mode: "WhatsApp",
    label: "WhatsApp",
    icon: <MessageCircle className="w-4 h-4 text-emerald-600" />,
    hoverClass: "hover:bg-emerald-50",
  },
  {
    mode: "SMS",
    label: "SMS",
    icon: <Phone className="w-4 h-4 text-dashboard-primary" />,
    hoverClass: "hover:bg-[#E6F2FF]",
  },
  {
    mode: "Email",
    label: "Email",
    icon: <Mail className="w-4 h-4 text-slate-600" />,
    hoverClass: "hover:bg-slate-50",
  },
];

interface RmEmployeeNudgeMenuProps {
  lastNudge: RmNudgeEvent | null;
  sending: boolean;
  sendingMode: RmNudgeMode | null;
  onSend: (mode: RmNudgeMode) => void;
}

export default function RmEmployeeNudgeMenu({
  lastNudge,
  sending,
  sendingMode,
  onSend,
}: RmEmployeeNudgeMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = 260;
    const left = Math.min(window.innerWidth - width - 8, Math.max(8, rect.right - width));
    const top = rect.bottom + 6;
    setPanelPos({ top, left });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onScroll = () => updatePosition();
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open, updatePosition]);

  const panel =
    open &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        ref={panelRef}
        role="menu"
        className="z-[500] w-[min(100vw-1rem,260px)] rounded-xl border border-[#E5E7EB] bg-white shadow-xl py-1"
        style={{ position: "fixed", top: panelPos.top, left: panelPos.left }}
      >
        <div className="px-3 pt-2 pb-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Send nudge via</p>
        </div>
        <div className="px-1 pb-1 space-y-0.5">
          {CHANNELS.map(({ mode, label, icon, hoverClass }) => {
            const loading = sending && sendingMode === mode;
            return (
              <button
                key={mode}
                type="button"
                disabled={sending}
                onClick={() => {
                  onSend(mode);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left font-medium text-[#374151] transition-colors",
                  hoverClass,
                  sending && !loading && "opacity-50 pointer-events-none",
                )}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-dashboard-primary" /> : icon}
                <span>{label}</span>
              </button>
            );
          })}
        </div>
        {lastNudge && (
          <div className="px-3 py-2 border-t border-[#F3F4F6] bg-[#FAFBFC] rounded-b-xl">
            <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-0.5">Last sent</p>
            <p className="text-xs text-[#374151]">
              <span className="font-semibold text-dashboard-primary">{lastNudge.mode}</span>
              <span className="text-[#9CA3AF] mx-1">·</span>
              <span title={formatRmNudgeDisplayDate(lastNudge.createdAt)}>{formatRmNudgeRelative(lastNudge.createdAt)}</span>
            </p>
            <p className="text-[10px] text-[#9CA3AF] mt-0.5 truncate" title={formatRmNudgeDisplayDate(lastNudge.createdAt)}>
              {formatRmNudgeDisplayDate(lastNudge.createdAt)}
            </p>
          </div>
        )}
      </div>,
      document.body,
    );

  return (
    <div className="relative inline-block text-left" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={sending}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold border transition-all shrink-0 whitespace-nowrap",
          "border-dashboard-primary/45 bg-white text-dashboard-primary hover:bg-[#F0F7FF] hover:border-dashboard-primary",
          open && "border-dashboard-primary bg-[#F0F7FF] shadow-sm ring-1 ring-dashboard-primary/15",
          sending && "opacity-60 cursor-wait",
        )}
      >
        <Bell className="w-3.5 h-3.5 shrink-0" />
        Nudge
        <ChevronDown className={cn("w-3 h-3 shrink-0 opacity-60", open && "rotate-180")} />
      </button>
      {panel}
    </div>
  );
}
