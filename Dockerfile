FROM node:18
WORKDIR /Bubble
COPY ./app/package*.json /Bubble/app/
WORKDIR /Bubble/app
RUN npm install
WORKDIR /Bubble
COPY . /Bubble/
ENV PORT 5000
EXPOSE 5000
CMD ["npm", "start"]
