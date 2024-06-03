const db = require("../models/index"),
    Subscriber = db.subscriber,
    Op = db.Sequelize.Op,
    bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 이메일로 사용자 조회
        const user = await Subscriber.findOne({ where: { email } });

        // 사용자가 존재하고 비밀번호가 일치하는지 확인
        if (user && user.password === req.body.password) {
            // 인증 성공 시 세션에 사용자 정보 저장
            req.session.user = {
                id: user.id,
                email: user.email
                // 필요한 사용자 정보 추가
            };
            res.redirect('/userMain'); // 사용자 메인 페이지로 리다이렉트
        } else {
            res.send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
};