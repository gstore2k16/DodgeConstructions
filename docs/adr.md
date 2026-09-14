# Architectural Decision Records (ADRs)

This document records the key architectural decisions, rationale, and technical trade-offs for the **DodgeConstructions** Web Application.

---

## ADR 001: Immutable Data Flow & Signal State Mutation Prevention

### Context

In complex Angular applications, direct mutation of state objects (e.g., mutating array elements directly or exporting writable state references to components) leads to hard-to-debug side-effects, unexpected change detection cycles, and broken component boundaries.

### Decision

1. **Encapsulated Writable State**: All writable state signals inside services (e.g. `ItemStateService`) MUST be declared as `private readonly` prefixed with an underscore (`_cartItems`, `_compareIds`, `_filter`).
2. **Readonly Public Surface**: Public signals MUST be exposed exclusively as readonly `Signal<T>` via `.asReadonly()` or derived `computed()` properties. Components cannot invoke `.set()` or `.update()` directly.
3. **Reference-Based Immutability**: All state mutator operations MUST create new array/object reference copies (using `.filter()`, `.map()`, or array spreads `[...current, newItem]`).
4. **Removal of Artificial `Object.freeze()`**: Artificial wrapping of array emissions in `Object.freeze()` was removed to eliminate runtime spread micro-overhead while retaining clean functional immutability.

### Consequences

- **Positive**: Guarantees unidirectional data flow; components can only trigger state changes via explicit service methods.
- **Positive**: High performance change detection without array-freeze micro-overhead.
- **Negative**: Requires discipline to ensure mutators inside services return new reference copies.

---

## ADR 002: Functional HTTP Interceptor & Centralized Header Metadata

### Context

Outgoing HTTP requests require environment metadata headers (`X-Environment`, `Accept`) and consistent request timing, logging, and error normalization across local and production deployments.

### Decision

Use Angular's modern **functional HTTP interceptors** (`HttpInterceptorFn`) registered globally in `main.ts` via `provideHttpClient(withInterceptors([apiInterceptor]))`.

```typescript
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  const authReq = req.clone({
    setHeaders: {
      'X-Environment': environment.environmentName,
      Accept: 'application/json',
    },
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage =
        error.error instanceof ErrorEvent
          ? `Client Error: ${error.error.message}`
          : `Server Error [Status ${error.status}]: ${error.message || error.statusText}`;
      return throwError(() => new Error(errorMessage));
    }),
  );
};
```

### Consequences

- **Positive**: Lightweight, functional configuration without legacy class-based interceptor boilerplate.
- **Positive**: Centralizes environment header injection and error normalization across all HTTP requests.

---

## ADR 003: Root Service Lifecycle & `toSignal()` Usage

### Context

`ItemStateService` is decorated with `@Injectable({ providedIn: 'root' })`, making it an application-level singleton that lives for the entire application session.

### Decision

Omit `takeUntilDestroyed()` inside `toSignal()` when transforming Observables to Signals inside root-scoped services.

```typescript
private readonly itemRequest = toSignal<ItemRequestState, ItemRequestState>(
  this.reloadItems$.pipe(...),
  { initialValue: initialItemRequestState }
);
```

### Rationale

Root services are never destroyed until the app process terminates. Adding `takeUntilDestroyed()` in root services is redundant and reflects a misunderstanding of Angular injection scopes. `toSignal()` automatically manages subscription teardown for the service lifetime.

### Consequences

- **Positive**: Eliminates unnecessary teardown code and runtime lifecycle listener overhead.
- **Positive**: Cleaner, simpler stream-to-signal interop.

---

## ADR 004: Domain-Driven Feature Folder Organization

### Context

Unstructured component lists lead to high friction as applications grow.

### Decision

Enforce a domain-driven folder hierarchy:

```
src/
├── components/     # Reusable presentation & domain UI components
├── pages/          # Top-level route page views
├── services/       # Core business logic & state management singletons
├── models/         # Domain model classes & abstractions
├── interfaces/     # Data contracts & state interfaces
├── interceptors/   # Functional HTTP interceptors
├── pipes/          # Shared formatting pipes
├── styles/         # Global SCSS tokens, mixins, variables, & typography
└── environments/   # Build environment configurations
```

### Consequences

- **Positive**: Clear separation between smart page containers and reusable presentational components.
- **Positive**: Easy navigation and code maintainability for multi-developer teams.
