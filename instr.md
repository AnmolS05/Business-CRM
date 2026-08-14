To prevent your AI tool from rushing and generating a short summary in 2 minutes, you should use a **modular prompt sequence (a Multi-Step Scheduler)**. 

LLMs generate output in a single run and cannot "wait" internally for 1.5 hours. If you give them one giant task, they will try to summarize it quickly. To force the AI to spend hours of processing time and write a highly detailed textbook, you must feed it instructions **one chapter at a time**.

Here is your **7-Step Progressive Textbook Scheduler**. Run these prompts one by one in your platform. Each prompt uses simplified, storytelling analogies (the "teach-a-baby" approach) and provides a step-by-step construction sequence.

---

### Step 1: Run this Prompt First
#### copy and paste this into your AI tool to generate Chapter 1:

```markdown
# CHAPTER 1: THE "ZERO-TO-HERO" WEB FOUNDATIONS (THE BABY STEP PRIMER)
You are a Computer Science Professor who specializes in teaching absolute beginners. Your task is to write Chapter 1 of our comprehensive web development textbook called `textbook.md`. 

You must not use technical jargon without explaining it first. Use simple, real-world analogies (like restaurants, toys, or sketchpads) to explain concepts.

Write an exhaustive guide covering the absolute basics:

1. THE BUILDING BLOCKS (THE "HUMAN BODY" ANALOGY):
   - What is HTML? Explain it as the skeleton of a human body, or the wood framing of a house.
   - What is CSS? Explain it as the skin, clothes, and paint of a house.
   - What is JavaScript? Explain it as the muscles and brain that allow the body to walk, run, and react.
   
2. CLIENT-SERVER (THE "RESTAURANT" ANALOGY):
   - What is a Client (Browser)? Explain it as a customer sitting at a table.
   - What is a Server? Explain it as the kitchen chef who takes raw ingredients and cooks a meal.
   - What is an HTTP Request (GET, POST, PUT, DELETE)? Explain it as the waiter carrying order slips back and forth between the table and the kitchen.
   - What is a Database? Explain it as the restaurant's storage pantry where ingredients are locked away and cataloged.

3. THE TOOLS:
   - What is Node.js? Explain it as a magical engine that lets JS run outside of the browser (on the chef's computer).
   - What is TypeScript? Explain it as a strict supervisor who double-checks your spelling and variables before you run the code, preventing bugs.
   - What is React? Explain it as a magic canvas that only repaints the exact parts of a picture that change, rather than erasing the whole canvas and starting over (Virtual DOM vs. Real DOM).

Write this section in massive, engaging, and rich detail. Make it fun and interesting to read. Do not move onto other chapters yet.
```

---

### Step 2: Run this Prompt Second
#### copy and paste this to generate Chapter 2:

```markdown
# CHAPTER 2: THE STEP-BY-STEP ASSEMBLY BLUEPRINT (PART 1 - THE SKELETON)
Write Chapter 2 of our `textbook.md` file. This chapter must guide an absolute beginner step-by-step, 1-by-1, through setting up the workspace. Assume they have never opened a terminal or written code before.

Provide clear, interesting instructions for the following steps:

1. STEP 1: INSTALLING THE ENGINES
   - Explain what Node.js is to a beginner and how to check if it's installed.
   - What is a terminal/command prompt? Explain it as a "text-based control room."

2. STEP 2: CREATING THE DIRECTORY SKELETON
   - List the exact folders to create manually: `data/`, `server/`, `src/components/`, `src/utils/`. Explain why each folder exists.

3. STEP 3: THE CONFIGURATION FILES (THE "INSTRUCTION MANUALS")
   - Explain `package.json` simply: It is the shopping list of tools our project needs to run. Define major tools like `recharts`, `react`, `express`, and `multer`.
   - Explain `tsconfig.json` simply: It is the rulebook telling our strict TypeScript supervisor how closely to watch our code.
   - Explain `vite.config.ts` simply: It is the fast-packing machine that bundles our code together so the browser can read it.

Provide full, annotated configuration files for `package.json`, `tsconfig.json`, and `vite.config.ts` from our repository context, explaining what every single setting means to a beginner.
```

