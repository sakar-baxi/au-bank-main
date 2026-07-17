import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  TrendingUp,
  Home,
  Car,
  Truck,
  Coins,
  Wallet,
  Landmark,
  Gem,
} from "lucide-react";
import type { Offer } from "@/app/components/shared/PreApprovedOfferModal";

export type AuOfferCategory = "credit-card" | "premium-account" | "loan";

export type AuBankOffer = Offer & {
  category: AuOfferCategory;
  keywords?: string[];
};

/** Canonical AU Bank offerings shown at journey completion / cross-sell. */
export const AU_BANK_OFFERS: AuBankOffer[] = [
  // Credit cards
  {
    id: "zenith-plus-credit-card",
    category: "credit-card",
    icon: CreditCard,
    title: "Zenith+ Credit Card",
    desc: "Premium metal card with lounge access & lifestyle benefits",
    highlight: "Metal card",
    gradient: "from-[#42265e] to-[#2e1a42]",
    applyLabel: "Apply for Zenith+",
    keywords: ["credit card", "zenith", "metal"],
  },
  {
    id: "ananta-credit-card",
    category: "credit-card",
    icon: CreditCard,
    title: "Ananta Credit Card",
    desc: "Everyday rewards and lifestyle offers from AU Bank",
    highlight: "Rewards",
    gradient: "from-blue-500 to-indigo-600",
    applyLabel: "Apply for Ananta",
    keywords: ["credit card", "ananta"],
  },
  {
    id: "laksya-credit-card",
    category: "credit-card",
    icon: CreditCard,
    title: "Laksya Credit Card",
    desc: "Purpose-led card for your spending goals",
    highlight: "Goal-based",
    gradient: "from-cyan-500 to-blue-600",
    applyLabel: "Apply for Laksya",
    keywords: ["credit card", "laksya", "lakshya"],
  },
  {
    id: "au-cs-credit-card",
    category: "credit-card",
    icon: CreditCard,
    title: "AU CS Credit Card",
    desc: "AU Bank co-branded / CS credit card offering",
    highlight: "AU CS",
    gradient: "from-indigo-500 to-violet-600",
    applyLabel: "Apply for AU CS Card",
    keywords: ["credit card", "cs"],
  },
  {
    id: "au-ca-metal-credit-card",
    category: "credit-card",
    icon: CreditCard,
    title: "AU CA Metal Credit Card",
    desc: "Metal credit card crafted for premium banking customers",
    highlight: "Metal",
    gradient: "from-slate-700 to-[#42265e]",
    applyLabel: "Apply for CA Metal Card",
    keywords: ["credit card", "ca", "metal"],
  },

  // Premium banking accounts
  {
    id: "au-ivy-account",
    category: "premium-account",
    icon: Landmark,
    title: "AU ivy Account",
    desc: "AU ivy Banking Program — exclusive premium banking",
    highlight: "Premium banking",
    gradient: "from-[#c84417] to-amber-600",
    applyLabel: "Explore AU ivy",
    keywords: ["ivy", "account", "premium", "banking"],
  },
  {
    id: "au-royale-account",
    category: "premium-account",
    icon: Gem,
    title: "AU Royale Account",
    desc: "AU Royale Banking Program — elevated relationship banking",
    highlight: "Royale",
    gradient: "from-amber-500 to-[#c84417]",
    applyLabel: "Explore AU Royale",
    keywords: ["royale", "account", "premium", "banking"],
  },

  // Other loan / lending services
  {
    id: "personal-loan",
    category: "loan",
    icon: TrendingUp,
    title: "Personal Loan",
    desc: "Instant personal finance for eligible salaried customers",
    highlight: "Quick disbursal",
    gradient: "from-violet-500 to-purple-600",
    applyLabel: "Apply for Personal Loan",
    keywords: ["personal loan", "pl"],
  },
  {
    id: "home-loan",
    category: "loan",
    icon: Home,
    title: "Home Loan",
    desc: "Home purchase and refinance options from AU Bank",
    highlight: "Home finance",
    gradient: "from-amber-500 to-orange-600",
    applyLabel: "Apply for Home Loan",
    keywords: ["home loan", "housing"],
  },
  {
    id: "vehicle-loan",
    category: "loan",
    icon: Car,
    title: "Vehicle Loan",
    desc: "Finance your next car or two-wheeler with AU Bank",
    highlight: "Auto finance",
    gradient: "from-blue-500 to-sky-600",
    applyLabel: "Apply for Vehicle Loan",
    keywords: ["vehicle loan", "car loan", "auto"],
  },
  {
    id: "loan-against-vehicle",
    category: "loan",
    icon: Truck,
    title: "Loan Against Vehicle",
    desc: "Unlock liquidity against your existing vehicle",
    highlight: "Against vehicle",
    gradient: "from-teal-500 to-emerald-600",
    applyLabel: "Apply for LAV",
    keywords: ["loan against vehicle", "lav"],
  },
  {
    id: "gold-loan",
    category: "loan",
    icon: Coins,
    title: "Gold Loan",
    desc: "Quick funds against your gold jewellery",
    highlight: "Gold",
    gradient: "from-yellow-500 to-amber-600",
    applyLabel: "Apply for Gold Loan",
    keywords: ["gold loan"],
  },
  {
    id: "loan-on-credit-card",
    category: "loan",
    icon: Wallet,
    title: "Loan on Credit Card",
    desc: "Convert eligible credit card spends into easy EMIs",
    highlight: "Card loan",
    gradient: "from-rose-500 to-pink-600",
    applyLabel: "Apply for Card Loan",
    keywords: ["loan on credit card", "emi", "card loan"],
  },
];

export function filterAuBankOffers(query: string, offers: AuBankOffer[] = AU_BANK_OFFERS): AuBankOffer[] {
  const q = query.trim().toLowerCase();
  if (!q) return offers;
  return offers.filter((o) => {
    const haystack = [o.title, o.desc, o.id, o.category, ...(o.keywords || [])]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function isLoanOffer(offer: { id: string; category?: string }): boolean {
  return offer.category === "loan" || offer.id.includes("loan");
}

/** Icons used only for type re-export convenience (tree-shake unused via catalog). */
export type { LucideIcon };
