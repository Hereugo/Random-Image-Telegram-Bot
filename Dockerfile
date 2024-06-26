FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ./package*.json ./
RUN npm install

# Bundle app source
COPY ./src ./src
COPY ./public ./public
