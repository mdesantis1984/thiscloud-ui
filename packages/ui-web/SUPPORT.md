# Support boundary

The automated release evidence is the packed-browser suite on Chromium. Consumers must provide and validate Custom Elements, Shadow DOM, form-associated custom elements, and `ElementInternals` support in their browser or hybrid WebView.

Hybrid WebView consumers must validate their target runtime. This RC does not claim universal browser support, a tested WebView matrix, native Flutter support, manual assistive-technology testing, service-level support, or public registry availability. It follows SemVer: after 1.0, incompatible public API changes require a major version; before 1.0, breaking RC changes are documented in `MIGRATION.md`. Deprecated public APIs receive a documented replacement and removal version when one exists. There is no prior public release or migration path.

Report reproducible package and Chromium test failures with the browser/runtime version and a minimal consumer page.
