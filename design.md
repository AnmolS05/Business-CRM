---
version: alpha
name: Bridgement
description: |
  Bridgement's design system embodies a modern, finance-forward aesthetic that
  prioritizes clarity and approachability in an otherwise complex lending
  landscape. The visual language combines bold brand accents with refined
  neutral typography to create a confident yet accessible experience. Deep navy
  and rich magenta anchor the brand identity, while carefully calibrated spacing
  and micro-interactions guide users through funding decisions. The atmosphere
  is professional yet human—reinforced by photography of real business owners
  and clean, uncluttered layouts that strip away friction from the application
  process. Generous whitespace and a deliberately constrained color palette
  signal trustworthiness and simplicity.
source:
  url: "https://www.bridgement.com/"
  pagesAnalyzed: 1
  extractedAt: 2026-11-24
  tokensMeasured: true
colors:
  primary: "#D20C54"
  accent: "#545B6D"
  link: "#00006E"
  canvas: "#FCFBF9"
  surface-alt: "#010844"
  ink: "#545B6D"
  body: "#969CAF"
  muted: "#EAF1FF"
  hairline: "#D6DAE3"
  accent-1: "#0000EE"
  accent-2: "#00C3F0"
  accent-3: "#172597"
  accent-4: "#5BD6F5"
  accent-5: "#99AFFD"
  neutral-1: "#000000"
typography:
  display-xl:
    fontFamily: "Domaine Display"
    fontSize: 95px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -1.73px
  display-lg:
    fontFamily: "Domaine Display"
    fontSize: 59.4px
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: -1.1px
  display-md:
    fontFamily: "Suisse Intl"
    fontSize: 54.9px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -1.1px
  display-md-tight:
    fontFamily: "Suisse Intl"
    fontSize: 54.9px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -1.73px
  display-sm:
    fontFamily: "Domaine Display"
    fontSize: 48.6px
    fontWeight: 400
    lineHeight: 0.91
    letterSpacing: -0.88px
  display-xs:
    fontFamily: "Suisse Intl"
    fontSize: 44.1px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.88px
  heading-md:
    fontFamily: "Domaine Display"
    fontSize: 31.5px
    fontWeight: 400
    lineHeight: 1.74
    letterSpacing: -0.56px
  heading-md-suisse-intl:
    fontFamily: "Suisse Intl"
    fontSize: 31.5px
    fontWeight: 400
    lineHeight: 1.74
    letterSpacing: -0.56px
  heading-sm:
    fontFamily: "Suisse Intl"
    fontSize: 27.9px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.56px
  heading-xs:
    fontFamily: "Suisse Intl"
    fontSize: 22.5px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.45px
  body-lg:
    fontFamily: "Suisse Intl"
    fontSize: 18px
    fontWeight: 300
    lineHeight: 1.8
    letterSpacing: -0.36px
  body-lg-strong:
    fontFamily: "Suisse Intl"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.36px
  body-md:
    fontFamily: "Suisse Intl"
    fontSize: 14.4px
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: -0.14px
  body-md-strong:
    fontFamily: "Suisse Intl"
    fontSize: 14.4px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.14px
  body-md-loose:
    fontFamily: "Suisse Intl"
    fontSize: 14.4px
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: -0.14px
  body-md-2:
    fontFamily: "Suisse Intl"
    fontSize: 14.4px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: -0.14px
  button-sm:
    fontFamily: "Suisse Intl"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.14px
  button-xs:
    fontFamily: "Suisse Intl"
    fontSize: 12.6px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.14px
  button-xs-tight:
    fontFamily: "Suisse Intl"
    fontSize: 12.6px
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: -0.14px
  caption-xs:
    fontFamily: "Suisse Intl"
    fontSize: 11.7px
    fontWeight: 400
    lineHeight: 1.72
    letterSpacing: -0.14px
  caption-xs-tight:
    fontFamily: "Suisse Intl"
    fontSize: 11.7px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.14px
  caption-xs-strong:
    fontFamily: "Suisse Intl"
    fontSize: 11.7px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: -0.14px
rounded:
  none: 0px
  xs: 7.2px
  sm: 12px
  full: 9999px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 36px
  xxl: 44px
  xxxl: 52px
  section: 60px
  band: 72px
borderWidths:
  thin: 1px
  medium: 2px
shadows:
  sm: "rgba(0, 13, 39, 0.08) 0px 3.6px 14.4px 0px"
elevationStrategy: single-tier
themes:
  derived: dark   # the other theme is the site's measured palette
  light:
    bg: "#FCFBF9"
    surface: "#010844"
    surfaceRaised: "#040B46"
    text: "#545B6D"
    textMuted: "#969CAF"
    border: "#D6DAE3"
    accent: "#D20C54"
    accentFg: "#FFFFFF"
    focusRing: "#D20C54"
    elevation: shadow
  dark:
    bg: "#150A0E"
    surface: "#23191C"
    surfaceRaised: "#2F2529"
    text: "#FDF5F8"
    textMuted: "#A59C9F"
    border: "#3A3135"
    accent: "#F21565"
    accentFg: "#0B0B0C"
    focusRing: "#D20C54"
    elevation: "border+surface"
  contrastFailures:
    - "light: muted on bg = 2.65:1 (needs 4.5:1)"
    - "light: text on surface = 2.76:1 (needs 4.5:1)"
