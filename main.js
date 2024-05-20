<<<<<<< HEAD
const port = 80, // 포트 번호 지정
    http = require("http"),
    httpStatus = require("http-status-codes"),
    app = http.createServer();


// 애플리케이션 서버가 지정한 포트를 수신하도록 설정
app.listen(port);
console.log(`The server has started and is listening on port number: ${port}`);
=======
"use strict";

const fs = require("fs"),
  port = 80,
  http = require("http"),
  httpStatus = require("http-status-codes"),
  app = http.createServer((request, response) => {
    console.log("Received an incoming request!");
    response.writeHead(httpStatus.OK, {
      "Content-Type": "text/html"
    });
    
    fs.readFile("views/index.html", (error, data) => {
      if (error) {
        response.write("<h1>Sorry, something went wrong!</h1>");
      } else {
        response.write(data);
      }
      response.end();
      console.log(`Sent a response`);
    });
  });

app.listen(port);
console.log(`The server has started and is listening on port number: ${port}`);
>>>>>>> homepage
