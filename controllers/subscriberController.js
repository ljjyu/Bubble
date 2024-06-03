const db = require("../models/index"),
    Subscriber = db.subscriber,
    Op = db.Sequelize.Op;

exports.getAllSubscribers = async (req, res) => {
    try {
        data = await Subscriber.findAll();
        console.log(data);
        res.render("subscribers/getSubscriber", {subscribers: data});
    } catch (err) {
        res.status(500).send({
        message: err.message
        });
    }
};
// 폼 입력이 가능한 웹 페이지 렌더링
exports.getSubscriptionPage = (req, res) => {
    res.render("subscribers/subscriber");
};
// 넘겨받은 POST 데이터 저장 및 처리
exports.saveSubscriber = async (req, res) => {
    try {
        await Subscriber.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            cardNumber: req.body.cardNumber
        });
        res.render("subscribers/subscribe");
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};