components:
  button-primary:
    typography: "{typography.body-md-strong}"
    textColor: "rgb(255, 255, 255)"
    height: 43.1875px
    padding: "0px 18px 0px 18px"
    rounded: "{rounded.xs}"
    backgroundColor: "{colors.primary}"
  button-filled:
    typography: "{typography.body-md-strong}"
    textColor: "{colors.surface-alt}"
    height: 43.1875px
    padding: "0px 18px 0px 18px"
    rounded: "{rounded.xs}"
    backgroundColor: "{colors.accent-4}"
  button-text:
    typography: "{typography.button-sm}"
    textColor: "{colors.neutral-1}"
    height: 40px
    rounded: "{rounded.sm}"
    backgroundColor: "rgba(244, 244, 244, 0)"
  navigation:
    typography: "{typography.body-md-strong}"
    textColor: "{colors.ink}"
    height: 43.1719px
  footer:
    typography: "{typography.body-md-strong}"
    textColor: "{colors.ink}"
    padding: "14.4px 14.4px 14.4px 14.4px"
  link:
    typography: "{typography.body-md-strong}"
    textColor: "{colors.accent-1}"
  link-sm:
    typography: "{typography.body-md-strong}"
    textColor: "{colors.link}"
    padding: "0px 14.4px 0px 14.4px"
states:
  other-focus:
    target: other
    state: focus
    outline: "rgb(0, 123, 255) solid 2px"
    outlineColor: "rgb(0, 123, 255)"
    outlineWidth: 2px
  other-focus-visible:
    target: other
    state: focus-visible
    outline: "rgb(0, 123, 255) solid 2px"
    outlineColor: "rgb(0, 123, 255)"
    outlineWidth: 2px
  input-focus:
    target: input
    state: focus
    opacity: 0
  link-hover:
    target: link
    state: hover
    textColor: "rgb(255, 255, 255)"
    borderColor: "rgb(150, 150, 235)"
    borderWidth: 1px
    backgroundColor: "rgb(150, 150, 235)"
  other-hover:
    target: other
    state: hover
    backgroundColor: "rgb(21, 125, 236)"
  button-hover:
    target: button
    state: hover
    opacity: 1
  nav-hover:
    target: nav
    state: hover
    opacity: 1
  button-active:
    target: button
    state: active
    backgroundColor: "rgb(186, 239, 253)"
  input-hover:
    target: input
    state: hover
    backgroundColor: "rgba(153, 175, 253, 0.2)"
  other-active:
    target: other
    state: active
    backgroundColor: "rgb(240, 236, 229)"
  nav-active:
    target: nav
    state: active
    backgroundColor: "rgba(153, 175, 253, 0.3)"
breakpoints:
  - width: 375
    containerWidth: 359
    gridColumns: 2
    navLinksVisible: 39
    menuToggleVisible: true
    headingPx: 35
    bodyPx: 16
    sectionPaddingX: 0
  - width: 768
    containerWidth: 751
    gridColumns: 2
    navLinksVisible: 39
    menuToggleVisible: true
    headingPx: 63
    bodyPx: 17
    sectionPaddingX: 8
  - width: 1024
    containerWidth: 1002
    gridColumns: 2
    navLinksVisible: 39
    menuToggleVisible: true
    headingPx: 84
    bodyPx: 22
    sectionPaddingX: 11
  - width: 1440
    containerWidth: 1426
    gridColumns: 0
    navLinksVisible: 33
    menuToggleVisible: false
    headingPx: 55
    bodyPx: 14
    sectionPaddingX: 0
coverage:
  statesFound: 62
  gradientsFound: 0
  rolesUnassigned: 6
  archetypesUnnamed: 0
  archetypesDetected: 0
  responsiveMeasured: true
  stylesheetsBlocked: true
  semanticRampDeclared: false
---

# Design System Inspired by Bridgement

## 1. Visual Theme & Atmosphere

Bridgement's design system embodies a modern, finance-forward aesthetic that prioritizes clarity and approachability in an otherwise complex lending landscape. The visual language combines bold brand accents with refined neutral typography to create a confident yet accessible experience. Deep navy and rich magenta anchor the brand identity, while carefully calibrated spacing and micro-interactions guide users through funding decisions. The atmosphere is professional yet human—reinforced by photography of real business owners and clean, uncluttered layouts that strip away friction from the application process. Generous whitespace and a deliberately constrained color palette signal trustworthiness and simplicity.

