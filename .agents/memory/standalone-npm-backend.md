---
name: Standalone npm backend
description: Constraints when running the API server package independently with npm inside the pnpm workspace.
---

The API server is also expected to run as a standalone npm package. npm cannot resolve pnpm-only `workspace:` or `catalog:` dependency protocols, and the existing build/logging dependency tree may require legacy peer resolution and skipped package lifecycle hooks in this environment.

**Why:** The project is a pnpm monorepo, but users may invoke `npm install` and `npm start` from the backend directory.

**How to apply:** Keep the backend package's direct dependencies npm-compatible, keep the npm-specific install behavior scoped to the backend package, and verify a clean `npm install` followed by `npm start` without changing the API routes.