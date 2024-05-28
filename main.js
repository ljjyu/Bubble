"use strict";

const express = require("express"),
    app = express(),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    subscriberController = require("./controllers/subscriberController"),
    layouts = require("express-ejs-layouts"),
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
app.get("/join", homeController.showJoinPage);
app.get("/subscribers", subscriberController.getAllSubscribers);
app.get("/", homeController.showIndex);

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);
app.listen(app.get("port"), () => {
    console.log(`Server running on port: ${app.get("port")}`);
});
