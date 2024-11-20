FROM node:18
RUN apt-get update && apt-get -y install build-essential && mkdir -p /app
COPY . /app/
WORKDIR /app/
RUN npm install
CMD ["npm", "start"]
