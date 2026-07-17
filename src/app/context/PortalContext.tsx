"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type PortalMode = "hr" | "rm" | "employee";

interface PortalContextType {
    portalMode: PortalMode;
    setPortalMode: (mode: PortalMode) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

const PORTAL_LABELS: Record<PortalMode, string> = {
    hr: "HR Portal",
    rm: "RM Portal",
    employee: "Employee Portal",
};

const PORTAL_STORAGE_KEY = "au_portal_mode";

function readStoredPortalMode(): PortalMode {
    if (typeof window === "undefined") return "hr";
    try {
        const s = localStorage.getItem(PORTAL_STORAGE_KEY);
        if (s === "rm" || s === "hr" || s === "employee") return s;
    } catch {
        /* ignore */
    }
    return "hr";
}

export function PortalProvider({ children }: { children: ReactNode }) {
    const [portalMode, setPortalMode] = useState<PortalMode>(() => readStoredPortalMode());

    const setPortalModePersist = useCallback((mode: PortalMode) => {
        setPortalMode(mode);
        try {
            localStorage.setItem(PORTAL_STORAGE_KEY, mode);
        } catch {
            /* ignore */
        }
    }, []);

    return (
        <PortalContext.Provider value={{ portalMode, setPortalMode: setPortalModePersist }}>
            {children}
        </PortalContext.Provider>
    );
}

export function usePortal() {
    const ctx = useContext(PortalContext);
    if (!ctx) throw new Error("usePortal must be used within PortalProvider");
    return ctx;
}

export { PORTAL_LABELS };
