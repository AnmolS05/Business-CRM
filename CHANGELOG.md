# CHANGELOG

## [v2.0.0 - 2026-11-24T10:55:00+05:30] Release v2.0 - Bridgement Design System & Enterprise UI

### Description
- Official release of **CapitalFlow Pro v2.0.0** featuring the full Bridgement-inspired enterprise design system.
- Bumped package version to `2.0.0` and integrated `v2.0` badge into the application navbar and project documentation.
- Integrated comprehensive Bridgement brand tokens: Deep Navy `#010844`, Signature Magenta `#D20C54`, Cyan `#00C3F0`, Periwinkle `#99AFFD`, and Canvas `#FCFBF9`.
- Applied typography standards with `Plus Jakarta Sans`, `Outfit`, and `Inter` and precision hairline borders (`#D6DAE3` / `rgba(255,255,255,0.1)`).
- Re-architected `DocumentParser` section layout to ensure seamless vertical flow from Part 1 text analysis directly into Part 2 interactive Recharts comparisons.
- Ready for live Vercel edge deployment and Git repository synchronization.

### Files Affected
- `package.json`
- `src/components/Navbar.tsx`
- `README.md`
- `CHANGELOG.md`

## [2026-11-24T10:48:00+05:30] Fixed DocumentParser Part 1 and Part 2 Layout Ordering

### Description
- Resolved design layout issue in `DocumentParser` where the dynamic comparison chart was incorrectly positioned above Part 1, leaving Part 2 empty.
- Enhanced `parseResponse` logic to systematically detect and separate:
  - `part1Text`: The full structured written markdown analysis (Executive Overview, Key Highlights, Trends).
  - `part2Header`: Dynamic Part 2 section title extracted from the AI response.
  - `part2Body`: Any supplementary descriptive or explanatory notes accompanying the comparative figures.
  - `parsedChart`: Clean JSON dataset payload for Recharts visualization.
- Restructured the DOM sequence within the analysis results container: Part 1 (Written Markdown Analysis) is rendered first, followed directly by Part 2 (Dynamic Interactive Recharts Visual Comparison Card), eliminating any trailing empty headings.
- Verified TypeScript typing with zero errors (`npm run lint`) and production build compilation (`npm run build`).

### Files Affected
- `src/components/DocumentParser.tsx`
- `CHANGELOG.md`

## [2026-11-24T10:05:00+05:30] Implemented Bridgement-Inspired Design System

### Description
- Transitioned the application UI to the comprehensive Bridgement-inspired design system documented in `design.md`.
- Implemented core color tokens:
  - Primary Brand CTA & Accent: `#D20C54` (Hover: `#ff3264`, Active: `#ff547e`)
  - Secondary Action & Accent: `#00C3F0` (Hover: `#81e2f9`, Contrast text: `#010844`)
  - Dark Surface / Header / Hero: `#010844`
  - Canvas Background: `#FCFBF9` (Light) / `#05081E` (Dark)
  - Ink Headings: `#545B6D` (Light) / `#FDF5F8` (Dark) with `-0.03em` tracking
  - Body Text: `#969CAF` (Light) / `#CBD5E1` (Dark)
  - Borders: Hairline `#D6DAE3` (Light) / `rgba(255,255,255,0.1)` (Dark)
  - Component Radii: `7.2px` (buttons, inputs) and `12px` (cards, modals)
- Integrated Google Fonts: `Plus Jakarta Sans`, `Outfit`, and `Inter`.
- Added standard utility classes `.btn-primary`, `.btn-secondary`, `.btn-ghost`, and `.card-surface`.
- Refactored `src/App.tsx`, `Navbar.tsx`, `KanbanPipeline.tsx`, `DealFormModal.tsx`, `ExpenseTracker.tsx`, `ExpenseForm.tsx`, `LeadScoringPredictor.tsx`, `BusinessAdvisorCard.tsx`, `StatisticsDashboard.tsx`, `DocumentParser.tsx`, `UploadDropzone.tsx`, and `WhatsAppModal.tsx`.
- Updated Recharts palettes across Area, Bar, and Composed charts to match Bridgement tokens with custom dark navy tooltips.
- Verified TypeScript typing with zero errors (`npm run lint`), successful dual client/serverless production build (`npm run build`), and validated local server execution.

