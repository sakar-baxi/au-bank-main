"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HelpCircle, Settings2, Globe, Shield, CreditCard, Calendar, ArrowLeft, Smartphone, Monitor } from "lucide-react";
import { useBranding } from "@/app/context/BrandingContext";
import { useJourneyConfig } from "@/app/context/JourneyConfigContext";
import { useJourney } from "@/app/context/JourneyContext";
import JourneyProgressBar from "./JourneyProgressBar";
import TasksSidebar from "./TasksSidebar";
import WhitelabelModal from "../shared/WhitelabelModal";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import { SbiSidebarSymbol } from "@/app/components/branding/SbiOfficialLogo";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
    const { config } = useBranding();
    const { config: journeyConfig } = useJourneyConfig();
  const { bottomBarContent, showDashboard, currentStepIndex, journeyType, prevStep, journeySteps } = useJourney();
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [isStepperGlassy, setIsStepperGlassy] = useState(false);
    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
    const [showViewSwitcher, setShowViewSwitcher] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const useTasksSidebar = journeyType === "etb-nk";

    const showBackButton = useMemo(() => {
        if (showDashboard || currentStepIndex <= 0) return false;
        const currentStepId = journeySteps[currentStepIndex]?.id;
        // Don't show back button on complete steps
        return !String(currentStepId || "").endsWith(":complete") && !String(currentStepId || "").endsWith(":avComplete");
    }, [showDashboard, currentStepIndex, journeySteps]);
    const showBottomBar = useMemo(() => !!bottomBarContent || showBackButton, [bottomBarContent, showBackButton]);
    
    const showStepper = useMemo(() => {
        if (showDashboard || viewMode === "mobile") return false;
        if (useTasksSidebar) return false; // ETB-NK uses Tasks rail instead of top progress bar
        const currentStepId = journeySteps[currentStepIndex]?.id || "";
        // Hide stepper for all DAV steps (they all start with av)
        if (currentStepId.includes(":av")) return false;
        return true;
    }, [showDashboard, currentStepIndex, journeySteps, viewMode, useTasksSidebar]);

    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const next = el.scrollTop > 6;
        setIsStepperGlassy((prev) => (prev === next ? prev : next));
    }, []);

    // Always reset scroll between steps/journeys (don't preserve previous step scroll).
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        // Ensure we reset after content/layout updates.
        const raf = window.requestAnimationFrame(() => {
            el.scrollTo({ top: 0, left: 0, behavior: "auto" });
            setIsStepperGlassy(false);
        });

        return () => window.cancelAnimationFrame(raf);
    }, [currentStepIndex, showDashboard, journeyType]);

    return (
        <div
            className={cn(
                "flex h-screen w-full text-slate-900 font-sans overflow-hidden relative transition-all duration-300",
                config.preset === 'neobrutalist' ? "bg-white" : "bg-[#fcfdfe]"
            )}
            style={{
                '--primary-bank': config.primary,
                '--radius-bank': `${config.borderRadius}px`,
                '--glass-opacity': config.glassOpacity,
                fontFamily: config.fontFamily
            } as any}
        >
            {/* Journey builder disabled - no WhitelabelModal */}

            {/* Main Center Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden h-full z-10 bg-transparent">

                {/* Glass Top Header - Modular Sizing */}
                <header className={cn(
                    "flex items-center justify-between px-4 md:px-6 lg:px-10 flex-shrink-0 z-30 fixed top-0 left-0 right-0 transition-all duration-200 gap-4 h-[var(--journey-header-h)]",
                    config.preset === 'neobrutalist' ? "bg-white border-b-4 border-black" : "bg-white border-b border-slate-200",
                    "shadow-sm"
                )}
                style={{
                    height: "calc(var(--journey-header-h) + env(safe-area-inset-top))",
                    paddingTop: "env(safe-area-inset-top)",
                }}>
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                onClick={() => setShowViewSwitcher(!showViewSwitcher)}
                                className={cn(
                                    "flex items-center justify-center shrink-0 cursor-pointer transition-all duration-150 active:scale-95",
                                    config.preset === 'neobrutalist'
                                        ? "shadow-[4px_4px_0_0_#000] border-2 border-black bg-white px-2 py-1 font-semibold h-[calc(var(--journey-header-h)-16px)] max-h-10 w-auto"
                                        : "max-h-11",
                                )}
                                style={
                                    config.preset === 'neobrutalist'
                                        ? { borderRadius: '0px' }
                                        : undefined
                                }
                                title="Click to switch between desktop and mobile view"
                            >
                                <SbiSidebarSymbol priority />
                            </div>
                        </div>

                    </div>

                    <div className="flex-1" />
                    
                    {/* View Mode Switcher - Hidden by default, shows when logo clicked */}
                    {!showDashboard && showViewSwitcher && (
                        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 shadow-sm">
                            <button
                                onClick={() => setViewMode("desktop")}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                    viewMode === "desktop"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                <Monitor className="w-4 h-4" />
                                Desktop
                            </button>
                            <button
                                onClick={() => setViewMode("mobile")}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                    viewMode === "mobile"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                <Smartphone className="w-4 h-4" />
                                Mobile
                            </button>
                        </div>
                    )}
                </header>

                {/* Fixed Stepper (stays visible while scrolling) */}
                {showStepper && (
                    <div
                        className={cn(
                            "fixed left-0 right-0 z-[60]",
                            "transition-colors duration-150"
                        )}
                        style={{
                            top: "calc(var(--journey-header-h) + env(safe-area-inset-top))",
                            height: "var(--journey-stepper-h)",
                            background: isStepperGlassy ? "rgba(255,255,255,0.78)" : "transparent",
                            backdropFilter: isStepperGlassy ? "blur(14px)" : "none",
                            WebkitBackdropFilter: isStepperGlassy ? "blur(14px)" : "none",
                            borderBottom: isStepperGlassy ? "1px solid rgba(226,232,240,0.7)" : "1px solid transparent",
                        }}
                    >
                        <div className="h-full px-4 md:px-6 lg:px-10 flex items-center">
                            <div className="w-full max-w-[1400px] mx-auto">
                                <JourneyProgressBar />
                            </div>
                        </div>
                    </div>
                )}

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className={cn(
                        "flex-1 overflow-y-auto relative flex flex-col items-center p-2 md:p-4 lg:p-5 overflow-x-hidden",
                        showBottomBar
                            ? "pb-[calc(var(--journey-bottom-bar-h)+env(safe-area-inset-bottom)+0.75rem)]"
                            : "pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
                    )}
                    style={{
                        paddingTop: showStepper
                            ? "calc(var(--journey-header-h) + env(safe-area-inset-top) + var(--journey-stepper-h) + 0.75rem)"
                            : "calc(var(--journey-header-h) + env(safe-area-inset-top) + 0.75rem)",
                        backgroundColor: journeyType === 'personal-loan' ? 'white' : 'transparent'
                    }}
                >
                    {/* Journey Background - AU-themed gradient */}
                    {journeyType !== 'personal-loan' && viewMode === 'desktop' && (
                        <div
                            className="absolute inset-0 z-0 pointer-events-none"
                            style={{
                                background: "linear-gradient(to bottom, #fff5f5 0%, #f0f2f8 50%, #e8eaf2 100%)",
                            }}
                        />
                    )}

                    {/* iPhone Mockup for Mobile View */}
                    {viewMode === 'mobile' && !showDashboard && (
                        <div className="relative z-10 flex items-center justify-center min-h-full py-2">
                            {/* Phone Frame */}
                            <div className="relative mx-auto border-[#1a1a1a] bg-[#1a1a1a] border-[12px] rounded-[3.5rem] h-[740px] w-[375px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500">
                                {/* Outer Glow */}
                                <div className="absolute -inset-2 bg-gradient-to-b from-slate-600/20 to-slate-900/20 rounded-[3.8rem] -z-10 blur-md"></div>
                                
                                {/* Side Buttons */}
                                <div className="absolute -left-[14px] top-[100px] w-[4px] h-[35px] bg-[#1a1a1a] rounded-l-md border-r border-white/5"></div>
                                <div className="absolute -left-[14px] top-[150px] w-[4px] h-[65px] bg-[#1a1a1a] rounded-l-md border-r border-white/5"></div>
                                <div className="absolute -left-[14px] top-[225px] w-[4px] h-[65px] bg-[#1a1a1a] rounded-l-md border-r border-white/5"></div>
                                <div className="absolute -right-[14px] top-[160px] w-[4px] h-[90px] bg-[#1a1a1a] rounded-r-md border-l border-white/5"></div>
                                
                                {/* Screen Area */}
                                <div className="relative w-full h-full bg-white rounded-[2.8rem] overflow-hidden">
                                    {/* Dynamic Island / Notch */}
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50">
                                        <div className="h-[28px] w-[100px] bg-black rounded-full flex items-center justify-end pr-3 gap-2">
                                            {/* Camera Lens Effect */}
                                            <div className="w-4 h-4 rounded-full bg-[#0a0a0a] ring-1 ring-white/10 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-900/40 blur-[1px]"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Status Bar */}
                                    <div className="absolute top-0 left-0 right-0 h-10 flex items-end justify-between px-8 pb-1 z-40 bg-white/80 backdrop-blur-sm">
                                        <div className="text-[12px] font-black text-black">9:41</div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="flex gap-0.5">
                                                <div className="w-0.5 h-1.5 bg-black rounded-full"></div>
                                                <div className="w-0.5 h-2 bg-black rounded-full"></div>
                                                <div className="w-0.5 h-2.5 bg-black rounded-full"></div>
                                                <div className="w-0.5 h-3 bg-black rounded-full"></div>
                                            </div>
                                            <span className="text-[10px] font-black">5G</span>
                                            <div className="w-5 h-2.5 border border-black/30 rounded-[3px] relative flex items-center px-0.5">
                                                <div className="h-full bg-black rounded-[1px] w-[70%]"></div>
                                                <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-[3px] bg-black/30 rounded-r-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Screen Content */}
                                    <div className="h-full overflow-y-auto overflow-x-hidden bg-slate-50 no-scrollbar relative z-10 pt-10 pb-4">
                                        {children}
                                    </div>
                                    
                                    {/* Home Indicator */}
                                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/10 rounded-full z-50"></div>
                                </div>
                            </div>
                            
                            {/* Reflection Overlay */}
                            <div className="absolute inset-0 pointer-events-none z-20 rounded-[3.5rem] bg-gradient-to-tr from-white/5 via-transparent to-white/10" />
                        </div>
                    )}

                    {/* Desktop View */}
                    {viewMode === 'desktop' && (
                        <div
                            className={cn(
                                "desktop-view w-full flex transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 relative z-10",
                                showDashboard
                                    ? (config.modules.headerSize === 'large'
                                        ? "max-w-full xl:max-w-[1700px] 2xl:max-w-[1800px]"
                                        : "max-w-full lg:max-w-[1500px]")
                                    : "w-full max-w-[1400px] mx-auto px-2 sm:px-4",
                                useTasksSidebar && !showDashboard ? "flex-row items-start gap-5" : "flex-col"
                            )}
                        >
                            <div className={cn(useTasksSidebar && !showDashboard ? "flex-1 min-w-0" : "w-full")}>
                                {children}
                            </div>
                            {useTasksSidebar && !showDashboard && <TasksSidebar />}
                        </div>
                    )}
                </div>

                {/* Fixed Bottom Action Bar */}
                {showBottomBar && (
                    <div
                        className={cn(
                            "fixed left-0 right-0 bottom-0 z-40",
                            config.preset === "neobrutalist"
                                ? "bg-white border-t-4 border-black"
                                : "bg-white border-t border-slate-200"
                        )}
                        style={{ height: "var(--journey-bottom-bar-h)" }}
                    >
                        <div
                            className="h-full max-w-[1400px] w-full mx-auto px-4 md:px-6 lg:px-10 flex items-center justify-between gap-3"
                            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                        >
                            {showBackButton ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    className="h-10 px-3 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 shrink-0"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Back
                                </Button>
                            ) : (
                                <div className="shrink-0" />
                            )}
                            <div className="flex-1 min-w-0 flex justify-end">
                                {bottomBarContent}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
