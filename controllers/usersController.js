const db = require("../models/index"),
    Subscriber = db.subscriber,
    Op = db.Sequelize.Op,
    bcrypt = require('bcrypt');

exports.authenticate = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 이메일로 사용자 조회
        const user = await Subscriber.findOne({ where: { email:req.body.email } });

        // 사용자가 존재하고 비밀번호가 일치하는지 확인
        if (user && user.password === req.body.password) {
            req.flash("logged in successfully!");
            res.locals.redirect('/userMain'); // 사용자 메인 페이지로 리다이렉트
            res.locals.user = user;
        } else {
            req.flash("error", "Your account or password is incorrect. Please try again or contact your system administrator!");
            res.locals.redirect('/');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
};