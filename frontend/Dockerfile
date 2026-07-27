FROM node:20-alpine

WORKDIR /app

# Copy package.json to cache dependency installation
COPY package.json ./

RUN npm install

# Copy application files
COPY . .

EXPOSE 3000

# Start Next.js dev server
CMD ["npm", "run", "dev"]
