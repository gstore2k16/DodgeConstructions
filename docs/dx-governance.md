# Developer Experience (DX) & Governance Guide

This document outlines the developer experience standards, code formatting rules, Git hook automations, branch naming conventions, and code review governance enforced in the **DodgeConstructions** repository.

---

## 1. Code Formatting Standards (Prettier)

To maintain consistent formatting across all code files, the project uses **Prettier** configured via `.prettierrc.json`.

### Prettier Configuration (`.prettierrc.json`)

- **Single Quotes**: `true` (Enforces single quotes for TypeScript & SCSS strings)
- **Semi-colons**: `true` (Enforces explicit statement terminators)
- **Tab Width**: `2` spaces
- **Print Width**: `100` characters
- **Trailing Commas**: `es5`

```json
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "es5"
}
```

### Formatter Commands

| Command                | Action                                                                            |
| :--------------------- | :-------------------------------------------------------------------------------- |
| `npm run format`       | Automatically formats all `.ts`, `.html`, `.scss`, `.json`, `.md` files in place. |
| `npm run format:check` | Verifies formatting compliance across all files without modifying them.           |

---

## 2. Git Hooks & Pre-commit Automations (Husky & lint-staged)

To prevent unformatted code or broken tests from entering source control, the repository integrates **Husky 9** and **lint-staged**.

### Pre-commit Hook (`.husky/pre-commit`)

Before any commit is created, Husky triggers the pre-commit script:

```bash
#!/bin/sh
npx lint-staged
```

### Staged Files Formatting (`lint-staged` in `package.json`)

`lint-staged` inspects staged files and formats them automatically prior to committing:

```json
"lint-staged": {
  "*.{ts,html}": [
    "prettier --write"
  ],
  "*.{scss,css}": [
    "prettier --write"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}
```

---

## 3. Git Branch Naming Conventions

Every feature, fix, or documentation change MUST be developed in a dedicated branch following standardized prefixing:

| Branch Pattern                 | Description                     | Example                           |
| :----------------------------- | :------------------------------ | :-------------------------------- |
| `feat/<short-description>`     | New feature development         | `feat/product-search-filter`      |
| `fix/<short-description>`      | Bug fixes & patches             | `fix/compare-modal-accessibility` |
| `refactor/<short-description>` | Code refactoring & performance  | `refactor/signal-state-store`     |
| `docs/<short-description>`     | Documentation updates           | `docs/architecture-guides`        |
| `ci/<short-description>`       | Pipeline & workflow adjustments | `ci/github-actions-matrix`        |

---

## 4. Conventional Commit Messages

Commit messages MUST follow the **Conventional Commits** format:

```
<type>(<scope>): <short description>
```

### Recognized Types:

- `feat`: A new feature added to the application.
- `fix`: A bug fix or patch.
- `docs`: Documentation updates.
- `style`: Code style / formatting changes (no functional code changes).
- `refactor`: Code changes that neither fix a bug nor add a feature.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Maintenance tasks, dependency updates, CLI updates.

---

## 5. GitHub Actions Workflow Integration (`ci.yml`)

Every Pull Request against `main` automatically triggers automated CI checks via `.github/workflows/ci.yml`:

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Verify Code Formatting
        run: npm run format:check

      - name: Run Unit Tests
        run: npm test

      - name: Build Production Bundle
        run: npm run build
```