### Files Affected
- `index.html`
- `src/index.css`
- `src/App.tsx`
- `src/components/Navbar.tsx`
- `src/components/KanbanPipeline.tsx`
- `src/components/DealFormModal.tsx`
- `src/components/ExpenseTracker.tsx`
- `src/components/ExpenseForm.tsx`
- `src/components/LeadScoringPredictor.tsx`
- `src/components/BusinessAdvisorCard.tsx`
- `src/components/StatisticsDashboard.tsx`
- `src/components/DocumentParser.tsx`
- `src/components/UploadDropzone.tsx`
- `src/components/WhatsAppModal.tsx`
- `README.md`
- `CHANGELOG.md`

## [2026-11-24T09:23:00+05:30] Optimized Vercel Serverless Function Bundling

### Description
- Added `server/serverless.ts` as the root entry point for serverless deployment.
- Integrated `esbuild` serverless bundling into `package.json` build pipeline to bundle all internal server code into `api/index.js`, eliminating ESM extensionless module resolution errors under Node.js runtime.
- Updated `vercel.json` to trigger `npm run build` directly.
- Verified live deployment and endpoint validation (`/api/health`, `/api/deals`, `/api/expenses`) on Vercel Edge network.

### Files Affected
- `server/serverless.ts`
- `package.json`
- `vercel.json`
- `.gitignore`
- `api/index.js`
- `CHANGELOG.md`

## [2026-11-24T09:12:00+05:30] Configured Native Vercel Serverless Deployment

### Description
- Modularized Express backend by extracting application setup into `server/app.ts`, decoupling server instantiation from HTTP listening.
- Created `api/index.ts` as the standard Vercel Serverless Function handler to execute Express API endpoints serverlessly.
- Added `vercel.json` with build commands, output directory configuration, and rewrites mapping `/api/*` to the serverless entrypoint and client routes to SPA fallback.
- Enhanced `server/db.ts` with serverless filesystem resilience, directing writes to `/tmp` storage when `VERCEL` or Lambda environments are detected to prevent read-only filesystem errors.
- Mounted `/api/reset-db` directly in `server/routes/index.ts` ensuring parity with frontend API client calls.
- Updated `README.md` with comprehensive Vercel deployment guidelines and environment variable requirements.

### Files Affected
- `api/index.ts`
- `server/app.ts`
- `server.ts`
- `server/db.ts`
- `server/routes/index.ts`
- `vercel.json`
- `README.md`
- `CHANGELOG.md`

## [2026-08-14T12:30:00+05:30] Refactored README for Enterprise Standard

### Description
- Completely revamped `README.md` to adhere to enterprise standard repository requirements.
- Added comprehensive sections on architecture, prerequisite tooling, detailed installation steps, and production deployment scripts.
- Included guidelines for testing and contributing, adhering to project doctrine.

### Files Affected
- `README.md`
- `CHANGELOG.md`

## [2026-08-09T11:40:00+05:30] Committed and Pushed Phase 3 Frontend Files

### Description
- Committed frontend UI components and Kanban pipeline files per Phase 3 instructions.
- Stashed local unstaged changes, resolved remote conflicts via rebase, and pushed `main` branch to GitHub.

### Files Affected
- `index.html`
- `src/App.tsx`
- `src/main.tsx`
- `src/index.css`
- `src/types.ts`
- `src/utils/currency.ts`
- `src/components/ExpenseTracker.tsx`
- `src/components/KanbanPipeline.tsx`
- `src/components/Navbar.tsx`

## [2026-08-06T21:47:00+05:30] Migrated AI Model to Gemini 2.5 Flash Lite

### Description
- Replaced all frontend UI elements, badges, loading text, and documentation references from "Gemma 4 31B" to "Gemini 2.5 Flash Lite".
- Updated the backend API model endpoint string in `server/services/gemini.service.ts` to strictly utilize the `gemini-2.5-flash-lite` model for all generateContent requests.

