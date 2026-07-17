/* src/app/context/stepDefinitions.ts */

import type { ComponentType } from "react";
import StepWelcome from "@/app/components/steps/StepWelcome";
import StepJourneySelection from "@/app/components/steps/StepJourneySelection";
import StepCombinedDetails from "@/app/components/steps/StepCombinedDetails";
import StepKycChoice from "@/app/components/steps/StepKycChoice";
import StepContactDetails from "@/app/components/steps/StepContactDetails";
import StepKycDetails from "@/app/components/steps/StepKycDetails";
import StepComplete from "@/app/components/steps/StepComplete";
import StepVideoKyc from "@/app/components/steps/StepVideoKyc";
import StepVideoKycEnhanced from "@/app/components/steps/StepVideoKycEnhanced";
import StepEkycHandler from "@/app/components/steps/StepEkycHandler";
import StepPhysicalKyc from "@/app/components/steps/StepPhysicalKyc";
import StepAccountConversion from "@/app/components/steps/StepAccountConversion";
import StepProfessionalDetailsExpress from "@/app/components/steps/StepProfessionalDetailsExpress";
import StepReviewApplication from "@/app/components/steps/StepReviewApplication";
import StepIncomeDetails from "@/app/components/steps/StepIncomeDetails";
import StepNomineeDetails from "@/app/components/steps/StepNomineeDetails";
import StepAutoConversion from "@/app/components/steps/StepAutoConversion";
import StepConversionVerification from "@/app/components/steps/StepConversionVerification";
import StepEtbIncomeDeclarations from "@/app/components/steps/StepEtbIncomeDeclarations";
import StepEtbWelcome from "@/app/components/steps/StepEtbWelcome";
import StepEtbNkWelcome from "@/app/components/steps/StepEtbNkWelcome";
import StepNtbConversionWelcome from "@/app/components/steps/StepNtbConversionWelcome";
import StepEtbNkKycChoice from "@/app/components/steps/StepEtbNkKycChoice";
import StepNtbConversionKycChoice from "@/app/components/steps/StepNtbConversionKycChoice";
import StepEtbComplete from "@/app/components/steps/StepEtbComplete";
import StepEtbNkComplete from "@/app/components/steps/StepEtbNkComplete";
import StepNtbConversionComplete from "@/app/components/steps/StepNtbConversionComplete";
import StepEtbNkPhysicalKyc from "@/app/components/steps/StepEtbNkPhysicalKyc";
import StepNtbConversionPhysicalKyc from "@/app/components/steps/StepNtbConversionPhysicalKyc";
import StepEtbNkEkycHandler from "@/app/components/steps/StepEtbNkEkycHandler";
import StepEtbNkIncomeDeclarations from "@/app/components/steps/StepEtbNkIncomeDeclarations";
import StepEtbNkConversionVerification from "@/app/components/steps/StepEtbNkConversionVerification";
import StepNtbConversionProfileDetails from "@/app/components/steps/StepNtbConversionProfileDetails";
import StepNtbConversionReviewApplication from "@/app/components/steps/StepNtbConversionReviewApplication";
import StepJourneyModeSelection from "@/app/components/steps/StepJourneyModeSelection";
import StepConversationalWelcome from "@/app/components/steps/StepConversationalWelcome";
import StepConversationalConfirm from "@/app/components/steps/StepConversationalConfirm";
import StepResume from "@/app/components/steps/StepResume";
import StepAccountOpened from "@/app/components/steps/StepAccountOpened";
import StepPreApprovedOffers from "@/app/components/steps/StepPreApprovedOffers";

import StepIncomeAndNominee from "@/app/components/steps/StepIncomeAndNominee";

import StepPLVerifyDetails from "@/app/components/steps/StepPLVerifyDetails";
import StepPLBureauConsent from "@/app/components/steps/StepPLBureauConsent";
import StepPLSelectPlan from "@/app/components/steps/StepPLSelectPlan";
import StepPLKycVerification from "@/app/components/steps/StepPLKycVerification";
import StepPLDisbursalAccount from "@/app/components/steps/StepPLDisbursalAccount";
import StepPLEnachSetup from "@/app/components/steps/StepPLEnachSetup";
import StepPLSubmitApplication from "@/app/components/steps/StepPLSubmitApplication";
import StepPLComplete from "@/app/components/steps/StepPLComplete";

