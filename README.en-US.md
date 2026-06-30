# H5 App

Mobile H5 application built with React 19, TypeScript 6, Vite 8, React Router 7, antd-mobile, and Zustand.

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build:dev
pnpm build:test
pnpm build:pro
```

## Checks

```bash
pnpm lint
pnpm typecheck
```

## Structure

```text
src/
├── api/          # API definitions
├── components/   # Shared components
├── hooks/        # Shared hooks
├── router/       # Router config
├── services/     # Request layer
├── store/        # State management
├── styles/       # Global styles
├── types/        # Type declarations
├── utils/        # Utilities
└── views/        # Pages
```

## Environment

- `.env`
- `.env.dev`
- `.env.test`
- `.env.pro`

Frontend environment variables use the `VITE_` prefix.
