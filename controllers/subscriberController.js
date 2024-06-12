const db = require("../models/index"),
    Subscriber = db.subscriber,
    Op = db.Sequelize.Op,
    bcrypt = require('bcrypt'),
    saltRounds = 10;

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
        const { name, email, password, role, phoneNumber, cardNumber } = req.body;
        const existingSubscriber = await Subscriber.findOne({where: { email: req.body.email }});
        if (existingSubscriber) {
            res.status(400).send({
                message: "이미 등록된 이메일 주소입니다."
            });
        } else {
            const hashedPassword = await bcrypt.hash(password, saltRounds); // 비밀번호 해싱
            await Subscriber.create({
                name: name,
                email: email,
                password: hashedPassword,
                role: role,
		phoneNumber: phoneNumber,
                cardNumber: cardNumber
            });
            res.redirect("/");
        }
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};