import StepMahindraLanding from "@/app/components/steps/StepMahindraLanding";
import StepMahindraLogin from "@/app/components/steps/StepMahindraLogin";
import StepMahindraTncSelection from "@/app/components/steps/StepMahindraTncSelection";
import StepMahindraHRMS from "@/app/components/steps/StepMahindraHRMS";
import StepMahindraLoanCustomization from "@/app/components/steps/StepMahindraLoanCustomization";
import StepMahindraDigitalKyc from "@/app/components/steps/StepMahindraDigitalKyc";
import StepMahindraEMandate from "@/app/components/steps/StepMahindraEMandate";
import StepMahindraAgreement from "@/app/components/steps/StepMahindraAgreement";
import StepMahindraFinalPreview from "@/app/components/steps/StepMahindraFinalPreview";

import StepAVConsent from "@/app/components/steps/StepAVConsent";
import StepAVWelcome from "@/app/components/steps/StepAVWelcome";
import StepAVStatus from "@/app/components/steps/StepAVStatus";
import StepAVType from "@/app/components/steps/StepAVType";
import StepAVRequirements from "@/app/components/steps/StepAVRequirements";
import StepAVLocationAccess from "@/app/components/steps/StepAVLocationAccess";
import StepAVVerifyingLocation from "@/app/components/steps/StepAVVerifyingLocation";
import StepAVCapturePhoto from "@/app/components/steps/StepAVCapturePhoto";
import { StepAVAddressProof, StepAVIdVerification, StepAVFaceVerification } from "@/app/components/steps/StepAVDocuments";
import StepAVResidentialInfo from "@/app/components/steps/StepAVResidentialInfo";
import StepAVComplete from "@/app/components/steps/StepAVComplete";

export type UserType = "ntb" | "etb-nk" | "etb";
export type JourneyType =
  | "ntb"
  | "ntb-conversion"
  | "etb-nk"
  | "etb"
  | "conversational"
  | "personal-loan"
  | "auto-loan"
  | "education-loan"
  | "address-verification";

export interface Step {
  id: string;
  title: string;
}

export const makeJourneyStepId = (journeyType: JourneyType, baseId: string) =>
  `${journeyType}:${baseId}`;

const BASE_STEP_TITLES: Record<string, string> = {
  // Salary Account Journey steps
  welcome: "Verification",
  kycChoice: "Select KYC",
  ekycHandler: "e-KYC Verification",
  physicalKyc: "Physical KYC",
  profileDetails: "Your Details",
  incomeAndNominee: "Income & Nominee",
  autoConversion: "Account Conversion",
  conversionVerification: "Verification",
  etbIncomeDeclarations: "Income & Declarations",
  reviewApplication: "Final Verification",
  videoKyc: "Video KYC",

  // Mahindra Starting Pages
  mahindraLanding: "Welcome",
  mahindraLogin: "Login",
  mahindraTncSelection: "T&C Selection",
  mahindraHRMS: "HRMS & Payroll",
  mahindraLoanCustomization: "Loan Customization",
  mahindraDigitalKyc: "Verify KYC",
  mahindraEMandate: "Automate EMIs",
  mahindraAgreement: "Loan Agreement",
  mahindraFinalPreview: "Review Application",

  // Address Verification
  avConsent: "Consent",
  avWelcome: "Welcome",
  avStatus: "Verification Status",
  avType: "Address Type",
  avRequirements: "Requirements",
  avLocationAccess: "Location Access",
  avVerifyingLocation: "Verifying Location",
  avCaptureExterior: "Outside Photo",
  avCaptureInterior1: "Interior Photo 1",
  avCaptureInterior2: "Interior Photo 2",
  avAdditionalPhoto: "Additional Photo",
  avAddressProof: "Address Proof",
  avIdVerification: "ID Verification",
  avFaceVerification: "Face Verification",
  avResidentialInfo: "Additional Info",
  avComplete: "Verification Complete",

  verifyDetails: "Verify Details",
  bureauConsent: "Bureau Consent",
  kycVerification: "KYC Verification",
  disbursalAccount: "Disbursal Account",
  enachSetup: "eNACH Setup",
  submitApplication: "Submit Application",
  complete: "Success",
};

