# Contributing to Business CRM and Advisor

First off, thank you for considering contributing to the Business CRM and Advisor! It's people like you that make this tool such a great solution for Indian business owners. 

This document provides guidelines and instructions for contributing to this repository.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Architecture Overview](#architecture-overview)
4. [Development Workflow](#development-workflow)
5. [Pull Request Process](#pull-request-process)
6. [Coding Standards](#coding-standards)

## Code of Conduct
By participating in this project, you agree to abide by our Code of Conduct. We expect all contributors to maintain a respectful and inclusive environment.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Bun (Package manager)
- SQLite (for local database development)

### Local Setup
1. Fork the repository and clone it locally.
2. Install dependencies:
   ```bash
   bun install
   ```
3. Copy `.env.example` to `.env` and fill in your Gemini API key and other environment variables.
4. Start the development server:
   ```bash
   bun run dev
   ```

## Architecture Overview
This project uses a modern, clean architecture:
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Node.js, Express, SQLite (via `sqlite3` and `sqlite`), Google GenAI SDK.
- **State Management**: Custom React Hooks for separating logic from UI components.
- **Monorepo**: Both frontend and backend coexist in this repository.

## Development Workflow
1. **Branching**: Always create a feature branch from `main`. 
   - `feat/feature-name` for new features
   - `fix/bug-name` for bug fixes
   - `refactor/refactor-name` for architectural changes
2. **Commit Messages**: We follow Conventional Commits. Use the provided `commit_script.py` to enforce standard commit formats.

## Pull Request Process
1. Ensure your code passes all linting rules: `bun run lint`.
2. Update the `CHANGELOG.md` with your changes under the `[Unreleased]` section.
3. If you have modified APIs, ensure the documentation is updated accordingly.
4. Submit your PR against the `main` branch. 
5. A project maintainer will review your code. Be prepared to make requested changes.

## Coding Standards
- **Clean Architecture**: Keep UI components dumb. All API logic and complex state management should reside in custom hooks (`src/hooks/`).
- **Backend Controllers**: Keep Express controllers lean. Move business logic and third-party integrations (like Gemini API) to `server/services/`.
- **TypeScript**: Use strict typing. Avoid `any` wherever possible.
- **Styling**: Use Tailwind utility classes. For complex conditional logic, use standard React practices.

Thank you for your contributions!
