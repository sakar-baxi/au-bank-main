# Internal Tools Design Guide

**Purpose.** A shared design system for anyone building internal dashboards, prototypes, or operational tools. Tokens, type, motion, components — defined once, consumed everywhere via CSS custom properties so a single value change propagates across every surface.

**Audience.** Engineers and PMs who need to ship a credible internal tool quickly without reinventing visual decisions every time. Use this as the default starting point; deviate only when you have a reason you can articulate.

**How to use this doc.** Each section gives you (1) the token or rule, (2) the rationale, and (3) the anti-pattern it counters. If you're tempted to skip the rationale, don't — the rationale is what lets you make the right call when this doc doesn't cover your specific case.

---

## 0. Design principles

These are the principles every decision below traces back to. When two principles conflict, the one earlier in this list wins.

1. **Honest before pretty.** A surface that looks beautiful but obscures sample size, freshness, or uncertainty is wrong. Use placeholders (`"—"`, "Collecting…") rather than fabricated zeros. Loading states share the same muted token as missing data — both mean "I don't know yet."
2. **Synthesized, not raw.** A dashboard is not a data dump. Every chart should support a sentence. Every metric should carry its window. Type hierarchy puts weight on the *interpretation*, not the number alone.
3. **One primary axis per surface.** Decide what the user is comparing — products, people, time, regions — and let the layout commit to it. Mixing axes ("metric first, drill-down second" + "team first, status second") on one page erodes scanability.
4. **Expressive restraint.** Silence by default; landmark where decisions land. One large serif headline per surface earns the eye; the rest is rhythm and quiet. Intensity *concentrated* beats intensity *spread*.
5. **Drama proportional to status.** Same row template, different visual weight. A row in trouble should be visually heavier than a row on track — without a shadow, without a stripe, without flashing. Uniformity across statuses is the failure mode.
6. **Confidence proportional to data.** When you don't have enough samples (a common case in early-stage tools), say so visibly. Skeletons, "—", and `data-state=loading` use the same muted token. Don't smooth over thin data with confident-looking averages.

---

## 1. Colour

### 1.0 Strategy

**Committed where it matters; restrained everywhere else.** Use saturated row tints and surface tints to communicate state — color is how the eye finds trouble in two seconds. Outside of state communication, single accent only. Don't paint the whole UI.

Reference points: role-tinted dashboard rows like Stripe's, color-coded record states like Airtable's. *Not* a status board with neon. *Not* a dark-mode observability tool.

### 1.1 Surface

Warm cream on near-black ink. Chosen against the category reflex (most internal tools default to slate/navy + neon green or pure-grey neutrals).

```
--color-bg          oklch(0.985 0.005 85)   /* warm cream */
--color-bg-raised   oklch(0.995 0.003 85)   /* near-white, slight cream tint */
--color-bg-sunken   oklch(0.965 0.008 85)   /* breakdown panels, skeletons */
--color-ink         oklch(0.18  0.012 250)  /* near-black, cool to balance the warm bg */
--color-ink-muted   oklch(0.42  0.010 250)
--color-ink-faint   oklch(0.62  0.008 250)
--color-border      oklch(0.92  0.006 85)   /* tinted toward bg, never raw grey */
```

Use `oklch()`, not hex or HSL — perceptual lightness stays consistent across hues, which matters for tinted-row patterns.

**Why warm cream?** Pure-grey neutrals (`#fff`, `slate-50`) read as "AI made this" or "Tailwind default I didn't customize." A warm tint is one of the cheapest signals that someone made a deliberate choice.

### 1.2 Accent

A single accent reserved for selection, current scope, primary action, and one chosen status signal. Pick one that sits adjacent to the engineering-default blue/green without being it — deep teal is a good default, but indigo, plum, or rust all work. The rule is *one*.

```
--color-accent       oklch(0.52 0.10 200)   /* deep teal — pick your own hue */
--color-accent-bg    oklch(0.95 0.04 200)   /* tinted-bg variant */
--color-accent-ink   oklch(0.30 0.12 200)   /* on-cream text variant */
```

