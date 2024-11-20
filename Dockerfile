FROM node:10.19.0
RUN apt-get update && apt-get -y install build-essential && mkdir -p /app
COPY . /app/
WORKDIR /app/
RUN npm install
CMD ["npm", "start"]
