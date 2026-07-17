# Mahindra Finance Journey - Design System Theme

This document outlines the visual identity and design tokens used in the Mahindra Finance Personal Loan journey. Use these guidelines to maintain consistency across new prototypes and journey improvements.

## 1. Color Palette

### Primary Brand Colors
- **Mahindra Red (Primary)**: `#EE1B24`
  - Used for primary buttons, highlights, active states, and brand iconography.
- **Mahindra Dark Red**: `#C41E3A`
  - Used for hover states and secondary branding elements.
- **Surface Red**: `#FFF5F5`
  - Ultra-light red used for backgrounds of highlighted sections or banners.

### Neutral Colors
- **Background (Main)**: `#F8FAFC` (`bg-slate-50`)
- **Surface (Cards/Containers)**: `#FFFFFF`
- **Text (Primary)**: `#0F172A` (`text-slate-900`)
- **Text (Secondary)**: `#64748B` (`text-slate-500`)
- **Text (Muted)**: `#94A3B8` (`text-slate-400`)
- **Borders**: `#F1F5F9` (`border-slate-100`) or `#E2E8F0` (`border-slate-200`)

### Semantic Colors
- **Success**: `#059669` (Emerald 600)
- **Success Light**: `#ECFDF5` (Emerald 50)
- **Warning**: `#D97706` (Amber 600)
- **Error**: `#DC2626` (Red 600)

---

## 2. Typography

- **Font Family**: `Inter` or `Plus Jakarta Sans`
- **Heading 1**: `text-2xl` to `text-4xl`, `font-black`, `tracking-tight`
- **Heading 2**: `text-xl`, `font-bold`, `tracking-tight`
- **Labels**: `text-[10px]` to `text-xs`, `font-bold`, `uppercase`, `tracking-widest`
- **Body**: `text-sm`, `font-medium`, `leading-relaxed`

---

## 3. UI Components & Layout

### Containers & Cards
- **Outer Radius**: `rounded-[2.5rem]` or `3xl` for a soft, premium feel.
- **Inner Radius**: `rounded-2xl` for sub-components.
- **Shadows**: `shadow-xl shadow-slate-200/50` for depth.
- **Padding**: Standard `p-6` (mobile) to `p-10` (desktop).

### Buttons
- **Primary Button**:
  - `bg-[#EE1B24]`
  - `text-white`
  - `font-black`
  - `uppercase`
  - `tracking-widest`
  - `h-14` or `h-16` (height)
  - `rounded-2xl`
  - `shadow-lg shadow-[#EE1B24]/20`
- **Secondary/Outline**:
  - `border-slate-200`
  - `bg-white`
  - `text-slate-700`

### Inputs & Controls
- **Range Sliders**: `accent-[#EE1B24]`, `h-2`, `bg-slate-100`.
- **Selection Chips**: `border-2`, `font-black`, active state: `border-[#EE1B24] bg-[#EE1B24]/5`.

---

## 4. Iconography & Motion

- **Icons**: Use `Lucide-react` icons. Maintain a consistent stroke width (default `2`).
- **Motion (Framer Motion)**:
  - **Entrance**: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`
  - **Scale Transitions**: `initial={{ scale: 0.95 }} animate={{ scale: 1 }}`
  - **Transitions**: Use smooth springs or `easeOut` durations (approx `0.4s`).

---

## 5. Mobile Experience

- **Safe Areas**: Use `env(safe-area-inset-bottom)` for fixed footers.
- **Compact Layouts**: On screens < 640px, reduce vertical spacing and font sizes slightly (`text-xl` for main titles) to ensure content remains above the fold.
- **Scroll Indicators**: Hide scrollbars for a cleaner UI (`no-scrollbar`).
