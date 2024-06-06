const db = require("../models/index"),
    Subscriber = db.subscriber,
    Op = db.Sequelize.Op,
    bcrypt = require('bcrypt');

exports.authenticate = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 이메일로 사용자 조회
        const user = await Subscriber.findOne({ where: { email: email } });

        // 사용자가 존재하고 비밀번호가 일치하는지 확인
        if (user && await bcrypt.compare(password, user.password)) {
            req.flash("logged in successfully!");
            res.locals.user = user;
            res.redirect('/userMain'); // 사용자 메인 페이지로 리다이렉트
        } else {
            req.flash("error", "Your account or password is incorrect. Please try again or contact your system administrator!");
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
};