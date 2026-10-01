## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## gstack Engineering Guidelines

gstack development rules (https://github.com/garrytan/gstack) are enabled for this project.

### Ethos
- **Boil the Ocean**: AI makes completeness cheap, so do the complete thing: tests, edge cases, error paths, responsive layouts, accessibility. Shortcuts need an explicit, recorded decision.
- **Search Before Building**: Know what exists before deciding what to build. Don't reinvent; use tried-and-true patterns and prize first-principles insight.
- **User Sovereignty**: Recommend proactively, but the user decides. Cross-model agreement is signal, never permission.
- **Build for Real Use**: The specificity of a real problem beats the generality of a hypothetical one.

### The Reuse Ladder
Before writing new code or adding dependencies, stop at the first rung that holds:
1. A helper, util, or pattern already in this repo.
2. The standard library / native Web APIs.
3. A native platform feature (CSS over JS, semantic HTML, Astro SSR/static).
4. An already-installed dependency (Tailwind v4, Astro) — never add a new dependency for what a few lines cover.

### Voice & Execution
Direct, concrete, builder-to-builder. Name the file, function, command, and user-visible impact. Short paragraphs; end with what to do next. No AI filler or corporate fluff.

## Skills

Invoke a skill only when the task genuinely matches its specialty. Default to built-in judgment; never load skill personas speculatively.



