"use strict";

const express = require("express"),
    app = express(),
    path = require('path'),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    subscriberController = require("./controllers/subscriberController"),
    layouts = require("express-ejs-layouts"),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    flash = require('connect-flash'),
    db = require("./models/index"),
    Sequelize = db.Sequelize,
    Op = Sequelize.Op;

db.sequelize.sync(); // 모델 동기화
const Subscriber = db.subscriber;
let test_create = async () => {
    try {
        await Subscriber.bulkCreate([
            {
                name: "Jon",
                email: "jon@naver.com"
            }, {
                name: "Min",
                email: "min@gamil.com"
            }
        ]);
    } catch (err) {
        console.error("Error creating subscribers:", err);
    }
};
// SELECT
let test_find = async () => {
    try {
        let myQuery = await Subscriber.findAll({
            where: { name: "Jon", email: {[Op.like]: "%naver%"}}
        });
        console.log(myQuery);
    } catch (err) {
        console.error("Error finding subscribers:", err);
    }
}
let test = async () => {
    await test_create();
    await test_find();
}
test();

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
app.get("/subscribers/getSubscriber", subscriberController.getAllSubscribers);
app.get("/subscribers/subscriber", subscriberController.getSubscriptionPage); // 폼 입력이 가능한 웹 페이지 렌더링
app.post("/subscribers/subscribe", subscriberController.saveSubscriber); // 넘겨받은 POST 데이터 저장 및 처리
app.get("/", homeController.showIndex);
app.post("/", homeController.authenticate, homeController.redirectView);
//app.get("/", homeController.logout, homeController.redirectView);

//app.get("/:id/edit", homeController.edit);
//app.post("/:id/update", homeController.update, homeController.redirectView);
//app.get("/:id", homeController.show, homeController.showView);
//app.post("/:id/delete", homeController.delete, homeController.redirectView);

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);
app.listen(app.get("port"), () => {
    console.log(`Server running on port: ${app.get("port")}`);
});