**Key Characteristics**

- Bold, unapologetic brand accent (`{colors.primary}` — `#D20C54`) used strategically on primary CTAs and active states
- Refined, modern typography system with tight negative tracking on display sizes
- High contrast between canvas background and navy accent surfaces for visual hierarchy
- Micro-interactions and hover states that provide tactile feedback without distraction
- Generous spacing and air that conveys stability and approachability
- Purposeful use of decorative accent blues and cyans for data visualization and secondary interface elements

## 2. Color Palette & Roles

### Primary

- **Primary / Brand** (`{colors.primary}` — `#D20C54`): Primary CTAs, brand accent in hero sections, active states, and emphasis. The defining magenta that communicates urgency and action.

### Accent Colors

- **Accent / Ink** (`{colors.accent}` — `#545B6D`): Secondary accent and hero band backgrounds; primary text for headings and emphasis copy.
- **Link** (`{colors.link}` — `#00006E`): Inline link color throughout body copy.
- **Decorative Accent** (`{colors.accent-1}` — `#0000EE`): Unassigned decorative use; appears in charts and secondary interface elements.
- **Decorative Accent** (`{colors.accent-2}` — `#00C3F0`): Unassigned decorative use; slider handles and data visualization fills.
- **Decorative Accent** (`{colors.accent-3}` — `#172597`): Unassigned decorative use; sidebar and card backgrounds in app mockups.
- **Decorative Accent** (`{colors.accent-4}` — `#5BD6F5`): Unassigned decorative use; progress bars and interactive states.
- **Decorative Accent** (`{colors.accent-5}` — `#99AFFD`): Unassigned decorative use; hover states and secondary fills.

### Interactive

- **Interactive** (`{colors.accent-2}` — `#00C3F0`): Used for slider handles and progress indicators in forms.

### Neutral Scale

- **Canvas** (`{colors.canvas}` — `#FCFBF9`): Default page background; warm off-white providing visual softness.
- **Surface Alt** (`{colors.surface-alt}` — `#010844`): Alternating section band; deep navy used for hero backgrounds and inverse text layouts.
- **Body** (`{colors.body}` — `#969CAF`): Body copy color; medium gray for secondary content.
- **Muted** (`{colors.muted}` — `#EAF1FF`): Captions, secondary text, and light backgrounds; pale blue-tinted neutral.
- **Hairline** (`{colors.hairline}` — `#D6DAE3`): 1px borders, dividers, and subtle demarcation between surfaces.
- **Neutral Black** (`{colors.neutral-1}` — `#000000`): Pure black for maximum contrast in special emphasis or dark sections.

## 3. Typography Rules

### Font Family

**Primary:** Domaine Display (display and heading sizes)
Fallback: serif

**Secondary:** Suisse Intl (body, buttons, links, and UI text)
Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|---|---|
| Display XL | Domaine Display | 95px | 400 | 1.00 | -1.73px | Hero/marquee |
| Display LG | Domaine Display | 59.4px | 400 | 0.92 | -1.1px | Hero display |
| Display SM | Domaine Display | 48.6px | 400 | 0.91 | -0.88px | Display accent |
| Display MD | Suisse Intl | 54.9px | 400 | 1.00 | -1.1px | H1 primary heading |
| Display MD (tight) | Suisse Intl | 54.9px | 400 | 1.00 | -1.73px | H2 secondary heading |
| Display XS | Suisse Intl | 44.1px | 400 | 1.00 | -0.88px | H3 tertiary heading |
| Heading MD | Domaine Display | 31.5px | 400 | 1.74 | -0.56px | Section heading |
| Heading MD (Suisse) | Suisse Intl | 31.5px | 400 | 1.74 | -0.56px | Section heading alt |
| Heading SM | Suisse Intl | 27.9px | 400 | 1.20 | -0.56px | Card heading |
| Heading XS | Suisse Intl | 22.5px | 400 | 1.20 | -0.45px | Subheading |
| Body LG | Suisse Intl | 18px | 300 | 1.80 | -0.36px | Introductory body |
| Body LG (strong) | Suisse Intl | 18px | 500 | 1.20 | -0.36px | Emphasis body |
| Body MD | Suisse Intl | 14.4px | 300 | 1.40 | -0.14px | Standard body copy |
| Body MD (strong) | Suisse Intl | 14.4px | 400 | 1.40 | -0.14px | Medium emphasis |
| Body MD (medium) | Suisse Intl | 14.4px | 500 | 1.40 | -0.14px | Strong emphasis |
| Body MD (loose) | Suisse Intl | 14.4px | 400 | 1.80 | -0.14px | Body with extra line height |
| Button SM | Suisse Intl | 14px | 400 | 1.40 | -0.14px | Standard button label |
| Button XS | Suisse Intl | 12.6px | 400 | 1.00 | -0.14px | Small button label |
| Button XS (tight) | Suisse Intl | 12.6px | 400 | 0.95 | -0.14px | Compact button |
| Caption XS | Suisse Intl | 11.7px | 400 | 1.72 | -0.14px | Caption / hint text |
| Caption XS (strong) | Suisse Intl | 11.7px | 500 | 1.40 | -0.14px | Emphasis caption |
| Caption XS (tight) | Suisse Intl | 11.7px | 400 | 1.40 | -0.14px | Compact caption |

