FROM node:22-alpine AS build

WORKDIR /workspace/web

COPY web/package.json ./package.json
RUN npm install

COPY web/ ./
COPY db/ ../db/

ARG VITE_API_BASE_URL=http://localhost:8181
ARG VITE_SITE_URL=https://patrickfanella.co
ARG VITE_ANALYTICS_PLAUSIBLE_DOMAIN=
ARG VITE_ANALYTICS_PLAUSIBLE_SCRIPT_URL=https://plausible.io/js/script.file-downloads.outbound-links.js

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_SITE_URL=${VITE_SITE_URL}
ENV VITE_ANALYTICS_PLAUSIBLE_DOMAIN=${VITE_ANALYTICS_PLAUSIBLE_DOMAIN}
ENV VITE_ANALYTICS_PLAUSIBLE_SCRIPT_URL=${VITE_ANALYTICS_PLAUSIBLE_SCRIPT_URL}

RUN npm run build

FROM nginx:1.27-alpine

COPY web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/web/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --retries=5 CMD wget -q -O - http://127.0.0.1/healthz >/dev/null 2>&1 || exit 1
