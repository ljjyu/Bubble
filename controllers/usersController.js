const db = require("../models/index"),
    Subscriber = db.subscriber,
    bcrypt = require('bcrypt');

exports.authenticate = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // 이메일로 사용자 조회
        const user = await Subscriber.findOne({ where: { email: email } });

        // 사용자가 존재하고 비밀번호가 일치하는지 확인
        if (user && await bcrypt.compare(password, user.password)) {
            req.flash("success","logged in successfully!");
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                branchName: user.branchName
            };
            const redirectPath = user.role == 'admin'? 'manager/getMachine':'user/userMachine';
            res.locals.user = req.session.user;
            res.locals.redirect = redirectPath;
        } else {
            req.flash("error", "Your account or password is incorrect. Please try again or contact your system administrator!");
            res.locals.redirect = '/';
        }
        next(); // 다음 미들웨어로 이동
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.redirectView = (req, res) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) {
        res.redirect(redirectPath);
    } else {
        res.status(500).send('No redirect path set');
    }
};
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/');
    });
};
