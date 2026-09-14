# CI/CD Pipeline & Deployment Strategy

This document describes the continuous integration (CI), automated quality verification pipeline, build artifact optimization, and live production deployment strategy for the **DodgeConstructions** Web Application.

---

## 1. CI/CD Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Developer Workspace                        │
│   Commit → Husky Pre-Commit Hook (lint-staged Prettier format)  │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Push / Pull Request
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Actions CI Pipeline                   │
│   1. Checkout Code & Cache NPM                                  │
│   2. Install Clean Dependencies (npm ci)                        │
│   3. Run Prettier Check (npm run format:check)                  │
│   4. Run Unit Test Suite (npm test - 146/146 green)             │
│   5. Execute Production Compilation (npm run build)             │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Automated Deployment Trigger (main branch)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Netlify Production Hosting                   │
│   Live Environment: https://timely-florentine-2f5598.netlify.app│
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. GitHub Actions CI Matrix (`ci.yml`)

The continuous integration workflow is defined in `.github/workflows/ci.yml`. It runs automatically on pushes to `main` and on pull requests targeting `main`.

### Pipeline Execution Order

1. **Dependency Installation**: `npm ci` restores clean, deterministic dependencies from `package-lock.json`.
2. **Format Verification**: `npm run format:check` verifies that all modified files satisfy Prettier rules.
3. **Unit Test Execution**: `npm test` runs 146 unit tests across 21 test suites using the custom node test runner.
4. **Production Compilation**: `npm run build` runs Angular AOT production compilation to verify build integrity.

---

## 3. Production Build Optimization

Production compilation is configured in `angular.json` under `projects.demo.architect.build.configurations.production`:

```json
"production": {
  "aot": true,
  "extractLicenses": true,
  "namedChunks": false,
  "optimization": true,
  "outputHashing": "all",
  "sourceMap": false,
  "fileReplacements": [
    {
      "replace": "src/environments/environment.development.ts",
      "with": "src/environments/environment.ts"
    }
  ]
}
```

### Key Production Optimizations

- **Ahead-of-Time (AOT) Compilation**: Converts HTML templates and TypeScript into efficient JavaScript prior to browser execution.
- **Minification & Dead-Code Elimination**: Strips unused code, white spaces, and debug logs.
- **Output Hashing (`all`)**: Appends unique content hashes to JavaScript and CSS bundles (`main.a1b2c3.js`), enabling aggressive HTTP caching and preventing stale browser cache issues.
- **Environment Swapping**: Automatically swaps `environment.development.ts` with `environment.ts` (disabling debug logs and pointing to the production endpoint).

---

## 4. Live Deployment Strategy (Netlify)

The application is deployed live on **Netlify**:

- 🌐 **Live Application URL**: [https://timely-florentine-2f5598.netlify.app/](https://timely-florentine-2f5598.netlify.app/)
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **SPA Route Redirects**: Netlify serves the Single Page Application by rewriting client-side routes (`/items`, `/items/:id`) to `index.html`.
