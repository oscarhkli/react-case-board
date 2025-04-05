# --- Build Stage ---
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

ARG REACT_APP_BACKEND_URL=http://localhost:61001
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL} 

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Run build (this will use .env.production during the build process)
RUN npm run build

# --- Serve Stage ---
FROM nginx:alpine

# Copy the build from the build stage to nginx's directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose the default port for nginx
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]