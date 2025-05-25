FROM node:22.16.0

RUN apk add --no-cache \
  python3 \
  make \
  g++ \
  bash \
  curl

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-lock.yaml* package.json ./

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
