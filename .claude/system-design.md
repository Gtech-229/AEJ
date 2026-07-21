# AEJ — Design System Spec (Next.js App Router + Tailwind v4)

> **Scope of this file.** This document governs the **visual / UI layer**: design
> tokens, theming, component primitives, and the config-driven **form** and
> **table** engines. It does **not** re-specify data fetching, the `features/`
> module layout, TanStack Query, services, or hydration — those live in
> [`CLAUDE.md`](../CLAUDE.md) and remain authoritative. Where the two touch
> (a table consuming a feature hook, a form reusing a feature Zod schema), this
> file points back to `CLAUDE.md` rather than repeating it.
>
> **No internationalization.** All labels are plain **French** strings — no i18n
> layer, no translation keys.

## Decisions in force (from project kickoff)

| Area | Decision |
| --- | --- |
| Primitives | **shadcn/ui** in `components/ui/`. The legacy hand-rolled `components/UI/` is retired **incrementally** (see §7). |
| Tokens | **OKLCH semantic tokens** (`bg-background`, `text-foreground`, …) + a brand layer. Replaces the current light-only brand-hex `globals.css`. |
| Dark mode | Yes — **`next-themes`** (`.dark` class on `<html>`, hydration-safe). |
| Accent / chart switcher | Yes — runtime brand-accent + chart palette. State via **React Context + `localStorage`** (NOT zustand — honors CLAUDE.md "no global state library"). |
| Form / table engines | **Build both** — `DynamicForm` (react-hook-form + Zod) and `GenericTable` (`@tanstack/react-table`, URL state). |
| Rollout | **Foundation first.** Build tokens, primitives, engines, and layout shells; new work uses them; the ~25 existing prototype pages migrate page-by-page later. |
| Font | **Plus Jakarta Sans** (already wired via `next/font`) — kept, not Inter/Manrope. |

---

## 1. Stack (design-system additions only)

Already present: Next.js 16 (App Router) + React 19 + TS, Tailwind v4
(`@tailwindcss/postcss`, CSS-config via `@theme` — no `tailwind.config`),
`@tanstack/react-query`, `clsx`, `tailwind-merge` (`cn()` in `lib/utils.ts`),
`lucide-react`, `recharts`.

**To add for this spec** (install during implementation, not before):

- `class-variance-authority` — primitive variants (CVA)
- `next-themes` — dark mode
- `zod` + `react-hook-form` + `@hookform/resolvers` — forms & validation
  (Zod is mandated by CLAUDE.md and must be installed)
- `@tanstack/react-table` — tables
- `sonner` — toasts · `cmdk` — command menu · `react-day-picker` + `date-fns` — calendar/date
- `tw-animate-css` — optional animation utilities
- shadcn CLI pulls the needed `@radix-ui/*` packages per component.

shadcn `chart` is built on **recharts** (already installed); `command` on `cmdk`.

> **App Router rule (recap, not re-argued):** Server Components by default; every
> interactive primitive, store/provider, form, table, and switch starts with
> `"use client"`. No `window`/`localStorage` at module top level — read inside
> effects. Full rationale in `CLAUDE.md`.

---

## 2. Where design-system code lives (root layout — no `src/`)

This repo is **root-level** (`app/`, `components/`, `features/`, `lib/`,
`hooks/`), path alias `@/*`. The design system slots in as:

```
app/
  layout.tsx            root layout: fonts, Providers (Query + Theme), Toaster
  globals.css           tokens + Tailwind entry (the ONLY stylesheet)
  providers.tsx         "use client" — QueryClientProvider (+ ThemeProvider, AccentProvider)
  (routes…)/page.tsx    Server Components; render client table/form components
components/
  ui/                   shadcn primitives (client)          ← reserved for shadcn only
  layout/               Sidebar, Header, UserMenu, nav-group, shells (exists)
  data-table/           table toolkit (client)
  forms/                DynamicForm, StepDynamicForm, FormField, types.ts (client)
  generic/              Generic dialogs / row-actions / delete orchestration (client)
  theme/                theme-provider, theme-switch, accent-switch, accent-context (client)
  <module>/             shared business components — only on real reuse (per CLAUDE.md)
  UI/                   ⚠ LEGACY custom primitives — frozen, migrated away (see §7)
features/<name>/        dto · service · hooks · keys · schema  (CLAUDE.md-owned)
  <name>.form.ts        FieldConfig[] builder for this feature's forms (plain data)
lib/utils.ts            cn()
hooks/                  cross-cutting hooks (rare)
```

