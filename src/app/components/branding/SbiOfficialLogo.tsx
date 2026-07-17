"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export const AU_OFFICIAL_LOGO_SRC = "/au-bank-logo.png";
export const AU_SYMBOL_SRC = "/au-bank-logo.png";

const INTRINSIC_W = 600;
const INTRINSIC_H = 600;
/** Official circular symbol asset (transparent PNG, square canvas). */
const SYMBOL_INTRINSIC = 600;

type SbiOfficialLogoProps = {
  className?: string;
  /** Tailwind classes limiting rendered height (logo scales proportionally). */
  heightClass?: string;
  /** Tailwind classes limiting max width */
  widthClass?: string;
  priority?: boolean;
};

/**
 * Official AU Bank logo. Uses object-contain; never crops or stretches.
 */
export function SbiOfficialLogo({
  className,
  heightClass = "max-h-10",
  widthClass = "max-w-[160px]",
  priority,
}: SbiOfficialLogoProps) {
  return (
    <Image
      src={AU_OFFICIAL_LOGO_SRC}
      alt="AU Bank"
      width={INTRINSIC_W}
      height={INTRINSIC_H}
      priority={priority}
      className={cn("w-auto object-contain shrink-0", heightClass, widthClass, className)}
    />
  );
}

type SbiSidebarSymbolProps = {
  className?: string;
  /** Size / layout overrides (applies to the image; no outer wrapper). */
  boxClassName?: string;
  priority?: boolean;
};

/**
 * AU Bank logo mark — transparent PNG on the page background.
 * No white tile, border, shadow, or padding around the mark.
 */
export function SbiSidebarSymbol({ className, boxClassName, priority }: SbiSidebarSymbolProps) {
  return (
    <Image
      src={AU_SYMBOL_SRC}
      alt="AU Bank"
      width={SYMBOL_INTRINSIC}
      height={SYMBOL_INTRINSIC}
      priority={priority}
      className={cn(
        "h-11 w-11 shrink-0 object-contain bg-transparent p-0 shadow-none ring-0 border-0 outline-none",
        className,
        boxClassName,
      )}
    />
  );
}