---

### Step 3: Run this Prompt Third
#### copy and paste this to generate Chapter 3:

```markdown
# CHAPTER 3: THE BACKEND & DATABASE (THE "KITCHEN & PANTRY")
Write Chapter 3 of our `textbook.md` file. Explain how the backend operates, guiding a beginner step-by-step through setting up the server and memory file-system.

Use the "pantry and ledger" analogy to explain the backend structure:

1. THE FILE-BASED DATABASE (`server/db.ts`):
   - Explain what a JSON file is: A text file written in a simple format that both humans and computers can read like a notepad list.
   - Walk through `server/db.ts`. Explain how the code reads from `data/db.json` and writes back to it using Node's `fs` (File System) library. Explain `fs.readFileSync` and `fs.writeFileSync` as "reading from a ledger book" and "writing down a transaction."

2. THE SERVER API (`server.ts`):
   - Explain what an Express Server is: The waiter taking orders.
   - Break down how the backend routing works for:
     - `GET /api/deals` (Retrieving the menu/deals).
     - `POST /api/deals` (Adding a new item to the order/saving a deal).
     - `PUT /api/deals/:id` (Modifying an existing order).
     - `DELETE /api/deals/:id` (Tearing up an order slip).
   - Explain what a Port is (e.g., Port 3000): Think of it as a specific window at the counter where clients must talk to the server.

Write this step-by-step assembly guide with rich, supportive comments so a complete beginner can understand exactly how data moves from the browser, through the server, and onto the computer's hard drive.
```

---

### Step 4: Run this Prompt Fourth
#### copy and paste this to generate Chapter 4:

```markdown
# CHAPTER 4: THE LAKHS & CRORES KANBAN FRONTEND (THE "FRONT COUNTER")
Write Chapter 4 of our `textbook.md` file. This chapter focuses on building the frontend Kanban board.

Explain frontend architecture using the "Sketchpad and Sticky Notes" analogies:

1. REACT STATE & COMPONENTS:
   - What is a Component? Explain it as a reusable Lego block (e.g., a Card or a Column).
   - What is React State (`useState`)? Explain it as a magical erasable sticky note that holds information that changes (like whether a modal is open).
   - What is a Prop? Explain it as passing a toy from one child to another (passing data from parent `App.tsx` to child `KanbanPipeline.tsx`).

2. THE LAKHS & CRORES SYSTEM (`src/utils/currency.ts`):
   - Explain the difference between international formatting (Millions/Billions) and the Indian system (Lakhs and Crores).
   - Walk through the formatting code in `currency.ts` line-by-line, explaining how the math checks if a number is over 10,00,000 (10 Lakhs/1 Crore) and formats it as `₹X Lakhs` or `₹X Cr`.

3. THE KANBAN PIPELINE (`src/components/KanbanPipeline.tsx`):
   - Walk through how drag-and-drop works simply.
   - Explain how HTML drag events tell the database to update a deal's stage.

Write this in step-by-step format, showing how to connect `App.tsx` state to the Kanban components.
```

---

### Step 5: Run this Prompt Fifth
#### copy and paste this to generate Chapter 5:

```markdown
# CHAPTER 5: LOGGING EXPENSES & NET PROFIT (THE "BUSINESS SCOREBOARD")
Write Chapter 5 of our `textbook.md` file. Explain how the business tracks its financial health, comparing money won to money spent.

Use clear business concepts explained in simple terms:

1. UNDERSTANDING CASH FLOW:
   - What is Gross Revenue? All the money you made (Won Deals).
   - What are Expenditures? All the money you spent (Expenses).
   - What is Net Profit? Gross Revenue minus Expenses. 
   - What is Profit Margin? The percentage of revenue you actually keep as profit.

2. FIXED VS. VARIABLE EXPENSES:
   - What are Fixed Expenses? Things you must pay every single month regardless of sales (like Office Rent or SaaS Tool Subscriptions).
   - What are Variable Expenses (Add-ons)? Extra costs that happen occasionally (like client lunches or flights).

3. ASSEMBLY STEP-BY-STEP FOR `src/components/ExpenseTracker.tsx`:
   - Explain how the form works to log expenses.
   - Explain the math: Show how we sum the values of all deals where stage is 'Won', sum all expense amounts, and subtract them to find net profit in Indian Rupees.

Write this chapter with clean, structured steps so a beginner understands the connection between financial math and web programming.
```