**Reconciliation with the generic brief:**
- `src/config/` → form field configs are **co-located with the feature** as
  `features/<name>/<name>.form.ts` (pure data, no `"use client"`), or route-local
  when truly one-off.
- `src/schemas/` → **reuse the feature's** `features/<name>/<name>.schema.ts`
  (CLAUDE.md single source of truth). The form's `schema` prop = the feature Zod schema.
- `src/stores/` (zustand) → **dropped.** Theme/accent/layout preferences use
  `next-themes` + a small React Context in `components/theme/` (§5).

---

## 3. Design tokens — `app/globals.css`

Replace today's light-only brand-hex file with an **OKLCH semantic token** system:
light default + `.dark` override, brand layer, mapped to Tailwind utilities via
`@theme inline`. Imported once by the root layout. The current `.nav-item` /
`.kpi-card` / `.badge-*` component classes are **removed** — they become
primitives/utilities (§7).

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.625rem;

  /* neutral surface scale (slate-based) */
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.129 0.042 264.695);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.129 0.042 264.695);

  /* brand: AEJ green (#1a7a3c) as primary, orange (#f97316) as accent.
     Values are OKLCH approximations — fine-tune with the dataviz palette check. */
  --primary: oklch(0.53 0.13 150);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.968 0.007 247.896);
  --secondary-foreground: oklch(0.208 0.042 265.755);
  --muted: oklch(0.968 0.007 247.896);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.70 0.19 42);            /* AEJ orange */
  --accent-foreground: oklch(0.985 0 0);

  --destructive: oklch(0.577 0.245 27.325);
  --success: oklch(0.60 0.14 155);
  --warning: oklch(0.80 0.16 80);
  --border: oklch(0.929 0.013 255.508);
  --input: oklch(0.929 0.013 255.508);
  --ring: oklch(0.53 0.13 150);

  /* charts — default to brand-forward hues (see accent switcher, §5b) */
  --chart-1: oklch(0.53 0.13 150);
  --chart-2: oklch(0.70 0.19 42);
  --chart-3: oklch(0.60 0.118 184.704);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.55 0.22 27);

  /* sidebar inherits brand; header bar is brand-green by default */
  --sidebar: var(--card);
  --sidebar-foreground: var(--foreground);
  --sidebar-primary: var(--primary);
  --sidebar-primary-foreground: var(--primary-foreground);
  --sidebar-accent: var(--accent);
  --sidebar-accent-foreground: var(--accent-foreground);
  --sidebar-border: var(--border);
  --sidebar-ring: var(--ring);
}

.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  --card: oklch(0.14 0.04 259.21);
  --card-foreground: oklch(0.984 0.003 247.858);
  --popover: oklch(0.208 0.042 265.755);
  --popover-foreground: oklch(0.984 0.003 247.858);
  --primary: oklch(0.72 0.15 150);          /* lifted green for contrast on dark */
  --primary-foreground: oklch(0.145 0.03 160);
  --secondary: oklch(0.279 0.041 260.031);
  --secondary-foreground: oklch(0.984 0.003 247.858);
  --muted: oklch(0.279 0.041 260.031);
  --muted-foreground: oklch(0.704 0.04 256.788);
  --accent: oklch(0.75 0.18 45);
  --accent-foreground: oklch(0.145 0.03 60);
  --destructive: oklch(0.704 0.191 22.216);
  --success: oklch(0.70 0.15 155);
  --warning: oklch(0.83 0.16 80);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.72 0.15 150);
  --chart-1: oklch(0.72 0.15 150);
  --chart-2: oklch(0.75 0.18 45);
  --chart-3: oklch(0.696 0.17 162.48);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: var(--card);
}

@theme inline {
  --font-sans: var(--font-jakarta);       /* from next/font (see §4) */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;

  /* map every --x to --color-x so `bg-background`, `text-muted-foreground`,
     `bg-primary`, `border-border`, `bg-success`, `text-chart-1`, … all work */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1); /* …through chart-5 */
  --color-sidebar: var(--sidebar); /* …plus sidebar-foreground/primary/accent/border/ring */
}