Anti-pattern: neon accents, big-bold-gradient hero metrics, founder-deck chrome. Internal tools are read by people doing work, not by investors being persuaded.

### 1.3 Status (colorblind-safe)

Use the Wong palette. It's accessible, well-tested, and gives you four distinguishable hues that survive grayscale.

```
--color-ok        oklch(0.55 0.13 240)   /* #0072B2 — Wong blue */
--color-info      oklch(0.72 0.13 230)   /* #56B4E9 — Wong sky */
--color-warn      oklch(0.74 0.16  65)   /* #E69F00 — Wong orange */
--color-bad       oklch(0.55 0.16  35)   /* #D55E00 — Wong vermillion */
--color-success   oklch(0.62 0.14 165)   /* #009E73 — Wong green, used sparingly */
```

**Status is never communicated by colour alone.** Always paired with an icon, a text label, or a positional cue. A "behind" pill carries the word "behind."

#### Status as surface — tinted-bg variants

For row-level state on lists and tables, use a low-chroma tint as the row background. Pair with an on-tint ink that maintains WCAG AA contrast.

```
--color-bad-bg     oklch(0.94 0.04  35)   /* warm vermillion wash */
--color-bad-ink    oklch(0.32 0.14  35)

--color-warn-bg    oklch(0.95 0.05  65)   /* warm amber wash */
--color-warn-ink   oklch(0.40 0.15  65)

--color-ok-bg      oklch(0.97 0.02 240)   /* near-cream cool wash */
--color-ok-ink     oklch(0.32 0.13 240)

--color-info-bg    oklch(0.96 0.03 230)
--color-info-ink   oklch(0.34 0.13 230)
```

**Dosage rule.** Tinted-bg variants are reserved for **row backgrounds on list-style surfaces**. The whole row tints — never a left/right stripe (see §9). They are not used on chips, charts, or general panel surfaces. Full-saturation tokens carry chips, sparklines, and status icons.

### 1.4 What to avoid

| Avoid | Use instead | Why |
|---|---|---|
| `bg-slate-50` body | `--color-bg` (warm cream) | Pure-grey neutrals are an "uncustomized" tell |
| `bg-white` panels | `--color-bg-raised` | Same — `#fff` reads as default |
| `border-slate-200` | `--color-border` (tinted) | Borders should belong to the surface family |
| Left-stripe accent (`border-left: 4px`) | Full row tint, or no marker | Stripes are an absolute anti-pattern (§9) |
| Emoji as iconography | `lucide-react` (§7) | Cross-platform-inconsistent; reads casual |
| Uniform row treatment when status differs | Tinted bg by status | Violates principle 5 |

---

## 2. Type

### 2.1 Families

Three families, each load-bearing. If you only use one or two, you're under-using the system.

| Family | Role | Why this one |
|---|---|---|
| **Source Serif 4** | Headlines, section labels, briefing sentences | Editorial voice. Reads as "a thoughtful person prepared this," not "a BI tool surfaced everything it knew." Optical sizing handles the title-vs-subhead range. |
| **Inter Tight** | Body, labels, microcopy, UI text | Humanist sans, denser at small sizes than Inter — better for compact metric strips. Tabular figures supported. |
| **JetBrains Mono** | Identifiers, durations, percentiles, deltas | Code-adjacent context. Forces the eye to read numerals as numerals, not as words. |

**Tabular figures enforced** on every metric value via `font-feature-settings: "tnum"`. Adjacent rows align column-for-column; the dashboard *looks* honest because adjacent values can be compared directly.

If you can't use these specific families (license, bundle), pick analogues with the same role split — one editorial serif, one humanist sans, one mono. Don't collapse them into a single family; the contrast is doing work.

### 2.2 Scale

1.125 ratio — the conservative "minor third." Smaller than Tailwind default. Compound steps should feel like rhythm, not jumps.

