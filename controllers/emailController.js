const nodemailer = require('nodemailer');
const crypto = require('crypto');
const db = require('../models/index');
const Subscriber = db.subscriber;

// 이메일 주소와 비밀번호를 코드에 직접 설정합니다.
const EMAIL_USER = 'coin.bubblebubble@gmail.com';
const EMAIL_PASS = 'oepq lqjc chdh hymn'; // 실제 비밀번호를 입력하세요.

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

exports.sendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        const code = crypto.randomInt(100000, 999999); // 6자리 인증 코드
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15분 후 만료

        // 데이터베이스에 저장
        await Subscriber.update(
            { verificationCode: code, verificationExpires: expiresAt },
            { where: { email } }
        );

        await transporter.sendMail({
            from: EMAIL_USER,
            to: email,
            subject: '이메일 인증 코드',
            text: `인증 코드: ${code}`
        });

        res.status(200).send('인증 코드가 이메일로 전송되었습니다.');
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


       