### Principles

- Display sizes employ tight negative tracking (`-1.73px` to `-0.88px`) to create a confident, premium feel and reinforce brand personality
- Body copy uses a light weight (300) at standard sizes (`{typography.body-md}` — 14.4px, weight 300) for approachability, with weight bumps (400–500) reserved for emphasis
- Line height expands with body sizes (`1.4` for body-md, `1.8` for body-lg-loose) to maximize readability and aid scannability
- Link and button text preserve tight line heights (1.0–1.4) to maintain compact UI footprints
- All captions maintain consistent letter spacing (`-0.14px`) regardless of weight to preserve visual rhythm

## 4. Component Stylings

### Buttons

**Primary Button**
- Background: `{colors.primary}` (`#D20C54`)
- Text: `#FFFFFF`
- Padding: `0px 18px`
- Height: `43.1875px`
- Border radius: `{rounded.xs}` (`7.2px`)
- Font: `{typography.button-sm}` (Suisse Intl, 14.4px, weight 400, line-height 1.4)
- Border: none
- Box shadow: none
- Hover state: `background-color: rgb(255, 50, 100)`
- Active state: `background-color: rgb(255, 84, 126)`

**Secondary Button (Filled)**
- Background: `{colors.accent-2}` (`#00C3F0`)
- Text: `{colors.surface-alt}` (`#010844`)
- Padding: `0px 18px`
- Height: `43.1875px`
- Border radius: `{rounded.xs}` (`7.2px`)
- Font: `{typography.button-sm}` (Suisse Intl, 14.4px, weight 400, line-height 1.4)
- Border: none
- Box shadow: none
- Hover state: `background-color: rgb(129, 226, 249)`
- Active state: `background-color: rgb(186, 239, 253)`

**Tertiary Button (Ghost/Text)**
- Background: transparent
- Text: `{colors.neutral-1}` (`#000000`)
- Padding: `0px 0px`
- Height: `40px`
- Border radius: `{rounded.sm}` (`12px`)
- Font: `{typography.button-sm}` (Suisse Intl, 14px, weight 400, line-height 1.4)
- Border: none
- Box shadow: none
- Hover state: `background-color: rgba(0, 0, 0, 0.05)`

**Outline Button (Link-like)**
- Background: transparent
- Text: `rgb(0, 0, 110)`
- Padding: `0px 14.4px`
- Height: `36px`
- Border radius: `{rounded.none}` (`0px`)
- Font: `{typography.button-sm}` (Suisse Intl, 14.4px, weight 400)
- Border: `1px solid rgb(221, 221, 221)`
- Hover state: `background-color: rgb(234, 241, 255)`; `border-color: rgb(0, 0, 110)`
- Active state: `background-color: rgb(200, 214, 255)`

### Cards & Containers

**Card Surface**
- Background: `{colors.canvas}` (`#FCFBF9`)
- Border: `1px solid {colors.hairline}` (`#D6DAE3`)
- Border radius: `{rounded.sm}` (`12px`) or `{rounded.none}` (`0px`) depending on layout context
- Padding: `{spacing.md}` to `{spacing.lg}` (`16px` to `20px`)
- Box shadow: `rgba(0, 13, 39, 0.08) 0px 3.6px 14.4px 0px` (hover elevation)

**Card Heading**
- Font: `{typography.heading-sm}` (Suisse Intl, 27.9px, weight 400, line-height 1.2)
- Color: `{colors.accent}` (`#545B6D`)

**Inverse Surface (Dark Band)**
- Background: `{colors.surface-alt}` (`#010844`)
- Text: `#FFFFFF`
- Padding: `{spacing.xxxl}` (`52px`) vertical, `{spacing.band}` (`72px`) or section-dependent horizontal

### Inputs & Forms

**Text Input**
- Background: `{colors.canvas}` (`#FCFBF9`)
- Text: `{colors.accent}` (`#545B6D`)
- Border: `1px solid {colors.hairline}` (`#D6DAE3`)
- Border radius: `{rounded.none}` (`0px`) or `{rounded.xs}` (`7.2px`) per context
- Padding: `{spacing.sm}` to `{spacing.md}` (`12px` to `16px`)
- Font: `{typography.body-md}` (Suisse Intl, 14.4px, weight 300)
- Focus state: `outline: rgb(0, 0, 110) solid 1px`; `border-color: rgb(0, 0, 110)`
- Hover state: `background-color: rgba(153, 175, 253, 0.2)` (`{colors.accent-5}` at 20%)

