"use strict";

const express = require("express"),
    app = express(),
    path = require('path'),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    layouts = require("express-ejs-layouts"),
    //db = require("./models/index"),
    //Sequelize = db.Sequelize,
    //Op = Sequelize.Op;
    app.set("port", process.env.PORT || 80);
app.set("view engine", "ejs"); // 애플리케이션 뷰 엔진을 ejs로 설정
app.set('views', path.join(__dirname, 'views'));
// 정적 뷰 제공
app.use(express.static("public"));
// 레이아웃 설정
//app.use(layouts);
// 데이터 파싱
app.use(
    express.urlencoded({
        extended:false
    })
);
app.use(express.json());

// 라우트 등록
app.get("/userHome", homeController.showIndex);
app.get("/userMain", homeController.showIndex1);
app.get("/userReserve", homeController.showIndex2);

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);
app.listen(app.get("port"), () => {
    console.log(`Server running on port: ${app.get("port")}`);
});


/*
router.get("/", (req, res) => {
    res.writeHead(httpStatus.OK, htmlContentType);
    customReadFile("views/userHome.html", res);
});
router.get("/userMain", (req, res) => {
  res.writeHead(httpStatus.OK, htmlContentType);
  customReadFile("views/userMain.html", res);
});
router.get("/userReserve", (req, res) => {
  res.writeHead(httpStatus.OK, htmlContentType);
  customReadFile("views/userReserve.html", res);
});
>>>>>>> 8b9cb3bed2ac370d6e45393ac39de0ca9959ddca*/


