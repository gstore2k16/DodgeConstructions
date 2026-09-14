# Local Development Setup Guide

This document provides a step-by-step setup guide for setting up, building, testing, and running the **DodgeConstructions** Web Application locally for development.

---

## 1. Prerequisites

Ensure your development workstation meets the following minimum system requirements:

- **Node.js**: `^18.19.0` or `^20.9.0` (Recommended: Node.js 20 LTS)
- **npm**: `^9.0.0` or `^10.0.0`
- **Git**: `^2.30.0`
- **Angular CLI** (Optional global install): `npm install -g @angular/cli@21`

Check your installed versions by running:

```bash
node -v
npm -v
git --version
```

---

## 2. Step-by-Step Project Setup

### Step 1: Clone the Repository

Clone the repository to your local workspace and navigate to the project directory:

```bash
git clone https://github.com/gstore2k16/DodgeConstructions.git
cd DodgeConstructions
```

### Step 2: Install Dependencies

Install all required Node modules and development dependencies:

```bash
npm install
```

### Step 3: Initialize Git Pre-Commit Hooks

Prepare Husky git hooks to enable automated formatting and pre-commit checks:

```bash
npm run prepare
```

---

## 3. Available Development Commands

Run the following commands using `npm`:

```bash
# Start local development server (runs hot-reloading at http://localhost:4200/)
npm start

# Run unit test suite (executes 146 unit tests across 21 test suites)
npm test

# Format code files using Prettier
npm run format

# Check formatting compliance without editing files
npm run format:check

# Compile production build
npm run build
```

---

## 4. Local Development Server

1. Run `npm start` (or `npx ng serve`).
2. Open your browser and navigate to `http://localhost:4200/`.
3. The application will automatically reload whenever you edit source code files.

---

## 5. Running Unit Tests

The project includes 146 unit tests covering services, components, pipes, and interceptors:

```bash
npm test
```

Expected Output Summary:

```
# tests 146
# suites 21
# pass 146
# fail 0
```

---

## 6. Verifying Production Build

To verify that the application compiles cleanly for production:

```bash
npm run build
```

Compiled output artifacts will be generated inside the `dist/` directory.
