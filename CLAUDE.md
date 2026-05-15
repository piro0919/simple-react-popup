# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**simple-react-popup** is a headless, compound React component for popups/modals. v1.0.0 is a full rewrite of the legacy (2018) class-component, jQuery-based implementation.

- **npm package:** simple-react-popup
- **Demo site:** <https://simple-react-popup.kkweb.io> (Next.js App Router app under `src/app/`, deployed via Vercel)

## Tech Stack

- React 19 (peers: React 18 & 19)
- TypeScript 5
- Next.js 16 (App Router) — demo site only
- tsup — library build (ESM + CJS + .d.ts)
- Vitest + @testing-library/react + jsdom — tests
- ESLint flat config + Prettier
- Lefthook — pre-commit hooks
- Renovate — automated dependency updates
- React Compiler (demo only) — automatic memoization

## Project Structure

```text
src/
├── index.ts                                  # npm package entry point
├── components/SimpleReactPopup/              # Library implementation
│   ├── index.ts
│   ├── SimpleReactPopup.tsx                  # Compound root + Trigger/Content/Close
│   └── context.ts                            # Internal React Context
└── app/                                      # Next.js App Router (demo site)
    ├── layout.tsx
    ├── page.tsx
    └── globals.css

tests/SimpleReactPopup.test.tsx               # Vitest suite
public/icon.svg                               # Favicon for the demo
dist/                                         # Built library output (gitignored)
```

## Commands

```bash
pnpm dev              # Start Next.js dev server (demo)
pnpm build            # Build Next.js demo site
pnpm start            # Run built Next.js demo
pnpm build:lib        # Build npm package with tsup
pnpm build:lib:watch  # tsup --watch
pnpm test             # Run Vitest once
pnpm test:watch       # Run Vitest in watch mode
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit
pnpm prepublishOnly   # lint + typecheck + test + build:lib (auto-run on publish)
```

## Public API

The package exports a single compound component with three subcomponents:

```tsx
<SimpleReactPopup defaultOpen={false} open={open} onOpenChange={setOpen}>
  <SimpleReactPopup.Trigger>
    <button>open</button>
  </SimpleReactPopup.Trigger>
  <SimpleReactPopup.Content
    className="..."
    overlayClassName="..."
    closeOnOverlayClick={true}
    closeOnEsc={true}
    lockScroll={true}
  >
    <div>body</div>
    <SimpleReactPopup.Close>
      <button>close</button>
    </SimpleReactPopup.Close>
  </SimpleReactPopup.Content>
</SimpleReactPopup>
```

- Uncontrolled (`defaultOpen`) and controlled (`open` + `onOpenChange`) both supported.
- `Trigger` and `Close` clone their single child and inject click handlers + ARIA props.
- `Content` renders into `document.body` via `createPortal`. Exposes `data-state="open" | "closed"` for CSS transitions.
- Accessibility: `role="dialog"`, `aria-modal`, focus trap, ESC handling, body scroll lock.

## Key Files

- `src/components/SimpleReactPopup/SimpleReactPopup.tsx` — main implementation (marked `"use client"`).
- `src/components/SimpleReactPopup/context.ts` — internal context + `usePopupContext` guard.
- `tsconfig.json` — full TS config used by Next.js dev/build and tsc typechecking.
- `tsconfig.build.json` — tsup-only config; restricts inputs to `src/index.ts` + `src/components/**`.
- `tsup.config.ts` — emits `dist/index.js` (ESM), `dist/index.cjs` (CJS), and `.d.ts`.
- `next.config.ts` — Next.js config (React Compiler + Turbopack).

## Publishing Notes

- `files: ["dist", "README.md", "LICENSE"]` — the Next.js demo is **not** published to npm.
- `prepublishOnly` enforces full verification before publish.
- Major version starts at **1.0.0** (the legacy 0.x line is intentionally broken; APIs differ).
