# Project Name

<!-- Replace with your project description -->
Built with Next.js 16, React 19, TypeScript 5, and Tailwind CSS 4.

## Rules

@rules/core-principles.mdc
@rules/react-patterns.mdc
@rules/typescript-standards.mdc
@rules/state-management.mdc
@AGENTS.md

## Tech Stack

- **Framework**: Next.js 16 (App Router, `src/` directory)
- **UI**: React 19, Tailwind CSS 4, Radix UI primitives
- **State**: Zustand with persist middleware (localStorage)
- **Server State**: TanStack Query (React Query) for async/server data
- **Icons**: lucide-react
- **Class Merging**: clsx + tailwind-merge (`mergeClassNames` utility)

## Architecture

### Directory Structure
```
src/
  app/           → Next.js App Router pages
  components/    → React components organized by feature
    layout/      → AppShell, Sidebar, MobileNav, Header
    shared/      → Reusable components (Button, Card, Badge, Toggle, etc.)
  lib/
    constants/   → Named constants organized by domain
    helpers/     → Pure utility functions (mergeClassNames, etc.)
    store/       → Zustand stores
  hooks/         → Custom React hooks
  types/         → TypeScript type definitions
```

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
```

## Code Rules

### No Magic Numbers
Never use raw numeric or string literals in logic or JSX. All values must be named constants in domain-scoped files under `src/lib/constants/`.

### No forwardRef
React 19 passes `ref` as a regular prop. Never use `React.forwardRef`.

### No Logic in JSX
Never put logic (state, conditionals, computations) inside JSX. Extract all logic into dedicated hooks under `src/hooks/`. Pages should only compose components with data from hooks.

### No Rendering Conditionals in JSX
Never use inline ternaries or `&&` for conditional rendering inside JSX. Always extract to a named `const` before the return statement:
```tsx
// Good
const content = isReady ? <Ready /> : <Loading />;
return <div>{content}</div>;

// Bad
return <div>{isReady ? <Ready /> : <Loading />}</div>;
```

### No Inline SVG in JSX
Never embed raw SVG markup directly in page/component JSX. Extract SVGs into dedicated icon components under `src/components/icons/`.

### No TypeScript Type Hacks
Never use `as` type assertions to work around type errors. Find the real solution — fix the types, adjust the data structure, or use proper generics. Type safety must be earned, not bypassed.
```tsx
// Good - fix the actual type
const options: SelectOption<Status>[] = [...]

// Bad - hack around it
const options = [...] as const as any
```

### No Ad-hoc className Overrides on Standardized Components
Never pass ad-hoc Tailwind classes to override styling of standardized components. If a visual variation is needed, add a proper variant to the component. Use the component's variant props instead of `className` overrides.
```tsx
// Good
<Button variant="primary" size="lg">Submit</Button>

// Bad
<Button className="bg-accent-primary text-white hover:bg-accent-primary/90" size="lg">Submit</Button>
```

### No Barrel Exports
Avoid `index.ts` barrel files that re-export from other modules. Import directly from the source file instead. Barrel exports hurt tree-shaking, create circular dependency risks, and make it harder to trace where things come from.
```tsx
// Good - direct import
import { mergeClassNames } from '@/lib/helpers/mergeClassNames';

// Bad - barrel re-export
import { mergeClassNames } from '@/lib/helpers';
```

### No Arbitrary Tailwind Values
Never use arbitrary bracket values (e.g., `w-[5rem]`, `text-[14px]`, `gap-[12px]`) when a standard Tailwind utility exists. Always prefer canonical class names.
```tsx
// Good - standard utility
<div className="min-w-20 text-sm gap-3 font-mono" />

// Bad - arbitrary values that have standard equivalents
<div className="min-w-[5rem] text-[14px] gap-[12px] font-[family-name:var(--font-mono)]" />
```
Arbitrary values are only acceptable when no standard Tailwind utility covers the exact value needed (e.g., a design-token color `bg-[var(--custom-color)]` or a one-off dimension with no Tailwind equivalent).

### No Deprecated APIs
Never use deprecated APIs, patterns, or libraries. Stay current with the latest stable APIs for all dependencies (React 19, Next.js 16, etc.).

### No Unnecessary Nesting
Avoid wrapping elements in extra divs or components when they serve no purpose. Flatten markup whenever possible — every wrapper must justify its existence (layout, styling, or semantic meaning).
```tsx
// Good - flat
<Card>
  <h2>Title</h2>
  <p>Description</p>
</Card>

// Bad - pointless wrapper
<Card>
  <div>
    <h2>Title</h2>
    <p>Description</p>
  </div>
</Card>
```

### No Unnecessary Null/Undefined Checks
Don't add defensive null/undefined checks when the type system already guarantees a value exists. Trust the types. Only guard at real boundaries (user input, API responses, optional props).
```tsx
// Good - type says it's there, trust it
const name = user.name;

