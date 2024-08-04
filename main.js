"use strict";

const express = require("express"),
    app = express(),
    path = require('path'),
    moment = require('moment'),
    homeController = require("./controllers/homeController"), // 메인 로그인
    errorController = require("./controllers/errorController"), // 에러 관련
    subscriberController = require("./controllers/subscriberController"), // 회원가입 및 회원 정보
    machineController = require("./controllers/machineController"),
    reservationController = require("./controllers/reservationController"),
    userHomeController = require("./controllers/userHomeController"),
    userMachineController = require("./controllers/userMachineController"),
    weatherController = require("./controllers/weatherController"),
    statisticController = require("./controllers/statisticController"),
    noticeController = require("./controllers/noticeController"),
    showNoticeController = require("./controllers/showNoticeController"),
    usersController = require("./controllers/usersController"), // 로그인 인증 및 로그아웃
    reviewsController = require("./controllers/reviewsController"), // 리뷰
    userUsingController = require("./controllers/userUsingController"), //잔여 시간 관련
    branchController = require("./controllers/branchController"), // 빨래방 지점
    newsController = require("./controllers/newsController"), //news
    myPageController = require("./controllers/myPageController"), // myPage
    passwordController = require("./controllers/passwordController"), //password
    passwordRoutes = require('./routes/passwordRoutes'), //password
    layouts = require("express-ejs-layouts"),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    flash = require('connect-flash'),
    cookieParser = require("cookie-parser"),
    passport = require("passport"),
    bcrypt = require('bcrypt'),
    db = require("./models/index"),
    Sequelize = db.Sequelize,
    axios = require('axios'), //news
    cheerio = require('cheerio'), //news
    Op = Sequelize.Op;

db.sequelize.sync(); // 모델동기화
const Subscriber = db.subscriber;
const Machine = db.machine;
const Reservation = db.reservation;

app.set("port", process.env.PORT || 80);
app.set("view engine", "ejs"); // 애플리케이션 뷰 엔진을 ejs로 설정
app.set('views', path.join(__dirname, 'views'));
// 정적 뷰 제공
app.use(express.static("public"));
// 레이아웃 설정
app.use(layouts);
// 데이터 파싱
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }  // 세션 유지 시간 설정 (밀리초 단위)
 }));
app.use(flash());
app.locals.moment = moment;

app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    } else {
        res.locals.user = null;
    }
    res.locals.messages = req.flash();
    next();
});

app.use(bodyParser.json()); //password
app.use(bodyParser.urlencoded({ extended: false })); //password

// 라우트 등록
app.get("/subscribers/getSubscriber", subscriberController.getAllSubscribers);
app.get("/subscribers/subscriber", subscriberController.getSubscriptionPage); // 폼 입력이 가능한 웹 페이지 렌더링
app.post("/subscribers/subscriber", subscriberController.saveSubscriber); // 넘겨받은 POST 데이터 저장 및 처리
app.get("/subscribers/verify", subscriberController.getVerificationPage); // 이메일 인증 페이지 렌더링
app.post("/subscribers/verify", subscriberController.verifySubscriber); // 이메일 인증 코드 검증

app.post('/logout', usersController.logout);
app.post('/deleteAccount', usersController.deleteAccount);

app.post("/reservations", reservationController.createReservation);

app.get("/user/userHome", userHomeController.getUserReservations);
app.get("/user/userReserve", reservationController.getAllReservations);
app.get("/user/userUsing", userUsingController.getUserUsingPage);
app.get("/user/userMachine",userMachineController.getUserMachines);

app.get("/manager/getMachine",machineController.getAllMachines);
app.get("/manager/getReservation",reservationController.getAllReservations);
app.get("/manager/getStatistic", statisticController.getAllStatistics);
app.get('/manager/getNotice', noticeController.getNoticePage);
app.post('/manager/getNotice', noticeController.createNotice);

app.get("/reviews/getReviews", reviewsController.getAllReviews);
app.post("/reviews/getReviews/favorites", reviewsController.addFavorites);
app.get("/reviews/writeReviews", reviewsController.getReviewsPage);
app.post("/reviews/writeReviews", reviewsController.saveReviews);

app.get('/showNotice', showNoticeController.getAllNotices);
app.use("/getWeather", weatherController);
app.use("/getNews", newsController); //news
app.use('/password', passwordRoutes); //password
app.get("/myPage", myPageController.getAllMyPage);

app.get('/user/getBranches', branchController.getBranches);
app.post('/user/userReserve', reservationController.createReservation);

app.get("/", homeController.showIndex);
app.post("/", usersController.authenticate, usersController.redirectView);

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
    console.log(`Server running on port: ${app.get("port")}`);
});
