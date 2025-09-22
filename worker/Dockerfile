FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* ./
RUN if [ -f pnpm-lock.yaml ]; then corepack enable && corepack prepare pnpm@9.7.0 --activate && pnpm i;     elif [ -f yarn.lock ]; then yarn;     else npm i; fi
COPY . .
CMD [ "npm", "run", "start:dev" ]