---

### Step 6: Run this Prompt Sixth
#### copy and paste this to generate Chapter 6:

```markdown
# CHAPTER 6: INTEGRATING GEMINI AI (THE "AI WIZARD")
Write Chapter 6 of our `textbook.md` file. This chapter is about connecting the Google Gemini 2.5 Flash Lite API to our CRM app to generate WhatsApp drafts, business insights, and analyze documents.

Explain AI concepts using simple, magical analogies:

1. HOW LLMs WORK:
   - What is a Prompt? Think of it as whispering an instruction to a highly knowledgeable, fast-reading wizard.
   - What is `gemini-2.5-flash-lite`? Explain it as a fast, smart, and lightweight AI model that can read both text and files.

2. FEATURE 1: WHATSAPP LINK GENERATOR:
   - Explain how Gemini 2.5 Flash Lite is used to generate a short, professional follow-up template.
   - Explain the magic of the browser link redirect: How `wa.me` links allow us to send WhatsApp messages without building complicated business accounts.

3. FEATURE 2: THE BUSINESS RECOMMENDATIONS ENGINE:
   - Explain how we package top sales categories and expense figures into a tiny prompt for Gemini 2.5 Flash Lite to give real-world strategic advice.

4. FEATURE 3: THE "DROP & ANALYZE" DOCUMENT PARSER:
   - What is Multimodal AI? Explain how Gemini 2.5 Flash Lite can read files (PDFs, Images, Excel) just like a human eye.
   - Explain the concept of Base64 encoding: Converting a file (like an image) into a giant string of letters and numbers so we can send it securely via the API.
   - Explain the Chart JSON extraction logic: How Gemini 2.5 Flash Lite returns both a text analysis and a structured data block, and how our code extracts the JSON data to build interactive charts dynamically.

Provide step-by-step guides for these API endpoints, explaining the code flow clearly for beginners.
```

---

### Step 7: Run this Prompt Seventh
#### copy and paste this to generate Chapter 7:

```markdown
# CHAPTER 7: CHARTS, STATS, QA & INTERVIEW DRILLS (THE FINAL EXAM)
Write Chapter 7 (the final chapter) of our `textbook.md` file. This chapter covers drawing charts with Recharts, framing beginner questions, and mock interview practice.

1. UNDERSTANDING CHARTS IN RECHARTS:
   - How do coordinate charts work? Explain X-Axis (horizontal line) and Y-Axis (vertical line) like drawing dots on grid paper.
   - Explain how React structures the data arrays so Recharts can draw Month vs. Sales and Product Category breakdowns.

2. BEGINNER QA & troubleshooting (15 Questions & Answers):
   - Frame easy-to-understand questions and answers (e.g., *"Why does my browser show a blank page if I have an error in React?"* or *"What happens if Gemini 2.5 Flash Lite is offline?"*).

3. JOB INTERVIEW DRILLS (10 Questions & Answers):
   - Provide realistic interview questions mapping directly to the tech stack (React, Node, Express, TypeScript, Gemini 2.5 Flash Lite API) to help developers land their first web development job.

Combine all sections with highly engaging explanations to finish our technical textbook.
```

---

# COLOR & ANIMATION REDESIGN PLAN (PRIVATE - DO NOT PUBLISH)

## Philosophy
The current theme is too dark and heavy (`slate-950` base, opaque slate panels). We will shift to a **light, clean, minimal professional** aesthetic — a soft white/light-gray canvas with precise indigo/blue accent colours. Think Linear.app, Notion, or Stripe's dashboard aesthetic.

