# 💼 CapitalFlow Pro

> **Enterprise Indian Business CRM and AI-Powered Financial Advisor**

CapitalFlow Pro is a state-of-the-art business management and financial tracking system tailored for enterprise-scale operations. It seamlessly blends robust traditional business tracking (deals and expenses) with next-generation Artificial Intelligence powered by Google's Gemini. This comprehensive suite delivers actionable insights, intelligent automation, and deep financial analytics.

---

## 🎯 Strategic Objectives

- **Centralized Deal Management:** Manage enterprise sales pipelines effortlessly through an intuitive, interactive Kanban pipeline.
- **Automated Expense Tracking:** Maintain pristine financial records with dedicated modules for tracking fixed and variable corporate expenditures.
- **AI-Powered Insights:** Harness Gemini AI to generate strategic business recommendations, forecast trends, and automate follow-up communication (such as drafting personalized WhatsApp messages).
- **Intelligent Document Parsing:** Streamline data entry by uploading financial documents (PDFs, Images, CSVs). The Gemini Multimodal AI analyzes and extracts critical metadata automatically, integrating it directly into your workflows.

## ✨ Core Features

- **Kanban Pipeline:** A fully responsive, drag-and-drop pipeline visualizing the lead lifecycle from initial contact through to closed-won.
- **Ledger & Expense Tracker:** Comprehensive financial tracking covering operational costs, payroll, SaaS subscriptions, and incidental expenses.
- **Analytics & AI Dashboard:** Visualize complex data through dynamic, real-time charts (Recharts) alongside on-demand, contextual business recommendations from Gemini.
- **Document Parser:** Direct file upload system connected to Gemini 2.5 Flash Lite for rapid invoice processing and document summarization.
- **Premium UI/UX:** A stunning, glassmorphism-inspired interface featuring micro-animations and robust dark mode support, built with TailwindCSS v4 and Framer Motion.

## 🛠️ Architecture & Technology Stack

The application is built on a unified Monorepo architecture containing both the frontend client and the Node backend:

- **Frontend:**
  - **Framework:** React 19 + Vite
  - **Styling:** TailwindCSS v4 with Glassmorphism UI tokens
  - **Animations:** Framer Motion
  - **Data Visualization:** Recharts
  - **Icons:** Lucide React
- **Backend:**
  - **Runtime:** Node.js
  - **Framework:** Express.js
  - **File Handling:** Multer (Memory Storage)
  - **AI Integration:** `@google/genai` (utilizing `gemini-2.5-flash-lite` model)

## 🚀 Getting Started

Follow these instructions to set up the repository for local development and testing.

### Prerequisites

Ensure the following tools are installed on your local environment:
- **Node.js**: Version 20.x or higher is recommended.
- **npm**: Comes bundled with Node.js.
- **Git**: For version control and repository management.

### Installation & Local Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/AnmolS05/Business-CRM.git
   cd Business-CRM
   ```

2. **Install Dependencies:**
   Install all required NPM packages for both the client and server.
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Copy the provided `.env.example` file to create your local environment configuration.
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and securely insert your Google Gemini API key:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

4. **Start the Development Environment:**
   Run the unified development script, which will start the Vite frontend and `tsx` backend concurrently:
   ```bash
   npm run dev
   ```
   The application will be accessible at: `http://localhost:5000` (or the port defined in your environment).

## 🧪 Testing and Linting

To ensure code quality and verify TypeScript typings before committing changes, run the linter:
```bash
npm run lint
```
*(Note: Automated testing suites like Jest/Vitest can be added and run via standard npm scripts.)*

## 📦 Build for Production

When preparing for deployment, the application must be bundled into a production-ready package.

1. **Build the Application:**
   This command compiles the React frontend using Vite and bundles the Node.js backend using `esbuild`.
   ```bash
   npm run build
   ```

2. **Start the Production Server:**
   Execute the compiled server bundle.
   ```bash
   npm run start
   ```

3. **Clean Build Artifacts:**
   To reset the build environment and remove the `dist` folder:
   ```bash
   npm run clean
   ```

## 🤝 Contributing

We adhere to a strict standard of high-precision, continuous execution. When contributing:
1. Ensure all code modifications maintain scientific validity and root-cause resolution principles.
2. Verify that no existing functionality is broken.
3. Update `CHANGELOG.md` with every significant modification, detailing the date, description, and affected files.

## 📄 License

This project is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.
