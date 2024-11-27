# Use the official Node.js 18 image
FROM node:18
WORKDIR /Bubble
# Copy package.json and package-lock.json to the working directory
COPY . /Bubble
WORKDIR /Bubble/app
# Install dependencies
RUN npm install
ENV PORT 5000
EXPOSE 5000
CMD ["npm", "start"]