```
--text-xs    0.75rem    /* 12px — labels, captions */
--text-sm    0.875rem   /* 14px — body */
--text-base  1rem       /* 16px — secondary headings */
--text-lg    1.125rem   /* 18px — section titles */
--text-xl    1.266rem   /* ~20px — primary headings */
--text-2xl   1.424rem   /* ~23px — page titles */
--text-3xl   1.602rem   /* ~26px — section heads */
--text-4xl   1.802rem   /* ~29px — secondary names */
--text-5xl   2.281rem   /* ~37px — landmark headlines */
--text-6xl   2.887rem   /* ~46px — page-level landmark, one per surface */
```

Steps `--text-5xl` and `--text-6xl` are the **landmark scale** — at most one of each per surface. They carry principles 4 and 5. Source Serif 600 at `--text-5xl` is the emphasis. Weight 700+ stays banned (§2.3).

Line-heights:
- `--leading-tight` 1.2 — headlines, headings
- `--leading-normal` 1.5 — body, labels
- `--leading-relaxed` 1.7 — long-form (glossaries, drill-down explanations)

### 2.3 Weights

Source Serif 4: 400, 600. Inter Tight: 400, 500, 600. JetBrains Mono: 400, 500.

**Bold (700+) is avoided.** The tool should feel grown-up, not shouty. **Emphasis is *scale*, not weight.** Source Serif 600 at landmark sizes carries headline emphasis. 700/800/900 stays out of the codebase.

### 2.4 Loading

Self-host font files (`/public/fonts/`) with subset woff2 + `font-display: swap`. The FOUT shows the system fallback, then swaps when the brand font lands — honest about loading state.

Subset to Latin + the glyphs you actually use. Typical bundle: ~50–80 KB total.

---

## 3. Spacing

8px base unit. 1.125 ratio for compound spacings (mirrors the type scale — same rhythm everywhere).

```
--space-px     1px         /* hairline */
--space-1   0.25rem     /*  4px */
--space-2   0.5rem      /*  8px */
--space-3   0.75rem     /* 12px */
--space-4   1rem        /* 16px */
--space-5   1.5rem      /* 24px */
--space-6   2rem        /* 32px */
--space-8   3rem        /* 48px */
--space-10  4rem        /* 64px */
```

Layout grid: 4-column on tablet, 8-column on desktop (≥1024px), 12-column on wide (≥1440px). Compose larger surfaces by spanning grid columns rather than nesting flex containers — the grid keeps alignment honest.

---

## 4. Motion

**Purposeful, not absent.** Every animation answers a state question — *what just changed, where did it come from, where did it go.* Decoration is banned (no counter-ups, no chart-enter flourishes, no parallax). But silence-everywhere is also wrong; the tool should *speak* at the moment a question gets answered.

### 4.1 Tokens

```
--motion-duration-instant   100ms   /* state pulses */
--motion-duration-fast      150ms   /* hover, focus, tooltip */
--motion-duration-base      220ms   /* tab switches, drill-down, modal */
--motion-duration-slow      320ms   /* page-replace via View Transitions */
--motion-stagger            45ms    /* per-row stagger on initial paint */
--motion-ease               cubic-bezier(0.16, 1, 0.3, 1)   /* ease-out-expo — confident */
--motion-ease-soft          cubic-bezier(0.22, 1, 0.36, 1)  /* ease-out-quint — gentler */
```

**Bounce / elastic curves are banned.** Ease-out-expo carries state changes; ease-out-quint carries content reveals. That's the entire palette.

### 4.2 What animates

