# Use the official Node.js 18 image
FROM node:18
# Set the working directory in the container
WORKDIR /Bubble
# Copy package.json and package-lock.json to the working directory
COPY app/package*.json /Bubble/app/
WORKDIR /Bubble/app
# Install dependencies
RUN npm install
# Copy the application code to the working directory
WORKDIR /Bubble
COPY ./app /Bubble/app
WORKDIR /Bubble/app
ENV PORT 5000
EXPOSE 5000
CMD ["node", "./bin/www.js"]
