const nodemailer = require('nodemailer');
const crypto = require('crypto');
const db = require('../models/index');
const Subscriber = db.subscriber;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        const code = crypto.randomInt(100000, 999999); // 6자리 인증 코드
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15분 후 만료

        // 데이터베이스에 저장
        await Subscriber.update({ verificationCode: code, verificationExpires: expiresAt }, { where: { email } });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: '이메일 인증 코드',
            text: `인증 코드: ${code}`
        });

        res.status(200).send('인증 코드가 이메일로 전송되었습니다.');
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.verifyCode = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        const subscriber = await Subscriber.findOne({ where: { email } });

        if (!subscriber) {
            return res.status(400).send('유효하지 않은 이메일입니다.');
        }

        if (subscriber.verificationCode !== parseInt(verificationCode, 10)) {
            return res.status(400).send('인증 코드가 일치하지 않습니다.');
        }

        if (Date.now() > subscriber.verificationExpires) {
            return res.status(400).send('인증 코드가 만료되었습니다.');
        }

        // 인증 완료
        await Subscriber.update({ verified: true }, { where: { email } });

        res.status(200).send('이메일 인증이 완료되었습니다.');
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};








