"use client";

import React, { useState } from "react";
import {
    ChevronRight,
    Building2,
    Car,
    Home,
    FileText,
    PiggyBank,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SbiSidebarSymbol } from "@/app/components/branding/SbiOfficialLogo";
import { openEmployeeLoanJourneyInNewTab } from "@/lib/employeeJourneyHub";

/** Opens personal loan journey in a new tab (reuses modular loan opener; resumes in-progress bundle when present). */
export function openPersonalLoanJourneyInNewTab(prefilled?: Record<string, any>) {
  openEmployeeLoanJourneyInNewTab("personal-loan", prefilled);
}

/** @deprecated Use openPersonalLoanJourneyInNewTab for employee portal */
export function openSalaryJourneyInNewTab(prefilled?: Record<string, unknown>) {
    openPersonalLoanJourneyInNewTab(prefilled);
}

interface ProductMarketplaceDashboardProps {
    /** Show the dark hero section (Welcome back, product offers) */
    showHero?: boolean;
    /** User's first name for greeting */
    userName?: string;
    /** Callback when "View all" is clicked (e.g. navigate to orders) */
    onViewAllOffers?: () => void;
    /** Callback for "Open Salary Account" button — smart: resumes in-progress or starts new journey */
    onOpenSalaryAccount?: () => void;
}

// AU banking services for salary account opening portal
const FEATURED_PRODUCTS = [
    { icon: FileText, tag: "CORPORATE", title: "Corporate Salary Package", desc: "Specialized salary accounts for corporate employees via AU Bank.", benefit: "Zero Balance Account", isPrimary: true },
    { icon: Building2, tag: "DIGITAL", title: "AU 0101", desc: "Banking, shopping, and investment services in one app.", benefit: "All-in-one banking", isPrimary: false },
    { icon: Home, tag: "PRE-APPROVED", title: "Home Loans", desc: "Housing finance solutions at competitive rates.", benefit: "From 8.5% p.a.", isPrimary: false },
];

const MARKETPLACE_CATEGORIES = [
    { id: "all", label: "All Services", icon: Building2 },
    { id: "deposits", label: "Deposits", icon: PiggyBank },
    { id: "loans", label: "Loans", icon: Home },
    { id: "digital", label: "Digital Banking", icon: Sparkles },
    { id: "corporate", label: "Corporate", icon: Building2 },
] as const;

const MARKETPLACE_PRODUCTS = [
    { id: "sa", category: "deposits", tag: "POPULAR", title: "Savings Accounts", desc: "Regular, basic, and digital savings accounts via AU 0101.", highlight: "Zero AMB Option", icon: PiggyBank },
    { id: "ca", category: "deposits", tag: "BUSINESS", title: "Current Accounts", desc: "Business and individual current account solutions.", highlight: "Overdraft Facility", icon: Building2 },
    { id: "fd", category: "deposits", tag: "SECURE", title: "Fixed Deposits", desc: "e-TDR/e-STDR fixed deposit solutions.", highlight: "Up to 7.5% p.a.", icon: FileText },
    { id: "rd", category: "deposits", tag: "FLEXIBLE", title: "Recurring Deposits", desc: "Recurring savings deposit options.", highlight: "Flexible Tenure", icon: PiggyBank },
    { id: "hl", category: "loans", tag: "LOW RATES", title: "Home Loans", desc: "Housing finance solutions for customers.", highlight: "From 8.5% p.a.", icon: Home },
    { id: "pl", category: "loans", tag: "INSTANT", title: "Personal Loans", desc: "Personal finance solutions for eligible customers.", highlight: "Quick Disbursal", icon: FileText },
    { id: "cl", category: "loans", tag: "NEW", title: "Car Loans", desc: "Vehicle finance for new and used cars.", highlight: "Low Downpayment", icon: Car },
    { id: "el", category: "loans", tag: "EDUCATION", title: "Education Loans", desc: "Education financing for students.", highlight: "Moratorium Period", icon: FileText },
    { id: "gl", category: "loans", tag: "QUICK", title: "Gold Loans", desc: "Loan facility against gold.", highlight: "Same-day Approval", icon: Sparkles },
    { id: "yono", category: "digital", tag: "POPULAR", title: "AU 0101", desc: "Banking, shopping, and investment services in one app.", highlight: "All-in-one App", icon: Building2 },
    { id: "ib", category: "digital", tag: "ESSENTIAL", title: "Internet Banking", desc: "AU Bank netbanking for transfers, bill payments, and account services.", highlight: "24x7 Access", icon: FileText },
    { id: "mb", category: "digital", tag: "CONVENIENT", title: "Mobile Banking", desc: "Banking services through AU 0101 Lite.", highlight: "Instant Transfers", icon: Building2 },
    { id: "csp", category: "corporate", tag: "CORPORATE", title: "Corporate Salary Packages", desc: "Specialized salary accounts for corporate employees.", highlight: "Zero Balance", icon: Building2 },
    { id: "cmp", category: "corporate", tag: "BUSINESS", title: "Cash Management Products", desc: "AU Business solutions for bulk and vendor payments.", highlight: "Bulk Payments", icon: FileText },
    { id: "scf", category: "corporate", tag: "FINANCE", title: "Supply Chain Finance", desc: "Electronic vendor finance and dealer finance solutions.", highlight: "Vendor Support", icon: Building2 },
];