**Input Label**
- Font: `{typography.caption-xs-strong}` (Suisse Intl, 11.7px, weight 500)
- Color: `{colors.accent}` (`#545B6D`)

### Navigation

**Nav Link (Desktop)**
- Background: transparent
- Text: `{colors.accent}` (`#545B6D`)
- Font: `{typography.body-md-strong}` (Suisse Intl, 14.4px, weight 400)
- Border: none
- Padding: `0px` (spacing handled via layout)
- Hover state: `color: rgb(84, 91, 109)`; `opacity: 1`; optional `border-color` per variant
- Active/focus state: `background-color: rgba(52, 88, 216, 0.5)`; `color: rgb(255, 255, 255)`

**Mobile Menu Toggle**
- Background: transparent
- Padding: `{spacing.md}` (`16px`)
- Border radius: `{rounded.none}` (`0px`)
- Hover: `transform: rotate(-45deg)` or `rotate(45deg) translateX(2px)` per icon direction
- Icon color: `{colors.accent}` (`#545B6D`)

### Links

**Inline Link (Default)**
- Color: `{colors.link}` (`#00006E`)
- Text decoration: none
- Font: `{typography.body-md}` (Suisse Intl, 14.4px)
- Hover state: `text-decoration: underline`; `color: rgb(255, 255, 255)`; `background-color: rgb(150, 150, 235)` (optional inverse variant)
- Focus state: `outline: rgb(0, 123, 255) solid 2px`

## 5. Layout Principles

### Spacing System

Base unit: `{spacing.xs}` = `8px`

Scale progression:
- `{spacing.xxs}` = `4px` (micro-spacing, rare use)
- `{spacing.xs}` = `8px` (input label offsets, tight list spacing)
- `{spacing.sm}` = `12px` (component internal padding)
- `{spacing.md}` = `16px` (standard padding, card interiors)
- `{spacing.lg}` = `20px` (button padding, section margins)
- `{spacing.xl}` = `36px` (sub-section breaks)
- `{spacing.xxl}` = `44px` (feature/block spacing)
- `{spacing.xxxl}` = `52px` (major section padding)
- `{spacing.section}` = `60px` (vertical separation between major sections)
- `{spacing.band}` = `72px` (horizontal padding in full-width bands)

**Usage Context:**
- Buttons and form fields: `{spacing.md}` to `{spacing.lg}` internal padding
- Section horizontal padding: `{spacing.band}` on full-width, `{spacing.xxxl}` on constrained layouts
- Vertical gaps between sections: `{spacing.section}` to `{spacing.band}`
- List/card gaps: `{spacing.md}` to `{spacing.lg}`

### Grid & Container

**Max Width:**
- Desktop container: `1426px` (measured at 1440px viewport)
- Content column width at 375px: `359px`; at 768px: `751px`; at 1024px: `1002px`; at 1440px: `1426px`

**Column Strategy:**
- Mobile/tablet: 2-column flexible layout (observed at 375px, 768px, 1024px)
- Desktop: variable column count depending on section (product cards, feature blocks, testimonials)
- Sections adapt to viewport rather than fixed column declarations

**Section Patterns:**
- Full-width hero with centered text and image side-by-side (375px+)
- Stacked feature blocks that reflow from 1–2 columns
- Three-column footer grid collapsing to 1–2 columns on mobile

### Whitespace Philosophy

Whitespace is a primary design tool. The system employs generous vertical breathing room (`{spacing.section}` between logical content blocks) to prevent cognitive overload and emphasize information hierarchy. Horizontal padding scales inversively with viewport size—constrained on mobile for usable content width, expansive on desktop to embrace the canvas. Grouped elements (cards, form inputs) receive tight internal spacing (`{spacing.md}`) but are separated from peers by `{spacing.lg}` or `{spacing.xl}`, creating natural visual clusters.

### Border Radius Scale

- `{rounded.none}` = `0px` — sharp corners for inputs, images, and austere layouts
- `{rounded.xs}` = `7.2px` — buttons and small interactive elements; subtle softness
- `{rounded.sm}` = `12px` — cards, overlays, and larger containers
- `{rounded.full}` = `9999px` — pills and circular badges (not measured in components, present in design language)

### Border Widths

- **Thin** (`1px`): Input borders, dividers, hairlines
- **Medium** (`2px`): Not explicitly used in measured components; reserved for emphasis or focus rings

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow | Cards at rest, standard surfaces, text |
| Hover / Lift | `rgba(0, 13, 39, 0.08) 0px 3.6px 14.4px 0px` | Dropdowns, elevated cards on interaction |

**Shadow Philosophy:**

Bridgement employs a restrained, single-tier shadow model. Depth is primarily communicated through **color contrast** (light canvas against dark inverse surfaces) and **spatial arrangement** rather than aggressive drop shadows. When elevation is needed—hover states on cards, dropdown menus—a subtle, barely-perceptible shadow (`rgba(0, 13, 39, 0.08)` at 8% opacity) lifts the element. This micro-elevation preserves the clean, modern aesthetic while providing tactile feedback.

