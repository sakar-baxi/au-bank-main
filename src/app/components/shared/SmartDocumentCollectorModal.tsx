"use client";

import React, { useState } from "react";
import { X, Upload, CheckCircle2, FileText, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Document {
    id: string;
    name: string;
    description: string;
    status: "pending" | "uploading" | "completed";
    file?: File;
}

const INITIAL_DOCS: Document[] = [
    { id: "pan", name: "PAN Card", description: "Permanent Account Number card", status: "pending" },
    { id: "aadhaar_front", name: "Aadhaar Card (Front)", description: "Front side of your Aadhaar card", status: "pending" },
    { id: "aadhaar_back", name: "Aadhaar Card (Back)", description: "Back side of your Aadhaar card", status: "pending" },
    { id: "salary_slip", name: "Salary Slip", description: "Latest month's salary slip", status: "pending" },
    { id: "bank_statement", name: "Bank Statement", description: "Last 6 months' bank statement", status: "pending" },
    { id: "employee_id", name: "Employee ID Card", description: "Your official corporate ID card", status: "pending" },
    { id: "photo", name: "Photograph", description: "Recent passport size photo", status: "pending" },
];

interface SmartDocumentCollectorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SmartDocumentCollectorModal({ isOpen, onClose }: SmartDocumentCollectorModalProps) {
    const [docs, setDocs] = useState<Document[]>(INITIAL_DOCS);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const handleUpload = (id: string) => {
        setDocs(prev => prev.map(doc => doc.id === id ? { ...doc, status: "uploading" } : doc));
        
        // Simulate upload delay
        setTimeout(() => {
            setDocs(prev => prev.map(doc => doc.id === id ? { ...doc, status: "completed" } : doc));
        }, 1500);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsFinished(true);
        }, 2000);
    };

    const completedCount = docs.filter(d => d.status === "completed").length;
    const progress = (completedCount / docs.length) * 100;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <ShieldCheck className="text-[#EE1B24] w-6 h-6" />
                                Smart Document Collector
                            </h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Securely upload documents for your loan application</p>
                        </div>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-slate-50 px-8 py-4 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Overall Progress</span>
                            <span className="text-[10px] font-bold text-[#EE1B24] bg-red-50 px-2 py-0.5 rounded-full">{Math.round(progress)}% Complete</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-[#EE1B24]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Document List */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-white custom-scrollbar">
                        {isFinished ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-12 text-center"
                            >
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 mb-2">Documents Submitted!</h4>
                                <p className="text-sm text-slate-500 max-w-xs mx-auto">Your documents have been securely encrypted and shared with AU Bank.</p>
                                <button 
                                    onClick={onClose}
                                    className="mt-8 h-12 px-8 bg-[#EE1B24] text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#EE1B24]/20 hover:bg-[#D61820] transition-all"
                                >
                                    Close Collector
                                </button>
                            </motion.div>
                        ) : (
                            docs.map((doc, index) => (
                                <motion.div 
                                    key={doc.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        "group flex items-center gap-4 p-4 rounded-2xl border transition-all",
                                        doc.status === "completed" ? "bg-emerald-50/50 border-emerald-100" : "bg-slate-50/50 border-slate-100 hover:border-slate-200"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                        doc.status === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-white text-slate-400 group-hover:text-slate-500"
                                    )}>
                                        {doc.status === "completed" ? <CheckCircle2 className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                                        <p className="text-[10px] text-slate-500 font-medium truncate">{doc.description}</p>
                                    </div>
                                    <div className="shrink-0">
                                        {doc.status === "pending" && (
                                            <button 
                                                onClick={() => handleUpload(doc.id)}
                                                className="h-9 px-4 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-[#EE1B24] hover:text-[#EE1B24] transition-all flex items-center gap-2 shadow-sm"
                                            >
                                                <Upload className="w-3.5 h-3.5" />
                                                Upload
                                            </button>
                                        )}
                                        {doc.status === "uploading" && (
                                            <div className="flex items-center gap-2 text-[#EE1B24] text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-red-50">
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                Uploading...
                                            </div>
                                        )}
                                        {doc.status === "completed" && (
                                            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-emerald-50">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Ready
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {!isFinished && (
                        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-400">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Securely encrypted</span>
                            </div>
                            <button 
                                onClick={handleSubmit}
                                disabled={completedCount === 0 || isSubmitting}
                                className="h-12 px-10 bg-[#EE1B24] disabled:bg-slate-200 disabled:text-slate-400 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#EE1B24]/20 hover:bg-[#D61820] transition-all flex items-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit All"}
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
