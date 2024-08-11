const db = require('../models/index');
const Subscriber = db.subscriber;
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const generateVerificationCode = () => {
    return crypto.randomInt(100000, 999999).toString();
};

exports.sendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;

        // 이메일이 등록되어 있는지 확인
        const subscriber = await Subscriber.findOne({ where: { email } });

        if (!subscriber) {
            return res.status(400).send({ message: "해당 이메일로 가입된 계정이 없습니다." });
        }

        // 이미 인증된 이메일에 대해 코드 요청 시 처리
        if (subscriber.isVerified) {
            return res.status(400).send({ message: "이미 인증된 이메일입니다." });
        }

        // 생성된 인증 코드
        const verificationCode = generateVerificationCode();

        // 인증 코드와 이메일을 설정
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '회원가입 이메일 인증 코드',
            text: `인증 코드: ${verificationCode}`
        };

        // 이메일 전송
        await transporter.sendMail(mailOptions);

        // 인증 코드를 데이터베이스에 저장
        await Subscriber.update(
            { verificationCode },
            { where: { email } }
        );

        res.status(200).send('인증 코드가 이메일로 전송되었습니다.');
    } catch (err) {
        console.error('인증 코드 전송 중 오류 발생:', err);
        res.status(500).send({ message: err.message });
    }
};

exports.verifyCode = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        const subscriber = await Subscriber.findOne({ where: { email } });

        if (!subscriber) {
            return res.status(400).send({ message: "해당 이메일로 가입된 계정이 없습니다." });
        }

        if (subscriber.verificationCode !== verificationCode) {
            return res.status(400).send({ message: "잘못된 인증 코드입니다." });
        }

        await Subscriber.update(
            { isVerified: true, verificationCode: null },
            { where: { email } }
        );

        res.status(200).send('인증이 성공적으로 완료되었습니다.');
    } catch (err) {
        console.error('인증 코드 검증 중 오류 발생:', err);
        res.status(500).send({ message: err.message });
    }
};


