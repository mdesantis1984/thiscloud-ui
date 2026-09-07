FROM node:22.23.2-bookworm-slim AS build

WORKDIR /workspace
RUN npm install --global pnpm@11.13.1

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ui-web/package.json packages/ui-web/package.json
RUN pnpm install --frozen-lockfile

COPY apps/catalog apps/catalog
COPY deploy deploy
COPY Dockerfile Dockerfile
COPY packages/ui-web packages/ui-web
COPY scripts scripts
RUN pnpm release:prepare && pnpm release:verify

FROM nginxinc/nginx-unprivileged:1.29.4-alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=101:101 /workspace/apps/catalog/dist/ /usr/share/nginx/html/

USER 101:101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --output-document=- http://127.0.0.1:8080/healthz || exit 1