const addJourneySteps = (journeyType: JourneyType, stepIds: string[]) => {
  const entries: Record<string, Step> = {};
  stepIds.forEach((baseId) => {
    entries[makeJourneyStepId(journeyType, baseId)] = {
      id: makeJourneyStepId(journeyType, baseId),
      title: BASE_STEP_TITLES[baseId] || baseId,
    };
  });
  return entries;
};

export const ALL_STEPS: Record<string, Step> = {
  // ── Salary Account Opening journeys ─────────────────────────────────────
  ...addJourneySteps("ntb", [
    "welcome",
    "kycChoice",
    "ekycHandler",
    "profileDetails",
    "incomeAndNominee",
    "reviewApplication",
    "videoKyc",
    "complete",
  ]),
  ...addJourneySteps("ntb-conversion", [
    "welcome",
    "kycChoice",
    "profileDetails",
    "incomeAndNominee",
    "reviewApplication",
    "complete",
  ]),
  ...addJourneySteps("etb-nk", [
    "etbIncomeDeclarations",
    "conversionVerification",
    "complete",
    // Kept for legacy resume / physical branch compatibility
    "welcome",
    "kycChoice",
    "ekycHandler",
    "physicalKyc",
  ]),
  ...addJourneySteps("etb", [
    "welcome",
    "autoConversion",
    "complete",
  ]),
  // ── Personal Loan journey ────────────────────────────────────────────────
  ...addJourneySteps("personal-loan", [
    "mahindraLogin",
    "mahindraTncSelection",
    "mahindraLoanCustomization",
    "mahindraDigitalKyc",
    "mahindraEMandate",
    "mahindraFinalPreview",
    "mahindraAgreement",
    "complete",
    "avConsent",
    "avWelcome",
    "avStatus",
    "avType",
    "avRequirements",
    "avLocationAccess",
    "avVerifyingLocation",
    "avCaptureExterior",
    "avAddressProof",
    "avIdVerification",
    "avFaceVerification",
    "avComplete",
  ]),
  // Placeholder journeys: same screens as personal loan; can be customized later.
  ...addJourneySteps("auto-loan", [
    "mahindraLogin",
    "mahindraTncSelection",
    "mahindraLoanCustomization",
    "mahindraDigitalKyc",
    "mahindraEMandate",
    "mahindraFinalPreview",
    "mahindraAgreement",
    "complete",
    "avConsent",
    "avWelcome",
    "avStatus",
    "avType",
    "avRequirements",
    "avLocationAccess",
    "avVerifyingLocation",
    "avCaptureExterior",
    "avAddressProof",
    "avIdVerification",
    "avFaceVerification",
    "avComplete",
  ]),
  ...addJourneySteps("education-loan", [
    "mahindraLogin",
    "mahindraTncSelection",
    "mahindraLoanCustomization",
    "mahindraDigitalKyc",
    "mahindraEMandate",
    "mahindraFinalPreview",
    "mahindraAgreement",
    "complete",
    "avConsent",
    "avWelcome",
    "avStatus",
    "avType",
    "avRequirements",
    "avLocationAccess",
    "avVerifyingLocation",
    "avCaptureExterior",
    "avAddressProof",
    "avIdVerification",
    "avFaceVerification",
    "avComplete",
  ]),
  ...addJourneySteps("address-verification", [
    "avConsent",
    "avWelcome",
    "avStatus",
    "avType",
    "avRequirements",
    "avLocationAccess",
    "avVerifyingLocation",
    "avCaptureExterior",
    "avAddressProof",
    "avIdVerification",
    "avFaceVerification",
    "avComplete",
  ]),
};

