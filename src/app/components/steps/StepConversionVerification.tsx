"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import StepCard from "@/app/components/layout/StepCard";
import { JourneyTypeBadge } from "@/app/components/shared/JourneyChrome";
import { CheckCircle2, CreditCard, Globe } from "lucide-react";

type VerificationMethod = "credit" | "netbanking";

export default function StepConversionVerification() {
  const {
    nextStep,
    prevStep,
    journeySteps,
    currentStepIndex,
    updateFormData,
    formData,
    setBottomBarContent,
    goToStep,
    journeyType,
  } = useJourney();
  const disableCardVerification = !!formData.disableDebitVerification;
  const isEtbNk = journeyType === "etb-nk";

  const [method, setMethod] = useState<VerificationMethod>(
    disableCardVerification ? "netbanking" : "credit"
  );
  const [cardLast4, setCardLast4] = useState(isEtbNk ? "1234" : "");
  const [cardExpiry, setCardExpiry] = useState(isEtbNk ? "2222-02" : "");
  const [cardCvv, setCardCvv] = useState(isEtbNk ? "123" : "");
  const [netbankingId, setNetbankingId] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(isEtbNk);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const stepLabel = useMemo(() => {
    if (isEtbNk) return undefined;
    const total = journeySteps.length || 0;
    if (!total) return undefined;
    return `Step ${currentStepIndex + 1} of ${total}`;
  }, [journeySteps.length, currentStepIndex, isEtbNk]);

  const isCardValid = cardLast4.trim().length === 4 && !!cardExpiry.trim() && cardCvv.trim().length >= 3;
  const isNetbankingValid = !!netbankingId.trim();
  const isOtpValid = otp.trim().length === 6;
  const isFormValid = termsAccepted && (method === "credit" ? isCardValid : isNetbankingValid);

  const maskedPhone = useMemo(() => {
    const digits = String(formData.mobileNumber || "").replace(/\D/g, "");
    if (!digits) return "XXXXXXX004";
    const last3 = digits.slice(-3).padStart(3, "0");
    return `XXXXXXX${last3}`;
  }, [formData.mobileNumber]);

  const cardholderName = useMemo(() => {
    const name = String(formData.name || "A B C").trim();
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return parts.map((p) => p[0]?.toUpperCase() || "").join(" ");
    return name.slice(0, 3).toUpperCase() || "A B C";
  }, [formData.name]);

  const handleVerify = () => {
    setShowErrors(true);
    if (!isFormValid) return;
    setIsVerifying(true);
    window.setTimeout(() => {
      setIsVerifying(false);
      setShowOtp(true);
    }, 300);
  };

  const handleOtpContinue = () => {
    setShowErrors(true);
    if (!isOtpValid) return;
    updateFormData({
      autoConvertVerified: true,
      verificationMethod: method,
      cardLast4,
      cardExpiry,
    });
    nextStep();
  };

  const handleBack = () => {
    if (showOtp) {
      setShowOtp(false);
      setOtp("");
      setShowErrors(false);
      return;
    }
    const previousStepId = journeySteps[Math.max(currentStepIndex - 1, 0)]?.id;
    if (previousStepId && previousStepId !== journeySteps[currentStepIndex]?.id) {
      goToStep(previousStepId);
      return;
    }
    prevStep();
  };

  useEffect(() => {
    setBottomBarContent(null);
  }, [setBottomBarContent]);

  return (
    <StepCard step={stepLabel} maxWidth="6xl">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          {isEtbNk && (
            <div className="mb-3">
              <JourneyTypeBadge label="Salary account (ETB with KYC)" />
            </div>
          )}
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            AU Bank verification (demo placeholder)
          </span>
        </div>
      </div>

      <div className="page-header mb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="page-title">Verify Yourself</h1>
            <p className="page-subtitle">Select an option to confirm your identity.</p>
          </div>
          <div className="rounded-[var(--radius)] border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Relax! No money will be debited from your account, this is for verification purposes only.
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1">
          Expires in: 03:24 mins
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          {!disableCardVerification && (
            <button
              type="button"
              onClick={() => {
                setMethod("credit");
                setShowErrors(false);
              }}
              className={[
                "w-full rounded-[var(--radius-lg)] border p-4 text-left transition-colors flex items-center gap-3",
                method === "credit"
                  ? "border-[var(--primary-bank)] bg-[color-mix(in_srgb,var(--primary-bank)_8%,white)]"
                  : "border-slate-200 bg-white hover:bg-slate-50",
              ].join(" ")}
            >
              <div className="h-10 w-10 rounded-full bg-violet-50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">Credit Card</p>
                <p className="text-xs text-slate-500">Requires last 4 digits, expiry date & CVV</p>
              </div>
              <div
                className={[
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                  method === "credit" ? "border-[var(--primary-bank)]" : "border-slate-300",
                ].join(" ")}
              >
                <div
                  className={[
                    "h-2.5 w-2.5 rounded-full",
                    method === "credit" ? "bg-[var(--primary-bank)]" : "bg-transparent",
                  ].join(" ")}
                />
              </div>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setMethod("netbanking");
              setShowErrors(false);
            }}
            className={[
              "w-full rounded-[var(--radius-lg)] border p-4 text-left transition-colors flex items-center gap-3",
              method === "netbanking"
                ? "border-[var(--primary-bank)] bg-[color-mix(in_srgb,var(--primary-bank)_8%,white)]"
                : "border-slate-200 bg-white hover:bg-slate-50",
            ].join(" ")}
          >
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">Net Banking</p>
              <p className="text-xs text-slate-500">Requires password/MPIN</p>
            </div>
            <div
              className={[
                "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                method === "netbanking" ? "border-[var(--primary-bank)]" : "border-slate-300",
              ].join(" ")}
            >
              <div
                className={[
                  "h-2.5 w-2.5 rounded-full",
                  method === "netbanking" ? "bg-[var(--primary-bank)]" : "bg-transparent",
                ].join(" ")}
              />
            </div>
          </button>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 space-y-4">
          {method === "credit" ? (
            <>
              {/* Linked card preview */}
              <div
                className="relative overflow-hidden rounded-2xl p-5 text-white shadow-md"
                style={{
                  background: "linear-gradient(135deg, #1e1b4b 0%, #42265e 55%, #2e1a42 100%)",
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                  Linked card (demo)
                </p>
                <p className="text-xs font-medium text-white/80 mt-1">Credit card</p>
                <p className="mt-6 text-lg font-semibold tracking-[0.2em] tabular-nums">
                  XXXX XXXX XXXX {cardLast4.padEnd(4, "0").slice(0, 4) || "0000"}
                </p>
                <p className="mt-3 text-sm font-semibold tracking-wide">{cardholderName}</p>
              </div>

              <p className="text-base font-semibold text-slate-900">Enter Credit Card Details</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Last 4 digits</label>
                  <Input
                    value={cardLast4}
                    onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className={`enterprise-input ${showErrors && cardLast4.length !== 4 ? "error" : ""}`}
                    placeholder="Last 4 digits of your card"
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <label className="form-label">Expiry Date</label>
                  <Input
                    type="month"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className={`enterprise-input ${showErrors && !cardExpiry ? "error" : ""}`}
                  />
                </div>
                <div>
                  <label className="form-label">CVV</label>
                  <Input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    className={`enterprise-input ${showErrors && cardCvv.length < 3 ? "error" : ""}`}
                    placeholder="CVV"
                    inputMode="numeric"
                    maxLength={3}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-base font-semibold text-slate-900">Login to NetBanking</p>
              <div>
                <label className="form-label">Customer ID</label>
                <Input
                  value={netbankingId}
                  onChange={(e) => setNetbankingId(e.target.value)}
                  className={`enterprise-input ${showErrors && !netbankingId ? "error" : ""}`}
                  placeholder="Customer ID"
                />
              </div>
            </>
          )}

          <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer select-none">
            <Checkbox
              checked={termsAccepted}
              onCheckedChange={(v) => setTermsAccepted(v === true)}
              className="rounded-[var(--radius)] border-gray-300 data-[state=checked]:bg-[var(--primary-bank)] data-[state=checked]:border-[var(--primary-bank)]"
            />
            I agree to the Terms & Conditions described in the notice here.
          </label>

          {!showOtp && (
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" className="h-11 px-6" onClick={handleBack}>
                Cancel
              </Button>
              <Button
                type="button"
                className="btn-primary h-11 px-6"
                onClick={handleVerify}
                disabled={isVerifying || !isFormValid}
              >
                {method === "credit" ? "Verify" : "Login to Verify"}
              </Button>
            </div>
          )}

          {showOtp && (
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div>
                <label className="form-label">Registered Mobile Number</label>
                <Input
                  value={maskedPhone}
                  readOnly
                  className="enterprise-input bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="form-label">Enter OTP</label>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className={`enterprise-input ${showErrors && !isOtpValid ? "error" : ""}`}
                  placeholder="6-digit OTP"
                  inputMode="numeric"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" className="h-11 px-6" onClick={handleBack}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="btn-primary h-11 px-6"
                  onClick={handleOtpContinue}
                  disabled={!isOtpValid}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </StepCard>
  );
}