## New Color Token System (Global)

Replace the following across ALL components:

| Old Token (Dark) | New Token (Light) | Usage |
|---|---|---|
| `bg-slate-950` | `bg-gray-50` | App & page background |
| `bg-slate-900` | `bg-white` | Card & panel backgrounds |
| `bg-slate-800` | `bg-gray-100` | Input fields, secondary surfaces |
| `border-slate-700` | `border-gray-200` | All panel borders |
| `text-slate-100` | `text-gray-900` | Primary headings & body text |
| `text-slate-400` | `text-gray-500` | Secondary / muted text labels |
| `bg-blue-600` | `bg-indigo-600` | Primary CTA buttons (active tab, submit) |
| `text-blue-500` | `text-indigo-600` | Accent text (values, links) |
| `bg-blue-500/15` | `bg-indigo-50` | Soft accent badge/chip backgrounds |
| `border-blue-500/30` | `border-indigo-200` | Soft accent borders |
| `shadow-blue-500/5` | `shadow-gray-200` | Panel drop shadows |
| Amber text | `text-orange-500` | Rupee / monetary values |
| Rose error states | `bg-red-50 border-red-200 text-red-700` | Error banners |

## Component-by-Component Color Plan

### 1. `index.css` (Global Foundation)
- Change body background: `#f8fafc` (gray-50, near-white).
- Remove blue radial gradients from body (they feel heavy on a light theme).
- Add a very subtle grain texture or keep it clean solid.
- `.glass-panel`: change to `bg-white/80 backdrop-blur-sm border border-gray-200/80 shadow-sm`.
- Scrollbar track: `#f1f5f9`, thumb: `#cbd5e1`.

### 2. `index.html`
- Change `theme-color` meta to `#f8fafc`.

### 3. `App.tsx` (Root Shell)
- `min-h-screen bg-slate-950` → `min-h-screen bg-gray-50`.
- Toast notifications: success → `bg-white border border-indigo-200 text-indigo-700 shadow-lg`, error → `bg-white border border-red-200 text-red-700 shadow-lg`.
- Loading spinner color: `border-indigo-500`.
- Footer: `border-gray-200 bg-white/80 text-gray-400`.

### 4. `Navbar.tsx`
- Header wrapper: `bg-white/90 border-b border-gray-200 backdrop-blur-sm shadow-sm`.
- Logo icon: `bg-indigo-600` (keep).
- Brand heading: `text-gray-900`, subtitle: `text-gray-400`.
- Badge "Lakhs & Crores": `bg-indigo-50 text-indigo-600 border-indigo-100`.
- Active tab button: `bg-indigo-600 text-white`.
- Inactive tab button: `text-gray-500 hover:text-gray-900 hover:bg-gray-100`.
- Tab border separator: `border-gray-200`.
- Reset button: `bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200`.

### 5. `KanbanPipeline.tsx`
- Stage column headers: `bg-white border border-gray-200 rounded-xl` with a thin colored top-border per stage.
  - Lead: `border-t-2 border-t-blue-400`
  - Proposal: `border-t-2 border-t-amber-400`
  - Negotiation: `border-t-2 border-t-orange-400`
  - Won: `border-t-2 border-t-green-400`
  - Lost: `border-t-2 border-t-red-400`
- Deal cards: `bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200`.
- Card client name: `text-gray-900 font-semibold`.
- Card deal value: `text-indigo-600 font-bold`.
- Card stage badge: stage-colored soft chips (see stage colors above).
- Add Deal button: `bg-indigo-600 text-white hover:bg-indigo-700`.
- Form modal panels: `bg-white border border-gray-200 rounded-2xl shadow-xl`.
- Input fields in form: `bg-gray-50 border border-gray-200 text-gray-900 focus:border-indigo-400`.

