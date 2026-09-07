# Migration

No consumer migration is required for the initial `0.1.0` package shell. It exposes no runtime API and remains private.

## Planned adoption order

1. Add the package through the monorepo path `../../packages/ui_kit`.
2. Install the approved theme, localization delegate, and scoped UI host after those APIs exist.
3. Replace presentation seams incrementally while retaining consumer-owned state and policy.
4. Remove temporary adapters only after parity checks pass and no direct users remain.

During `0.x`, breaking public API changes occur only in a documented minor release. Stable APIs receive at least one minor release and 30 days of deprecation before removal, except for urgent security or legal removal.

Publication and `1.0.0` remain blocked until the approved consumer, API, accessibility, platform, legal, and documentation gates are complete.
