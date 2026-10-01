---
name: astro-docs
description: Official Astro documentation search and workflow skill. Use whenever designing, creating, refactoring, or troubleshooting Astro pages, components, content collections, endpoints, or configurations using the astro-docs MCP server.
---

# Astro Documentation & Development Skill

This skill guides building, creating, and updating features in Astro projects by leveraging the live official Astro documentation via the `astro-docs` MCP server.

## When to Use

Activate this skill when:
- Creating or editing Astro components (`.astro`), layouts, or pages (`src/pages/`).
- Configuring `astro.config.mjs` (integrations, adapters, Vite options, SSR).
- Managing Content Collections (`src/content/config.ts`).
- Implementing client hydration directives (`client:load`, `client:idle`, `client:visible`, etc.).
- Creating server endpoints, API routes, or dynamic routing (`[...slug]`).
- Debugging Astro build errors or troubleshooting SSR / hybrid rendering.

## Using the `astro-docs` MCP Server

When you need verified syntax, current API parameters, or best practices from the Astro documentation:

1. Use the `search_astro_docs` tool provided by the `astro-docs` MCP server.
2. Query specific terms (e.g., `content collections`, `middleware`, `view transitions`, `hybrid rendering`).
3. Verify version compatibility and apply official recommendations directly to the code.

## Key Astro Best Practices to Follow

1. **Component Anatomy**:
   - Keep component script frontmatter (`--- ... ---`) clean and type-safe.
   - Use Astro props interface (`interface Props { ... }`) with `Astro.props`.
2. **Minimal Client JavaScript**:
   - Default to zero JavaScript (static HTML).
   - Only add `client:*` directives to UI framework components when interactivity is strictly required.
3. **Styling & Assets**:
   - Use scoped `<style>` or project CSS frameworks (e.g., Tailwind CSS v4).
   - Use `<Image />` component from `astro:assets` for responsive, optimized imagery.
4. **Layouts & Slots**:
   - Structure templates with clear `<slot />` and named slots where applicable.
