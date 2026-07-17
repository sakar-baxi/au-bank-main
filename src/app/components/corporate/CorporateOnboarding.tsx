"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    Upload,
    Info,
    CheckCircle2,
} from "lucide-react";

export interface OnboardedCorporate {
    corporateName: string;
    corporateReferenceId?: string;
    categories: string;
    connections: string;
    status: "Active" | "Pending";
    contactName: string;
    dateAdded: string;
    corpCategory?: "CAT A" | "CAT B" | "CAT C";
    kybStatus?: "Verified" | "Pending" | "In Review";
}

type OnboardingStep = "form" | "kyb" | "profile";

interface CorporateOnboardingProps {
    onComplete: (corporate: OnboardedCorporate) => void;
    onCancel: () => void;
}

const ONBOARDING_INFO_TEXT =
    "Let's onboard a new corporate. We'll capture basic details, run KYB checks, and connect their HRMS for data sync.";

function OnboardingInfoBanner() {
    return (
        <div
            className={cn(
                "rounded-2xl border px-5 py-4 mb-6 text-sm leading-relaxed",
                "border-[#93C5FD] bg-[#EFF6FF] text-[#1E3A5F]",
            )}
        >
            {ONBOARDING_INFO_TEXT}
        </div>
    );
}

function PageHeader({ onBack }: { onBack: () => void }) {
    return (
        <div className="flex items-center gap-2 mb-6">
            <button
                type="button"
                onClick={onBack}
                className="p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
                <ChevronLeft className="w-5 h-5 text-[#6B7280]" />
            </button>
            <div>
                <h1 className="text-xl font-bold text-[#111827]">Dashboard</h1>
                <p className="text-sm text-[#6B7280]">Quick actions, analytics and more</p>
            </div>
        </div>
    );
}

function displayField(value: string): string {
    return value.trim() ? value.trim() : "—";
}