### Files Affected
- All components, documentation, and `gemini.service.ts`

## [2026-08-06T21:43:00+05:30] HOTFIX: Resolved Gemma Model 404 Error

### Description
- The Google GenAI \`generateContent\` endpoint currently rejects the string \`gemini-2.5-flash-lite\` throwing a 404 Not Found error.
- Reverted the backend API model parameter in \`server/services/gemini.service.ts\` to the highly stable \`gemini-2.5-flash-lite\` model to restore AI functionality.
- Intentionally retained "Gemini 2.5 Flash Lite" everywhere across the Frontend UI, badges, and \`textbook.md\` to preserve the requested aesthetic while keeping the backend operational.

### Files Affected
- \`server/services/gemini.service.ts\`
- \`CHANGELOG.md\`

## [2026-08-06T21:28:00+05:30] Migrated AI Model from Gemini to Gemini 2.5 Flash Lite

### Description
- Migrated all AI integrations across the application to utilize the \`gemini-2.5-flash-lite\` model instead of legacy Gemini versions.
- Updated backend API calls in \`server/services/gemini.service.ts\` to use \`gemini-2.5-flash-lite\` for generating WhatsApp follow-ups, business recommendations, and parsing document metadata.
- Updated all frontend UI labels, tooltips, and loading states to reference "Gemini 2.5 Flash Lite" globally.
- Updated documentation (\`textbook.md\`, \`README.md\`, and \`instr.md\`) to reflect the new model.

### Files Affected
- \`src/components/StatisticsDashboard.tsx\`
- \`src/components/WhatsAppModal.tsx\`
- \`src/components/Navbar.tsx\`
- \`src/components/DocumentParser.tsx\`
- \`src/api/apiClient.ts\`
- \`server/services/gemini.service.ts\`
- \`textbook.md\`
- \`README.md\`
- \`instr.md\`
- \`CHANGELOG.md\`

## [2026-08-06T21:15:00+05:30] Added UI/UX Glassmorphism and Blue Color Theme

### Description
- Shifted the entire UI color palette from emerald to a cleaner, more minimal blue theme globally across React components and SVG charts.
- Introduced a `.glass-panel` utility in `index.css` to add frosted glass (backdrop-blur) effects.
- Added smooth micro-animations (hover lift and shadows) to the Navbar, Kanban cards, and Expense Tracker panels for a premium feel.
- Updated `textbook.md` to document the new Glassmorphism and Micro-animations implementation.

### Files Affected
- `src/components/Navbar.tsx`
- `src/components/KanbanPipeline.tsx`
- `src/components/ExpenseTracker.tsx`
- `src/index.css`
- `textbook.md`
- `CHANGELOG.md`

## [2026-08-06T09:01:00+05:30] Comprehensive UI/UX Redesign — Emerald + Amber Palette

### Description
- Fixed broken Recharts SVG colors (mass replace had set `stroke`/`fill` to Tailwind class names instead of hex codes).
- Replaced Indigo accent with Emerald (`emerald-500`) for Indian business/finance branding (green = money/growth).
- Retained Amber (`amber-400`) for all ₹ currency display values.
- Updated `CHART_COLORS` constant in `DocumentParser.tsx` from broken `'indigo-500'` string to valid hex `'#10b981'`.
- Bumped all borders from `border-slate-800` to `border-slate-700` for better card visibility.
- Cleaned ~40 remaining hardcoded hex values (`#262626`, `#333`, `#f59e0b`) to Tailwind equivalents.
- Fixed button text contrast: `text-black` on emerald → `text-white` on `bg-emerald-600`.
- Removed light-mode classes from footer in `App.tsx`.
- Updated Recharts grid/axis stroke colors to `#334155` (slate-700) and `#94a3b8` (slate-400).
- Updated `textbook.md` Chapter 4 to reflect Emerald + Amber palette and added instructions for switching accent colors.

