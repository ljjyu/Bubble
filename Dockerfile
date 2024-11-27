# Use the official Node.js 18 image
FROM node:18
# Set the working directory in the container
WORKDIR /Bubble
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install dependencies
RUN npm install
COPY . .
WORKDIR /Bubble/app
ENV PORT 5000
EXPOSE 5000
CMD ["npm", "start"]