export const STEP_COMPONENTS: Record<string, ComponentType> = {
  // ── NTB (New To Bank) salary journey ────────────────────────────────────
  [makeJourneyStepId("ntb", "welcome")]: StepWelcome,
  [makeJourneyStepId("ntb", "kycChoice")]: StepKycChoice,
  [makeJourneyStepId("ntb", "ekycHandler")]: StepEkycHandler,
  [makeJourneyStepId("ntb", "profileDetails")]: StepCombinedDetails,
  [makeJourneyStepId("ntb", "incomeAndNominee")]: StepIncomeAndNominee,
  [makeJourneyStepId("ntb", "reviewApplication")]: StepReviewApplication,
  [makeJourneyStepId("ntb", "videoKyc")]: StepVideoKyc,
  [makeJourneyStepId("ntb", "complete")]: StepComplete,

  // ── NTB-Conversion salary journey ───────────────────────────────────────
  [makeJourneyStepId("ntb-conversion", "welcome")]: StepNtbConversionWelcome,
  [makeJourneyStepId("ntb-conversion", "kycChoice")]: StepNtbConversionKycChoice,
  [makeJourneyStepId("ntb-conversion", "profileDetails")]: StepNtbConversionProfileDetails,
  [makeJourneyStepId("ntb-conversion", "incomeAndNominee")]: StepIncomeAndNominee,
  [makeJourneyStepId("ntb-conversion", "reviewApplication")]: StepNtbConversionReviewApplication,
  [makeJourneyStepId("ntb-conversion", "complete")]: StepNtbConversionComplete,

  // ── ETB with KYC salary journey ─────────────────────────────────────────
  [makeJourneyStepId("etb-nk", "welcome")]: StepEtbNkWelcome,
  [makeJourneyStepId("etb-nk", "kycChoice")]: StepEtbNkKycChoice,
  [makeJourneyStepId("etb-nk", "ekycHandler")]: StepEtbNkEkycHandler,
  [makeJourneyStepId("etb-nk", "physicalKyc")]: StepEtbNkPhysicalKyc,
  [makeJourneyStepId("etb-nk", "etbIncomeDeclarations")]: StepEtbNkIncomeDeclarations,
  [makeJourneyStepId("etb-nk", "conversionVerification")]: StepEtbNkConversionVerification,
  [makeJourneyStepId("etb-nk", "complete")]: StepEtbNkComplete,

  // ── ETB Auto-Conversion salary journey ──────────────────────────────────
  [makeJourneyStepId("etb", "welcome")]: StepEtbWelcome,
  [makeJourneyStepId("etb", "autoConversion")]: StepAutoConversion,
  [makeJourneyStepId("etb", "etbIncomeDeclarations")]: StepEtbIncomeDeclarations,
  [makeJourneyStepId("etb", "conversionVerification")]: StepConversionVerification,
  [makeJourneyStepId("etb", "complete")]: StepEtbComplete,

  // ── Personal Loan journey (preserved) ───────────────────────────────────
  [makeJourneyStepId("personal-loan", "mahindraLanding")]: StepMahindraLanding,
  [makeJourneyStepId("personal-loan", "mahindraLogin")]: StepMahindraLogin,
  [makeJourneyStepId("personal-loan", "mahindraTncSelection")]: StepMahindraTncSelection,
  [makeJourneyStepId("personal-loan", "mahindraHRMS")]: StepMahindraHRMS,
  [makeJourneyStepId("personal-loan", "mahindraLoanCustomization")]: StepMahindraLoanCustomization,
  [makeJourneyStepId("personal-loan", "mahindraDigitalKyc")]: StepMahindraDigitalKyc,
  [makeJourneyStepId("personal-loan", "mahindraEMandate")]: StepMahindraEMandate,
  [makeJourneyStepId("personal-loan", "mahindraFinalPreview")]: StepMahindraFinalPreview,
  [makeJourneyStepId("personal-loan", "mahindraAgreement")]: StepMahindraAgreement,
  [makeJourneyStepId("personal-loan", "complete")]: StepPLComplete,

  [makeJourneyStepId("personal-loan", "avConsent")]: StepAVConsent,
  [makeJourneyStepId("personal-loan", "avWelcome")]: StepAVWelcome,
  [makeJourneyStepId("personal-loan", "avStatus")]: StepAVStatus,
  [makeJourneyStepId("personal-loan", "avType")]: StepAVType,
  [makeJourneyStepId("personal-loan", "avRequirements")]: StepAVRequirements,
  [makeJourneyStepId("personal-loan", "avLocationAccess")]: StepAVLocationAccess,
  [makeJourneyStepId("personal-loan", "avVerifyingLocation")]: StepAVVerifyingLocation,
  [makeJourneyStepId("personal-loan", "avCaptureExterior")]: StepAVCapturePhoto,
  [makeJourneyStepId("personal-loan", "avCaptureInterior1")]: StepAVCapturePhoto,
  [makeJourneyStepId("personal-loan", "avCaptureInterior2")]: StepAVCapturePhoto,
  [makeJourneyStepId("personal-loan", "avAdditionalPhoto")]: StepAVCapturePhoto,
  [makeJourneyStepId("personal-loan", "avAddressProof")]: StepAVAddressProof,
  [makeJourneyStepId("personal-loan", "avIdVerification")]: StepAVIdVerification,
  [makeJourneyStepId("personal-loan", "avFaceVerification")]: StepAVFaceVerification,
  [makeJourneyStepId("personal-loan", "avResidentialInfo")]: StepAVResidentialInfo,
  [makeJourneyStepId("personal-loan", "avComplete")]: StepAVComplete,

  [makeJourneyStepId("address-verification", "avConsent")]: StepAVConsent,
  [makeJourneyStepId("address-verification", "avWelcome")]: StepAVWelcome,
  [makeJourneyStepId("address-verification", "avStatus")]: StepAVStatus,
  [makeJourneyStepId("address-verification", "avType")]: StepAVType,
  [makeJourneyStepId("address-verification", "avRequirements")]: StepAVRequirements,
  [makeJourneyStepId("address-verification", "avLocationAccess")]: StepAVLocationAccess,
  [makeJourneyStepId("address-verification", "avVerifyingLocation")]: StepAVVerifyingLocation,
  [makeJourneyStepId("address-verification", "avCaptureExterior")]: StepAVCapturePhoto,
  [makeJourneyStepId("address-verification", "avCaptureInterior1")]: StepAVCapturePhoto,
  [makeJourneyStepId("address-verification", "avCaptureInterior2")]: StepAVCapturePhoto,
  [makeJourneyStepId("address-verification", "avAdditionalPhoto")]: StepAVCapturePhoto,
  [makeJourneyStepId("address-verification", "avAddressProof")]: StepAVAddressProof,
  [makeJourneyStepId("address-verification", "avIdVerification")]: StepAVIdVerification,
  [makeJourneyStepId("address-verification", "avFaceVerification")]: StepAVFaceVerification,
  [makeJourneyStepId("address-verification", "avResidentialInfo")]: StepAVResidentialInfo,
  [makeJourneyStepId("address-verification", "avComplete")]: StepAVComplete,
};

// Reuse personal-loan step UIs for auto-loan / education-loan (modular placeholders).
const PL_LIKE_JOURNEYS: JourneyType[] = ["auto-loan", "education-loan"];
const stepComponentsMutable = STEP_COMPONENTS as Record<string, ComponentType>;
for (const jt of PL_LIKE_JOURNEYS) {
  for (const key of Object.keys(STEP_COMPONENTS)) {
    if (!key.startsWith("personal-loan:")) continue;
    const suffix = key.slice("personal-loan:".length);
    const nk = makeJourneyStepId(jt, suffix);
    if (!stepComponentsMutable[nk]) {
      stepComponentsMutable[nk] = STEP_COMPONENTS[key]!;
    }
  }
}