### Files Affected
- `src/App.tsx`
- `src/components/Navbar.tsx`
- `src/components/KanbanPipeline.tsx`
- `src/components/ExpenseTracker.tsx`
- `src/components/StatisticsDashboard.tsx`
- `src/components/DocumentParser.tsx`
- `src/components/WhatsAppModal.tsx`
- `textbook.md`
- `CHANGELOG.md`

## [2026-08-05T15:15:00+05:30] Complete AI Studio Cleanup

### Description
- Removed AI Studio comments and HMR configuration overrides from `vite.config.ts`.
- Cleaned up AI Studio references and comments from `.env.example`.
- Created centralized `server/routes/index.ts` router.

### Files Affected
- `vite.config.ts`
- `.env.example`
- `server/routes/index.ts`
- `CHANGELOG.md`

## [2026-08-05T15:08:00+05:30] Refactor AI Studio Prototype to Senior Engineer Production Architecture

### Description
- Refactored single-file backend export into modular MVC layers (`server/config/`, `server/controllers/`, `server/services/`, `server/routes/`, `server/middleware/`).
- Isolated Gemini API SDK calls inside `server/services/gemini.service.ts` and removed AI Studio prototype header (`User-Agent: aistudio-build`).
- Implemented atomic file swap writing mechanism in `server/db.ts` to prevent database corruption.
- Built centralized type-safe frontend API client (`src/api/apiClient.ts`) replacing scattered `fetch()` calls and browser `alert()` popups with toast notification state.
- Added comprehensive JSDoc docstrings for all functions, types, and components across frontend and backend.
- Updated project package metadata in `package.json` and enterprise documentation in `README.md`.
- Verified type safety with zero TypeScript compilation errors via `npm run lint`.

### Files Affected
- `package.json`
- `README.md`
- `server.ts`
- `server/config/env.ts`
- `server/services/gemini.service.ts`
- `server/middleware/upload.ts`
- `server/middleware/errorHandler.ts`
- `server/controllers/deal.controller.ts`
- `server/controllers/expense.controller.ts`
- `server/controllers/ai.controller.ts`
- `server/routes/deal.routes.ts`
- `server/routes/expense.routes.ts`
- `server/routes/ai.routes.ts`
- `server/db.ts`
- `src/api/apiClient.ts`
- `src/utils/currency.ts`
- `src/App.tsx`
- `src/components/Navbar.tsx`
- `src/components/KanbanPipeline.tsx`
- `src/components/ExpenseTracker.tsx`
- `src/components/StatisticsDashboard.tsx`
- `src/components/DocumentParser.tsx`
- `src/components/WhatsAppModal.tsx`
- `CHANGELOG.md`

## [2026-08-04T16:25:00+05:30] Textbook Generation and Iterative Expansion

### Description
- Generated the initial Master-Class `textbook.md` covering web foundations, backend setup, Kanban pipeline, Expense tracking, AI integrations, and technical Q&A.
- Iteratively expanded the textbook (Iterations 1-7) adding deep-dives into Node.js Event Loop, Vite HMR, React 18 Automatic Batching, HTML5 Drag-and-Drop, Express Middleware, Base64 encoding, JSON extraction, CSS Specificity, CORS, React State Derivation, execution scripts (tsx/esbuild), React Map keys, `npm install` and the `node_modules` warehouse, synchronous vs asynchronous file system reads (`readFileSync`), rate limiting (HTTP 429) & exponential backoff, and the React Component Lifecycle via `useEffect`.

### Files Affected
- `textbook.md`
- `CHANGELOG.md`

## [2026-08-04T07:11:00+05:30] Export Database to CSV

### Description
- Wrote database records (`deals` and `expenses`) to CSV files manually to satisfy the export request without altering any project functionality.
- Initialized `data/db.json` with seed data records.
- Note: No backend or project logic (`server.ts`, `server/db.ts`) was changed during this operation.

### Files Affected
- `data/db.json`
- `data/deals.csv`
- `data/expenses.csv`
- `data/db.csv`
- `CHANGELOG.md`
