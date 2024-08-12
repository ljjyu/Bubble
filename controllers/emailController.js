const nodemailer = require('nodemailer');
const crypto = require('crypto');
const db = require('../models/index');
const Subscriber = db.subscriber;

// 이메일 주소와 비밀번호를 코드에 직접 설정합니다.
const EMAIL_USER = 'coin.bubblebubble@gmail.com';
const EMAIL_PASS = 'oepq lqjc chdh '; // 실제 비밀번호를 입력하세요.

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

        // 데이터베이스에 이메일이 존재하지 않으면 새로 추가
        const [subscriber, created] = await Subscriber.findOrCreate({
            where: { email },
            defaults: {
                verificationCode: code,
                verificationExpires: expiresAt
            }
        });

        if (!created) {
            // 기존 이메일의 경우, 인증 코드와 만료일 업데이트
            await Subscriber.update(
                { verificationCode: code, verificationExpires: expiresAt },
                { where: { email } }
            );
        }

        // 인증 코드 전송
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

exports.verifyCode = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        // 이메일이 데이터베이스에 존재하는지 확인
        const subscriber = await Subscriber.findOne({ where: { email } });

        if (!subscriber) {
            return res.status(400).send('유효하지 않은 이메일입니다.');
        }

        // 인증 코드 및 만료일 확인
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










