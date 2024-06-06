"use strict";

const express = require("express"),
    app = express(),
    path = require('path'),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    subscriberController = require("./controllers/subscriberController"),
    usersController = require("./controllers/usersController"),
    layouts = require("express-ejs-layouts"),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    flash = require('connect-flash'),
    cookieParser = require("cookie-parser"),
    passport = require("passport"),
    bcrypt = require('bcrypt'),
    db = require("./models/index"),
    Sequelize = db.Sequelize,
    Op = Sequelize.Op;

db.sequelize.sync(); // 모델 동기화
const Subscriber = db.subscriber;

app.set("port", process.env.PORT || 80);
app.set("view engine", "ejs"); // 애플리케이션 뷰 엔진을 ejs로 설정
app.set('views', path.join(__dirname, 'views'));
// 정적 뷰 제공
app.use(express.static("public"));
// 레이아웃 설정
//app.use(layouts);

app.use(session({ secret: 'yourSecretKey', resave: false, saveUninitialized: true }));
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});
// 데이터 파싱
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// 라우트 등록
app.get("/subscribers/getSubscriber", subscriberController.getAllSubscribers);
app.get("/subscribers/subscriber", subscriberController.getSubscriptionPage); // 폼 입력이 가능한 웹 페이지 렌더링
app.post("/subscribers/subscribe", subscriberController.saveSubscriber); // 넘겨받은 POST 데이터 저장 및 처리
app.get("/", homeController.showIndex);
app.post("/", usersController.authenticate, usersController.redirectView);
app.get("/userMain", homeController.showIndex2);
app.get("/adminMain", homeController.showIndex3);

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);
app.listen(app.get("port"), () => {
    console.log(`Server running on port: ${app.get("port")}`);
});