// Bad - user.name is not optional, check is noise
const name = user?.name ?? "";
```

### No Dynamic Imports
Avoid dynamic `import()` calls. Use regular static imports. Never use `typeof import("...")` in type annotations — define explicit interfaces instead. The only exception is browser-only libraries that reference `window`/`AudioContext` at import time and crash SSR builds.

### IIFE Over Nested Ternaries
When assigning a value based on multiple conditions, use an IIFE with early returns instead of nested ternaries:
```tsx
// Good
const label = (() => {
  if (status === "loading") return "Loading...";
  if (status === "error") return "Failed";
  return "Ready";
})();

// Bad
const label = status === "loading" ? "Loading..." : status === "error" ? "Failed" : "Ready";
```

### Prefer Simplicity
Always prefer the simplest solution that works. Avoid over-engineering, unnecessary abstractions, and premature optimization. Simple readable code is better than clever code.

### Standardization and Deduplication
Reuse existing components, patterns, and constants. When you see repeated patterns, extract them into shared utilities or components. Every piece of knowledge should have a single authoritative source.

### Meaningful Comments
Add comments where they help humans understand **why** — non-obvious business logic, workarounds, domain-specific decisions, and complex algorithms. Don't comment obvious code. Every comment should earn its place by explaining intent that the code alone cannot convey.
```tsx
// Good - explains why
// Web Audio requires user gesture before AudioContext can start, so we resume on first click
await audioContext.resume();

// Bad - states the obvious
// Set count to 0
setCount(0);
```

### TypeScript Style Preferences
- **Typed consts over enums**: Use `as const` objects instead of `enum`. Enums have runtime baggage and quirks.
- **Interfaces over types**: Prefer `interface` for object shapes. Use `type` only for unions, intersections, or mapped types.
- **Naming convention**: Exported interfaces/types use verbose descriptive names (e.g., `GridCellProps`, `UserProfile`). Non-exported (file-local) ones use simple names (e.g., `Props`, `State`).
```tsx
// Good - exported, verbose name
export interface UserProfileProps { ... }

// Good - non-exported, simple name
interface Props { ... }

// Good - typed const over enum
const STATUS = { ACTIVE: "active", INACTIVE: "inactive" } as const;

// Bad - enum
enum Status { Active = "active", Inactive = "inactive" }
```

## Naming Conventions

### General
- **camelCase** for variables and functions
- **UPPER_SNAKE_CASE** for constants
- **PascalCase** for components, types, interfaces
- **Descriptive names** that clearly convey purpose

### Booleans
Prefix with verbs: `is`, `has`, `should`.
```tsx
const isPlaying = true;
const hasCompleted = false;
const shouldShowModal = true;
```

### Files
- **Files**: `camelCase.ts`, `PascalCase.tsx` for components
- **Directories**: `camelCase` or `kebab-case`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

## Conventions

- Use `mergeClassNames()` from `@/lib/helpers/mergeClassNames` for ANY className that is long enough to scroll off-screen — both static and dynamic. Never use template literals or string concatenation for className composition. Group related classes into separate string arguments by concern: layout, spacing, typography, decoration/transitions, states, and conditionals.
```tsx
import { mergeClassNames } from '@/lib/helpers/mergeClassNames';

// Good — static long className, grouped by concern
<aside
  className={mergeClassNames(
    'hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0',
    'border-r border-border-subtle bg-bg-primary',
  )}
/>

// Good — conditional className, grouped by concern
<button
  className={mergeClassNames(
    'flex items-center gap-3',
    'px-3 py-2.5',
    'text-sm font-medium',
    'rounded-lg transition-all duration-150 ease-out',
    isActive
      ? 'bg-bg-active text-text-primary'
      : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary',
  )}
/>

// Good — short static className, no wrapping needed
<div className="flex items-center gap-2" />

// Bad — long static string scrolling off screen
<aside className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border-subtle bg-bg-primary" />

// Bad — everything in one string, hard to scan
<button className={mergeClassNames(
  'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ease-out',
  isActive ? 'bg-bg-active text-text-primary' : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary',
)} />

// Bad — template literal
<button className={`flex items-center ${isActive ? 'bg-accent-primary' : ''}`} />
```
- Always use absolute imports with `@/` alias — never use relative imports (`./` or `../`)
- Tailwind classes use the custom theme tokens (not arbitrary values when a token exists)
- Components are named exports, one component per file — use `function` declarations (no `React.FC`)
- Store files export a single `use[Name]Store` hook
- All interactive elements need `aria-label` and visible focus rings
- Transitions: `transition-all duration-150 ease-out` on interactive elements
- No `any` types — use `unknown` and narrow, or Zod schemas with `z.infer`
- After edits, always verify with `npm run build` and `npm run lint`
- Everything standardized: follow consistent patterns across all files — same naming, same structure, same component patterns

## Shared Components

Extract repeated UI patterns into shared components under `src/components/shared/`. Key patterns:

- **Button** — variants: `primary`, `secondary`, `ghost`, `danger`; sizes: `sm`, `md`, `lg`
- **IconButton** — square icon-only button; sizes: `sm`, `md`, `lg`
- **ChipButton** — small toggle/selector chips for radio-group style selectors
- **Card** — container with rounded corners, border, background
- **Badge** — inline status/label badge with color variants
- **Toggle** — switch component for boolean settings

Never duplicate button/card/badge styling across components. Use the shared components and add new variants when needed.
