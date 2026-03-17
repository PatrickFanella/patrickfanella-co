# Frontend workspace

The portfolio frontend is a Vite + React + TypeScript app.

## Runtime API configuration

- `VITE_API_BASE_URL` is read from the workspace root `.env` because `vite.config.ts` sets `envDir: '..'`.
- If the variable is omitted, the frontend falls back to `http://localhost:8080` for local development.

## Shared API client

`src/lib/api.ts` is the shared client layer for:

- project list requests
- project detail requests
- contact submissions

It centralizes:

- API base URL handling
- JSON parsing
- normalized error objects with codes, messages, and field errors

## Commands

- `npm run dev` — start the frontend dev server
- `npm run build` — type-check and build the frontend
- `npm run lint` — run ESLint
- `npm run test` — run frontend unit tests
