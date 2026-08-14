# CapitalFlow Pro

**CapitalFlow Pro** is an Enterprise Indian Business CRM and AI-Powered Financial Advisor. It combines traditional business tracking (deals and expenses) with advanced Artificial Intelligence powered by Google's Gemini, giving businesses actionable insights and seamless workflow integrations.

## 🎯 Objectives
- **Centralized Deal Management:** Manage enterprise sales deals seamlessly through a visual Kanban pipeline.
- **Automated Expense Tracking:** Track fixed and variable company expenditures with clear financial records.
- **AI-Powered Insights:** Leverage Gemini AI to generate strategic business recommendations and automate follow-up communication (like WhatsApp messages).
- **Intelligent Document Parsing:** Upload financial documents (PDFs, Images, CSVs) and have the Gemini Multimodal AI analyze and extract critical information automatically.

## ✨ Features
- **Kanban Pipeline:** Drag-and-drop styled pipeline to track leads from initial contact to closed deals.
- **Ledger & Expense Tracker:** Comprehensive financial tracking for office rent, payroll, SaaS subscriptions, and more.
- **Analytics & AI Dashboard:** Visualize your data with dynamic charts powered by Recharts and get on-demand business recommendations from Gemini.
- **Document Parser:** Direct file upload system connecting to Gemini 2.5 Flash Lite for rapid invoice and document summarization.
- **Dark Mode Support:** A sleek, beautiful UI tailored for both light and dark aesthetics.

## 🛠️ Technologies Used
- **Frontend:** React, Vite, TailwindCSS (v4), Framer Motion (for animations), Lucide React (for icons), Recharts.
- **Backend:** Node.js, Express, Multer (for file handling).
- **AI Integration:** `@google/genai` (Gemini 2.5 Flash Lite).

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd business-crm-and-advisor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The application should now be running on `http://localhost:5000` (or another port if specified).

## 📦 Build for Production
To build the application for production, run:
```bash
npm run build
```
You can then start the production server using:
```bash
npm start
```
