const express = require("express");
const app = express();
const path = require('path');
const moment = require('moment');
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscriberController = require("./controllers/subscriberController");
const emailController = require("./controllers/emailController");
const machineController = require("./controllers/machineController");
const reservationController = require("./controllers/reservationController");
const userHomeController = require("./controllers/userHomeController");
const userMachineController = require("./controllers/userMachineController");
const weatherController = require("./controllers/weatherController");
const statisticController = require("./controllers/statisticController");
const noticeController = require("./controllers/noticeController");
const showNoticeController = require("./controllers/showNoticeController");
const usersController = require("./controllers/usersController");
const reviewsController = require("./controllers/reviewsController");
const userUsingController = require("./controllers/userUsingController");
const branchController = require("./controllers/branchController");
const newsController = require("./controllers/newsController");
const myPageController = require("./controllers/myPageController");
const passwordController = require("./controllers/passwordController");
const passwordRoutes = require('./routes/passwordRoutes');
const emailRoutes = require('./routes/emailRoutes');
const layouts = require("express-ejs-layouts");
const session = require('express-session');
const flash = require('connect-flash');
const db = require("./models/index");

const Subscriber = db.subscriber;
const TempSubscriber = db.tempSubscriber;
const Machine = db.machine;
const Reservation = db.reservation;

// 데이터베이스 동기화
db.sequelize.sync({ alter: true }) // 데이터베이스 스키마 업데이트
    .then(() => {
        console.log("Database synchronized");
    })
    .catch(err => {
        console.error("Error syncing database:", err);
    });

app.set("port", process.env.PORT || 80);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 제공
app.use(express.static("public"));
// 레이아웃 설정
app.use(layouts);
// 데이터 파싱
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }
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

// 라우트 등록
app.use('/email', emailRoutes);

app.get("/subscribers/getSubscriber", subscriberController.getAllSubscribers);
app.get("/subscribers/subscriber", subscriberController.getSubscriptionPage);
app.post("/subscribers/subscriber", subscriberController.saveSubscriber);

app.post('/send-verification-code', emailController.sendVerificationCode);
app.post('/verify-code', emailController.verifyCode);
app.get('/verification', (req, res) => res.render('verification'));

app.post('/logout', usersController.logout);
app.post('/deleteAccount', usersController.deleteAccount);

app.post("/reservations", reservationController.createReservation);

app.get("/user/userHome", userHomeController.getUserReservations);
app.get("/user/userReserve", reservationController.getAllReservations);
app.get("/user/userUsing", userUsingController.getUserUsingPage);
app.get("/user/userMachine", userMachineController.getUserMachines);

app.get("/manager/getMachine", machineController.getAllMachines);
app.get("/manager/getReservation", reservationController.getAllReservations);
app.get("/manager/getStatistic", statisticController.getAllStatistics);
app.get('/manager/getNotice', noticeController.getNoticePage);
app.post('/manager/getNotice', noticeController.createNotice);

app.get("/reviews/getReviews", reviewsController.getAllReviews);
app.post("/reviews/getReviews/favorites", reviewsController.addFavorites);
app.get("/reviews/writeReviews", reviewsController.getReviewsPage);
app.post("/reviews/writeReviews", reviewsController.saveReviews);

app.get('/showNotice', showNoticeController.getAllNotices);
app.use("/getWeather", weatherController);
app.use("/getNews", newsController);
app.use('/password', passwordRoutes);
app.get("/myPage", myPageController.getAllMyPage);
app.get("/myPage/getMyFavorites", myPageController.getALLMyFavorites);

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




