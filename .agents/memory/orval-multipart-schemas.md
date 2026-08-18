---
name: Orval multipart schemas
description: Workspace-specific codegen behavior for multipart request bodies and Zod libraries.
---

For multipart request bodies, define a named OpenAPI component and reference it from the operation instead of leaving the schema inline. The generated Zod package can otherwise export the same body name from both its endpoint schema and type schema. The Zod library also needs DOM types available when generated schemas use `File` or `Blob`.

**Why:** The workspace uses Orval with separate React client and Zod outputs; multipart generation exercises browser file types even though the server package runs on Node.

**How to apply:** When adding a multipart endpoint, use a named request component in `lib/api-spec/openapi.yaml`, keep the Zod package's DOM lib enabled, and run API codegen followed by the workspace typecheck.