/* src/app/components/ui/button.tsx */
/* IMPORTANT: This file is customized from the shadcn/ui original */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion" // Import framer-motion

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius)] text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#42265e] text-white hover:bg-[#2e1a42]",
        // ADDED a new variant as per the brief
        "primary-cta":
          "bg-[#42265e] text-white hover:bg-[#2e1a42] transition-transform duration-200 ease-out hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-[#42265e]/30 bg-white text-[#42265e] hover:bg-[#F0EBF4] hover:text-[#42265e]",
        secondary:
          "bg-[#c84417] text-white hover:bg-[#a83812]",
        ghost: "hover:bg-[#F0EBF4] text-[#42265e]",
        link: "text-[#42265e] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"; // Use "button" not "motion.button" by default

    // Wrap with motion.button ONLY for the CTA variant
    if (variant === "primary-cta") {
      return (
        <motion.button
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          whileTap={{ scale: 0.98 }}
          {...(props as any)}
        />
      )
    }

    // Render a normal button for all other variants
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }