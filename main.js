"use strict";

const fs = require("fs"),
  port = 80,
  http = require("http"),
  httpStatus = require("http-status-codes"),
  router = require("./router"),
  plainTextContentType = {
    "Content-Type":"text/plain"
  },
  htmlContentType = {
    "Content-Type":"text/html"
  },
  customReadFile = (file, res) => {
    fs.readFile(`./${file}`, (errors, data) => {
          if (errors) {
            console.log("Error reading the file...");
          }
          res.end(data);
    });
  };
router.get("/", (req, res) => {
    res.writeHead(httpStatus.OK, htmlContentType);
    customReadFile("views/userHome.html", res);
});
/*router.get("/userMain", (req, res) => {
  res.writeHead(httpStatus.OK, htmlContentType);
  customReadFile("views/userMain.html", res);
<<<<<<< HEAD
});
=======
});*/

>>>>>>> 8b9cb3bed2ac370d6e45393ac39de0ca9959ddca
http.createServer(router.handle).listen(port);
console.log(`The server has started and is listening on port number: ${port}`);