export default function CorporateOnboarding({ onComplete, onCancel }: CorporateOnboardingProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [step, setStep] = useState<OnboardingStep>("form");
    const [form, setForm] = useState({
        corporateName: "",
        corporateReferenceId: "",
        corporateEmail: "",
        website: "",
        contactName: "",
        contactEmail: "",
        phoneNumber: "",
        designation: "",
        country: "India",
        pincode: "",
        address: "",
        block: "",
        city: "",
        state: "",
        corporatePan: "",
        gstNumber: "",
        cin: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateForm = (updates: Partial<typeof form>) => setForm((f) => ({ ...f, ...updates }));

    const handleSaveAndContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current?.reportValidity()) return;
        setStep("kyb");
    };

    const buildOnboardedCorporate = (): OnboardedCorporate => ({
        corporateName: form.corporateName || "New Corporate",
        corporateReferenceId: form.corporateReferenceId.trim() || undefined,
        categories: "HRIS",
        connections: "Manual",
        status: "Pending",
        contactName: form.contactName,
        dateAdded: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        corpCategory: "CAT A",
        kybStatus: "Verified",
    });

    const handleCreateCorporate = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            const corp = buildOnboardedCorporate();
            setIsSubmitting(false);
            onComplete(corp);
        }, 1000);
    };

    if (step === "kyb") {
        return (
            <div className="max-w-5xl mx-auto pb-20">
                <PageHeader onBack={onCancel} />
                <OnboardingInfoBanner />

                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1.5 text-sm font-semibold mb-5 border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Corporate details confirmed ✓
                </div>

                <h2 className="text-2xl font-bold text-[#111827] mb-2">KYB verification complete</h2>
                <p className="text-[#6B7280] text-sm mb-8">We&apos;ve verified the business and compliance status.</p>

                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden mb-10">
                    <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#FCFCFD]">
                        <h3 className="font-bold text-[#111827]">KYB status</h3>
                    </div>
                    <div className="divide-y divide-[#E5E7EB]">
                        {[
                            ["Status", "Verified"],
                            ["Business registration", "Matches GST/CIN"],
                            ["Corporate structure", "Validated"],
                            ["Tax checks", "No issues detected"],
                        ].map(([label, val]) => (
                            <div key={label} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <span className="text-sm font-medium text-[#6B7280]">{label}</span>
                                <span className="text-sm font-semibold text-[#111827]">{val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-[#E5E7EB]">
                    <button
                        type="button"
                        onClick={() => setStep("form")}
                        className="px-8 py-2.5 bg-[#F3F4F6] text-[#374151] font-semibold text-sm rounded-lg hover:bg-[#E5E7EB] transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={() => setStep("profile")}
                        className="px-8 py-2.5 bg-[#C2CFFF] text-[#4F46E5] font-bold text-sm rounded-lg hover:bg-[#B3C4FF] transition-colors"
                    >
                        Review verified details
                    </button>
                </div>
            </div>
        );
    }

    if (step === "profile") {
        const poc =
            !form.contactName.trim() && !form.contactEmail.trim()
                ? "—"
                : `${displayField(form.contactName)} · ${displayField(form.contactEmail)}`;

        return (
            <div className="max-w-5xl mx-auto pb-20">
                <PageHeader onBack={onCancel} />
                <OnboardingInfoBanner />

                <h2 className="text-2xl font-bold text-[#111827] mb-6">STEP: Verified corporate profile</h2>

                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 md:p-8 mb-10 space-y-0">
                    {[
                        ["Company Name", displayField(form.corporateName)],
                        ["GST Number", displayField(form.gstNumber)],
                        ["CIN Number", displayField(form.cin)],
                        ["Point of Contact", poc],
                    ].map(([label, val], i) => (
                        <div
                            key={label}
                            className={cn(
                                "flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-8 py-4",
                                i > 0 && "border-t border-[#E5E7EB]",
                            )}
                        >
                            <span className="text-sm font-medium text-[#6B7280] sm:w-40 shrink-0">{label}</span>
                            <span className="text-sm font-semibold text-[#111827] flex-1">{val}</span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-[#E5E7EB]">
                    <button
                        type="button"
                        onClick={() => setStep("kyb")}
                        className="px-8 py-2.5 bg-[#F3F4F6] text-[#374151] font-semibold text-sm rounded-lg hover:bg-[#E5E7EB] transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleCreateCorporate}
                        className="px-8 py-2.5 bg-[#C2CFFF] text-[#4F46E5] font-bold text-sm rounded-lg hover:bg-[#B3C4FF] transition-colors disabled:opacity-60"
                    >
                        {isSubmitting ? "Creating..." : "Create Corporate"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <PageHeader onBack={onCancel} />

            <form ref={formRef} onSubmit={handleSaveAndContinue} className="space-y-6">
                {/* Corporate Information */}
                <Section title="Corporate Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        <Input
                            label="Corporate Name"
                            required
                            value={form.corporateName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateForm({ corporateName: e.target.value })
                            }
                            placeholder="Enter Corporate Name"
                        />
                        <Input
                            label="Corporate Reference ID"
                            required
                            value={form.corporateReferenceId}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateForm({ corporateReferenceId: e.target.value })
                            }
                            placeholder="Enter Corporate Reference ID"
                            info="A unique identifier for this corporate in your system."
                        />
                        <Input
                            label="Corporate Email"
                            value={form.corporateEmail}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateForm({ corporateEmail: e.target.value })
                            }
                            placeholder="Enter Corporate Email"
                            info="Main contact email for corporate communications."
                        />
                        <Input
                            label="Website"
                            value={form.website}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateForm({ website: e.target.value })
                            }
                            placeholder="Enter Website"
                        />
                    </div>
                </Section>

                {/* Contact Details */}
                <Section title="Contact Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        <Input
                            label="Contact Name"
                            value={form.contactName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateForm({ contactName: e.target.value })
                            }
                            placeholder="Enter Contact Name"
                        />
                        <Input
                            label="Contact Email"
                            value={form.contactEmail}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateForm({ contactEmail: e.target.value })
                            }
                            placeholder="Enter Contact Email"
                        />
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-[#374151]">Phone Number</label>
                            <div className="flex gap-2">
                                <div className="w-24 px-3 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm flex items-center gap-2">
                                    <span className="w-5 h-3.5 bg-[#FF9933] relative">
                                        <span className="absolute inset-x-0 top-1/3 bottom-1/3 bg-white" />
                                        <span className="absolute inset-x-0 bottom-0 top-2/3 bg-[#138808]" />
                                    </span>
                                    +91
                                </div>
                                <input
                                    type="text"
                                    value={form.phoneNumber}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateForm({ phoneNumber: e.target.value })
                                    }
                                    placeholder="Enter Phone Number"
                                    className="flex-1 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dashboard-primary/20 transition-all"
                                />
                            </div>
                        </div>
                        <Input
                            label="Designation"
                            value={form.designation}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateForm({ designation: e.target.value })
                            }
                            placeholder="Enter Designation"
                        />
                    </div>
                </Section>

                {/* Address Details */}
                <Section title="Address Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-[#374151]">Country</label>
                            <select
                                value={form.country}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                    updateForm({ country: e.target.value })
                                }
                                className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dashboard-primary/20 transition-all appearance-none"
                            >
                                <option value="India">India</option>
                            </select>
                        </div>
                        <Input
                            label="Pincode"
                            value={form.pincode}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateForm({ pincode: e.target.value })
                            }
                            placeholder="e.g. 123456"
                        />
                        <div className="md:col-span-1 space-y-1.5">
                            <label className="text-sm font-semibold text-[#374151]">Address</label>
                            <textarea
                                value={form.address}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    updateForm({ address: e.target.value })
                                }
                                placeholder="Enter building no."
                                rows={1}
                                className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dashboard-primary/20 transition-all resize-none"
                            />
                        </div>
                        <Input
                            label="Block"
                            value={form.block}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateForm({ block: e.target.value })
                            }
                            placeholder="Block"
                            disabled
                            className="bg-[#F9FAFB]"
                        />
                        <Input
                            label="City"
                            value={form.city}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateForm({ city: e.target.value })
                            }
                            placeholder="City"
                            disabled
                            className="bg-[#F9FAFB]"
                        />
                        <Input
                            label="State"
                            value={form.state}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateForm({ state: e.target.value })
                            }
                            placeholder="State"
                            disabled
                            className="bg-[#F9FAFB]"
                        />
                    </div>
                </Section>

                {/* Legal Information */}
                <Section title="Legal Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        <UploadInput
                            label="Corporate PAN"
                            required
                            value={form.corporatePan}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateForm({ corporatePan: e.target.value })
                            }
                            placeholder="e.g. ABCDE1234F"
                        />
                        <UploadInput
                            label="GST Number"
                            required
                            value={form.gstNumber}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateForm({ gstNumber: e.target.value })
                            }
                            placeholder="e.g. 22AAAAA0000A1Z5"
                        />
                        <UploadInput
                            label="CIN"
                            value={form.cin}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateForm({ cin: e.target.value })
                            }
                            placeholder="e.g. U12345AB1234PLC123456"
                        />
                    </div>
                </Section>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-[#E5E7EB]">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-8 py-2.5 bg-[#F3F4F6] text-[#374151] font-semibold text-sm rounded-lg hover:bg-[#E5E7EB] transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-2.5 bg-[#C2CFFF] text-[#4F46E5] font-bold text-sm rounded-lg hover:bg-[#B3C4FF] transition-colors"
                    >
                        Save and Continue
                    </button>
                </div>
            </form>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#FCFCFD]">
                <h3 className="font-bold text-[#111827]">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function Input({ label, required, value, onChange, placeholder, info, disabled, className }: any) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
                <label className="text-sm font-semibold text-[#374151]">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                {info && <Info className="w-3.5 h-3.5 text-[#9CA3AF] cursor-help" />}
            </div>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={cn(
                    "w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dashboard-primary/20 transition-all",
                    className,
                )}
            />
        </div>
    );
}

function UploadInput({ label, required, value, onChange, placeholder }: any) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#374151]">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                    type="text"
                    required={required}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dashboard-primary/20 transition-all"
                />
            </div>
            <div
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 h-[42px] px-4 border border-[#E5E7EB] rounded-lg bg-white flex items-center justify-center gap-2 cursor-pointer hover:bg-[#F9FAFB] transition-colors"
            >
                <Upload className="w-4 h-4 text-[#6B7280] shrink-0" />
                <span className="text-sm text-[#6B7280] truncate">{fileName || "Upload"}</span>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
        </div>
    );
}