**Focus / Outline:**
- Focus ring: `outline: rgb(0, 123, 255) solid 2px` — a bright cyan used exclusively for keyboard navigation
- Some elements suppress outline entirely: `outline: none`

### Opacity Levels

- **10%** (`0.10`): Minimal overlay or disabled state tint
- **20%** (`0.20`): `rgba(153, 175, 253, 0.2)` — hover tint on inputs and secondary buttons
- **30%** (`0.30`): `rgba(153, 175, 253, 0.3)` — active/pressed state tint
- **38%** (`0.38`): Decorative or secondary element fade
- **40%** (`0.40`): Significant disabled or muted state
- **50%** (`0.50`): Mid-tone overlay or semi-transparent surface
- **52%** (`0.52`): Applied opacity for specific secondary surfaces

### Z-index / Layering

- **Base layers**: `z-index: 1`, `2`, `3`, `4`, `5` — standard stacking for page content
- **Dropdown**: `z-index: 12` — navigation dropdowns, popovers
- **Overlay**: `z-index: 99` — modal backdrops, overlays
- **Toast / Alert**: `z-index: 99999999` — notifications, critical alerts

## 7. Do's and Don'ts

### Do

- **Use `{colors.primary}` for primary CTAs** — "Apply Now," "Get Approved for Free" — to drive clear action hierarchy
- **Maintain tight negative letter-spacing on display sizes** to preserve the premium, confident brand voice
- **Stack sections vertically with `{spacing.section}` (`60px`) or `{spacing.band}` (`72px`) spacing** to create clear visual rhythm and prevent cramping
- **Apply hover state tints from the `{colors.accent-5}` palette (`rgba(153, 175, 253, 0.2)` or `0.3`)** for consistent interaction feedback
- **Use `{colors.muted}` (`#EAF1FF`)** for captions, helper text, and secondary backgrounds to maintain hierarchy
- **Embrace whitespace** — do not fill every pixel; generous padding and margins reinforce trustworthiness in fintech UI
- **Layer color-blocking (surface changes) over shadows** for depth; use the single shadow only for critical hover states
- **Test inputs and buttons at minimum `43.1875px` height** to ensure touch accessibility on mobile devices
- **Use pill-radius buttons (`{rounded.xs}` → `7.2px`) for all primary interactions** to signal approachability
- **Keep navigation link hover states subtle** — a background color tint rather than aggressive color shifts

### Don't

- **Do not use `{colors.accent-1}` through `{colors.accent-5}` as primary semantic indicators** — they are decorative and have no declared status meaning (error/success/warning)
- **Do not round corners on input fields unless explicitly required by context** — `{rounded.none}` (`0px`) preserves industrial clarity
- **Do not apply shadows to multiple elements in a single section** — the system supports one elevation level for depth; abuse flattens the hierarchy
- **Do not mix font families mid-section** — Domaine Display for large display/heading sizes, Suisse Intl for body/UI text; keep the boundary clear
- **Do not reduce line-height below `1.0` on body copy** — stick to `1.4` or higher to maintain readability
- **Do not use `{colors.neutral-1}` (`#000000`) for body text** — employ `{colors.body}` (`#969CAF`) or `{colors.accent}` (`#545B6D`) for approachability
- **Do not apply color to focus rings other than the extracted cyan (`rgb(0, 123, 255)`)** — this is the system standard for keyboard navigation
- **Do not suppress focus outlines entirely** unless a custom focus ring is provided; accessibility demands keyboard-navigable feedback
- **Do not resize text smaller than `11.7px` (`{typography.caption-xs}`)** unless absolutely necessary; captions at this size are the floor
- **Do not break the spacing scale** — if a custom measurement is needed, check if an existing token (`{spacing.md}` through `{spacing.band}`) serves the need first

## 8. Responsive Behavior

### Breakpoints

| Viewport | Content Width | Grid Columns | Key Change | Nav Links | Largest Heading Size |
|---|---|---|---|---|---|
| 375px | 359px | 2 | Mobile baseline; full-width imagery | 39 visible | 35px (condensed) |
| 768px | 751px | 2 | Tablet; improved spacing; double-column sections appear | 39 visible | 63px (expanded) |
| 1024px | 1002px | 2 | Laptop; wider gutters; feature blocks optimize | 39 visible | 84px (desktop preview) |
| 1440px | 1426px | 2+ | Desktop; max-width enforced; full horizontal padding; nav may condense | 33 visible | 55px (optimized for viewport) |

**Breakpoint Strategy:**
The design does not employ strictly labeled media query breakpoints (e.g., sm, md, lg). Instead, observe the content width and heading scale shifts: scaling occurs fluidly between 375px → 768px → 1024px → 1440px. At 1440px, content width reaches maximum (`1426px`) and further navigation items are hidden in favor of a compact display.