### 6. `ExpenseTracker.tsx`
- KPI summary cards: `bg-white border border-gray-200 rounded-xl shadow-sm`.
- Gross Revenue value: `text-indigo-600`.
- Total Expenses value: `text-red-600`.
- Net Profit value: green if positive (`text-green-600`), red if negative (`text-red-600`).
- Input form panel: `bg-white border border-gray-200 rounded-xl`.
- Input fields: `bg-gray-50 border border-gray-200 text-gray-900`.
- Submit button: `bg-indigo-600 text-white hover:bg-indigo-700`.
- Expense table: `bg-white border border-gray-200 rounded-xl`.
- Table header row: `bg-gray-50 text-gray-500 text-xs uppercase`.
- Table body rows: `text-gray-900`, even rows `bg-gray-50/50`.
- Delete button: `text-red-400 hover:text-red-600`.

### 7. `StatisticsDashboard.tsx`
- All section panels: `bg-white border border-gray-200 rounded-2xl shadow-sm`.
- KPI cards (same as ExpenseTracker pattern above).
- Recharts colors: use `#6366f1` (indigo), `#f59e0b` (amber), `#10b981` (emerald), `#ef4444` (red) for pie/bar fills.
- AI Advisor card: `bg-white border-2 border-indigo-100 rounded-2xl` with indigo gradient header.
- AI Advisor loading state: `bg-indigo-50 text-indigo-600`.
- "Get AI Analysis" button: `bg-indigo-600 text-white`.

### 8. `DocumentParser.tsx`
- Header info panel: `bg-white border border-gray-200 rounded-xl shadow-sm`.
- File drop zone: `bg-gray-50 border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30`.
- Sample buttons: `bg-gray-100 text-gray-700 border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700`.
- Analyze button: `bg-indigo-600 text-white hover:bg-indigo-700`.
- Analysis output panel: `bg-white border border-gray-200 rounded-xl`.
- Chart result panels: `bg-white border border-gray-200 rounded-xl shadow-sm`.

### 9. `WhatsAppModal.tsx`
- Modal backdrop: `bg-black/50 backdrop-blur-sm`.
- Modal container: `bg-white rounded-2xl shadow-2xl border border-gray-200`.
- Modal header: `bg-gray-50 border-b border-gray-200 text-gray-900`.
- Deal metadata banner: `bg-indigo-50 border border-indigo-100 rounded-lg`.
- Deal value: `text-indigo-600`.
- Phone input + draft textarea: `bg-gray-50 border border-gray-200 text-gray-900 focus:border-indigo-400`.
- Footer: `bg-gray-50 border-t border-gray-200`.
- Copy button: `bg-white border border-gray-200 text-gray-700 hover:bg-gray-100`.
- Send WhatsApp button: `bg-indigo-600 text-white hover:bg-indigo-700`.

---

## Animation Plan (Add to All Components)

### A. Page Tab Transitions
When the user switches tabs, the content should animate in. Add this to each tab's rendered content wrapper:
- Class: `animate-in fade-in slide-in-from-bottom-3 duration-300`
- This ensures tab switches feel seamless rather than a hard cut.

### B. Card Hover (Kanban & Analytics)
All deal cards and stat cards should have:
- `transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-200`
- Removes the old heavy `hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10` and replaces with subtler, lighter lift.

### C. Modal Enter Animation
Already done with `animate-in fade-in zoom-in duration-200`. Keep it.

### D. KPI Number Count-Up Animation
For the gross revenue, expenses, and profit figures — add a brief scale pulse on mount:
- Wrap the number span in a `<span key={value} className="animate-in zoom-in-95 duration-300">` so it re-mounts when the value changes and plays the animation.

### E. Toast Notification
Add `animate-in slide-in-from-bottom-4 fade-in duration-300` to the toast container.

### F. Skeleton Loading
Replace the full-page spinning icon with a skeleton pattern (optional but premium). Use `animate-pulse bg-gray-200 rounded-xl` blocks that mimic the card layout.

---
END OF PLAN. Implement all items above strictly by component, do not mix component changes. Commit each component as a separate git commit (when authorized).