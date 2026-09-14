# High-Level System & Folder Architecture

This document describes the high-level system architecture, folder organization, data flow patterns, core services, and routing design of the **DodgeConstructions** Web Application.

---

## 1. System Architecture Overview

The application follows a **Decoupled Layered Architecture** powered by Angular 21 Standalone primitives and Signals state management:

```
┌─────────────────────────────────────────────────────────────────┐
│                       Presentation Layer                        │
│   (Pages: HomeComponent, ItemsComponent, ItemDetailComponent)   │
│   (Components: ItemCard, ItemFilter, ItemGrid, ProductCompare)  │
└──────────────────────────────────────────────┬──────────────────┘
                                               │ Readonly Signals & Actions
                                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       State & Domain Layer                      │
│   (ItemStateService: Signals, Computed Filters, Cart, Compare)  │
│   (Models: Item [abstract], ProductItem [concrete])             │
└──────────────────────────────────────────────┬──────────────────┘
                                               │ RxJS Observables
                                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Infrastructure & HTTP Layer                 │
│   (ItemService: shareReplay(1) Caching)                         │
│   (apiInterceptor: Header Tagging & Error Handling)             │
│   (GlobalErrorHandlerService: Uncaught Error Logging)           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory & Folder Structure

```
src/
├── app.component.ts                 # Root Application Component Shell
├── app.routes.ts                    # Lazy-loaded Route Definitions
├── main.ts                          # App Entrypoint & Bootstrap Configuration
├── components/                      # Reusable Presentation Components
│   ├── breadcrumb/                  # Breadcrumb Navigation Component
│   ├── error/                       # Error Feedback Display Component
│   ├── image-zoom/                  # Interactive Image Modal & Zoom Component
│   ├── item-card/                   # Product Card Component
│   ├── item-detail-view/            # Detailed Product View Presentation Component
│   ├── item-features/               # Product Features Bullet List Component
│   ├── item-filter/                 # Search, Category, Price Filter Bar Component
│   ├── item-grid/                   # Responsive Product Cards Grid Component
│   ├── loading/                     # Animated Loading Spinner Component
│   ├── product-compare/             # Product Comparison Bar & Modal Component
│   └── quantity-selector/           # Incremental Quantity Counter Component
├── pages/                           # Top-Level Page Views (Smart Components)
│   ├── home/                        # Landing Page Component
│   ├── item-detail/                 # Product Detail View Page Component
│   └── items/                       # Product Catalogue Page Component
├── services/                        # Core Singletons & Business Logic
│   ├── global-error-handler.service.ts # App-Wide ErrorHandler Implementation
│   ├── item-state.service.ts        # Central Reactive Signal State Store
│   └── item.service.ts              # HTTP Data Fetching Service with Cache
├── models/                          # Business Domain Entities
│   ├── item.model.ts                # Abstract Base Item Class
│   ├── product-item.model.ts        # Concrete Product Entity with XSS Sanitization
│   └── item-filter.model.ts         # Filter & Sort Type Definitions
├── interfaces/                      # Data Contracts & State Schemas
│   ├── cart-line.interface.ts       # Cart Line Item Schema
│   ├── item-request-state.interface.ts # Remote HTTP Request State Schema
│   └── stock-info.interface.ts      # Stock Availability Interface Schema
├── interceptors/                    # Functional HTTP Interceptors
│   └── api.interceptor.ts           # Header Metadata & Error Handling Interceptor
├── pipes/                           # Angular Pipes
│   ├── price-difference.pipe.ts     # Product Comparison Price Delta Pipe
│   └── stock-status.pipe.ts         # Formatting Stock Badge Text Pipe
├── styles/                          # SCSS Token Design System
│   ├── _variables.scss              # Colors, Spacing, & Typography Tokens
│   ├── _mixins.scss                 # Responsive Breakpoint & Flex/Grid Mixins
│   ├── _fonts.scss                  # Google Font Typography Imports
│   └── styles.scss                  # Root Styles Entrypoint
└── environments/                    # Application Environment Configuration
    ├── environment.interface.ts     # Shared Environment Config Contract
    ├── environment.development.ts   # Local Development Config
    └── environment.ts               # Production Build Config
```

---

## 3. Core Services Architecture

### `ItemStateService` (Central State Store)

`ItemStateService` is an application singleton (`providedIn: 'root'`) that manages reactive UI state:

- **Remote Data Ingestion**: Uses `toSignal()` to transform `reloadItems$` streams into a reactive `itemRequest` signal.
- **Controlled Mutability**: Internal state (`_filter`, `_selectedCategory`, `_compareIds`, `_cartItems`) is encapsulated via `private readonly WritableSignal<T>`.
- **Public Readonly Interface**: Exposes state as readonly signals (`filter`, `categories`, `comparedItems`, `filteredItems`).
- **Derived Logic (`computed`)**: Automatically recalculates `filteredItems` when search term, category selection, price range, stock toggle, or sort order changes.

### `ItemService` (Data Ingestion & Caching)

- **API Ingestion**: Fetches product payloads from asset/API endpoints using `HttpClient`.
- **Caching Strategy**: Employs `shareReplay(1)` to cache product data in memory, eliminating redundant HTTP roundtrips during route transitions. Exposes `clearCache()` for manual cache invalidation.

### `GlobalErrorHandlerService`

- Registers with Angular's `ErrorHandler` provider token.
- Captures uncaught runtime exceptions and formats structured, environment-tagged error messages to the console or telemetry logging.

---

## 4. Domain Models & Security

### Abstract `Item` Base Class

Defined in `src/models/item.model.ts` as an abstract base contract for product entities.

### Concrete `ProductItem` Model & Defensive Parsing

Defined in `src/models/product-item.model.ts`. Implements `fromJson(json)` with **defensive XSS sanitization**:

```typescript
static fromJson(json: Record<string, unknown>): ProductItem {
  let rawImage = String(json['image'] ?? '');

  // Neutralize XSS protocol execution vectors (javascript: / data:text/html)
  const lowerImg = rawImage.trim().toLowerCase();
  if (lowerImg.startsWith('javascript:') || lowerImg.startsWith('data:text/html')) {
    rawImage = '';
  } else if (rawImage && !rawImage.startsWith('/') && !rawImage.startsWith('http')) {
    rawImage = '/' + rawImage;
  }

  return new ProductItem(
    Number(json['id'] ?? 0),
    String(json['name'] ?? ''),
    String(json['category'] ?? 'General'),
    Number(json['price'] ?? 0),
    String(json['description'] ?? ''),
    Boolean(json['inStock']),
    Number(json['stockCount'] ?? 0),
    rawImage,
    Array.isArray(json['features']) ? json['features'].map(f => String(f)) : []
  );
}
```

---

## 5. Routing & Navigation Strategy

Routes are configured in `src/app.routes.ts`:

- **Lazy Loading**: Every page route uses `loadComponent()` to lazy load code chunks.
- **Component Input Binding**: Enabled via `withComponentInputBinding()` in `main.ts`, allowing route parameters (`:id`) to bind directly into page component Signal inputs (`id = input<string>()`).
- **Fallback Route**: Wildcard `**` redirects unknown paths to the `/items` product catalog.
