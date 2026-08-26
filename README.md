# Thiscloud Center

This repository is the private, reviewable foundation for Thiscloud Center: a
cross-platform Flutter client backed by a TypeScript modular-monolith API.

## Status

The repository currently contains governance and delivery baselines only. No
application source, package manifest, generated contract, deployment manifest,
or runnable CI/test command has been added yet.

## Planned Shape

- `apps/client/`: Flutter web, mobile, and desktop client.
- `services/api/`: TypeScript API organized by capability-owned modules.
- `contracts/openapi/`: language-neutral API contract.
- `infra/`: deployment and operational configuration, added only with fresh
  validation evidence.

PostgreSQL is planned as the authoritative server database. Client offline
state is planned as encrypted local storage with durable synchronization and
explicit conflict resolution.

## Delivery

Changes use Conventional Commits and feature branches. The planned chain is a
draft tracker followed by immediate-parent child PRs for contracts/tooling,
identity/access, client shell, and sync/MCP/infrastructure. Each child PR must
remain at or below 400 changed lines.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) before preparing a change. Before any
push or publication, the owner must verify that the GitHub repository is
actually private in the repository settings and explicitly authorize the
publication. Security reports belong in [`SECURITY.md`](SECURITY.md).

## Next Step

The next implementation step is to add the first contracts/tooling work unit
with its actual manifests and verification commands.
