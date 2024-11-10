FROM node:10.19.0
RUN apt-get update && apt-get -y install build-essential && mkdir -p /app && npm install
COPY . /app/
WORKDIR /app/
CMD ["npm", "start", "make"]
