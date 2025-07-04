# 1. Base image
FROM node:18-alpine

# 2. Create app directory
WORKDIR /app

# 3. Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# 4. Copy source
COPY . .

# 5. Expose the port your Express server listens on
EXPOSE 5000

# 6. Run the app
CMD ["npm", "start"]