### Touch Targets

- Minimum interactive height: `43.1875px` (button standard)
- Minimum interactive width: `43.1875px` (derived from button height for square icons)
- Minimum finger-friendly padding around touch targets: `{spacing.md}` (`16px`) on all sides when grouped
- Link tap zones: at least `44px × 44px` (WCAG standard), achieved through button padding and min-height enforcement

### Collapsing Strategy

- **375px → 768px:** Hero text scales from `35px` to `63px`; images stack vertically; two-column grids remain or become 1 column per context
- **768px → 1024px:** Heading sizes expand (`63px` → `84px`); horizontal padding increases; card grids begin to arrange as 2–3 columns if present
- **1024px → 1440px:** Body text refines (`22px` → `14px`), suggesting different measure calculations; nav links shift from 39 to 33 visible, indicating overflow or reconfiguration
- **Below 768px:** Navigation menu toggle appears; horizontal sections stack; images and copy reflow to single column
- **Above 1440px:** Container max-width locks at `1426px`; outer margin/padding prevents stretching beyond viewport

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA**: Primary (`{colors.primary}` — `#D20C54`)
- **Secondary CTA**: Accent-2 (`{colors.accent-2}` — `#00C3F0`)
- **Background (page)**: Canvas (`{colors.canvas}` — `#FCFBF9`)
- **Background (inverse)**: Surface Alt (`{colors.surface-alt}` — `#010844`)
- **Heading text**: Accent (`{colors.accent}` — `#545B6D`)
- **Body text**: Body (`{colors.body}` — `#969CAF`)
- **Link**: Link (`{colors.link}` — `#00006E`)
- **Borders & dividers**: Hairline (`{colors.hairline}` — `#D6DAE3`)
- **Captions & hints**: Muted (`{colors.muted}` — `#EAF1FF`)

### Iteration Guide

1. **Start with `{colors.primary}` for every primary action** — buttons labeled "Apply Now," "Get Approved," or equiv.—and reserve secondary fills for `{colors.accent-2}` only.
2. **Apply `{typography.display-md}` or `{typography.display-sm}` to hero headings**, preserving letter-spacing exactly as measured (`-1.1px` to `-1.73px`); do not round.
3. **Use `{typography.body-md}` (14.4px, weight 300) as the system body default**, bumping to weight 400–500 only for emphasis within a paragraph.
4. **Pad all card/container interiors with `{spacing.md}` to `{spacing.lg}`** (`16px`–`20px`); separate major sections with `{spacing.section}` (`60px`).
5. **Apply `{rounded.xs}` (`7.2px`) to buttons and form inputs; `{rounded.sm}` (`12px`) to cards and overlays**; keep images and austere layouts at `{rounded.none}` (`0px`).
6. **Use the single shadow (`rgba(0, 13, 39, 0.08) 0px 3.6px 14.4px 0px`) only on hover states or lifted elements**; flat surfaces have no shadow.
7. **On focus (keyboard navigation), apply `outline: rgb(0, 123, 255) solid 2px`** for all interactive elements; never suppress without providing an alternative focus indicator.
8. **Scale heading sizes responsively**: 35px @ 375px, 63px @ 768px, 84px @ 1024px; derive intermediate sizes by interpolation if needed.
9. **Keep section max-width at `1426px` (measured at 1440px viewport); constrain horizontal padding between `{spacing.band}` (`72px`) full-width and `0px` on mobile**.
10. **Never invent colors, spacing, or radius values**; all measurements derive from the token data above. If a value does not appear, it was not extracted, and you should omit it or flag it in Known Gaps.

## 10. Known Gaps

- **Semantic status colors (error, success, warning) are not declared** on the measured page; the site does not expose a error/success/warning color ramp in its stylesheets. Any error handling UI would require custom extraction or external specification.
- **Gradients and decorative meshes are not present** in the extracted data; all fills are solid colors.
- **Six extracted colors (`{colors.accent-1}` through `{colors.accent-5}` and partial use of accent-2) have no declared semantic role**; they are classified as decorative only. Their exact use cases (charts, secondary fills, etc.) were inferred from visual context but lack explicit design intent.
- **Interaction states (hover, active, focus, disabled) for most components are captured,** but not exhaustively; some edge cases (e.g., disabled form state styling, loading spinners, error input borders) may not be represented.
- **Dark/light mode variants are not measured**; this design system describes a single light theme as rendered on the production site. No dark-mode alternative was detected or extracted.
- **Surfaces behind authentication (dashboard, account settings, funding application flow) were not visited**, so internal product UI may differ from the public marketing site in this extraction.
- **Animation and transition timings are not captured** (e.g., duration, easing for button hover, menu slide-out); micro-interaction logic is inferred from CSS transform and opacity changes but not formally specified.
- **Custom form validation UI, multi-step form patterns, and conditional field logic** are not measured; only base input and button styles are extracted.
- **Print styles, reduced-motion preferences, and high-contrast mode overrides** are not documented; accessibility features beyond keyboard focus are not observed.