export default function ProductMarketplaceDashboard({
    showHero = true,
    userName = "Rahul",
    onViewAllOffers,
    onOpenSalaryAccount,
}: ProductMarketplaceDashboardProps) {
    const [activeCategory, setActiveCategory] = useState<string>("all");

    const filteredProducts =
        activeCategory === "all"
            ? MARKETPLACE_PRODUCTS
            : MARKETPLACE_PRODUCTS.filter((p) => p.category === activeCategory);

    return (
        <div className="w-full min-h-full flex flex-col">
            {showHero && (
                <div className="rounded-3xl mb-6 overflow-hidden shadow-2xl relative" style={{ background: "linear-gradient(135deg, #42265e 0%, #2e1a42 45%, #2a183c 100%)" }}>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 L100 0 L100 100 Z" fill="white" />
                        </svg>
                    </div>
                    
                    <div className="relative z-10 px-6 py-10 md:px-10 md:py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="flex-1 min-w-0 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-[10px] font-bold uppercase tracking-widest mb-4">
                                <Sparkles className="w-3 h-3 text-yellow-400" />
                                Exclusive AU Bank Corporate Benefits
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
                                Your Salary Account <br />
                                <span className="text-white/90 italic">Banking Portal</span>
                            </h1>
                            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                                Open your AU Bank salary account instantly with pre-approved corporate packages, digital banking, and exclusive employee benefits.
                            </p>
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                                <button
                                    onClick={onOpenSalaryAccount}
                                    className="h-12 px-6 bg-white text-[#42265e] hover:bg-white/95 font-bold text-base rounded-xl transition-all shadow-xl shadow-black/20 active:scale-[0.98]"
                                >
                                    Open Salary Account
                                </button>
                                <button
                                    className="h-12 px-6 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-bold text-base rounded-xl transition-all"
                                >
                                    Explore All Services
                                </button>
                            </div>
                        </div>

                        <div className="flex-shrink-0 relative group hidden md:block">
                            <div className="absolute -inset-4 bg-white/10 rounded-[2.5rem] blur-2xl group-hover:bg-white/20 transition-all"></div>
                            <div className="relative w-64 h-36 rounded-2xl border border-white/20 shadow-2xl p-5 flex flex-col justify-between overflow-hidden backdrop-blur-sm" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                                <div className="flex justify-between items-start">
                                    <SbiSidebarSymbol boxClassName="h-9 w-9" />
                                    <span className="text-white/40 text-[9px] font-mono tracking-widest">PRE-APPROVED</span>
                                </div>
                                <div>
                                    <p className="text-white/60 text-[9px] uppercase tracking-[0.2em] font-bold mb-0.5">Max Eligibility</p>
                                    <p className="text-2xl font-bold text-white tracking-tight">₹15,00,000</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="text-white/40 text-[9px] font-medium tracking-wider">RAHUL BAXI</p>
                                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                                        <ChevronRight className="w-3.5 h-3.5 text-white/60" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Featured / Pre-approved Offers */}
            <div className="bg-white rounded-2xl border border-[#E8EAED] p-6 md:p-8 shadow-sm mb-8">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div>
                <h2 className="text-xl font-bold text-[#111827]">Featured Services</h2>
                <p className="text-sm text-[#6B7280] mt-0.5">Exclusive AU Bank banking services tailored for corporate employees</p>
                    </div>
                    {onViewAllOffers && (
                        <button
                            onClick={onViewAllOffers}
                            className="text-dashboard-primary font-semibold text-sm hover:underline flex items-center gap-1"
                        >
                            View all <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {FEATURED_PRODUCTS.map(({ icon: Icon, tag, title, desc, benefit, isPrimary }) => (
                        <div
                            key={title}
                            className={cn("p-5 rounded-xl border border-[#E8EAED] bg-[#F9FAFB] hover:border-dashboard-primary/30 transition-colors")}
                        >
                            <div className="w-12 h-10 rounded-lg flex items-center justify-center mb-3 bg-dashboard-primary/10">
                                <Icon className="w-6 h-6 text-dashboard-primary" />
                            </div>
                            <span className="text-[10px] font-bold text-dashboard-primary uppercase tracking-wider">{tag}</span>
                            <h3 className="font-bold text-[#111827] mt-1">{title}</h3>
                            <p className="text-sm text-[#6B7280] mt-1">{desc}</p>
                            <p className="text-sm font-semibold text-dashboard-primary mt-2">{benefit}</p>
                            <button
                                className="mt-4 w-full h-10 px-4 bg-dashboard-primary hover:opacity-90 text-white font-medium text-sm rounded-lg transition-colors"
                            >
                                Learn More
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Marketplace */}
            <div className="bg-white rounded-2xl border border-[#E8EAED] p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-[#111827]">Banking Services</h2>
                <p className="text-sm text-[#6B7280] mt-0.5 mb-6">Explore AU Bank banking and salary account services tailored for you.</p>
                <div className="flex flex-wrap gap-2 mb-6">
                    {MARKETPLACE_CATEGORIES.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveCategory(id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                activeCategory === id
                                    ? "bg-dashboard-primary text-white"
                                    : "bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredProducts.map(({ tag, title, desc, highlight, icon: Icon }) => (
                        <div
                            key={title}
                            className="p-5 rounded-xl border border-[#E8EAED] bg-[#F9FAFB] hover:border-dashboard-primary/30 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-[#E6F2FF] flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-dashboard-primary" />
                                </div>
                                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
                                    {tag}
                                </span>
                            </div>
                            <h3 className="font-bold text-[#111827]">{title}</h3>
                            <p className="text-sm text-[#6B7280] mt-1">{desc}</p>
                            <span className="inline-block mt-2 px-2 py-1 rounded-lg text-xs font-medium bg-[#F3F4F6] text-[#374151]">
                                {highlight}
                            </span>
                            <button
                                className="mt-4 flex items-center gap-1 text-dashboard-primary font-semibold text-sm hover:underline"
                            >
                                View Details <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
