# cEDH Analytics - A website that analyzes and cross-references several
# EDH (Magic: The Gathering format) community's resources to give insights
# on the competitive metagame.
# Copyright (C) 2025-present CoCoCov
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
# Original Repo: https://github.com/cococov/cedh-analytics
# https://www.cedh-analytics.com/

FROM node:24.3.0 AS base

FROM base AS dependencies
WORKDIR /app
COPY pnpm-lock.yaml* package.json .npmrc* ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

FROM base AS tester
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN corepack enable && corepack prepare pnpm@latest --activate
# Run tests and fail the build if tests fail
RUN pnpm test

FROM base AS builder
WORKDIR /app
# Copy node_modules and source code from the tester stage (which has passed tests)
COPY --from=tester /app/node_modules ./node_modules
COPY --from=tester /app ./
ENV NODE_ENV=production
ENV DOCKER_BUILD=true
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 999 nodejs
RUN adduser --system --uid 999 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