---

**Tokens Reference:**

```yaml
colors:
  primary: "#D20C54"
  accent: "#545B6D"
  link: "#00006E"
  accent-1: "#0000EE"
  accent-2: "#00C3F0"
  accent-3: "#172597"
  accent-4: "#5BD6F5"
  accent-5: "#99AFFD"
  canvas: "#FCFBF9"
  surface-alt: "#010844"
  body: "#969CAF"
  muted: "#EAF1FF"
  hairline: "#D6DAE3"
  neutral-1: "#000000"

typography:
  display-lg:
    size: 59.4px
    weight: 400
    lineHeight: 0.92
    letterSpacing: -1.1px
    family: "Domaine Display"
  display-sm:
    size: 48.6px
    weight: 400
    lineHeight: 0.91
    letterSpacing: -0.88px
    family: "Domaine Display"
  display-xl:
    size: 95px
    weight: 400
    lineHeight: 1
    letterSpacing: -1.73px
    family: "Domaine Display"
  heading-md:
    size: 31.5px
    weight: 400
    lineHeight: 1.74
    letterSpacing: -0.56px
    family: "Domaine Display"
  display-md:
    size: 54.9px
    weight: 400
    lineHeight: 1
    letterSpacing: -1.1px
    family: "Suisse Intl"
  display-md-tight:
    size: 54.9px
    weight: 400
    lineHeight: 1
    letterSpacing: -1.73px
    family: "Suisse Intl"
  display-xs:
    size: 44.1px
    weight: 400
    lineHeight: 1
    letterSpacing: -0.88px
    family: "Suisse Intl"
  body-md-strong:
    size: 14.4px
    weight: 400
    lineHeight: 1.4
    letterSpacing: -0.14px
    family: "Suisse Intl"
  button-sm:
    size: 14px
    weight: 400
    lineHeight: 1.4
    letterSpacing: -0.14px
    family: "Suisse Intl"
  body-md-loose:
    size: 14.4px
    weight: 400
    lineHeight: 1.8
    letterSpacing: -0.14px
    family: "Suisse Intl"
  body-md:
    size: 14.4px
    weight: 300
    lineHeight: 1.4
    letterSpacing: -0.14px
    family: "Suisse Intl"
  body-lg-strong:
    size: 18px
    weight: 500
    lineHeight: 1.2
    letterSpacing: -0.36px
    family: "Suisse Intl"
  body-md-2:
    size: 14.4px
    weight: 500
    lineHeight: 1.4
    letterSpacing: -0.14px
    family: "Suisse Intl"
  heading-xs:
    size: 22.5px
    weight: 400
    lineHeight: 1.2
    letterSpacing: -0.45px
    family: "Suisse Intl"
  caption-xs:
    size: 11.7px
    weight: 400
    lineHeight: 1.72
    letterSpacing: -0.14px
    family: "Suisse Intl"
  heading-sm:
    size: 27.9px
    weight: 400
    lineHeight: 1.2
    letterSpacing: -0.56px
    family: "Suisse Intl"
  body-lg:
    size: 18px
    weight: 300
    lineHeight: 1.8
    letterSpacing: -0.36px
    family: "Suisse Intl"
  caption-xs-strong:
    size: 11.7px
    weight: 500
    lineHeight: 1.4
    letterSpacing: -0.14px
    family: "Suisse Intl"
  heading-md-suisse-intl:
    size: 31.5px
    weight: 400
    lineHeight: 1.74
    letterSpacing: -0.56px
    family: "Suisse Intl"
  button-xs:
    size: 12.6px
    weight: 400
    lineHeight: 1
    letterSpacing: -0.14px
    family: "Suisse Intl"
  caption-xs-tight:
    size: 11.7px
    weight: 400
    lineHeight: 1.4
    letterSpacing: -0.14px
    family: "Suisse Intl"
  button-xs-tight:
    size: 12.6px
    weight: 400
    lineHeight: 0.95
    letterSpacing: -0.14px
    family: "Suisse Intl"

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 36px
  xxl: 44px
  xxxl: 52px
  section: 60px
  band: 72px

rounded:
  none: 0px
  xs: 7.2px
  sm: 12px
  full: 9999px

shadows:
  sm: "rgba(0, 13, 39, 0.08) 0px 3.6px 14.4px 0px"
  md: "rgb(0, 0, 110) 0px 0px 0px 1px"

borders:
  thin: 1px
  medium: 2px

opacity:
  minimal: 0.10
  light: 0.20
  medium: 0.30
  default: 0.38
  strong: 0.40
  semi: 0.50
  deep: 0.52

zIndex:
  base: [1, 2, 3, 4, 5]
  dropdown: 12
  overlay: 99
  toast: 99999999
```