@layer base {
  * { @apply border-border outline-ring/50; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
  body { @apply min-h-svh w-full bg-background text-foreground font-sans antialiased; }
}
```

**Token rules (whole app):** never hardcode hex/rgb in components. Use semantic
utilities — `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`,
`bg-primary`, `bg-accent`, `bg-success`, `border-border`, `bg-destructive`,
`ring-ring`. Opacity via slash (`bg-primary/90`, `hover:bg-accent/50`). Status
badges (`en_cours`, `acheve`, …) map to `success`/`warning`/`accent`/`muted`, not
raw greens/oranges.

---

## 4. Fonts — `next/font` (root layout, already wired)

Keep **Plus Jakarta Sans** exposed as the `--font-jakarta` CSS variable and
consumed by `--font-sans` in `@theme inline`. No manual `<link>`s.

```tsx
// app/layout.tsx
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/sonner';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-jakarta', display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-svh bg-background text-foreground">
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
```

`suppressHydrationWarning` on `<html>` is **required** for `next-themes`.

---

## 5. Theming

### a) Light / dark — `next-themes`

`ThemeProvider` wraps `next-themes` with `attribute="class"` so it toggles `.dark`
on `<html>`; mounted inside `app/providers.tsx` (alongside the existing
`QueryClientProvider`).

```tsx
// components/theme/theme-provider.tsx
'use client';
import { ThemeProvider as NextThemes } from 'next-themes';
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}
```

A `ThemeSwitch` client component calls `useTheme()` from `next-themes`.

### b) Dynamic accent / chart palette — React Context + `localStorage` (no zustand)

Client-only provider that reads a persisted key on mount (in an effect) and writes
the selected palette to CSS variables (`--primary`, `--ring`, `--chart-*`, header
bar color) on `document.documentElement`. **No top-level `localStorage` access.**

```ts
// components/theme/accent-palettes.ts  (plain data)
// PROVISIONAL palette. This is a Côte d'Ivoire project — the final accent set
// (likely CI orange / white / green) is TBD. For now: default AEJ green + red.
export const ACCENT_PALETTES = {
  aej_green: { label: 'AEJ Vert', primary: '#1a7a3c', ring: '#1a7a3c' },
  rouge:     { label: 'Rouge',    primary: '#CE1126', ring: '#CE1126' },
  slate:     { label: 'Slate',    primary: '#1e293b', ring: '#1e293b' },
} as const;
export type AccentKey = keyof typeof ACCENT_PALETTES;
export const ACCENT_STORAGE_KEY = 'aej-accent';
```

```tsx
// components/theme/accent-provider.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { ACCENT_PALETTES, ACCENT_STORAGE_KEY, type AccentKey } from './accent-palettes';

const AccentContext = createContext<{ accent: AccentKey; setAccent: (k: AccentKey) => void } | null>(null);

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<AccentKey>('aej_green');

  useEffect(() => {
    const saved = localStorage.getItem(ACCENT_STORAGE_KEY) as AccentKey | null;
    if (saved && saved in ACCENT_PALETTES) setAccentState(saved);
  }, []);

  useEffect(() => {
    const p = ACCENT_PALETTES[accent];
    const el = document.documentElement;
    el.style.setProperty('--primary', p.primary); // hex is fine; overrides the OKLCH token
    el.style.setProperty('--ring', p.ring);
  }, [accent]);

  function setAccent(k: AccentKey) {
    setAccentState(k);
    localStorage.setItem(ACCENT_STORAGE_KEY, k);
  }
  return <AccentContext.Provider value={{ accent, setAccent }}>{children}</AccentContext.Provider>;
}

