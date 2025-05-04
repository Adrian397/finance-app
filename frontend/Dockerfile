FROM node:18

WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of source
COPY . .

# Expose Vite dev server
EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]