| Surface | Trigger | Effect | Duration | Ease |
|---|---|---|---|---|
| Tab switches | Click nav | View Transitions cross-fade | base | expo |
| Row → detail | Click row | View Transitions named-element morph | slow | expo |
| Initial paint | First load | Per-row stagger: opacity 0→1 + 4px translate-y | base | quint, 45ms stagger |
| Status change | Background poll lands new status | Row bg colour tween + 1-cycle ring pulse | base | expo |
| Freshness tick | New data lands | Timestamp cross-fade old → new | fast | expo |
| Progress bar | New % | Width tween | base | expo |
| Tooltip / dropdown | Hover/focus | Fade-in | fast | expo |
| Modal open | Click trigger | Backdrop fade + content scale (0.96 → 1) | base | expo |
| Skeleton → content | Initial load | Skeleton fade → content fade-in | fast | expo |

### 4.3 What never animates

- **Metric numerics.** They appear at their final value. No counter-up.
- **Charts on initial paint.** Disable the charting library's default enter animation. Animated transitions *between* data states are fine (e.g., width tween on a progress bar). Initial flourish is not.
- **Icons / chips / badges as decoration.** They flip state; they don't pulse for attention unless a status change just happened.
- **Hero choreography.** No orchestrated page-load entrance beyond the per-row stagger. People open internal tools to ask a question, not to watch a show.

### 4.4 Reduced motion

Honor `prefers-reduced-motion: reduce`. When true, all `--motion-duration-*` tokens collapse to 0, View Transitions skip to the post-state, the per-row stagger collapses to a single instant paint, and the status-flip pulse becomes an instant colour swap. No surface should *fail* under reduced motion — everything still arrives at the same final state.

---

## 5. Elevation

**Two carriers — neither is a shadow.** Shadow ramps are banned. Elevation is either a 1px tinted border or a saturated row tint. Color does the depth work.

```
--elevation-0       none                                       /* surface */
--elevation-1       inset 0 0 0 1px var(--color-border)        /* card / panel */
--elevation-tinted  /* set via --color-{status}-bg as the row background */
```

`--elevation-tinted` is the carrier introduced in §1.3 — rows whose status is `behind` / `blocked` / `at-risk` use it. On-track rows use `--elevation-0` (transparent over the page surface). The asymmetry is deliberate: it carries principle 5. A row in trouble is *visually heavier* than a row on track — no shadow needed.

Modals: backdrop overlay (`--color-overlay: oklch(0.18 0.012 250 / 0.5)`) + 1px border + scale entrance. Hover on interactive rows: tint deepens by ~3% lightness, no shadow.

---

## 6. Components

### 6.1 The primitive set

A small, opinionated set of primitives that should cover ~80% of any internal tool:

| Component | Purpose | Notes |
|---|---|---|
| `Headline` / `PageTitle` | The one landmark per surface | Source Serif 600 at `--text-5xl` or `--text-6xl` |
| `Table` / `IssueTable` | Tabular data | Borders → `--color-border`. Mono numerics for counts/durations. Tabular figures required. |
| `ProgressBar` | Bounded progress | Track → `--color-bg-sunken`. Fill → status semantic colour. |
| `Sparkline` | Trend in 80×24 | Recolour to accent / muted tokens. No axis labels. |
| `HealthGauge` | Single bounded health metric | Colour ramp consumes status tokens. |
| `StatusChip` | State as a label | Full-saturation text on tinted-bg same-family + icon + word. |
| `Dialog` (Radix) | Modal | Backdrop uses `--color-overlay`, content uses `--color-bg-raised` + `--elevation-1`. |
| `Tooltip` (Radix) | Hover/focus help | Same content surface as Dialog, smaller. |
| `Skeleton` | Loading placeholder | Shaped like the content it replaces, using `--color-bg-sunken`. |
| `StatusBar` | Header strip | Refresh time + per-source freshness + filter chips. |

### 6.2 Things to avoid building

- **KPI cards on dense overview surfaces.** They spread intensity instead of concentrating it. Prefer a per-entity row with embedded metrics.
- **Generic modals (`openModal('done')`, `openModal('blocked')`).** Prefer page-replace drill-downs with named-element View Transitions — the morph is a stronger spatial cue than a modal.
- **Ad-hoc badges (`bg-warn/10` "preview" pills).** Use `StatusChip` with the right semantic token instead.
- **Custom date pickers, custom dropdowns, custom toggles.** Use Radix or your existing primitive — these are solved problems and bespoke versions always have accessibility gaps.