export function useAccent() {
  const ctx = useContext(AccentContext);
  if (!ctx) throw new Error('useAccent must be used within AccentProvider');
  return ctx;
}
```

`AccentSwitch` reads `useAccent()` and renders swatches. The same Context pattern
(not a separate store) carries **layout preferences** (sidebar collapsed/variant).

### c) Provider composition

```tsx
// app/providers.tsx  (extend the existing QueryClientProvider)
'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/lib/query/get-query-client';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { AccentProvider } from '@/components/theme/accent-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AccentProvider>{children}</AccentProvider>
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
```

---

## 6. Utilities & variant convention

`lib/utils.ts` already exports `cn()` (clsx + tailwind-merge) — reuse it.

**Every primitive with visual variants uses CVA**, exporting both the component
and its `xxxVariants`. Components use `data-slot="…"` attributes and `asChild`
(Radix `Slot`) where composition is needed. Example (Button, a client component):

```tsx
'use client';
const buttonVariants = cva('inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 …', {
  variants: {
    variant: {
      default:     'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
      destructive: 'bg-destructive text-white shadow-xs hover:bg-destructive/90',
      outline:     'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
      secondary:   'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
      ghost:       'hover:bg-accent hover:text-accent-foreground',
      link:        'text-primary underline-offset-4 hover:underline',
    },
    size: { default: 'h-9 px-4 py-2', sm: 'h-8 px-3', lg: 'h-10 px-6', icon: 'size-9' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});
```

Conventions on every primitive: CVA + `cn()`, `data-slot`, Radix, focus ring
`ring-ring/50 ring-[3px]`, `aria-invalid:*` on inputs, radius scale, `shadow-xs`.

---

## 7. UI primitives (shadcn/ui) & migrating off `components/UI/`

Install via the shadcn CLI (Next.js App Router + Tailwind v4). Target set:

`alert`, `alert-dialog`, `avatar`, `badge`, `button`, `calendar`, `card`, `chart`,
`checkbox`, `collapsible`, `command`, `dialog`, `dropdown-menu`, `form`, `input`,
`input-otp`, `label`, `popover`, `progress`, `radio-group`, `scroll-area`,
`select`, `separator`, `sheet`, `sidebar`, `skeleton`, `sonner`, `switch`,
`table`, `tabs`, `textarea`, `tooltip`. (Add `multi-select` / `date-input` as
custom composites when needed.)

**Legacy migration (incremental, non-breaking).** `components/UI/` (capital-UI:
`Button`, `Input`/`Select`/`Textarea`, `Modal`, `Table`, `Badge`,
`ConfirmDialog`, `PageHeader`) is **frozen** — no new usage. Map each to its
shadcn replacement and swap per page as pages are migrated:

| Legacy `components/UI/` | shadcn `components/ui/` |
| --- | --- |
| `Button` | `button` |
| `Input` / `Select` / `Textarea` | `input` / `select` / `textarea` (+ `label`, `form`) |
| `Modal` | `dialog` (or `sheet`) |
| `ConfirmDialog` | `alert-dialog` (via `GenericDeleteDialog`, §9) |
| `Table` (`Column<T>`) | `GenericTable` (§9) |
| `Badge` | `badge` |
| `PageHeader` | keep as a thin `components/layout/` composite over primitives |

> Windows note: `components/UI/` and `components/ui/` collide on a
> case-insensitive filesystem. shadcn writes to `components/ui/`; treat that as the
> single directory and delete the legacy files from it as each is replaced (don't
> keep both a `Button.tsx` and a `button.tsx`).

---

## 8. Forms — config-driven engine

Forms are declared as data (`FieldConfig[]`) and rendered by one client
`DynamicForm`. **Plain French labels** — no translation layer. The `schema` prop
is the **feature's own Zod schema** (`features/<name>/<name>.schema.ts`), per
CLAUDE.md; field configs live in `features/<name>/<name>.form.ts`.

**`FieldConfig` type** (`components/forms/types.ts`):
```ts
export type FieldType =
  | 'text' | 'email' | 'password' | 'tel' | 'url' | 'search'
  | 'textarea' | 'number' | 'range'
  | 'date' | 'daterange' | 'time' | 'datetime-local' | 'month' | 'week'
  | 'select' | 'select-with-other' | 'multiselect' | 'radio' | 'checkbox'
  | 'switch' | 'file' | 'image' | 'color' | 'hidden' | 'checkbox-group';

export interface SelectOption { value: string | number; label: string; disabled?: boolean }

export interface FieldConfig {
  name: string;
  label: string;                 // plain French text
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  pattern?: RegExp | string;
  patternErrorMessage?: string;
  options?: SelectOption[];
  isLoading?: boolean;           // async select loading state
  helperText?: string;
  min?: number; max?: number; maxLength?: number; minLength?: number;
  rows?: number;
  accept?: string; multiple?: boolean; maxSize?: number;   // file inputs
  dependsOn?: string;
  showWhen?: ((value: any) => boolean) | Record<string, any>;   // conditional visibility
  hidden?: boolean;
  colSpan?: 'full' | 'half' | 'third' | 'quarter' | 1 | 2 | 3 | 4;
  useCombobox?: boolean;
  showPasswordToggle?: boolean;
  startName?: string; endName?: string;   // range/daterange
  formStep?: number;             // which step (stepped forms)
}

export interface StepConfig { step: number; title: string; description?: string; icon?: React.ReactNode }
export interface FormConfig { fields: FieldConfig[]; layout?: 'vertical' | 'grid'; columns?: number; steps?: StepConfig[] }
```

**Config builders** are pure `getXxxFormConfig(deps): FormConfig` returning fields
with plain `label`/`placeholder`; dynamic data (select options) passed as args.
Because they're plain data, they run in Server or Client Components.

**`DynamicForm` props** (`components/forms/dynamic-form.tsx`, `"use client"`):
```ts
interface DynamicFormProps {
  config: FormConfig;
  schema: z.ZodType;            // = the feature schema; literal French messages
  defaultValues: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  submitText?: string;         // default 'Enregistrer'
  loadingText?: string;
  onCancel?: () => void; cancelText?: string;
  onBack?: () => void; backText?: string;
  onFieldChange?: (name: string, value: unknown) => void;
  embedded?: boolean;          // no card chrome (for dialogs)
  hideFormFooter?: boolean;
  formId?: string;             // submit from an external button via form={formId}
  className?: string;
  renderAfter?: React.ReactNode;
}
```
Internals: `useForm({ resolver: zodResolver(schema), defaultValues })`, filters
`hidden`/`showWhen` fields, renders each via one `FormField` client component that
switches on `field.type` (built on shadcn `form`/`input`/`select`/… primitives).
Grid layout from `columns`/`colSpan`.

**Stepped forms** — `StepDynamicForm` consumes `config.steps` + `formStep`,
renders a step indicator, validates per-step.

**Dialog sizes** — `DIALOG_SIZES = { sm, md, lg, xl }` (max-width classes) applied
to shadcn `DialogContent`.

**Submit → mutation.** `onSubmit` calls the feature's TanStack Query mutation
hook (`features/<name>/<name>.hooks.ts`); success/error surface via `sonner`
toasts. Forms never call `fetch`/services directly (CLAUDE.md).

---

## 9. Tables — `GenericTable` + `data-table` kit (URL state via `next/navigation`)

One generic, URL-aware table on `@tanstack/react-table`, **client component**. It
reads/writes the URL itself (no router-lib props):

```tsx
'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
// inside GenericTable:
const searchParams = useSearchParams();
const router = useRouter();
const pathname = usePathname();
const setParam = (key: string, value?: string) => {
  const p = new URLSearchParams(searchParams);
  value ? p.set(key, value) : p.delete(key);
  router.replace(`${pathname}?${p.toString()}`, { scroll: false });
};
```

**`GenericTable` props:**
```ts
type GenericTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchKey?: string;                   // primary text-filter column
  searchPlaceholder?: string;
  facetedFilters?: FacetedFilter[];     // multi-select column filters
  bulkActionsSlot?: (table) => React.ReactNode;
  toolbarEndSlot?: React.ReactNode;
  defaultPageSize?: number;
  emptyMessage?: string;                // default 'Aucun résultat.'
  showViewOptions?: boolean; showSearch?: boolean; showPagination?: boolean;
  onRowClick?: (row: TData) => void;
  isLoading?: boolean;
  initialState?: { columnVisibility?: Record<string, boolean>; sorting?: SortingState };
  onExportContext?: (ctx: { filteredData: TData[]; visibleColumnIds: string[] }) => void;
  tableContainerClassName?: string;
};
// No search/navigate props — the component uses next/navigation internally.
```

**`data-table` kit** (`components/data-table/`): `toolbar`, `column-header`
(sortable), `faceted-filter`, `view-options`, `pagination`, `bulk-actions`,
`index.ts`.

**Generic builders** (`components/generic/`): `column-builder`,
`buildEditDeleteActionsColumn` (row edit/delete menu), `GenericRowActions`,
`GenericDeleteDialog` (confirm delete via `alert-dialog`), a `GenericDialogs`
add/edit/delete orchestrator driven by a `useDialogState` hook,
`GenericBulkActions`, `table-loading-overlay`.

Row styling: `hover:bg-primary/5`, selected `data-[state=selected]:bg-primary/10`,
header `bg-muted`.

**Data flow (CLAUDE.md-aligned):** the Server `page.tsx` **prefetches** the
feature query and wraps children in `HydrationBoundary`; the client table reads
data from the feature hook (`useXxx()`) and handles filter/sort/pagination in the
URL. For server-side pagination, read `searchParams` in the page and refetch via
the service.

---

## 10. Feedback & overlays
- **Toasts** — `sonner`; `<Toaster />` mounted once in the root layout; call
  `toast.success/error(...)` (typically from mutation `onSuccess`/`onError`).
- **Overlays** — `dialog`, `sheet`, `alert-dialog`, `popover`, `tooltip`,
  `dropdown-menu`, `command` (⌘K). All `"use client"`.
- **Loading / empty** — `skeleton`, `progress`, `table-loading-overlay`,
  `emptyMessage`; plus Next.js `loading.tsx` / Suspense for route-level loading.

---

## 11. Layout & navigation

The shell already exists (`components/layout/Sidebar`, `Header`, `UserMenu`;
`app/dashboard/layout.tsx`). Formalize it on tokens + shadcn `sidebar`:

- **Dashboard shell** — collapsible `sidebar` (state via the layout Context, §5b),
  a top `Header` (search, `ThemeSwitch`, `AccentSwitch`, profile dropdown), a
  `main` content area. Header bar uses the brand accent.
- **Auth pages** — split-panel layout for `app/auth/login` (and
  `app/entreprise/login`).
- Existing route trees (`app/dashboard`, `app/auth`, `app/entreprise`,
  `app/portail`) are kept as-is; migrate their chrome to the tokenized shell
  during page migration. (Route groups like `app/(dashboard)/` are optional and
  not required to adopt this system.)

---

## 12. Recipe — add a feature CRUD (the repeating pattern)

Ties the design system to the CLAUDE.md `features/` architecture:

1. **Feature module** (`features/<name>/`): `*.schema.ts` (Zod, French messages),
   `*.dto.ts`, `*.service.ts`, `*.keys.ts`, `*.hooks.ts` — per CLAUDE.md.
2. **Form config** (`features/<name>/<name>.form.ts`): `getXxxFormConfig(deps): FormConfig`.
3. **Add/Edit** (`"use client"`): `<DynamicForm config={getXxxFormConfig(...)}
   schema={xxxSchema} defaultValues={…} onSubmit={mutate} />` inside a `Dialog`
   (`DIALOG_SIZES.lg`); toast on success/error.
4. **Columns**: `ColumnDef<Xxx>[]` + `buildEditDeleteActionsColumn`.
5. **Page** (`page.tsx`, Server Component): `prefetchQuery` + `HydrationBoundary`
   (per CLAUDE.md), render `<GenericTable data={…} columns={…} searchKey="…" />`
   (reading the feature hook) with `GenericDialogs` for add/edit/delete.

---

## 13. Implementation roadmap (foundation-first)

Build order — each phase is independently shippable and `next build`-clean:

1. **Tokens & theming** — rewrite `globals.css` (OKLCH), install `next-themes`,
   add `components/theme/` (provider, accent context, switches), wire into
   `app/providers.tsx`. Verify light/dark + accent switch on a scratch page.
2. **Primitives** — `shadcn init` (`components.json`), generate the §7 set into
   `components/ui/`; confirm they render on tokens in both themes.
3. **Form engine** — install `zod` + `react-hook-form` + `@hookform/resolvers`;
   build `components/forms/` (`types.ts`, `FormField`, `DynamicForm`,
   `StepDynamicForm`).
4. **Table engine** — install `@tanstack/react-table`; build
   `components/data-table/` + `components/generic/`.
5. **Layout shell** — tokenized dashboard shell (shadcn `sidebar`) + `sonner`
   `Toaster`.
6. **First real migration** — convert one feature (e.g. `stagiaires` or
   `secteurs`) end-to-end as the reference implementation; then migrate the rest
   incrementally.

Legacy `components/UI/`, inline-hex pages, and the temporary auth dev-bypass are
removed as their owning pages are migrated — not in a big-bang pass.
