FROM node:22.16.0

RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  bash \
  curl \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-lock.yaml* package.json ./
COPY .pnpmfile.cjs ./

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
