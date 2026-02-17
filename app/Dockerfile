FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Expose ports
EXPOSE 3000
EXPOSE 24678

# Start dev server
CMD ["npm", "run", "dev"]
