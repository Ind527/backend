# SA Media Backend

REST API backend untuk mengelola produk, konten, creator, dan upload video SA Media melalui Supabase.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `npm start` — run the API server from `artifacts/api-server` after dependencies are installed
- `npm run dev` — build and run the API server in development mode from `artifacts/api-server`
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `SUPABASE_URL` and `SUPABASE_SECRET_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/api-server/src/services/supabase.ts` — server-only Supabase client
- `artifacts/api-server/src/routes/` — health, products, contents, creators, and video upload routes
- `artifacts/api-server/README.md` — local setup, environment variables, endpoint list, and curl examples
- `lib/api-spec/openapi.yaml` — API contract source of truth

## Architecture decisions

- Supabase is accessed only from the Express server with `SUPABASE_SECRET_KEY`; the key is never exposed to API responses.
- Existing Supabase tables and Storage bucket are consumed as-is; this project does not create migrations.
- Video uploads use in-memory multipart handling, unique Storage paths, and `upsert: false` so previous files are retained.
- The API remains under the existing `/api` proxy path and keeps `/api/healthz` as a workflow-compatible alias.

## Product

SA Media's backend exposes REST endpoints for reading products, reading and creating scheduled content, managing creators, and uploading video files to Supabase Storage.

## User preferences

- Backend only; do not add frontend, dashboard, React, or UI.
- Do not alter existing Supabase tables or add SQL migrations.

## Gotchas

- `SUPABASE_SECRET_KEY` must remain a Replit Secret or server environment variable. Never put it in `.env` committed to source control.
- `publicUrl` from the upload response is directly usable only when the Supabase `videos` bucket is public; the response always includes the Storage path as well.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
