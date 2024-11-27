FROM node:18
WORKDIR /3team
COPY app/package*.json /3team/app
WORKDIR /3team/app
RUN npm install
WORKDIR /3team
COPY / /3team
WORKDIR /3team/app
ENV PORT 5000
EXPOSE 5000
CMD ["node", "./bin/www.js"]