### 6.3 Building a new landmark component

When you need a row-level component that carries the surface's identity (the "what is this page about" component), follow this template:

- **Outer container.** Background = `var(--color-{status}-bg, transparent)`. Padding `--space-5` block, `--space-6` inline. No border. Hover deepens the tint by ~3% lightness via a dedicated hover token (don't hardcode the value).
- **Left column (flex 1).** Source Serif 600 at `--text-5xl` for the entity name. Below it, Inter Tight 400 at `--text-base` for the briefing sentence (synthesized — see principle 2). Sentence ink: `--color-ink-muted` on transparent rows, `--color-{status}-ink` on tinted rows.
- **Right column (auto width).** Top-aligned, vertical stack: status chip → primary count in JetBrains Mono `--text-3xl` → sparkline at 80×24px.
- **Click affordance.** Whole row is the click target. View Transitions `view-transition-name: entity-{slug}` on the entity name; the detail page uses the same name on its title to morph.
- **Tabular figures** required on every numeric.
- **Stagger.** `--motion-stagger` × row index ms delay on entrance.
- **Reduced motion.** Stagger collapses to 0; tint applies instantly.

This component pattern owns ~70% of the visual identity of any list-style overview. Get it right; the rest follows.

---

## 7. Iconography

`lucide-react` exclusively. One icon family means consistent stroke weight, consistent optical alignment, consistent size scale. Mixing libraries is a tell.

### 7.1 Sizing

```
--icon-xs   12px   /* inline with body text */
--icon-sm   14px   /* inline with labels */
--icon-md   16px   /* button affordances */
--icon-lg   20px   /* nav rail */
```

Stroke width 1.5 throughout (lucide's default 2 reads heavy alongside humanist sans).

### 7.2 Common emoji-to-lucide swaps

If you're starting from a prototype that uses emoji, these are the replacements that keep meaning intact:

| Emoji | lucide | Typical use |
|---|---|---|
| ⚡ | `Zap` | Throughput / activity |
| 🔁 | `RotateCw` | Carryover / repeat |
| 🏃 | `Activity` | In-flight / running |
| ⏱️ | `Timer` | Lead time |
| 🛠️ | `Wrench` | Cycle time / maintenance |
| 🚨 | `AlertTriangle` | Breach / alert |
| 🔴 | `CircleAlert` | Blocked |
| ⏸ | `PauseCircle` | Stalled |
| 👤 | `UserX` | Unassigned |
| ✅ | `CircleCheck` | Done |
| 🔵 | `CircleDot` | In progress |
| 🐛 | `Bug` | Bugs |
| ⚠ | `AlertTriangle` | Overdue |

Decorative glyphs (✨ 🎯 💡) have no replacement — delete them. They're founder-deck chrome.

---

## 8. Accessibility

Non-negotiable. If a token or component fails one of these, fix the token or component, not the page using it.

- **WCAG AA contrast** on every text/background combo. Verify at token-definition time; component-level should never have to recheck.
- **Status never by colour alone.** Always paired with an icon (lucide) or text label. Even the "behind" pill carries the word "behind."
- **Keyboard navigation** across nav, tabs, drill-downs, filter bars. Radix primitives provide most of this; verify the rest with Playwright or manual tab-through.
- **`prefers-reduced-motion` honored.** §4.4.
- **Focus rings** standardised on `--color-accent` ring, 2px offset. Never the browser default — but always visible. No `outline: none` without a replacement.

---

## 9. Sub-pixel concerns (anti-patterns)

Any of these is a regression worth catching in code review.

| Anti-pattern | Why it's wrong | Mitigation |
|---|---|---|
| Stack 3+ shadows for "depth" | Reads as observability-tool reflex | Two carriers, neither a shadow (§5) |
| Animated counters on metrics | Founder-deck reflex | Never animate metric values (§4.3) |
| Decorative motion (page-load choreography, parallax) | Founder-deck reflex | Motion conveys state only (§4) |
| Emoji icons | Casual / cross-platform inconsistent | lucide-react exclusively (§7) |
| Pure-grey neutrals (`#fff`, slate-50) | "Uncustomized default" tell | All neutrals tinted toward warm cream (§1.1) |
| Side-stripe accents (`border-left: 3px`) | Absolute ban | Full-perimeter tint or full border, never a stripe (§1.3) |
| Bold (700+) for emphasis | Shouty | Emphasis via *scale* — Source Serif 600 at landmark sizes (§2.3) |
| Decorative glyphs (✨ 🎯 💡) | Founder-deck | Lucide icons are functional only (§7) |
| Uniform row treatment when status differs | Fails principle 5 | Status drives row tint + elevation (§5) |
| Bounce / elastic easing | Absolute ban | ease-out-expo / ease-out-quint only (§4.1) |
| Multiple accent colors competing | Splits the eye | One accent. Status palette is separate. (§1.2) |
| Long form copy in headline slots | Wastes the landmark | Headlines are noun phrases; sentences live below (§2.2) |

---

## 10. Token consumption

### 10.1 In CSS

Direct: `var(--color-bg)`, `var(--text-base)`, `var(--space-4)`, etc. Declare all tokens in a single file (`styles/tokens.css`), import once at the top of your root stylesheet.

### 10.2 In Tailwind utilities

Make `tailwind.config.js` read tokens via `var()` so utilities like `bg-bg`, `text-ink`, `border-border` resolve to the same custom property. Zero duplicate hex values in the codebase.

```js
theme: {
  colors: {
    bg:       'var(--color-bg)',
    'bg-raised':  'var(--color-bg-raised)',
    'bg-sunken':  'var(--color-bg-sunken)',
    ink:      'var(--color-ink)',
    'ink-muted':  'var(--color-ink-muted)',
    border:   'var(--color-border)',
    accent:   'var(--color-accent)',
    ok:       'var(--color-ok)',
    warn:     'var(--color-warn)',
    bad:      'var(--color-bad)',
    info:     'var(--color-info)',
    success:  'var(--color-success)',
  },
  fontFamily: {
    serif: 'var(--font-serif)',
    sans:  'var(--font-sans)',
    mono:  'var(--font-mono)',
  },
}
```

Semantic Tailwind names (`ok`, `warn`, `bad`, `info`, `muted`) are preserved across token swaps. Components don't change. The values shift; the names don't.

---

## 11. Adopting this guide for a new tool

Order to follow when you start a new internal tool:

1. **Copy `tokens.css` and `tailwind.config.js`** into the new project. Don't pick and choose — take the whole token set.
2. **Self-host the three font families** (or chosen analogues) and wire `font-display: swap`.
3. **Build the primitive set in §6.1** before building any feature. The primitives unblock everything else.
4. **Pick your accent hue** (§1.2) and lock it in `--color-accent`. Resist the urge to add a second accent later.
5. **Decide your primary axis** (principle 3) before designing any page. What is the user comparing? That answer drives every layout.
6. **Hold a 30-minute design review against §9** before shipping the first surface. Catching anti-patterns early is much cheaper than retrofitting.

---

## 12. Versioning

This doc is living. Major changes (new accent, new family, motion token additions) should ship via PR with the description naming the change here, the rationale, and the components affected. Visual-regression snapshots catch unintended drift.

**Sources of truth:**
- `styles/tokens.css` — authoritative token values.
- `tailwind.config.js` — authoritative utility mapping.
- This document — authoritative *rationale* and *names*.

If the three diverge, reconcile in this order: rationale (this doc) → values (`tokens.css`) → consumer (`tailwind.config.js`).
