# Use the official Node.js 18 image
FROM node:18
WORKDIR /Bubble/app
COPY app/package*.json /Bubble/app/
RUN npm install
COPY . /Bubble/
ENV PORT 5000
EXPOSE 5000
CMD ["npm", "start"]
