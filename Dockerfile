FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# package-lock.json is intentionally optional for this starter.
# This avoids Docker build failures when the project is shared without a lockfile.
COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
